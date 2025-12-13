package ai

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"strings"
	"time"

	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type AskAiLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewAskAiLogic(ctx context.Context, svcCtx *svc.ServiceContext) *AskAiLogic {
	return &AskAiLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

type aiConfig struct {
	provider string
	baseUrl  string
	model    string
	apiKey   string
}

func (l *AskAiLogic) StreamAi(req *types.AskAiReq, w http.ResponseWriter) error {
	logx.Infof("[AI] Streaming request received: %s", req.Question)

	question := strings.TrimSpace(req.Question)
	if question == "" {
		return fmt.Errorf("缺少 question")
	}
	if len(question) > 400 {
		question = question[:400]
	}

	// Build context
	contextTags := ""
	if len(req.Context.Tags) > 0 {
		tags := req.Context.Tags
		if len(tags) > 8 {
			tags = tags[:8]
		}
		contextTags = strings.Join(tags, ", ")
	}
	contextTitle := req.Context.Title

	// Build prompt
	prompt := []string{
		"你是简洁的技术助手，用中文回答读者的问题。",
		"优先给出准确、精炼的解释，如需要可以举 1 个例子。",
		"如果用户问到你不知道的概念，明确说明不确定而不要编造。",
	}
	if contextTitle != "" {
		prompt = append(prompt, fmt.Sprintf("当前页面标题：%s", contextTitle))
	}
	if contextTags != "" {
		prompt = append(prompt, fmt.Sprintf("相关标签：%s", contextTags))
	}
	prompt = append(prompt, "回答长度控制在 400-800 字，必要时举 1 个简短例子，保持中文回答。")

	config := l.getAiConfig(req.Provider)
	logx.Infof("[AI] Stream config - Provider: %s, Model: %s, BaseURL: %s, HasAPIKey: %v",
		config.provider, config.model, config.baseUrl, config.apiKey != "")

	if config.apiKey == "" {
		return fmt.Errorf("缺少 AI API Key，无法调用 AI")
	}

	flusher, ok := w.(http.Flusher)
	if !ok {
		return fmt.Errorf("streaming not supported")
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.WriteHeader(http.StatusOK)
	flusher.Flush()

	logx.Infof("[AI] Streaming call started...")
	if err := l.callAiApiStream(config, strings.Join(prompt, "\n"), question, w, flusher); err != nil {
		logx.Errorf("[AI] Streaming failed: %v", err)
		fmt.Fprintf(w, "data: [ERROR] %s\n\n", err.Error())
		flusher.Flush()
		return err
	}

	logx.Info("[AI] Streaming finished")
	return nil
}

func (l *AskAiLogic) callAiApiStream(config aiConfig, systemPrompt, userQuestion string, w http.ResponseWriter, flusher http.Flusher) error {
	payload := map[string]interface{}{
		"model": config.model,
		"messages": []map[string]string{
			{"role": "system", "content": systemPrompt},
			{"role": "user", "content": userQuestion},
		},
		"temperature": 0.4,
		"max_tokens":  1024, // 支持长回答
		"top_p":       0.7,  // 采样参数
		"stream":      true,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", fmt.Sprintf("%s/chat/completions", config.baseUrl), bytes.NewReader(body))
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", config.apiKey))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "text/event-stream")

	// Configure HTTP client with proxy support (only for external APIs like OpenAI)
	transport := &http.Transport{
		DialContext:           (&net.Dialer{Timeout: 30 * time.Second}).DialContext,
		TLSHandshakeTimeout:   30 * time.Second,
		ResponseHeaderTimeout: 30 * time.Second,
	}
	// Only use proxy for OpenAI, not for domestic services like GLM
	if l.svcCtx.Config.AiProxyUrl != "" && config.provider == "openai" {
		proxyURL, err := url.Parse(l.svcCtx.Config.AiProxyUrl)
		if err == nil {
			transport.Proxy = http.ProxyURL(proxyURL)
			logx.Infof("[AI] Using proxy: %s", l.svcCtx.Config.AiProxyUrl)
		} else {
			logx.Infof("[AI] Invalid proxy URL: %v", err)
		}
	}
	client := &http.Client{
		Timeout:   5 * time.Minute,
		Transport: transport,
	}

	logx.Infof("[AI] Sending streaming request to: %s", fmt.Sprintf("%s/chat/completions", config.baseUrl))
	resp, err := client.Do(req)
	if err != nil {
		logx.Errorf("[AI] Streaming HTTP request failed: %v", err)
		return fmt.Errorf("HTTP request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		respBody, _ := io.ReadAll(resp.Body)
		logx.Errorf("[AI] Streaming API error: status=%d, body=%s", resp.StatusCode, string(respBody))
		return fmt.Errorf("AI API returned status %d: %s", resp.StatusCode, string(respBody))
	}

	reader := bufio.NewReader(resp.Body)

	for {
		line, err := reader.ReadString('\n')
		if err != nil {
			if err == io.EOF {
				break
			}
			return err
		}

		line = strings.TrimSpace(line)
		if line == "" || line == ":" {
			continue
		}
		if !strings.HasPrefix(line, "data:") {
			continue
		}

		data := strings.TrimSpace(strings.TrimPrefix(line, "data:"))
		if data == "" {
			continue
		}

		if data == "[DONE]" {
			fmt.Fprint(w, "data: [DONE]\n\n")
			flusher.Flush()
			break
		}

		var streamResp struct {
			Choices []struct {
				Delta struct {
					Content string `json:"content"`
				} `json:"delta"`
			} `json:"choices"`
		}

		if err := json.Unmarshal([]byte(data), &streamResp); err != nil {
			logx.Errorf("[AI] Failed to decode stream chunk: %v, raw: %s", err, data)
			continue
		}

		if len(streamResp.Choices) == 0 {
			continue
		}

		chunk := streamResp.Choices[0].Delta.Content
		if chunk == "" {
			continue
		}

		fmt.Fprintf(w, "data: %s\n\n", chunk)
		flusher.Flush()
	}

	return nil
}

func (l *AskAiLogic) getAiConfig(forced string) aiConfig {
	provider := strings.ToLower(forced)
	if provider == "" {
		provider = strings.ToLower(l.svcCtx.Config.AiProvider)
	}
	if provider == "" {
		provider = "openai"
	}

	// Get base config from svcCtx
	baseUrl := l.svcCtx.Config.AiBaseUrl
	model := l.svcCtx.Config.AiModel
	apiKey := l.svcCtx.Config.AiApiKey

	// Set defaults based on provider
	if baseUrl == "" {
		switch provider {
		case "deepseek":
			baseUrl = "https://api.deepseek.com/v1"
		case "glm":
			baseUrl = "https://open.bigmodel.cn/api/paas/v4"
		case "qwen", "custom":
			baseUrl = "https://dashscope.aliyuncs.com/compatible-mode/v1"
		default:
			baseUrl = "https://api.openai.com/v1"
		}
	}

	if model == "" {
		switch provider {
		case "deepseek":
			model = "deepseek-chat"
		case "glm":
			model = "glm-4-flash"
		case "qwen", "custom":
			model = "qwen-plus"
		default:
			model = "gpt-4o-mini"
		}
	}

	return aiConfig{
		provider: provider,
		baseUrl:  baseUrl,
		model:    model,
		apiKey:   apiKey,
	}
}

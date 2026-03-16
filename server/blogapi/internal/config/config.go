package config

import "github.com/zeromicro/go-zero/rest"

type Config struct {
	rest.RestConf
	DatabaseDSN string
	Cors        []string
	NextSiteURL string `json:",optional"` // Optional Next.js site URL for revalidation; defaults to localhost in local dev
	AmapKey     string
	DefaultCity string // Default city for localhost development
	AiProvider  string // AI provider: openai, deepseek, glm, qwen, custom
	AiApiKey    string // AI API key
	AiBaseUrl   string // AI base URL
	AiModel     string // AI model name
	AiProxyUrl  string // Proxy URL for AI API calls
}

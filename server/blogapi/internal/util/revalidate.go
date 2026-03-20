package util

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/zeromicro/go-zero/core/logx"
)

const defaultNextSiteURL = "http://localhost:3000"

func RevalidateConfiguredNext(configBaseURL, secret string, paths []string) {
	RevalidateNext(resolveNextSiteURL(configBaseURL), secret, paths)
}

func RevalidateNext(baseURL, secret string, paths []string) {
	if baseURL == "" || secret == "" || len(paths) == 0 {
		return
	}

	body, err := json.Marshal(map[string][]string{
		"paths": paths,
	})
	if err != nil {
		logx.Errorf("revalidate marshal body failed: %v", err)
		return
	}

	req, err := http.NewRequest("POST", baseURL+"/api/revalidate", bytes.NewBuffer(body))
	if err != nil {
		logx.Errorf("revalidate create request failed: %v", err)
		return
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-revalidate-secret", secret)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		logx.Errorf("revalidate request failed: baseURL=%s paths=%v err=%v", baseURL, paths, err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		payload, _ := io.ReadAll(io.LimitReader(resp.Body, 1024))
		logx.Errorf("revalidate request returned non-2xx: baseURL=%s paths=%v status=%d body=%s", baseURL, paths, resp.StatusCode, strings.TrimSpace(string(payload)))
		return
	}

	logx.Infof("revalidate request succeeded: baseURL=%s paths=%v", baseURL, paths)
}

func resolveNextSiteURL(configBaseURL string) string {
	if envBaseURL := normalizeBaseURL(os.Getenv("NEXT_SITE_URL")); envBaseURL != "" {
		return envBaseURL
	}
	if configBaseURL = normalizeBaseURL(configBaseURL); configBaseURL != "" {
		return configBaseURL
	}
	return defaultNextSiteURL
}

func normalizeBaseURL(baseURL string) string {
	baseURL = strings.TrimSpace(baseURL)
	baseURL = strings.TrimRight(baseURL, "/")
	return baseURL
}

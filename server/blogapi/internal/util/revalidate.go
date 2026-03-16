package util

import (
	"bytes"
	"net/http"
	"os"
	"strings"
)

const defaultNextSiteURL = "http://localhost:3000"

func RevalidateConfiguredNext(configBaseURL, secret string, paths []string) {
	RevalidateNext(resolveNextSiteURL(configBaseURL), secret, paths)
}

func RevalidateNext(baseURL, secret string, paths []string) {
	if baseURL == "" || secret == "" || len(paths) == 0 {
		return
	}
	// 简版：一次发一个路径；需要可批量自己拼
	body := []byte(`{"paths":["` + paths[0] + `"]}`)
	req, _ := http.NewRequest("POST", baseURL+"/api/revalidate", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-revalidate-secret", secret)
	_, _ = http.DefaultClient.Do(req) // 忽略错误，避免阻塞
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

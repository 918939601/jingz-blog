package util

import (
	"bytes"
	"net/http"
)

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

package ai

import (
	"encoding/json"
	"net/http"

	"server/blogapi/internal/logic/ai"
	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

func AskAiHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.AskAiReq
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "invalid json: " + err.Error()})
			return
		}

		l := ai.NewAskAiLogic(r.Context(), svcCtx)

		// Always use streaming
		if err := l.StreamAi(&req, w); err != nil {
			logx.Errorf("[AI] stream error: %v", err)
			// If headers are not written yet, return JSON error
			if w.Header().Get("Content-Type") == "" {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusServiceUnavailable)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			}
		}
	}
}

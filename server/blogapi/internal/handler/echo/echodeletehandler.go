package echo

import (
	"net/http"

	"server/blogapi/internal/logic/echo"
	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"

	"github.com/zeromicro/go-zero/rest/httpx"
)

func EchoDeleteHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.EchoDeleteReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := echo.NewEchoDeleteLogic(r.Context(), svcCtx)
		if _, err := l.EchoDelete(&req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}
		w.WriteHeader(http.StatusNoContent) // 204
	}
}

package echo

import (
	"net/http"

	"github.com/zeromicro/go-zero/rest/httpx"
	"server/blogapi/internal/logic/echo"
	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"
)

func EchoToggleHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.EchoToggleReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := echo.NewEchoToggleLogic(r.Context(), svcCtx)
		resp, err := l.EchoToggle(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}

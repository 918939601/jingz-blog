package blog

import (
	"net/http"

	"github.com/zeromicro/go-zero/rest/httpx"
	"server/blogapi/internal/logic/blog"
	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"
)

func BlogToggleHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.BlogToggleReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := blog.NewBlogToggleLogic(r.Context(), svcCtx)
		resp, err := l.BlogToggle(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}

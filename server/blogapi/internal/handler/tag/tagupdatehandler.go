package tag

import (
	"net/http"

	"github.com/zeromicro/go-zero/rest/httpx"
	"server/blogapi/internal/logic/tag"
	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"
)

func TagUpdateHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.TagUpdateReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := tag.NewTagUpdateLogic(r.Context(), svcCtx)
		resp, err := l.TagUpdate(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}

package note

import (
	"net/http"

	"github.com/zeromicro/go-zero/rest/httpx"
	"server/blogapi/internal/logic/note"
	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"
)

func NoteCreateHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.NoteCreateReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := note.NewNoteCreateLogic(r.Context(), svcCtx)
		resp, err := l.NoteCreate(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}

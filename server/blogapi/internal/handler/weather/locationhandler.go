package weather

import (
	"net/http"

	"server/blogapi/internal/logic/weather"
	"server/blogapi/internal/svc"

	"github.com/zeromicro/go-zero/rest/httpx"
)

func LocationHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		l := weather.NewLocationLogic(r.Context(), svcCtx)
		location, err := l.GetLocationByRequest(r)
		if err != nil {
			httpx.Error(w, err)
			return
		}

		httpx.OkJson(w, location)
	}
}

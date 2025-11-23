package weather

import (
	"fmt"
	"net/http"
	"strconv"

	"server/blogapi/internal/logic/weather"
	"server/blogapi/internal/svc"

	"github.com/zeromicro/go-zero/rest/httpx"
)

func WeatherHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Parse query parameters
		latStr := r.URL.Query().Get("latitude")
		lonStr := r.URL.Query().Get("longitude")

		if latStr == "" || lonStr == "" {
			httpx.Error(w, fmt.Errorf("missing latitude or longitude"))
			return
		}

		latitude, err := strconv.ParseFloat(latStr, 64)
		if err != nil {
			httpx.Error(w, fmt.Errorf("invalid latitude"))
			return
		}

		longitude, err := strconv.ParseFloat(lonStr, 64)
		if err != nil {
			httpx.Error(w, fmt.Errorf("invalid longitude"))
			return
		}

		l := weather.NewWeatherLogic(r.Context(), svcCtx)
		weatherData, err := l.GetWeatherByCoordinates(latitude, longitude)
		if err != nil {
			httpx.Error(w, err)
			return
		}

		httpx.OkJson(w, weatherData)
	}
}

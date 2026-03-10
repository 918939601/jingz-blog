package weather

import (
	"encoding/json"
	"net/http"
	"strconv"

	"server/blogapi/internal/logic/weather"
	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/rest/httpx"
)

func WeatherInfoHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		logx.Infof("WeatherInfoHandler called, method: %s, path: %s, query: %s", r.Method, r.URL.Path, r.URL.RawQuery)

		// Check if coordinates are provided in query params
		latStr := r.URL.Query().Get("latitude")
		lonStr := r.URL.Query().Get("longitude")
		logx.Infof("Query params - latitude: %s, longitude: %s", latStr, lonStr)

		var location *types.LocationDTO
		var err error

		if latStr != "" && lonStr != "" {
			// Use coordinates if provided (priority: coordinates > IP)
			logx.Infof("Using coordinates from query: lat=%s, lon=%s", latStr, lonStr)
			latitude, errLat := strconv.ParseFloat(latStr, 64)
			longitude, errLon := strconv.ParseFloat(lonStr, 64)
			
			if errLat != nil || errLon != nil {
				logx.Errorf("Invalid coordinates: lat=%v, lon=%v", errLat, errLon)
				latitude = 39.9042  // Default Beijing
				longitude = 116.4074
			}

			// Use reverse geocoding to get city name from coordinates
			locationLogic := weather.NewLocationLogic(r.Context(), svcCtx)
			location, err = locationLogic.GetLocationByCoordinates(latitude, longitude)
			if err != nil {
				logx.Errorf("Failed to get location by coordinates: %v, falling back to default", err)
				location = locationLogic.GetDefaultLocation()
			}
			logx.Infof("Got location from coordinates: %s (lat=%f, lon=%f)", location.City, latitude, longitude)
		} else {
			// Fall back to IP-based location
			locationLogic := weather.NewLocationLogic(r.Context(), svcCtx)
			location, err = locationLogic.GetLocationByRequest(r)
			if err != nil {
				logx.Errorf("Failed to get location: %v", err)
				location = locationLogic.GetDefaultLocation()
			}
		}

		logx.Infof("Got location: %s", location.City)

		// Get weather by city name (should not fail due to fallback)
		weatherLogic := weather.NewWeatherLogic(r.Context(), svcCtx)
		weatherData, err := weatherLogic.GetWeatherByCity(location.City)
		if err != nil {
			logx.Errorf("Failed to get weather: %v", err)
			// This should rarely happen now, but handle it gracefully
			httpx.Error(w, err)
			return
		}

		logx.Infof("Got weather: %s, temp: %f", weatherData.Description, weatherData.Temperature)

		// Return combined response
		info := &types.WeatherInfoDTO{
			Location: location,
			Weather:  weatherData,
		}

		// Manually write JSON response to avoid any go-zero validation issues
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(info); err != nil {
			logx.Errorf("Failed to encode response: %v", err)
		}
	}
}

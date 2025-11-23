package weather

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type WeatherLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewWeatherLogic(ctx context.Context, svcCtx *svc.ServiceContext) *WeatherLogic {
	return &WeatherLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

// GetWeatherByCity gets weather information by city name using Amap API
func (w *WeatherLogic) GetWeatherByCity(city string) (*types.WeatherDTO, error) {
	logx.Infof("GetWeatherByCity called with city: %s", city)
	
	// Get Amap API key from config
	amapKey := w.svcCtx.Config.AmapKey
	if amapKey == "" {
		logx.Error("Amap API key not configured, returning mock data")
		return w.getMockWeather(), nil
	}

	logx.Infof("Amap API key configured: %s", amapKey[:10]+"...") // Log first 10 chars only

	// URL encode the city name
	encodedCity := url.QueryEscape(city)
	
	// Call Amap weather API with city name
	apiURL := fmt.Sprintf("https://restapi.amap.com/v3/weather/weatherInfo?city=%s&key=%s&extensions=all", encodedCity, amapKey)
	
	logx.Infof("Calling Amap weather API: %s", apiURL)
	resp, err := http.Get(apiURL)
	if err != nil {
		logx.Errorf("Failed to call Amap weather API: %v, returning mock data", err)
		return w.getMockWeather(), nil
	}
	defer resp.Body.Close()

	logx.Infof("Amap API response status code: %d", resp.StatusCode)

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		logx.Errorf("Failed to read Amap weather response: %v, returning mock data", err)
		return w.getMockWeather(), nil
	}

	logx.Infof("Amap weather response body: %s", string(body))

	// Try to unmarshal as forecast response first (which is what we're getting)
	var forecastResp types.AmapWeatherForecastResponse
	if err := json.Unmarshal(body, &forecastResp); err == nil && forecastResp.Status == "1" && len(forecastResp.Forecasts) > 0 {
		logx.Infof("Parsed as forecast response, forecasts count: %d", len(forecastResp.Forecasts))
		
		forecast := forecastResp.Forecasts[0]
		if len(forecast.Casts) > 0 {
			cast := forecast.Casts[0]
			
			// Parse day temperature
			dayTemp := 0.0
			fmt.Sscanf(cast.DayTempFloat, "%f", &dayTemp)
			
			// Parse wind power (e.g., "1-3" -> take the first number)
			windPower := 0
			fmt.Sscanf(cast.DayPower, "%d", &windPower)
			windSpeed := float64(windPower) * 3.5 // Approximate conversion
			
			logx.Infof("Weather data parsed from forecast: temp=%f, desc=%s", dayTemp, cast.DayWeather)
			
			return &types.WeatherDTO{
				Temperature: dayTemp,
				Description: cast.DayWeather,
				FeelsLike:   dayTemp - 2,
				Humidity:    65, // Forecast doesn't provide humidity, use default
				WindSpeed:   windSpeed,
				Icon:        w.getWeatherIcon(cast.DayWeather),
				Pressure:    1013.25,
				Visibility:  10000,
			}, nil
		}
	}

	// Fall back to real-time response
	var amapResp types.AmapWeatherResponse
	if err := json.Unmarshal(body, &amapResp); err != nil {
		logx.Errorf("Failed to unmarshal Amap weather response: %v, returning mock data", err)
		return w.getMockWeather(), nil
	}

	logx.Infof("Amap response status: %s, info: %s, lives count: %d", amapResp.Status, amapResp.Info, len(amapResp.Lives))

	if amapResp.Status != "1" {
		logx.Errorf("Amap weather API error: status=%s, info=%s, infocode=%s, returning mock data", amapResp.Status, amapResp.Info, amapResp.InfoCode)
		return w.getMockWeather(), nil
	}

	if len(amapResp.Lives) == 0 {
		logx.Error("No weather data returned from Amap, returning mock data")
		return w.getMockWeather(), nil
	}

	// Parse the first weather record
	live := amapResp.Lives[0]
	
	// Parse temperature (Amap returns as string)
	temperature := 0.0
	fmt.Sscanf(live.Temperature, "%f", &temperature)
	
	// Parse humidity (Amap returns as string)
	humidity := 0
	fmt.Sscanf(live.Humidity, "%d", &humidity)
	
	// Parse wind power (Amap returns as string, e.g., "3级")
	windPower := 0
	fmt.Sscanf(live.WindPower, "%d", &windPower)
	windSpeed := float64(windPower) * 3.5 // Approximate conversion: each level ≈ 3.5 m/s

	logx.Infof("Weather data parsed: temp=%f, desc=%s, humidity=%d", temperature, live.Weather, humidity)

	return &types.WeatherDTO{
		Temperature: temperature,
		Description: live.Weather,
		FeelsLike:   temperature - 2, // Approximate feels like temperature
		Humidity:    humidity,
		WindSpeed:   windSpeed,
		Icon:        w.getWeatherIcon(live.Weather),
		Pressure:    1013.25, // Amap doesn't provide pressure in live weather
		Visibility:  10000,   // Amap doesn't provide visibility in live weather
	}, nil
}

// getMockWeather returns mock weather data for fallback
func (w *WeatherLogic) getMockWeather() *types.WeatherDTO {
	return &types.WeatherDTO{
		Temperature: 18.5,
		Description: "晴天",
		FeelsLike:   17.2,
		Humidity:    65,
		WindSpeed:   12.5,
		Icon:        "01d",
		Pressure:    1013.25,
		Visibility:  10000,
	}
}

// GetWeatherByCoordinates gets weather information by coordinates using Amap API
// Note: Amap weather API requires city name, so this method is kept for backward compatibility
func (w *WeatherLogic) GetWeatherByCoordinates(latitude, longitude float64) (*types.WeatherDTO, error) {
	// For coordinates, we'd need reverse geocoding first to get city name
	// For now, return a default city (Beijing)
	return w.GetWeatherByCity("北京")
}

// getWeatherIcon converts Chinese weather description to icon code
func (w *WeatherLogic) getWeatherIcon(description string) string {
	iconMap := map[string]string{
		"晴":   "01d",
		"多云": "02d",
		"阴":   "04d",
		"阵雨": "09d",
		"雨":   "10d",
		"小雨": "10d",
		"中雨": "10d",
		"大雨": "10d",
		"暴雨": "10d",
		"雪":   "13d",
		"小雪": "13d",
		"中雪": "13d",
		"大雪": "13d",
		"雾":   "50d",
		"霾":   "50d",
		"雷":   "11d",
		"雷阵雨": "11d",
	}

	// Try exact match first
	if icon, ok := iconMap[description]; ok {
		return icon
	}

	// Try partial match
	for key, icon := range iconMap {
		if strings.Contains(description, key) {
			return icon
		}
	}

	// Default to clear sky
	return "01d"
}

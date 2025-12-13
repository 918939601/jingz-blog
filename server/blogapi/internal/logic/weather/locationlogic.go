package weather

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"strings"

	"server/blogapi/internal/svc"
	"server/blogapi/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type LocationLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewLocationLogic(ctx context.Context, svcCtx *svc.ServiceContext) *LocationLogic {
	return &LocationLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

// GetLocationByIP gets location information by IP address using Amap API
func (l *LocationLogic) GetLocationByIP(ip string) (*types.LocationDTO, error) {
	// Get Amap API key from config
	amapKey := l.svcCtx.Config.AmapKey
	if amapKey == "" {
		logx.Error("Amap API key not configured, returning default location")
		return l.getDefaultLocation(), nil
	}

	// Call Amap IP location API
	url := fmt.Sprintf("https://restapi.amap.com/v3/ip?ip=%s&key=%s", ip, amapKey)
	logx.Infof("Calling Amap IP location API for IP: %s", ip)
	resp, err := http.Get(url)
	if err != nil {
		logx.Errorf("Failed to call Amap IP location API: %v, returning default location", err)
		return l.getDefaultLocation(), nil
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		logx.Errorf("Failed to read Amap response: %v, returning default location", err)
		return l.getDefaultLocation(), nil
	}

	logx.Infof("Amap location response: %s", string(body))

	var amapResp types.AmapLocationResponse
	if err := json.Unmarshal(body, &amapResp); err != nil {
		logx.Errorf("Failed to unmarshal Amap response: %v, returning default location", err)
		return l.getDefaultLocation(), nil
	}

	if amapResp.Status != "1" {
		logx.Errorf("Amap API error: %s, returning default location", amapResp.Info)
		return l.getDefaultLocation(), nil
	}

	// Extract province and city name from arrays
	defaultCity := "北京" // Default to Beijing
	defaultProvince := "北京市"
	if l.svcCtx.Config.DefaultCity != "" {
		defaultCity = l.svcCtx.Config.DefaultCity
	}

	province := defaultProvince
	city := defaultCity

	if len(amapResp.Province) > 0 {
		if provinceStr, ok := amapResp.Province[0].(string); ok {
			province = provinceStr
			logx.Infof("Extracted province from Amap: %s", province)
		}
	}

	if len(amapResp.City) > 0 {
		if cityStr, ok := amapResp.City[0].(string); ok {
			city = cityStr
			logx.Infof("Extracted city from Amap: %s", city)
		}
	}

	// For localhost development, log which location is being used
	if ip == "127.0.0.1" {
		logx.Infof("Running on localhost, using location: %s %s (default: %s %s)", province, city, defaultProvince, defaultCity)
	}

	// Parse rectangle to get coordinates (format: "lng1,lat1;lng2,lat2")
	var latitude, longitude float64
	if len(amapResp.Rectangle) > 0 {
		parts := strings.Split(amapResp.Rectangle[0], ";")
		if len(parts) >= 1 {
			coords := strings.Split(parts[0], ",")
			if len(coords) >= 2 {
				fmt.Sscanf(coords[0], "%f", &longitude)
				fmt.Sscanf(coords[1], "%f", &latitude)
			}
		}
	}

	// If no coordinates found, use default Beijing coordinates
	if latitude == 0 && longitude == 0 {
		latitude = 39.9042
		longitude = 116.4074
	}

	return &types.LocationDTO{
		Province:    province,
		City:        city,
		Country:     "China", // Amap is mainly for China
		CountryCode: "CN",
		Latitude:    latitude,
		Longitude:   longitude,
		Timezone:    "Asia/Shanghai",
	}, nil
}

// GetLocationByRequest gets location from HTTP request headers
func (l *LocationLogic) GetLocationByRequest(r *http.Request) (*types.LocationDTO, error) {
	// Try to get IP from various headers
	ip := l.getClientIP(r)
	if ip == "" {
		logx.Info("Unable to determine client IP, returning default location")
		return l.getDefaultLocation(), nil
	}

	return l.GetLocationByIP(ip)
}

// GetDefaultLocation returns default location (Beijing)
func (l *LocationLogic) GetDefaultLocation() *types.LocationDTO {
	return &types.LocationDTO{
		Province:    "北京市",
		City:        "北京",
		Country:     "China",
		CountryCode: "CN",
		Latitude:    39.9042,
		Longitude:   116.4074,
		Timezone:    "Asia/Shanghai",
	}
}

// getDefaultLocation returns default location (Beijing) - private version
func (l *LocationLogic) getDefaultLocation() *types.LocationDTO {
	return l.GetDefaultLocation()
}

// GetLocationByCoordinates gets location by coordinates using reverse geocoding
func (l *LocationLogic) GetLocationByCoordinates(latitude, longitude float64) (*types.LocationDTO, error) {
	amapKey := l.svcCtx.Config.AmapKey
	if amapKey == "" {
		logx.Error("Amap API key not configured, returning default location")
		return l.GetDefaultLocation(), nil
	}

	// Call Amap reverse geocoding API
	url := fmt.Sprintf("https://restapi.amap.com/v3/geocode/regeo?location=%f,%f&key=%s", longitude, latitude, amapKey)
	logx.Infof("Calling Amap reverse geocoding API: lat=%f, lon=%f", latitude, longitude)

	resp, err := http.Get(url)
	if err != nil {
		logx.Errorf("Failed to call Amap reverse geocoding API: %v, returning default location", err)
		return l.GetDefaultLocation(), nil
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		logx.Errorf("Failed to read Amap reverse geocoding response: %v, returning default location", err)
		return l.GetDefaultLocation(), nil
	}

	logx.Infof("Amap reverse geocoding response: %s", string(body))

	// Try to parse the response with flexible structure
	var regeoResp map[string]interface{}
	if err := json.Unmarshal(body, &regeoResp); err != nil {
		logx.Errorf("Failed to unmarshal Amap reverse geocoding response: %v, returning default location", err)
		return l.GetDefaultLocation(), nil
	}

	status, ok := regeoResp["status"].(string)
	logx.Infof("Amap response status: %s", status)

	if !ok || status != "1" {
		logx.Errorf("Amap reverse geocoding error: status=%v, info=%v, returning default location", regeoResp["status"], regeoResp["info"])
		return l.GetDefaultLocation(), nil
	}

	// Extract province and city from nested structure
	var province, city string

	if regeocode, ok := regeoResp["regeocode"].(map[string]interface{}); ok {
		logx.Infof("Found regeocode in response")
		if addressComponent, ok := regeocode["addressComponent"].(map[string]interface{}); ok {
			logx.Infof("Found addressComponent: %v", addressComponent)

			// Extract province (一级地区)
			if provinceVal, ok := addressComponent["province"].(string); ok && provinceVal != "" {
				province = provinceVal
				logx.Infof("Extracted province: %s", province)
			}

			// Extract city/district (二级地区) - priority: district > city
			if district, ok := addressComponent["district"].(string); ok && district != "" {
				city = district
				logx.Infof("Extracted city from district (二级地区): %s", city)
			} else if cityVal, ok := addressComponent["city"].(string); ok && cityVal != "" {
				city = cityVal
				logx.Infof("Extracted city: %s", city)
			}
		}
	}

	// Fallback: try to extract from formatted_address
	if city == "" || province == "" {
		if regeocode, ok := regeoResp["regeocode"].(map[string]interface{}); ok {
			if formatted, ok := regeocode["formatted_address"].(string); ok {
				logx.Infof("Found formatted_address: %s", formatted)
				// Extract from formatted address (format: "province city district...")
				parts := strings.FieldsFunc(formatted, func(r rune) bool {
					return r == ',' || r == '、'
				})
				if len(parts) >= 2 && province == "" {
					province = strings.TrimSpace(parts[0])
					logx.Infof("Extracted province from formatted_address: %s", province)
				}
				if len(parts) >= 2 && city == "" {
					city = strings.TrimSpace(parts[1])
					logx.Infof("Extracted city from formatted_address: %s", city)
				}
			}
		}
	}

	if province == "" || city == "" {
		logx.Infof("Missing province or city in response. province=%s, city=%s. Full response: %v", province, city, regeoResp)
	}

	if province == "" || city == "" {
		logx.Infof("No complete location found in reverse geocoding response, returning default location")
		return l.GetDefaultLocation(), nil
	}

	logx.Infof("Got location from reverse geocoding: %s %s (lat=%f, lon=%f)", province, city, latitude, longitude)

	return &types.LocationDTO{
		Province:    province,
		City:        city,
		Country:     "China",
		CountryCode: "CN",
		Latitude:    latitude,  // ✅ 返回真实坐标
		Longitude:   longitude, // ✅ 返回真实坐标
		Timezone:    "Asia/Shanghai",
	}, nil
}

// getClientIP extracts client IP from request headers
func (l *LocationLogic) getClientIP(r *http.Request) string {
	// Try X-Forwarded-For header first
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		ips := strings.Split(xff, ",")
		if len(ips) > 0 {
			return strings.TrimSpace(ips[0])
		}
	}

	// Try X-Real-IP header
	if xri := r.Header.Get("X-Real-IP"); xri != "" {
		return xri
	}

	// Try CF-Connecting-IP header (Cloudflare)
	if cfip := r.Header.Get("CF-Connecting-IP"); cfip != "" {
		return cfip
	}

	// Fall back to RemoteAddr
	if ip, _, err := net.SplitHostPort(r.RemoteAddr); err == nil {
		return ip
	}

	return r.RemoteAddr
}

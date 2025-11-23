package types

// LocationDTO represents location information
type LocationDTO struct {
	Province    string  `json:"province"`
	City        string  `json:"city"`
	Country     string  `json:"country"`
	CountryCode string  `json:"countryCode"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	Timezone    string  `json:"timezone"`
}

// WeatherDTO represents weather information
type WeatherDTO struct {
	Temperature float64 `json:"temperature"`
	Description string  `json:"description"`
	FeelsLike   float64 `json:"feelsLike"`
	Humidity    int     `json:"humidity"`
	WindSpeed   float64 `json:"windSpeed"`
	Icon        string  `json:"icon"`
	Pressure    float64 `json:"pressure"`
	Visibility  float64 `json:"visibility"`
}

// WeatherInfoDTO represents combined location and weather information
type WeatherInfoDTO struct {
	Location *LocationDTO `json:"location"`
	Weather  *WeatherDTO  `json:"weather"`
}

// AmapLocationResponse represents Amap IP location API response
type AmapLocationResponse struct {
	Status    string        `json:"status"`
	Info      string        `json:"info"`
	InfoCode  string        `json:"infocode"`
	Province  []interface{} `json:"province"`
	City      []interface{} `json:"city"`
	Adcode    []interface{} `json:"adcode"`
	Rectangle []string      `json:"rectangle"`
}

// AmapWeatherResponse represents Amap weather API response (real-time data)
type AmapWeatherResponse struct {
	Status   string `json:"status"`
	Info     string `json:"info"`
	InfoCode string `json:"infocode"`
	Lives    []struct {
		Province      string `json:"province"`
		City          string `json:"city"`
		Adcode        string `json:"adcode"`
		Weather       string `json:"weather"`
		Temperature   string `json:"temperature"`
		WindDirection string `json:"winddirection"`
		WindPower     string `json:"windpower"`
		Humidity      string `json:"humidity"`
		ReportTime    string `json:"reporttime"`
	} `json:"lives"`
}

// AmapWeatherForecastResponse represents Amap weather forecast API response
type AmapWeatherForecastResponse struct {
	Status    string `json:"status"`
	Info      string `json:"info"`
	InfoCode  string `json:"infocode"`
	Count     string `json:"count"`
	Forecasts []struct {
		City       string `json:"city"`
		Adcode     string `json:"adcode"`
		Province   string `json:"province"`
		ReportTime string `json:"reporttime"`
		Casts      []struct {
			Date             string `json:"date"`
			Week             string `json:"week"`
			DayWeather       string `json:"dayweather"`
			NightWeather     string `json:"nightweather"`
			DayTemp          string `json:"daytemp"`
			NightTemp        string `json:"nighttemp"`
			DayWind          string `json:"daywind"`
			NightWind        string `json:"nightwind"`
			DayPower         string `json:"daypower"`
			NightPower       string `json:"nightpower"`
			DayTempFloat     string `json:"daytemp_float"`
			NightTempFloat   string `json:"nighttemp_float"`
		} `json:"casts"`
	} `json:"forecasts"`
}

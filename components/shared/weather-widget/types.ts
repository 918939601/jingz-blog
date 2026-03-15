/**
 * Location information obtained from IP geolocation
 */
export interface Location {
  province: string
  city: string
  country: string
  countryCode: string
  latitude: number
  longitude: number
  timezone: string
}

/**
 * Current weather data
 */
export interface Weather {
  temperature: number
  description: string
  feelsLike: number
  humidity: number
  windSpeed: number
  icon: string
  pressure: number
  visibility: number
}

/**
 * Weather widget state
 */
export interface WeatherWidgetState {
  location: Location | null
  weather: Weather | null
  loading: boolean
  error: string | null
}

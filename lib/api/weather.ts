const API_BASE = process.env.NEXT_PUBLIC_GO_API_BASE || 'http://localhost:8080'

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `API error: ${response.status}`)
  }

  return response.json()
}

export interface LocationDTO {
  province: string
  city: string
  country: string
  countryCode: string
  latitude: number
  longitude: number
  timezone: string
}

export interface WeatherDTO {
  temperature: number
  description: string
  feelsLike: number
  humidity: number
  windSpeed: number
  icon: string
  pressure: number
  visibility: number
}

export interface WeatherInfoDTO {
  location: LocationDTO
  weather: WeatherDTO
}

/**
 * Fetch location by IP address
 */
export async function fetchLocation(): Promise<LocationDTO> {
  return apiFetch<LocationDTO>('/api/location')
}

/**
 * Fetch weather by coordinates
 */
export async function fetchWeather(latitude: number, longitude: number): Promise<WeatherDTO> {
  const params = new URLSearchParams()
  params.set('latitude', String(latitude))
  params.set('longitude', String(longitude))
  return apiFetch<WeatherDTO>(`/api/weather?${params.toString()}`)
}

/**
 * Fetch location and weather by coordinates
 */
export async function fetchWeatherByCoordinates(latitude: number, longitude: number): Promise<WeatherInfoDTO> {
  const params = new URLSearchParams()
  params.set('latitude', String(latitude))
  params.set('longitude', String(longitude))
  return apiFetch<WeatherInfoDTO>(`/api/weather/info?${params.toString()}`)
}

/**
 * Fetch location and weather together
 */
export async function fetchWeatherInfo(): Promise<WeatherInfoDTO> {
  return apiFetch<WeatherInfoDTO>('/api/weather/info')
}

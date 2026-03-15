'use client'

import type { WeatherWidgetState } from './types'
import { useCallback, useEffect, useState } from 'react'
import { fetchWeatherByCoordinates, fetchWeatherInfo } from '@/lib/api/weather'
import { WeatherCard } from './weather-card'

export function WeatherWidget() {
  const [state, setState] = useState<WeatherWidgetState>({
    location: null,
    weather: null,
    loading: true,
    error: null,
  })

  const loadWeatherData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    const loadByIP = async () => {
      try {
        const data = await fetchWeatherInfo()
        setState({
          location: data.location,
          weather: data.weather,
          loading: false,
          error: null,
        })
      }
      catch (error) {
        console.error('Failed to load weather by IP:', error)
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : '加载天气信息失败',
        }))
      }
    }

    try {
      if (!navigator.geolocation) {
        await loadByIP()
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const data = await fetchWeatherByCoordinates(latitude, longitude)
            setState({
              location: data.location,
              weather: data.weather,
              loading: false,
              error: null,
            })
          }
          catch (error) {
            console.warn('Failed with geolocation, falling back to IP:', error)
            await loadByIP()
          }
        },
        async (error) => {
          console.warn('Geolocation not available, using IP:', error)
          await loadByIP()
        },
      )
    }
    catch (error) {
      console.error('Failed to load weather:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '加载天气信息失败',
      }))
    }
  }, [])

  const handleRefresh = useCallback(() => {
    void loadWeatherData()
  }, [loadWeatherData])

  useEffect(() => {
    void loadWeatherData()
  }, [loadWeatherData])

  useEffect(() => {
    const interval = setInterval(() => {
      void loadWeatherData()
    }, 10 * 60 * 1000)

    return () => clearInterval(interval)
  }, [loadWeatherData])

  return (
    <WeatherCard
      location={state.location}
      weather={state.weather}
      loading={state.loading}
      error={state.error}
      onRefresh={handleRefresh}
    />
  )
}

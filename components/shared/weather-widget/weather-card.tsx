'use client'

import type { Location, Weather } from './types'
import { useState } from 'react'

interface WeatherCardProps {
  location: Location | null
  weather: Weather | null
  loading: boolean
  error: string | null
  onRefresh: () => void
}

interface FloatingElement {
  id: number
  emoji: string
  left: string
  top: string
  delay: number
  duration: number
  isGlowing: boolean
}

export function WeatherCard({
  location,
  weather,
  loading,
  error,
  onRefresh,
}: WeatherCardProps) {
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([
    { id: 1, emoji: '⛅', left: '12%', top: '18%', delay: 0, duration: 8, isGlowing: false },
    { id: 2, emoji: '💨', left: '78%', top: '22%', delay: 1, duration: 10, isGlowing: false },
    { id: 3, emoji: '💧', left: '18%', top: '78%', delay: 2, duration: 9, isGlowing: false },
    { id: 4, emoji: '🌡️', left: '82%', top: '70%', delay: 0.5, duration: 11, isGlowing: false },
  ])

  const toggleGlow = (id: number) => {
    setFloatingElements(prev => prev.map(el => (
      el.id === id ? { ...el, isGlowing: true } : el
    )))
    setTimeout(() => {
      setFloatingElements(prev => prev.map(el => (
        el.id === id ? { ...el, isGlowing: false } : el
      )))
    }, 800)
  }

  const getWeatherEmoji = (icon: string): string => {
    const iconMap: Record<string, string> = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '🌤️',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌧️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️',
    }

    return iconMap[icon] || '🌡️'
  }

  if (error) {
    return (
      <div className="paper-card w-full p-5 md:p-6">
        <div className="text-sm text-red-500 dark:text-red-300">{error}</div>
        <button
          type="button"
          onClick={onRefresh}
          className="mt-3 text-xs text-foreground/60 hover:text-foreground"
        >
          重试
        </button>
      </div>
    )
  }

  if (loading || !location || !weather) {
    return (
      <div className="paper-card w-full p-5 md:p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 rounded bg-black/8 dark:bg-white/10" />
          <div className="h-8 w-20 rounded bg-black/8 dark:bg-white/10" />
          <div className="h-4 w-32 rounded bg-black/8 dark:bg-white/10" />
        </div>
      </div>
    )
  }

  return (
    <div className="paper-card relative w-full overflow-hidden p-5 md:p-6">
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
              opacity: 0.22;
            }
            50% {
              transform: translateY(-18px) rotate(180deg);
              opacity: 0.5;
            }
          }

          @keyframes glow-pulse {
            0% {
              filter: drop-shadow(0 0 4px rgba(87, 184, 171, 0.35));
            }
            50% {
              filter: drop-shadow(0 0 12px rgba(87, 184, 171, 0.68));
            }
            100% {
              filter: drop-shadow(0 0 4px rgba(87, 184, 171, 0.35));
            }
          }
        `}
      </style>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(87,184,171,0.18),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(141,170,211,0.12),_transparent_32%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(87,184,171,0.14),_transparent_36%),radial-gradient(circle_at_bottom_left,_rgba(141,170,211,0.08),_transparent_30%)]" />

      <div className="relative z-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="paper-label">weather</span>
            <div className="mt-3 truncate text-sm text-foreground/68">
              {location.province}
              {location.city}
            </div>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/75 transition-colors hover:bg-white disabled:opacity-50 dark:border-white/12 dark:bg-white/[0.06] dark:hover:bg-white/[0.09]"
            title="刷新天气"
          >
            <span className={`inline-block ${loading ? 'animate-spin' : ''}`}>
              🔄
            </span>
          </button>
        </div>

        <div className="mt-6 flex items-end gap-3">
          <div className="flex-shrink-0 text-4xl md:text-5xl">
            {getWeatherEmoji(weather.icon)}
          </div>
          <div className="min-w-0">
            <div className="paper-title text-3xl md:text-4xl font-bold text-foreground">
              {`${Math.round(weather.temperature)}°C`}
            </div>
            <div className="mt-1 text-sm text-foreground/62 truncate">
              {weather.description}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2 border-t border-black/8 pt-4 md:space-y-3 dark:border-white/10">
          <div className="flex justify-between text-sm text-foreground/62">
            <span>体感温度</span>
            <span className="font-semibold text-foreground">
              {`${Math.round(weather.feelsLike)}°C`}
            </span>
          </div>
          <div className="flex justify-between text-sm text-foreground/62">
            <span>湿度</span>
            <span className="font-semibold text-foreground">
              {`${weather.humidity}%`}
            </span>
          </div>
          <div className="flex justify-between text-sm text-foreground/62">
            <span>风速</span>
            <span className="font-semibold text-foreground">
              {`${Math.round(weather.windSpeed)} km/h`}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {floatingElements.map(element => (
          <div
            key={element.id}
            className="absolute text-2xl cursor-pointer pointer-events-auto md:text-3xl"
            style={{
              left: element.left,
              top: element.top,
              animation: element.isGlowing
                ? `glow-pulse 0.6s ease-in-out`
                : `float ${element.duration}s ease-in-out ${element.delay}s infinite`,
              filter: element.isGlowing
                ? 'drop-shadow(0 0 12px rgba(87, 184, 171, 0.75))'
                : 'drop-shadow(0 0 2px rgba(87, 184, 171, 0.24))',
              transform: element.isGlowing ? 'scale(1.28)' : 'scale(1)',
              zIndex: element.isGlowing ? 50 : 30,
              transition: 'transform 0.2s ease-out',
            }}
            onClick={(e) => {
              e.stopPropagation()
              toggleGlow(element.id)
            }}
          >
            {element.emoji}
          </div>
        ))}
      </div>
    </div>
  )
}

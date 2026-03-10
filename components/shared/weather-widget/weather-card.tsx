'use client';

import React, { useState } from 'react';
import { Location, Weather } from './types';

interface WeatherCardProps {
  location: Location | null;
  weather: Weather | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

interface FloatingElement {
  id: number;
  emoji: string;
  left: string;
  top: string;
  delay: number;
  duration: number;
  isGlowing: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  location,
  weather,
  loading,
  error,
  onRefresh,
}) => {
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([
    { id: 1, emoji: '⛅', left: '10%', top: '15%', delay: 0, duration: 8, isGlowing: false },
    { id: 2, emoji: '🌤️', left: '80%', top: '20%', delay: 1, duration: 10, isGlowing: false },
    { id: 3, emoji: '💨', left: '15%', top: '70%', delay: 2, duration: 9, isGlowing: false },
    { id: 4, emoji: '💧', left: '85%', top: '65%', delay: 0.5, duration: 11, isGlowing: false },
    { id: 5, emoji: '🌡️', left: '50%', top: '10%', delay: 1.5, duration: 12, isGlowing: false },
  ]);

  const toggleGlow = (id: number) => {
    setFloatingElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, isGlowing: true } : el
      )
    );
    // Auto remove glow after 800ms
    setTimeout(() => {
      setFloatingElements((prev) =>
        prev.map((el) =>
          el.id === id ? { ...el, isGlowing: false } : el
        )
      );
    }, 800);
  };

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
    };
    return iconMap[icon] || '🌡️';
  };

  // Error state
  if (error) {
    return (
      <div className="w-full rounded-lg border border-white/10 bg-black/10 p-3 backdrop-blur-md md:p-4 lg:w-80 lg:sticky lg:right-4 lg:top-4">
        <div className="text-sm text-red-400">{error}</div>
        <button
          onClick={onRefresh}
          className="mt-2 text-xs text-white/60 hover:text-white/80"
        >
          重试
        </button>
      </div>
    );
  }

  // Loading state
  if (loading || !location || !weather) {
    return (
      <div className="w-full rounded-lg border border-white/10 bg-black/10 p-3 backdrop-blur-md md:p-4 lg:w-80 lg:sticky lg:right-4 lg:top-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 w-24 rounded bg-white/10" />
          <div className="h-8 w-16 rounded bg-white/10" />
          <div className="h-4 w-32 rounded bg-white/10" />
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="relative w-full rounded-lg border border-white/2 bg-black/1 p-3 backdrop-blur-md md:p-4 lg:w-80 lg:sticky lg:right-4 lg:top-4 overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.6;
          }
        }
        @keyframes glow-pulse {
          0% {
            filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 8px rgba(100, 200, 255, 0.6));
          }
          50% {
            filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 24px rgba(100, 200, 255, 1));
          }
          100% {
            filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 8px rgba(100, 200, 255, 0.6));
          }
        }
      `}</style>

      {/* Content */}
      <div className="relative z-0">
        {/* Location Header */}
        <div className="mb-2 flex items-center justify-between gap-2 md:mb-3">
          <div className="truncate text-xs text-black md:text-sm">
            📍 {location.province}{location.city}
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex-shrink-0 rounded p-1 hover:bg-white/10 disabled:opacity-50 transition-colors"
            title="刷新天气"
          >
            <span className={`inline-block ${loading ? 'animate-spin' : ''}`}>
              🔄
            </span>
          </button>
        </div>

        {/* Temperature and Weather Description */}
        <div className="mb-2 flex items-center gap-2 md:mb-3 md:gap-3">
          <div className="text-3xl md:text-4xl flex-shrink-0">
            {getWeatherEmoji(weather.icon)}
          </div>
          <div className="min-w-0">
            <div className="text-2xl md:text-3xl font-bold text-black">
              {Math.round(weather.temperature)}°C
            </div>
            <div className="text-xs md:text-sm text-black/70 truncate">
              {weather.description}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-1 border-t border-black/20 pt-2 md:space-y-2 md:pt-3">
          <div className="flex justify-between text-xs md:text-sm text-black/70">
            <span>体感温度</span>
            <span className="font-semibold text-black">
              {Math.round(weather.feelsLike)}°C
            </span>
          </div>
          <div className="flex justify-between text-xs md:text-sm text-black/70">
            <span>💧 湿度</span>
            <span className="font-semibold text-black">{weather.humidity}%</span>
          </div>
          <div className="flex justify-between text-xs md:text-sm text-black/70">
            <span>💨 风速</span>
            <span className="font-semibold text-black">
              {Math.round(weather.windSpeed)} km/h
            </span>
          </div>
        </div>
      </div>

      {/* Floating Elements Overlay - on top for clicking */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute text-2xl md:text-3xl cursor-pointer pointer-events-auto"
            style={{
              left: element.left,
              top: element.top,
              animation: element.isGlowing 
                ? `glow-pulse 0.6s ease-in-out` 
                : `float ${element.duration}s ease-in-out ${element.delay}s infinite`,
              filter: element.isGlowing 
                ? 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 20px rgba(100, 200, 255, 0.8))' 
                : 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.3))',
              transform: element.isGlowing ? 'scale(1.5)' : 'scale(1)',
              zIndex: element.isGlowing ? 50 : 30,
              transition: 'transform 0.2s ease-out',
            }}
            onClick={(e) => {
              e.stopPropagation();
              console.log('Clicked element:', element.id);
              toggleGlow(element.id);
            }}
          >
            {element.emoji}
          </div>
        ))}
      </div>
    </div>
  );
};

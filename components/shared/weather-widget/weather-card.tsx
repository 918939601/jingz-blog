'use client';

import React from 'react';
import { Location, Weather } from './types';

interface WeatherCardProps {
  location: Location | null;
  weather: Weather | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  location,
  weather,
  loading,
  error,
  onRefresh,
}) => {
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
      <div className="w-full rounded-lg border border-white/10 bg-black/30 p-3 backdrop-blur-md md:p-4 lg:w-80 lg:sticky lg:right-4 lg:top-4">
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
      <div className="w-full rounded-lg border border-white/10 bg-black/30 p-3 backdrop-blur-md md:p-4 lg:w-80 lg:sticky lg:right-4 lg:top-4">
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
    <div className="w-full rounded-lg border border-white/10 bg-black/30 p-3 backdrop-blur-md md:p-4 lg:w-80 lg:sticky lg:right-4 lg:top-4">
      {/* Location Header */}
      <div className="mb-2 flex items-center justify-between gap-2 md:mb-3">
        <div className="truncate text-xs text-white/80 md:text-sm">
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
          <div className="text-2xl md:text-3xl font-bold text-white">
            {Math.round(weather.temperature)}°C
          </div>
          <div className="text-xs md:text-sm text-white/70 truncate">
            {weather.description}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-1 border-t border-white/10 pt-2 md:space-y-2 md:pt-3">
        <div className="flex justify-between text-xs md:text-sm text-white/70">
          <span>体感温度</span>
          <span className="font-semibold text-white">
            {Math.round(weather.feelsLike)}°C
          </span>
        </div>
        <div className="flex justify-between text-xs md:text-sm text-white/70">
          <span>💧 湿度</span>
          <span className="font-semibold text-white">{weather.humidity}%</span>
        </div>
        <div className="flex justify-between text-xs md:text-sm text-white/70">
          <span>💨 风速</span>
          <span className="font-semibold text-white">
            {Math.round(weather.windSpeed)} km/h
          </span>
        </div>
      </div>
    </div>
  );
};

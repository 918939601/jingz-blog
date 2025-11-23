'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { fetchWeatherInfo, fetchWeatherByCoordinates } from '@/lib/api/weather';
import { WeatherCard } from './weather-card';
import { WeatherWidgetState } from './types';

export const WeatherWidget: React.FC = () => {
  const [state, setState] = useState<WeatherWidgetState>({
    location: null,
    weather: null,
    loading: true,
    error: null,
  });

  /**
   * Load weather data with fallback strategy
   */
  const loadWeatherData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const loadByIP = async () => {
      try {
        console.log('Loading weather by IP...');
        const data = await fetchWeatherInfo();
        console.log('Weather data loaded:', data);
        setState({
          location: data.location,
          weather: data.weather,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Failed to load weather by IP:', error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : '加载天气信息失败',
        }));
      }
    };

    try {
      // Try browser geolocation first
      if (navigator.geolocation) {
        console.log('Requesting geolocation...');
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              console.log(`Got geolocation: ${latitude}, ${longitude}`);
              const data = await fetchWeatherByCoordinates(latitude, longitude);
              setState({
                location: data.location,
                weather: data.weather,
                loading: false,
                error: null,
              });
            } catch (error) {
              console.error('Failed with geolocation, falling back to IP:', error);
              loadByIP();
            }
          },
          (error) => {
            console.warn('Geolocation not available, using IP:', error);
            loadByIP();
          }
        );
      } else {
        console.log('Geolocation not supported, using IP');
        loadByIP();
      }
    } catch (error) {
      console.error('Failed to load weather:', error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '加载天气信息失败',
      }));
    }
  }, []);

  /**
   * Handle manual refresh
   */
  const handleRefresh = useCallback(() => {
    loadWeatherData();
  }, [loadWeatherData]);

  /**
   * Setup auto-refresh every 10 minutes
   */
  const setupAutoRefresh = useCallback(() => {
    const interval = setInterval(() => {
      loadWeatherData();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loadWeatherData]);

  // Initial load on component mount
  useEffect(() => {
    loadWeatherData();
  }, [loadWeatherData]);

  // Setup auto-refresh
  useEffect(() => {
    return setupAutoRefresh();
  }, [setupAutoRefresh]);

  return (
    <WeatherCard
      location={state.location}
      weather={state.weather}
      loading={state.loading}
      error={state.error}
      onRefresh={handleRefresh}
    />
  );
};

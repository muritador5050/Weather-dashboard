// import { useState, useCallback, useRef, useEffect } from 'react';
// import {
//   get5DayForecast,
//   getCurrentWeatherByCity,
// } from '../services/WeatherApi';
// import type {
//   ForecastItem,
//   ProcessedDailyForecast,
//   WeatherApiResponse,
// } from '../types/Weather';
// import type { UVIndexResponse } from '../components/UVindex';

// export function useWeather(city: string, intervalMs = 300000) {
//   const [current, setCurrent] = useState<WeatherApiResponse | null>(null);
//   const [forecast, setForecast] = useState<ProcessedDailyForecast[] | null>(
//     null
//   );
//   const [uv, setUv] = useState<UVIndexResponse>();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const intervalRef = useRef<NodeJS.Timeout>();

//   const processForecastData = (
//     forecastList: ForecastItem[]
//   ): ProcessedDailyForecast[] => {
//     const dailyData = new Map();

//     forecastList.forEach((item) => {
//       const date = new Date(item.dt * 1000).toDateString();

//       if (!dailyData.has(date)) {
//         dailyData.set(date, {
//           dt: item.dt,
//           temp_min: item.main.temp_min,
//           temp_max: item.main.temp_max,
//           weather: item.weather[0],
//           humidity: item.main.humidity,
//           speed: item.wind.speed,
//           pop: item.pop,
//         });
//       }

//       const dayData = dailyData.get(date);
//       dayData.temp_min = Math.min(dayData.temp_min, item.main.temp_min);
//       dayData.temp_max = Math.max(dayData.temp_max, item.main.temp_max);
//       dayData.humidity = item.main.humidity;
//       dayData.speed = item.wind.speed;
//       dayData.pop = item.pop;
//     });

//     return Array.from(dailyData.values()).slice(0, 5);
//   };

//   const fetchWeather = useCallback(async () => {
//     const API_KEY = import.meta.env.VITE_APP_WEATHER_API_KEY;
//     if (!city) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const data = await getCurrentWeatherByCity(city);
//       const uvData = await fetch(
//         `https://api.openweathermap.org/data/2.5/uvi?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${API_KEY}`
//       );
//       const uvResponse = await uvData.json();
//       setUv({ value: uvResponse.value });

//       const forecastData = await get5DayForecast(city);
//       const processedForecast = processForecastData(forecastData.list);
//       setForecast(processedForecast);
//       setCurrent(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to load weather');
//     } finally {
//       setLoading(false);
//     }
//   }, [city]);

//   useEffect(() => {
//     fetchWeather();

//     // Set up auto-refresh
//     if (intervalMs > 0) {
//       intervalRef.current = setInterval(fetchWeather, intervalMs);
//     }

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [fetchWeather, intervalMs]);

//   const refresh = useCallback(() => {
//     fetchWeather();
//   }, [fetchWeather]);

//   return { current, uv, forecast, loading, error, refresh };
// }

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  get5DayForecast,
  getCurrentWeatherByCity,
} from '../services/WeatherApi';
import type {
  ForecastItem,
  ProcessedDailyForecast,
  WeatherApiResponse,
} from '../types/Weather';
import type { UVIndexResponse } from '../components/UVindex';

interface Coordinates {
  lat: number;
  lon: number;
}

export function useWeather(
  city: string,
  intervalMs = 300000,
  coordinates: Coordinates | null = null
) {
  const [current, setCurrent] = useState<WeatherApiResponse | null>(null);
  const [forecast, setForecast] = useState<ProcessedDailyForecast[] | null>(
    null
  );
  const [uv, setUv] = useState<UVIndexResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const processForecastData = (
    forecastList: ForecastItem[]
  ): ProcessedDailyForecast[] => {
    const dailyData = new Map();

    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();

      if (!dailyData.has(date)) {
        dailyData.set(date, {
          dt: item.dt,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          weather: item.weather[0],
          humidity: item.main.humidity,
          speed: item.wind.speed,
          pop: item.pop,
        });
      }

      const dayData = dailyData.get(date);
      dayData.temp_min = Math.min(dayData.temp_min, item.main.temp_min);
      dayData.temp_max = Math.max(dayData.temp_max, item.main.temp_max);
      dayData.humidity = item.main.humidity;
      dayData.speed = item.wind.speed;
      dayData.pop = item.pop;
    });

    return Array.from(dailyData.values()).slice(0, 5);
  };

  const fetchWeatherByCoordinates = useCallback(async (coords: Coordinates) => {
    const API_KEY = import.meta.env.VITE_APP_WEATHER_API_KEY;

    // Fetch current weather by coordinates
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`
    );

    if (!currentResponse.ok) {
      throw new Error(`Weather API error: ${currentResponse.status}`);
    }

    const currentData = await currentResponse.json();

    // Fetch UV data
    const uvResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/uvi?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}`
    );
    const uvData = await uvResponse.json();
    setUv({ value: uvData.value });

    // Fetch 5-day forecast by coordinates
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`
    );

    if (!forecastResponse.ok) {
      throw new Error(`Forecast API error: ${forecastResponse.status}`);
    }

    const forecastData = await forecastResponse.json();
    const processedForecast = processForecastData(forecastData.list);

    setForecast(processedForecast);
    setCurrent(currentData);
  }, []);

  const fetchWeatherByCity = useCallback(async (cityName: string) => {
    const data = await getCurrentWeatherByCity(cityName);
    const API_KEY = import.meta.env.VITE_APP_WEATHER_API_KEY;

    const uvData = await fetch(
      `https://api.openweathermap.org/data/2.5/uvi?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${API_KEY}`
    );
    const uvResponse = await uvData.json();
    setUv({ value: uvResponse.value });

    const forecastData = await get5DayForecast(cityName);
    const processedForecast = processForecastData(forecastData.list);
    setForecast(processedForecast);
    setCurrent(data);
  }, []);

  const fetchWeather = useCallback(async () => {
    // Don't fetch if we have neither city nor coordinates
    if (!city && !coordinates) return;

    setLoading(true);
    setError(null);

    try {
      // Prioritize coordinates over city name
      if (coordinates) {
        await fetchWeatherByCoordinates(coordinates);
      } else if (city) {
        await fetchWeatherByCity(city);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather');
    } finally {
      setLoading(false);
    }
  }, [city, coordinates, fetchWeatherByCoordinates, fetchWeatherByCity]);

  useEffect(() => {
    fetchWeather();

    // Set up auto-refresh
    if (intervalMs > 0) {
      intervalRef.current = setInterval(fetchWeather, intervalMs);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchWeather, intervalMs]);

  const refresh = useCallback(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { current, uv, forecast, loading, error, refresh };
}

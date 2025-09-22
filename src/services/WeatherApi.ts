import type { ForecastResponse, WeatherApiResponse } from '../types/Weather';

export const KEY = import.meta.env.VITE_APP_WEATHER_API_KEY;
export const BASE = 'https://api.openweathermap.org/data/2.5';
export const GEO_BASE = 'https://api.openweathermap.org/geo/1.0';
export const MAP_BASE = 'https://api.openweathermap.org/maps/1.0';

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

// Current Weather APIs
interface GetCurrentWeatherByCityParams {
  city: string;
}

export async function getCurrentWeatherByCity(
  city: GetCurrentWeatherByCityParams['city']
): Promise<WeatherApiResponse> {
  const q = encodeURIComponent(city);
  const url = `${BASE}/weather?q=${q}&units=metric&appid=${KEY}`;
  return fetchJSON<WeatherApiResponse>(url);
}

export async function get5DayForecast(city: string): Promise<ForecastResponse> {
  const q = encodeURIComponent(city);
  const url = `${BASE}/forecast?q=${q}&units=metric&appid=${KEY}`;
  return fetchJSON<ForecastResponse>(url);
}

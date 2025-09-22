export interface WeatherApiResponse {
  base: string;
  clouds: {
    all: number;
  };
  cod: number;
  coord: {
    lat: number;
    lon: number;
  };
  dt: number;
  id: number;
  main: {
    feels_like: number;
    grnd_level: number;
    humidity: number;
    pressure: number;
    sea_level: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  name: string;
  sys: {
    country: string;
    id: number;
    sunrise: number;
    sunset: number;
    type: number;
  };
  timezone: number;
  visibility: number;
  weather: Array<{
    description: string;
    icon: string;
    id: number;
    main: string;
  }>;
  wind: {
    deg: number;
    gust: number;
    speed: number;
  };
}

export interface CurrentWeatherProps {
  data: WeatherApiResponse;
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  pop: number;
  dt_txt: string;
}

export interface ForecastResponse {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
  };
}

export interface ProcessedDailyForecast {
  dt: number;
  temp: number;
  humidity: number;
  temp_min: number;
  temp_max: number;
  weather: {
    id: number;
    icon: string;
    main: string;
    description: string;
  };

  speed: number;

  pop: number;
  dt_txt: string;
}

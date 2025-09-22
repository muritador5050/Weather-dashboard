export const formatTime = (timestamp: number, timezone: number): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toUTCString().slice(17, 22);
};

export const formatTemperature = (temp: number, isMax: boolean = false) => {
  const rounded = Math.round(temp);

  const coldThreshold = 10;
  const hotThreshold = 25;

  if (rounded <= coldThreshold) {
    return isMax ? `High -${Math.abs(rounded)}°` : `Low -${Math.abs(rounded)}°`;
  } else if (rounded >= hotThreshold) {
    return isMax ? `High +${rounded}°` : `Low +${rounded}°`;
  }

  return `${rounded}°`;
};

export const getDayOfWeek = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

export const getWeatherIcon = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

export const capitalizeFirstLetter = (string: string): string => {
  return string?.charAt(0).toUpperCase() + string?.slice(1) || '';
};

export const getCurrentDateTime = (): string => {
  const date = new Date();

  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return `${day},${month},${year} ${time}`;
};

export const getCurrentTime = (): string => {
  const date = new Date();
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

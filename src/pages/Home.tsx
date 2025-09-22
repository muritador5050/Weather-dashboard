import {
  SimpleGrid,
  Stack,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
} from '@chakra-ui/react';
import WindStatus from '../components/WindStatus';
import UVindex from '../components/UVindex';
import SunsetAndSunrise from '../components/SunsetAndSunrise';
import Humidity from '../components/Humidity';
import Visisbility from '../components/Visibility';
import FeelLike from '../components/FeelLike';
import WeatherMap from '../components/WeatherMap';
import WeeklyForecast from '../components/WeeklyForecast';
import { useWeather } from '../hooks/useWeather';
import Loader from '../components/LoadingSpinner';
import {
  parentGradient,
  borderRadius,
  padding,
  componentTextStyles,
} from '../utils/styles';
import { useState } from 'react';
import WeatherCard from '../components/WeatherCard';

export default function Home() {
  //state
  const [city, setCity] = useState(() => {
    return localStorage.getItem('weatherCity') || 'London';
  });
  const { current, uv, forecast, loading, error } = useWeather(city);

  //Handlesearch
  function handleSearch(newCity: string) {
    setCity(newCity);
    localStorage.setItem('weatherCity', newCity);
  }

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Alert status='error' borderRadius={borderRadius}>
        <AlertIcon />
        <AlertTitle>Weather data unavailable!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Stack spacing={6} flex={1}>
      <Flex gap={6} direction={{ base: 'column', md: 'row' }}>
        {current && <WeatherCard data={current} handleSearch={handleSearch} />}
        <SimpleGrid
          flex={1}
          bgGradient={parentGradient}
          borderRadius={borderRadius}
          p={padding}
          spacing={5}
        >
          <Text color={componentTextStyles.cardTitle.color}>
            Today's Highlight
          </Text>
          <Flex gap={6} direction={{ base: 'column', md: 'row' }}>
            {current && <WindStatus data={current} />}
            {current && <UVindex {...uv} />}
            {current && <SunsetAndSunrise data={current} />}
          </Flex>
          <Flex gap={6} direction={{ base: 'column', md: 'row' }}>
            {current && <Humidity data={current} />}
            {current && <Visisbility data={current} />}
            {current && <FeelLike data={current} />}
          </Flex>
        </SimpleGrid>
      </Flex>
      <Flex gap={6} direction={{ base: 'column', md: 'row' }}>
        {forecast && <WeeklyForecast forecast={forecast} />}
        {current && <WeatherMap data={current} />}
      </Flex>
    </Stack>
  );
}

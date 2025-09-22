import { Box, VStack, HStack, Text, Image } from '@chakra-ui/react';
import { parentGradient, borderRadius, padding } from '../utils/styles';
import { formatTemperature } from '../utils/helpers';

interface ProcessedDailyForecast {
  dt: number;
  temp_min: number;
  temp_max: number;
  weather: {
    icon: string;
    description: string;
  };
}

interface WeeklyForecastProps {
  forecast: ProcessedDailyForecast[] | null;
}

export default function WeeklyForecast({ forecast }: WeeklyForecastProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!forecast) {
    return (
      <Box
        width={{ base: 'full', md: '40%' }}
        borderRadius={borderRadius}
        p={padding}
        bgGradient={parentGradient}
      >
        <Text>Loading forecast...</Text>
      </Box>
    );
  }

  return (
    <Box
      width={{ base: 'full', md: '30%' }}
      borderRadius={borderRadius}
      p={padding}
      bgGradient={parentGradient}
    >
      <Text fontSize='lg' fontWeight='bold' mb={4}>
        5-Day Forecast
      </Text>
      <VStack spacing={3} align='start'>
        {forecast.map((day) => (
          <HStack key={day.dt} spacing={9}>
            <Image
              src={`https://openweathermap.org/img/w/${day.weather.icon}.png`}
              alt={day.weather.description}
              boxSize='40px'
            />
            <HStack>
              <Text fontSize='sm' fontWeight='bold'>
                {formatTemperature(day.temp_max, true)}
              </Text>
              <Text>/</Text>
              <Text fontSize='sm' color='gray.400'>
                {formatTemperature(day.temp_min, false)}
              </Text>
            </HStack>
            <Text fontSize='sm' minWidth='70px'>
              {formatDate(day.dt)}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}

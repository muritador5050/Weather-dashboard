import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  Card,
  CardBody,
} from '@chakra-ui/react';
import {
  parentGradient,
  borderRadius,
  padding,
  textColors,
} from '../utils/styles';
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
      width={{ base: 'full', md: '40%' }}
      borderRadius={borderRadius}
      p={padding}
      bgGradient={parentGradient}
    >
      <Text
        fontSize='xl'
        color={textColors.primary}
        fontWeight='bold'
        mb={4}
        textAlign='center'
      >
        5-Day Forecast
      </Text>

      <VStack spacing={4} align='stretch'>
        {forecast.map((day) => (
          <Card
            key={day.dt}
            borderRadius='xl'
            boxShadow='md'
            _hover={{ boxShadow: 'xl', transform: 'scale(1.02)' }}
            transition='all 0.2s'
            bg='whiteAlpha.100'
          >
            <CardBody>
              <HStack justify='space-between' align='center'>
                {/* Weather Icon */}
                <Image
                  src={`https://openweathermap.org/img/w/${day.weather.icon}.png`}
                  alt={day.weather.description}
                  boxSize='50px'
                />

                {/* Temperature */}
                <HStack>
                  <Text
                    fontSize='md'
                    color={textColors.primary}
                    fontWeight='bold'
                  >
                    {formatTemperature(day.temp_max, true)}
                  </Text>
                  <Text color={textColors.primary}>/</Text>
                  <Text fontSize='md' color={textColors.primary}>
                    {formatTemperature(day.temp_min, false)}
                  </Text>
                </HStack>

                {/* Date */}
                <Text fontSize='sm' color='gray.300' fontWeight='medium'>
                  {formatDate(day.dt)}
                </Text>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </VStack>
    </Box>
  );
}

import {
  Box,
  Text,
  Heading,
  HStack,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  Image,
} from '@chakra-ui/react';
import { type CurrentWeather } from '../types/Weather';

interface Props {
  data: CurrentWeather;
}

export default function WeatherCard({ data }: Props) {
  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  return (
    <Box borderRadius='md' p={4} boxShadow='md' bgColor='chakra-subtle-bg'>
      <HStack spacing={6} align='center'>
        <Image src={icon} alt={data.weather[0].description} boxSize='80px' />
        <VStack align='start' spacing={0}>
          <Heading size='lg'>{data.name}</Heading>
          <Text textTransform='capitalize'>{data.weather[0].description}</Text>
        </VStack>
        <VStack ml='auto' align='end'>
          <Heading>{Math.round(data.main.temp)}°C</Heading>
          <Text fontSize='sm'>
            Feels like {Math.round(data.main.feels_like)}°C
          </Text>
        </VStack>
      </HStack>

      <HStack mt={4} spacing={4} justify='space-between'>
        <Stat>
          <StatLabel>Humidity</StatLabel>
          <StatNumber>{data.main.humidity}%</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Pressure</StatLabel>
          <StatNumber>{data.main.pressure} hPa</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Wind</StatLabel>
          <StatNumber>{data.wind.speed} m/s</StatNumber>
        </Stat>
      </HStack>
    </Box>
  );
}

import { Box } from '@chakra-ui/react';
import SearchBar from './SearchBar';
import { parentGradient, borderRadius, padding } from '../utils/styles';

export default function WeatherForecast() {
  return (
    <Box
      width={{ base: 'full', md: '40%' }}
      p={padding}
      borderRadius={borderRadius}
      bgGradient={parentGradient}
    >
      WeatherForecast <SearchBar onSearch={() => {}} />{' '}
    </Box>
  );
}

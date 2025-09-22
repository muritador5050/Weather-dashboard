import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import {
  borderRadius,
  childGradient,
  padding,
  componentTextStyles,
} from '../utils/styles';
import type { CurrentWeatherProps } from '../types/Weather';
import { formatTime } from '../utils/helpers';
import SunriseToSunsetArc from '../utils/SunriseToSunsetArc';

export default function SunsetAndSunrise({ data }: CurrentWeatherProps) {
  return (
    <Stack
      spacing={5}
      flex={1}
      minH={{ base: 'max-content', md: '250px' }}
      p={padding}
      borderRadius={borderRadius}
      bgGradient={childGradient}
    >
      <Text {...componentTextStyles.cardTitle}>Sunset & Sunrise</Text>

      <Box>
        <SunriseToSunsetArc
          sunrise={data.sys.sunrise}
          sunset={data.sys.sunset}
          timezone={data.timezone}
        />
      </Box>
      <Flex
        justify='space-between'
        mt={6}
        pt={4}
        borderTopWidth={1}
        borderColor='whiteAlpha.300'
      >
        <Box>
          <Text fontSize='sm' color='yellow.100'>
            Sunrise
          </Text>
          <Text fontWeight='bold' color='white'>
            {formatTime(data?.sys.sunrise, data?.timezone)}AM
          </Text>
        </Box>
        <Box>
          <Text fontSize='sm' color='yellow.100'>
            Sunset
          </Text>
          <Text fontWeight='bold' color='white'>
            {formatTime(data?.sys.sunset, data?.timezone)}PM
          </Text>
        </Box>
      </Flex>
    </Stack>
  );
}

import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { borderRadius, childGradient, padding } from '../utils/styles';
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
      <Text textAlign='start'>Sunset & Sunrise</Text>

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
        borderColor='gray.100'
      >
        <Box>
          <Text fontSize='sm' color='yellow.500'>
            Sunrise
          </Text>
          <Text fontWeight='medium'>
            {formatTime(data?.sys.sunrise, data?.timezone)}AM
          </Text>
        </Box>
        <Box>
          <Text fontSize='sm' color='yellow.500'>
            Sunset
          </Text>
          <Text fontWeight='medium'>
            {formatTime(data?.sys.sunset, data?.timezone)}PM
          </Text>
        </Box>
      </Flex>
    </Stack>
  );
}

import { Box, Text, VStack, Icon, Flex } from '@chakra-ui/react';
import { padding, childGradient, borderRadius } from '../utils/styles';
import type { CurrentWeatherProps } from '../types/Weather';
import { WiHumidity } from 'react-icons/wi';

export default function Humidity({ data }: CurrentWeatherProps) {
  return (
    <Box
      flex={1}
      minH={{ base: 'max-content', md: '80px' }}
      p={padding}
      borderRadius={borderRadius}
      bgGradient={childGradient}
    >
      <Flex justify='space-between' align='center'>
        <VStack spacing={6}>
          <Text>Humidity</Text>
          <Text fontWeight='bold'>{data?.main.humidity}%</Text>
        </VStack>

        <VStack spacing={6}>
          <Icon as={WiHumidity} color='white' />
          <Text maxW='sm' fontSize='sm'>
            {data.main.humidity > 60 ? 'High humidity' : 'Low humidity'}
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
}

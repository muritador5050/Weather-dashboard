import { Card, CardBody, Text, VStack, Icon, Flex } from '@chakra-ui/react';
import {
  padding,
  childGradient,
  borderRadius,
  componentTextStyles,
} from '../utils/styles';
import type { CurrentWeatherProps } from '../types/Weather';
import { WiHumidity } from 'react-icons/wi';

export default function Humidity({ data }: CurrentWeatherProps) {
  return (
    <Card
      flex={1}
      minH={{ base: 'max-content', md: '80px' }}
      borderRadius={borderRadius}
      bgGradient={childGradient}
      variant='gradient'
    >
      <CardBody p={padding}>
        <Flex justify='space-between' align='center'>
          <VStack spacing={6} align='flex-start'>
            <Text {...componentTextStyles.cardTitle}>Humidity</Text>
            <Text {...componentTextStyles.cardValue}>
              {data.main.humidity}%
            </Text>
          </VStack>

          <VStack spacing={6} align='flex-end'>
            <Icon as={WiHumidity} color='white' boxSize={6} />
            <Text {...componentTextStyles.cardDescription}>
              {data.main.humidity > 60 ? 'High humidity' : 'Low humidity'}
            </Text>
          </VStack>
        </Flex>
      </CardBody>
    </Card>
  );
}

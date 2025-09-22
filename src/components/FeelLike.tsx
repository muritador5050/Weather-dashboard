import { Card, CardBody, Flex, Text, VStack, Icon } from '@chakra-ui/react';
import {
  borderRadius,
  childGradient,
  padding,
  componentTextStyles,
} from '../utils/styles';
import type { CurrentWeatherProps } from '../types/Weather';
import { Thermometer } from 'lucide-react';

export default function FeelLike({ data }: CurrentWeatherProps) {
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
            <Text {...componentTextStyles.cardTitle}>Feel Like</Text>
            <Flex align='center'>
              <Icon as={Thermometer} boxSize={6} color='white' mr={2} />
              <Text {...componentTextStyles.cardValue}>
                {data?.main.feels_like}°
              </Text>
            </Flex>
          </VStack>

          <Text {...componentTextStyles.cardDescription}>
            {data.main.feels_like > 30 ? 'Feels too hot' : 'Feels just right'}
          </Text>
        </Flex>
      </CardBody>
    </Card>
  );
}

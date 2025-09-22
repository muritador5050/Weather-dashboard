import { Card, CardBody, VStack, Flex, Icon, Text } from '@chakra-ui/react';
import {
  padding,
  borderRadius,
  childGradient,
  componentTextStyles,
} from '../utils/styles';
import type { CurrentWeatherProps } from '../types/Weather';
import { Eye } from 'lucide-react';

export default function Visibility({ data }: CurrentWeatherProps) {
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
            <Text {...componentTextStyles.cardTitle}>Visibility</Text>
            <Text {...componentTextStyles.cardValue}>
              {(data.visibility / 1000).toFixed(1)}km
            </Text>
          </VStack>

          <VStack spacing={6} align='flex-end'>
            <Icon as={Eye} color='white' boxSize={6} />
            <Text {...componentTextStyles.cardDescription}>
              {data.visibility > 8 ? 'Crystal clear view' : 'Hazy conditions'}
            </Text>
          </VStack>
        </Flex>
      </CardBody>
    </Card>
  );
}

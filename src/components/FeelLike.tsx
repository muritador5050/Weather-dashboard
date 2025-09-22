import { Box, Flex, Text, VStack, Icon } from '@chakra-ui/react';
import { borderRadius, childGradient, padding } from '../utils/styles';
import type { CurrentWeatherProps } from '../types/Weather';
import { Thermometer } from 'lucide-react';

export default function FeelLike({ data }: CurrentWeatherProps) {
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
          <Text> FeelLike</Text>
          <Flex align='center'>
            <Icon as={Thermometer} boxSize={8} color='white' />
            <Text fontWeight='bold'>{data?.main.feels_like}°</Text>
          </Flex>
        </VStack>

        <Text maxW='sm' fontSize='sm' mb='-12'>
          {data.main.feels_like > 30 ? 'Feels too hot' : 'Feels just right'}
        </Text>
      </Flex>
    </Box>
  );
}

import { Box, VStack, Flex, Icon, Text } from '@chakra-ui/react';
import { padding, borderRadius, childGradient } from '../utils/styles';
import type { CurrentWeatherProps } from '../types/Weather';
import { Eye } from 'lucide-react';

export default function Visisbility({ data }: CurrentWeatherProps) {
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
          <Text> Visibility</Text>
          <Text fontWeight='bold'>{data?.visibility}km</Text>
        </VStack>

        <VStack spacing={6}>
          <Icon as={Eye} color='white' />
          <Text maxW='sm' fontSize='sm'>
            {data.visibility > 8000 ? 'Crystal clear view' : 'Hazy conditions'}
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
}

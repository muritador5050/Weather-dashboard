import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  borderRadius,
  childGradient,
  padding,
  componentTextStyles,
} from '../utils/styles';

export interface UVIndexResponse {
  lat?: number;
  lon?: number;
  date_iso?: string;
  date?: number;
  value?: number;
}

export default function UVindex({ value }: UVIndexResponse) {
  const uvValue = value ?? 0;

  const getUVDescription = (uvValue: number): string => {
    if (uvValue <= 2) return 'Low - Safe';
    if (uvValue <= 5) return 'Moderate';
    if (uvValue <= 7) return 'High - Use protection';
    if (uvValue <= 10) return 'Very High - Seek shade';
    return 'Extreme - Avoid sun';
  };

  const getUVColor = (uvValue: number): string => {
    if (uvValue <= 2) return '#4CAF50';
    if (uvValue <= 5) return '#FFEB3B';
    if (uvValue <= 7) return '#FF9800';
    if (uvValue <= 10) return '#F44336';
    return '#9C27B0';
  };

  // Create gauge data (semicircle)
  const maxUV = 12;
  const percentage = Math.min(uvValue / maxUV, 1);

  const data = [
    { name: 'filled', value: percentage * 180 },
    { name: 'empty', value: 180 - percentage * 180 },
  ];

  return (
    <Stack
      spacing={3}
      flex={1}
      minH={{ base: 'max-content', md: '250px' }}
      p={padding}
      borderRadius={borderRadius}
      bgGradient={childGradient}
    >
      <Flex justify='space-between'>
        <Text {...componentTextStyles.cardTitle}>UV Index</Text>
        <Text fontSize='sm' color='yellow.100' fontWeight='medium'>
          {getUVDescription(uvValue)}
        </Text>
      </Flex>

      <Box position='relative' height='200px'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='65%'
              startAngle={180}
              endAngle={0}
              innerRadius='50%'
              outerRadius='90%'
              dataKey='value'
            >
              <Cell fill={getUVColor(uvValue)} />
              <Cell fill='white' fillOpacity={0.2} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Text fontSize='xl' textAlign='center' fontWeight='bold' color='white'>
        {uvValue}UV
      </Text>
    </Stack>
  );
}

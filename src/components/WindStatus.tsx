import { Card, CardBody, Flex, Stack, Text } from '@chakra-ui/react';
import {
  borderRadius,
  childGradient,
  padding,
  componentTextStyles,
} from '../utils/styles';
import type { CurrentWeatherProps } from '../types/Weather';
import { getCurrentTime } from '../utils/helpers';
import {
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  ResponsiveContainer,
} from 'recharts';

export default function WindStatus({ data }: CurrentWeatherProps) {
  const windChartData = [
    {
      name: 'Current',
      speed: data.wind.speed,
      direction: data.wind.deg,
      gust: data.wind.gust || data.wind.speed,
    },
    {
      name: 'Average',
      speed: data.wind.speed * 0.8,
      direction: data.wind.deg,
      gust: data.wind.gust ? data.wind.gust * 0.9 : data.wind.speed * 0.9,
    },
    {
      name: 'Min',
      speed: data.wind.speed * 0.6,
      direction: data.wind.deg,
      gust: data.wind.gust ? data.wind.gust * 0.7 : data.wind.speed * 0.7,
    },
    {
      name: 'Max',
      speed: data.wind.speed * 1.2,
      direction: data.wind.deg,
      gust: data.wind.gust ? data.wind.gust * 1.1 : data.wind.speed * 1.3,
    },
  ];

  return (
    <Card
      flex={1}
      minH={{ base: 'max-content', md: '250px' }}
      borderRadius={borderRadius}
      bgGradient={childGradient}
      variant='gradient'
    >
      <CardBody p={padding}>
        <Stack spacing={5}>
          <Text {...componentTextStyles.cardTitle}>Wind Status</Text>

          {/* Tiny Line Chart for Wind Direction - On Top */}
          <ResponsiveContainer width='100%' height={80}>
            <LineChart
              data={windChartData}
              margin={{
                top: 5,
                right: 20,
                bottom: 5,
                left: 20,
              }}
            >
              <XAxis
                dataKey='name'
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'white', fontSize: 12 }}
              />
              <Line
                type='monotone'
                dataKey='direction'
                stroke='#fc7d15ff'
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Bar Chart for Wind Speed - Below */}
          <ResponsiveContainer width='100%' height={120}>
            <BarChart
              data={windChartData}
              margin={{
                top: 5,
                right: 20,
                bottom: 5,
                left: 20,
              }}
            >
              <XAxis dataKey='name' tick={{ fill: 'white', fontSize: 12 }} />
              <Bar dataKey='speed' fill='#ffffff' opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>

          <Flex justify='space-between' align='center'>
            <Text color='white'>
              <Text as='span' fontSize='3xl' color='white' fontWeight='bold'>
                {data.wind.speed}
              </Text>
              km/h
            </Text>
            <Text color='gray.100' fontSize='sm'>
              {getCurrentTime()}
            </Text>
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
}

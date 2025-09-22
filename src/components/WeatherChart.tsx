import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { type ForecastData } from '../types/Weather';

interface WeatherChartProps {
  data: ForecastData;
}

const WeatherChart: React.FC<WeatherChartProps> = ({ data }) => {
  // Prepare data for chart - show temperature for next 24 hours
  const chartData = data.list.slice(0, 8).map((item) => ({
    name: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit' }),
    temp: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
  }));

  return (
    <Box bg='white' p={6} borderRadius='lg' boxShadow='md' mb={6}>
      <Heading as='h3' size='md' mb={4}>
        24-Hour Forecast
      </Heading>

      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type='monotone'
            dataKey='temp'
            stroke='#3182CE'
            strokeWidth={2}
            name='Temperature (°C)'
          />
          <Line
            type='monotone'
            dataKey='feels_like'
            stroke='#E53E3E'
            strokeWidth={2}
            name='Feels Like (°C)'
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default WeatherChart;

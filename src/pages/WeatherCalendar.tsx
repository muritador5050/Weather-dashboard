import React, { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  Box,
  Flex,
  Grid,
  GridItem,
  Badge,
  Card,
  CardBody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Select,
  Image,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  IconButton,
} from '@chakra-ui/react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { useWeather } from '../hooks/useWeather';
import { parentGradient, borderRadius } from '../utils/styles';
import { getWeatherIcon, capitalizeFirstLetter } from '../utils/helpers';
import type { ForecastItem } from '../types/Weather';

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  temp?: number;
  description?: string;
  icon?: string;
  forecastData?: ForecastItem;
}

interface DayWeatherDetail {
  date: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pop: number;
  cityName: string;
}

interface SavedLocation {
  id: string;
  name: string;
  country: string;
  addedAt: string;
}

export default function WeatherCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    return localStorage.getItem('weatherCity') || 'London';
  });
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { current, forecast, loading, error } = useWeather(selectedCity);

  // Load saved cities from localStorage
  useEffect(() => {
    const defaultCities = [
      'berlin',
      'lagos',
      'abuja',
      'mecca',
      'new york',
      'london',
      'tokyo',
    ];
    const savedLocations = localStorage.getItem('savedWeatherLocations');

    if (savedLocations) {
      try {
        const parsedLocations: SavedLocation[] = JSON.parse(savedLocations);
        const savedCityNames = parsedLocations.map((loc) =>
          loc.name.toLowerCase()
        );
        const allCities = [...new Set([...defaultCities, ...savedCityNames])];
        setAvailableCities(allCities);
      } catch (error) {
        console.error('Failed to parse saved locations:', error);
        setAvailableCities(defaultCities);
      }
    } else {
      setAvailableCities(defaultCities);
    }
  }, []);

  // Generate calendar days
  const generateCalendarDays = React.useCallback((): void => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();

    const firstDay = new Date(year, month, 1);

    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const currentCalendarDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentCalendarDate.getMonth() === month;
      const isToday =
        currentCalendarDate.toDateString() === today.toDateString();

      const dayData: CalendarDay = {
        date: new Date(currentCalendarDate),
        dayNumber: currentCalendarDate.getDate(),
        isCurrentMonth,
        isToday,
      };

      if (forecast && isCurrentMonth) {
        const dayForecast = forecast.find((item) => {
          const forecastDate = new Date(item.dt * 1000);
          return (
            forecastDate.toDateString() === currentCalendarDate.toDateString()
          );
        });

        if (dayForecast) {
          const avgTemp = Math.round(
            (dayForecast.temp_min + dayForecast.temp_max) / 2
          );
          dayData.temp = avgTemp;
          dayData.description = dayForecast.weather.description;
          dayData.icon = dayForecast.weather.icon;

          dayData.forecastData = {
            dt: dayForecast.dt,
            main: {
              temp: avgTemp,
              temp_min: dayForecast.temp_min,
              temp_max: dayForecast.temp_max,
              humidity: dayForecast.humidity,
            },
            weather: [
              {
                id: dayForecast.weather.id ?? 0,
                main: dayForecast.weather.main ?? '',
                description: dayForecast.weather.description,
                icon: dayForecast.weather.icon,
              },
            ],
            wind: {
              speed: dayForecast.speed,
            },
            pop: dayForecast.pop,
            dt_txt: new Date(dayForecast.dt * 1000).toISOString(),
          };
        }
      }

      days.push(dayData);
      currentCalendarDate.setDate(currentCalendarDate.getDate() + 1);
    }

    setCalendarDays(days);
  }, [currentDate, forecast]);

  useEffect(() => {
    generateCalendarDays();
  }, [generateCalendarDays]);

  const navigateMonth = (direction: 'prev' | 'next'): void => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleDayClick = (day: CalendarDay): void => {
    if (!day.isCurrentMonth || !day.forecastData) return;
    setSelectedDay(day);
    onOpen();
  };

  const handleCityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const newCity = event.target.value;
    setSelectedCity(newCity);
    localStorage.setItem('weatherCity', newCity);
  };

  const getDetailedDayWeather = (day: CalendarDay): DayWeatherDetail | null => {
    if (!day.forecastData || !current) return null;

    return {
      date: day.date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      temp: Math.round(day.forecastData.main.temp),
      tempMin: Math.round(day.forecastData.main.temp_min),
      tempMax: Math.round(day.forecastData.main.temp_max),
      description: day.forecastData.weather[0].description,
      icon: day.forecastData.weather[0].icon,
      humidity: day.forecastData.main.humidity || 0,
      windSpeed: day.forecastData.wind.speed || 0,
      pop: Math.round(day.forecastData.pop * 100) || 0,
      cityName: current.name,
    };
  };

  const monthNames: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (error) {
    return (
      <Alert status='error' borderRadius={borderRadius}>
        <AlertIcon />
        <AlertTitle>Weather data unavailable!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Stack spacing={6} h='full'>
      {/* Header */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify='space-between'
        align='center'
        gap={4}
      >
        <Flex align='center' gap={2}>
          <CalendarIcon />
          <Text
            fontSize={{ base: 'large', md: 'xl' }}
            fontWeight='bold'
            color='white'
            textAlign={{ base: 'center', md: 'start' }}
          >
            Calendar
          </Text>
        </Flex>

        <Select
          value={selectedCity}
          onChange={handleCityChange}
          w={{ base: 'full', md: '200px' }}
          bg='white'
          color='black'
          isDisabled={loading}
        >
          {availableCities.map((city) => (
            <option key={city} value={city}>
              {city.charAt(0).toUpperCase() + city.slice(1)}
            </option>
          ))}
        </Select>
      </Flex>

      {/* Calendar Navigation */}
      <Card bgGradient={parentGradient} color='white'>
        <CardBody>
          <Flex justify='space-between' align='center' mb={4}>
            <IconButton
              aria-label='Previous'
              icon={<ChevronLeft />}
              onClick={() => navigateMonth('prev')}
              variant='ghost'
              color='white'
              _hover={{ bg: 'whiteAlpha.200' }}
              isDisabled={loading}
            />

            <Text
              fontSize={{ base: 'sm', md: 'xl' }}
              fontWeight={{ base: 'semibold', md: 'bold' }}
            >
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
            <IconButton
              aria-label='Next'
              icon={<ChevronRight />}
              onClick={() => navigateMonth('next')}
              variant='ghost'
              color='white'
              _hover={{ bg: 'whiteAlpha.200' }}
              isDisabled={loading}
            />
          </Flex>

          {/* Week days header */}
          <Grid
            templateColumns='repeat(7, 1fr)'
            // gap={2}
            gap={{ base: 1, md: 2 }}
            mb={2}
          >
            {weekDays.map((day) => (
              <GridItem key={day}>
                <Text
                  textAlign='center'
                  fontWeight='bold'
                  fontSize={{ base: '2xs', md: 'sm' }}
                  opacity={0.7}
                >
                  {day}
                </Text>
              </GridItem>
            ))}
          </Grid>

          {/* Calendar days */}
          <Grid templateColumns='repeat(7, 1fr)' gap={{ base: 1, md: 2 }}>
            {calendarDays.map((day, index) => (
              <GridItem key={index}>
                <Box
                  p={{ base: 1, md: 2 }}
                  textAlign='center'
                  cursor={
                    day.isCurrentMonth && day.forecastData
                      ? 'pointer'
                      : 'default'
                  }
                  borderRadius='md'
                  bg={day.isToday ? 'blue.500' : 'transparent'}
                  opacity={day.isCurrentMonth ? 1 : 0.3}
                  _hover={
                    day.isCurrentMonth && day.forecastData
                      ? { bg: 'whiteAlpha.200' }
                      : {}
                  }
                  onClick={() => handleDayClick(day)}
                  minH={{ base: '60px', md: '80px' }}
                  display='flex'
                  flexDirection='column'
                  justifyContent='space-between'
                  border={day.forecastData ? '1px solid' : 'none'}
                  borderColor={
                    day.forecastData ? 'whiteAlpha.300' : 'transparent'
                  }
                >
                  <Text
                    fontWeight={day.isToday ? 'bold' : 'medium'}
                    fontSize={{ base: 'xs', md: 'sm' }}
                  >
                    {day.dayNumber}
                  </Text>

                  {day.temp && day.icon && (
                    <Box>
                      <Image
                        src={getWeatherIcon(day.icon)}
                        alt={day.description || 'weather'}
                        boxSize={{ base: '16px', md: '20px' }}
                        mx='auto'
                        mb={1}
                      />
                      <Badge
                        colorScheme='blue'
                        variant='solid'
                        fontSize={{ base: '2xs', md: 'xs' }}
                        borderRadius='full'
                      >
                        {day.temp}°
                      </Badge>
                    </Box>
                  )}
                </Box>
              </GridItem>
            ))}
          </Grid>

          {/* Loading/Info Messages */}
          {loading && (
            <Box mt={4} textAlign='center'>
              <Text opacity={0.7}>Loading weather data...</Text>
            </Box>
          )}

          {!loading && (!forecast || forecast.length === 0) && (
            <Box mt={4} textAlign='center'>
              <Text opacity={0.7}>
                No forecast data available for this location
              </Text>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Day Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size='md'>
        <ModalOverlay />
        <ModalContent bgGradient={parentGradient} color='white'>
          <ModalHeader>Weather Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedDay &&
              (() => {
                const dayWeather = getDetailedDayWeather(selectedDay);

                if (!dayWeather) {
                  return <Text>No weather data available for this date.</Text>;
                }

                return (
                  <Stack spacing={4}>
                    <Text fontSize='lg' fontWeight='bold'>
                      {dayWeather.date}
                    </Text>
                    <Text fontSize='md' opacity={0.8}>
                      {dayWeather.cityName}
                    </Text>

                    <Flex align='center' gap={4}>
                      <Image
                        src={getWeatherIcon(dayWeather.icon)}
                        alt={dayWeather.description}
                        boxSize='60px'
                      />
                      <Box>
                        <Text fontSize='3xl' fontWeight='bold'>
                          {dayWeather.temp}°C
                        </Text>
                        <Text>
                          {capitalizeFirstLetter(dayWeather.description)}
                        </Text>
                        <Text fontSize='sm' opacity={0.8}>
                          {dayWeather.tempMin}° - {dayWeather.tempMax}°
                        </Text>
                      </Box>
                    </Flex>

                    <Divider />

                    <Grid templateColumns='repeat(2, 1fr)' gap={4}>
                      <Box>
                        <Text fontSize='sm' opacity={0.7}>
                          Humidity
                        </Text>
                        <Text fontWeight='bold'>{dayWeather.humidity}%</Text>
                      </Box>
                      <Box>
                        <Text fontSize='sm' opacity={0.7}>
                          Wind Speed
                        </Text>
                        <Text fontWeight='bold'>
                          {dayWeather.windSpeed} m/s
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize='sm' opacity={0.7}>
                          Rain Chance
                        </Text>
                        <Text fontWeight='bold'>{dayWeather.pop}%</Text>
                      </Box>
                      <Box>
                        <Text fontSize='sm' opacity={0.7}>
                          Min - Max
                        </Text>
                        <Text fontWeight='bold'>
                          {dayWeather.tempMin}° - {dayWeather.tempMax}°
                        </Text>
                      </Box>
                    </Grid>
                  </Stack>
                );
              })()}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Stack>
  );
}

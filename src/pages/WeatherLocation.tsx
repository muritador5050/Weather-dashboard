import { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  Box,
  Flex,
  Button,
  IconButton,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Card,
  CardBody,
  Badge,
  Center,
  Image,
} from '@chakra-ui/react';
import { MapPin, Plus, Trash2, Navigation } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { useWeather } from '../hooks/useWeather';
import { parentGradient, borderRadius, padding } from '../utils/styles';
import { getWeatherIcon, capitalizeFirstLetter } from '../utils/helpers';
import Loader from '../components/LoadingSpinner';
import { GEO_BASE, KEY } from '../services/WeatherApi';

interface SavedLocation {
  id: string;
  name: string;
  country: string;
  addedAt: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
}

// const GEO_BASE = 'https://api.openweathermap.org/geo/1.0';

export default function WeatherLocation() {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [isAddingLocation, setIsAddingLocation] = useState<boolean>(false);
  const [loadingCurrentLocation, setLoadingCurrentLocation] =
    useState<boolean>(false);
  const [currentLocationCoords, setCurrentLocationCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [geoError, setGeoError] = useState<string>('');

  const {
    current: weatherData,
    loading: weatherLoading,
    error,
  } = useWeather(selectedLocation, 300000, currentLocationCoords);

  useEffect(() => {
    setSavedLocations([]);
  }, []);

  useEffect(() => {
    if (weatherData && selectedLocation) {
      setSavedLocations((prev) =>
        prev.map((location) =>
          location.name.toLowerCase() === selectedLocation.toLowerCase()
            ? { ...location, country: weatherData.sys.country }
            : location
        )
      );
    }
  }, [weatherData, selectedLocation]);

  const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `${GEO_BASE}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${KEY}`
      );

      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data = await response.json();

      if (data.length > 0) {
        const location = data[0];
        return location.name;
      } else {
        return `Location ${lat.toFixed(2)}, ${lon.toFixed(2)}`;
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return `Location ${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    }
  };

  // Handle adding new location
  const handleAddLocation = (cityName: string): void => {
    if (!cityName.trim()) return;

    const exists = savedLocations.some(
      (loc) => loc.name.toLowerCase() === cityName.toLowerCase()
    );

    if (exists) {
      return;
    }

    const newLocation: SavedLocation = {
      id: Date.now().toString(),
      name: cityName,
      country: '',
      addedAt: new Date().toISOString(),
    };

    setSavedLocations((prev) => [...prev, newLocation]);
    setSelectedLocation(cityName);
    setCurrentLocationCoords(null);
    setIsAddingLocation(false);
  };

  // Handle removing location
  const handleRemoveLocation = (locationId: string): void => {
    setSavedLocations((prev) => prev.filter((loc) => loc.id !== locationId));

    // Clear selected location if it's being removed
    const removedLocation = savedLocations.find((loc) => loc.id === locationId);
    if (
      removedLocation &&
      selectedLocation.toLowerCase() === removedLocation.name.toLowerCase()
    ) {
      setSelectedLocation('');
      setCurrentLocationCoords(null);
    }
  };

  // Handle location selection
  const handleLocationSelect = (locationName: string): void => {
    setSelectedLocation(locationName);

    // Find if this location has coordinates
    const location = savedLocations.find(
      (loc) => loc.name.toLowerCase() === locationName.toLowerCase()
    );

    if (location?.coordinates) {
      setCurrentLocationCoords(location.coordinates);
    } else {
      setCurrentLocationCoords(null);
    }
  };

  const getCurrentLocationWeather = (): void => {
    setLoadingCurrentLocation(true);
    setGeoError('');

    if (!('geolocation' in navigator)) {
      setLoadingCurrentLocation(false);
      setGeoError('Geolocation not supported in this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          console.log('Got coordinates:', latitude, longitude);

          // Get city name from coordinates
          const cityName = await reverseGeocode(latitude, longitude);

          console.log('Got city name:', cityName);

          // Set the location data
          setCurrentLocationCoords({ lat: latitude, lon: longitude });
          setSelectedLocation(cityName);

          // Save as a location with coordinates
          const currentLocationData: SavedLocation = {
            id: 'current-location',
            name: cityName,
            country: '',
            addedAt: new Date().toISOString(),
            coordinates: { lat: latitude, lon: longitude },
          };

          setSavedLocations((prev) => {
            const filtered = prev.filter(
              (loc) => loc.id !== 'current-location'
            );
            return [...filtered, currentLocationData];
          });

          setGeoError('');
        } catch (error) {
          console.error('Error processing current location:', error);
          setGeoError('Failed to get location name');
        } finally {
          setLoadingCurrentLocation(false);
        }
      },
      (error) => {
        setLoadingCurrentLocation(false);

        let errorMessage = 'Location access failed';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }

        setGeoError(errorMessage);
        console.error('Geolocation error:', errorMessage, error);
      },
      {
        timeout: 10000,
        enableHighAccuracy: true,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  if (error) {
    return (
      <Center>
        <Alert status='error' borderRadius={borderRadius} maxW='md'>
          <AlertIcon />
          <Box>
            <AlertTitle>Weather Error!</AlertTitle>
            <AlertDescription>
              {error.includes('404')
                ? 'City not found. Please check spelling.'
                : 'Unable to fetch weather data. Please try again.'}
            </AlertDescription>
          </Box>
        </Alert>
      </Center>
    );
  }

  return (
    <Stack spacing={6} h='full'>
      {/* Header */}
      <Flex justify='space-between' align='center' wrap='wrap' gap={4}>
        <Text
          fontSize={{ base: 'md', md: '2xl' }}
          fontWeight='bold'
          color='white'
        >
          Locations
        </Text>
        <Flex gap={3}>
          <Button
            leftIcon={<Navigation />}
            onClick={getCurrentLocationWeather}
            isLoading={loadingCurrentLocation}
            colorScheme='blue'
            variant='outline'
            size='sm'
          >
            <Text display={{ base: 'none', md: 'flex' }}>Current Location</Text>
          </Button>
          <Button
            leftIcon={<Plus />}
            onClick={() => setIsAddingLocation(!isAddingLocation)}
            colorScheme='green'
            size='sm'
          >
            <Text display={{ base: 'none', md: 'flex' }}> Add Location</Text>
          </Button>
        </Flex>
      </Flex>

      {/* Geolocation Error Display */}
      {geoError && (
        <Alert status='warning' borderRadius={borderRadius}>
          <AlertIcon />
          <AlertTitle>Location Error</AlertTitle>
          <AlertDescription>{geoError}</AlertDescription>
        </Alert>
      )}

      {/* Add Location Search */}
      {isAddingLocation && (
        <Box
          p={padding}
          bgGradient={parentGradient}
          borderRadius={borderRadius}
          boxShadow='md'
        >
          <Text mb={3} color='white' fontWeight='medium'>
            Search for a city to add:
          </Text>
          <SearchBar onSearch={handleAddLocation} />
        </Box>
      )}

      {/* Current Weather Display */}
      {selectedLocation && weatherData && (
        <Card bgGradient={parentGradient} color='white'>
          <CardBody>
            <Flex align='center' justify='space-between'>
              <Box>
                <Text fontSize='xl' fontWeight='bold'>
                  {weatherData.name}, {weatherData.sys.country}
                  {currentLocationCoords && (
                    <Badge ml={2} colorScheme='green' variant='solid'>
                      Current Location
                    </Badge>
                  )}
                </Text>
                <Text fontSize='3xl' fontWeight='bold'>
                  {Math.round(weatherData.main.temp)}°C
                </Text>
                <Text>
                  {capitalizeFirstLetter(weatherData.weather[0].description)}
                </Text>
                <Flex mt={2} gap={4} fontSize='sm' opacity={0.8}>
                  <Text>
                    Feels like {Math.round(weatherData.main.feels_like)}°C
                  </Text>
                  <Text>Humidity {weatherData.main.humidity}%</Text>
                  <Text>Wind {Math.round(weatherData.wind.speed)} m/s</Text>
                </Flex>
              </Box>
              <Box>
                <Image
                  src={getWeatherIcon(weatherData.weather[0].icon)}
                  alt={weatherData.weather[0].description}
                  boxSize='100px'
                />
              </Box>
            </Flex>
          </CardBody>
        </Card>
      )}

      {/* Loading State */}
      {weatherLoading && selectedLocation && (
        <Center>
          <Loader />
        </Center>
      )}

      {/* Saved Locations Grid */}
      <Box>
        <Text fontSize='lg' fontWeight='semibold' color='white' mb={4}>
          Saved Locations ({savedLocations.length})
        </Text>

        {savedLocations.length === 0 ? (
          <Alert status='info' borderRadius={borderRadius}>
            <AlertIcon />
            <AlertTitle>No saved locations yet!</AlertTitle>
            <AlertDescription>
              Add your favorite cities to quickly check their weather.
            </AlertDescription>
          </Alert>
        ) : (
          <Grid templateColumns='repeat(auto-fill, minmax(300px, 1fr))' gap={4}>
            {savedLocations.map((location) => (
              <GridItem key={location.id}>
                <Card
                  bgGradient={parentGradient}
                  color='white'
                  cursor='pointer'
                  transition='transform 0.2s, box-shadow 0.2s'
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  border={
                    selectedLocation.toLowerCase() ===
                    location.name.toLowerCase()
                      ? '2px solid'
                      : 'none'
                  }
                  borderColor={
                    selectedLocation.toLowerCase() ===
                    location.name.toLowerCase()
                      ? 'blue.400'
                      : 'transparent'
                  }
                  onClick={() => handleLocationSelect(location.name)}
                >
                  <CardBody>
                    <Flex justify='space-between' align='start'>
                      <Box flex='1'>
                        <Flex align='center' gap={2} mb={2}>
                          <MapPin size={16} />
                          <Text fontWeight='bold'>{location.name}</Text>
                          {location.country && (
                            <Badge colorScheme='blue' variant='subtle'>
                              {location.country}
                            </Badge>
                          )}
                          {location.coordinates && (
                            <Badge colorScheme='whiteAlpha' variant='outline'>
                              GPS
                            </Badge>
                          )}
                        </Flex>
                        <Text fontSize='sm' opacity={0.7}>
                          Added:{' '}
                          {new Date(location.addedAt).toLocaleDateString()}
                        </Text>
                        {selectedLocation.toLowerCase() ===
                          location.name.toLowerCase() && (
                          <Badge colorScheme='green' mt={2} variant='solid'>
                            Active
                          </Badge>
                        )}
                      </Box>
                      <IconButton
                        aria-label={`Remove ${location.name}`}
                        icon={<Trash2 />}
                        size='sm'
                        variant='ghost'
                        colorScheme='gray'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLocation(location.id);
                        }}
                      />
                    </Flex>
                  </CardBody>
                </Card>
              </GridItem>
            ))}
          </Grid>
        )}
      </Box>
    </Stack>
  );
}

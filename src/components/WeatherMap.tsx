import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Select,
  Spinner,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import {
  SettingsIcon,
  SearchIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowForwardIcon,
  ArrowBackIcon,
  ViewIcon,
} from '@chakra-ui/icons';
import { parentGradient, borderRadius, padding } from '../utils/styles';
import type { CurrentWeatherProps } from '../types/Weather';
import { KEY } from '../services/WeatherApi';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LeafletIconDefault extends L.Icon.Default {
  _getIconUrl?: () => string;
}

delete (L.Icon.Default.prototype as LeafletIconDefault)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MAP_LAYERS = {
  clouds_new: 'Clouds',
  precipitation_new: 'Precipitation',
  pressure_new: 'Pressure',
  wind_new: 'Wind',
  temp_new: 'Temperature',
} as const;

type MapLayerKey = keyof typeof MAP_LAYERS;

const ZOOM_LEVELS = [3, 4, 5, 6, 7, 8, 9, 10] as const;
type ZoomLevel = (typeof ZOOM_LEVELS)[number];

type MoveDirection = 'up' | 'down' | 'left' | 'right';

interface MapCenter {
  lat: number;
  lng: number;
}

export default function WeatherMap({ data }: CurrentWeatherProps): JSX.Element {
  const [selectedLayer, setSelectedLayer] =
    useState<MapLayerKey>('precipitation_new');
  const [zoom, setZoom] = useState<ZoomLevel>(6);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [retryCount, setRetryCount] = useState<number>(0);
  const [mapCenter, setMapCenter] = useState<MapCenter>({
    lat: data.coord.lat,
    lng: data.coord.lon,
  });

  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const weatherLayerRef = useRef<L.TileLayer | null>(null);
  const baseLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize map only once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    try {
      // Initialize map
      mapRef.current = L.map(mapContainerRef.current, {
        center: [data.coord.lat, data.coord.lon],
        zoom: zoom,
        zoomControl: false,
        attributionControl: true,
      });

      const tileProviders = [
        {
          url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          name: 'CartoDB',
        },
        {
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: '',
          name: 'OpenStreetMap',
        },
        {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
          subdomains: '',
          name: 'Esri',
        },
      ];

      let providerIndex = 0;

      const tryNextProvider = () => {
        if (providerIndex >= tileProviders.length) {
          setError('All map providers failed to load');
          setLoading(false);
          return;
        }

        const provider = tileProviders[providerIndex];

        // Remove existing base layer if any
        if (baseLayerRef.current && mapRef.current) {
          mapRef.current.removeLayer(baseLayerRef.current);
        }

        baseLayerRef.current = L.tileLayer(provider.url, {
          attribution: provider.attribution,
          opacity: 0.7,
          maxZoom: 18,
          subdomains: provider.subdomains,
        });

        // Handle tile loading errors
        baseLayerRef.current.on('tileerror', () => {
          console.warn(
            `Failed to load tiles from ${provider.name}, trying next provider...`
          );
          providerIndex++;
          setTimeout(tryNextProvider, 1000);
        });

        // Handle successful tile loading
        baseLayerRef.current.on('tileload', () => {
          setLoading(false);
          setError('');
        });

        if (mapRef.current) {
          baseLayerRef.current.addTo(mapRef.current);
        }
      };

      // Start with the first provider
      tryNextProvider();

      // Handle map events with proper typing
      mapRef.current.on('moveend', () => {
        if (mapRef.current) {
          const center = mapRef.current.getCenter();
          setMapCenter({ lat: center.lat, lng: center.lng });
        }
      });

      mapRef.current.on('zoomend', () => {
        if (mapRef.current) {
          setZoom(mapRef.current.getZoom() as ZoomLevel);
        }
      });

      // Fallback timeout in case no tiles load
      setTimeout(() => {
        if (loading) {
          setLoading(false);
        }
      }, 10000);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
      setLoading(false);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [data.coord.lat, data.coord.lon]);

  const updateWeatherLayer = useCallback(() => {
    if (!mapRef.current) return;

    try {
      // Remove existing weather layer
      if (weatherLayerRef.current) {
        mapRef.current.removeLayer(weatherLayerRef.current);
        weatherLayerRef.current = null;
      }

      weatherLayerRef.current = L.tileLayer(
        `https://tile.openweathermap.org/map/${selectedLayer}/{z}/{x}/{y}.png?appid=${KEY}`,
        {
          opacity: 0.6,
          maxZoom: 18,
          errorTileUrl:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=',
        }
      );

      weatherLayerRef.current.on('tileerror', (error) => {
        console.warn('Weather layer tile failed to load:', error);
      });

      weatherLayerRef.current.addTo(mapRef.current);
    } catch (err) {
      console.error('Error updating weather layer:', err);
    }
  }, [selectedLayer]);

  // Update weather layer when selection changes
  useEffect(() => {
    updateWeatherLayer();
  }, [updateWeatherLayer]);

  // Handle zoom changes
  useEffect(() => {
    if (mapRef.current && mapRef.current.getZoom() !== zoom) {
      mapRef.current.setZoom(zoom);
    }
  }, [zoom]);

  const moveMap = useCallback(
    (direction: MoveDirection): void => {
      if (!mapRef.current) return;

      const moveAmount = 0.1 * Math.pow(2, 10 - zoom);
      const center = mapRef.current.getCenter();

      let newLat = center.lat;
      let newLng = center.lng;

      switch (direction) {
        case 'up':
          newLat = center.lat + moveAmount;
          break;
        case 'down':
          newLat = center.lat - moveAmount;
          break;
        case 'left':
          newLng = center.lng - moveAmount;
          break;
        case 'right':
          newLng = center.lng + moveAmount;
          break;
      }

      mapRef.current.panTo([newLat, newLng]);
    },
    [zoom]
  );

  const handleLayerChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>): void => {
      setSelectedLayer(event.target.value as MapLayerKey);
    },
    []
  );

  const handleZoomChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>): void => {
      setZoom(Number(event.target.value) as ZoomLevel);
    },
    []
  );

  const retryMapLoad = useCallback((): void => {
    setRetryCount((prev) => prev + 1);
    setLoading(true);
    setError('');

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  }, []);

  if (error && retryCount < 3) {
    return (
      <Box
        bgGradient={parentGradient}
        p={padding}
        borderRadius={borderRadius}
        flex={1}
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        minH='400px'
      >
        <VStack spacing={4}>
          <Text color='red.400' fontSize='lg' textAlign='center'>
            Map failed to load
          </Text>
          <Text color='white' fontSize='sm' textAlign='center'>
            This might be due to network restrictions or server issues
          </Text>
          <Button colorScheme='blue' onClick={retryMapLoad}>
            Retry Loading Map ({retryCount + 1}/3)
          </Button>
        </VStack>
      </Box>
    );
  }

  if (error && retryCount >= 3) {
    return (
      <Box
        bgGradient={parentGradient}
        p={padding}
        borderRadius={borderRadius}
        flex={1}
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        minH='400px'
      >
        <VStack spacing={4}>
          <Text color='red.400' fontSize='lg' textAlign='center'>
            Map Service Unavailable
          </Text>
          <Text color='white' fontSize='sm' textAlign='center' maxW='300px'>
            Unable to load map tiles. This may be due to network restrictions,
            firewall settings, or temporary server issues.
          </Text>
          <Text color='gray.300' fontSize='xs' textAlign='center'>
            Weather data for {data.name}: {data.weather[0].description}
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      p={padding}
      borderRadius={borderRadius}
      flex={1}
      position='relative'
      overflow='hidden'
      minH='400px'
    >
      {/* Map Container */}
      <Box
        ref={mapContainerRef}
        position='absolute'
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={1}
        borderRadius={borderRadius}
        bgGradient={parentGradient}
      />

      {/* Map Title */}
      <Box
        position='absolute'
        top={4}
        left='50%'
        transform={{ base: 'none', md: 'translateX(-50%)' }}
        zIndex={3}
        bg='rgba(255, 255, 255, 0.95)'
        px={4}
        py={2}
        borderRadius='md'
        boxShadow='md'
      >
        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          fontWeight='bold'
          textAlign='center'
          color='gray.800'
        >
          {data.name} Weather Map - {MAP_LAYERS[selectedLayer]}
        </Text>
      </Box>

      {/* Compact Precipitation Legend */}
      {selectedLayer === 'precipitation_new' && (
        <Box
          position='absolute'
          top={4}
          left={4}
          zIndex={3}
          bg='rgba(255, 255, 255, 0.95)'
          p={2}
          borderRadius='md'
          boxShadow='md'
          maxW='140px'
        >
          <Text fontSize='xs' fontWeight='bold' mb={1} color='gray.800'>
            Precipitation
          </Text>
          <VStack spacing={1}>
            <Box
              h='12px'
              w='100%'
              borderRadius='sm'
              position='relative'
              overflow='hidden'
              border='1px solid'
              borderColor='gray.300'
              background='linear-gradient(to right, #22c55e 0%, #eab308 25%, #f97316 50%, #3b82f6 75%, #8b5cf6 100%)'
            >
              {/* Tick markers */}
              <Box
                position='absolute'
                top='0'
                bottom='0'
                left='20%'
                w='1px'
                bg='white'
                opacity={0.7}
              />
              <Box
                position='absolute'
                top='0'
                bottom='0'
                left='40%'
                w='1px'
                bg='white'
                opacity={0.7}
              />
              <Box
                position='absolute'
                top='0'
                bottom='0'
                left='60%'
                w='1px'
                bg='white'
                opacity={0.7}
              />
              <Box
                position='absolute'
                top='0'
                bottom='0'
                left='80%'
                w='1px'
                bg='white'
                opacity={0.7}
              />
            </Box>
            <HStack
              justify='space-between'
              fontSize='9px'
              color='gray.600'
              w='100%'
            >
              <Text>None</Text>
              <Text>Light</Text>
              <Text>Heavy</Text>
            </HStack>
          </VStack>
        </Box>
      )}

      {/* Mobile-Friendly Control Icons */}
      <VStack position='absolute' bottom={4} right={4} zIndex={3} spacing={2}>
        {/* Layer Selection Popup */}
        <Popover placement='left'>
          <PopoverTrigger>
            <IconButton
              aria-label='Select layer'
              icon={<ViewIcon />}
              size='sm'
              bg='rgba(255, 255, 255, 0.95)'
              color='gray.800'
              _hover={{ bg: 'rgba(255, 255, 255, 1)' }}
              boxShadow='md'
              borderRadius='md'
            />
          </PopoverTrigger>
          <PopoverContent maxW='200px'>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <Text fontSize='sm' mb={2} fontWeight='bold'>
                Weather Layer
              </Text>
              <Select
                value={selectedLayer}
                onChange={handleLayerChange}
                size='sm'
                borderRadius='md'
              >
                {Object.entries(MAP_LAYERS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </Select>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        {/* Zoom Level Popup */}
        <Popover placement='left'>
          <PopoverTrigger>
            <IconButton
              aria-label='Zoom level'
              icon={<SearchIcon />}
              size='sm'
              bg='rgba(255, 255, 255, 0.95)'
              color='gray.800'
              _hover={{ bg: 'rgba(255, 255, 255, 1)' }}
              boxShadow='md'
              borderRadius='md'
            />
          </PopoverTrigger>
          <PopoverContent maxW='150px'>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <Text fontSize='sm' mb={2} fontWeight='bold'>
                Zoom Level
              </Text>
              <Select
                value={zoom}
                onChange={handleZoomChange}
                size='sm'
                borderRadius='md'
              >
                {ZOOM_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    Level {level}
                  </option>
                ))}
              </Select>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        {/* Navigation Controls Popup */}
        <Popover placement='left'>
          <PopoverTrigger>
            <IconButton
              aria-label='Navigation controls'
              icon={<SettingsIcon />}
              size='sm'
              bg='rgba(255, 255, 255, 0.95)'
              color='gray.800'
              _hover={{ bg: 'rgba(255, 255, 255, 1)' }}
              boxShadow='md'
              borderRadius='md'
            />
          </PopoverTrigger>
          <PopoverContent maxW='160px'>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <Text fontSize='sm' mb={2} fontWeight='bold'>
                Navigate Map
              </Text>
              <VStack spacing={1}>
                <IconButton
                  aria-label='Move up'
                  icon={<ArrowUpIcon />}
                  size='sm'
                  onClick={() => moveMap('up')}
                  bg='gray.100'
                  _hover={{ bg: 'gray.200' }}
                />
                <HStack spacing={1}>
                  <IconButton
                    aria-label='Move left'
                    icon={<ArrowBackIcon />}
                    size='sm'
                    onClick={() => moveMap('left')}
                    bg='gray.100'
                    _hover={{ bg: 'gray.200' }}
                  />
                  <IconButton
                    aria-label='Move right'
                    icon={<ArrowForwardIcon />}
                    size='sm'
                    onClick={() => moveMap('right')}
                    bg='gray.100'
                    _hover={{ bg: 'gray.200' }}
                  />
                </HStack>
                <IconButton
                  aria-label='Move down'
                  icon={<ArrowDownIcon />}
                  size='sm'
                  onClick={() => moveMap('down')}
                  bg='gray.100'
                  _hover={{ bg: 'gray.200' }}
                />
              </VStack>

              <Box mt={3} pt={2} borderTop='1px solid' borderColor='gray.200'>
                <Text fontSize='xs' textAlign='center' color='gray.600'>
                  Lat: {mapCenter.lat.toFixed(3)}
                  <br />
                  Lon: {mapCenter.lng.toFixed(3)}
                </Text>
              </Box>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </VStack>

      {/* Loading Indicator */}
      {loading && (
        <Box
          position='absolute'
          top='50%'
          left='50%'
          transform='translate(-50%, -50%)'
          zIndex={10}
          bg='rgba(255, 255, 255, 0.9)'
          p={4}
          borderRadius='md'
        >
          <VStack>
            <Spinner size='lg' color='blue.500' />
            <Text fontSize='sm' color='gray.600'>
              Loading map...
            </Text>
          </VStack>
        </Box>
      )}
    </Box>
  );
}

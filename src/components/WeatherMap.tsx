import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Select,
  Spinner,
  useBreakpointValue,
} from '@chakra-ui/react';
import { parentGradient, borderRadius, padding } from '../utils/styles';
import type { CurrentWeatherProps } from '../types/Weather';
import { KEY } from '../services/WeatherApi';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map layers available in OpenWeatherMap
const MAP_LAYERS = {
  clouds_new: 'Clouds',
  precipitation_new: 'Precipitation',
  pressure_new: 'Pressure',
  wind_new: 'Wind',
  temp_new: 'Temperature',
};

const ZOOM_LEVELS = [3, 4, 5, 6, 7, 8, 9, 10];

export default function WeatherMap({ data }: CurrentWeatherProps) {
  const [selectedLayer, setSelectedLayer] = useState('precipitation_new');
  const [zoom, setZoom] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const weatherLayerRef = useRef<L.TileLayer | null>(null);

  // Responsive layout configuration
  const isMobile = useBreakpointValue({ base: true, md: false });
  const controlPosition = isMobile ? 'bottom' : 'side';

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current).setView(
      [data.coord.lat, data.coord.lon],
      zoom
    );

    // Add OpenStreetMap base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      opacity: 0.7,
    }).addTo(mapRef.current);

    // Add weather overlay
    updateWeatherLayer();

    // Handle map events
    mapRef.current.on('load', () => setLoading(false));
    mapRef.current.on('zoomend', () => {
      if (mapRef.current) {
        setZoom(mapRef.current.getZoom());
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [data.coord.lat, data.coord.lon, zoom]);

  const updateWeatherLayer = useCallback(() => {
    // Remove existing weather layer
    if (weatherLayerRef.current && mapRef.current) {
      mapRef.current.removeLayer(weatherLayerRef.current);
    }

    // Add new weather layer
    if (mapRef.current) {
      weatherLayerRef.current = L.tileLayer(
        `https://tile.openweathermap.org/map/${selectedLayer}/{z}/{x}/{y}.png?appid=${KEY}`,
        { opacity: 0.7 }
      ).addTo(mapRef.current);
    }
  }, [selectedLayer]);

  useEffect(() => {
    if (mapRef.current) {
      updateWeatherLayer();
    }
  }, [selectedLayer, updateWeatherLayer]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setZoom(zoom);
    }
  }, [zoom]);

  const moveMap = (direction: string) => {
    if (!mapRef.current) return;

    const moveAmount = 0.1 * Math.pow(2, 10 - zoom);
    const center = mapRef.current.getCenter();

    switch (direction) {
      case 'up':
        mapRef.current.panTo([center.lat + moveAmount, center.lng]);
        break;
      case 'down':
        mapRef.current.panTo([center.lat - moveAmount, center.lng]);
        break;
      case 'left':
        mapRef.current.panTo([center.lat, center.lng - moveAmount]);
        break;
      case 'right':
        mapRef.current.panTo([center.lat, center.lng + moveAmount]);
        break;
    }
  };

  const resetToOriginalLocation = () => {
    if (mapRef.current) {
      mapRef.current.setView([data.coord.lat, data.coord.lon], zoom);
    }
  };

  return (
    <Box
      bgGradient={parentGradient}
      p={padding}
      borderRadius={borderRadius}
      flex={1}
      position='relative'
      overflow='hidden'
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
      />

      {/* Overlay Controls */}
      <Box position='relative' zIndex={2}>
        <VStack spacing={4} align='stretch'>
          <Text
            fontSize='xl'
            fontWeight='bold'
            textAlign='center'
            color='white'
            textShadow='0 0 3px black'
          >
            {data.name} Weather Map -{' '}
            {MAP_LAYERS[selectedLayer as keyof typeof MAP_LAYERS]}
          </Text>

          {/* Controls Container - Responsive layout */}
          <Box
            display='flex'
            flexDirection={controlPosition === 'side' ? 'row' : 'column'}
            justifyContent='space-between'
            alignItems={controlPosition === 'side' ? 'flex-start' : 'center'}
            flexWrap='wrap'
            gap={4}
          >
            {/* Left-side Controls */}
            <VStack
              align='flex-start'
              bg='white'
              p={3}
              borderRadius='md'
              boxShadow='lg'
              spacing={3}
              maxW={controlPosition === 'side' ? '200px' : '100%'}
            >
              <Box>
                <Text fontSize='sm' mb={1}>
                  Layer:
                </Text>
                <Select
                  value={selectedLayer}
                  onChange={(e) => setSelectedLayer(e.target.value)}
                  size='sm'
                >
                  {Object.entries(MAP_LAYERS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Box>

              <Box>
                <Text fontSize='sm' mb={1}>
                  Zoom:
                </Text>
                <Select
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  size='sm'
                >
                  {ZOOM_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </Select>
              </Box>

              <Button
                size='sm'
                onClick={resetToOriginalLocation}
                colorScheme='blue'
                width='100%'
              >
                Reset View
              </Button>
            </VStack>

            {/* Right-side Controls */}
            <VStack
              align='center'
              bg='white'
              p={3}
              borderRadius='md'
              boxShadow='lg'
              spacing={2}
              maxW={controlPosition === 'side' ? '120px' : '100%'}
            >
              <Button size='sm' onClick={() => moveMap('up')} width='100%'>
                ↑
              </Button>
              <HStack spacing={2} width='100%'>
                <Button size='sm' onClick={() => moveMap('left')} flex={1}>
                  ←
                </Button>
                <Button size='sm' onClick={() => moveMap('right')} flex={1}>
                  →
                </Button>
              </HStack>
              <Button size='sm' onClick={() => moveMap('down')} width='100%'>
                ↓
              </Button>

              {mapRef.current && (
                <Text fontSize='xs' textAlign='center'>
                  Lat: {mapRef.current.getCenter().lat.toFixed(3)}
                  <br />
                  Lon: {mapRef.current.getCenter().lng.toFixed(3)}
                </Text>
              )}
            </VStack>
          </Box>

          {/* Legend for Precipitation - Positioned at bottom */}
          {selectedLayer === 'precipitation_new' && (
            <Box
              bg='white'
              p={3}
              borderRadius='md'
              fontSize='sm'
              boxShadow='lg'
              alignSelf='center'
              mt={controlPosition === 'side' ? 'auto' : 0}
              ml={controlPosition === 'side' ? 4 : 0}
            >
              <Text fontWeight='bold' mb={2}>
                Precipitation Legend:
              </Text>
              <HStack spacing={4} wrap='wrap'>
                <HStack>
                  <Box
                    w='12px'
                    h='12px'
                    bg='transparent'
                    border='1px solid gray'
                  />
                  <Text>None</Text>
                </HStack>
                <HStack>
                  <Box w='12px' h='12px' bg='lightblue' />
                  <Text>Light</Text>
                </HStack>
                <HStack>
                  <Box w='12px' h='12px' bg='blue' />
                  <Text>Moderate</Text>
                </HStack>
                <HStack>
                  <Box w='12px' h='12px' bg='darkblue' />
                  <Text>Heavy</Text>
                </HStack>
              </HStack>
            </Box>
          )}
        </VStack>
      </Box>

      {/* Loading Indicator */}
      {loading && (
        <Box
          position='absolute'
          top='50%'
          left='50%'
          transform='translate(-50%, -50%)'
          zIndex={10}
        >
          <Spinner size='lg' color='blue.500' />
        </Box>
      )}
    </Box>
  );
}

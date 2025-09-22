import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Badge,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

interface PrecipitationRadarProps {
  apiKey: string;
  lat?: number;
  lon?: number;
  width?: number;
  height?: number;
}

export default function PrecipitationRadar({
  apiKey,
  lat = 51.505,
  lon = -0.09,
  width = 512,
  height = 512,
}: PrecipitationRadarProps) {
  const [zoom, setZoom] = useState(6);
  const [opacity, setOpacity] = useState(0.8);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [mapCenter, setMapCenter] = useState({ lat, lon });

  // Generate timestamps for animation (last 2 hours, 10-minute intervals)
  const getTimeFrames = () => {
    const frames = [];
    const now = new Date();
    for (let i = 12; i >= 0; i--) {
      // 12 frames = 2 hours
      const time = new Date(now.getTime() - i * 10 * 60 * 1000); // 10 minutes each
      frames.push(Math.floor(time.getTime() / 1000));
    }
    return frames;
  };

  const timeFrames = getTimeFrames();

  // Calculate tile coordinates
  const getTileCoordinates = (lat: number, lon: number, zoom: number) => {
    const x = Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
    const y = Math.floor(
      ((1 -
        Math.log(
          Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
        ) /
          Math.PI) /
        2) *
        Math.pow(2, zoom)
    );
    return { x, y, z: zoom };
  };

  const tileCoords = getTileCoordinates(mapCenter.lat, mapCenter.lon, zoom);

  // Animation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnimating) {
      interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % timeFrames.length);
      }, 500); // Change frame every 500ms
    }
    return () => clearInterval(interval);
  }, [isAnimating, timeFrames.length]);

  const getCurrentTimestamp = () => timeFrames[currentFrame];

  const baseMapUrl = `https://tile.openstreetmap.org/${zoom}/${tileCoords.x}/${tileCoords.y}.png`;
  const precipitationUrl = `https://tile.openweathermap.org/map/precipitation_new/${zoom}/${tileCoords.x}/${tileCoords.y}.png?appid=${apiKey}`;
  const precipitationHistoryUrl = `https://tile.openweathermap.org/map/precipitation_new/${zoom}/${
    tileCoords.x
  }/${tileCoords.y}.png?appid=${apiKey}&date=${getCurrentTimestamp()}`;

  const moveMap = (direction: string) => {
    const moveAmount = 0.5 * Math.pow(2, 8 - zoom);

    switch (direction) {
      case 'up':
        setMapCenter((prev) => ({
          ...prev,
          lat: Math.min(85, prev.lat + moveAmount),
        }));
        break;
      case 'down':
        setMapCenter((prev) => ({
          ...prev,
          lat: Math.max(-85, prev.lat - moveAmount),
        }));
        break;
      case 'left':
        setMapCenter((prev) => ({
          ...prev,
          lon: Math.max(-180, prev.lon - moveAmount),
        }));
        break;
      case 'right':
        setMapCenter((prev) => ({
          ...prev,
          lon: Math.min(180, prev.lon + moveAmount),
        }));
        break;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box maxW='800px' mx='auto' p={4}>
      <VStack spacing={4} align='stretch'>
        <HStack justify='space-between' align='center'>
          <Text fontSize='xl' fontWeight='bold'>
            Precipitation Radar
          </Text>
          <Badge colorScheme={isAnimating ? 'green' : 'gray'} variant='solid'>
            {isAnimating ? 'LIVE' : 'PAUSED'}
          </Badge>
        </HStack>

        {!apiKey && (
          <Alert status='warning'>
            <AlertIcon />
            API Key required for precipitation data
          </Alert>
        )}

        {/* Controls */}
        <VStack spacing={3}>
          <HStack spacing={4} wrap='wrap' justify='center'>
            <Box>
              <Text fontSize='sm' mb={2}>
                Zoom Level: {zoom}
              </Text>
              <Slider
                value={zoom}
                onChange={setZoom}
                min={1}
                max={10}
                step={1}
                w='150px'
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Box>

            <Box>
              <Text fontSize='sm' mb={2}>
                Opacity: {Math.round(opacity * 100)}%
              </Text>
              <Slider
                value={opacity}
                onChange={setOpacity}
                min={0.1}
                max={1}
                step={0.1}
                w='150px'
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Box>
          </HStack>

          <HStack spacing={2}>
            <Button
              size='sm'
              colorScheme={isAnimating ? 'red' : 'green'}
              onClick={() => setIsAnimating(!isAnimating)}
            >
              {isAnimating ? 'Stop Animation' : 'Start Animation'}
            </Button>

            <Button
              size='sm'
              onClick={() => setCurrentFrame(timeFrames.length - 1)}
              disabled={isAnimating}
            >
              Latest
            </Button>
          </HStack>
        </VStack>

        {/* Navigation */}
        <VStack spacing={2}>
          <Button size='sm' onClick={() => moveMap('up')}>
            ↑
          </Button>
          <HStack spacing={2}>
            <Button size='sm' onClick={() => moveMap('left')}>
              ←
            </Button>
            <VStack spacing={1}>
              <Text fontSize='xs' textAlign='center'>
                Lat: {mapCenter.lat.toFixed(3)}
              </Text>
              <Text fontSize='xs' textAlign='center'>
                Lon: {mapCenter.lon.toFixed(3)}
              </Text>
            </VStack>
            <Button size='sm' onClick={() => moveMap('right')}>
              →
            </Button>
          </HStack>
          <Button size='sm' onClick={() => moveMap('down')}>
            ↓
          </Button>
        </VStack>

        {/* Map Container */}
        <Box
          position='relative'
          w={`${width}px`}
          h={`${height}px`}
          mx='auto'
          border='2px solid'
          borderColor='gray.300'
          borderRadius='lg'
          overflow='hidden'
          bg='gray.100'
        >
          {/* Base Map */}
          <Box
            position='absolute'
            top='0'
            left='0'
            w='100%'
            h='100%'
            backgroundImage={`url(${baseMapUrl})`}
            backgroundSize='cover'
            backgroundPosition='center'
            backgroundRepeat='no-repeat'
          />

          {/* Precipitation Layer */}
          {apiKey && (
            <Box
              position='absolute'
              top='0'
              left='0'
              w='100%'
              h='100%'
              backgroundImage={`url(${
                isAnimating ? precipitationHistoryUrl : precipitationUrl
              })`}
              backgroundSize='cover'
              backgroundPosition='center'
              backgroundRepeat='no-repeat'
              opacity={opacity}
            />
          )}

          {/* Center Point */}
          <Box
            position='absolute'
            top='50%'
            left='50%'
            transform='translate(-50%, -50%)'
            w='10px'
            h='10px'
            bg='red.500'
            borderRadius='50%'
            border='2px solid white'
            zIndex='10'
          />
        </Box>

        {/* Timeline */}
        {isAnimating && (
          <Box bg='gray.50' p={3} borderRadius='md'>
            <Text fontSize='sm' fontWeight='bold' mb={2}>
              Timeline: {formatTime(getCurrentTimestamp())}
            </Text>
            <Box position='relative' h='20px' bg='gray.200' borderRadius='md'>
              <Box
                position='absolute'
                left={`${(currentFrame / (timeFrames.length - 1)) * 100}%`}
                top='50%'
                transform='translateY(-50%)'
                w='4px'
                h='16px'
                bg='blue.500'
                borderRadius='sm'
              />
            </Box>
            <HStack
              justify='space-between'
              mt={1}
              fontSize='xs'
              color='gray.600'
            >
              <Text>{formatTime(timeFrames[0])}</Text>
              <Text>Now</Text>
            </HStack>
          </Box>
        )}

        {/* Legend */}
        <Box bg='blue.50' p={3} borderRadius='md' fontSize='sm'>
          <Text fontWeight='bold' mb={2}>
            Precipitation Intensity:
          </Text>
          <HStack spacing={3} wrap='wrap'>
            <HStack>
              <Box
                w='12px'
                h='12px'
                bg='rgba(135, 206, 250, 0.3)'
                border='1px solid gray'
              />
              <Text>Light</Text>
            </HStack>
            <HStack>
              <Box
                w='12px'
                h='12px'
                bg='rgba(0, 123, 255, 0.6)'
                border='1px solid gray'
              />
              <Text>Moderate</Text>
            </HStack>
            <HStack>
              <Box
                w='12px'
                h='12px'
                bg='rgba(0, 86, 179, 0.8)'
                border='1px solid gray'
              />
              <Text>Heavy</Text>
            </HStack>
            <HStack>
              <Box
                w='12px'
                h='12px'
                bg='rgba(0, 43, 91, 1)'
                border='1px solid gray'
              />
              <Text>Extreme</Text>
            </HStack>
          </HStack>
        </Box>

        {/* Info */}
        <Box bg='green.50' p={3} borderRadius='md' fontSize='sm'>
          <Text fontWeight='bold' mb={1}>
            Features:
          </Text>
          <Text>• Real-time precipitation radar overlay</Text>
          <Text>• 2-hour historical animation (10-minute intervals)</Text>
          <Text>• Adjustable opacity and zoom levels</Text>
          <Text>• Interactive map navigation</Text>
        </Box>
      </VStack>
    </Box>
  );
}

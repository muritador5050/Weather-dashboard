import React from 'react';
import { Box } from '@chakra-ui/react';

interface SunriseToSunsetArcProps {
  sunrise: number;
  sunset: number;
  timezone: number;
}

const SunriseToSunsetArc: React.FC<SunriseToSunsetArcProps> = ({
  sunrise,
  sunset,
  timezone,
}) => {
  interface SunIconProps {
    position: { [key: string]: string };
    size?: string;
  }

  const SunIcon: React.FC<SunIconProps> = ({ position, size = '20px' }) => (
    <Box
      position='absolute'
      w={size}
      h={size}
      bg='radial-gradient(circle, #ffd54f 0%, #ffb74d 70%, #ff9800 100%)'
      borderRadius='full'
      boxShadow='0 0 20px rgba(255, 215, 79, 0.8), 0 0 40px rgba(255, 183, 77, 0.4)'
      transform='translate(-50%, -50%)'
      transition='all 0.5s ease-out'
      zIndex={10}
      {...position}
    />
  );

  // Calculate current sun position
  const calculateSunPosition = () => {
    const now = Math.floor(Date.now() / 1000);
    const adjustedNow = now + timezone;
    const sunriseTime = sunrise + timezone;
    const sunsetTime = sunset + timezone;

    let t = 0.5; // Default to noon position

    if (adjustedNow >= sunriseTime && adjustedNow <= sunsetTime) {
      // Sun is up - calculate position between sunrise and sunset
      const dayDuration = sunsetTime - sunriseTime;
      const currentProgress = adjustedNow - sunriseTime;
      t = currentProgress / dayDuration;
    } else if (adjustedNow < sunriseTime) {
      // Before sunrise - sun at start position
      t = 0;
    } else {
      // After sunset - sun at end position
      t = 1;
    }

    // Ensure t is between 0 and 1
    t = Math.max(0, Math.min(1, t));

    return t;
  };

  const t = calculateSunPosition();

  // Bezier curve calculation for sun position (more natural arc)
  // const x = (1 - t) * (1 - t) * 30 + 2 * (1 - t) * t * 140 + t * t * 250;
  const x = (1 - t) * (1 - t) * 40 + 2 * (1 - t) * t * 140 + t * t * 240;
  const y = (1 - t) * (1 - t) * 110 + 2 * (1 - t) * t * 10 + t * t * 110;

  // Determine if it's day or night for different styling
  const isDaytime = t > 0 && t < 1;
  const isNight = t === 0 || t === 1;

  return (
    <Box
      position='relative'
      h='120px'
      w='100%'
      maxW='280px'
      display='flex'
      alignItems='flex-end'
      justifyContent='center'
      mx='auto'
    >
      {/* Arc Path */}
      <svg
        width='100%'
        height='120'
        viewBox='0 0 280 120'
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          {/* Enhanced gradients that work better with blue-purple background */}
          <linearGradient id='sunGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor='rgba(255, 204, 51, 0.8)' />
            <stop offset='25%' stopColor='#ffcc33' />
            <stop offset='50%' stopColor='#fff176' />
            <stop offset='75%' stopColor='#ffcc33' />
            <stop offset='100%' stopColor='rgba(255, 107, 53, 0.8)' />
          </linearGradient>

          <linearGradient
            id='dayBackgroundGradient'
            x1='0%'
            y1='0%'
            x2='100%'
            y2='0%'
          >
            <stop offset='0%' stopColor='rgba(255, 255, 255, 0.15)' />
            <stop offset='50%' stopColor='rgba(255, 255, 255, 0.25)' />
            <stop offset='100%' stopColor='rgba(255, 255, 255, 0.15)' />
          </linearGradient>

          <linearGradient id='nightGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor='rgba(148, 163, 184, 0.4)' />
            <stop offset='50%' stopColor='rgba(203, 213, 225, 0.6)' />
            <stop offset='100%' stopColor='rgba(148, 163, 184, 0.4)' />
          </linearGradient>
        </defs>

        {/* Background arc - always visible */}
        <path
          d='M 30 110 Q 140 10 250 110'
          fill='none'
          stroke={
            isDaytime ? 'url(#dayBackgroundGradient)' : 'url(#nightGradient)'
          }
          strokeWidth='4'
          strokeLinecap='round'
        />

        {/* Progress arc (only during daytime) */}
        {isDaytime && (
          <path
            d='M 30 110 Q 140 10 250 110'
            fill='none'
            stroke='url(#sunGradient)'
            strokeWidth='4'
            strokeLinecap='round'
            strokeDasharray='280'
            strokeDashoffset={280 - 280 * t}
          />
        )}

        {/* Sunrise and Sunset markers */}
        <circle cx='30' cy='110' r='4' fill='white' opacity='0.8' />
        <circle cx='250' cy='110' r='4' fill='white' opacity='0.8' />

        {/* Time labels */}
        {isDaytime && (
          <>
            <text
              x='25'
              y='105'
              textAnchor='middle'
              fill='white'
              fontSize='10'
              opacity='0.7'
            >
              Sun
            </text>
            <text
              x='255'
              y='105'
              textAnchor='middle'
              fill='white'
              fontSize='10'
              opacity='0.7'
            >
              Set
            </text>
          </>
        )}
      </svg>

      {/* Sun/Moon Icon with enhanced visibility */}
      <SunIcon
        position={{
          top: `${y}px`,
          left: `${x}px`,
        }}
        size={isNight ? '16px' : '22px'}
      />

      {/* Current time indicator */}
      {isDaytime && (
        <Box
          position='absolute'
          top={`${Math.max(y - 30, 10)}px`}
          left={`${x}px`}
          transform='translateX(-50%)'
          bg='blackAlpha.600'
          color='white'
          px={2}
          py={1}
          borderRadius='md'
          fontSize='xs'
          fontWeight='medium'
          whiteSpace='nowrap'
          zIndex={20}
        >
          {t < 0.5 ? 'Morning' : 'Afternoon'}
        </Box>
      )}
    </Box>
  );
};

export default SunriseToSunsetArc;

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

  const SunIcon: React.FC<SunIconProps> = ({ position, size = '16px' }) => (
    <Box
      position='absolute'
      w={size}
      h={size}
      bg='radial-gradient(circle, #ffd54f 0%, #ffb74d 70%, #ff9800 100%)'
      borderRadius='full'
      boxShadow='0 0 15px rgba(255, 193, 7, 0.5)'
      transform='translate(-50%, -50%)'
      transition='all 0.3s ease'
      {...position}
    />
  );

  // Calculate current sun position
  const calculateSunPosition = () => {
    const now = Math.floor(Date.now() / 1000) + timezone;
    const sunriseTime = sunrise + timezone;
    const sunsetTime = sunset + timezone;

    let t = 0.5; // Default to noon position

    if (now >= sunriseTime && now <= sunsetTime) {
      // Sun is up - calculate position between sunrise and sunset
      const dayDuration = sunsetTime - sunriseTime;
      const currentProgress = now - sunriseTime;
      t = currentProgress / dayDuration;
    } else if (now < sunriseTime) {
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

  // Bezier curve calculation for sun position
  const x = (1 - t) * (1 - t) * 20 + 2 * (1 - t) * t * 140 + t * t * 260;
  const y = (1 - t) * (1 - t) * 120 + 2 * (1 - t) * t * 0 + t * t * 120;

  // Determine if it's day or night for different styling
  const isDaytime = t > 0 && t < 1;

  return (
    <Box
      position='relative'
      h='120px'
      w='250px'
      display='flex'
      alignItems='flex-end'
      justifyContent='center'
    >
      {/* Arc Path */}
      <svg
        width='280'
        height='120'
        viewBox='0 0 280 120'
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id='sunGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor='rgba(255, 204, 51, 0.3)' />
            <stop offset='25%' stopColor='#ffcc33' />
            <stop offset='50%' stopColor='#fff176' />
            <stop offset='75%' stopColor='#ffcc33' />
            <stop offset='100%' stopColor='#ff6b35' />
          </linearGradient>
          <linearGradient id='nightGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor='rgba(100, 100, 150, 0.3)' />
            <stop offset='50%' stopColor='rgba(150, 150, 200, 0.5)' />
            <stop offset='100%' stopColor='rgba(100, 100, 150, 0.3)' />
          </linearGradient>
        </defs>

        {/* Background arc */}
        <path
          d='M 20 120 Q 140 0 260 120'
          fill='none'
          stroke={
            isDaytime ? 'url(#nightGradient)' : 'rgba(100, 100, 150, 0.3)'
          }
          strokeWidth='3'
          strokeDasharray='8 4'
        />

        {/* Progress arc (only during daytime) */}
        {isDaytime && (
          <path
            d='M 20 120 Q 140 0 260 120'
            fill='none'
            stroke='url(#sunGradient)'
            strokeWidth='3'
            strokeDasharray={`${280 * t} ${280 * (1 - t)}`}
            strokeDashoffset='0'
          />
        )}
      </svg>

      <SunIcon
        position={{
          top: `${y}px`,
          left: `${x}px`,
        }}
        size='20px'
      />
    </Box>
  );
};

export default SunriseToSunsetArc;

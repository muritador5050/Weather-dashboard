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

  const calculateSunProgress = () => {
    const now = Math.floor(Date.now() / 1000);
    const adjustedNow = now + timezone;
    const sunriseTime = sunrise + timezone;
    const sunsetTime = sunset + timezone;

    if (adjustedNow >= sunriseTime && adjustedNow <= sunsetTime) {
      // Sun is up - calculate position between sunrise and sunset
      const dayDuration = sunsetTime - sunriseTime;
      const currentProgress = adjustedNow - sunriseTime;
      return currentProgress / dayDuration;
    } else if (adjustedNow < sunriseTime) {
      // Before sunrise
      return 0;
    } else {
      // After sunset
      return 1;
    }
  };

  const t = calculateSunProgress();

  const p0 = { x: 30, y: 110 };
  const p1 = { x: 140, y: 10 };
  const p2 = { x: 250, y: 110 };

  const x =
    Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x;
  const y =
    Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y;

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
      overflow='hidden'
    >
      <svg
        width='100%'
        height='120'
        viewBox='0 0 280 120'
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
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
        <path
          d='M 30 110 Q 140 10 250 110'
          fill='none'
          stroke={
            isDaytime ? 'url(#dayBackgroundGradient)' : 'url(#nightGradient)'
          }
          strokeWidth='4'
          strokeLinecap='round'
        />
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
        <circle cx='30' cy='110' r='4' fill='white' opacity='0.8' />
        <circle cx='250' cy='110' r='4' fill='white' opacity='0.8' />
        <text
          x='25'
          y='105'
          textAnchor='middle'
          fill='white'
          fontSize='10'
          opacity='0.7'
        >
          Sun
        </text>{' '}
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
      </svg>
      <SunIcon
        position={{
          top: `${y}px`,
          left: `${x}px`,
        }}
        size={isNight ? '16px' : '22px'}
      />
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

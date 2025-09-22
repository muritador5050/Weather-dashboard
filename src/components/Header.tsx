import { Box, Flex, Text, Stack, IconButton } from '@chakra-ui/react';
import { parentGradient, borderRadius } from '../utils/styles';
import { CalendarDays, Flower, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <Box
      maxW={{ base: 'full', md: 'fit-content' }}
      px={3}
      py={4}
      borderRadius={borderRadius}
      boxShadow='sm'
      color='white'
      bgGradient={parentGradient}
    >
      <Flex direction={{ base: 'row', md: 'column' }} gap={9} align='center'>
        <Text>Weathry</Text>
        <Stack
          direction={{ base: 'row', md: 'column' }}
          mx={{ base: 'auto', md: 'unset' }}
          spacing={4}
        >
          <IconButton
            aria-label='home'
            icon={<Flower />}
            as={Link}
            to='/'
            bg='transparent'
            colorScheme='whiteAlpha'
          />
          <IconButton
            aria-label='location'
            icon={<MapPin />}
            as={Link}
            to='/location'
            bg='transparent'
            colorScheme='whiteAlpha'
          />
          <IconButton
            aria-label='calendar'
            icon={<CalendarDays />}
            as={Link}
            to='/calendar'
            bg='transparent'
            colorScheme='whiteAlpha'
          />
        </Stack>
      </Flex>
    </Box>
  );
}

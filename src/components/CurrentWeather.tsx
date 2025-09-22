import React, { useRef } from 'react';
import {
  Text,
  Flex,
  Icon,
  Image,
  Stack,
  Divider,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from '@chakra-ui/react';
import {
  getWeatherIcon,
  capitalizeFirstLetter,
  getDayOfWeek,
  getCurrentDateTime,
} from '../utils/helpers';
import type { WeatherApiResponse } from '../types/Weather';
import { borderRadius, padding, parentGradient } from '../utils/styles';
import { Calendar, MapPin, Search } from 'lucide-react';
import SearchBar from './SearchBar';

interface CurrentProps {
  data: WeatherApiResponse;
  handleSearch: (city: string) => void;
}
const CurrentWeather: React.FC<CurrentProps> = ({ data, handleSearch }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  return (
    <Stack
      spacing={2}
      width={{ base: 'full', md: '30%' }}
      p={padding}
      borderRadius={borderRadius}
      bgGradient={parentGradient}
      boxShadow='md'
      mb={6}
      color='white'
    >
      <Flex align='center' justify='space-between'>
        <Image
          src={getWeatherIcon(data?.weather[0].icon)}
          alt={data?.weather[0].description}
          boxSize='100px'
        />
        <IconButton aria-label='search' icon={<Search />} onClick={onOpen} />
      </Flex>
      <Text fontSize='3xl' fontWeight='medium'>
        {Math.round(data?.main.temp)}°C
      </Text>

      <Text fontSize='lg'>
        {capitalizeFirstLetter(data?.weather[0]?.description) || ''}
      </Text>

      <Divider my={5} />
      <Flex align='center' gap='2'>
        <Icon as={MapPin} color='white' />
        <Text>
          {data?.name}, {data?.sys.country}
        </Text>
      </Flex>
      <Flex align='center' gap='2'>
        <Icon as={Calendar} color='white' />
        <Text fontWeight='medium'>{getCurrentDateTime()}</Text>
        <Text fontWeight='medium'>{getDayOfWeek(data?.dt)}</Text>
      </Flex>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        motionPreset='slideInTop'
      >
        <ModalOverlay />
        <ModalContent bg={parentGradient}>
          <ModalBody>
            <SearchBar onSearch={handleSearch} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default CurrentWeather;

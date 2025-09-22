import React, { useRef } from 'react';
import {
  Card,
  CardBody,
  Text,
  Flex,
  Icon,
  Image,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Heading,
  VStack,
  Stack,
  Divider,
  Box,
} from '@chakra-ui/react';
import { getDayOfWeek, getCurrentDateTime } from '../utils/helpers';
import type { WeatherApiResponse } from '../types/Weather';
import { childGradient, padding, parentGradient } from '../utils/styles';
import { Calendar, MapPin, Search } from 'lucide-react';
import SearchBar from './SearchBar';

interface WeatherCardProps {
  data: WeatherApiResponse;
  handleSearch: (city: string) => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, handleSearch }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  return (
    <Card
      width={{ base: 'full', md: '30%' }}
      borderRadius='2xl'
      bgGradient={parentGradient}
      boxShadow='xl'
      color='white'
      position='relative'
      overflow='hidden'
      transition='all 0.3s'
      _hover={{ transform: 'translateY(-4px)', boxShadow: '2xl' }}
    >
      <CardBody p={padding}>
        {/* Top bar with Search button */}
        <Flex justify='flex-end' mb={2}>
          <IconButton
            aria-label='search'
            icon={<Search />}
            onClick={onOpen}
            variant='ghost'
            color='white'
            rounded='full'
            _hover={{ bg: 'whiteAlpha.200' }}
          />
        </Flex>

        {/* Weather Icon + Temp */}
        <Stack spacing={4} align='center' mb={4}>
          <Image
            src={icon}
            alt={data.weather[0].description}
            boxSize='100px'
            dropShadow='lg'
          />
          <VStack spacing={0}>
            <Heading size='2xl' fontWeight='bold'>
              {Math.round(data.main.temp)}°C
            </Heading>
            <Text fontSize='lg' textTransform='capitalize' opacity={0.9}>
              {data.weather[0].description}
            </Text>
          </VStack>
        </Stack>

        <Divider borderColor='whiteAlpha.400' my={4} />

        {/* Location + Date Info */}
        <VStack spacing={3} align='stretch'>
          <Flex align='center' gap={3}>
            <Icon as={MapPin} color='white' />
            <Text fontWeight='medium'>
              {data.name}, {data.sys.country}
            </Text>
          </Flex>
          <Flex align='center' gap={3} wrap='wrap'>
            <Icon as={Calendar} color='white' />
            <Box>
              <Text fontWeight='medium'>{getCurrentDateTime()}</Text>
              <Text fontSize='sm' opacity={0.8}>
                {getDayOfWeek(data.dt)}
              </Text>
            </Box>
          </Flex>
        </VStack>

        {/* Search Modal */}
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
          motionPreset='slideInTop'
        >
          <ModalOverlay />
          <ModalContent
            bgGradient={childGradient}
            borderRadius='xl'
            boxShadow='2xl'
            py={2}
          >
            <ModalBody>
              <SearchBar onSearch={handleSearch} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default WeatherCard;

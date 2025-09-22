import { Flex } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import WeatherLocation from './pages/WeatherLocation';
import WeatherCalendar from './pages/WeatherCalendar';

export default function App() {
  return (
    <Router>
      <Flex
        bg='#0d0c22'
        p={6}
        direction={{ base: 'column', md: 'row' }}
        gap={6}
        minH='100vh'
      >
        <Header />

        {/* Main content area for routes */}
        <Flex flex='1' direction='column'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/location' element={<WeatherLocation />} />
            <Route path='/calendar' element={<WeatherCalendar />} />
          </Routes>
        </Flex>
      </Flex>
    </Router>
  );
}

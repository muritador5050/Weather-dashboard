import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import PwaInstaller from './services/PwaInstaller';
import './index.css';

import 'virtual:pwa-register';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <PwaInstaller />
      <App />
    </ChakraProvider>
  </React.StrictMode>
);

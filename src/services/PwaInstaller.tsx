import React, { useState, useEffect } from 'react';
import { Button, Box, Text } from '@chakra-ui/react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface Window {
    addEventListener(
      type: 'beforeinstallprompt',
      listener: (event: BeforeInstallPromptEvent) => void,
      options?: boolean | AddEventListenerOptions
    ): void;
  }
}

// A simple function to detect iOS
const isIos = (): boolean => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

// A function to check if the app is already a PWA
const isPwa = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches;
};

const PwaInstaller: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
    }
  };

  // Render logic
  if (deferredPrompt) {
    return (
      <Box p={4} textAlign='center'>
        <Button onClick={handleInstallClick} colorScheme='blue'>
          Install App
        </Button>
      </Box>
    );
  }

  if (isIos() && !isPwa()) {
    return (
      <Box p={4} textAlign='center' bg='gray.100'>
        <Text>
          To install, tap the <Text as='b'>Share icon</Text>{' '}
          <span aria-label='share-icon'>⬆️</span> and then **Add to Home
          Screen**.
        </Text>
      </Box>
    );
  }

  return null;
};

export default PwaInstaller;

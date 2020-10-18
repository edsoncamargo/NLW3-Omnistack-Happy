import React from 'react';
import { useFonts } from 'expo-font';
import { Raleway_400Regular, Raleway_700Bold, Raleway_800ExtraBold } from '@expo-google-fonts/raleway'

import Routes from './src/routes';

export default function App() {
  const [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_700Bold,
    Raleway_800ExtraBold
  })

  if (fontsLoaded === false) {
    return null;
  }

  return (
    <Routes />
  );
}
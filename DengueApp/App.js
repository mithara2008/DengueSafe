import React, { useState, useEffect } from 'react';
import AppNavigator from './navigation/AppNavigator';
import AnimatedLoading from './components/AnimatedLoading';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate initial async loading (e.g. auth check, fonts, splash)
    const initTimer = setTimeout(() => {
      setIsReady(true);
    }, 2500);
    return () => clearTimeout(initTimer);
  }, []);

  if (!isReady) {
    return <AnimatedLoading message="Initializing DengueSafe..." />;
  }

  return <AppNavigator />;
}
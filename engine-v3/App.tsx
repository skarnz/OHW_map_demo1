import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import JourneyMapNavigator from './src/components/JourneyMapNavigator';
import ErrorBoundary from './src/components/common/ErrorBoundary';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <ErrorBoundary fallbackMessage="The journey map encountered an error. Tap below to reload.">
        <JourneyMapNavigator />
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

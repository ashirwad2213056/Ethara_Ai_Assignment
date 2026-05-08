import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider } from './src/context/AuthContext.js';
import AppNavigator from './src/navigation/AppNavigator.js';
import { colors } from './src/constants/theme.js';

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          ...Ionicons.font,
        });
        setFontLoaded(true);
      } catch (e) {
        console.warn('Error loading fonts:', e);
        // Still show app even if fonts fail to load
        setFontLoaded(true);
      }
    }
    loadFonts();
  }, []);

  if (!fontLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg.primary, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor="#0F1117" />
      <AppNavigator />
    </AuthProvider>
  );
}

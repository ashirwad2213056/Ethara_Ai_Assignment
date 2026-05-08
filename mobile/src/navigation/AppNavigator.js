import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext.js';
import AuthNavigator from './AuthNavigator.js';
import TabNavigator from './TabNavigator.js';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '../constants/theme.js';

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg.primary, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

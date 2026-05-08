import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen.js';
import PersonalInfoScreen from '../screens/PersonalInfoScreen.js';
import SecurityScreen from '../screens/SecurityScreen.js';
import { colors, typography } from '../constants/theme.js';

const Stack = createNativeStackNavigator();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.bg.primary,
        },
        headerTitleStyle: {
          color: colors.text.primary,
          fontSize: typography.sizes.lg,
          fontWeight: 'bold',
        },
        headerTintColor: colors.brand.primary,
        headerBackTitleVisible: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="PersonalInfo" 
        component={PersonalInfoScreen} 
        options={{ title: 'Personal Information' }} 
      />
      <Stack.Screen 
        name="Security" 
        component={SecurityScreen} 
        options={{ title: 'Security & Password' }} 
      />
    </Stack.Navigator>
  );
}

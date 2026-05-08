import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, layout, typography } from '../constants/theme.js';
import { useAuth } from '../context/AuthContext.js';

import DashboardScreen from '../screens/DashboardScreen.js';
import ExpenseNavigator from './ExpenseNavigator.js';
import BudgetScreen from '../screens/BudgetScreen.js';
import AnalyticsScreen from '../screens/AnalyticsScreen.js';
import ProfileNavigator from './ProfileNavigator.js';
import AdminScreen from '../screens/AdminScreen.js';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg.secondary,
          borderTopColor: colors.border.default,
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.brand.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Expenses') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Budgets') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Admin') {
            iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard"  component={DashboardScreen} />
      <Tab.Screen name="Expenses"   component={ExpenseNavigator} />
      <Tab.Screen name="Budgets"    component={BudgetScreen} />
      <Tab.Screen name="Analytics"  component={AnalyticsScreen} />
      <Tab.Screen 
        name="Profile"    
        component={ProfileNavigator} 
        options={{ tabBarButton: () => null }}
      />
      {isAdmin && (
        <Tab.Screen name="Admin"    component={AdminScreen} />
      )}
    </Tab.Navigator>
  );
}

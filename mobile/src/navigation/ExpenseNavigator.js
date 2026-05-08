import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExpenseListScreen from '../screens/ExpenseListScreen.js';
import AddExpenseScreen from '../screens/AddExpenseScreen.js';
import ExpenseDetailScreen from '../screens/ExpenseDetailScreen.js';

const Stack = createNativeStackNavigator();

export default function ExpenseNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExpenseList" component={ExpenseListScreen} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
      <Stack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} />
    </Stack.Navigator>
  );
}

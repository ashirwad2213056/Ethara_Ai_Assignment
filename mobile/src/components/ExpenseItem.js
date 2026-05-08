import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, layout } from '../constants/theme.js';

const ExpenseItem = ({ expense, onPress, onLongPress }) => {
  const { title, amount, category, date } = expense;
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: (category?.color || colors.bg.tertiary) + '20' }]}>
        <Ionicons name={category?.icon || 'cash-outline'} size={22} color={category?.color || colors.text.primary} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.category}>{category?.name}</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.amount}>₹{Number(amount).toLocaleString('en-IN')}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.bg.secondary,
    borderRadius: layout.cardRadius,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  category: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amount: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', // Fallback for mono
  },
  date: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
});

export default ExpenseItem;

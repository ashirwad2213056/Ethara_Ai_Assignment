import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, layout } from '../constants/theme.js';

const EmptyState = ({ icon, title, message, action }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={64} color={colors.text.muted} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {action && (
        <View style={styles.actionContainer}>
          {action}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    fontFamily: typography.fonts.bold,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionContainer: {
    marginTop: 24,
  },
});

export default EmptyState;

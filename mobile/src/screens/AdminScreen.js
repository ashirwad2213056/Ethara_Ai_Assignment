import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../constants/theme.js';

export default function AdminScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin</Text>
      <Text style={styles.subtitle}>Phase 6 — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: typography.sizes['2xl'], fontWeight: typography.weights.bold, color: colors.danger, marginBottom: 8 },
  subtitle: { fontSize: typography.sizes.sm, color: colors.text.secondary },
});

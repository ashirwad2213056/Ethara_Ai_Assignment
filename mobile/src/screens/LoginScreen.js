import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { colors, typography, spacing, layout } from '../constants/theme.js';
import { useAuth } from '../context/AuthContext.js';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>SpendWise</Text>
          <Text style={styles.tagline}>Track every rupee. Own your future.</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={colors.text.tertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.text.tertiary}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Signing in…' : 'Sign In'}</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text style={styles.footerLink}>Create one</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  inner: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
    justifyContent: 'center',
    gap: spacing['3xl'],
  },
  header: {
    gap: spacing.sm,
  },
  logo: {
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.bold,
    color: colors.brand.primary,
  },
  tagline: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },
  form: {
    gap: spacing.xl,
  },
  errorBanner: {
    backgroundColor: colors.dangerBg,
    color: colors.danger,
    padding: spacing.md,
    borderRadius: layout.inputRadius,
    fontSize: typography.sizes.sm,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    fontWeight: typography.weights.medium,
  },
  input: {
    backgroundColor: colors.bg.input,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: layout.inputRadius,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: colors.text.primary,
    fontSize: typography.sizes.md,
  },
  button: {
    backgroundColor: colors.brand.primary,
    borderRadius: layout.buttonRadius,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  footerText: {
    textAlign: 'center',
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
  },
  footerLink: {
    color: colors.brand.primary,
    fontWeight: typography.weights.semibold,
  },
});

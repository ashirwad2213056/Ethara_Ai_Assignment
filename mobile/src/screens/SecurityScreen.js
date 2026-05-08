import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { colors, typography, spacing, layout } from '../constants/theme.js';
import { Ionicons } from '@expo/vector-icons';

export default function SecurityScreen() {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.intro}>
          <View style={styles.shieldIcon}>
            <Ionicons name="shield-checkmark-outline" size={40} color={colors.brand.primary} />
          </View>
          <Text style={styles.introTitle}>Change Password</Text>
          <Text style={styles.introText}>Keep your account secure by using a strong password that you don't use elsewhere.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput 
              style={styles.input}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>New Password</Text>
            <TextInput 
              style={styles.input}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput 
              style={styles.input}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Update Password</Text>
        </TouchableOpacity>

        <View style={styles.extraGroup}>
          <Text style={styles.groupTitle}>Other Security Options</Text>
          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionLeft}>
              <Ionicons name="finger-print" size={20} color={colors.text.secondary} />
              <Text style={styles.optionLabel}>Biometric Authentication</Text>
            </View>
            <Text style={styles.optionStatus}>Off</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionLeft}>
              <Ionicons name="key-outline" size={20} color={colors.text.secondary} />
              <Text style={styles.optionLabel}>Two-Factor Authentication</Text>
            </View>
            <Text style={styles.optionStatus}>Enabled</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  content: {
    padding: layout.screenPadding,
    gap: 32,
  },
  intro: {
    alignItems: 'center',
    gap: 12,
    textAlign: 'center',
  },
  shieldIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  introTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  introText: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  form: {
    gap: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: 'bold',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: colors.bg.secondary,
    borderRadius: layout.inputRadius,
    padding: 16,
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  saveButton: {
    backgroundColor: colors.brand.primary,
    borderRadius: layout.buttonRadius,
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
  },
  extraGroup: {
    marginTop: 10,
    gap: 16,
  },
  groupTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: 'bold',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bg.secondary,
    padding: 16,
    borderRadius: layout.cardRadius,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionLabel: {
    color: colors.text.primary,
    fontSize: typography.sizes.md,
  },
  optionStatus: {
    fontSize: typography.sizes.xs,
    color: colors.brand.primary,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 16,
  }
});

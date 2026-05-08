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
import { useAuth } from '../context/AuthContext.js';
import { Ionicons } from '@expo/vector-icons';

export default function PersonalInfoScreen() {
  const { user } = useAuth();
  const [name, setName] = React.useState(user?.name || '');
  const [email, setEmail] = React.useState(user?.email || '');

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{name?.charAt(0).toUpperCase() || 'U'}</Text>
            <TouchableOpacity style={styles.editAvatar}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>Tap to change profile picture</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput 
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput 
              style={[styles.input, styles.disabledInput]}
              value={email}
              editable={false}
              placeholder="you@example.com"
              placeholderTextColor={colors.text.tertiary}
            />
            <Text style={styles.fieldHelper}>Email cannot be changed</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Currency</Text>
            <TouchableOpacity style={styles.selector}>
              <Text style={styles.selectorText}>INR (₹)</Text>
              <Ionicons name="chevron-down" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 40,
    color: colors.text.inverse,
    fontWeight: 'bold',
  },
  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.accent.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.bg.primary,
  },
  helperText: {
    fontSize: typography.sizes.xs,
    color: colors.text.tertiary,
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
  disabledInput: {
    opacity: 0.6,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  fieldHelper: {
    fontSize: 10,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bg.secondary,
    borderRadius: layout.inputRadius,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  selectorText: {
    color: colors.text.primary,
    fontSize: typography.sizes.md,
  },
  saveButton: {
    backgroundColor: colors.brand.primary,
    borderRadius: layout.buttonRadius,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
  }
});

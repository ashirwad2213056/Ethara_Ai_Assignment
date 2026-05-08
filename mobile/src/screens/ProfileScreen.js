import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Switch, 
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, layout } from '../constants/theme.js';
import { useAuth } from '../context/AuthContext.js';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  const SettingItem = ({ icon, label, value, onValueChange, type = 'chevron', color = colors.text.primary, onPress }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={type === 'switch' && !onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.bg.secondary }]}>
          <Ionicons name={icon} size={20} color={colors.brand.primary} />
        </View>
        <Text style={[styles.settingLabel, { color }]}>{label}</Text>
      </View>
      
      {type === 'switch' ? (
        <Switch 
          value={value} 
          onValueChange={onValueChange}
          trackColor={{ false: '#3E3E3E', true: colors.brand.primary }}
          thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : '#f4f3f4'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{user?.role?.toUpperCase() || 'FREE'}</Text>
          </View>
        </View>

        {/* Settings Groups */}
        <View style={styles.groups}>
          <View style={styles.group}>
            <Text style={styles.groupTitle}>Preferences</Text>
            <View style={styles.groupCard}>
              <SettingItem 
                icon="moon-outline" 
                label="Dark Mode" 
                type="switch" 
                value={isDarkMode} 
                onValueChange={setIsDarkMode} 
              />
              <View style={styles.separator} />
              <SettingItem 
                icon="notifications-outline" 
                label="Notifications" 
                type="switch" 
                value={notificationsEnabled} 
                onValueChange={setNotificationsEnabled} 
              />
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.groupTitle}>Account</Text>
            <View style={styles.groupCard}>
              <SettingItem 
                icon="person-outline" 
                label="Personal Information" 
                onPress={() => navigation.navigate('PersonalInfo')}
              />
              <View style={styles.separator} />
              <SettingItem 
                icon="shield-checkmark-outline" 
                label="Security & Password" 
                onPress={() => navigation.navigate('Security')}
              />
              <View style={styles.separator} />
              <SettingItem icon="card-outline" label="Payment Methods" />
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.groupTitle}>Support</Text>
            <View style={styles.groupCard}>
              <SettingItem icon="help-circle-outline" label="Help Center" />
              <View style={styles.separator} />
              <SettingItem icon="document-text-outline" label="Terms & Privacy" />
              <View style={styles.separator} />
              <SettingItem icon="chatbubble-outline" label="Send Feedback" />
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>SpendWise v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 8,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarText: {
    fontSize: 36,
    color: colors.text.inverse,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: typography.sizes['2xl'],
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  userEmail: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  badge: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 10,
    color: colors.brand.primary,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  groups: {
    paddingHorizontal: layout.screenPadding,
    gap: 24,
  },
  group: {
    gap: 12,
  },
  groupTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: 'bold',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginLeft: 4,
  },
  groupCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: layout.cardRadius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: typography.sizes.md,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginLeft: 64,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: 16,
    borderRadius: layout.buttonRadius,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutText: {
    color: colors.danger,
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
  },
  versionText: {
    textAlign: 'center',
    color: colors.text.tertiary,
    fontSize: 10,
    marginTop: 12,
  }
});

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Dimensions,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, layout } from '../constants/theme.js';
import { useAnalytics } from '../hooks/useAnalytics.js';
import { useAuth } from '../context/AuthContext.js';
import ExpenseItem from '../components/ExpenseItem.js';
import EmptyState from '../components/EmptyState.js';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const { summary, trends, recentExpenses, loading, refresh } = useAnalytics();

  const spentAmount = summary?.totalSpent || 0;
  const budgetAmount = summary?.totalBudget || 0;
  const usagePercent = summary?.budgetUsage || 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getTrendData = () => {
    if (!trends || trends.length < 2) return null;
    
    const current = trends[trends.length - 1].amount;
    const previous = trends[trends.length - 2].amount;
    
    if (previous === 0) {
      return {
        percent: current > 0 ? 100 : 0,
        isHigher: current > 0,
        label: current > 0 ? 'Increase from last month' : 'No change'
      };
    }
    
    const diff = ((current - previous) / previous) * 100;
    return {
      percent: Math.abs(diff).toFixed(1),
      isHigher: diff > 0,
      label: diff > 0 ? 'More than last month' : 'Less than last month'
    };
  };

  const trend = getTrendData();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.accent.primary} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle" size={40} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Main Spending Card */}
        <View style={styles.mainCard}>
          <Text style={styles.cardLabel}>Spent this month</Text>
          <Text style={styles.totalAmount}>₹{spentAmount.toLocaleString('en-IN')}</Text>
          
          <View style={styles.budgetProgressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Monthly Budget</Text>
              <Text style={styles.progressValue}>{usagePercent.toFixed(0)}% used</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${Math.min(usagePercent, 100)}%` },
                  usagePercent > 90 ? { backgroundColor: colors.status.error } : {}
                ]} 
              />
            </View>
            <View style={styles.budgetFooter}>
              <Text style={styles.budgetText}>Limit: ₹{budgetAmount.toLocaleString('en-IN')}</Text>
              <Text style={styles.budgetText}>Remaining: ₹{Math.max(0, budgetAmount - spentAmount).toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Insights</Text>
        </View>
        <View style={styles.insightsRow}>
          <View style={[styles.insightCard, { backgroundColor: '#1E1E2D' }]}>
            <Ionicons 
              name={trend?.isHigher ? "trending-up" : "trending-down"} 
              size={24} 
              color={trend?.isHigher ? colors.status.error : colors.status.success} 
            />
            <Text style={styles.insightValue}>{trend ? `${trend.percent}%` : '—'}</Text>
            <Text style={styles.insightLabel}>{trend ? trend.label : 'Waiting for more data'}</Text>
          </View>
          <View style={[styles.insightCard, { backgroundColor: '#1E1E2D' }]}>
            <Ionicons name="star" size={24} color={colors.accent.secondary} />
            <View style={{ marginTop: 8 }}>
              {summary?.topCategory ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name={summary.topCategory.icon} size={20} color={summary.topCategory.color} />
                  <Text style={[styles.insightValue, { marginTop: 0, marginLeft: 8 }]}>
                    {summary.topCategory.name}
                  </Text>
                </View>
              ) : (
                <Text style={styles.insightValue}>—</Text>
              )}
            </View>
            <Text style={styles.insightLabel}>Most frequent category</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Expenses', { screen: 'ExpenseList' })}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentList}>
          {recentExpenses.length > 0 ? (
            recentExpenses.map((expense) => (
              <ExpenseItem 
                key={expense.id} 
                expense={expense} 
                onPress={() => navigation.navigate('Expenses', { 
                  screen: 'ExpenseDetail', 
                  params: { expenseId: expense.id } 
                })}
              />
            ))
          ) : (
            <EmptyState
              icon="calendar-outline"
              title="No Activity"
              message="You haven't recorded any expenses recently."
              action={
                <TouchableOpacity 
                  style={styles.fabMini}
                  onPress={() => navigation.navigate('Expenses', { screen: 'AddExpense' })}
                >
                  <Text style={{ color: colors.accent.primary, fontWeight: 'bold' }}>Add Expense</Text>
                </TouchableOpacity>
              }
            />
          )}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('Expenses', { screen: 'AddExpense' })}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  scrollContent: {
    padding: layout.spacing.lg,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.xl,
  },
  greeting: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    fontFamily: typography.fonts.regular,
  },
  userName: {
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
    fontFamily: typography.fonts.bold,
  },
  mainCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: layout.borderRadius.xl,
    padding: layout.spacing.xl,
    marginBottom: layout.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalAmount: {
    fontSize: typography.sizes['3xl'],
    color: colors.text.primary,
    fontFamily: typography.fonts.bold,
    marginBottom: layout.spacing.xl,
  },
  budgetProgressContainer: {
    marginTop: layout.spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
  },
  progressValue: {
    color: colors.text.primary,
    fontSize: typography.sizes.sm,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accent.primary,
    borderRadius: 4,
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  budgetText: {
    fontSize: 10,
    color: colors.text.muted,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
    marginTop: layout.spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    fontFamily: typography.fonts.bold,
  },
  seeAll: {
    color: colors.accent.primary,
    fontSize: typography.sizes.sm,
  },
  insightsRow: {
    flexDirection: 'row',
    gap: layout.spacing.md,
    marginBottom: layout.spacing.xl,
  },
  insightCard: {
    flex: 1,
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.lg,
    alignItems: 'flex-start',
  },
  insightValue: {
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    fontWeight: 'bold',
    marginTop: 8,
  },
  insightLabel: {
    fontSize: 10,
    color: colors.text.muted,
    marginTop: 2,
  },
  recentList: {
    paddingHorizontal: 2,
    paddingVertical: 4,
  },
  emptyContainer: {
    padding: layout.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.text.muted,
    fontSize: typography.sizes.sm,
  },
  fabMini: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  }
});

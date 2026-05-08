import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, layout } from '../constants/theme.js';
import { expensesApi } from '../api/expenses.api.js';
import { useExpenses } from '../hooks/useExpenses.js';

export default function ExpenseDetailScreen({ route, navigation }) {
  const { expenseId } = route.params;
  const { removeExpense } = useExpenses();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenseDetails();
  }, [expenseId]);

  const fetchExpenseDetails = async () => {
    try {
      setLoading(true);
      const response = await expensesApi.getById(expenseId);
      setExpense(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch expense details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await removeExpense(expenseId);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete expense');
            }
          } 
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

  if (!expense) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('AddExpense', { expense })}
          style={styles.editBtn}
        >
          <Ionicons name="create-outline" size={24} color={colors.brand.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.amountCard}>
          <View style={[styles.categoryIcon, { backgroundColor: (expense.category?.color || colors.brand.primary) + '20' }]}>
            <Ionicons name={expense.category?.icon || 'cash-outline'} size={40} color={expense.category?.color || colors.brand.primary} />
          </View>
          <Text style={styles.amount}>₹{Number(expense.amount).toLocaleString('en-IN')}</Text>
          <Text style={styles.title}>{expense.title}</Text>
          <View style={[styles.badge, { backgroundColor: (expense.category?.color || colors.brand.primary) + '20' }]}>
            <Text style={[styles.badgeText, { color: expense.category?.color || colors.brand.primary }]}>
              {expense.category?.name}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
              <Text style={styles.infoLabel}>Date</Text>
            </View>
            <Text style={styles.infoValue}>
              {new Date(expense.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="time-outline" size={20} color={colors.text.secondary} />
              <Text style={styles.infoLabel}>Time</Text>
            </View>
            <Text style={styles.infoValue}>
              {new Date(expense.date).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>

          {expense.note ? (
            <View style={styles.noteBox}>
              <Text style={styles.noteLabel}>Note</Text>
              <Text style={styles.noteText}>{expense.note}</Text>
            </View>
          ) : null}
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color={colors.status.error} />
          <Text style={styles.deleteText}>Delete Expense</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  editBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 40,
  },
  amountCard: {
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    borderRadius: layout.borderRadius.xl,
    padding: spacing['3xl'],
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  categoryIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  amount: {
    fontSize: 42,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.xl,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    textTransform: 'uppercase',
  },
  infoSection: {
    marginTop: spacing['3xl'],
    gap: spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoLabel: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },
  infoValue: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  noteBox: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.bg.tertiary,
    borderRadius: layout.borderRadius.md,
  },
  noteLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  noteText: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    lineHeight: 22,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    padding: spacing.lg,
    borderRadius: layout.buttonRadius,
    borderWidth: 1,
    borderColor: colors.status.error + '40',
    gap: spacing.sm,
  },
  deleteText: {
    color: colors.status.error,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
});

import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  RefreshControl,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, layout } from '../constants/theme.js';
import { useExpenses } from '../hooks/useExpenses.js';
import ExpenseItem from '../components/ExpenseItem.js';
import EmptyState from '../components/EmptyState.js';

export default function ExpenseListScreen({ navigation }) {
  const { expenses, loading, fetchExpenses, setFilters, filters, removeExpense } = useExpenses();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExpenses();
    setRefreshing(false);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    // Debounce or immediate update? Immediate for now, or small timeout
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: text }));
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.text.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search expenses..."
          placeholderTextColor={colors.text.muted}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={18} color={colors.text.muted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Spent</Text>
        <Text style={styles.summaryAmount}>₹{totalSpent.toLocaleString('en-IN')}</Text>
      </View>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>History</Text>
        <TouchableOpacity onPress={() => {/* Filter logic later */}}>
          <Text style={styles.filterText}>Recent</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.accent.primary} />
      ) : (
        <EmptyState
          icon={searchQuery ? "search-outline" : "receipt-outline"}
          title={searchQuery ? "No results found" : "No expenses yet"}
          message={searchQuery 
            ? `We couldn't find any expenses matching "${searchQuery}"`
            : "Keep track of your spending by adding your first expense."}
          action={!searchQuery && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('AddExpense')}
            >
              <Text style={styles.addButtonText}>Add Expense</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Expenses</Text>
        <TouchableOpacity 
          style={styles.plusButton}
          onPress={() => navigation.navigate('AddExpense')}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseItem 
            expense={item} 
            onPress={() => navigation.navigate('ExpenseDetail', { expenseId: item.id })}
            onLongPress={() => {
              Alert.alert(
                'Delete Expense',
                'Are you sure you want to delete this expense?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => removeExpense(item.id) }
                ]
              );
            }}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={colors.accent.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.lg,
  },
  topBarTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  plusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    paddingHorizontal: layout.screenPadding,
    marginBottom: spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    borderRadius: layout.borderRadius.lg,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    marginLeft: 10,
  },
  summaryCard: {
    backgroundColor: '#1E1E2D',
    padding: spacing.xl,
    borderRadius: layout.cardRadius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: spacing.xl,
  },
  summaryLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  filterText: {
    fontSize: typography.sizes.sm,
    color: colors.accent.primary,
    fontWeight: typography.weights.medium,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyIconContainer: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: layout.buttonRadius,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.md,
  },
});

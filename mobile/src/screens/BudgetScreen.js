import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, layout } from '../constants/theme.js';
import { useBudgets } from '../hooks/useBudgets.js';
import { useCategories } from '../hooks/useCategories.js';
import EmptyState from '../components/EmptyState.js';

export default function BudgetScreen() {
  const { budgets, loading, saveBudget, deleteBudget, refresh } = useBudgets();
  const { categories } = useCategories();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [amount, setAmount] = useState('');

  const handleSave = async () => {
    if (!selectedCategory || !amount) {
      Alert.alert('Error', 'Please select a category and enter an amount');
      return;
    }

    const success = await saveBudget({
      categoryId: selectedCategory.id,
      limitAmount: parseFloat(amount),
      period: 'monthly'
    });

    if (success) {
      setModalVisible(false);
      setSelectedCategory(null);
      setAmount('');
    }
  };

  const handleDelete = (budget) => {
    Alert.alert(
      'Delete Budget',
      `Are you sure you want to delete the budget for ${budget.category.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteBudget(budget.id);
            if (success) {
              Alert.alert('Success', 'Budget deleted successfully');
            }
          }
        }
      ]
    );
  };

  const renderBudgetItem = ({ item }) => {
    const usage = (item.spentAmount / item.limitAmount) * 100;
    const isOver = usage > 100;

    return (
      <TouchableOpacity 
        style={styles.budgetItem}
        onLongPress={() => handleDelete(item)}
        activeOpacity={0.7}
      >
        <View style={styles.budgetHeader}>
          <View style={styles.categoryInfo}>
            <View style={[styles.iconContainer, { backgroundColor: item.category.color + '20' }]}>
              <Ionicons name={item.category.icon} size={20} color={item.category.color} />
            </View>
            <Text style={styles.categoryName}>{item.category.name}</Text>
          </View>
          <TouchableOpacity onPress={() => {
            setSelectedCategory(item.category);
            setAmount(item.limitAmount.toString());
            setModalVisible(true);
          }}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.amountRow}>
          <Text style={styles.spentLabel}>
            ₹{Number(item.spentAmount).toLocaleString('en-IN')} 
            <Text style={styles.limitLabel}> of ₹{Number(item.limitAmount).toLocaleString('en-IN')}</Text>
          </Text>
          <Text style={[styles.percentage, isOver ? { color: colors.status.error } : {}]}>
            {usage.toFixed(0)}%
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBg}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${Math.min(usage, 100)}%` },
                isOver ? { backgroundColor: colors.status.error } : 
                usage > 80 ? { backgroundColor: colors.status.warning } : {}
              ]} 
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Budgets</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color={colors.accent.primary} />
          <Text style={styles.addBtnText}>Set Budget</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={budgets}
        keyExtractor={(item) => item.id}
        renderItem={renderBudgetItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="pie-chart-outline"
            title="No Budgets Set"
            message="Track your spending by setting monthly limits for categories."
            action={
              <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
                <Ionicons name="add" size={24} color={colors.accent.primary} />
                <Text style={styles.addBtnText}>Set First Budget</Text>
              </TouchableOpacity>
            }
          />
        }
        refreshing={loading}
        onRefresh={refresh}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedCategory ? 'Update Budget' : 'New Budget'}
              </Text>
              <TouchableOpacity onPress={() => {
                setModalVisible(false);
                setSelectedCategory(null);
                setAmount('');
              }}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            {!selectedCategory && (
              <View style={styles.categoryPicker}>
                <Text style={styles.inputLabel}>Select Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                  {categories.map(cat => (
                    <TouchableOpacity 
                      key={cat.id}
                      style={[
                        styles.catItem,
                        selectedCategory?.id === cat.id && { borderColor: cat.color, backgroundColor: cat.color + '20' }
                      ]}
                      onPress={() => setSelectedCategory(cat)}
                    >
                      <Ionicons name={cat.icon} size={20} color={selectedCategory?.id === cat.id ? cat.color : colors.text.muted} />
                      <Text style={[
                        styles.catName, 
                        selectedCategory?.id === cat.id && { color: cat.color }
                      ]}>{cat.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {selectedCategory && (
              <View style={styles.selectedCatDisplay}>
                <Ionicons name={selectedCategory.icon} size={24} color={selectedCategory.color} />
                <Text style={styles.selectedCatName}>{selectedCategory.name}</Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Monthly Limit</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor={colors.text.muted}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  autoFocus
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
              <Text style={styles.saveBtnText}>{loading ? 'Saving...' : 'Save Budget'}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: layout.spacing.lg,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addBtnText: {
    color: colors.accent.primary,
    fontSize: typography.sizes.sm,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  listContent: {
    padding: layout.spacing.lg,
  },
  budgetItem: {
    backgroundColor: colors.bg.secondary,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.lg,
    marginBottom: layout.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryName: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    fontWeight: '600',
  },
  editBtn: {
    color: colors.text.muted,
    fontSize: typography.sizes.sm,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  spentLabel: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  limitLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    fontWeight: 'normal',
  },
  percentage: {
    fontSize: typography.sizes.sm,
    color: colors.accent.primary,
    fontWeight: 'bold',
  },
  progressContainer: {
    height: 6,
  },
  progressBg: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent.primary,
    borderRadius: 3,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.bg.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: layout.spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  categoryPicker: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  catScroll: {
    flexDirection: 'row',
  },
  catItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginRight: 10,
  },
  catName: {
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginLeft: 6,
  },
  selectedCatDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  selectedCatName: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    fontWeight: '600',
    marginLeft: 12,
  },
  inputGroup: {
    marginBottom: 32,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 8,
  },
  currencyPrefix: {
    fontSize: 24,
    color: colors.text.primary,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: colors.accent.primary,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
  }
});

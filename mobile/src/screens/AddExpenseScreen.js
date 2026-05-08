import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, layout } from '../constants/theme.js';
import { useExpenses } from '../hooks/useExpenses.js';
import { useCategories } from '../hooks/useCategories.js';
import { Ionicons } from '@expo/vector-icons';

export default function AddExpenseScreen({ route, navigation }) {
  const initialExpense = route.params?.expense;
  const isEditing = !!initialExpense;

  const { addExpense, updateExpense } = useExpenses();
  const { categories, loading: loadingCats } = useCategories();

  const [amount, setAmount] = useState(isEditing ? String(initialExpense.amount) : '');
  const [title, setTitle] = useState(isEditing ? initialExpense.title : '');
  const [categoryId, setCategoryId] = useState(isEditing ? initialExpense.categoryId : null);
  const [note, setNote] = useState(isEditing ? initialExpense.note || '' : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!amount || !title || !categoryId) {
      setError('Please fill in required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const expenseData = {
        amount: parseFloat(amount),
        title,
        categoryId,
        note,
        date: isEditing ? initialExpense.date : new Date().toISOString(),
      };

      let result;
      if (isEditing) {
        result = await updateExpense(initialExpense.id, expenseData);
      } else {
        result = await addExpense(expenseData);
      }

      if (!isEditing && result.budgetAlert) {
        Alert.alert(
          'Budget Exceeded! 🚨',
          `You've spent ₹${result.budgetAlert.totalSpent.toLocaleString('en-IN')} in ${result.budgetAlert.categoryName}, exceeding your limit of ₹${result.budgetAlert.limitAmount.toLocaleString('en-IN')}.`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        // If editing, we might want to navigate back twice (to list) or just back
        navigation.goBack();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>{isEditing ? 'Edit Expense' : 'Add Expense'}</Text>
          <View style={{ width: 50 }} /> 
        </View>

        <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Amount Input */}
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor={colors.text.tertiary}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              autoFocus={!isEditing}
            />
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="What did you spend on?"
                placeholderTextColor={colors.text.tertiary}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Category</Text>
              {loadingCats ? (
                <ActivityIndicator color={colors.brand.primary} />
              ) : (
                <View style={styles.categoryGrid}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryItem,
                        categoryId === cat.id && styles.categoryItemActive,
                        categoryId === cat.id && { borderColor: cat.color || colors.brand.primary }
                      ]}
                      onPress={() => setCategoryId(cat.id)}
                    >
                      <Ionicons 
                        name={cat.icon || 'help-circle'} 
                        size={24} 
                        color={categoryId === cat.id ? (cat.color || colors.brand.primary) : colors.text.secondary} 
                        style={{ marginBottom: 4 }}
                      />
                      <Text style={styles.categoryName} numberOfLines={1}>{cat.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Note (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add a note..."
                placeholderTextColor={colors.text.tertiary}
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.text.inverse} />
              ) : (
                <Text style={styles.saveButtonText}>{isEditing ? 'Update Expense' : 'Save Expense'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  backButton: {
    color: colors.text.secondary,
    fontSize: typography.sizes.md,
    width: 60,
  },
  topBarTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    marginTop: spacing.md,
    fontSize: typography.sizes.sm,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  currencySymbol: {
    fontSize: typography.sizes['4xl'],
    color: colors.text.primary,
    fontWeight: typography.weights.bold,
    marginRight: 8,
  },
  amountInput: {
    fontSize: 48,
    color: colors.text.primary,
    fontWeight: typography.weights.bold,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    minWidth: 100,
  },
  form: {
    paddingHorizontal: layout.screenPadding,
    gap: spacing.xl,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    fontWeight: typography.weights.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: colors.bg.input,
    borderRadius: layout.inputRadius,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryItem: {
    width: '31%',
    backgroundColor: colors.bg.secondary,
    borderRadius: layout.cardRadius,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  categoryItemActive: {
    backgroundColor: colors.brand.soft,
    borderWidth: 2,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: typography.sizes.xs,
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  saveButton: {
    backgroundColor: colors.brand.primary,
    borderRadius: layout.buttonRadius,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
});

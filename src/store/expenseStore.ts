import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Expense, RecurringExpense, Budget, ExpenseCategory } from '@/types/expense';

interface ExpenseStore {
  expenses: Expense[];
  recurringExpenses: RecurringExpense[];
  budgets: Budget[];

  // Expense actions
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getExpensesByProperty: (propertyId: string) => Expense[];
  getExpensesByDateRange: (propertyId: string, startDate: string, endDate: string) => Expense[];

  // Recurring expense actions
  addRecurringExpense: (expense: Omit<RecurringExpense, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateRecurringExpense: (id: string, updates: Partial<RecurringExpense>) => void;
  deleteRecurringExpense: (id: string) => void;
  generateRecurringExpenses: () => void;

  // Budget actions
  setBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  getBudgetByPropertyAndPeriod: (propertyId: string, year: number, month?: number) => Budget | undefined;

  // Analytics
  getExpensesByCategory: (propertyId: string, startDate: string, endDate: string) => Record<ExpenseCategory, number>;
  getTaxDeductibleTotal: (propertyId: string, year: number) => number;
  calculateVariance: (budgetId: string) => void;
}

/**
 * Expense Store
 * Manages property expenses, budgets, and recurring expenses
 */
export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      expenses: [],
      recurringExpenses: [],
      budgets: [],

      addExpense: (expense) => {
        const newExpense: Expense = {
          ...expense,
          id: `expense_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          expenses: [...state.expenses, newExpense],
        }));

        // Update budget actual amounts
        const budget = get().getBudgetByPropertyAndPeriod(
          expense.propertyId,
          new Date(expense.date).getFullYear(),
          new Date(expense.date).getMonth() + 1
        );
        if (budget) {
          get().calculateVariance(budget.id);
        }

        return newExpense.id;
      },

      updateExpense: (id, updates) => {
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
          ),
        }));
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        }));
      },

      getExpensesByProperty: (propertyId) => {
        return get().expenses.filter((e) => e.propertyId === propertyId);
      },

      getExpensesByDateRange: (propertyId, startDate, endDate) => {
        return get().expenses.filter(
          (e) =>
            e.propertyId === propertyId &&
            e.date >= startDate &&
            e.date <= endDate
        );
      },

      addRecurringExpense: (expense) => {
        const newRecurring: RecurringExpense = {
          ...expense,
          id: `recurring_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          recurringExpenses: [...state.recurringExpenses, newRecurring],
        }));

        return newRecurring.id;
      },

      updateRecurringExpense: (id, updates) => {
        set((state) => ({
          recurringExpenses: state.recurringExpenses.map((e) =>
            e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
          ),
        }));
      },

      deleteRecurringExpense: (id) => {
        set((state) => ({
          recurringExpenses: state.recurringExpenses.filter((e) => e.id !== id),
        }));
      },

      generateRecurringExpenses: () => {
        // Generate expenses from recurring templates
        const today = new Date();
        const activeRecurring = get().recurringExpenses.filter((r) => r.active);

        activeRecurring.forEach((recurring) => {
          const lastGenerated = recurring.lastGenerated
            ? new Date(recurring.lastGenerated)
            : new Date(recurring.startDate);

          let shouldGenerate = false;
          if (recurring.frequency === 'monthly') {
            const monthsSince = (today.getFullYear() - lastGenerated.getFullYear()) * 12 +
              (today.getMonth() - lastGenerated.getMonth());
            shouldGenerate = monthsSince >= 1;
          } else if (recurring.frequency === 'quarterly') {
            const monthsSince = (today.getFullYear() - lastGenerated.getFullYear()) * 12 +
              (today.getMonth() - lastGenerated.getMonth());
            shouldGenerate = monthsSince >= 3;
          } else if (recurring.frequency === 'annual') {
            shouldGenerate = today.getFullYear() > lastGenerated.getFullYear();
          }

          if (shouldGenerate) {
            get().addExpense({
              propertyId: recurring.propertyId,
              category: recurring.category,
              amount: recurring.amount,
              description: recurring.description,
              date: today.toISOString().split('T')[0],
              taxDeductible: recurring.taxDeductible,
              isRecurring: true,
              recurrenceId: recurring.id,
              vendor: recurring.vendor,
              createdBy: 'system',
            });

            get().updateRecurringExpense(recurring.id, {
              lastGenerated: today.toISOString(),
            });
          }
        });
      },

      setBudget: (budget) => {
        const newBudget: Budget = {
          ...budget,
          id: `budget_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          budgets: [...state.budgets, newBudget],
        }));

        return newBudget.id;
      },

      updateBudget: (id, updates) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
          ),
        }));
      },

      getBudgetByPropertyAndPeriod: (propertyId, year, month) => {
        return get().budgets.find(
          (b) => b.propertyId === propertyId && b.year === year && b.month === month
        );
      },

      getExpensesByCategory: (propertyId, startDate, endDate) => {
        const expenses = get().getExpensesByDateRange(propertyId, startDate, endDate);
        const result: Record<ExpenseCategory, number> = {} as any;

        expenses.forEach((expense) => {
          if (!result[expense.category]) {
            result[expense.category] = 0;
          }
          result[expense.category] += expense.amount;
        });

        return result;
      },

      getTaxDeductibleTotal: (propertyId, year) => {
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;
        const expenses = get().getExpensesByDateRange(propertyId, startDate, endDate);

        return expenses
          .filter((e) => e.taxDeductible)
          .reduce((sum, e) => sum + e.amount, 0);
      },

      calculateVariance: (budgetId) => {
        const budget = get().budgets.find((b) => b.id === budgetId);
        if (!budget) return;

        const startDate = budget.month
          ? `${budget.year}-${budget.month.toString().padStart(2, '0')}-01`
          : `${budget.year}-01-01`;
        const endDate = budget.month
          ? new Date(budget.year, budget.month, 0).toISOString().split('T')[0]
          : `${budget.year}-12-31`;

        const expensesByCategory = get().getExpensesByCategory(
          budget.propertyId,
          startDate,
          endDate
        );

        const updatedCategoryBudgets = budget.categoryBudgets.map((cb) => {
          const actualAmount = expensesByCategory[cb.category] || 0;
          const variance = cb.budgetAmount - actualAmount;
          const percentUsed = cb.budgetAmount > 0
            ? (actualAmount / cb.budgetAmount) * 100
            : 0;

          return {
            ...cb,
            actualAmount,
            variance,
            percentUsed,
          };
        });

        get().updateBudget(budgetId, {
          categoryBudgets: updatedCategoryBudgets,
        });
      },
    }),
    {
      name: 'expense-storage',
    }
  )
);

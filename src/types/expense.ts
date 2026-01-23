/**
 * Expense Tracking Types
 * Used for property expense management and budgeting
 */

export type ExpenseCategory =
  | 'maintenance_repairs'
  | 'utilities'
  | 'insurance'
  | 'property_taxes'
  | 'management_fees'
  | 'hoa_fees'
  | 'marketing'
  | 'legal_professional'
  | 'mortgage_interest'
  | 'other';

export type RecurrenceFrequency = 'monthly' | 'quarterly' | 'annual' | 'one_time';

export interface Expense {
  id: string;
  propertyId: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: string;
  receipt?: string; // Base64 or URL
  taxDeductible: boolean;
  isRecurring: boolean;
  recurrenceId?: string; // Link to recurring expense template
  vendor?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface RecurringExpense {
  id: string;
  propertyId: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  frequency: RecurrenceFrequency;
  startDate: string;
  endDate?: string;
  taxDeductible: boolean;
  vendor?: string;
  active: boolean;
  lastGenerated?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  propertyId: string;
  year: number;
  month?: number; // If null, annual budget
  categoryBudgets: CategoryBudget[];
  totalBudget: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryBudget {
  category: ExpenseCategory;
  budgetAmount: number;
  actualAmount: number;
  variance: number;
  percentUsed: number;
}

export interface ExpenseSummary {
  propertyId: string;
  period: 'month' | 'quarter' | 'year';
  startDate: string;
  endDate: string;
  totalExpenses: number;
  expensesByCategory: Record<ExpenseCategory, number>;
  taxDeductibleTotal: number;
  expenseCount: number;
}

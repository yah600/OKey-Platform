import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Download, TrendingUp } from 'lucide-react';
import { useExpenseStore } from '@/store/expenseStore';
import { useOwnerPropertiesStore } from '@/store/ownerPropertiesStore';
import { QuickExpenseEntry } from '@/components/expenses/QuickExpenseEntry';
import { ExpenseTable } from '@/components/expenses/ExpenseTable';
import { BudgetManager } from '@/components/expenses/BudgetManager';
import { ExpenseCategory } from '@/types/expense';

const categoryLabels: Record<ExpenseCategory, string> = {
  maintenance_repairs: 'Maintenance & Repairs',
  utilities: 'Utilities',
  insurance: 'Insurance',
  property_taxes: 'Property Taxes',
  management_fees: 'Management Fees',
  hoa_fees: 'HOA/Condo Fees',
  marketing: 'Marketing',
  legal_professional: 'Legal & Professional',
  mortgage_interest: 'Mortgage Interest',
  other: 'Other',
};

/**
 * Expense Tracking & Budgets Page
 * Track expenses, manage budgets, and analyze spending
 */
export function ExpenseTracking() {
  const navigate = useNavigate();
  const { properties } = useOwnerPropertiesStore();
  const { expenses, getExpensesByProperty, getExpensesByCategory, getTaxDeductibleTotal } = useExpenseStore();

  const [selectedProperty, setSelectedProperty] = useState(properties[0]?.id || '');
  const [showBudgetManager, setShowBudgetManager] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const propertyExpenses = selectedProperty
    ? getExpensesByProperty(selectedProperty).filter(
        (e) => e.date >= dateRange.start && e.date <= dateRange.end
      )
    : [];

  const totalExpenses = propertyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const taxDeductible = getTaxDeductibleTotal(
    selectedProperty,
    new Date().getFullYear()
  );

  const expensesByCategory = selectedProperty
    ? getExpensesByCategory(selectedProperty, dateRange.start, dateRange.end)
    : {};

  const chartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: categoryLabels[category as ExpenseCategory],
    value: amount,
  }));

  const handleExportCSV = () => {
    const csv = [
      ['Date', 'Category', 'Description', 'Amount', 'Tax Deductible', 'Vendor'].join(','),
      ...propertyExpenses.map((e) =>
        [
          e.date,
          categoryLabels[e.category],
          `"${e.description}"`,
          e.amount,
          e.taxDeductible ? 'Yes' : 'No',
          e.vendor || '',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${selectedProperty}_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/owner/financials')}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  Expense Tracking
                </h1>
                <p className="text-sm text-neutral-600">
                  Track expenses and manage budgets
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBudgetManager(!showBudgetManager)}
                className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Manage Budgets
              </button>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Property Selector & Date Range */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Property
                </label>
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
                >
                  {properties.map((prop) => (
                    <option key={prop.id} value={prop.id}>
                      {prop.buildingName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-neutral-200 rounded-xl p-6">
              <div className="text-sm text-neutral-600 mb-2">Total Expenses</div>
              <div className="text-3xl font-bold text-neutral-900">
                ${totalExpenses.toLocaleString()}
              </div>
              <div className="text-xs text-neutral-500 mt-2">
                {propertyExpenses.length} transactions
              </div>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-6">
              <div className="text-sm text-neutral-600 mb-2">Tax Deductible (YTD)</div>
              <div className="text-3xl font-bold text-green-900">
                ${taxDeductible.toLocaleString()}
              </div>
              <div className="text-xs text-neutral-500 mt-2">
                {((taxDeductible / totalExpenses) * 100).toFixed(0)}% of total
              </div>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-6">
              <div className="text-sm text-neutral-600 mb-2">Avg Monthly</div>
              <div className="text-3xl font-bold text-neutral-900">
                ${(totalExpenses / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-neutral-500 mt-2">
                Based on YTD data
              </div>
            </div>
          </div>

          {/* Quick Entry */}
          <QuickExpenseEntry propertyId={selectedProperty} />

          {/* Budget Manager */}
          {showBudgetManager && (
            <BudgetManager propertyId={selectedProperty} />
          )}

          {/* Category Breakdown */}
          {chartData.length > 0 && (
            <div className="bg-white border border-neutral-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">
                Expenses by Category
              </h3>
              <div className="space-y-3">
                {chartData
                  .sort((a, b) => b.value - a.value)
                  .map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="text-sm text-neutral-700">{item.name}</span>
                      <span className="text-sm font-semibold text-neutral-900">
                        ${item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Expense Table */}
          <ExpenseTable expenses={propertyExpenses} />
        </div>
      </div>
    </div>
  );
}

export default ExpenseTracking;

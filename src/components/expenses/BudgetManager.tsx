import { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useExpenseStore } from '@/store/expenseStore';
import { ExpenseCategory } from '@/types/expense';
import Input from '@/components/atoms/Input';
import { cn } from '@/lib/utils';

interface BudgetManagerProps {
  propertyId: string;
}

const categories: { value: ExpenseCategory; label: string }[] = [
  { value: 'maintenance_repairs', label: 'Maintenance & Repairs' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'property_taxes', label: 'Property Taxes' },
  { value: 'management_fees', label: 'Management Fees' },
  { value: 'hoa_fees', label: 'HOA/Condo Fees' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'legal_professional', label: 'Legal & Professional' },
  { value: 'mortgage_interest', label: 'Mortgage Interest' },
  { value: 'other', label: 'Other' },
];

/**
 * Budget Manager
 * Set and track budgets per category
 */
export function BudgetManager({ propertyId }: BudgetManagerProps) {
  const { budgets, setBudget, updateBudget, getBudgetByPropertyAndPeriod, calculateVariance } =
    useExpenseStore();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const budget = getBudgetByPropertyAndPeriod(propertyId, currentYear, currentMonth);

  const [budgetAmounts, setBudgetAmounts] = useState<Record<ExpenseCategory, number>>(
    {} as any
  );

  useEffect(() => {
    if (budget) {
      const amounts: Record<ExpenseCategory, number> = {} as any;
      budget.categoryBudgets.forEach((cb) => {
        amounts[cb.category] = cb.budgetAmount;
      });
      setBudgetAmounts(amounts);
    }
  }, [budget]);

  const handleSave = () => {
    const categoryBudgets = categories.map((cat) => ({
      category: cat.value,
      budgetAmount: budgetAmounts[cat.value] || 0,
      actualAmount: 0,
      variance: 0,
      percentUsed: 0,
    }));

    const totalBudget = Object.values(budgetAmounts).reduce((sum, val) => sum + val, 0);

    if (budget) {
      updateBudget(budget.id, { categoryBudgets, totalBudget });
    } else {
      const newBudgetId = setBudget({
        propertyId,
        year: currentYear,
        month: currentMonth,
        categoryBudgets,
        totalBudget,
      });
      calculateVariance(newBudgetId);
    }
  };

  const getCategoryBudget = (category: ExpenseCategory) => {
    return budget?.categoryBudgets.find((cb) => cb.category === category);
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-neutral-900">
          Monthly Budget - {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
        >
          Save Budget
        </button>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => {
          const categoryBudget = getCategoryBudget(cat.value);
          const isOverBudget = categoryBudget && categoryBudget.percentUsed > 100;

          return (
            <div key={cat.value} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-neutral-700">
                  {cat.label}
                </label>
                {categoryBudget && (
                  <div className="text-xs text-neutral-500 flex items-center gap-2">
                    <span>
                      ${categoryBudget.actualAmount.toLocaleString()} /{' '}
                      ${categoryBudget.budgetAmount.toLocaleString()}
                    </span>
                    {isOverBudget ? (
                      <TrendingUp className="w-3 h-3 text-red-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-green-600" />
                    )}
                  </div>
                )}
              </div>
              <Input
                type="number"
                value={budgetAmounts[cat.value] || ''}
                onChange={(e) =>
                  setBudgetAmounts({
                    ...budgetAmounts,
                    [cat.value]: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {categoryBudget && (
                <div className="relative w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'absolute inset-y-0 left-0 rounded-full transition-all',
                      isOverBudget ? 'bg-red-500' : 'bg-green-500'
                    )}
                    style={{
                      width: `${Math.min(100, categoryBudget.percentUsed)}%`,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

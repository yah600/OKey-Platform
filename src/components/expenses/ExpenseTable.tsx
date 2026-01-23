import { useState } from 'react';
import { Trash2, Receipt, CheckCircle2 } from 'lucide-react';
import { useExpenseStore } from '@/store/expenseStore';
import { Expense, ExpenseCategory } from '@/types/expense';

interface ExpenseTableProps {
  expenses: Expense[];
}

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
 * Expense Table
 * Filterable table of expenses
 */
export function ExpenseTable({ expenses }: ExpenseTableProps) {
  const { deleteExpense } = useExpenseStore();
  const [filter, setFilter] = useState('');

  const filteredExpenses = expenses.filter(
    (e) =>
      e.description.toLowerCase().includes(filter.toLowerCase()) ||
      categoryLabels[e.category].toLowerCase().includes(filter.toLowerCase()) ||
      e.vendor?.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-neutral-900">
            Recent Expenses
          </h3>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search expenses..."
            className="px-4 py-2 border border-neutral-200 rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                Vendor
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase">
                Tax Deductible
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {sortedExpenses.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                  No expenses found
                </td>
              </tr>
            ) : (
              sortedExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs">
                      {categoryLabels[expense.category]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-900">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {expense.vendor || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900 text-right">
                    ${expense.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {expense.taxDeductible && (
                      <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => {
                        if (confirm('Delete this expense?')) {
                          deleteExpense(expense.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

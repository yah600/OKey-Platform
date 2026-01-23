import { useState } from 'react';
import { Plus, Receipt } from 'lucide-react';
import { useExpenseStore } from '@/store/expenseStore';
import { ExpenseCategory } from '@/types/expense';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Checkbox from '@/components/atoms/Checkbox';
import { toast } from 'sonner';

interface QuickExpenseEntryProps {
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
 * Quick Expense Entry Form
 * Fast entry for common expenses
 */
export function QuickExpenseEntry({ propertyId }: QuickExpenseEntryProps) {
  const { addExpense } = useExpenseStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    category: 'maintenance_repairs' as ExpenseCategory,
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    taxDeductible: true,
    vendor: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount > 0 && formData.description) {
      addExpense({
        propertyId,
        ...formData,
        isRecurring: false,
        createdBy: 'current_owner',
      });
      toast.success('Expense added successfully');
      setFormData({
        category: 'maintenance_repairs',
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0],
        taxDeductible: true,
        vendor: '',
        notes: '',
      });
      setIsExpanded(false);
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full px-6 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
      >
        <Plus className="w-5 h-5" />
        Add New Expense
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-neutral-900">Add Expense</h3>
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="text-sm text-neutral-600 hover:text-neutral-900"
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value as ExpenseCategory })
            }
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
            required
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 mb-2">
            Amount *
          </label>
          <Input
            id="amount"
            type="number"
            value={formData.amount || ''}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-neutral-700 mb-2">
            Date *
          </label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div>
          <label htmlFor="vendor" className="block text-sm font-medium text-neutral-700 mb-2">
            Vendor
          </label>
          <Input
            id="vendor"
            value={formData.vendor}
            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
            placeholder="Company name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
          Description *
        </label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="What was this expense for?"
          required
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-2">
          Notes
        </label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional details..."
          rows={2}
        />
      </div>

      <div className="flex items-center justify-between">
        <Checkbox
          checked={formData.taxDeductible}
          onChange={(checked) => setFormData({ ...formData, taxDeductible: checked })}
          label="Tax deductible"
        />
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
      >
        Add Expense
      </button>
    </form>
  );
}

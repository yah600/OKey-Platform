import { useState } from 'react';
import { Plus, X, DollarSign } from 'lucide-react';
import { useChecklistStore } from '@/store/checklistStore';
import { SecurityDepositDeduction } from '@/types/checklist';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';

interface SecurityDepositCalculatorProps {
  checklistId: string;
}

const deductionCategories = [
  'Cleaning',
  'Repairs',
  'Painting',
  'Carpet cleaning/replacement',
  'Appliance repair',
  'Unpaid rent',
  'Unpaid utilities',
  'Key replacement',
  'Other',
];

/**
 * Security Deposit Calculator
 * Calculate deductions and final refund amount
 */
export function SecurityDepositCalculator({ checklistId }: SecurityDepositCalculatorProps) {
  const { getChecklistById, addDeduction, removeDeduction, calculateRefund } = useChecklistStore();
  const checklist = getChecklistById(checklistId);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Cleaning',
    description: '',
    amount: 0,
  });

  if (!checklist) return null;

  const totalDeductions = checklist.deductions?.reduce((sum, d) => sum + d.amount, 0) || 0;
  const refundAmount = calculateRefund(checklistId);

  const handleAddDeduction = () => {
    if (formData.description && formData.amount > 0) {
      const deduction: SecurityDepositDeduction = {
        id: `deduction_${Date.now()}`,
        ...formData,
      };
      addDeduction(checklistId, deduction);
      setFormData({ category: 'Cleaning', description: '', amount: 0 });
      setShowForm(false);
    }
  };

  return (
    <section className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-bold text-neutral-900">
        Security Deposit Calculator
      </h2>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-700 font-medium">Original Deposit</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">
            ${checklist.securityDepositAmount?.toLocaleString() || 0}
          </div>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-700 font-medium">Total Deductions</div>
          <div className="text-2xl font-bold text-red-900 mt-1">
            -${totalDeductions.toLocaleString()}
          </div>
        </div>
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-700 font-medium">Refund Amount</div>
          <div className="text-2xl font-bold text-green-900 mt-1">
            ${refundAmount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Deductions List */}
      {checklist.deductions && checklist.deductions.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-neutral-700">Deductions</div>
          {checklist.deductions.map((deduction) => (
            <div
              key={deduction.id}
              className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg flex items-start justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-neutral-200 text-neutral-700 text-xs font-medium rounded">
                    {deduction.category}
                  </span>
                  <span className="font-medium text-neutral-900">
                    ${deduction.amount.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-neutral-600 mt-1">
                  {deduction.description}
                </div>
              </div>
              <button
                onClick={() => removeDeduction(checklistId, deduction.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Deduction Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full px-4 py-3 border-2 border-dashed border-neutral-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-neutral-600"
        >
          <Plus className="w-4 h-4" />
          Add Deduction
        </button>
      )}

      {/* Add Deduction Form */}
      {showForm && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg"
            >
              {deductionCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="deduction-amount" className="block text-sm font-medium text-neutral-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                id="deduction-amount"
                type="number"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="deduction-description" className="block text-sm font-medium text-neutral-700 mb-2">
              Description
            </label>
            <Textarea
              id="deduction-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the reason for this deduction..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddDeduction}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Add Deduction
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

import { useState } from 'react';
import { Plus, Zap, Droplet, Flame, Camera } from 'lucide-react';
import { UtilityReading } from '@/types/checklist';
import Input from '@/components/atoms/Input';

interface UtilityReadingFormProps {
  readings: UtilityReading[];
  onAddReading: (reading: UtilityReading) => void;
}

const utilityTypes = [
  { type: 'electric' as const, label: 'Electric', icon: Zap, unit: 'kWh' },
  { type: 'gas' as const, label: 'Gas', icon: Flame, unit: 'm³' },
  { type: 'water' as const, label: 'Water', icon: Droplet, unit: 'm³' },
];

/**
 * Utility Reading Form
 * Capture meter readings for utilities
 */
export function UtilityReadingForm({ readings, onAddReading }: UtilityReadingFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    utilityType: 'electric' as const,
    meterNumber: '',
    reading: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const utilityConfig = utilityTypes.find(u => u.type === formData.utilityType);
    if (utilityConfig && formData.meterNumber && formData.reading > 0) {
      const reading: UtilityReading = {
        ...formData,
        unit: utilityConfig.unit,
        readingDate: new Date().toISOString(),
      };
      onAddReading(reading);
      setFormData({ utilityType: 'electric', meterNumber: '', reading: 0 });
      setShowForm(false);
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
      {/* Existing Readings */}
      {readings.length > 0 && (
        <div className="space-y-3">
          {readings.map((reading, index) => {
            const config = utilityTypes.find(u => u.type === reading.utilityType);
            const Icon = config?.icon || Zap;

            return (
              <div
                key={index}
                className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-neutral-900 capitalize">
                    {reading.utilityType}
                  </div>
                  <div className="text-sm text-neutral-600">
                    Meter #{reading.meterNumber} • {reading.reading} {reading.unit}
                  </div>
                </div>
                <div className="text-xs text-neutral-500">
                  {new Date(reading.readingDate).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Reading Form */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full px-4 py-3 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors flex items-center justify-center gap-2 text-neutral-600"
        >
          <Plus className="w-4 h-4" />
          Add Utility Reading
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 bg-primary-50 border border-primary-200 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Utility Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {utilityTypes.map((utility) => {
                const Icon = utility.icon;
                return (
                  <button
                    key={utility.type}
                    type="button"
                    onClick={() => setFormData({ ...formData, utilityType: utility.type })}
                    className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center gap-2 ${
                      formData.utilityType === utility.type
                        ? 'border-primary-600 bg-white'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium">{utility.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="meterNumber" className="block text-sm font-medium text-neutral-700 mb-2">
                Meter Number
              </label>
              <Input
                id="meterNumber"
                value={formData.meterNumber}
                onChange={(e) => setFormData({ ...formData, meterNumber: e.target.value })}
                placeholder="12345678"
                required
              />
            </div>
            <div>
              <label htmlFor="reading" className="block text-sm font-medium text-neutral-700 mb-2">
                Reading ({utilityTypes.find(u => u.type === formData.utilityType)?.unit})
              </label>
              <Input
                id="reading"
                type="number"
                value={formData.reading || ''}
                onChange={(e) => setFormData({ ...formData, reading: parseFloat(e.target.value) })}
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Add Reading
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

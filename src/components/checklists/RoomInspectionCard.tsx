import { useState } from 'react';
import { Camera, Plus, X, AlertCircle } from 'lucide-react';
import { RoomInspection, ConditionRating, Damage } from '@/types/checklist';
import Textarea from '@/components/atoms/Textarea';
import Input from '@/components/atoms/Input';
import { cn } from '@/lib/utils';

interface RoomInspectionCardProps {
  room: RoomInspection;
  onUpdate: (updates: Partial<RoomInspection>) => void;
}

const conditionColors: Record<ConditionRating, string> = {
  excellent: 'bg-green-100 text-green-700 border-green-200',
  good: 'bg-blue-100 text-blue-700 border-blue-200',
  fair: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  poor: 'bg-orange-100 text-orange-700 border-orange-200',
  damaged: 'bg-red-100 text-red-700 border-red-200',
};

/**
 * Room Inspection Card
 * Individual room condition documentation
 */
export function RoomInspectionCard({ room, onUpdate }: RoomInspectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDamageForm, setShowDamageForm] = useState(false);
  const [newDamage, setNewDamage] = useState({
    description: '',
    severity: 'minor' as const,
    estimatedCost: 0,
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const readers = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(photos => {
        onUpdate({ photos: [...room.photos, ...photos] });
      });
    }
  };

  const handleRemovePhoto = (index: number) => {
    onUpdate({ photos: room.photos.filter((_, i) => i !== index) });
  };

  const handleAddDamage = () => {
    if (newDamage.description) {
      const damage: Damage = {
        id: `damage_${Date.now()}`,
        ...newDamage,
        photos: [],
      };
      onUpdate({ damages: [...room.damages, damage] });
      setNewDamage({ description: '', severity: 'minor', estimatedCost: 0 });
      setShowDamageForm(false);
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-neutral-900">
            {room.roomName}
          </h3>
          <span
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium border',
              conditionColors[room.condition]
            )}
          >
            {room.condition}
          </span>
          {room.damages.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="w-3 h-3" />
              {room.damages.length} damage(s)
            </span>
          )}
        </div>
        <div className="text-sm text-neutral-500">
          {room.photos.length} photo(s)
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 py-4 border-t border-neutral-200 space-y-4">
          {/* Condition Rating */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Condition
            </label>
            <div className="flex flex-wrap gap-2">
              {(['excellent', 'good', 'fair', 'poor', 'damaged'] as ConditionRating[]).map(
                (rating) => (
                  <button
                    key={rating}
                    onClick={() => onUpdate({ condition: rating })}
                    className={cn(
                      'px-4 py-2 rounded-lg font-medium capitalize transition-colors border',
                      room.condition === rating
                        ? conditionColors[rating]
                        : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                    )}
                  >
                    {rating}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Photos
            </label>
            <div className="grid grid-cols-4 gap-3">
              {room.photos.map((photo, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={photo}
                    alt={`${room.roomName} photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
                <Camera className="w-6 h-6 text-neutral-400" />
                <span className="text-xs text-neutral-500">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor={`notes-${room.roomId}`} className="block text-sm font-medium text-neutral-700 mb-2">
              Notes
            </label>
            <Textarea
              id={`notes-${room.roomId}`}
              value={room.notes}
              onChange={(e) => onUpdate({ notes: e.target.value })}
              placeholder="Any observations, issues, or special conditions..."
              rows={3}
            />
          </div>

          {/* Damages */}
          {room.damages.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Documented Damages
              </label>
              <div className="space-y-2">
                {room.damages.map((damage) => (
                  <div
                    key={damage.id}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-red-900">
                          {damage.description}
                        </div>
                        <div className="text-sm text-red-700 mt-1">
                          Severity: {damage.severity} • Est. cost: ${damage.estimatedCost}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Damage Button */}
          {!showDamageForm && (
            <button
              onClick={() => setShowDamageForm(true)}
              className="w-full px-4 py-2 border-2 border-dashed border-neutral-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-neutral-600"
            >
              <Plus className="w-4 h-4" />
              Document Damage
            </button>
          )}

          {/* Damage Form */}
          {showDamageForm && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
              <Input
                placeholder="Damage description"
                value={newDamage.description}
                onChange={(e) => setNewDamage({ ...newDamage, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Severity
                  </label>
                  <select
                    value={newDamage.severity}
                    onChange={(e) =>
                      setNewDamage({ ...newDamage, severity: e.target.value as any })
                    }
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg"
                  >
                    <option value="minor">Minor</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Est. Cost
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newDamage.estimatedCost || ''}
                    onChange={(e) =>
                      setNewDamage({ ...newDamage, estimatedCost: parseFloat(e.target.value) })
                    }
                    min="0"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddDamage}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Add Damage
                </button>
                <button
                  onClick={() => setShowDamageForm(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Send } from 'lucide-react';
import { useChecklistStore } from '@/store/checklistStore';
import { useOwnerPropertiesStore } from '@/store/ownerPropertiesStore';
import { RoomInspectionCard } from '@/components/checklists/RoomInspectionCard';
import { UtilityReadingForm } from '@/components/checklists/UtilityReadingForm';
import { RoomInspection, UtilityReading, ConditionRating } from '@/types/checklist';
import { toast } from 'sonner';

const DEFAULT_ROOMS = [
  'Living Room',
  'Kitchen',
  'Bedroom 1',
  'Bedroom 2',
  'Bedroom 3',
  'Bathroom 1',
  'Bathroom 2',
  'Hallway',
  'Other',
];

/**
 * Move-In Checklist Page
 * Document property condition at tenant move-in
 */
export function MoveInChecklist() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const unitId = searchParams.get('unitId');
  const tenantId = searchParams.get('tenantId');

  const { createChecklist, updateChecklist } = useChecklistStore();
  const { properties } = useOwnerPropertiesStore();

  const [checklistId, setChecklistId] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RoomInspection[]>([]);
  const [utilityReadings, setUtilityReadings] = useState<UtilityReading[]>([]);
  const [overallCondition, setOverallCondition] = useState<ConditionRating>('good');

  useEffect(() => {
    if (unitId && tenantId) {
      // Initialize checklist
      const property = properties.find(p =>
        p.units?.some(u => u.id === unitId)
      );

      if (property) {
        const id = createChecklist({
          type: 'move_in',
          propertyId: property.id,
          unitId: unitId,
          tenantId: tenantId,
          tenantName: 'New Tenant', // Would come from tenant data
          rooms: [],
          utilityReadings: [],
          overallCondition: 'good',
          createdBy: 'current_owner',
        });
        setChecklistId(id);

        // Initialize default rooms
        const initialRooms: RoomInspection[] = DEFAULT_ROOMS.map((name, index) => ({
          roomId: `room_${index}`,
          roomName: name,
          condition: 'good',
          notes: '',
          photos: [],
          damages: [],
          lastInspected: new Date().toISOString(),
        }));
        setRooms(initialRooms);
      }
    }
  }, [unitId, tenantId, properties, createChecklist]);

  const handleRoomUpdate = (roomId: string, updates: Partial<RoomInspection>) => {
    setRooms(prev =>
      prev.map(room => room.roomId === roomId ? { ...room, ...updates } : room)
    );
  };

  const handleAddUtilityReading = (reading: UtilityReading) => {
    setUtilityReadings(prev => [...prev, reading]);
  };

  const handleSave = () => {
    if (checklistId) {
      updateChecklist(checklistId, {
        rooms,
        utilityReadings,
        overallCondition,
        updatedAt: new Date().toISOString(),
      });
      toast.success('Checklist saved as draft');
    }
  };

  const handleComplete = () => {
    if (checklistId) {
      updateChecklist(checklistId, {
        rooms,
        utilityReadings,
        overallCondition,
        completedAt: new Date().toISOString(),
      });
      toast.success('Move-in checklist completed!');
      navigate('/owner/residents');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/owner/residents')}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  Move-In Checklist
                </h1>
                <p className="text-sm text-neutral-600">
                  Document property condition for new tenant
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button
                onClick={handleComplete}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Complete & Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Room Inspections */}
          <section>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">
              Room-by-Room Inspection
            </h2>
            <div className="space-y-4">
              {rooms.map((room) => (
                <RoomInspectionCard
                  key={room.roomId}
                  room={room}
                  onUpdate={(updates) => handleRoomUpdate(room.roomId, updates)}
                />
              ))}
            </div>
          </section>

          {/* Utility Readings */}
          <section>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">
              Utility Meter Readings
            </h2>
            <UtilityReadingForm
              readings={utilityReadings}
              onAddReading={handleAddUtilityReading}
            />
          </section>

          {/* Overall Condition */}
          <section className="bg-white border border-neutral-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">
              Overall Property Condition
            </h2>
            <div className="flex gap-2">
              {(['excellent', 'good', 'fair', 'poor'] as ConditionRating[]).map((rating) => (
                <button
                  key={rating}
                  onClick={() => setOverallCondition(rating)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                    overallCondition === rating
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default MoveInChecklist;

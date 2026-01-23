import { AlertTriangle } from 'lucide-react';
import { useChecklistStore } from '@/store/checklistStore';
import { Checklist, ConditionRating } from '@/types/checklist';
import { cn } from '@/lib/utils';

interface ComparisonViewProps {
  moveInChecklist: Checklist;
  moveOutChecklistId: string;
}

const conditionColors: Record<ConditionRating, string> = {
  excellent: 'text-green-700 bg-green-100',
  good: 'text-blue-700 bg-blue-100',
  fair: 'text-yellow-700 bg-yellow-100',
  poor: 'text-orange-700 bg-orange-100',
  damaged: 'text-red-700 bg-red-100',
};

/**
 * Comparison View
 * Side-by-side comparison of move-in vs move-out conditions
 */
export function ComparisonView({ moveInChecklist, moveOutChecklistId }: ComparisonViewProps) {
  const { getChecklistById } = useChecklistStore();
  const moveOutChecklist = getChecklistById(moveOutChecklistId);

  if (!moveOutChecklist) return null;

  return (
    <section className="bg-white border-2 border-primary-200 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-bold text-neutral-900">
          Move-In vs Move-Out Comparison
        </h2>
      </div>

      <div className="space-y-4">
        {moveInChecklist.rooms.map((moveInRoom, index) => {
          const moveOutRoom = moveOutChecklist.rooms.find(
            r => r.roomName === moveInRoom.roomName
          ) || moveOutChecklist.rooms[index];

          if (!moveOutRoom) return null;

          const conditionWorsened =
            moveInRoom.condition !== moveOutRoom.condition;

          return (
            <div
              key={moveInRoom.roomId}
              className={cn(
                'p-4 rounded-lg border',
                conditionWorsened
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-neutral-50 border-neutral-200'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-neutral-900">
                  {moveInRoom.roomName}
                </h3>
                {conditionWorsened && (
                  <span className="text-xs font-medium text-yellow-700 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Condition changed
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Move-In */}
                <div>
                  <div className="text-xs font-medium text-neutral-500 mb-2">
                    Move-In Condition
                  </div>
                  <span
                    className={cn(
                      'inline-block px-3 py-1 rounded-full text-xs font-medium capitalize',
                      conditionColors[moveInRoom.condition]
                    )}
                  >
                    {moveInRoom.condition}
                  </span>
                  {moveInRoom.photos.length > 0 && (
                    <div className="mt-2 grid grid-cols-3 gap-1">
                      {moveInRoom.photos.slice(0, 3).map((photo, i) => (
                        <img
                          key={i}
                          src={photo}
                          alt={`${moveInRoom.roomName} move-in ${i + 1}`}
                          className="w-full aspect-square object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Move-Out */}
                <div>
                  <div className="text-xs font-medium text-neutral-500 mb-2">
                    Move-Out Condition
                  </div>
                  <span
                    className={cn(
                      'inline-block px-3 py-1 rounded-full text-xs font-medium capitalize',
                      conditionColors[moveOutRoom.condition]
                    )}
                  >
                    {moveOutRoom.condition}
                  </span>
                  {moveOutRoom.photos.length > 0 && (
                    <div className="mt-2 grid grid-cols-3 gap-1">
                      {moveOutRoom.photos.slice(0, 3).map((photo, i) => (
                        <img
                          key={i}
                          src={photo}
                          alt={`${moveOutRoom.roomName} move-out ${i + 1}`}
                          className="w-full aspect-square object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* New Damages */}
              {moveOutRoom.damages.length > 0 && (
                <div className="mt-3 pt-3 border-t border-neutral-200">
                  <div className="text-xs font-medium text-red-700 mb-2">
                    New Damages Documented
                  </div>
                  <div className="space-y-1">
                    {moveOutRoom.damages.map((damage) => (
                      <div
                        key={damage.id}
                        className="text-sm text-red-600 flex items-start gap-2"
                      >
                        <span>•</span>
                        <span>
                          {damage.description} ({damage.severity} - $
                          {damage.estimatedCost})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

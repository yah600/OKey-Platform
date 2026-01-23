import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Checklist, RoomInspection, UtilityReading, SecurityDepositDeduction } from '@/types/checklist';

interface ChecklistStore {
  checklists: Checklist[];
  currentChecklist: Checklist | null;

  // Actions
  createChecklist: (checklist: Omit<Checklist, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateChecklist: (id: string, updates: Partial<Checklist>) => void;
  deleteChecklist: (id: string) => void;
  getChecklistById: (id: string) => Checklist | undefined;
  getChecklistsByUnit: (unitId: string) => Checklist[];
  setCurrentChecklist: (checklist: Checklist | null) => void;

  // Room inspections
  addRoomInspection: (checklistId: string, room: RoomInspection) => void;
  updateRoomInspection: (checklistId: string, roomId: string, updates: Partial<RoomInspection>) => void;

  // Utility readings
  addUtilityReading: (checklistId: string, reading: UtilityReading) => void;
  updateUtilityReading: (checklistId: string, index: number, updates: Partial<UtilityReading>) => void;

  // Security deposit
  addDeduction: (checklistId: string, deduction: SecurityDepositDeduction) => void;
  removeDeduction: (checklistId: string, deductionId: string) => void;
  calculateRefund: (checklistId: string) => number;
}

/**
 * Checklist Store
 * Manages move-in and move-out checklists
 */
export const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set, get) => ({
      checklists: [],
      currentChecklist: null,

      createChecklist: (checklist) => {
        const newChecklist: Checklist = {
          ...checklist,
          id: `checklist_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          checklists: [...state.checklists, newChecklist],
        }));

        return newChecklist.id;
      },

      updateChecklist: (id, updates) => {
        set((state) => ({
          checklists: state.checklists.map((c) =>
            c.id === id
              ? { ...c, ...updates, updatedAt: new Date().toISOString() }
              : c
          ),
        }));
      },

      deleteChecklist: (id) => {
        set((state) => ({
          checklists: state.checklists.filter((c) => c.id !== id),
        }));
      },

      getChecklistById: (id) => {
        return get().checklists.find((c) => c.id === id);
      },

      getChecklistsByUnit: (unitId) => {
        return get().checklists.filter((c) => c.unitId === unitId);
      },

      setCurrentChecklist: (checklist) => {
        set({ currentChecklist: checklist });
      },

      addRoomInspection: (checklistId, room) => {
        const checklist = get().getChecklistById(checklistId);
        if (checklist) {
          get().updateChecklist(checklistId, {
            rooms: [...checklist.rooms, room],
          });
        }
      },

      updateRoomInspection: (checklistId, roomId, updates) => {
        const checklist = get().getChecklistById(checklistId);
        if (checklist) {
          const updatedRooms = checklist.rooms.map((r) =>
            r.roomId === roomId ? { ...r, ...updates } : r
          );
          get().updateChecklist(checklistId, { rooms: updatedRooms });
        }
      },

      addUtilityReading: (checklistId, reading) => {
        const checklist = get().getChecklistById(checklistId);
        if (checklist) {
          get().updateChecklist(checklistId, {
            utilityReadings: [...checklist.utilityReadings, reading],
          });
        }
      },

      updateUtilityReading: (checklistId, index, updates) => {
        const checklist = get().getChecklistById(checklistId);
        if (checklist) {
          const updatedReadings = [...checklist.utilityReadings];
          updatedReadings[index] = { ...updatedReadings[index], ...updates };
          get().updateChecklist(checklistId, {
            utilityReadings: updatedReadings,
          });
        }
      },

      addDeduction: (checklistId, deduction) => {
        const checklist = get().getChecklistById(checklistId);
        if (checklist) {
          get().updateChecklist(checklistId, {
            deductions: [...(checklist.deductions || []), deduction],
          });
        }
      },

      removeDeduction: (checklistId, deductionId) => {
        const checklist = get().getChecklistById(checklistId);
        if (checklist) {
          get().updateChecklist(checklistId, {
            deductions: checklist.deductions?.filter((d) => d.id !== deductionId),
          });
        }
      },

      calculateRefund: (checklistId) => {
        const checklist = get().getChecklistById(checklistId);
        if (!checklist || !checklist.securityDepositAmount) return 0;

        const totalDeductions = checklist.deductions?.reduce(
          (sum, d) => sum + d.amount,
          0
        ) || 0;

        return Math.max(0, checklist.securityDepositAmount - totalDeductions);
      },
    }),
    {
      name: 'checklist-storage',
    }
  )
);

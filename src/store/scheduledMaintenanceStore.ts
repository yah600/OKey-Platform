import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ScheduledMaintenance {
  id: string;
  ownerId: string;
  propertyId?: string;
  propertyName: string;
  title: string;
  description: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
  nextDue: string;
  lastCompleted?: string;
  vendorId?: string;
  vendorName: string;
  estimatedCost: number;
  status: 'upcoming' | 'overdue' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

interface ScheduledMaintenanceState {
  schedules: ScheduledMaintenance[];
  getSchedulesByOwner: (ownerId: string) => ScheduledMaintenance[];
  getScheduleById: (scheduleId: string) => ScheduledMaintenance | undefined;
  addSchedule: (schedule: Omit<ScheduledMaintenance, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSchedule: (scheduleId: string, updates: Partial<ScheduledMaintenance>) => void;
  deleteSchedule: (scheduleId: string) => void;
  markAsCompleted: (scheduleId: string) => void;
}

export const useScheduledMaintenanceStore = create<ScheduledMaintenanceState>()(
  persist(
    (set, get) => ({
      schedules: [
        {
          id: 'sched-1',
          ownerId: 'owner-1',
          propertyId: 'prop-owner-1',
          propertyName: 'Sunset Apartments',
          title: 'HVAC System Inspection',
          description: 'Annual HVAC system inspection and filter replacement for all units',
          frequency: 'Quarterly',
          nextDue: '2026-02-15',
          lastCompleted: '2025-11-15',
          vendorId: 'vendor-2',
          vendorName: 'Elite HVAC Solutions',
          estimatedCost: 350,
          status: 'upcoming',
          priority: 'high',
          createdAt: '2025-01-10T10:00:00Z',
          updatedAt: '2025-11-16T14:00:00Z',
        },
        {
          id: 'sched-2',
          ownerId: 'owner-1',
          propertyName: 'All Properties',
          title: 'Fire Alarm Testing',
          description: 'Test all fire alarms and smoke detectors, replace batteries as needed',
          frequency: 'Monthly',
          nextDue: '2026-01-31',
          lastCompleted: '2026-01-01',
          vendorName: 'SafeGuard Systems',
          estimatedCost: 200,
          status: 'upcoming',
          priority: 'high',
          createdAt: '2025-02-01T10:00:00Z',
          updatedAt: '2026-01-02T09:00:00Z',
        },
        {
          id: 'sched-3',
          ownerId: 'owner-1',
          propertyId: 'prop-owner-2',
          propertyName: 'Downtown Plaza',
          title: 'Elevator Maintenance',
          description: 'Regular elevator inspection and preventive maintenance',
          frequency: 'Monthly',
          nextDue: '2026-01-28',
          lastCompleted: '2025-12-28',
          vendorName: 'Vertical Transport Inc',
          estimatedCost: 450,
          status: 'upcoming',
          priority: 'medium',
          createdAt: '2025-03-10T10:00:00Z',
          updatedAt: '2025-12-29T11:00:00Z',
        },
        {
          id: 'sched-4',
          ownerId: 'owner-1',
          propertyId: 'prop-owner-1',
          propertyName: 'Sunset Apartments',
          title: 'Landscaping Service',
          description: 'Lawn mowing, trimming, hedge maintenance, and seasonal planting',
          frequency: 'Weekly',
          nextDue: '2026-01-26',
          lastCompleted: '2026-01-19',
          vendorId: 'vendor-5',
          vendorName: 'Garden Masters Landscaping',
          estimatedCost: 150,
          status: 'upcoming',
          priority: 'low',
          createdAt: '2025-04-05T10:00:00Z',
          updatedAt: '2026-01-20T10:00:00Z',
        },
        {
          id: 'sched-5',
          ownerId: 'owner-1',
          propertyName: 'All Properties',
          title: 'Common Area Cleaning',
          description: 'Deep cleaning of lobbies, hallways, and common areas',
          frequency: 'Weekly',
          nextDue: '2026-01-24',
          lastCompleted: '2026-01-17',
          vendorId: 'vendor-4',
          vendorName: 'Clean & Shine Maintenance',
          estimatedCost: 300,
          status: 'overdue',
          priority: 'medium',
          createdAt: '2025-02-15T10:00:00Z',
          updatedAt: '2026-01-18T15:00:00Z',
        },
        {
          id: 'sched-6',
          ownerId: 'owner-1',
          propertyId: 'prop-owner-2',
          propertyName: 'Downtown Plaza',
          title: 'Pool Maintenance',
          description: 'Pool cleaning, chemical balancing, and equipment inspection',
          frequency: 'Weekly',
          nextDue: '2026-02-01',
          lastCompleted: '2026-01-18',
          vendorName: 'AquaCare Pool Services',
          estimatedCost: 250,
          status: 'upcoming',
          priority: 'medium',
          createdAt: '2025-05-20T10:00:00Z',
          updatedAt: '2026-01-19T10:00:00Z',
        },
        {
          id: 'sched-7',
          ownerId: 'owner-1',
          propertyId: 'prop-owner-1',
          propertyName: 'Sunset Apartments',
          title: 'Parking Lot Cleaning',
          description: 'Power washing and sweeping of parking lot and garage areas',
          frequency: 'Monthly',
          nextDue: '2026-02-10',
          lastCompleted: '2026-01-10',
          vendorName: 'ProClean Services',
          estimatedCost: 180,
          status: 'upcoming',
          priority: 'low',
          createdAt: '2025-06-01T10:00:00Z',
          updatedAt: '2026-01-11T09:00:00Z',
        },
        {
          id: 'sched-8',
          ownerId: 'owner-1',
          propertyId: 'prop-owner-3',
          propertyName: 'Riverside Complex',
          title: 'Roof Inspection',
          description: 'Comprehensive roof inspection and minor repairs',
          frequency: 'Annually',
          nextDue: '2026-06-15',
          lastCompleted: '2025-06-15',
          vendorId: 'vendor-6',
          vendorName: 'Superior Roofing Co',
          estimatedCost: 800,
          status: 'upcoming',
          priority: 'high',
          createdAt: '2025-01-20T10:00:00Z',
          updatedAt: '2025-06-16T14:00:00Z',
        },
      ],

      getSchedulesByOwner: (ownerId) => {
        return get()
          .schedules.filter((s) => s.ownerId === ownerId)
          .sort((a, b) => {
            // Sort by status first (overdue > upcoming > completed)
            const statusOrder = { overdue: 0, upcoming: 1, completed: 2 };
            if (statusOrder[a.status] !== statusOrder[b.status]) {
              return statusOrder[a.status] - statusOrder[b.status];
            }
            // Then by next due date
            return new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime();
          });
      },

      getScheduleById: (scheduleId) => {
        return get().schedules.find((s) => s.id === scheduleId);
      },

      addSchedule: (schedule) => {
        const newSchedule: ScheduledMaintenance = {
          ...schedule,
          id: `sched-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          schedules: [newSchedule, ...state.schedules],
        }));
      },

      updateSchedule: (scheduleId, updates) => {
        set((state) => ({
          schedules: state.schedules.map((s) =>
            s.id === scheduleId
              ? { ...s, ...updates, updatedAt: new Date().toISOString() }
              : s
          ),
        }));
      },

      deleteSchedule: (scheduleId) => {
        set((state) => ({
          schedules: state.schedules.filter((s) => s.id !== scheduleId),
        }));
      },

      markAsCompleted: (scheduleId) => {
        const schedule = get().schedules.find((s) => s.id === scheduleId);
        if (!schedule) return;

        // Calculate next due date based on frequency
        const currentDue = new Date(schedule.nextDue);
        let nextDue = new Date(currentDue);

        switch (schedule.frequency) {
          case 'Daily':
            nextDue.setDate(nextDue.getDate() + 1);
            break;
          case 'Weekly':
            nextDue.setDate(nextDue.getDate() + 7);
            break;
          case 'Monthly':
            nextDue.setMonth(nextDue.getMonth() + 1);
            break;
          case 'Quarterly':
            nextDue.setMonth(nextDue.getMonth() + 3);
            break;
          case 'Annually':
            nextDue.setFullYear(nextDue.getFullYear() + 1);
            break;
        }

        set((state) => ({
          schedules: state.schedules.map((s) =>
            s.id === scheduleId
              ? {
                  ...s,
                  status: 'upcoming' as const,
                  lastCompleted: new Date().toISOString(),
                  nextDue: nextDue.toISOString().split('T')[0],
                  updatedAt: new Date().toISOString(),
                }
              : s
          ),
        }));
      },
    }),
    {
      name: 'okey-scheduled-maintenance-storage',
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MaintenanceRequest {
  id: string;
  userId: string;
  propertyId: string;
  unitId: string;
  propertyName: string;
  unitNumber: string;
  title: string;
  description: string;
  location: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'other';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  photos?: string[];
  submittedAt: string;
  updatedAt: string;
  scheduledDate?: string;
  completedDate?: string;
  assignedTo?: string;
  notes?: string[];
}

export interface MaintenanceNote {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

interface MaintenanceState {
  requests: MaintenanceRequest[];

  // Actions
  addRequest: (request: Omit<MaintenanceRequest, 'id' | 'submittedAt' | 'updatedAt' | 'status'>) => void;
  updateRequest: (requestId: string, updates: Partial<MaintenanceRequest>) => void;
  cancelRequest: (requestId: string) => void;
  getRequestsByUser: (userId: string) => MaintenanceRequest[];
  getRequestById: (requestId: string) => MaintenanceRequest | undefined;
  getRequestsByStatus: (userId: string, status: MaintenanceRequest['status']) => MaintenanceRequest[];
  getActiveRequestsCount: (userId: string) => number;
}

export const useMaintenanceStore = create<MaintenanceState>()(
  persist(
    (set, get) => ({
      requests: [
        {
          id: 'maint-1',
          userId: 'user-1',
          propertyId: 'prop-1',
          unitId: 'unit-1',
          propertyName: 'Sunset Apartments',
          unitNumber: '4B',
          title: 'Leaking faucet in kitchen',
          description: 'The kitchen sink faucet has been dripping constantly for the past two days. It\'s wasting water and making noise at night.',
          location: 'Kitchen',
          category: 'plumbing',
          priority: 'medium',
          status: 'in_progress',
          submittedAt: '2026-01-20T10:00:00Z',
          updatedAt: '2026-01-20T14:30:00Z',
          scheduledDate: '2026-01-23T09:00:00Z',
          assignedTo: 'John Smith - Plumber',
        },
        {
          id: 'maint-2',
          userId: 'user-1',
          propertyId: 'prop-1',
          unitId: 'unit-1',
          propertyName: 'Sunset Apartments',
          unitNumber: '4B',
          title: 'Air conditioning not cooling',
          description: 'The AC unit is running but not producing cold air. Room temperature is staying around 78°F even with AC set to 68°F.',
          location: 'Living Room',
          category: 'hvac',
          priority: 'high',
          status: 'pending',
          submittedAt: '2026-01-22T08:15:00Z',
          updatedAt: '2026-01-22T08:15:00Z',
        },
        {
          id: 'maint-3',
          userId: 'user-1',
          propertyId: 'prop-1',
          unitId: 'unit-1',
          propertyName: 'Sunset Apartments',
          unitNumber: '4B',
          title: 'Front door lock is sticky',
          description: 'The front door lock is difficult to turn and sometimes gets stuck. Need to jiggle the key to get it to unlock.',
          location: 'Front Door',
          category: 'structural',
          priority: 'low',
          status: 'completed',
          submittedAt: '2026-01-15T16:45:00Z',
          updatedAt: '2026-01-18T11:20:00Z',
          completedDate: '2026-01-18T11:20:00Z',
          assignedTo: 'Mike Johnson - Locksmith',
        },
      ],

      addRequest: (request) => {
        const newRequest: MaintenanceRequest = {
          ...request,
          id: `maint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          status: 'pending',
          submittedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          requests: [newRequest, ...state.requests],
        }));
      },

      updateRequest: (requestId, updates) => {
        set((state) => ({
          requests: state.requests.map((req) =>
            req.id === requestId
              ? { ...req, ...updates, updatedAt: new Date().toISOString() }
              : req
          ),
        }));
      },

      cancelRequest: (requestId) => {
        set((state) => ({
          requests: state.requests.map((req) =>
            req.id === requestId
              ? { ...req, status: 'cancelled' as const, updatedAt: new Date().toISOString() }
              : req
          ),
        }));
      },

      getRequestsByUser: (userId) => {
        return get()
          .requests.filter((req) => req.userId === userId)
          .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      },

      getRequestById: (requestId) => {
        return get().requests.find((req) => req.id === requestId);
      },

      getRequestsByStatus: (userId, status) => {
        return get()
          .requests.filter((req) => req.userId === userId && req.status === status)
          .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      },

      getActiveRequestsCount: (userId) => {
        return get().requests.filter(
          (req) => req.userId === userId && (req.status === 'pending' || req.status === 'in_progress')
        ).length;
      },
    }),
    {
      name: 'okey-maintenance-storage',
    }
  )
);

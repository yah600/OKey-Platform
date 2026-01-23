import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  propertyId?: string;
  propertyName: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface TaskState {
  tasks: Task[];
  getTasksByOwner: (ownerId: string) => Task[];
  getTaskById: (taskId: string) => Task | undefined;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskStatus: (taskId: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [
        {
          id: 'task-1',
          ownerId: 'owner-1',
          title: 'Review lease renewal for Unit 1A',
          description: 'Check lease terms and prepare renewal documents for tenant in Sunset Apartments Unit 1A',
          propertyId: 'prop-owner-1',
          propertyName: 'Sunset Apartments',
          priority: 'high',
          status: 'pending',
          dueDate: '2026-01-25',
          assignedTo: 'Property Manager',
          createdAt: '2026-01-15T10:00:00Z',
          updatedAt: '2026-01-15T10:00:00Z',
        },
        {
          id: 'task-2',
          ownerId: 'owner-1',
          title: 'Schedule annual property inspection',
          description: 'Coordinate with inspector for all properties - annual safety inspection required',
          propertyName: 'All Properties',
          priority: 'medium',
          status: 'in-progress',
          dueDate: '2026-01-28',
          assignedTo: 'You',
          createdAt: '2026-01-12T09:00:00Z',
          updatedAt: '2026-01-18T14:30:00Z',
        },
        {
          id: 'task-3',
          ownerId: 'owner-1',
          title: 'Update insurance policies',
          description: 'Review and renew property insurance for Downtown Plaza',
          propertyId: 'prop-owner-2',
          propertyName: 'Downtown Plaza',
          priority: 'high',
          status: 'pending',
          dueDate: '2026-01-26',
          assignedTo: 'You',
          createdAt: '2026-01-10T11:00:00Z',
          updatedAt: '2026-01-10T11:00:00Z',
        },
        {
          id: 'task-4',
          ownerId: 'owner-1',
          title: 'Prepare monthly financial reports',
          description: 'Compile revenue and expense reports for January across all properties',
          propertyName: 'All Properties',
          priority: 'medium',
          status: 'in-progress',
          dueDate: '2026-01-31',
          assignedTo: 'Accountant',
          createdAt: '2026-01-05T08:00:00Z',
          updatedAt: '2026-01-20T16:00:00Z',
        },
        {
          id: 'task-5',
          ownerId: 'owner-1',
          title: 'Follow up with late rent payments',
          description: 'Contact tenants with outstanding balances in Downtown Plaza',
          propertyId: 'prop-owner-2',
          propertyName: 'Downtown Plaza',
          priority: 'low',
          status: 'completed',
          dueDate: '2026-01-20',
          assignedTo: 'Property Manager',
          createdAt: '2026-01-08T10:00:00Z',
          updatedAt: '2026-01-19T15:30:00Z',
          completedAt: '2026-01-19T15:30:00Z',
        },
        {
          id: 'task-6',
          ownerId: 'owner-1',
          title: 'Schedule HVAC maintenance',
          description: 'Book preventive maintenance for all HVAC units in Sunset Apartments',
          propertyId: 'prop-owner-1',
          propertyName: 'Sunset Apartments',
          priority: 'low',
          status: 'completed',
          dueDate: '2026-01-15',
          assignedTo: 'Maintenance Team',
          createdAt: '2026-01-02T09:00:00Z',
          updatedAt: '2026-01-14T11:00:00Z',
          completedAt: '2026-01-14T11:00:00Z',
        },
        {
          id: 'task-7',
          ownerId: 'owner-1',
          title: 'Review security system upgrades',
          description: 'Evaluate proposals for upgrading security cameras at Riverside Complex',
          propertyId: 'prop-owner-3',
          propertyName: 'Riverside Complex',
          priority: 'medium',
          status: 'pending',
          dueDate: '2026-02-05',
          assignedTo: 'You',
          createdAt: '2026-01-18T13:00:00Z',
          updatedAt: '2026-01-18T13:00:00Z',
        },
        {
          id: 'task-8',
          ownerId: 'owner-1',
          title: 'Schedule fire safety inspection',
          description: 'Book fire safety inspection for Downtown Plaza',
          propertyId: 'prop-owner-2',
          propertyName: 'Downtown Plaza',
          priority: 'high',
          status: 'in-progress',
          dueDate: '2026-01-30',
          assignedTo: 'You',
          createdAt: '2026-01-16T10:00:00Z',
          updatedAt: '2026-01-21T09:00:00Z',
        },
      ],

      getTasksByOwner: (ownerId) => {
        return get()
          .tasks.filter((t) => t.ownerId === ownerId)
          .sort((a, b) => {
            // Sort by status first (pending > in-progress > completed)
            const statusOrder = { pending: 0, 'in-progress': 1, completed: 2 };
            if (statusOrder[a.status] !== statusOrder[b.status]) {
              return statusOrder[a.status] - statusOrder[b.status];
            }
            // Then by due date
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          });
      },

      getTaskById: (taskId) => {
        return get().tasks.find((t) => t.id === taskId);
      },

      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }));
      },

      updateTask: (taskId, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, ...updates, updatedAt: new Date().toISOString() }
              : t
          ),
        }));
      },

      deleteTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
        }));
      },

      toggleTaskStatus: (taskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== taskId) return t;

            let newStatus: Task['status'];
            const updates: Partial<Task> = { updatedAt: new Date().toISOString() };

            if (t.status === 'pending') {
              newStatus = 'in-progress';
            } else if (t.status === 'in-progress') {
              newStatus = 'completed';
              updates.completedAt = new Date().toISOString();
            } else {
              newStatus = 'pending';
              updates.completedAt = undefined;
            }

            return { ...t, status: newStatus, ...updates };
          }),
        }));
      },
    }),
    {
      name: 'okey-task-storage',
    }
  )
);

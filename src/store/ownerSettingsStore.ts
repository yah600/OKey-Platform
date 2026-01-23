import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OwnerSettings {
  ownerId: string;
  account: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName: string;
  };
  preferences: {
    language: 'en' | 'fr';
    timezone: string;
    dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
    currency: 'CAD' | 'USD';
  };
  notifications: {
    paymentNotifications: boolean;
    maintenanceRequests: boolean;
    leaseRenewals: boolean;
    newApplications: boolean;
    emergencyAlerts: boolean;
  };
}

interface OwnerSettingsState {
  settings: Record<string, OwnerSettings>;
  getSettings: (ownerId: string) => OwnerSettings | undefined;
  updateAccount: (ownerId: string, account: Partial<OwnerSettings['account']>) => void;
  updatePreferences: (ownerId: string, preferences: Partial<OwnerSettings['preferences']>) => void;
  toggleNotification: (ownerId: string, key: keyof OwnerSettings['notifications']) => void;
}

export const useOwnerSettingsStore = create<OwnerSettingsState>()(
  persist(
    (set, get) => ({
      settings: {
        'owner-1': {
          ownerId: 'owner-1',
          account: {
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@example.com',
            phone: '(514) 555-0100',
            companyName: 'Smith Properties Inc.',
          },
          preferences: {
            language: 'en',
            timezone: 'America/Toronto',
            dateFormat: 'MM/DD/YYYY',
            currency: 'CAD',
          },
          notifications: {
            paymentNotifications: true,
            maintenanceRequests: true,
            leaseRenewals: true,
            newApplications: true,
            emergencyAlerts: true,
          },
        },
      },

      getSettings: (ownerId) => get().settings[ownerId],

      updateAccount: (ownerId, account) => {
        set((state) => ({
          settings: {
            ...state.settings,
            [ownerId]: {
              ...state.settings[ownerId],
              account: { ...state.settings[ownerId].account, ...account },
            },
          },
        }));
      },

      updatePreferences: (ownerId, preferences) => {
        set((state) => ({
          settings: {
            ...state.settings,
            [ownerId]: {
              ...state.settings[ownerId],
              preferences: { ...state.settings[ownerId].preferences, ...preferences },
            },
          },
        }));
      },

      toggleNotification: (ownerId, key) => {
        set((state) => ({
          settings: {
            ...state.settings,
            [ownerId]: {
              ...state.settings[ownerId],
              notifications: {
                ...state.settings[ownerId].notifications,
                [key]: !state.settings[ownerId].notifications[key],
              },
            },
          },
        }));
      },
    }),
    {
      name: 'okey-owner-settings-storage',
    }
  )
);

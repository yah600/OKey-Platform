import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TenantProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  address: {
    unit: string;
    property: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  lease: {
    startDate: string;
    endDate: string;
    monthlyRent: number;
    securityDeposit: number;
    status: 'active' | 'expiring' | 'expired';
  };
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    language: 'en' | 'fr';
    theme: 'light' | 'dark' | 'system';
    timezone: string;
  };
}

interface ProfileState {
  profiles: Record<string, TenantProfile>;

  // Actions
  getProfile: (userId: string) => TenantProfile | undefined;
  updatePersonalInfo: (userId: string, data: Partial<Pick<TenantProfile, 'firstName' | 'lastName' | 'email' | 'phone'>>) => void;
  updateEmergencyContact: (userId: string, contact: Partial<TenantProfile['emergencyContact']>) => void;
  updatePreferences: (userId: string, preferences: Partial<TenantProfile['preferences']>) => void;
  toggleNotification: (userId: string, type: keyof TenantProfile['preferences']['notifications']) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: {
        'user-1': {
          userId: 'user-1',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'tenant@okey.com',
          phone: '+1 (514) 555-0123',
          emergencyContact: {
            name: 'John Johnson',
            relationship: 'Father',
            phone: '+1 (514) 555-0456',
          },
          address: {
            unit: '4B',
            property: 'Sunset Apartments',
            street: '123 Main St',
            city: 'Montreal',
            province: 'QC',
            postalCode: 'H3A 1B2',
          },
          lease: {
            startDate: '2025-09-01',
            endDate: '2026-08-31',
            monthlyRent: 2500,
            securityDeposit: 2500,
            status: 'active',
          },
          preferences: {
            notifications: {
              email: true,
              sms: false,
              push: true,
            },
            language: 'en',
            theme: 'light',
            timezone: 'America/Toronto',
          },
        },
      },

      getProfile: (userId) => {
        return get().profiles[userId];
      },

      updatePersonalInfo: (userId, data) => {
        set((state) => ({
          profiles: {
            ...state.profiles,
            [userId]: {
              ...state.profiles[userId],
              ...data,
            },
          },
        }));
      },

      updateEmergencyContact: (userId, contact) => {
        set((state) => ({
          profiles: {
            ...state.profiles,
            [userId]: {
              ...state.profiles[userId],
              emergencyContact: {
                ...state.profiles[userId].emergencyContact,
                ...contact,
              },
            },
          },
        }));
      },

      updatePreferences: (userId, preferences) => {
        set((state) => ({
          profiles: {
            ...state.profiles,
            [userId]: {
              ...state.profiles[userId],
              preferences: {
                ...state.profiles[userId].preferences,
                ...preferences,
                notifications: {
                  ...state.profiles[userId].preferences.notifications,
                  ...(preferences.notifications || {}),
                },
              },
            },
          },
        }));
      },

      toggleNotification: (userId, type) => {
        set((state) => {
          const profile = state.profiles[userId];
          if (!profile) return state;

          return {
            profiles: {
              ...state.profiles,
              [userId]: {
                ...profile,
                preferences: {
                  ...profile.preferences,
                  notifications: {
                    ...profile.preferences.notifications,
                    [type]: !profile.preferences.notifications[type],
                  },
                },
              },
            },
          };
        });
      },
    }),
    {
      name: 'okey-profile-storage',
    }
  )
);

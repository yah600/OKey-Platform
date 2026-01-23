import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UtilityAccount, MeterReading } from '@/types/utility';

interface UtilityStore {
  accounts: UtilityAccount[];
  readings: MeterReading[];

  addAccount: (account: Omit<UtilityAccount, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateAccount: (id: string, updates: Partial<UtilityAccount>) => void;
  deleteAccount: (id: string) => void;
  getAccountsByProperty: (propertyId: string) => UtilityAccount[];

  addReading: (reading: Omit<MeterReading, 'id'>) => string;
  getReadingsByAccount: (accountId: string) => MeterReading[];
}

export const useUtilityStore = create<UtilityStore>()(
  persist(
    (set, get) => ({
      accounts: [],
      readings: [],

      addAccount: (account) => {
        const newAccount: UtilityAccount = {
          ...account,
          id: `util_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ accounts: [...state.accounts, newAccount] }));
        return newAccount.id;
      },

      updateAccount: (id, updates) => {
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
          ),
        }));
      },

      deleteAccount: (id) => {
        set((state) => ({ accounts: state.accounts.filter((a) => a.id !== id) }));
      },

      getAccountsByProperty: (propertyId) => {
        return get().accounts.filter((a) => a.propertyId === propertyId);
      },

      addReading: (reading) => {
        const newReading: MeterReading = {
          ...reading,
          id: `reading_${Date.now()}`,
        };
        set((state) => ({ readings: [...state.readings, newReading] }));
        return newReading.id;
      },

      getReadingsByAccount: (accountId) => {
        return get().readings.filter((r) => r.accountId === accountId);
      },
    }),
    { name: 'utility-storage' }
  )
);

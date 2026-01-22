import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'tenant' | 'owner' | 'admin';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (email: string, password: string) => {
    // Mock authentication
    if (email === 'tenant@okey.com' && password === 'tenant123') {
      set({
        user: { id: '1', email, name: 'Sarah Johnson', role: 'tenant' },
        isAuthenticated: true,
      });
      return true;
    }
    if (email === 'owner@okey.com' && password === 'owner123') {
      set({
        user: { id: '2', email, name: 'Michael Chen', role: 'owner' },
        isAuthenticated: true,
      });
      return true;
    }
    return false;
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));

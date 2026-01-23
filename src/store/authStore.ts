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
  signup: (email: string, password: string, name: string, role: 'tenant' | 'owner') => Promise<boolean>;
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

  signup: async (email: string, password: string, name: string, role: 'tenant' | 'owner') => {
    // Mock signup - in production, this would call an API
    // For now, just create a user and log them in
    const userId = Math.random().toString(36).substring(7);

    set({
      user: { id: userId, email, name, role },
      isAuthenticated: true,
    });

    return true;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));

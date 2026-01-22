import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockUsers, getUserById, getUserByEmail } from '@/lib/data/mockData';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize - check localStorage for saved session
  useEffect(() => {
    const savedUserId = localStorage.getItem('okey_user_id');
    if (savedUserId) {
      const savedUser = getUserById(savedUserId);
      if (savedUser) {
        setUser(savedUser);
      } else {
        // Invalid user ID in localStorage, clear it
        localStorage.removeItem('okey_user_id');
      }
    }
    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user by email
    const foundUser = getUserByEmail(email);

    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    // Mock password validation
    // In demo mode, accept these passwords:
    // - For tenant@okey.com: "tenant123"
    // - For owner@okey.com: "owner123"
    // - For admin@okey.com: "admin123"
    // - For manager@okey.com: "manager123"
    // - For tenant2@okey.com: "tenant123"

    const validPasswords: Record<string, string> = {
      'tenant@okey.com': 'tenant123',
      'owner@okey.com': 'owner123',
      'admin@okey.com': 'admin123',
      'manager@okey.com': 'manager123',
      'tenant2@okey.com': 'tenant123',
    };

    if (validPasswords[email] && password !== validPasswords[email]) {
      throw new Error('Invalid email or password');
    }

    // Save to localStorage
    localStorage.setItem('okey_user_id', foundUser.id);
    setUser(foundUser);
  }

  function signOut() {
    localStorage.removeItem('okey_user_id');
    setUser(null);
  }

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Helper hook to check if user has specific role
export function useRole(allowedRoles: string[]) {
  const { user } = useAuth();

  if (!user) return false;
  return allowedRoles.includes(user.role);
}

// Helper hook to require authentication
export function useRequireAuth() {
  const { user, loading } = useAuth();

  return { user, loading, isAuthenticated: user !== null };
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authenticateUser } from '../../lib/auth/users-database';
import type { User, UserRole } from '../../lib/auth/types';
import { getHighestRole } from '../../lib/auth/role-config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  switchRole: (role: UserRole) => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('immolink_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user', err);
        localStorage.removeItem('immolink_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('[AUTH] Sign in started for:', email);
    setLoading(true);
    setError(null);

    try {
      // Simulate network delay for realistic feel
      await new Promise(resolve => setTimeout(resolve, 800));

      console.log('[AUTH] Authenticating user...');
      const authenticatedUser = authenticateUser(email, password);

      if (!authenticatedUser) {
        throw new Error('Invalid email or password');
      }

      console.log('[AUTH] User authenticated:', authenticatedUser.email);

      const user: User = {
        id: authenticatedUser.id,
        email: authenticatedUser.email,
        name: authenticatedUser.name,
        role: authenticatedUser.role as UserRole,
        propertyIds: authenticatedUser.propertyIds,
        unitIds: authenticatedUser.unitIds,
        properties: authenticatedUser.properties,
        units: authenticatedUser.units,
        avatar: authenticatedUser.avatar,
      };

      // Support for multiple roles
      // If user has multiple roles, set the highest as default active role
      if (user.roles && user.roles.length > 0) {
        user.activeRole = getHighestRole(user.roles);
      } else {
        user.activeRole = user.role;
      }

      console.log('[AUTH] Saving user to localStorage');
      localStorage.setItem('immolink_user', JSON.stringify(user));
      console.log('[AUTH] Setting user state');
      setUser(user);
      console.log('[AUTH] Sign in completed successfully');
    } catch (err) {
      console.error('[AUTH] Sign in error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    localStorage.removeItem('immolink_user');
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  /**
   * Switch between roles for users with multiple roles
   * Implementation from Section 3 - Role Switching Logic
   */
  const switchRole = (role: UserRole) => {
    if (!user) return;

    // Check if user has this role
    const availableRoles = user.roles || [user.role];
    if (!availableRoles.includes(role)) {
      setError('You do not have access to this role');
      return;
    }

    // Update active role
    const updatedUser = {
      ...user,
      activeRole: role,
    };

    setUser(updatedUser);
    localStorage.setItem('immolink_user', JSON.stringify(updatedUser));

    // Clear any errors
    setError(null);
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock: In real app, this would send a password reset email via API
      // For now, just store the reset token in localStorage
      const resetToken = `reset-${email}-${Date.now()}`;
      localStorage.setItem('password-reset-token', resetToken);
      localStorage.setItem('password-reset-email', email);

      console.log('Password reset email sent to:', email);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signOut, clearError, switchRole, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
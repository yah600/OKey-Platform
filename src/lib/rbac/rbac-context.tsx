import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, Permission, hasPermission, hasAnyPermission, hasAllPermissions } from './permissions';
import type { User } from '../auth/types';
import { canAccessNavigation, getRoleConfig } from '../auth/role-config';

interface RBACContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  can: (permission: Permission) => boolean;
  canAny: (permissions: Permission[]) => boolean;
  canAll: (permissions: Permission[]) => boolean;
  isRole: (role: UserRole) => boolean;
  hasAccessToProperty: (propertyId: string) => boolean;
  hasAccessToUnit: (unitId: string) => boolean;
  canAccessNav: (navigationItem: string) => boolean;
  getActiveRole: () => UserRole | null;
  getRoleDashboardFocus: () => string[];
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

interface RBACProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

export function RBACProvider({ children, initialUser = null }: RBACProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);

  /**
   * Get the active role - either the switched role or the user's primary role
   */
  const getActiveRole = (): UserRole | null => {
    if (!user) return null;
    return user.activeRole || user.role;
  };

  const can = (permission: Permission): boolean => {
    if (!user) return false;
    const activeRole = getActiveRole();
    if (!activeRole) return false;
    return hasPermission(activeRole, permission);
  };

  const canAny = (permissions: Permission[]): boolean => {
    if (!user) return false;
    const activeRole = getActiveRole();
    if (!activeRole) return false;
    return hasAnyPermission(activeRole, permissions);
  };

  const canAll = (permissions: Permission[]): boolean => {
    if (!user) return false;
    const activeRole = getActiveRole();
    if (!activeRole) return false;
    return hasAllPermissions(activeRole, permissions);
  };

  const isRole = (role: UserRole): boolean => {
    const activeRole = getActiveRole();
    return activeRole === role;
  };

  const hasAccessToProperty = (propertyId: string): boolean => {
    if (!user) return false;
    const activeRole = getActiveRole();
    // Super admin and property managers have access to all properties
    if (activeRole === 'super_admin' || activeRole === 'property_manager') return true;
    // Accountant has access to all properties for financial view
    if (activeRole === 'accountant') return true;
    // Emergency agent has access to all properties
    if (activeRole === 'emergency_agent') return true;
    // Others only have access to their assigned properties
    return user.propertyIds?.includes(propertyId) ?? false;
  };

  const hasAccessToUnit = (unitId: string): boolean => {
    if (!user) return false;
    const activeRole = getActiveRole();
    // Super admin and property managers have access to all units
    if (activeRole === 'super_admin' || activeRole === 'property_manager') return true;
    // Others only have access to their assigned units
    return user.unitIds?.includes(unitId) ?? false;
  };

  /**
   * Check if user can access a navigation item based on their role
   * Implementation from Section 3 - Role-Based Navigation
   */
  const canAccessNav = (navigationItem: string): boolean => {
    const activeRole = getActiveRole();
    if (!activeRole) return false;
    return canAccessNavigation(activeRole, navigationItem);
  };

  /**
   * Get dashboard focus items for the user's active role
   * Implementation from Section 3 - Dashboard Focus
   */
  const getRoleDashboardFocus = (): string[] => {
    const activeRole = getActiveRole();
    if (!activeRole) return [];
    const config = getRoleConfig(activeRole);
    return config.dashboardFocus;
  };

  return (
    <RBACContext.Provider
      value={{
        user,
        setUser,
        can,
        canAny,
        canAll,
        isRole,
        hasAccessToProperty,
        hasAccessToUnit,
        canAccessNav,
        getActiveRole,
        getRoleDashboardFocus,
      }}
    >
      {children}
    </RBACContext.Provider>
  );
}

export function useRBAC() {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
}

// HOC to protect components based on permissions
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: Permission | Permission[],
  fallback?: ReactNode
) {
  return function ProtectedComponent(props: P) {
    const { can, canAny } = useRBAC();
    
    const hasRequiredPermission = Array.isArray(requiredPermission)
      ? canAny(requiredPermission)
      : can(requiredPermission);

    if (!hasRequiredPermission) {
      return <>{fallback ?? null}</>;
    }

    return <Component {...props} />;
  };
}

// Component to conditionally render based on permissions
interface CanProps {
  permission: Permission | Permission[];
  any?: boolean; // If true, user needs ANY of the permissions. If false, needs ALL
  fallback?: ReactNode;
  children: ReactNode;
}

export function Can({ permission, any = true, fallback = null, children }: CanProps) {
  const { can, canAny, canAll } = useRBAC();

  const hasRequiredPermission = Array.isArray(permission)
    ? (any ? canAny(permission) : canAll(permission))
    : can(permission);

  if (!hasRequiredPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
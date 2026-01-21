/**
 * Shared Authentication Types
 * Central type definitions for authentication and authorization
 */

export type UserRole =
  | 'super_admin'
  | 'property_manager'
  | 'board_member'
  | 'accountant'
  | 'owner'
  | 'tenant'
  | 'vendor'
  | 'emergency_agent';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  roles?: UserRole[]; // For users with multiple roles
  activeRole?: UserRole; // Currently active role if user has multiple
  propertyIds?: string[];
  unitIds?: string[];
  avatar?: string;
  properties?: string[]; // Legacy support - display only
  units?: string[]; // Legacy support - display only
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

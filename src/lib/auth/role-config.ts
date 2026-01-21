/**
 * RBAC Role Configuration
 * Implementation from: Section 3 "Role-Based Logic System" - immoflow_logic_architecture.md
 * 
 * Defines the 8 user roles with their navigation visibility, dashboard focus,
 * unique features, and restrictions following the IMMOFLOW logic architecture.
 */

import { UserRole } from './types';

export interface RoleConfiguration {
  role: UserRole;
  label: string;
  description: string;
  navigationVisible: string[];
  dashboardFocus: string[];
  uniqueFeatures: string[];
  restrictions: string[];
  color: string; // CSS variable reference
}

/**
 * Role configurations based on Section 3 of architecture document
 * Each role has specific navigation, dashboard focus, and capabilities
 */
export const ROLE_CONFIGS: Record<UserRole, RoleConfiguration> = {
  super_admin: {
    role: 'super_admin',
    label: 'Super Admin',
    description: 'Full system access and configuration',
    navigationVisible: [
      'home',
      'properties',
      'people',
      'operations',
      'financials',
      'compliance',
      'governance',
      'communications',
      'settings',
      'users',
      'audit-logs',
      'integrations',
    ],
    dashboardFocus: [
      'System health metrics',
      'User activity overview',
      'Financial overview across all properties',
      'System performance indicators',
    ],
    uniqueFeatures: [
      'System settings configuration',
      'Audit logs access',
      'User management',
      'All CRUD operations',
      'Integration management',
      'AI workflow configuration',
    ],
    restrictions: [],
    color: 'var(--chart-5)', // Purple
  },

  property_manager: {
    role: 'property_manager',
    label: 'Property Manager',
    description: 'Day-to-day property operations management',
    navigationVisible: [
      'home',
      'properties',
      'people',
      'operations',
      'financials',
      'compliance',
      'communications',
    ],
    dashboardFocus: [
      "Today's tasks and schedule",
      'Pending approvals',
      'Urgent issues and emergencies',
      'Upcoming deadlines',
    ],
    uniqueFeatures: [
      'Work order assignment',
      'Vendor management',
      'Compliance submission',
      'Property and unit management',
      'Resident management',
      'Maintenance scheduling',
    ],
    restrictions: [
      'Cannot approve budgets >$10K',
      'Cannot delete financial records',
    ],
    color: 'var(--primary)',
  },

  board_member: {
    role: 'board_member',
    label: 'Board Member',
    description: 'Governance, decision-making, and oversight',
    navigationVisible: [
      'home',
      'properties',
      'financials',
      'compliance',
      'governance',
      'communications',
    ],
    dashboardFocus: [
      'Compliance status',
      'Contingency fund health',
      'Pending votes',
      'Meeting schedule',
    ],
    uniqueFeatures: [
      'Voting rights',
      'Resolution approval',
      'Financial approval',
      'Law 16 sign-off',
      'Meeting management',
      'Budget approval',
    ],
    restrictions: [
      'Cannot edit properties',
      'Cannot manage residents',
      'Cannot assign work orders',
      'Read-only on properties',
    ],
    color: 'var(--chart-1)', // Red/Orange
  },

  accountant: {
    role: 'accountant',
    label: 'Accountant',
    description: 'Financial management and reporting',
    navigationVisible: [
      'home',
      'properties',
      'financials',
      'compliance',
    ],
    dashboardFocus: [
      'Accounts receivable',
      'Accounts payable',
      'Bank reconciliation status',
      'Budget variance analysis',
    ],
    uniqueFeatures: [
      'Bank reconciliation',
      'Financial exports',
      'Audit reports',
      'Budget creation',
      'Full financial module access',
    ],
    restrictions: [
      'Cannot manage properties',
      'Cannot communicate with residents (unless authorized)',
      'Financial view only on properties',
    ],
    color: 'var(--chart-3)', // Green
  },

  owner: {
    role: 'owner',
    label: 'Owner',
    description: 'Unit owner with voting rights',
    navigationVisible: [
      'home',
      'my-unit',
      'financials',
      'documents',
      'communications',
      'governance',
    ],
    dashboardFocus: [
      'Current balance due',
      'Payment history',
      'Maintenance requests status',
      'Upcoming meetings and votes',
    ],
    uniqueFeatures: [
      'Payment portal',
      'Voting in meetings',
      'Document access',
      'Issue reporting',
      'Personal financial statements',
    ],
    restrictions: [
      'See only owned unit data',
      'Cannot access other units',
      'Read-only on most content',
      'No property management access',
    ],
    color: 'var(--chart-2)', // Orange
  },

  tenant: {
    role: 'tenant',
    label: 'Tenant',
    description: 'Resident with limited access',
    navigationVisible: [
      'home',
      'my-unit',
      'maintenance',
      'documents',
      'communications',
    ],
    dashboardFocus: [
      'Rent due date and amount',
      'Maintenance requests',
      'Community announcements',
      'Lease information',
    ],
    uniqueFeatures: [
      'Rent payment',
      'Maintenance request submission',
      'Document viewing',
      'Community announcements',
    ],
    restrictions: [
      'Most restrictive role',
      'Only own unit data',
      'No financial details beyond rent',
      'No governance access',
      'Cannot see other residents',
    ],
    color: 'var(--chart-4)', // Blue
  },

  vendor: {
    role: 'vendor',
    label: 'Vendor',
    description: 'External service provider access',
    navigationVisible: [
      'home',
      'work-orders',
      'schedule',
      'documents',
      'messages',
    ],
    dashboardFocus: [
      'Assigned work orders',
      "Today's schedule",
      'Pending invoices',
      'Payment status',
    ],
    uniqueFeatures: [
      'Work order status updates',
      'Photo uploads for jobs',
      'Invoice submission',
      'Time tracking',
      'Job completion documentation',
    ],
    restrictions: [
      'See only assigned work orders',
      'No property financial data',
      'No resident contact info (unless for specific job)',
      'Cannot create work orders',
    ],
    color: 'var(--accent)',
  },

  emergency_agent: {
    role: 'emergency_agent',
    label: 'Emergency Agent',
    description: '24/7 emergency response access',
    navigationVisible: [
      'home',
      'properties',
      'emergency-contacts',
      'maintenance',
    ],
    dashboardFocus: [
      'Active emergencies',
      'On-call schedule',
      'Property access codes',
      'Emergency protocols',
    ],
    uniqueFeatures: [
      'Create urgent work orders',
      'Access all emergency contacts',
      'View property systems',
      'Emergency protocol access',
      'After-hours property access',
    ],
    restrictions: [
      'Cannot see financials',
      'Cannot access normal operations',
      'Time-limited access logs',
      'Emergency-only permissions',
    ],
    color: 'var(--destructive)', // Red
  },
};

/**
 * Get role configuration
 */
export function getRoleConfig(role: UserRole): RoleConfiguration {
  return ROLE_CONFIGS[role];
}

/**
 * Get role label
 */
export function getRoleLabel(role: UserRole): string {
  return ROLE_CONFIGS[role].label;
}

/**
 * Get role color (CSS variable)
 */
export function getRoleColor(role: UserRole): string {
  return ROLE_CONFIGS[role].color;
}

/**
 * Check if role can access a navigation item
 */
export function canAccessNavigation(role: UserRole, navigationItem: string): boolean {
  return ROLE_CONFIGS[role].navigationVisible.includes(navigationItem);
}

/**
 * Get visible navigation items for role
 */
export function getVisibleNavigation(role: UserRole): string[] {
  return ROLE_CONFIGS[role].navigationVisible;
}

/**
 * Role hierarchy for permission elevation
 * Higher index = higher privilege level
 */
export const ROLE_HIERARCHY: UserRole[] = [
  'tenant',
  'owner',
  'vendor',
  'emergency_agent',
  'accountant',
  'board_member',
  'property_manager',
  'super_admin',
];

/**
 * Get highest role from a list of roles
 * Used for users with multiple roles
 */
export function getHighestRole(roles: UserRole[]): UserRole {
  let highestIndex = -1;
  let highestRole: UserRole = 'tenant';

  roles.forEach(role => {
    const index = ROLE_HIERARCHY.indexOf(role);
    if (index > highestIndex) {
      highestIndex = index;
      highestRole = role;
    }
  });

  return highestRole;
}

/**
 * Compare role privilege levels
 * Returns true if role1 has higher or equal privilege than role2
 */
export function hasHigherOrEqualRole(role1: UserRole, role2: UserRole): boolean {
  const index1 = ROLE_HIERARCHY.indexOf(role1);
  const index2 = ROLE_HIERARCHY.indexOf(role2);
  return index1 >= index2;
}

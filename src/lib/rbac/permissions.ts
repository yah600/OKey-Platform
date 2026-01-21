// Role-Based Access Control (RBAC) System for Immolink
// 8 User Roles: Property Manager, Board Member, Accountant, Owner, Tenant, Vendor, Emergency Agent, Super Admin

export type UserRole = 
  | 'super_admin'
  | 'property_manager'
  | 'board_member'
  | 'accountant'
  | 'owner'
  | 'tenant'
  | 'vendor'
  | 'emergency_agent';

export type Permission = 
  // Property Permissions
  | 'properties.view'
  | 'properties.create'
  | 'properties.edit'
  | 'properties.delete'
  | 'properties.manage_units'
  
  // Financial Permissions
  | 'finances.view'
  | 'finances.view_all'
  | 'finances.create'
  | 'finances.edit'
  | 'finances.approve'
  | 'finances.export'
  
  // Issue Permissions
  | 'issues.view'
  | 'issues.create'
  | 'issues.edit'
  | 'issues.delete'
  | 'issues.assign'
  | 'issues.resolve'
  
  // Maintenance Permissions
  | 'maintenance.view'
  | 'maintenance.create'
  | 'maintenance.edit'
  | 'maintenance.delete'
  | 'maintenance.schedule'
  | 'maintenance.complete'
  
  // Document Permissions
  | 'documents.view'
  | 'documents.view_all'
  | 'documents.upload'
  | 'documents.edit'
  | 'documents.delete'
  | 'documents.approve'
  
  // Meeting Permissions
  | 'meetings.view'
  | 'meetings.create'
  | 'meetings.edit'
  | 'meetings.delete'
  | 'meetings.manage_agenda'
  
  // Voting Permissions
  | 'voting.view'
  | 'voting.create'
  | 'voting.vote'
  | 'voting.manage'
  | 'voting.view_results'
  
  // Resident Permissions
  | 'residents.view'
  | 'residents.view_all'
  | 'residents.create'
  | 'residents.edit'
  | 'residents.delete'
  | 'residents.manage'
  
  // Law 16 Compliance Permissions
  | 'law16.view'
  | 'law16.manage'
  | 'law16.submit'
  | 'law16.approve'
  
  // Settings & Admin Permissions
  | 'settings.view'
  | 'settings.edit'
  | 'users.view'
  | 'users.manage'
  | 'roles.manage'
  | 'audit.view'
  
  // AI & Automation Permissions
  | 'ai.use'
  | 'ai.manage_workflows'
  | 'ai.view_insights';

// Permission definitions for each role
export const rolePermissions: Record<UserRole, Permission[]> = {
  super_admin: [
    // Super Admin has ALL permissions
    'properties.view', 'properties.create', 'properties.edit', 'properties.delete', 'properties.manage_units',
    'finances.view', 'finances.view_all', 'finances.create', 'finances.edit', 'finances.approve', 'finances.export',
    'issues.view', 'issues.create', 'issues.edit', 'issues.delete', 'issues.assign', 'issues.resolve',
    'maintenance.view', 'maintenance.create', 'maintenance.edit', 'maintenance.delete', 'maintenance.schedule', 'maintenance.complete',
    'documents.view', 'documents.view_all', 'documents.upload', 'documents.edit', 'documents.delete', 'documents.approve',
    'meetings.view', 'meetings.create', 'meetings.edit', 'meetings.delete', 'meetings.manage_agenda',
    'voting.view', 'voting.create', 'voting.vote', 'voting.manage', 'voting.view_results',
    'residents.view', 'residents.view_all', 'residents.create', 'residents.edit', 'residents.delete', 'residents.manage',
    'law16.view', 'law16.manage', 'law16.submit', 'law16.approve',
    'settings.view', 'settings.edit', 'users.view', 'users.manage', 'roles.manage', 'audit.view',
    'ai.use', 'ai.manage_workflows', 'ai.view_insights',
  ],
  
  property_manager: [
    // Full property and operational management
    'properties.view', 'properties.create', 'properties.edit', 'properties.manage_units',
    'finances.view', 'finances.view_all', 'finances.create', 'finances.edit', 'finances.export',
    'issues.view', 'issues.create', 'issues.edit', 'issues.assign', 'issues.resolve',
    'maintenance.view', 'maintenance.create', 'maintenance.edit', 'maintenance.schedule', 'maintenance.complete',
    'documents.view', 'documents.view_all', 'documents.upload', 'documents.edit',
    'meetings.view', 'meetings.create', 'meetings.edit', 'meetings.manage_agenda',
    'voting.view', 'voting.create', 'voting.manage', 'voting.view_results',
    'residents.view', 'residents.view_all', 'residents.create', 'residents.edit', 'residents.manage',
    'law16.view', 'law16.manage', 'law16.submit',
    'settings.view', 'users.view',
    'ai.use', 'ai.manage_workflows', 'ai.view_insights',
  ],
  
  board_member: [
    // Governance and oversight
    'properties.view',
    'finances.view', 'finances.view_all', 'finances.approve', 'finances.export',
    'issues.view', 'issues.create',
    'maintenance.view',
    'documents.view', 'documents.view_all', 'documents.upload', 'documents.approve',
    'meetings.view', 'meetings.create', 'meetings.edit', 'meetings.manage_agenda',
    'voting.view', 'voting.create', 'voting.vote', 'voting.manage', 'voting.view_results',
    'residents.view', 'residents.view_all',
    'law16.view', 'law16.approve',
    'settings.view', 'users.view',
    'ai.use', 'ai.view_insights',
  ],
  
  accountant: [
    // Financial management and reporting
    'properties.view',
    'finances.view', 'finances.view_all', 'finances.create', 'finances.edit', 'finances.export',
    'issues.view',
    'maintenance.view',
    'documents.view', 'documents.view_all', 'documents.upload',
    'meetings.view',
    'voting.view', 'voting.view_results',
    'residents.view', 'residents.view_all',
    'law16.view',
    'settings.view',
    'ai.use', 'ai.view_insights',
  ],
  
  owner: [
    // Unit owner access
    'properties.view',
    'finances.view',
    'issues.view', 'issues.create',
    'maintenance.view',
    'documents.view', 'documents.upload',
    'meetings.view',
    'voting.view', 'voting.vote', 'voting.view_results',
    'residents.view',
    'law16.view',
    'settings.view',
    'ai.use',
  ],
  
  tenant: [
    // Tenant access
    'properties.view',
    'issues.view', 'issues.create',
    'maintenance.view',
    'documents.view',
    'meetings.view',
    'settings.view',
    'ai.use',
  ],
  
  vendor: [
    // Service provider access
    'properties.view',
    'issues.view',
    'maintenance.view', 'maintenance.complete',
    'documents.view', 'documents.upload',
    'settings.view',
  ],
  
  emergency_agent: [
    // Emergency response access
    'properties.view',
    'issues.view', 'issues.create', 'issues.edit',
    'maintenance.view', 'maintenance.create',
    'documents.view',
    'residents.view', 'residents.view_all',
    'settings.view',
  ],
};

// Check if a user has a specific permission
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return rolePermissions[userRole]?.includes(permission) ?? false;
}

// Check if a user has any of the specified permissions
export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

// Check if a user has all of the specified permissions
export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

// Get all permissions for a role
export function getRolePermissions(userRole: UserRole): Permission[] {
  return rolePermissions[userRole] ?? [];
}

// Get role display name
export function getRoleDisplayName(role: UserRole, language: 'en' | 'fr' = 'en'): string {
  const roleNames = {
    en: {
      super_admin: 'Super Administrator',
      property_manager: 'Property Manager',
      board_member: 'Board Member',
      accountant: 'Accountant',
      owner: 'Owner',
      tenant: 'Tenant',
      vendor: 'Vendor',
      emergency_agent: 'Emergency Agent',
    },
    fr: {
      super_admin: 'Super Administrateur',
      property_manager: 'Gestionnaire Immobilier',
      board_member: 'Membre du Conseil',
      accountant: 'Comptable',
      owner: 'Propriétaire',
      tenant: 'Locataire',
      vendor: 'Fournisseur',
      emergency_agent: 'Agent d\'Urgence',
    },
  };
  
  return roleNames[language][role];
}

// Get role description
export function getRoleDescription(role: UserRole, language: 'en' | 'fr' = 'en'): string {
  const descriptions = {
    en: {
      super_admin: 'Full system access with all permissions',
      property_manager: 'Manages properties, residents, and daily operations',
      board_member: 'Governance and oversight, approves major decisions',
      accountant: 'Financial management and reporting',
      owner: 'Unit owner with voting rights',
      tenant: 'Occupant with limited access',
      vendor: 'Service provider for maintenance tasks',
      emergency_agent: 'Emergency response and crisis management',
    },
    fr: {
      super_admin: 'Accès complet au système avec toutes les permissions',
      property_manager: 'Gère les propriétés, résidents et opérations quotidiennes',
      board_member: 'Gouvernance et supervision, approuve les décisions majeures',
      accountant: 'Gestion financière et rapports',
      owner: 'Propriétaire d\'unité avec droit de vote',
      tenant: 'Occupant avec accès limité',
      vendor: 'Fournisseur de services pour tâches de maintenance',
      emergency_agent: 'Réponse d\'urgence et gestion de crise',
    },
  };
  
  return descriptions[language][role];
}

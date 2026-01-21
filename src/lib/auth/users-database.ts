// Mock user database - In production, this would be replaced with Supabase/Firebase
export interface UserCredentials {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  avatar?: string;
  propertyIds?: string[];
  unitIds?: string[];
  properties?: string[]; // Legacy - for display only
  units?: string[]; // Legacy - for display only
}

export const mockUsers: UserCredentials[] = [
  // Super Admin - Full access to everything
  {
    id: 'user-1',
    email: 'admin@immolink.com',
    password: 'admin123',
    name: 'Alexandre Dupont',
    role: 'super_admin',
    propertyIds: [], // Empty = access to all
    unitIds: [],
    properties: ['All Properties'],
  },
  
  // Property Manager - Full property management
  {
    id: 'user-2',
    email: 'manager@immolink.com',
    password: 'manager123',
    name: 'Marie Dubois',
    role: 'property_manager',
    propertyIds: [], // Empty = access to all
    unitIds: [],
    properties: ['All Properties'],
  },
  
  // Board Member - Governance and oversight
  {
    id: 'user-3',
    email: 'board@immolink.com',
    password: 'board123',
    name: 'Jean Tremblay',
    role: 'board_member',
    propertyIds: ['property-1'],
    unitIds: [],
    properties: ['Le Château'],
  },
  
  // Accountant - Financial management
  {
    id: 'user-4',
    email: 'accountant@immolink.com',
    password: 'accountant123',
    name: 'Sophie Laurent',
    role: 'accountant',
    propertyIds: [], // Access to all for financial reporting
    unitIds: [],
    properties: ['All Properties'],
  },
  
  // Owner - Limited to own unit
  {
    id: 'user-5',
    email: 'owner@immolink.com',
    password: 'owner123',
    name: 'Pierre Martin',
    role: 'owner',
    propertyIds: ['property-1'],
    unitIds: ['unit-305'],
    properties: ['Le Château'],
    units: ['Unit 305'],
  },
  
  // Tenant - Very limited access
  {
    id: 'user-6',
    email: 'tenant@immolink.com',
    password: 'tenant123',
    name: 'Julie Bertrand',
    role: 'tenant',
    propertyIds: ['property-1'],
    unitIds: ['unit-204'],
    properties: ['Le Château'],
    units: ['Unit 204'],
  },
  
  // Vendor - Service provider access
  {
    id: 'user-7',
    email: 'vendor@immolink.com',
    password: 'vendor123',
    name: 'Marc Gagnon',
    role: 'vendor',
    propertyIds: [], // Access to all properties for maintenance
    unitIds: [],
    properties: ['All Properties'],
  },
  
  // Emergency Agent - Emergency response access
  {
    id: 'user-8',
    email: 'emergency@immolink.com',
    password: 'emergency123',
    name: 'Isabelle Roy',
    role: 'emergency_agent',
    propertyIds: [], // Access to all for emergencies
    unitIds: [],
    properties: ['All Properties'],
  },
];

// Authenticate user with email and password
export function authenticateUser(email: string, password: string): UserCredentials | null {
  const user = mockUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  
  if (user) {
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as UserCredentials;
  }
  
  return null;
}

// Get user by email
export function getUserByEmail(email: string): UserCredentials | null {
  const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as UserCredentials;
  }
  return null;
}

// Get role display info
export function getRoleInfo(role: string): { label: string; color: string; description: string } {
  const roleMap: Record<string, { label: string; color: string; description: string }> = {
    super_admin: {
      label: 'Super Admin',
      color: 'var(--color-chart-5)',
      description: 'Full system access and control',
    },
    property_manager: {
      label: 'Property Manager',
      color: 'var(--color-primary)',
      description: 'Manage properties, residents, and operations',
    },
    board_member: {
      label: 'Board Member',
      color: 'var(--color-chart-1)',
      description: 'Governance and decision-making authority',
    },
    accountant: {
      label: 'Accountant',
      color: 'var(--color-chart-3)',
      description: 'Financial management and reporting',
    },
    owner: {
      label: 'Owner',
      color: 'var(--color-chart-2)',
      description: 'Unit owner with voting rights',
    },
    tenant: {
      label: 'Tenant',
      color: 'var(--color-chart-4)',
      description: 'Resident with limited access',
    },
    vendor: {
      label: 'Vendor',
      color: 'var(--color-accent)',
      description: 'Service provider access',
    },
    emergency_agent: {
      label: 'Emergency Agent',
      color: 'var(--color-destructive)',
      description: 'Emergency response and monitoring',
    },
  };
  
  return roleMap[role] || { label: role, color: 'var(--color-muted-foreground)', description: '' };
}

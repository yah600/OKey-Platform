// Route-based permissions for Immolink Client Portal
// Maps routes to required permissions

import { Permission } from './permissions';

// Define route permission requirements
export interface RoutePermission {
  path: string;
  permissions: Permission[]; // User needs at least ONE of these permissions
  requireAll?: boolean; // If true, user needs ALL permissions
  redirect?: string; // Where to redirect if access denied (default: /dashboard)
}

// Route permission mappings
export const routePermissions: RoutePermission[] = [
  // Dashboard - accessible to all authenticated users
  {
    path: '/dashboard',
    permissions: [], // No specific permission required - all authenticated users
  },
  
  // Executive Dashboard - Super Admin and Board Members only
  {
    path: '/dashboard/executive',
    permissions: ['finances.view_all', 'audit.view'],
  },
  
  // Properties
  {
    path: '/properties',
    permissions: ['properties.view'],
  },
  {
    path: '/properties/create',
    permissions: ['properties.create'],
    redirect: '/properties',
  },
  {
    path: '/properties/:id',
    permissions: ['properties.view'],
  },
  {
    path: '/properties/:id/edit',
    permissions: ['properties.edit'],
    redirect: '/properties',
  },
  
  // Finances
  {
    path: '/finances',
    permissions: ['finances.view'],
  },
  {
    path: '/finances/billing-automation',
    permissions: ['finances.create', 'finances.edit'],
  },
  {
    path: '/finances/late-fees',
    permissions: ['finances.create', 'finances.edit'],
  },
  {
    path: '/finances/nsf',
    permissions: ['finances.create', 'finances.edit'],
  },
  {
    path: '/finances/reconciliation',
    permissions: ['finances.view_all', 'finances.edit'],
  },
  {
    path: '/finances/reports',
    permissions: ['finances.view', 'finances.export'],
  },
  
  // Issues
  {
    path: '/issues',
    permissions: ['issues.view'],
  },
  {
    path: '/issues/report',
    permissions: ['issues.create'],
  },
  {
    path: '/issues/:id',
    permissions: ['issues.view'],
  },
  
  // Maintenance
  {
    path: '/maintenance',
    permissions: ['maintenance.view'],
  },
  {
    path: '/maintenance/:id',
    permissions: ['maintenance.view'],
  },
  
  // Documents
  {
    path: '/documents',
    permissions: ['documents.view'],
  },
  
  // Law 16 Compliance
  {
    path: '/law16',
    permissions: ['law16.view'],
  },
  {
    path: '/law16/maintenance-logbook',
    permissions: ['law16.view'],
  },
  {
    path: '/law16/maintenance-logbook/create',
    permissions: ['law16.manage'],
  },
  {
    path: '/law16/contingency-fund',
    permissions: ['law16.view', 'finances.view_all'],
  },
  
  // Meetings
  {
    path: '/meetings',
    permissions: ['meetings.view'],
  },
  {
    path: '/meetings/:id',
    permissions: ['meetings.view'],
  },
  
  // Voting
  {
    path: '/voting',
    permissions: ['voting.view'],
  },
  
  // Residents
  {
    path: '/residents',
    permissions: ['residents.view'],
  },
  {
    path: '/residents/:id',
    permissions: ['residents.view'],
  },
  
  // Users & Permissions - Admin only
  {
    path: '/users',
    permissions: ['users.view', 'users.manage'],
  },
  
  // Audit Logs - Admin only
  {
    path: '/audit-logs',
    permissions: ['audit.view'],
    redirect: '/dashboard',
  },
  
  // AI Workflows - Property Managers and Admins
  {
    path: '/ai-workflows',
    permissions: ['ai.manage_workflows'],
    redirect: '/dashboard',
  },
  
  // Analytics
  {
    path: '/analytics',
    permissions: ['finances.view_all', 'ai.view_insights'],
  },
  {
    path: '/analytics/benchmarking',
    permissions: ['finances.view_all', 'ai.view_insights'],
  },
  
  // Integrations - Admin and Property Managers
  {
    path: '/integrations',
    permissions: ['settings.edit'],
  },
  {
    path: '/integrations/payments',
    permissions: ['finances.edit', 'settings.edit'],
  },
  {
    path: '/integrations/docusign',
    permissions: ['documents.edit', 'settings.edit'],
  },
  {
    path: '/integrations/accounting',
    permissions: ['finances.edit', 'settings.edit'],
  },
  
  // Owner Portal - Owners only
  {
    path: '/owner-portal',
    permissions: ['finances.view'], // Owners have finances.view for their own data
  },
  
  // Settings - All users can view their own settings
  {
    path: '/settings',
    permissions: ['settings.view'],
  },
];

// Helper function to check if user has access to a route
export function hasRouteAccess(
  userPermissions: Permission[],
  route: string
): { allowed: boolean; redirect?: string } {
  // Find matching route permission
  const routePermission = routePermissions.find(rp => {
    // Exact match
    if (rp.path === route) return true;
    
    // Pattern match for dynamic routes (e.g., /properties/:id)
    const pattern = rp.path.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(route);
  });
  
  // If route not found in permissions map, allow access (default open)
  if (!routePermission) {
    return { allowed: true };
  }
  
  // If no permissions required, allow access
  if (routePermission.permissions.length === 0) {
    return { allowed: true };
  }
  
  // Check if user has required permissions
  const hasAccess = routePermission.requireAll
    ? routePermission.permissions.every(p => userPermissions.includes(p))
    : routePermission.permissions.some(p => userPermissions.includes(p));
  
  return {
    allowed: hasAccess,
    redirect: hasAccess ? undefined : (routePermission.redirect || '/dashboard'),
  };
}

// Get navigation items based on user permissions
export interface NavItem {
  label: string;
  path: string;
  requiredPermissions: Permission[];
  children?: NavItem[];
}

// Define navigation structure with permissions
export const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    requiredPermissions: [],
  },
  {
    label: 'Properties',
    path: '/properties',
    requiredPermissions: ['properties.view'],
  },
  {
    label: 'Finances',
    path: '/finances',
    requiredPermissions: ['finances.view'],
    children: [
      {
        label: 'Overview',
        path: '/finances',
        requiredPermissions: ['finances.view'],
      },
      {
        label: 'Billing Automation',
        path: '/finances/billing-automation',
        requiredPermissions: ['finances.create'],
      },
      {
        label: 'Reports',
        path: '/finances/reports',
        requiredPermissions: ['finances.view'],
      },
    ],
  },
  {
    label: 'Issues',
    path: '/issues',
    requiredPermissions: ['issues.view'],
  },
  {
    label: 'Maintenance',
    path: '/maintenance',
    requiredPermissions: ['maintenance.view'],
  },
  {
    label: 'Documents',
    path: '/documents',
    requiredPermissions: ['documents.view'],
  },
  {
    label: 'Law 16',
    path: '/law16',
    requiredPermissions: ['law16.view'],
  },
  {
    label: 'Meetings',
    path: '/meetings',
    requiredPermissions: ['meetings.view'],
  },
  {
    label: 'Voting',
    path: '/voting',
    requiredPermissions: ['voting.view'],
  },
  {
    label: 'Residents',
    path: '/residents',
    requiredPermissions: ['residents.view'],
  },
  {
    label: 'Analytics',
    path: '/analytics',
    requiredPermissions: ['ai.view_insights', 'finances.view_all'],
  },
  {
    label: 'AI Workflows',
    path: '/ai-workflows',
    requiredPermissions: ['ai.manage_workflows'],
  },
  {
    label: 'Users',
    path: '/users',
    requiredPermissions: ['users.view'],
  },
  {
    label: 'Integrations',
    path: '/integrations',
    requiredPermissions: ['settings.edit'],
  },
  {
    label: 'Audit Logs',
    path: '/audit-logs',
    requiredPermissions: ['audit.view'],
  },
  {
    label: 'Settings',
    path: '/settings',
    requiredPermissions: ['settings.view'],
  },
];

// Filter navigation items based on user permissions
export function filterNavigationItems(
  items: NavItem[],
  userPermissions: Permission[]
): NavItem[] {
  return items.filter(item => {
    // If no permissions required, show item
    if (item.requiredPermissions.length === 0) return true;
    
    // Check if user has any of the required permissions
    const hasPermission = item.requiredPermissions.some(p => 
      userPermissions.includes(p)
    );
    
    return hasPermission;
  }).map(item => ({
    ...item,
    children: item.children 
      ? filterNavigationItems(item.children, userPermissions)
      : undefined,
  }));
}

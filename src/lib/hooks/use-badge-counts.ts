/**
 * Badge Counts Hook
 * Implementation from: Section 4 "Dynamic Badge Counts" - immoflow_logic_architecture.md
 * 
 * Provides real-time badge counts for navigation items based on user role
 * In production, this would fetch from API/database
 */

import { useState, useEffect } from 'react';
import { useRBAC } from '../rbac/rbac-context';
import type { UserRole } from '../auth/types';

export interface BadgeCounts {
  properties: number;
  propertiesLabel?: string;
  operations: number;
  operationsLabel?: string;
  financials: number | string;
  financialsLabel?: string;
  compliance: number;
  complianceLabel?: string;
  communications: number;
  communicationsLabel?: string;
  issues: number;
  voting: number;
  maintenance: number;
}

/**
 * Mock badge counts based on role
 * In production, this would be real-time data from backend
 */
function getMockBadgeCounts(role: UserRole | null): BadgeCounts {
  if (!role) {
    return {
      properties: 0,
      operations: 0,
      financials: 0,
      compliance: 0,
      communications: 0,
      issues: 0,
      voting: 0,
      maintenance: 0,
    };
  }

  // Role-specific badge counts
  switch (role) {
    case 'super_admin':
    case 'property_manager':
      return {
        properties: 3,
        propertiesLabel: '3 alerts',
        operations: 12,
        operationsLabel: '12 active',
        financials: '$15,240',
        financialsLabel: 'overdue',
        compliance: 2,
        complianceLabel: '2 deadlines',
        communications: 5,
        communicationsLabel: '5 unread',
        issues: 3,
        voting: 0,
        maintenance: 12,
      };

    case 'board_member':
      return {
        properties: 0,
        operations: 0,
        financials: 0,
        compliance: 2,
        complianceLabel: '2 pending',
        communications: 3,
        communicationsLabel: '3 unread',
        issues: 0,
        voting: 1,
        maintenance: 0,
      };

    case 'accountant':
      return {
        properties: 0,
        operations: 0,
        financials: '$15,240',
        financialsLabel: 'overdue',
        compliance: 0,
        communications: 0,
        issues: 0,
        voting: 0,
        maintenance: 0,
      };

    case 'owner':
      return {
        properties: 0,
        operations: 0,
        financials: '$1,250',
        financialsLabel: 'due',
        compliance: 0,
        communications: 2,
        communicationsLabel: '2 new',
        issues: 1,
        voting: 1,
        maintenance: 1,
      };

    case 'tenant':
      return {
        properties: 0,
        operations: 0,
        financials: '$850',
        financialsLabel: 'rent due',
        compliance: 0,
        communications: 2,
        communicationsLabel: '2 new',
        issues: 1,
        voting: 0,
        maintenance: 1,
      };

    case 'vendor':
      return {
        properties: 0,
        operations: 5,
        operationsLabel: '5 assigned',
        financials: '$2,400',
        financialsLabel: 'pending',
        compliance: 0,
        communications: 3,
        communicationsLabel: '3 new',
        issues: 0,
        voting: 0,
        maintenance: 5,
      };

    case 'emergency_agent':
      return {
        properties: 0,
        operations: 2,
        operationsLabel: '2 active',
        financials: 0,
        compliance: 0,
        communications: 1,
        communicationsLabel: '1 urgent',
        issues: 2,
        voting: 0,
        maintenance: 2,
      };

    default:
      return {
        properties: 0,
        operations: 0,
        financials: 0,
        compliance: 0,
        communications: 0,
        issues: 0,
        voting: 0,
        maintenance: 0,
      };
  }
}

/**
 * Hook to get dynamic badge counts
 * Updates every 30 seconds in production
 */
export function useBadgeCounts() {
  const { getActiveRole } = useRBAC();
  const [counts, setCounts] = useState<BadgeCounts>(() => 
    getMockBadgeCounts(getActiveRole())
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const activeRole = getActiveRole();
    
    // Initial load
    setLoading(true);
    setCounts(getMockBadgeCounts(activeRole));
    setLoading(false);

    // Refresh every 30 seconds (in production, this would be real-time via WebSocket)
    const interval = setInterval(() => {
      setCounts(getMockBadgeCounts(activeRole));
    }, 30000);

    return () => clearInterval(interval);
  }, [getActiveRole]);

  return {
    counts,
    loading,
    refresh: () => {
      const activeRole = getActiveRole();
      setCounts(getMockBadgeCounts(activeRole));
    },
  };
}

/**
 * Get badge count for specific navigation item
 */
export function useBadgeCount(itemId: string): number | string | null {
  const { counts } = useBadgeCounts();

  const badgeMap: Record<string, number | string | null> = {
    properties: counts.properties || null,
    operations: counts.operations || null,
    maintenance: counts.maintenance || null,
    issues: counts.issues || null,
    financials: counts.financials || null,
    'billing-payments': counts.financials || null,
    compliance: counts.compliance || null,
    law16: counts.compliance || null,
    communications: counts.communications || null,
    newsletter: counts.communications || null,
    voting: counts.voting || null,
  };

  return badgeMap[itemId] || null;
}

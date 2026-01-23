/**
 * Move-In/Move-Out Checklist Types
 * Used for property condition documentation
 */

export type ChecklistType = 'move_in' | 'move_out';

export type ConditionRating = 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';

export interface RoomInspection {
  roomId: string;
  roomName: string;
  condition: ConditionRating;
  notes: string;
  photos: string[]; // Base64 or URLs
  damages: Damage[];
  lastInspected: string;
}

export interface Damage {
  id: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe';
  estimatedCost: number;
  photos: string[];
}

export interface UtilityReading {
  utilityType: 'gas' | 'electric' | 'water';
  meterNumber: string;
  reading: number;
  unit: string;
  readingDate: string;
  photo?: string;
}

export interface Checklist {
  id: string;
  type: ChecklistType;
  propertyId: string;
  unitId: string;
  tenantId: string;
  tenantName: string;

  // Inspections
  rooms: RoomInspection[];

  // Utilities
  utilityReadings: UtilityReading[];

  // Overall assessment
  overallCondition: ConditionRating;
  keyReturned?: boolean; // Move-out only

  // Security deposit
  securityDepositAmount?: number;
  deductions?: SecurityDepositDeduction[];
  depositRefundAmount?: number;

  // Signatures
  landlordSignature?: string;
  tenantSignature?: string;
  landlordSignedAt?: string;
  tenantSignedAt?: string;

  // Comparison (for move-out)
  moveInChecklistId?: string; // Link to original move-in checklist

  // Metadata
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface SecurityDepositDeduction {
  id: string;
  category: string;
  description: string;
  amount: number;
  roomId?: string;
}

export interface ChecklistComparison {
  moveInChecklist: Checklist;
  moveOutChecklist: Checklist;
  changes: RoomComparison[];
  totalDeductions: number;
}

export interface RoomComparison {
  roomName: string;
  moveInCondition: ConditionRating;
  moveOutCondition: ConditionRating;
  moveInPhotos: string[];
  moveOutPhotos: string[];
  newDamages: Damage[];
  deductions: SecurityDepositDeduction[];
}

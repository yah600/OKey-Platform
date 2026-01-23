import { LeaseTemplate, LeaseClause } from '@/types/lease';

/**
 * Standard lease clauses used across all lease types
 */
const standardClauses: LeaseClause[] = [
  {
    id: 'clause_rent_payment',
    category: 'Payment Terms',
    title: 'Rent Payment',
    content: 'Tenant agrees to pay rent in the amount of {{rent_amount}} per month, due on the {{rent_due_day}} day of each month. Payment shall be made to Landlord at the address specified or through the designated online payment portal.',
    required: true,
    editable: false,
  },
  {
    id: 'clause_security_deposit',
    category: 'Payment Terms',
    title: 'Security Deposit',
    content: 'Tenant shall pay a security deposit of {{security_deposit}} to be held by Landlord as security for faithful performance of Tenant\'s obligations. The deposit will be returned within {{deposit_return_days}} days after lease termination, less any lawful deductions.',
    required: true,
    editable: false,
  },
  {
    id: 'clause_late_fees',
    category: 'Payment Terms',
    title: 'Late Fees',
    content: 'If rent is not received within {{late_fee_grace_period}} days of the due date, Tenant shall pay a late fee of {{late_fee_amount}}.',
    required: false,
    editable: true,
  },
  {
    id: 'clause_utilities',
    category: 'Utilities',
    title: 'Utilities and Services',
    content: 'Landlord shall provide: {{utilities_included}}. Tenant is responsible for all other utilities and services.',
    required: true,
    editable: true,
  },
  {
    id: 'clause_maintenance_landlord',
    category: 'Maintenance',
    title: 'Landlord Maintenance Responsibilities',
    content: 'Landlord shall maintain in good working order: structural components, roof, plumbing, heating, electrical systems, and common areas.',
    required: true,
    editable: true,
  },
  {
    id: 'clause_maintenance_tenant',
    category: 'Maintenance',
    title: 'Tenant Maintenance Responsibilities',
    content: 'Tenant shall maintain the premises in clean and sanitary condition, promptly report needed repairs, and be responsible for damages caused by negligence or misuse.',
    required: true,
    editable: true,
  },
  {
    id: 'clause_pets',
    category: 'Use of Premises',
    title: 'Pet Policy',
    content: 'Pets are {{pets_allowed}}. If allowed, a pet deposit of {{pet_deposit}} and monthly pet rent of {{pet_rent}} applies. Maximum {{max_pets}} pets allowed.',
    required: false,
    editable: true,
  },
  {
    id: 'clause_smoking',
    category: 'Use of Premises',
    title: 'Smoking Policy',
    content: 'Smoking is {{smoking_allowed}} on the premises.',
    required: false,
    editable: true,
  },
  {
    id: 'clause_alterations',
    category: 'Use of Premises',
    title: 'Alterations',
    content: 'Tenant shall not make any alterations, additions, or improvements to the premises without prior written consent of Landlord.',
    required: true,
    editable: false,
  },
  {
    id: 'clause_subletting',
    category: 'Use of Premises',
    title: 'Subletting and Assignment',
    content: 'Tenant shall not sublet the premises or assign this lease without prior written consent of Landlord.',
    required: true,
    editable: false,
  },
  {
    id: 'clause_entry',
    category: 'Access',
    title: 'Right of Entry',
    content: 'Landlord may enter the premises for inspection, repairs, or showing to prospective tenants/buyers with {{entry_notice_hours}} hours notice, except in emergencies.',
    required: true,
    editable: true,
  },
  {
    id: 'clause_termination',
    category: 'Termination',
    title: 'Early Termination',
    content: 'Either party may terminate this lease with {{termination_notice_days}} days written notice. Tenant may be responsible for lease break fees as specified.',
    required: true,
    editable: true,
  },
  {
    id: 'clause_renewal',
    category: 'Termination',
    title: 'Lease Renewal',
    content: 'This lease will automatically renew for additional {{renewal_term}} month periods unless either party provides written notice of non-renewal at least {{renewal_notice_days}} days before expiration.',
    required: false,
    editable: true,
  },
  {
    id: 'clause_insurance',
    category: 'Insurance',
    title: 'Tenant Insurance',
    content: 'Tenant is required to maintain renters insurance with minimum coverage of {{insurance_amount}} and name Landlord as additional interested party.',
    required: false,
    editable: true,
  },
];

/**
 * Lease templates for different lease types
 */
export const leaseTemplates: LeaseTemplate[] = [
  {
    id: 'template_residential_annual',
    type: 'residential_annual',
    name: 'Residential Annual Lease',
    description: 'Standard 12-month residential lease agreement for long-term tenants. Includes all Quebec regulatory requirements.',
    defaultDuration: 12,
    clauses: standardClauses.filter(c =>
      !['clause_renewal'].includes(c.id) // Annual lease doesn't auto-renew
    ),
  },
  {
    id: 'template_short_term',
    type: 'short_term',
    name: 'Short-Term Rental Agreement',
    description: 'For rentals under 6 months, including furnished apartments and vacation rentals.',
    defaultDuration: 3,
    clauses: standardClauses.filter(c =>
      !['clause_renewal', 'clause_insurance'].includes(c.id)
    ),
  },
  {
    id: 'template_commercial',
    type: 'commercial',
    name: 'Commercial Lease Agreement',
    description: 'For business premises including retail, office, and industrial spaces.',
    defaultDuration: 36,
    clauses: [
      ...standardClauses,
      {
        id: 'clause_business_use',
        category: 'Use of Premises',
        title: 'Permitted Business Use',
        content: 'Premises shall be used exclusively for: {{business_type}}. No other business activities are permitted without Landlord approval.',
        required: true,
        editable: true,
      },
      {
        id: 'clause_business_hours',
        category: 'Use of Premises',
        title: 'Business Hours',
        content: 'Tenant may operate business during the following hours: {{business_hours}}. Any operations outside these hours require Landlord approval.',
        required: true,
        editable: true,
      },
      {
        id: 'clause_signage',
        category: 'Use of Premises',
        title: 'Signage',
        content: 'Tenant may install business signage subject to Landlord approval and local zoning regulations. All signage must be maintained in good condition.',
        required: true,
        editable: true,
      },
    ],
  },
  {
    id: 'template_renewal',
    type: 'renewal',
    name: 'Lease Renewal Agreement',
    description: 'Renewal agreement for existing tenants with updated terms.',
    defaultDuration: 12,
    clauses: [
      ...standardClauses,
      {
        id: 'clause_original_lease',
        category: 'Terms',
        title: 'Original Lease Terms',
        content: 'This renewal modifies the original lease dated {{original_lease_date}}. All terms of the original lease remain in effect except as specifically modified in this renewal.',
        required: true,
        editable: false,
      },
    ],
  },
];

/**
 * Get template by ID
 */
export function getLeaseTemplate(templateId: string): LeaseTemplate | undefined {
  return leaseTemplates.find(t => t.id === templateId);
}

/**
 * Get template by type
 */
export function getLeaseTemplateByType(type: string): LeaseTemplate | undefined {
  return leaseTemplates.find(t => t.type === type);
}

/**
 * Replace template variables with actual values
 */
export function replaceTemplateVariables(
  content: string,
  variables: Record<string, string | number>
): string {
  let result = content;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(value));
  });
  return result;
}

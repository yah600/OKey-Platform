import type { User, Property, Unit, Bid, Lease, Transaction, Bill, Issue, MaintenanceTask, Document, Meeting, Vote, VoteRecord, Message, Conversation, Notification } from '@/types';

// ============================================================================
// MOCK USERS
// ============================================================================

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'tenant@okey.com',
    full_name: 'Jean Tremblay',
    phone: '514-555-0123',
    role: 'tenant',
    okey_score: 85,
    avatar_url: '',
    status: 'active',
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 'user-2',
    email: 'owner@okey.com',
    full_name: 'Marie Dupont',
    phone: '514-555-0456',
    role: 'owner',
    okey_score: null,
    avatar_url: '',
    status: 'active',
    created_at: '2024-06-20T10:00:00Z',
    updated_at: '2024-06-20T10:00:00Z',
  },
  {
    id: 'user-3',
    email: 'admin@okey.com',
    full_name: 'Admin User',
    phone: '514-555-9999',
    role: 'super_admin',
    okey_score: null,
    avatar_url: '',
    status: 'active',
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  {
    id: 'user-4',
    email: 'manager@okey.com',
    full_name: 'Pierre Gagnon',
    phone: '514-555-0789',
    role: 'property_manager',
    okey_score: null,
    avatar_url: '',
    status: 'active',
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-03-10T10:00:00Z',
  },
  {
    id: 'user-5',
    email: 'tenant2@okey.com',
    full_name: 'Sophie Martin',
    phone: '514-555-1111',
    role: 'tenant',
    okey_score: 72,
    avatar_url: '',
    status: 'active',
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2025-02-01T10:00:00Z',
  },
];

// ============================================================================
// MOCK PROPERTIES
// ============================================================================

export const mockProperties: Property[] = [
  {
    id: 'prop-1',
    owner_id: 'user-2',
    manager_id: 'user-4',
    name: 'Le Maxwell',
    address: {
      street: '1455 Rue Drummond',
      city: 'Montreal',
      province: 'QC',
      postal_code: 'H3G 1W3',
      country: 'Canada',
    },
    property_type: 'condo',
    total_units: 24,
    year_built: 2018,
    amenities: ['gym', 'pool', 'rooftop', 'parking', 'doorman', 'lounge'],
    photos: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    ],
    status: 'active',
    created_at: '2024-06-20T10:00:00Z',
    updated_at: '2024-06-20T10:00:00Z',
  },
  {
    id: 'prop-2',
    owner_id: 'user-2',
    manager_id: 'user-4',
    name: 'Riverside Commons',
    address: {
      street: '2500 Rue Notre-Dame',
      city: 'Montreal',
      province: 'QC',
      postal_code: 'H3K 1X5',
      country: 'Canada',
    },
    property_type: 'apartment',
    total_units: 48,
    year_built: 2015,
    amenities: ['gym', 'parking', 'storage', 'bike_room'],
    photos: [
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800',
    ],
    status: 'active',
    created_at: '2024-06-20T10:00:00Z',
    updated_at: '2024-06-20T10:00:00Z',
  },
];

// ============================================================================
// MOCK UNITS
// ============================================================================

export const mockUnits: Unit[] = [
  {
    id: 'unit-1',
    property_id: 'prop-1',
    unit_number: '305',
    floor: 3,
    unit_type: '2BR',
    bedrooms: 2,
    bathrooms: 1.5,
    square_feet: 950,
    monthly_rent: 2100,
    status: 'available',
    available_date: '2026-02-01',
    pet_friendly: true,
    parking_spaces: 1,
    utilities_included: ['heating', 'hot_water'],
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ],
    floor_plan_url: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=600',
    created_at: '2024-06-20T10:00:00Z',
    updated_at: '2024-06-20T10:00:00Z',
  },
  {
    id: 'unit-2',
    property_id: 'prop-1',
    unit_number: '412',
    floor: 4,
    unit_type: '1BR',
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 650,
    monthly_rent: 1650,
    status: 'occupied',
    available_date: null,
    pet_friendly: false,
    parking_spaces: 0,
    utilities_included: ['heating', 'hot_water'],
    photos: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
    floor_plan_url: null,
    created_at: '2024-06-20T10:00:00Z',
    updated_at: '2024-06-20T10:00:00Z',
  },
  {
    id: 'unit-3',
    property_id: 'prop-1',
    unit_number: '508',
    floor: 5,
    unit_type: '3BR',
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1200,
    monthly_rent: 2800,
    status: 'available',
    available_date: '2026-02-15',
    pet_friendly: true,
    parking_spaces: 2,
    utilities_included: ['heating', 'hot_water'],
    photos: [
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',
    ],
    floor_plan_url: null,
    created_at: '2024-06-20T10:00:00Z',
    updated_at: '2024-06-20T10:00:00Z',
  },
  {
    id: 'unit-4',
    property_id: 'prop-2',
    unit_number: '201',
    floor: 2,
    unit_type: '2BR',
    bedrooms: 2,
    bathrooms: 1,
    square_feet: 850,
    monthly_rent: 1850,
    status: 'available',
    available_date: '2026-03-01',
    pet_friendly: false,
    parking_spaces: 1,
    utilities_included: ['heating'],
    photos: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    ],
    floor_plan_url: null,
    created_at: '2024-06-20T10:00:00Z',
    updated_at: '2024-06-20T10:00:00Z',
  },
];

// ============================================================================
// MOCK BIDS
// ============================================================================

export const mockBids: Bid[] = [
  {
    id: 'bid-1',
    unit_id: 'unit-1',
    bidder_id: 'user-1',
    bid_amount: 2150,
    message: 'Very interested, can move in anytime!',
    status: 'active',
    auto_bid_enabled: false,
    max_auto_bid: null,
    expires_at: null,
    created_at: '2026-01-20T14:30:00Z',
    updated_at: '2026-01-20T14:30:00Z',
  },
  {
    id: 'bid-2',
    unit_id: 'unit-1',
    bidder_id: 'user-5',
    bid_amount: 2125,
    message: 'Looking for a place close to work',
    status: 'active',
    auto_bid_enabled: true,
    max_auto_bid: 2200,
    expires_at: null,
    created_at: '2026-01-19T10:15:00Z',
    updated_at: '2026-01-19T10:15:00Z',
  },
  {
    id: 'bid-3',
    unit_id: 'unit-3',
    bidder_id: 'user-5',
    bid_amount: 2850,
    message: 'Perfect for my family!',
    status: 'active',
    auto_bid_enabled: false,
    max_auto_bid: null,
    expires_at: null,
    created_at: '2026-01-21T09:00:00Z',
    updated_at: '2026-01-21T09:00:00Z',
  },
];

// ============================================================================
// MOCK LEASES
// ============================================================================

export const mockLeases: Lease[] = [
  {
    id: 'lease-1',
    unit_id: 'unit-2',
    tenant_id: 'user-1',
    landlord_id: 'user-2',
    start_date: '2025-06-01',
    end_date: '2026-05-31',
    monthly_rent: 1650,
    security_deposit: 1650,
    lease_type: 'fixed',
    status: 'active',
    lease_document_url: '/documents/lease-1.pdf',
    docusign_envelope_id: null,
    terms: {
      utilities_included: ['heating', 'hot_water'],
      pet_allowed: false,
      parking_included: false,
      notice_period_days: 60,
    },
    created_at: '2025-05-15T10:00:00Z',
    updated_at: '2025-05-15T10:00:00Z',
  },
];

// ============================================================================
// MOCK TRANSACTIONS
// ============================================================================

export const mockTransactions: Transaction[] = [
  {
    id: 'txn-1',
    user_id: 'user-1',
    property_id: 'prop-1',
    unit_id: 'unit-2',
    type: 'rent_payment',
    amount: 1650,
    status: 'completed',
    payment_method: 'card',
    stripe_payment_intent_id: null,
    description: 'January 2026 Rent',
    due_date: '2026-01-01',
    paid_date: '2026-01-02',
    created_at: '2026-01-02T09:15:00Z',
    updated_at: '2026-01-02T09:15:00Z',
  },
  {
    id: 'txn-2',
    user_id: 'user-1',
    property_id: 'prop-1',
    unit_id: 'unit-2',
    type: 'rent_payment',
    amount: 1650,
    status: 'completed',
    payment_method: 'card',
    stripe_payment_intent_id: null,
    description: 'December 2025 Rent',
    due_date: '2025-12-01',
    paid_date: '2025-12-01',
    created_at: '2025-12-01T10:30:00Z',
    updated_at: '2025-12-01T10:30:00Z',
  },
  {
    id: 'txn-3',
    user_id: 'user-1',
    property_id: 'prop-1',
    unit_id: 'unit-2',
    type: 'rent_payment',
    amount: 1650,
    status: 'completed',
    payment_method: 'bank_transfer',
    stripe_payment_intent_id: null,
    description: 'November 2025 Rent',
    due_date: '2025-11-01',
    paid_date: '2025-11-03',
    created_at: '2025-11-03T14:20:00Z',
    updated_at: '2025-11-03T14:20:00Z',
  },
];

// ============================================================================
// MOCK BILLS
// ============================================================================

export const mockBills: Bill[] = [
  {
    id: 'bill-1',
    unit_id: 'unit-2',
    tenant_id: 'user-1',
    amount: 1650,
    due_date: '2026-02-01',
    description: 'February 2026 Rent',
    category: 'rent',
    status: 'unpaid',
    paid_amount: 0,
    created_at: '2026-01-25T10:00:00Z',
    updated_at: '2026-01-25T10:00:00Z',
  },
  {
    id: 'bill-2',
    unit_id: 'unit-2',
    tenant_id: 'user-1',
    amount: 50,
    due_date: '2026-02-01',
    description: 'Parking Fee - February 2026',
    category: 'parking',
    status: 'unpaid',
    paid_amount: 0,
    created_at: '2026-01-25T10:00:00Z',
    updated_at: '2026-01-25T10:00:00Z',
  },
];

// ============================================================================
// MOCK ISSUES
// ============================================================================

export const mockIssues: Issue[] = [
  {
    id: 'issue-1',
    property_id: 'prop-1',
    unit_id: 'unit-2',
    reporter_id: 'user-1',
    assigned_to: 'user-4',
    title: 'Leaky faucet in kitchen',
    description: 'The kitchen faucet has been dripping constantly for 2 days. Water is wasted and the sound is annoying at night.',
    category: 'plumbing',
    priority: 'medium',
    status: 'in_progress',
    photos: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400'],
    attachments: [],
    resolution_notes: null,
    resolved_at: null,
    created_at: '2026-01-20T08:30:00Z',
    updated_at: '2026-01-21T10:00:00Z',
  },
  {
    id: 'issue-2',
    property_id: 'prop-1',
    unit_id: 'unit-2',
    reporter_id: 'user-1',
    assigned_to: null,
    title: 'Heating not working properly',
    description: 'The heating in the bedroom is not reaching the set temperature. It stays around 18°C even when set to 21°C.',
    category: 'heating',
    priority: 'high',
    status: 'open',
    photos: [],
    attachments: [],
    resolution_notes: null,
    resolved_at: null,
    created_at: '2026-01-21T07:15:00Z',
    updated_at: '2026-01-21T07:15:00Z',
  },
];

// ============================================================================
// MOCK MAINTENANCE TASKS
// ============================================================================

export const mockMaintenanceTasks: MaintenanceTask[] = [
  {
    id: 'task-1',
    property_id: 'prop-1',
    unit_id: null,
    issue_id: null,
    assigned_to: null,
    title: 'HVAC Filter Replacement - All Units',
    description: 'Replace HVAC filters in all units as part of quarterly maintenance',
    type: 'preventive',
    priority: 'low',
    status: 'scheduled',
    frequency: 'quarterly',
    due_date: '2026-02-15',
    completed_date: null,
    estimated_cost: 500,
    actual_cost: null,
    checklist: [
      { item: 'Purchase filters (24 units)', completed: true },
      { item: 'Schedule with tenants', completed: false },
      { item: 'Replace filters', completed: false },
      { item: 'Document completion', completed: false },
    ],
    photos: [],
    notes: null,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'task-2',
    property_id: 'prop-1',
    unit_id: 'unit-2',
    issue_id: 'issue-1',
    assigned_to: 'user-4',
    title: 'Fix leaky kitchen faucet - Unit 412',
    description: 'Repair or replace leaky faucet in unit 412',
    type: 'corrective',
    priority: 'medium',
    status: 'in_progress',
    frequency: 'one_time',
    due_date: '2026-01-22',
    completed_date: null,
    estimated_cost: 150,
    actual_cost: null,
    checklist: [
      { item: 'Inspect faucet', completed: true },
      { item: 'Order replacement parts', completed: true },
      { item: 'Schedule repair', completed: false },
      { item: 'Complete repair', completed: false },
    ],
    photos: [],
    notes: 'Parts ordered - ETA Jan 22',
    created_at: '2026-01-20T11:00:00Z',
    updated_at: '2026-01-21T10:00:00Z',
  },
];

// ============================================================================
// MOCK DOCUMENTS
// ============================================================================

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    uploader_id: 'user-2',
    property_id: 'prop-1',
    unit_id: 'unit-2',
    title: 'Lease Agreement - Unit 412 - Jean Tremblay',
    description: 'Signed lease agreement for Jean Tremblay, Unit 412',
    category: 'legal',
    file_url: '/documents/lease-1.pdf',
    file_type: 'application/pdf',
    file_size: 245000,
    tags: ['lease', 'signed', '2025', 'unit-412'],
    access_control: {
      roles: ['owner', 'property_manager', 'tenant'],
      user_ids: ['user-1', 'user-2', 'user-4'],
    },
    created_at: '2025-05-15T10:00:00Z',
    updated_at: '2025-05-15T10:00:00Z',
  },
  {
    id: 'doc-2',
    uploader_id: 'user-1',
    property_id: 'prop-1',
    unit_id: 'unit-2',
    title: 'January 2026 Rent Receipt',
    description: 'Payment receipt for January 2026 rent',
    category: 'financial',
    file_url: '/documents/receipt-jan-2026.pdf',
    file_type: 'application/pdf',
    file_size: 85000,
    tags: ['receipt', 'rent', 'january', '2026'],
    access_control: {
      roles: ['owner', 'property_manager', 'tenant'],
      user_ids: ['user-1', 'user-2', 'user-4'],
    },
    created_at: '2026-01-02T09:20:00Z',
    updated_at: '2026-01-02T09:20:00Z',
  },
];

// ============================================================================
// MOCK MEETINGS
// ============================================================================

export const mockMeetings: Meeting[] = [
  {
    id: 'meeting-1',
    property_id: 'prop-1',
    organizer_id: 'user-2',
    title: 'Annual General Meeting 2026',
    type: 'general_assembly',
    scheduled_at: '2026-03-15T19:00:00Z',
    location: {
      type: 'hybrid',
      address: '1455 Rue Drummond, Party Room',
      link: 'https://zoom.us/j/123456789',
    },
    status: 'scheduled',
    agenda: [
      {
        item: 'Call to order',
        description: 'Welcome and attendance',
        time_allocation: 5,
      },
      {
        item: 'Financial report',
        description: '2025 financial review and 2026 budget presentation',
        time_allocation: 30,
      },
      {
        item: 'Building maintenance update',
        description: 'Recent and upcoming maintenance work',
        time_allocation: 20,
      },
      {
        item: 'Q&A',
        description: 'Open floor for questions',
        time_allocation: 30,
      },
    ],
    minutes: null,
    minutes_approved: false,
    attendees: [
      { user_id: 'user-1', rsvp_status: 'accepted', attended: false },
      { user_id: 'user-2', rsvp_status: 'accepted', attended: false },
    ],
    documents: ['doc-2'],
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
];

// ============================================================================
// MOCK VOTES
// ============================================================================

export const mockVotes: Vote[] = [
  {
    id: 'vote-1',
    property_id: 'prop-1',
    meeting_id: null,
    creator_id: 'user-2',
    title: 'Approve 2026 Operating Budget',
    description: 'Vote to approve the proposed operating budget for 2026. The budget includes increases for maintenance reserves and insurance.',
    type: 'simple_majority',
    threshold: 0.5,
    start_date: '2026-01-20T00:00:00Z',
    end_date: '2026-02-10T23:59:59Z',
    status: 'active',
    eligible_voters: ['user-1', 'user-2'],
    voting_weight: {
      'user-1': 1,
      'user-2': 1,
    },
    allow_changes: false,
    anonymous: false,
    results: {
      for: 1,
      against: 0,
      abstain: 0,
    },
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T15:30:00Z',
  },
];

export const mockVoteRecords: VoteRecord[] = [
  {
    id: 'vr-1',
    vote_id: 'vote-1',
    voter_id: 'user-1',
    choice: 'for',
    weight: 1,
    voted_at: '2026-01-20T15:30:00Z',
  },
];

// ============================================================================
// MOCK MESSAGES & CONVERSATIONS
// ============================================================================

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: ['user-1', 'user-4'],
    type: 'direct',
    title: null,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-21T10:05:00Z',
  },
];

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    conversation_id: 'conv-1',
    sender_id: 'user-4',
    content: 'Hello Jean! How can I help you today?',
    attachments: [],
    read_by: [
      { user_id: 'user-4', read_at: '2026-01-21T10:00:00Z' },
      { user_id: 'user-1', read_at: '2026-01-21T10:02:00Z' },
    ],
    created_at: '2026-01-21T10:00:00Z',
    updated_at: '2026-01-21T10:00:00Z',
  },
  {
    id: 'msg-2',
    conversation_id: 'conv-1',
    sender_id: 'user-1',
    content: 'Hi! I submitted a maintenance request for the leaky faucet in my kitchen. Any updates?',
    attachments: [],
    read_by: [
      { user_id: 'user-1', read_at: '2026-01-21T10:05:00Z' },
      { user_id: 'user-4', read_at: '2026-01-21T10:10:00Z' },
    ],
    created_at: '2026-01-21T10:05:00Z',
    updated_at: '2026-01-21T10:05:00Z',
  },
  {
    id: 'msg-3',
    conversation_id: 'conv-1',
    sender_id: 'user-4',
    content: "Yes! I've assigned it to our plumbing team. They should be able to come by tomorrow between 10 AM and 2 PM. Does that work for you?",
    attachments: [],
    read_by: [
      { user_id: 'user-4', read_at: '2026-01-21T10:11:00Z' },
    ],
    created_at: '2026-01-21T10:11:00Z',
    updated_at: '2026-01-21T10:11:00Z',
  },
];

// ============================================================================
// MOCK NOTIFICATIONS
// ============================================================================

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    user_id: 'user-1',
    type: 'maintenance',
    title: 'Maintenance Request Assigned',
    message: 'Your maintenance request has been assigned to a technician',
    action_url: '/tenant/maintenance',
    data: { issue_id: 'issue-1' },
    read: false,
    read_at: null,
    created_at: '2026-01-21T10:00:00Z',
  },
  {
    id: 'notif-2',
    user_id: 'user-1',
    type: 'finance',
    title: 'Rent Due Soon',
    message: 'Your February rent payment is due in 10 days',
    action_url: '/tenant/payments',
    data: { bill_id: 'bill-1' },
    read: false,
    read_at: null,
    created_at: '2026-01-22T08:00:00Z',
  },
  {
    id: 'notif-3',
    user_id: 'user-1',
    type: 'message',
    title: 'New Message from Property Manager',
    message: 'Pierre Gagnon sent you a message',
    action_url: '/messages',
    data: { conversation_id: 'conv-1' },
    read: true,
    read_at: '2026-01-21T10:12:00Z',
    created_at: '2026-01-21T10:11:00Z',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getUserById(id: string): User | undefined {
  return mockUsers.find(u => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return mockUsers.find(u => u.email === email);
}

export function getPropertyById(id: string): Property | undefined {
  return mockProperties.find(p => p.id === id);
}

export function getPropertiesByOwner(ownerId: string): Property[] {
  return mockProperties.filter(p => p.owner_id === ownerId);
}

export function getAllProperties(): Property[] {
  return mockProperties;
}

export function getUnitById(id: string): Unit | undefined {
  return mockUnits.find(u => u.id === id);
}

export function getUnitsByProperty(propertyId: string): Unit[] {
  return mockUnits.filter(u => u.property_id === propertyId);
}

export function getAvailableUnits(): Unit[] {
  return mockUnits.filter(u => u.status === 'available');
}

export function getBidsByUnit(unitId: string): Bid[] {
  return mockBids.filter(b => b.unit_id === unitId).sort((a, b) => b.bid_amount - a.bid_amount);
}

export function getBidsByUser(userId: string): Bid[] {
  return mockBids.filter(b => b.bidder_id === userId);
}

export function getLeaseByUnit(unitId: string): Lease | undefined {
  return mockLeases.find(l => l.unit_id === unitId && l.status === 'active');
}

export function getLeasesByTenant(tenantId: string): Lease[] {
  return mockLeases.filter(l => l.tenant_id === tenantId);
}

export function getTransactionsByUser(userId: string): Transaction[] {
  return mockTransactions.filter(t => t.user_id === userId).sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getBillsByTenant(tenantId: string): Bill[] {
  return mockBills.filter(b => b.tenant_id === tenantId).sort((a, b) =>
    new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
  );
}

export function getUnpaidBills(tenantId: string): Bill[] {
  return mockBills.filter(b => b.tenant_id === tenantId && (b.status === 'unpaid' || b.status === 'overdue'));
}

export function calculateTotalDue(tenantId: string): number {
  const unpaidBills = getUnpaidBills(tenantId);
  return unpaidBills.reduce((sum, bill) => sum + bill.amount, 0);
}

export function getIssuesByProperty(propertyId: string): Issue[] {
  return mockIssues.filter(i => i.property_id === propertyId).sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getIssuesByReporter(reporterId: string): Issue[] {
  return mockIssues.filter(i => i.reporter_id === reporterId).sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getMaintenanceTasksByProperty(propertyId: string): MaintenanceTask[] {
  return mockMaintenanceTasks.filter(t => t.property_id === propertyId);
}

export function getDocumentsByProperty(propertyId: string): Document[] {
  return mockDocuments.filter(d => d.property_id === propertyId);
}

export function getDocumentsByUser(userId: string): Document[] {
  return mockDocuments.filter(d =>
    d.access_control.user_ids.includes(userId)
  );
}

export function getMeetingsByProperty(propertyId: string): Meeting[] {
  return mockMeetings.filter(m => m.property_id === propertyId);
}

export function getVotesByProperty(propertyId: string): Vote[] {
  return mockVotes.filter(v => v.property_id === propertyId);
}

export function getActiveVotes(propertyId: string): Vote[] {
  return mockVotes.filter(v => v.property_id === propertyId && v.status === 'active');
}

export function getMessagesByConversation(conversationId: string): Message[] {
  return mockMessages.filter(m => m.conversation_id === conversationId).sort((a, b) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
}

export function getConversationsByUser(userId: string): Conversation[] {
  return mockConversations.filter(c => c.participants.includes(userId));
}

export function getNotificationsByUser(userId: string): Notification[] {
  return mockNotifications.filter(n => n.user_id === userId).sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getUnreadNotificationCount(userId: string): number {
  return mockNotifications.filter(n => n.user_id === userId && !n.read).length;
}

export function getActiveAuctions(): Unit[] {
  return mockUnits.filter(u => u.status === 'available');
}

// Aliases for backwards compatibility
export const getUnitsByPropertyId = getUnitsByProperty;
export const getBidsByUnitId = getBidsByUnit;
export const getBidsByUserId = getBidsByUser;

// Additional helper functions
export function getLeasesByProperty(propertyId: string): Lease[] {
  const units = getUnitsByProperty(propertyId);
  const unitIds = units.map(u => u.id);
  return mockLeases.filter(l => unitIds.includes(l.unit_id));
}

export function getTransactionsByProperty(propertyId: string): Transaction[] {
  return mockTransactions.filter(t => t.property_id === propertyId).sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getDocumentsByOwner(ownerId: string): Document[] {
  const properties = getPropertiesByOwner(ownerId);
  const propertyIds = properties.map(p => p.id);
  return mockDocuments.filter(d => d.property_id && propertyIds.includes(d.property_id));
}

export function getBillsByProperty(propertyId: string): Bill[] {
  const leases = getLeasesByProperty(propertyId);
  const tenantIds = leases.map(l => l.tenant_id);
  return mockBills.filter(b => tenantIds.includes(b.tenant_id));
}

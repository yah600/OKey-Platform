# O'KEY PLATFORM - FRONTEND BLUEPRINT
## Master Frontend Specification (NO BACKEND)

**Version:** 1.0 Frontend-Only
**Last Updated:** January 21, 2026
**Status:** Phase 1 - Frontend Foundation

---

## DOCUMENT PURPOSE

This is the **master frontend blueprint** for O'Key Platform. Builder Agent implements ONLY frontend code - no backend, no Supabase, no API calls. Everything uses **mock data** and **local state**.

This document defines:
- Component structure and hierarchy
- Mock data patterns
- State management (useState, useContext)
- Component wiring and interactions
- Navigation flows
- UI logic and business rules (frontend only)
- Form handling
- User journeys

---

# PART 1: PROJECT STRUCTURE (FRONTEND ONLY)

```
src/
├── features/              # Feature modules
│   ├── auth/             # Login, signup (mock auth)
│   ├── marketplace/      # Property search, bidding
│   ├── tenant-portal/    # Tenant dashboard
│   ├── property-management/  # Owner dashboard
│   ├── financial/        # Financial pages
│   └── ...
│
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui (51 components)
│   ├── layout/          # Nav, sidebar, header
│   ├── forms/           # Form components
│   └── ...
│
├── lib/
│   ├── data/
│   │   └── mockData.ts       # ALL mock data (CRITICAL)
│   ├── hooks/                # Custom hooks
│   ├── utils/                # Helper functions
│   └── constants/            # Constants
│
├── context/              # Global state (React Context)
│   ├── AuthContext.tsx       # Auth state (mock)
│   ├── AppContext.tsx        # App state
│   └── BidContext.tsx        # Bidding state
│
├── types/
│   └── index.ts              # TypeScript types
│
├── styles/
│   ├── globals.css
│   └── design-system.ts
│
└── App.tsx               # Routing
```

---

# PART 2: MOCK DATA STRUCTURE

## 2.1 Mock Data File

**File: `/src/lib/data/mockData.ts`**

This file contains ALL data for the entire application. No API calls, everything reads from here.

```typescript
// Mock Users
export const mockUsers = [
  {
    id: 'user-1',
    email: 'tenant@okey.com',
    full_name: 'Jean Tremblay',
    phone: '514-555-0123',
    role: 'tenant' as const,
    okey_score: 85,
    avatar_url: '',
    status: 'active' as const,
    created_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 'user-2',
    email: 'owner@okey.com',
    full_name: 'Marie Dupont',
    phone: '514-555-0456',
    role: 'owner' as const,
    okey_score: null,
    avatar_url: '',
    status: 'active' as const,
    created_at: '2024-06-20T10:00:00Z',
  },
  {
    id: 'user-3',
    email: 'admin@okey.com',
    full_name: 'Admin User',
    phone: '514-555-9999',
    role: 'super_admin' as const,
    okey_score: null,
    avatar_url: '',
    status: 'active' as const,
    created_at: '2024-01-01T10:00:00Z',
  },
  // Add more users...
];

// Mock Properties
export const mockProperties = [
  {
    id: 'prop-1',
    owner_id: 'user-2',
    manager_id: null,
    name: 'Le Maxwell',
    address: {
      street: '1455 Rue Drummond',
      city: 'Montreal',
      province: 'QC',
      postal_code: 'H3G 1W3',
      country: 'Canada',
    },
    property_type: 'condo' as const,
    total_units: 24,
    year_built: 2018,
    amenities: ['gym', 'pool', 'rooftop', 'parking', 'doorman'],
    photos: [
      '/images/maxwell-1.jpg',
      '/images/maxwell-2.jpg',
    ],
    status: 'active' as const,
    created_at: '2024-06-20T10:00:00Z',
  },
  // Add more properties...
];

// Mock Units
export const mockUnits = [
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
    status: 'available' as const,
    available_date: '2026-02-01',
    pet_friendly: true,
    parking_spaces: 1,
    utilities_included: ['heating', 'hot_water'],
    photos: ['/images/unit-1.jpg'],
    floor_plan_url: '/images/unit-1-floorplan.jpg',
    minimum_okey_score: 65,
    created_at: '2024-06-20T10:00:00Z',
  },
  // Add more units...
];

// Mock Bids
export const mockBids = [
  {
    id: 'bid-1',
    unit_id: 'unit-1',
    bidder_id: 'user-1',
    bid_amount: 2150,
    message: 'Very interested, can move in anytime!',
    status: 'active' as const,
    auto_bid_enabled: false,
    max_auto_bid: null,
    expires_at: null,
    created_at: '2026-01-20T14:30:00Z',
  },
  // Add more bids...
];

// Mock Leases
export const mockLeases = [
  {
    id: 'lease-1',
    unit_id: 'unit-2',
    tenant_id: 'user-1',
    landlord_id: 'user-2',
    start_date: '2025-06-01',
    end_date: '2026-05-31',
    monthly_rent: 1950,
    security_deposit: 1950,
    lease_type: 'fixed' as const,
    status: 'active' as const,
    lease_document_url: '/documents/lease-1.pdf',
    terms: {
      utilities_included: ['heating'],
      pet_allowed: true,
      parking_included: true,
    },
    created_at: '2025-05-15T10:00:00Z',
  },
  // Add more leases...
];

// Mock Transactions
export const mockTransactions = [
  {
    id: 'txn-1',
    user_id: 'user-1',
    property_id: 'prop-1',
    unit_id: 'unit-2',
    type: 'rent_payment' as const,
    amount: 1950,
    status: 'completed' as const,
    payment_method: 'card' as const,
    description: 'January 2026 Rent',
    due_date: '2026-01-01',
    paid_date: '2026-01-02',
    created_at: '2026-01-02T09:15:00Z',
  },
  // Add more transactions...
];

// Mock Bills
export const mockBills = [
  {
    id: 'bill-1',
    unit_id: 'unit-2',
    tenant_id: 'user-1',
    amount: 1950,
    due_date: '2026-02-01',
    description: 'February 2026 Rent',
    category: 'rent' as const,
    status: 'unpaid' as const,
    paid_amount: 0,
    created_at: '2026-01-25T10:00:00Z',
  },
  // Add more bills...
];

// Mock Issues
export const mockIssues = [
  {
    id: 'issue-1',
    property_id: 'prop-1',
    unit_id: 'unit-2',
    reporter_id: 'user-1',
    assigned_to: null,
    title: 'Leaky faucet in kitchen',
    description: 'The kitchen faucet has been dripping constantly for 2 days',
    category: 'plumbing' as const,
    priority: 'medium' as const,
    status: 'open' as const,
    photos: ['/images/issue-1.jpg'],
    attachments: [],
    resolution_notes: null,
    resolved_at: null,
    created_at: '2026-01-20T08:30:00Z',
  },
  // Add more issues...
];

// Mock Maintenance Tasks
export const mockMaintenanceTasks = [
  {
    id: 'task-1',
    property_id: 'prop-1',
    unit_id: null,
    issue_id: null,
    assigned_to: 'vendor-1',
    title: 'HVAC Filter Replacement - All Units',
    description: 'Replace HVAC filters in all units',
    type: 'preventive' as const,
    priority: 'low' as const,
    status: 'scheduled' as const,
    frequency: 'monthly' as const,
    due_date: '2026-02-01',
    completed_date: null,
    estimated_cost: 500,
    actual_cost: null,
    checklist: [
      { item: 'Purchase filters', completed: true },
      { item: 'Replace filters', completed: false },
      { item: 'Document completion', completed: false },
    ],
    photos: [],
    notes: null,
    created_at: '2026-01-15T10:00:00Z',
  },
  // Add more tasks...
];

// Mock Documents
export const mockDocuments = [
  {
    id: 'doc-1',
    uploader_id: 'user-2',
    property_id: 'prop-1',
    unit_id: 'unit-2',
    title: 'Lease Agreement - Unit 305',
    description: 'Signed lease for Jean Tremblay',
    category: 'legal' as const,
    file_url: '/documents/lease-1.pdf',
    file_type: 'application/pdf',
    file_size: 245000,
    tags: ['lease', 'signed', '2025'],
    access_control: {
      roles: ['owner', 'tenant'],
      user_ids: ['user-1', 'user-2'],
    },
    created_at: '2025-05-15T10:00:00Z',
  },
  // Add more documents...
];

// Mock Meetings
export const mockMeetings = [
  {
    id: 'meeting-1',
    property_id: 'prop-1',
    organizer_id: 'user-2',
    title: 'Annual General Meeting',
    type: 'general_assembly' as const,
    scheduled_at: '2026-03-15T19:00:00Z',
    location: {
      type: 'hybrid' as const,
      address: '1455 Rue Drummond, Party Room',
      link: 'https://zoom.us/j/123456789',
    },
    status: 'scheduled' as const,
    agenda: [
      {
        item: 'Call to order',
        description: '',
        time_allocation: 5,
      },
      {
        item: 'Financial report',
        description: '2025 financial review',
        time_allocation: 20,
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
  },
  // Add more meetings...
];

// Mock Votes
export const mockVotes = [
  {
    id: 'vote-1',
    property_id: 'prop-1',
    meeting_id: 'meeting-1',
    creator_id: 'user-2',
    title: 'Approve 2026 Budget',
    description: 'Vote to approve the proposed budget for 2026',
    type: 'simple_majority' as const,
    threshold: 0.5,
    start_date: '2026-01-20T00:00:00Z',
    end_date: '2026-02-01T23:59:59Z',
    status: 'active' as const,
    eligible_voters: ['user-1', 'user-2', 'user-4'],
    voting_weight: {
      'user-1': 1,
      'user-2': 1,
      'user-4': 1,
    },
    allow_changes: false,
    anonymous: false,
    results: {
      for: 1,
      against: 0,
      abstain: 0,
    },
    created_at: '2026-01-20T10:00:00Z',
  },
  // Add more votes...
];

// Mock Vote Records
export const mockVoteRecords = [
  {
    id: 'vr-1',
    vote_id: 'vote-1',
    voter_id: 'user-1',
    choice: 'for' as const,
    weight: 1,
    voted_at: '2026-01-20T15:30:00Z',
  },
  // Add more vote records...
];

// Mock Messages
export const mockMessages = [
  {
    id: 'msg-1',
    conversation_id: 'conv-1',
    sender_id: 'user-2',
    content: 'Hello! How can I help you today?',
    attachments: [],
    read_by: [
      { user_id: 'user-2', read_at: '2026-01-21T10:00:00Z' },
    ],
    created_at: '2026-01-21T10:00:00Z',
  },
  {
    id: 'msg-2',
    conversation_id: 'conv-1',
    sender_id: 'user-1',
    content: 'I submitted a maintenance request for the leaky faucet',
    attachments: [],
    read_by: [
      { user_id: 'user-1', read_at: '2026-01-21T10:05:00Z' },
      { user_id: 'user-2', read_at: '2026-01-21T10:10:00Z' },
    ],
    created_at: '2026-01-21T10:05:00Z',
  },
  // Add more messages...
];

// Mock Conversations
export const mockConversations = [
  {
    id: 'conv-1',
    participants: ['user-1', 'user-2'],
    type: 'direct' as const,
    title: null,
    created_at: '2026-01-15T10:00:00Z',
  },
  // Add more conversations...
];

// Mock Notifications
export const mockNotifications = [
  {
    id: 'notif-1',
    user_id: 'user-1',
    type: 'maintenance' as const,
    title: 'Maintenance Request Assigned',
    message: 'Your maintenance request has been assigned to a technician',
    action_url: '/tenant/maintenance',
    data: { issue_id: 'issue-1' },
    read: false,
    read_at: null,
    created_at: '2026-01-21T09:00:00Z',
  },
  {
    id: 'notif-2',
    user_id: 'user-1',
    type: 'finance' as const,
    title: 'Rent Due Soon',
    message: 'Your February rent payment is due in 10 days',
    action_url: '/tenant/payments',
    data: { bill_id: 'bill-1' },
    read: false,
    read_at: null,
    created_at: '2026-01-22T08:00:00Z',
  },
  // Add more notifications...
];

// Helper functions to query mock data
export function getUserById(id: string) {
  return mockUsers.find(u => u.id === id);
}

export function getPropertyById(id: string) {
  return mockProperties.find(p => p.id === id);
}

export function getUnitById(id: string) {
  return mockUnits.find(u => u.id === id);
}

export function getUnitsByProperty(propertyId: string) {
  return mockUnits.filter(u => u.property_id === propertyId);
}

export function getAvailableUnits() {
  return mockUnits.filter(u => u.status === 'available');
}

export function getBidsByUnit(unitId: string) {
  return mockBids.filter(b => b.unit_id === unitId);
}

export function getBidsByUser(userId: string) {
  return mockBids.filter(b => b.bidder_id === userId);
}

export function getTransactionsByUser(userId: string) {
  return mockTransactions.filter(t => t.user_id === userId);
}

export function getBillsByTenant(tenantId: string) {
  return mockBills.filter(b => b.tenant_id === tenantId);
}

export function getIssuesByProperty(propertyId: string) {
  return mockIssues.filter(i => i.property_id === propertyId);
}

export function getIssuesByReporter(reporterId: string) {
  return mockIssues.filter(i => i.reporter_id === reporterId);
}

export function getMaintenanceTasksByProperty(propertyId: string) {
  return mockMaintenanceTasks.filter(t => t.property_id === propertyId);
}

export function getDocumentsByProperty(propertyId: string) {
  return mockDocuments.filter(d => d.property_id === propertyId);
}

export function getMeetingsByProperty(propertyId: string) {
  return mockMeetings.filter(m => m.property_id === propertyId);
}

export function getVotesByProperty(propertyId: string) {
  return mockVotes.filter(v => v.property_id === propertyId);
}

export function getMessagesByConversation(conversationId: string) {
  return mockMessages.filter(m => m.conversation_id === conversationId);
}

export function getConversationsByUser(userId: string) {
  return mockConversations.filter(c => c.participants.includes(userId));
}

export function getNotificationsByUser(userId: string) {
  return mockNotifications.filter(n => n.user_id === userId);
}

export function getUnreadNotificationCount(userId: string) {
  return mockNotifications.filter(n => n.user_id === userId && !n.read).length;
}
```

---

# PART 3: STATE MANAGEMENT (FRONTEND ONLY)

## 3.1 Authentication Context (Mock)

**File: `/src/context/AuthContext.tsx`**

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockUsers, getUserById } from '@/lib/data/mockData';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize - check localStorage for saved session
  useEffect(() => {
    const savedUserId = localStorage.getItem('okey_user_id');
    if (savedUserId) {
      const savedUser = getUserById(savedUserId);
      if (savedUser) {
        setUser(savedUser);
      }
    }
    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user by email
    const foundUser = mockUsers.find(u => u.email === email);

    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    // Mock password check (in real app, this would be server-side)
    // Accept any password for demo

    // Save to localStorage
    localStorage.setItem('okey_user_id', foundUser.id);
    setUser(foundUser);
  }

  function signOut() {
    localStorage.removeItem('okey_user_id');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

## 3.2 App Context (Global State)

**File: `/src/context/AppContext.tsx`**

```typescript
import { createContext, useContext, useState, ReactNode } from 'react';
import { getNotificationsByUser, getUnreadNotificationCount } from '@/lib/data/mockData';
import { useAuth } from './AuthContext';

interface AppContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  selectedProperty: string | null;
  setSelectedProperty: (id: string | null) => void;

  notifications: any[];
  unreadCount: number;
  loadNotifications: () => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  function toggleSidebar() {
    setSidebarOpen(prev => !prev);
  }

  function loadNotifications() {
    if (!user) return;

    const userNotifications = getNotificationsByUser(user.id);
    setNotifications(userNotifications);
    setUnreadCount(getUnreadNotificationCount(user.id));
  }

  function markAsRead(id: string) {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }

  function clearNotifications() {
    setNotifications([]);
    setUnreadCount(0);
  }

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        selectedProperty,
        setSelectedProperty,
        notifications,
        unreadCount,
        loadNotifications,
        markAsRead,
        clearNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
```

---

# PART 4: COMPONENT PATTERNS

## 4.1 Data Loading Pattern (Mock Data)

```typescript
import { useState, useEffect } from 'react';
import { getAvailableUnits } from '@/lib/data/mockData';

function PropertyListPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  function loadProperties() {
    // Simulate loading delay
    setTimeout(() => {
      const data = getAvailableUnits();
      setProperties(data);
      setLoading(false);
    }, 300);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
```

## 4.2 Button Click Pattern

```typescript
function DeleteButton({ itemId, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    // Confirm
    const confirmed = window.confirm('Are you sure?');
    if (!confirmed) return;

    setDeleting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Call parent callback
    onDelete(itemId);

    setDeleting(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="btn-danger"
    >
      {deleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

## 4.3 Form Submission Pattern

```typescript
import { useState } from 'react';

function CreatePropertyForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    total_units: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSubmitting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate ID
    const newProperty = {
      id: `prop-${Date.now()}`,
      ...formData,
      owner_id: currentUser.id,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    // In real app, this would be added to backend
    // For now, just call success callback
    onSuccess(newProperty);

    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Property Name"
        required
      />

      <button type="submit" disabled={submitting}>
        {submitting ? 'Creating...' : 'Create Property'}
      </button>
    </form>
  );
}
```

## 4.4 Modal Pattern

```typescript
import { Dialog } from '@/components/ui/dialog';

function CreatePropertyModal({ open, onOpenChange, onSuccess }) {
  const [formData, setFormData] = useState({});

  function handleSubmit() {
    // Create mock property
    const newProperty = {
      id: `prop-${Date.now()}`,
      ...formData,
    };

    onSuccess(newProperty);
    onOpenChange(false); // Close modal
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Form content */}
      <button onClick={handleSubmit}>Create</button>
    </Dialog>
  );
}

// Usage
function ParentComponent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [properties, setProperties] = useState([]);

  function handleSuccess(newProperty) {
    // Add to local state
    setProperties(prev => [...prev, newProperty]);
  }

  return (
    <>
      <button onClick={() => setModalOpen(true)}>New Property</button>
      <CreatePropertyModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}
```

---

# PART 5: BUSINESS LOGIC (FRONTEND ONLY)

## 5.1 Bidding Logic

```typescript
// Place bid on unit
function placeBid(unitId: string, bidAmount: number, bidderScore: number) {
  // Get unit
  const unit = getUnitById(unitId);
  if (!unit) throw new Error('Unit not found');

  // Check O'Key score requirement
  if (bidderScore < (unit.minimum_okey_score || 0)) {
    throw new Error('Your O'Key score does not meet the minimum requirement');
  }

  // Check bid amount
  if (bidAmount < unit.monthly_rent) {
    throw new Error('Bid must be at least the monthly rent');
  }

  // Get existing bids
  const existingBids = getBidsByUnit(unitId);
  const highestBid = existingBids.sort((a, b) => b.bid_amount - a.bid_amount)[0];

  // Check if bid is higher than current highest
  if (highestBid && bidAmount <= highestBid.bid_amount) {
    throw new Error('Bid must be higher than current highest bid');
  }

  // Create bid
  const newBid = {
    id: `bid-${Date.now()}`,
    unit_id: unitId,
    bidder_id: currentUser.id,
    bid_amount: bidAmount,
    status: 'active',
    created_at: new Date().toISOString(),
  };

  // In real app, add to backend
  // For now, just return the bid
  return newBid;
}
```

## 5.2 O'Key Score Display

```typescript
function OKeyScoreBadge({ score }: { score: number }) {
  // Determine color based on score
  let color = 'red';
  if (score >= 80) color = 'green';
  else if (score >= 60) color = 'yellow';

  return (
    <div className={`score-badge score-${color}`}>
      <span className="score-number">{score}</span>
      <span className="score-label">O'Key Score</span>
    </div>
  );
}
```

## 5.3 Payment Calculation

```typescript
function calculateTotalDue(tenantId: string) {
  const bills = getBillsByTenant(tenantId);
  const unpaidBills = bills.filter(b => b.status === 'unpaid' || b.status === 'overdue');

  return unpaidBills.reduce((sum, bill) => sum + bill.amount, 0);
}

function isPaymentOverdue(dueDate: string) {
  return new Date(dueDate) < new Date();
}
```

## 5.4 Late Fee Display

```typescript
function LateFeeIndicator({ dueDate, status }: { dueDate: string; status: string }) {
  const isOverdue = status === 'overdue' || (status === 'unpaid' && isPaymentOverdue(dueDate));
  const daysLate = Math.floor((new Date().getTime() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24));

  if (!isOverdue) return null;

  return (
    <div className="late-fee-warning">
      <AlertCircle className="w-4 h-4" />
      <span>{daysLate} days overdue - Late fee may apply</span>
    </div>
  );
}
```

---

# PART 6: NAVIGATION & ROUTING

## 6.1 React Router Setup

**File: `/src/App.tsx`**

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth/login" replace />;

  return children;
}

// Role-Based Route
function RoleRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/" element={<MarketplaceHome />} />
            <Route path="/search" element={<PropertySearch />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/unit/:id" element={<UnitDetail />} />

            {/* Tenant routes */}
            <Route
              path="/tenant/*"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['tenant']}>
                    <TenantPortal />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* Owner routes */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['owner', 'property_manager', 'super_admin']}>
                    <OwnerDashboard />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

## 6.2 Navigation After Login

```typescript
function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(email: string, password: string) {
    try {
      await signIn(email, password);

      // Get user role and redirect
      const user = getUserById(localStorage.getItem('okey_user_id'));

      if (user.role === 'tenant') {
        navigate('/tenant');
      } else if (['owner', 'property_manager', 'super_admin'].includes(user.role)) {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      {/* Login form */}
    </div>
  );
}
```

---

# PART 7: IMPLEMENTATION PHASES (FRONTEND ONLY)

## Phase 1: Core Frontend Infrastructure

### 1.1 Setup & Dependencies
- ✅ React + TypeScript + Vite (already done)
- ✅ Tailwind CSS + shadcn/ui (already done)
- Install React Router: `npm install react-router-dom`
- Install form library: `npm install react-hook-form @hookform/resolvers zod`

### 1.2 Mock Data
- Expand `/src/lib/data/mockData.ts` with ALL data (users, properties, units, bids, leases, transactions, bills, issues, maintenance, documents, meetings, votes, messages, notifications)
- Add helper functions for querying mock data

### 1.3 Context Setup
- Update `/src/context/AuthContext.tsx` for mock authentication
- Create `/src/context/AppContext.tsx` for global state
- Wrap App with providers

### 1.4 Routing
- Implement React Router in `/src/App.tsx`
- Create ProtectedRoute component
- Create RoleRoute component
- Define all routes (public, tenant, owner, admin)

## Phase 2: Marketplace Features

### 2.1 Property Search
- Create search filters (location, price, bedrooms, etc.)
- Display search results (grid/list view)
- Implement sorting and filtering
- All data from mockUnits

### 2.2 Property Detail Page
- Display property information
- Show available units
- Photo gallery
- Amenities list

### 2.3 Unit Detail Page
- Unit specifications
- Photo gallery
- Bidding section
- Current bids display

### 2.4 Bidding System
- Place bid form
- Bid validation (O'Key score, amount)
- Display bid history
- Handle bid acceptance (owner view)

### 2.5 My Bids Page
- Display user's active bids
- Show bid status
- Allow bid withdrawal
- Show won/lost bids

## Phase 3: Tenant Portal

### 3.1 Tenant Dashboard
- Overview stats (rent due, maintenance requests, etc.)
- Quick actions
- Recent activity

### 3.2 Payments
- View outstanding balance
- View payment history
- Make payment form (mock Stripe)
- Payment success/failure feedback

### 3.3 Maintenance Requests
- Submit maintenance request form
- View request status
- Add photos
- View history

### 3.4 Documents
- View lease agreement
- View receipts
- Download documents

### 3.5 Messages
- View conversations
- Send/receive messages (mock real-time)
- Message property manager

## Phase 4: Owner Portal

### 4.1 Properties Dashboard
- Property list with stats
- Add/edit/delete properties
- Property detail pages

### 4.2 Units Management
- Unit list per property
- Add/edit/delete units
- Unit status management

### 4.3 Residents
- Resident directory
- Add/edit residents
- Assign to units

### 4.4 Financial Management
- Revenue/expense overview
- Transaction list
- Bills management
- Payment tracking

### 4.5 Issues & Maintenance
- Issue list with filters
- Assign to staff
- Update status
- Maintenance task scheduling

### 4.6 Documents
- Upload documents
- Categorize and tag
- Access control

### 4.7 Meetings & Voting
- Schedule meetings
- Create votes
- View results
- RSVP management

## Phase 5: Polish & Enhancement

### 5.1 Notifications
- Notification bell with count
- Notification popover
- Mark as read
- Action links

### 5.2 Real-Time Simulation
- Simulate new messages
- Simulate bid updates
- Simulate notifications

### 5.3 Animations
- Page transitions
- Loading states
- Success/error feedback
- Smooth interactions

### 5.4 Responsive Design
- Mobile optimization
- Tablet layouts
- Touch interactions

---

# PART 8: BUILDER INSTRUCTIONS FORMAT

## Instruction Template

When Logic Agent provides instructions to Builder Agent, use this format:

```
TASK: [Clear task title]

OBJECTIVE:
[What we're building and why]

FILES TO CREATE/MODIFY:
- File 1: path/to/file.tsx
- File 2: path/to/file.ts

IMPLEMENTATION:

1. [Step 1 description]

File: path/to/file.tsx
```typescript
// Complete code here
```

2. [Step 2 description]

File: path/to/file.ts
```typescript
// Complete code here
```

TESTING:
- How to test this feature
- Expected behavior

SUCCESS CRITERIA:
- [ ] Criterion 1
- [ ] Criterion 2
```

---

## READY FOR BUILDER

Logic Agent is ready to provide step-by-step frontend implementation instructions to Builder Agent.

**Next: Provide instructions for Phase 1 tasks**

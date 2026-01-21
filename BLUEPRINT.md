# O'KEY PLATFORM - TECHNICAL BLUEPRINT
## Master Specification for Implementation

**Version:** 1.0
**Last Updated:** January 21, 2026
**Status:** Phase 1 - Foundation & Infrastructure

---

## DOCUMENT PURPOSE

This is the **master technical blueprint** for O'Key Platform implementation. Builder Agent must reference this document for all implementation work. This document defines:

- System architecture and component structure
- Data models and database schema
- API service layer specifications
- State management and data flow
- Component interactions and wiring
- Event handlers and business logic
- Authentication and authorization flows
- Navigation and routing logic
- Integration specifications

---

# PART 1: SYSTEM ARCHITECTURE

## 1.1 Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                     O'KEY PLATFORM                           │
├─────────────────────────────────────────────────────────────┤
│ FRONTEND (React + TypeScript)                                │
│ ├── UI Layer: shadcn/ui + Radix UI (51 components)         │
│ ├── Styling: Tailwind CSS 3.4.19                           │
│ ├── State: Context API (Auth, App State)                   │
│ ├── Routing: React Router v6 (to be added)                 │
│ ├── Forms: React Hook Form + Zod validation                │
│ ├── Animations: Motion (Framer Motion) + GSAP              │
│ └── HTTP Client: Supabase Client                           │
├─────────────────────────────────────────────────────────────┤
│ BACKEND (Supabase)                                          │
│ ├── Database: PostgreSQL 15                                │
│ ├── Authentication: Supabase Auth                          │
│ ├── Storage: Supabase Storage (documents, images)          │
│ ├── Real-time: Supabase Realtime (WebSocket)               │
│ └── Edge Functions: Deno (serverless functions)            │
├─────────────────────────────────────────────────────────────┤
│ INTEGRATIONS                                                │
│ ├── Payments: Stripe                                       │
│ ├── E-Signatures: DocuSign                                 │
│ ├── Accounting: QuickBooks Online                          │
│ ├── AI Workflows: n8n                                      │
│ ├── Email: SendGrid / Mailgun                              │
│ └── SMS: Twilio (optional)                                 │
└─────────────────────────────────────────────────────────────┘
```

## 1.2 Project Structure

```
src/
├── features/              # Feature modules (domain-driven)
│   ├── auth/             # Authentication pages & logic
│   ├── marketplace/      # Property search, bidding, O'Key score
│   ├── tenant-portal/    # Tenant dashboard & features
│   ├── property-management/  # Owner/manager features
│   ├── financial/        # Financial management
│   ├── operations/       # Maintenance, issues, inspections
│   ├── documents/        # Document management
│   ├── governance/       # Meetings, voting
│   ├── communication/    # Messaging, notifications
│   └── analytics/        # Reports, dashboards
│
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components (51 total)
│   ├── layout/          # Layout components (nav, sidebar, header)
│   ├── forms/           # Form components
│   ├── data-display/    # Tables, cards, lists
│   └── feedback/        # Modals, toasts, alerts
│
├── lib/                 # Utilities & services
│   ├── api/            # API service layer (CRITICAL)
│   │   ├── client.ts        # Supabase client config
│   │   ├── auth.ts          # Auth services
│   │   ├── properties.ts    # Property CRUD
│   │   ├── units.ts         # Unit CRUD
│   │   ├── residents.ts     # Resident CRUD
│   │   ├── finances.ts      # Financial operations
│   │   ├── issues.ts        # Issue tracking
│   │   ├── maintenance.ts   # Maintenance management
│   │   ├── documents.ts     # Document management
│   │   ├── bids.ts          # Bidding system
│   │   ├── messages.ts      # Messaging
│   │   └── notifications.ts # Notifications
│   │
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── validations/    # Zod schemas for validation
│   └── constants/      # Constants and enums
│
├── context/            # Global state management
│   ├── AuthContext.tsx      # Authentication state
│   ├── AppContext.tsx       # App-wide state
│   └── BidContext.tsx       # Bidding state
│
├── types/              # TypeScript type definitions
│   └── index.ts        # All types (User, Property, etc.)
│
├── styles/             # Global styles
│   ├── globals.css     # Global CSS + Tailwind
│   └── design-system.ts # Design tokens
│
└── App.tsx            # Main app component & routing
```

---

# PART 2: DATABASE SCHEMA

## 2.1 Core Tables & Relationships

```sql
-- USERS & AUTHENTICATION
users (Supabase Auth + Extended Profile)
  - id (uuid, PK, from auth.users)
  - email (string, unique)
  - full_name (string)
  - phone (string)
  - avatar_url (string)
  - role (enum: super_admin, property_manager, board_member, accountant, owner, tenant, vendor, emergency_agent, public)
  - okey_score (integer, 0-100) -- For tenants
  - status (enum: active, inactive, pending)
  - created_at (timestamp)
  - updated_at (timestamp)

-- PROPERTIES
properties
  - id (uuid, PK)
  - owner_id (uuid, FK -> users.id)
  - manager_id (uuid, FK -> users.id, nullable)
  - name (string)
  - address (jsonb: street, city, province, postal_code, country)
  - property_type (enum: condo, apartment, house, commercial)
  - total_units (integer)
  - year_built (integer)
  - amenities (jsonb array)
  - photos (jsonb array of URLs)
  - status (enum: active, inactive, maintenance)
  - created_at (timestamp)
  - updated_at (timestamp)

-- UNITS
units
  - id (uuid, PK)
  - property_id (uuid, FK -> properties.id)
  - unit_number (string)
  - floor (integer)
  - unit_type (string: studio, 1BR, 2BR, etc.)
  - bedrooms (integer)
  - bathrooms (decimal)
  - square_feet (integer)
  - monthly_rent (decimal)
  - status (enum: available, occupied, maintenance, reserved)
  - available_date (date, nullable)
  - pet_friendly (boolean)
  - parking_spaces (integer)
  - utilities_included (jsonb array)
  - photos (jsonb array of URLs)
  - floor_plan_url (string, nullable)
  - created_at (timestamp)
  - updated_at (timestamp)

-- LEASES
leases
  - id (uuid, PK)
  - unit_id (uuid, FK -> units.id)
  - tenant_id (uuid, FK -> users.id)
  - landlord_id (uuid, FK -> users.id)
  - start_date (date)
  - end_date (date)
  - monthly_rent (decimal)
  - security_deposit (decimal)
  - lease_type (enum: fixed, month_to_month)
  - status (enum: draft, pending_signature, active, expired, terminated)
  - lease_document_url (string, nullable)
  - docusign_envelope_id (string, nullable)
  - terms (jsonb)
  - created_at (timestamp)
  - updated_at (timestamp)

-- BIDS (Auction System)
bids
  - id (uuid, PK)
  - unit_id (uuid, FK -> units.id)
  - bidder_id (uuid, FK -> users.id)
  - bid_amount (decimal)
  - message (text, nullable)
  - status (enum: active, accepted, rejected, withdrawn, expired)
  - auto_bid_enabled (boolean)
  - max_auto_bid (decimal, nullable)
  - expires_at (timestamp, nullable)
  - created_at (timestamp)
  - updated_at (timestamp)

-- PAYMENTS & TRANSACTIONS
transactions
  - id (uuid, PK)
  - user_id (uuid, FK -> users.id)
  - property_id (uuid, FK -> properties.id, nullable)
  - unit_id (uuid, FK -> units.id, nullable)
  - type (enum: rent_payment, late_fee, deposit, refund, expense, other)
  - amount (decimal)
  - status (enum: pending, completed, failed, refunded)
  - payment_method (enum: card, bank_transfer, e_transfer, check)
  - stripe_payment_intent_id (string, nullable)
  - description (text)
  - due_date (date, nullable)
  - paid_date (date, nullable)
  - created_at (timestamp)
  - updated_at (timestamp)

-- BILLS (Receivables)
bills
  - id (uuid, PK)
  - unit_id (uuid, FK -> units.id)
  - tenant_id (uuid, FK -> users.id)
  - amount (decimal)
  - due_date (date)
  - description (text)
  - category (enum: rent, utilities, parking, late_fee, other)
  - status (enum: unpaid, partially_paid, paid, overdue, void)
  - paid_amount (decimal)
  - created_at (timestamp)
  - updated_at (timestamp)

-- INVOICES (Payables)
invoices
  - id (uuid, PK)
  - property_id (uuid, FK -> properties.id)
  - vendor_id (uuid, FK -> users.id, nullable)
  - amount (decimal)
  - due_date (date)
  - description (text)
  - category (enum: maintenance, management_fee, insurance, tax, utilities, legal, marketing, other)
  - status (enum: pending_approval, approved, paid, rejected, void)
  - approval_status (jsonb: array of {approver_id, status, timestamp})
  - invoice_document_url (string, nullable)
  - paid_date (date, nullable)
  - created_at (timestamp)
  - updated_at (timestamp)

-- ISSUES
issues
  - id (uuid, PK)
  - property_id (uuid, FK -> properties.id)
  - unit_id (uuid, FK -> units.id, nullable)
  - reporter_id (uuid, FK -> users.id)
  - assigned_to (uuid, FK -> users.id, nullable)
  - title (string)
  - description (text)
  - category (enum: water, heating, noise, plumbing, electrical, structural, appliance, pest, security, common_area, other)
  - priority (enum: low, medium, high, emergency)
  - status (enum: open, in_progress, resolved, closed)
  - photos (jsonb array of URLs)
  - attachments (jsonb array of URLs)
  - resolution_notes (text, nullable)
  - resolved_at (timestamp, nullable)
  - created_at (timestamp)
  - updated_at (timestamp)

-- MAINTENANCE TASKS
maintenance_tasks
  - id (uuid, PK)
  - property_id (uuid, FK -> properties.id)
  - unit_id (uuid, FK -> units.id, nullable)
  - issue_id (uuid, FK -> issues.id, nullable)
  - assigned_to (uuid, FK -> users.id, nullable)
  - title (string)
  - description (text)
  - type (enum: preventive, corrective, emergency)
  - priority (enum: low, medium, high, urgent)
  - status (enum: scheduled, in_progress, completed, cancelled, overdue)
  - frequency (enum: one_time, daily, weekly, monthly, quarterly, annual, nullable)
  - due_date (date)
  - completed_date (date, nullable)
  - estimated_cost (decimal, nullable)
  - actual_cost (decimal, nullable)
  - checklist (jsonb array of {item, completed})
  - photos (jsonb array of URLs)
  - notes (text, nullable)
  - created_at (timestamp)
  - updated_at (timestamp)

-- DOCUMENTS
documents
  - id (uuid, PK)
  - uploader_id (uuid, FK -> users.id)
  - property_id (uuid, FK -> properties.id, nullable)
  - unit_id (uuid, FK -> units.id, nullable)
  - title (string)
  - description (text, nullable)
  - category (enum: financial, legal, maintenance, meeting_minutes, insurance, contract, law16, inspection, permit, correspondence, other)
  - file_url (string) -- Supabase Storage URL
  - file_type (string)
  - file_size (integer) -- bytes
  - tags (jsonb array)
  - access_control (jsonb: {role: string[], user_ids: uuid[]})
  - created_at (timestamp)
  - updated_at (timestamp)

-- MEETINGS
meetings
  - id (uuid, PK)
  - property_id (uuid, FK -> properties.id, nullable)
  - organizer_id (uuid, FK -> users.id)
  - title (string)
  - type (enum: board, general_assembly, committee, other)
  - scheduled_at (timestamp)
  - location (jsonb: {type: physical|virtual|hybrid, address: string, link: string})
  - status (enum: scheduled, completed, cancelled)
  - agenda (jsonb array of {item, description, time_allocation})
  - minutes (text, nullable)
  - minutes_approved (boolean)
  - attendees (jsonb array of {user_id, rsvp_status, attended})
  - documents (jsonb array of document_ids)
  - created_at (timestamp)
  - updated_at (timestamp)

-- VOTES
votes
  - id (uuid, PK)
  - property_id (uuid, FK -> properties.id, nullable)
  - meeting_id (uuid, FK -> meetings.id, nullable)
  - creator_id (uuid, FK -> users.id)
  - title (string)
  - description (text)
  - type (enum: simple_majority, supermajority, unanimous, custom)
  - threshold (decimal) -- e.g., 0.5 for 50%, 0.67 for 2/3
  - start_date (timestamp)
  - end_date (timestamp)
  - status (enum: active, passed, failed, closed)
  - eligible_voters (jsonb array of user_ids)
  - voting_weight (jsonb: {user_id: weight})
  - allow_changes (boolean)
  - anonymous (boolean)
  - results (jsonb: {for: count, against: count, abstain: count})
  - created_at (timestamp)
  - updated_at (timestamp)

-- VOTE RECORDS
vote_records
  - id (uuid, PK)
  - vote_id (uuid, FK -> votes.id)
  - voter_id (uuid, FK -> users.id)
  - choice (enum: for, against, abstain)
  - weight (decimal)
  - voted_at (timestamp)

-- MESSAGES
messages
  - id (uuid, PK)
  - conversation_id (uuid, FK -> conversations.id)
  - sender_id (uuid, FK -> users.id)
  - content (text)
  - attachments (jsonb array of {type, url})
  - read_by (jsonb array of {user_id, read_at})
  - created_at (timestamp)
  - updated_at (timestamp)

-- CONVERSATIONS
conversations
  - id (uuid, PK)
  - participants (jsonb array of user_ids)
  - type (enum: direct, group)
  - title (string, nullable)
  - created_at (timestamp)
  - updated_at (timestamp)

-- NOTIFICATIONS
notifications
  - id (uuid, PK)
  - user_id (uuid, FK -> users.id)
  - type (enum: issue, maintenance, finance, meeting, vote, document, message, system)
  - title (string)
  - message (text)
  - action_url (string, nullable)
  - data (jsonb)
  - read (boolean)
  - read_at (timestamp, nullable)
  - created_at (timestamp)

-- AUDIT LOGS
audit_logs
  - id (uuid, PK)
  - user_id (uuid, FK -> users.id, nullable)
  - action (string) -- create, read, update, delete
  - entity_type (string) -- property, unit, issue, etc.
  - entity_id (uuid)
  - old_value (jsonb, nullable)
  - new_value (jsonb, nullable)
  - ip_address (string)
  - user_agent (string)
  - created_at (timestamp)
```

## 2.2 Row Level Security (RLS) Policies

**Critical:** All tables MUST have RLS enabled. Base policies:

```sql
-- USERS: Can read own profile, admins can read all
users:
  SELECT: user_id = auth.uid() OR has_role('super_admin')
  UPDATE: user_id = auth.uid() OR has_role('super_admin')

-- PROPERTIES: Owners can CRUD their properties, managers can read/update assigned properties
properties:
  SELECT: owner_id = auth.uid() OR manager_id = auth.uid() OR has_permission('view_all_properties')
  INSERT: has_permission('create_property')
  UPDATE: owner_id = auth.uid() OR manager_id = auth.uid() OR has_permission('edit_any_property')
  DELETE: owner_id = auth.uid() OR has_permission('delete_any_property')

-- UNITS: Based on property access
units:
  SELECT: property.owner_id = auth.uid() OR property.manager_id = auth.uid() OR is_tenant_of_unit(unit_id) OR status = 'available'
  INSERT: property.owner_id = auth.uid() OR property.manager_id = auth.uid()
  UPDATE: property.owner_id = auth.uid() OR property.manager_id = auth.uid()
  DELETE: property.owner_id = auth.uid()

-- BIDS: Users can view/create own bids, property owners can view all bids on their units
bids:
  SELECT: bidder_id = auth.uid() OR unit.property.owner_id = auth.uid() OR unit.property.manager_id = auth.uid()
  INSERT: authenticated AND has_minimum_okey_score(unit.minimum_score)
  UPDATE: bidder_id = auth.uid()
  DELETE: bidder_id = auth.uid()

-- TRANSACTIONS: Users can view own transactions, property owners/managers can view property transactions
transactions:
  SELECT: user_id = auth.uid() OR property.owner_id = auth.uid() OR property.manager_id = auth.uid() OR has_permission('view_all_transactions')
  INSERT: has_permission('create_transaction')
  UPDATE: has_permission('edit_transaction')

-- ISSUES: Reporter can view own issues, assigned staff can view assigned issues, property staff can view property issues
issues:
  SELECT: reporter_id = auth.uid() OR assigned_to = auth.uid() OR property.owner_id = auth.uid() OR property.manager_id = auth.uid()
  INSERT: authenticated
  UPDATE: assigned_to = auth.uid() OR property.manager_id = auth.uid() OR has_permission('edit_any_issue')

-- DOCUMENTS: Based on access_control jsonb field
documents:
  SELECT: uploader_id = auth.uid() OR user_role IN access_control.roles OR auth.uid() IN access_control.user_ids
  INSERT: authenticated
  UPDATE: uploader_id = auth.uid() OR has_permission('edit_any_document')
  DELETE: uploader_id = auth.uid() OR has_permission('delete_any_document')

-- MESSAGES: Can only view messages in conversations where user is participant
messages:
  SELECT: auth.uid() IN conversation.participants
  INSERT: auth.uid() IN conversation.participants
  UPDATE: sender_id = auth.uid() (only within 5 minutes)
  DELETE: sender_id = auth.uid()

-- NOTIFICATIONS: Users can only view own notifications
notifications:
  SELECT: user_id = auth.uid()
  UPDATE: user_id = auth.uid()
```

## 2.3 Database Functions

```sql
-- Function: has_role(role_name text)
CREATE FUNCTION has_role(role_name text) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = role_name
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Function: has_permission(permission_name text)
CREATE FUNCTION has_permission(permission_name text) RETURNS boolean AS $$
  -- Check if user's role has the specified permission
  -- Permission mappings defined in permission_matrix table
  SELECT EXISTS (
    SELECT 1 FROM permission_matrix pm
    JOIN users u ON u.role = pm.role
    WHERE u.id = auth.uid() AND pm.permission = permission_name
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Function: is_tenant_of_unit(unit_id uuid)
CREATE FUNCTION is_tenant_of_unit(unit_id uuid) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM leases
    WHERE unit_id = $1
      AND tenant_id = auth.uid()
      AND status = 'active'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Function: calculate_okey_score(user_id uuid)
CREATE FUNCTION calculate_okey_score(user_id uuid) RETURNS integer AS $$
  -- O'Key score calculation algorithm
  -- Credit score (35%), rental history (30%), income (20%), references (10%), background (5%)
  -- Returns score 0-100
  -- Implementation TBD with actual scoring logic
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

# PART 3: API SERVICE LAYER

## 3.1 Supabase Client Configuration

**File: `/src/lib/api/client.ts`**

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase'; // Generated types

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Error handling wrapper
export async function handleSupabaseError<T>(
  promise: Promise<{ data: T | null; error: any }>
): Promise<T> {
  const { data, error } = await promise;

  if (error) {
    console.error('Supabase error:', error);
    throw new Error(error.message || 'An error occurred');
  }

  if (!data) {
    throw new Error('No data returned');
  }

  return data;
}

// Type-safe query builder helpers
export const db = {
  from: <T extends keyof Database['public']['Tables']>(table: T) => {
    return supabase.from(table);
  },
};
```

## 3.2 Authentication Service

**File: `/src/lib/api/auth.ts`**

```typescript
import { supabase, handleSupabaseError } from './client';
import type { User, UserRole } from '@/types';

export const authService = {
  /**
   * Sign up new user with email and password
   */
  async signUp(email: string, password: string, userData: {
    full_name: string;
    phone?: string;
    role: UserRole;
  }) {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // 2. Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        full_name: userData.full_name,
        phone: userData.phone || null,
        role: userData.role,
        status: 'pending', // Requires email verification
      });

    if (profileError) throw profileError;

    return authData.user;
  },

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Sign in failed');

    // Fetch full user profile
    const profile = await this.getUserProfile(data.user.id);

    return { user: data.user, profile };
  },

  /**
   * Sign in with magic link
   */
  async signInWithMagicLink(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
  },

  /**
   * Sign out current user
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get current session
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Get current user with profile
   */
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const profile = await this.getUserProfile(user.id);
    return { user, profile };
  },

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string) {
    return handleSupabaseError(
      supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
    );
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<User>) {
    return handleSupabaseError(
      supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
    );
  },

  /**
   * Reset password
   */
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
  },

  /**
   * Update password
   */
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
```

## 3.3 Properties Service

**File: `/src/lib/api/properties.ts`**

```typescript
import { supabase, handleSupabaseError } from './client';
import type { Property, PropertyInsert, PropertyUpdate } from '@/types';

export const propertiesService = {
  /**
   * Get all properties (with filters)
   */
  async getProperties(filters?: {
    ownerId?: string;
    managerId?: string;
    status?: string;
    search?: string;
  }) {
    let query = supabase
      .from('properties')
      .select('*, owner:users!owner_id(id, full_name), manager:users!manager_id(id, full_name)');

    if (filters?.ownerId) {
      query = query.eq('owner_id', filters.ownerId);
    }

    if (filters?.managerId) {
      query = query.eq('manager_id', filters.managerId);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    return handleSupabaseError(query.order('created_at', { ascending: false }));
  },

  /**
   * Get property by ID (with units)
   */
  async getPropertyById(id: string, includeUnits = false) {
    let query = supabase
      .from('properties')
      .select(`
        *,
        owner:users!owner_id(id, full_name, email),
        manager:users!manager_id(id, full_name, email)
      `)
      .eq('id', id);

    if (includeUnits) {
      query = query.select(`
        *,
        owner:users!owner_id(id, full_name, email),
        manager:users!manager_id(id, full_name, email),
        units(*)
      `);
    }

    return handleSupabaseError(query.single());
  },

  /**
   * Create new property
   */
  async createProperty(property: PropertyInsert) {
    return handleSupabaseError(
      supabase
        .from('properties')
        .insert(property)
        .select()
        .single()
    );
  },

  /**
   * Update property
   */
  async updateProperty(id: string, updates: PropertyUpdate) {
    return handleSupabaseError(
      supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    );
  },

  /**
   * Delete property
   */
  async deleteProperty(id: string) {
    return handleSupabaseError(
      supabase
        .from('properties')
        .delete()
        .eq('id', id)
    );
  },

  /**
   * Get property statistics
   */
  async getPropertyStats(propertyId: string) {
    // Get units count and occupancy
    const { data: units } = await supabase
      .from('units')
      .select('id, status')
      .eq('property_id', propertyId);

    const totalUnits = units?.length || 0;
    const occupiedUnits = units?.filter(u => u.status === 'occupied').length || 0;
    const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

    // Get open issues count
    const { count: openIssues } = await supabase
      .from('issues')
      .select('*', { count: 'exact', head: true })
      .eq('property_id', propertyId)
      .in('status', ['open', 'in_progress']);

    // Get monthly revenue (current month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: transactions } = await supabase
      .from('transactions')
      .select('amount')
      .eq('property_id', propertyId)
      .eq('type', 'rent_payment')
      .eq('status', 'completed')
      .gte('created_at', startOfMonth.toISOString());

    const monthlyRevenue = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;

    return {
      totalUnits,
      occupiedUnits,
      occupancyRate,
      openIssues: openIssues || 0,
      monthlyRevenue,
    };
  },
};
```

## 3.4 Units Service

**File: `/src/lib/api/units.ts`**

```typescript
import { supabase, handleSupabaseError } from './client';
import type { Unit, UnitInsert, UnitUpdate } from '@/types';

export const unitsService = {
  /**
   * Get units by property ID
   */
  async getUnitsByProperty(propertyId: string, filters?: {
    status?: string;
    search?: string;
  }) {
    let query = supabase
      .from('units')
      .select('*, property:properties(id, name)')
      .eq('property_id', propertyId);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.ilike('unit_number', `%${filters.search}%`);
    }

    return handleSupabaseError(query.order('unit_number'));
  },

  /**
   * Get available units (for marketplace)
   */
  async getAvailableUnits(filters?: {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    petFriendly?: boolean;
  }) {
    let query = supabase
      .from('units')
      .select('*, property:properties(*)')
      .eq('status', 'available');

    if (filters?.minPrice) {
      query = query.gte('monthly_rent', filters.minPrice);
    }

    if (filters?.maxPrice) {
      query = query.lte('monthly_rent', filters.maxPrice);
    }

    if (filters?.bedrooms !== undefined) {
      query = query.eq('bedrooms', filters.bedrooms);
    }

    if (filters?.petFriendly !== undefined) {
      query = query.eq('pet_friendly', filters.petFriendly);
    }

    return handleSupabaseError(query.order('created_at', { ascending: false }));
  },

  /**
   * Get unit by ID
   */
  async getUnitById(id: string) {
    return handleSupabaseError(
      supabase
        .from('units')
        .select(`
          *,
          property:properties(*),
          current_lease:leases!leases_unit_id_fkey(
            id,
            tenant:users!leases_tenant_id_fkey(id, full_name, email),
            start_date,
            end_date,
            status
          )
        `)
        .eq('id', id)
        .single()
    );
  },

  /**
   * Create unit
   */
  async createUnit(unit: UnitInsert) {
    return handleSupabaseError(
      supabase
        .from('units')
        .insert(unit)
        .select()
        .single()
    );
  },

  /**
   * Update unit
   */
  async updateUnit(id: string, updates: UnitUpdate) {
    return handleSupabaseError(
      supabase
        .from('units')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    );
  },

  /**
   * Delete unit
   */
  async deleteUnit(id: string) {
    return handleSupabaseError(
      supabase
        .from('units')
        .delete()
        .eq('id', id)
    );
  },

  /**
   * Get unit bids
   */
  async getUnitBids(unitId: string) {
    return handleSupabaseError(
      supabase
        .from('bids')
        .select('*, bidder:users(id, full_name, okey_score)')
        .eq('unit_id', unitId)
        .order('bid_amount', { ascending: false })
    );
  },
};
```

## 3.5 Additional Service Files

**All service files follow the same pattern:**

- **`/src/lib/api/residents.ts`** - Resident CRUD, tenant/owner management
- **`/src/lib/api/leases.ts`** - Lease CRUD, lifecycle management, DocuSign integration
- **`/src/lib/api/bids.ts`** - Bidding system, auto-bid logic
- **`/src/lib/api/finances.ts`** - Transactions, bills, invoices, reports
- **`/src/lib/api/issues.ts`** - Issue CRUD, assignment, status updates
- **`/src/lib/api/maintenance.ts`** - Maintenance task CRUD, scheduling
- **`/src/lib/api/documents.ts`** - Document upload, download, access control
- **`/src/lib/api/meetings.ts`** - Meeting CRUD, RSVP, minutes
- **`/src/lib/api/votes.ts`** - Vote CRUD, voting, results
- **`/src/lib/api/messages.ts`** - Messaging, conversations, real-time
- **`/src/lib/api/notifications.ts`** - Notification CRUD, marking read

**Each service exports an object with methods:**
- `getAll()` / `getById()` - Fetch data
- `create()` - Create new record
- `update()` - Update existing record
- `delete()` - Delete record
- Custom methods as needed (e.g., `placeBid()`, `acceptBid()`)

---

# PART 4: STATE MANAGEMENT

## 4.1 Authentication Context

**File: `/src/context/AuthContext.tsx`**

```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '@/lib/api/auth';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);

        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function initializeAuth() {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser.profile);
        setSession(await authService.getSession());
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadUserProfile(userId: string) {
    try {
      const profile = await authService.getUserProfile(userId);
      setUser(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  async function signIn(email: string, password: string) {
    const { profile } = await authService.signIn(email, password);
    setUser(profile);
  }

  async function signUp(email: string, password: string, userData: any) {
    await authService.signUp(email, password, userData);
    // User will be logged in automatically after signup
  }

  async function signOut() {
    await authService.signOut();
    setUser(null);
    setSession(null);
  }

  async function refreshUser() {
    if (session?.user) {
      await loadUserProfile(session.user.id);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

## 4.2 App Context (Global State)

**File: `/src/context/AppContext.tsx`**

```typescript
import { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  selectedProperty: string | null;
  setSelectedProperty: (propertyId: string | null) => void;

  notifications: any[];
  unreadCount: number;
  addNotification: (notification: any) => void;
  markAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  function toggleSidebar() {
    setSidebarOpen(prev => !prev);
  }

  function addNotification(notification: any) {
    setNotifications(prev => [notification, ...prev]);
  }

  function markAsRead(notificationId: string) {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }

  function clearNotifications() {
    setNotifications([]);
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
        addNotification,
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
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
```

---

# PART 5: COMPONENT INTERACTIONS & WIRING

## 5.1 Button Click Handlers

**Pattern: All buttons follow this structure**

```typescript
// ASYNC ACTION BUTTON (API call)
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

async function handleAction() {
  try {
    setLoading(true);
    setError(null);

    // Call API service
    const result = await someService.someMethod(params);

    // Update local state
    setState(result);

    // Show success toast
    toast.success('Action completed successfully');

    // Optional: Callback or navigation
    onSuccess?.(result);

  } catch (err) {
    const message = err instanceof Error ? err.message : 'An error occurred';
    setError(message);
    toast.error(message);
  } finally {
    setLoading(false);
  }
}

// Button JSX
<button
  onClick={handleAction}
  disabled={loading}
  className="btn-primary"
>
  {loading ? 'Loading...' : 'Action Label'}
</button>
```

**Example: Delete Property Button**

```typescript
async function handleDeleteProperty(propertyId: string) {
  // 1. Confirm action
  const confirmed = await confirmDialog({
    title: 'Delete Property',
    message: 'Are you sure? This action cannot be undone.',
    confirmLabel: 'Delete',
    confirmVariant: 'destructive',
  });

  if (!confirmed) return;

  try {
    setLoading(true);

    // 2. Call API
    await propertiesService.deleteProperty(propertyId);

    // 3. Update UI (remove from list)
    setProperties(prev => prev.filter(p => p.id !== propertyId));

    // 4. Show success
    toast.success('Property deleted successfully');

    // 5. Navigate away if on detail page
    navigate('/properties');

  } catch (err) {
    toast.error('Failed to delete property');
    console.error(err);
  } finally {
    setLoading(false);
  }
}
```

## 5.2 Form Submission Flow

**Pattern: All forms use React Hook Form + Zod**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Define validation schema
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
  // ... more fields
});

type FormData = z.infer<typeof schema>;

// 2. Initialize form
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {
    email: '',
    password: '',
  },
});

// 3. Submit handler
async function onSubmit(data: FormData) {
  try {
    setLoading(true);

    // Call API
    const result = await someService.create(data);

    // Success
    toast.success('Created successfully');
    form.reset();
    onSuccess?.(result);

  } catch (err) {
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
}

// 4. JSX
<form onSubmit={form.handleSubmit(onSubmit)}>
  <input {...form.register('email')} />
  {form.formState.errors.email && (
    <span className="error">{form.formState.errors.email.message}</span>
  )}

  <button type="submit" disabled={loading}>
    Submit
  </button>
</form>
```

## 5.3 Data Fetching Pattern

**All data fetching follows this pattern:**

```typescript
import { useEffect, useState } from 'react';

function ComponentWithData() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []); // Dependencies as needed

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const result = await someService.getAll();
      setData(result);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load data';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  // Render states
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;
  if (data.length === 0) return <EmptyState />;

  return (
    <div>
      {data.map(item => (
        <ItemCard key={item.id} data={item} />
      ))}
    </div>
  );
}
```

## 5.4 Modal/Dialog Pattern

**All modals use this pattern:**

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (result: any) => void;
}

function MyModal({ open, onOpenChange, onSuccess }: MyModalProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data: any) {
    try {
      setLoading(true);
      const result = await someService.create(data);

      toast.success('Success');
      onSuccess?.(result);
      onOpenChange(false); // Close modal

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modal Title</DialogTitle>
        </DialogHeader>

        {/* Modal content */}

        <div className="flex gap-2">
          <button onClick={() => onOpenChange(false)}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Usage in parent component
function ParentComponent() {
  const [modalOpen, setModalOpen] = useState(false);

  function handleSuccess(result: any) {
    // Update parent state
    setData(prev => [...prev, result]);
  }

  return (
    <>
      <button onClick={() => setModalOpen(true)}>Open Modal</button>

      <MyModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handleSuccess}
      />
    </>
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
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleRoute } from '@/components/auth/RoleRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

            {/* Public marketplace routes */}
            <Route path="/" element={<MarketplaceHome />} />
            <Route path="/search" element={<PropertySearch />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/unit/:id" element={<UnitDetail />} />

            {/* Protected routes (authenticated users only) */}
            <Route element={<ProtectedRoute />}>
              {/* Common routes */}
              <Route path="/my-bids" element={<MyBids />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Tenant routes */}
              <Route element={<RoleRoute allowedRoles={['tenant']} />}>
                <Route path="/tenant" element={<TenantDashboard />} />
                <Route path="/tenant/payments" element={<TenantPayments />} />
                <Route path="/tenant/maintenance" element={<TenantMaintenance />} />
                <Route path="/tenant/documents" element={<TenantDocuments />} />
              </Route>

              {/* Owner/Manager routes */}
              <Route element={<RoleRoute allowedRoles={['owner', 'property_manager', 'super_admin']} />}>
                <Route path="/dashboard" element={<OwnerDashboard />} />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/properties/:id" element={<PropertyDetailPage />} />
                <Route path="/residents" element={<ResidentsPage />} />
                <Route path="/finances" element={<FinancesPage />} />
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="/issues" element={<IssuesPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/meetings" element={<MeetingsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
              </Route>

              {/* Admin routes */}
              <Route element={<RoleRoute allowedRoles={['super_admin']} />}>
                <Route path="/admin/users" element={<UsersManagement />} />
                <Route path="/admin/settings" element={<SystemSettings />} />
                <Route path="/admin/audit-logs" element={<AuditLogs />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

## 6.2 Protected Route Component

**File: `/src/components/auth/ProtectedRoute.tsx`**

```typescript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
```

## 6.3 Role-Based Route Component

**File: `/src/components/auth/RoleRoute.tsx`**

```typescript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
```

## 6.4 Navigation Flow Logic

**When user logs in:**
1. Check user role
2. Redirect based on role:
   - `tenant` → `/tenant`
   - `owner`, `property_manager`, `board_member`, `accountant` → `/dashboard`
   - `super_admin` → `/admin`
   - `vendor` → `/vendor/tasks`
   - `emergency_agent` → `/emergency`
   - `public` → `/` (marketplace)

**When user clicks a link:**
1. Check if route requires authentication
2. Check if user has required role
3. If authorized, navigate
4. If not authenticated, redirect to login
5. If not authorized, show unauthorized page

---

# PART 7: BUSINESS LOGIC RULES

## 7.1 Bidding System Logic

**Rules:**
1. **Bid Placement:**
   - User must be authenticated
   - User must have O'Key score ≥ unit's minimum score requirement
   - Bid amount must be ≥ unit's monthly rent
   - Bid amount must be > current highest bid (if any)
   - User can only have one active bid per unit
   - User can edit/withdraw bid before it's accepted

2. **Auto-Bid Logic:**
   - If enabled, system automatically increases user's bid when outbid
   - Auto-bid up to user's specified maximum
   - Increment: $50 above competing bid
   - Stop when max is reached

3. **Bid Acceptance:**
   - Only property owner/manager can accept bids
   - Accepting a bid automatically rejects all other bids
   - Accepting creates a draft lease
   - Unit status changes to "reserved"

4. **Bid Expiration:**
   - Bids can have expiration dates
   - Expired bids automatically change status to "expired"
   - Cron job checks for expired bids daily

**Implementation:**
```typescript
// File: /src/lib/api/bids.ts
async function placeBid(data: {
  unitId: string;
  bidAmount: number;
  message?: string;
  autoBidEnabled?: boolean;
  maxAutoBid?: number;
}) {
  // 1. Get current user and O'Key score
  const { user } = await authService.getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  // 2. Get unit and check minimum score
  const unit = await unitsService.getUnitById(data.unitId);
  if (user.okey_score < (unit.minimum_okey_score || 0)) {
    throw new Error('Your O'Key score does not meet the minimum requirement');
  }

  // 3. Check bid amount is valid
  if (data.bidAmount < unit.monthly_rent) {
    throw new Error('Bid must be at least the monthly rent');
  }

  // 4. Get current highest bid
  const existingBids = await this.getUnitBids(data.unitId);
  const highestBid = existingBids[0]; // Sorted by amount desc

  if (highestBid && data.bidAmount <= highestBid.bid_amount) {
    throw new Error('Bid must be higher than current highest bid');
  }

  // 5. Check if user already has active bid
  const userBid = existingBids.find(b => b.bidder_id === user.id && b.status === 'active');

  if (userBid) {
    // Update existing bid
    return this.updateBid(userBid.id, {
      bid_amount: data.bidAmount,
      message: data.message,
      auto_bid_enabled: data.autoBidEnabled,
      max_auto_bid: data.maxAutoBid,
    });
  } else {
    // Create new bid
    return handleSupabaseError(
      supabase
        .from('bids')
        .insert({
          unit_id: data.unitId,
          bidder_id: user.id,
          bid_amount: data.bidAmount,
          message: data.message,
          auto_bid_enabled: data.autoBidEnabled || false,
          max_auto_bid: data.maxAutoBid,
          status: 'active',
        })
        .select()
        .single()
    );
  }
}
```

## 7.2 O'Key Score Calculation

**Score Components (Total: 100 points)**
1. **Credit Score (35 points):**
   - Excellent (750+): 35 points
   - Good (700-749): 28 points
   - Fair (650-699): 21 points
   - Poor (<650): 14 points

2. **Rental History (30 points):**
   - No evictions + positive references: 30 points
   - No evictions + mixed references: 22 points
   - Previous eviction >5 years ago: 15 points
   - Recent eviction: 0 points

3. **Income Verification (20 points):**
   - Income ≥ 3x rent: 20 points
   - Income ≥ 2.5x rent: 15 points
   - Income ≥ 2x rent: 10 points
   - Income < 2x rent: 5 points

4. **References (10 points):**
   - 3+ excellent references: 10 points
   - 2 good references: 7 points
   - 1 reference: 4 points
   - No references: 0 points

5. **Background Check (5 points):**
   - Clean record: 5 points
   - Minor issues: 3 points
   - Major issues: 0 points

**Implementation:**
```typescript
async function calculateOKeyScore(userId: string): Promise<number> {
  // Fetch user's verification data
  const verification = await getUserVerification(userId);

  let score = 0;

  // Credit score component (35 points)
  const creditScore = verification.credit_score;
  if (creditScore >= 750) score += 35;
  else if (creditScore >= 700) score += 28;
  else if (creditScore >= 650) score += 21;
  else score += 14;

  // Rental history component (30 points)
  if (verification.evictions === 0) {
    if (verification.positive_references >= 2) score += 30;
    else score += 22;
  } else {
    const yearsSinceEviction = (Date.now() - verification.last_eviction_date) / (365 * 24 * 60 * 60 * 1000);
    if (yearsSinceEviction > 5) score += 15;
  }

  // Income component (20 points)
  const incomeRatio = verification.monthly_income / verification.desired_rent;
  if (incomeRatio >= 3) score += 20;
  else if (incomeRatio >= 2.5) score += 15;
  else if (incomeRatio >= 2) score += 10;
  else score += 5;

  // References component (10 points)
  const refCount = verification.reference_count;
  if (refCount >= 3) score += 10;
  else if (refCount >= 2) score += 7;
  else if (refCount >= 1) score += 4;

  // Background check component (5 points)
  if (verification.background_check_clean) score += 5;
  else if (verification.background_check_minor_issues) score += 3;

  return Math.min(score, 100); // Cap at 100
}
```

## 7.3 Payment Processing Flow

**Stripe Integration Steps:**

1. **Setup:**
   - User adds payment method (card or bank account)
   - Stripe creates PaymentMethod
   - Store `stripe_payment_method_id` in user profile

2. **One-Time Payment:**
   ```typescript
   async function processPayment(data: {
     amount: number;
     paymentMethodId: string;
     billId?: string;
   }) {
     // 1. Create Stripe Payment Intent
     const paymentIntent = await stripe.paymentIntents.create({
       amount: Math.round(data.amount * 100), // Convert to cents
       currency: 'cad',
       payment_method: data.paymentMethodId,
       confirm: true,
       metadata: {
         bill_id: data.billId || '',
         user_id: currentUser.id,
       },
     });

     // 2. Create transaction record
     const transaction = await supabase
       .from('transactions')
       .insert({
         user_id: currentUser.id,
         type: 'rent_payment',
         amount: data.amount,
         status: 'pending',
         stripe_payment_intent_id: paymentIntent.id,
       })
       .select()
       .single();

     // 3. Wait for Stripe webhook to confirm
     // Webhook updates transaction.status to 'completed'

     return transaction;
   }
   ```

3. **Recurring Payment (Auto-Pay):**
   - Create Stripe Subscription for monthly rent
   - Store `stripe_subscription_id` in lease record
   - Stripe automatically charges on billing date
   - Webhook creates transaction record on each charge

4. **Webhook Handling:**
   ```typescript
   // Stripe webhook endpoint (Supabase Edge Function)
   async function handleStripeWebhook(event: Stripe.Event) {
     switch (event.type) {
       case 'payment_intent.succeeded':
         // Update transaction status to 'completed'
         await supabase
           .from('transactions')
           .update({ status: 'completed', paid_date: new Date() })
           .eq('stripe_payment_intent_id', event.data.object.id);

         // Update bill status
         const metadata = event.data.object.metadata;
         if (metadata.bill_id) {
           await markBillAsPaid(metadata.bill_id);
         }

         // Send notification
         await sendPaymentSuccessNotification(metadata.user_id);
         break;

       case 'payment_intent.payment_failed':
         // Update transaction status to 'failed'
         // Send notification to user
         break;
     }
   }
   ```

## 7.4 Late Fee Calculation

**Logic:**
- Late fees applied automatically by cron job (daily at 12:00 AM)
- Grace period: configurable per property (default 5 days)
- Late fee amount: configurable (fixed or percentage)
- Maximum late fee: configurable cap

**Implementation:**
```typescript
async function applyLateFees() {
  // Run daily cron job
  const today = new Date();

  // Get all unpaid bills past grace period
  const overdueBills = await supabase
    .from('bills')
    .select('*, unit:units(property:properties(late_fee_config))')
    .eq('status', 'unpaid')
    .lt('due_date', today);

  for (const bill of overdueBills) {
    const config = bill.unit.property.late_fee_config;
    const daysLate = Math.floor((today - new Date(bill.due_date)) / (24 * 60 * 60 * 1000));

    // Check if past grace period
    if (daysLate <= config.grace_period_days) continue;

    // Check if late fee already applied
    const existingLateFee = await supabase
      .from('bills')
      .select('id')
      .eq('unit_id', bill.unit_id)
      .eq('category', 'late_fee')
      .eq('description', `Late fee for bill #${bill.id}`)
      .single();

    if (existingLateFee) continue; // Already applied

    // Calculate late fee
    let lateFee = 0;
    if (config.type === 'fixed') {
      lateFee = config.amount;
    } else if (config.type === 'percentage') {
      lateFee = bill.amount * (config.percentage / 100);
    }

    // Apply maximum cap
    if (config.max_late_fee && lateFee > config.max_late_fee) {
      lateFee = config.max_late_fee;
    }

    // Create late fee bill
    await supabase
      .from('bills')
      .insert({
        unit_id: bill.unit_id,
        tenant_id: bill.tenant_id,
        amount: lateFee,
        due_date: today,
        description: `Late fee for bill #${bill.id}`,
        category: 'late_fee',
        status: 'unpaid',
      });

    // Send notification
    await sendLateFeeNotification(bill.tenant_id, lateFee);
  }
}
```

---

# PART 8: REAL-TIME FEATURES

## 8.1 Real-Time Messaging

**Supabase Real-time Subscription:**

```typescript
// File: /src/features/communication/MessagesPage.tsx

function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    loadConversations();

    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=in.(${conversations.map(c => c.id).join(',')})`,
        },
        (payload) => {
          // New message received
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);

          // Show notification if not from current user
          if (newMessage.sender_id !== currentUser.id) {
            showNotification(`New message from ${newMessage.sender_name}`);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [conversations]);

  // ... rest of component
}
```

## 8.2 Real-Time Notifications

```typescript
// Subscribe to user's notifications
useEffect(() => {
  if (!user) return;

  const subscription = supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      },
      (payload) => {
        const notification = payload.new;

        // Add to notifications list
        addNotification(notification);

        // Show toast
        toast.info(notification.title, {
          description: notification.message,
          action: notification.action_url ? {
            label: 'View',
            onClick: () => navigate(notification.action_url),
          } : undefined,
        });

        // Play sound (optional)
        playNotificationSound();
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, [user]);
```

## 8.3 Real-Time Bid Updates

```typescript
// On unit detail page, subscribe to new bids
useEffect(() => {
  if (!unitId) return;

  const subscription = supabase
    .channel('bids')
    .on(
      'postgres_changes',
      {
        event: '*', // INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'bids',
        filter: `unit_id=eq.${unitId}`,
      },
      (payload) => {
        if (payload.eventType === 'INSERT') {
          // New bid placed
          const newBid = payload.new;
          setBids(prev => [newBid, ...prev].sort((a, b) => b.bid_amount - a.bid_amount));

          // Show alert if current user was outbid
          if (currentUser?.id !== newBid.bidder_id) {
            const userBid = bids.find(b => b.bidder_id === currentUser?.id);
            if (userBid) {
              toast.warning('You have been outbid!', {
                description: `New highest bid: $${newBid.bid_amount}`,
              });
            }
          }
        } else if (payload.eventType === 'UPDATE') {
          // Bid updated
          setBids(prev =>
            prev.map(b => (b.id === payload.new.id ? payload.new : b))
          );
        } else if (payload.eventType === 'DELETE') {
          // Bid withdrawn
          setBids(prev => prev.filter(b => b.id !== payload.old.id));
        }
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, [unitId, currentUser]);
```

---

# PART 9: FILE UPLOAD & STORAGE

## 9.1 Supabase Storage Configuration

**Buckets:**
- `documents` - Leases, invoices, receipts, legal documents
- `photos` - Property photos, unit photos, inspection photos
- `avatars` - User profile pictures
- `attachments` - Email attachments, message attachments

**Storage Policies:**
```sql
-- Documents bucket: Users can upload, view own documents, property staff can view property documents
documents:
  INSERT: authenticated
  SELECT: uploader_id = auth.uid() OR has_property_access(file_metadata.property_id)
  UPDATE: uploader_id = auth.uid() OR has_permission('edit_any_document')
  DELETE: uploader_id = auth.uid() OR has_permission('delete_any_document')

-- Photos bucket: Public read for property photos, authenticated upload
photos:
  INSERT: authenticated
  SELECT: true (public)
  DELETE: uploader_id = auth.uid() OR has_property_access(file_metadata.property_id)

-- Avatars bucket: Public read, owner update
avatars:
  INSERT: authenticated
  SELECT: true (public)
  UPDATE: user_id = auth.uid()
  DELETE: user_id = auth.uid()
```

## 9.2 File Upload Implementation

```typescript
// File: /src/lib/api/storage.ts

export const storageService = {
  /**
   * Upload file to storage bucket
   */
  async uploadFile(
    bucket: 'documents' | 'photos' | 'avatars' | 'attachments',
    file: File,
    options?: {
      folder?: string;
      onProgress?: (progress: number) => void;
    }
  ): Promise<string> {
    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomId}.${extension}`;

    const filePath = options?.folder
      ? `${options.folder}/${fileName}`
      : fileName;

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },

  /**
   * Delete file from storage
   */
  async deleteFile(bucket: string, filePath: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) throw error;
  },

  /**
   * Get file URL
   */
  getFileUrl(bucket: string, filePath: string): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  /**
   * Download file
   */
  async downloadFile(bucket: string, filePath: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(filePath);

    if (error) throw error;

    // Create download link
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filePath.split('/').pop() || 'download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
```

## 9.3 Image Upload with Preview

```typescript
// Component: ImageUpload
function ImageUpload({ onUpload, maxSize = 5 * 1024 * 1024 }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      toast.error(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    try {
      setUploading(true);
      const url = await storageService.uploadFile('photos', file);
      onUpload(url);
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload" className="cursor-pointer">
        {preview ? (
          <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded" />
        ) : (
          <div className="w-32 h-32 border-2 border-dashed rounded flex items-center justify-center">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </label>
      {uploading && <span>Uploading...</span>}
    </div>
  );
}
```

---

# PART 10: IMPLEMENTATION PHASES

## Phase 1: Foundation & Infrastructure (Current Phase)

### Tasks for Builder Agent:

**1.1 Supabase Setup**
- Create Supabase project
- Configure environment variables in `.env.local`
- Install Supabase client: `npm install @supabase/supabase-js`

**1.2 Database Schema Implementation**
- Create all tables according to schema in Part 2.1
- Implement RLS policies from Part 2.2
- Create database functions from Part 2.3
- Generate TypeScript types: `npx supabase gen types typescript`

**1.3 API Service Layer**
- Implement `/src/lib/api/client.ts` (Part 3.1)
- Implement `/src/lib/api/auth.ts` (Part 3.2)
- Implement `/src/lib/api/properties.ts` (Part 3.3)
- Implement `/src/lib/api/units.ts` (Part 3.4)
- Create remaining service files (residents, leases, bids, finances, etc.)

**1.4 Authentication**
- Update `/src/context/AuthContext.tsx` to use real Supabase auth (Part 4.1)
- Implement protected routes (Part 6.2, 6.3)
- Update login page to use real authentication
- Add signup flow
- Add password reset flow

**1.5 Routing**
- Install React Router: `npm install react-router-dom`
- Implement routing structure from Part 6.1
- Create ProtectedRoute component
- Create RoleRoute component

**1.6 Storage Setup**
- Create storage buckets in Supabase
- Configure storage policies
- Implement `storageService` (Part 9.2)

---

## NEXT STEPS FOR BUILDER AGENT

I (Logic Agent) will provide detailed specifications for Builder to implement Phase 1 tasks step-by-step.

**Current Priority: Phase 1.1 - Supabase Setup**

Would you like me to provide the detailed implementation instructions for Builder Agent to start with Supabase setup?

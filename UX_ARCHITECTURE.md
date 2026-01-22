# O'KEY PLATFORM - UX ARCHITECTURE
**Research-Backed UX Design & Information Architecture**

---

## E) INFORMATION ARCHITECTURE

### Content Model

**Core Entities:**

1. **User**
   - Roles: super_admin, property_manager, board_member, accountant, owner, tenant, vendor, emergency_agent, public
   - Attributes: id, email, password, name, phone, role, o_key_score (for tenants), created_at

2. **Property**
   - Attributes: id, name, address, type, year_built, total_units, owner_id, manager_id, amenities, photos

3. **Unit**
   - Attributes: id, property_id, unit_number, bedrooms, bathrooms, sq_ft, rent, status, minimum_okey_score

4. **Lease**
   - Attributes: id, unit_id, tenant_id, start_date, end_date, rent_amount, security_deposit, status

5. **Bid**
   - Attributes: id, unit_id, bidder_id, amount, status, created_at, lease_term

6. **Transaction**
   - Attributes: id, type, amount, date, user_id, property_id, category, status, description

7. **Bill**
   - Attributes: id, tenant_id, amount, due_date, status, type, description

8. **Issue** (Maintenance Request)
   - Attributes: id, property_id, unit_id, reporter_id, title, description, category, priority, status, assigned_to

9. **Document**
   - Attributes: id, filename, category, property_id, uploaded_by, uploaded_at, shared_with, file_size

10. **Meeting**
    - Attributes: id, property_id, title, type, date, location, agenda, attendees

11. **Vote**
    - Attributes: id, meeting_id, title, description, type, deadline, results

12. **Conversation**
    - Attributes: id, participants, last_message, unread_count

13. **Message**
    - Attributes: id, conversation_id, sender_id, content, timestamp, read

14. **Notification**
    - Attributes: id, user_id, type, title, description, read, created_at, action_url

**Relationships:**
- Property → Owner (one-to-many)
- Property → Units (one-to-many)
- Unit → Leases (one-to-many)
- Lease → Tenant (many-to-one)
- Unit → Bids (one-to-many)
- Bid → Bidder (many-to-one)
- Property → Issues (one-to-many)
- Issue → Reporter/Assigned (many-to-one)
- Property → Documents (one-to-many)
- Property → Meetings (one-to-many)
- Meeting → Votes (one-to-many)
- User → Notifications (one-to-many)
- User → Messages (many-to-many through Conversations)

**Source:** Information architecture best practices from [Insivia IA Guide](https://www.insivia.com/build-information-architecture/) and [Toptal IA Guide](https://www.toptal.com/designers/ia/guide-to-information-architecture)

### Sitemap

```
O'Key Platform
├── Public Routes (no auth)
│   ├── / (Marketplace Home)
│   ├── /properties (Property Search)
│   ├── /properties/:id (Property Detail)
│   ├── /units/:id (Unit Detail)
│   └── /login (Login Page)
│
├── Tenant Routes (auth required, role: tenant)
│   ├── /tenant (Dashboard)
│   ├── /tenant/payments (Payments)
│   ├── /tenant/maintenance (Maintenance Requests)
│   ├── /tenant/documents (Documents)
│   ├── /tenant/messages (Messages)
│   ├── /tenant/profile (Profile & Settings)
│   └── /tenant/bids (My Bids)
│
├── Owner Routes (auth required, role: owner or property_manager)
│   ├── /dashboard (Owner Dashboard)
│   ├── /properties (Properties Management)
│   ├── /properties/:id (Property Details)
│   ├── /properties/:id/units (Units Management)
│   ├── /finances (Financial Management)
│   ├── /finances/reports (Financial Reports)
│   ├── /residents (Resident Management)
│   ├── /residents/:id (Resident Profile)
│   ├── /maintenance (Maintenance Management)
│   ├── /maintenance/scheduled (Scheduled Maintenance)
│   ├── /documents (Document Management)
│   ├── /meetings (Meetings & Governance)
│   ├── /analytics (Portfolio Analytics)
│   ├── /vendors (Vendor Management)
│   ├── /calendar (Calendar)
│   ├── /tasks (Task Management)
│   └── /settings (Settings)
│
├── Shared Protected Routes (auth required, any role)
│   ├── /help (Help Center)
│   ├── /notifications (All Notifications)
│   └── /search (Global Search Results)
│
└── Error Routes
    ├── /404 (Not Found)
    └── /403 (Access Denied)
```

**Navigation Hierarchy Rationale:**

Based on research from [SaaS Navigation Best Practices](https://www.pencilandpaper.io/articles/ux-pattern-analysis-navigation), we use **object-oriented navigation** because O'Key handles complex, diverse use cases. This approach organizes content under noun-only categories (Properties, Residents, Finances) which is ideal for property management complexity.

**Source:** [Pencil & Paper UX Navigation Analysis](https://www.pencilandpaper.io/articles/ux-pattern-analysis-navigation)

### Navigation Structure

**Top-Level Navigation (Based on Role):**

**Public User:**
- Browse Properties
- How It Works
- Login / Sign Up

**Tenant:**
- Dashboard (home icon)
- Payments (dollar icon)
- Maintenance (wrench icon)
- Documents (file icon)
- Messages (chat icon)
- Profile (user icon)

**Owner:**
- Dashboard (home icon)
- Properties (building icon)
- Finances (chart icon)
- Residents (users icon)
- Maintenance (wrench icon)
- Documents (file icon)
- Meetings (calendar icon)
- More (hamburger menu)
  - Analytics
  - Vendors
  - Calendar
  - Tasks
  - Settings

**Navigation Patterns:**

1. **Primary Navigation:**
   - **Desktop:** Sidebar (left, collapsible)
   - **Tablet:** Sidebar (collapsible to icons only)
   - **Mobile:** Bottom tab bar (5 items) + More menu

2. **Secondary Navigation:**
   - **Breadcrumbs:** Always visible on pages (Home > Properties > Maple Heights)
   - **Tabs:** For different views within a page (All / Active / Completed)
   - **Dropdown menus:** For property selection, filters

3. **Utility Navigation:**
   - **Header (right side):**
     - Search (Cmd+K trigger)
     - Notifications (bell icon with badge)
     - Messages (chat icon with badge)
     - Help (question icon)
     - User menu (avatar dropdown)

**Wayfinding Features:**
- Breadcrumbs on all pages (except dashboard)
- Active state highlighting in navigation
- Page titles (large, consistent)
- Back buttons on detail pages
- Progress indicators (multi-step forms)

**Source:** Best practices from [Abby Covert IA for Navigation](https://abbycovert.com/writing/information-architecture-for-navigation/)

---

## F) SCREEN / VIEW INVENTORY

**Total Screens:** 45+ unique screens/views

### Public Screens (5)
1. **Marketplace Home** - `/`
   - Purpose: Landing page, property discovery, conversion
   - Entry: Direct URL, marketing links
   - Exit: Property search, Login, Property detail
   - Dependencies: None (public)

2. **Property Search** - `/properties`
   - Purpose: Search and filter properties
   - Entry: Marketplace home, Header navigation
   - Exit: Property detail, Unit detail
   - Dependencies: None (public)

3. **Property Detail** - `/properties/:id`
   - Purpose: View property information, see available units
   - Entry: Property search, Saved properties
   - Exit: Unit detail, Login (to bid), Property search
   - Dependencies: Property ID

4. **Unit Detail** - `/units/:id`
   - Purpose: View unit specs, place bid
   - Entry: Property detail, Search results
   - Exit: Login (if not authenticated), My Bids (after bid)
   - Dependencies: Unit ID, optional: User authentication for bidding

5. **Login Page** - `/login`
   - Purpose: User authentication
   - Entry: Any protected route redirect, Header CTA
   - Exit: Dashboard (role-based redirect)
   - Dependencies: None

### Tenant Screens (7)
6. **Tenant Dashboard** - `/tenant`
   - Purpose: Overview of tenant's account, quick actions
   - Entry: Login redirect, Header home link
   - Exit: Any tenant page via quick actions
   - Dependencies: User authentication (tenant role)

7. **Tenant Payments** - `/tenant/payments`
   - Purpose: View bills, make payments, manage auto-pay
   - Entry: Dashboard quick action, Navigation menu
   - Exit: Dashboard, Payment confirmation
   - Dependencies: Tenant user, Bills data

8. **Tenant Maintenance** - `/tenant/maintenance`
   - Purpose: Submit and track maintenance requests
   - Entry: Dashboard quick action, Navigation menu
   - Exit: Request detail modal, Dashboard
   - Dependencies: Tenant user, Issues data

9. **Tenant Documents** - `/tenant/documents`
   - Purpose: Access lease, receipts, building documents
   - Entry: Dashboard quick action, Navigation menu
   - Exit: Document preview, Dashboard
   - Dependencies: Tenant user, Documents data

10. **Tenant Messages** - `/tenant/messages`
    - Purpose: Communicate with property management
    - Entry: Navigation menu, Notification click
    - Exit: Dashboard
    - Dependencies: Tenant user, Conversations data

11. **Tenant Profile** - `/tenant/profile`
    - Purpose: Manage personal info, preferences, settings
    - Entry: User menu, Navigation menu
    - Exit: Dashboard
    - Dependencies: Tenant user

12. **My Bids** - `/tenant/bids`
    - Purpose: Manage all bids (active, won, lost)
    - Entry: Dashboard, Marketplace
    - Exit: Unit detail (to view unit), Dashboard
    - Dependencies: Tenant user, Bids data

### Owner Screens (20)
13. **Owner Dashboard** - `/dashboard`
    - Purpose: Portfolio overview, key metrics, alerts
    - Entry: Login redirect (owner), Header home link
    - Exit: Any owner page
    - Dependencies: Owner user, Properties data

14. **Properties List** - `/properties`
    - Purpose: View all properties, add new
    - Entry: Dashboard, Navigation menu
    - Exit: Property detail, Add property modal
    - Dependencies: Owner user

15. **Property Detail** - `/properties/:id`
    - Purpose: Manage specific property
    - Entry: Properties list, Dashboard
    - Exit: Units management, Finances (filtered), Documents (filtered)
    - Dependencies: Owner user, Property ID (owned by user)

16. **Units Management** - `/properties/:id/units`
    - Purpose: Manage units for a property
    - Entry: Property detail
    - Exit: Unit detail, Add unit modal
    - Dependencies: Owner user, Property ID

17. **Finances Overview** - `/finances`
    - Purpose: Financial management, transactions, reports
    - Entry: Dashboard, Navigation menu
    - Exit: Financial report modal, Transaction detail
    - Dependencies: Owner user, Transactions data

18. **Financial Reports** - `/finances/reports`
    - Purpose: Generate P&L, Cash Flow, Tax reports
    - Entry: Finances overview
    - Exit: Finances overview, Download report
    - Dependencies: Owner user, Transactions data

19. **Residents List** - `/residents`
    - Purpose: View all tenants, manage leases
    - Entry: Dashboard, Navigation menu
    - Exit: Resident profile, Add tenant modal
    - Dependencies: Owner user, Leases data

20. **Resident Profile** - `/residents/:id`
    - Purpose: View tenant details, payment history, communication
    - Entry: Residents list
    - Exit: Residents list, Lease document, Messages
    - Dependencies: Owner user, Tenant ID (in owned property)

21. **Maintenance List** - `/maintenance`
    - Purpose: View and manage all maintenance requests
    - Entry: Dashboard, Navigation menu
    - Exit: Request detail modal, Assign modal
    - Dependencies: Owner user, Issues data

22. **Scheduled Maintenance** - `/maintenance/scheduled`
    - Purpose: Preventive maintenance calendar
    - Entry: Maintenance list
    - Exit: Schedule task modal
    - Dependencies: Owner user

23. **Documents** - `/documents`
    - Purpose: Manage property documents, share with tenants
    - Entry: Navigation menu, Property detail
    - Exit: Document preview, Upload modal, Share modal
    - Dependencies: Owner user, Documents data

24. **Meetings** - `/meetings`
    - Purpose: Schedule meetings, manage votes
    - Entry: Navigation menu, Dashboard alert
    - Exit: Meeting detail, Voting modal
    - Dependencies: Owner user (condo properties)

25. **Portfolio Analytics** - `/analytics`
    - Purpose: Multi-property analytics, benchmarking
    - Entry: Navigation (More menu)
    - Exit: Property detail, Financial reports
    - Dependencies: Owner user (multiple properties)

26. **Vendor Management** - `/vendors`
    - Purpose: Manage vendor directory, work assignments
    - Entry: Navigation (More menu), Maintenance assignment
    - Exit: Vendor profile, Assign work
    - Dependencies: Owner user

27. **Calendar** - `/calendar`
    - Purpose: Unified calendar (rent, maintenance, meetings, inspections)
    - Entry: Navigation (More menu)
    - Exit: Event detail (varies by type)
    - Dependencies: Owner user

28. **Tasks** - `/tasks`
    - Purpose: Task management for property managers
    - Entry: Navigation (More menu)
    - Exit: Task detail, Create task
    - Dependencies: Property manager user

29. **Owner Settings** - `/settings`
    - Purpose: Account settings, preferences, billing
    - Entry: User menu, Navigation (More menu)
    - Exit: Dashboard
    - Dependencies: Owner user

30-32. **Additional Owner Screens:**
    - Move-In/Out Checklists
    - Lease Builder
    - Tax Documents Generator
    - Tenant Screening
    - Utility Management
    - Parking/Amenities
    - Emergency Protocols

### Shared Screens (5)
33. **Help Center** - `/help`
    - Purpose: Access help articles, contact support
    - Entry: Header help icon, Footer link
    - Exit: Article detail, Submit ticket modal
    - Dependencies: Any authenticated user

34. **All Notifications** - `/notifications`
    - Purpose: View all notifications (not just recent)
    - Entry: Notifications panel "View All"
    - Exit: Notification action URL
    - Dependencies: Authenticated user

35. **Global Search Results** - `/search`
    - Purpose: Display search results (fallback if not using command palette)
    - Entry: Header search submit
    - Exit: Result destination
    - Dependencies: Authenticated user

36. **404 Not Found** - `/404` or `*`
    - Purpose: Handle invalid routes
    - Entry: Any invalid URL
    - Exit: Dashboard, Homepage
    - Dependencies: None

37. **Access Denied** - `/403`
    - Purpose: Handle unauthorized access attempts
    - Entry: Protected route with insufficient permissions
    - Exit: Dashboard (appropriate for role)
    - Dependencies: Authenticated user (wrong role)

**Screen Dependencies Matrix:**

| Screen | Auth Required | Roles Allowed | Data Dependencies |
|--------|---------------|---------------|-------------------|
| Marketplace Home | No | All | Properties (limited) |
| Property Search | No | All | Properties, Units |
| Property Detail | No | All | Property, Units |
| Unit Detail | No (Yes for bidding) | All (Tenant for bid) | Unit, Bids |
| Login | No | None | None |
| Tenant Dashboard | Yes | Tenant | User, Lease, Bills, Issues |
| Tenant Payments | Yes | Tenant | User, Bills, Transactions |
| Tenant Maintenance | Yes | Tenant | User, Issues |
| Tenant Documents | Yes | Tenant | User, Documents |
| Tenant Messages | Yes | Tenant | User, Conversations, Messages |
| Tenant Profile | Yes | Tenant | User, Lease |
| My Bids | Yes | Tenant | User, Bids |
| Owner Dashboard | Yes | Owner, PM | User, Properties, Transactions, Issues |
| Properties List | Yes | Owner, PM | User, Properties |
| Finances | Yes | Owner, PM | User, Properties, Transactions |
| Residents | Yes | Owner, PM | User, Properties, Leases, Tenants |
| Maintenance | Yes | Owner, PM | User, Properties, Issues |
| Documents | Yes | Owner, PM | User, Properties, Documents |
| Meetings | Yes | Owner, PM | User, Properties, Meetings, Votes |
| Settings | Yes | Any | User |
| Help Center | Optional | Any | Help content |

---

## G) USER FLOWS

### Critical User Flows (Top 10)

**Flow 1: Property Discovery to Bid Placement**

**Happy Path:**
1. User lands on Marketplace Home
2. Browses featured properties OR clicks "Search Properties"
3. On Property Search page, applies filters (location, price, bedrooms)
4. Views property cards in grid
5. Clicks property card → navigates to Property Detail
6. Views property images, description, amenities
7. Scrolls to "Available Units" section
8. Clicks "View Unit" on desired unit → navigates to Unit Detail
9. Reviews unit specs, photos, rent price
10. Sees O'Key Score requirement (e.g., "Minimum 650")
11. Checks if logged in:
    - If NOT logged in → "Login to Place Bid" button → navigate to Login
    - If logged in → "Place Bid" button enabled
12. Clicks "Place Bid" → modal opens
13. Enters bid amount (validates >= minimum, > current high bid)
14. Selects lease term (6 months, 1 year, 2 years)
15. Selects move-in date
16. Optionally adds message to landlord
17. Clicks "Submit Bid"
18. System validates O'Key Score (user score >= unit requirement)
19. Bid created, modal shows success message
20. Redirects to /tenant/bids
21. Sees new bid in "Active Bids" tab with status "Leading" or "Outbid"

**Alternate Paths:**
- **User not logged in at step 11:**
  - Clicks "Login to Place Bid" → Login page
  - After login → redirects back to Unit Detail page
  - Continues from step 12

- **User's O'Key Score too low at step 18:**
  - Error modal: "Your O'Key Score (620) is below the minimum (650)"
  - Displays score improvement tips
  - Bid not created
  - User remains on Unit Detail page

- **Bid amount too low at step 13:**
  - Inline error: "Bid must be at least $1500"
  - User corrects amount
  - Continues from step 14

- **User outbid after submission:**
  - Notification: "You've been outbid on [Unit]"
  - Email alert sent
  - Bid status changes to "Outbid" in My Bids
  - User can update bid

**Edge Cases:**
- Unit becomes unavailable while user placing bid → Error: "This unit is no longer available"
- Auction ends during bid placement → Error: "Auction has ended"
- Network error during submission → Error with retry option
- User already has active bid on this unit → Update existing bid instead of create

**Source:** User flow best practices from [Property Management UX Guide](https://rentingwell.com/2025/05/25/top-property-management-software-for-ux-in-2025/)

---

**Flow 2: Tenant Makes Rent Payment**

**Happy Path:**
1. Tenant logs in → redirected to Tenant Dashboard
2. Sees "Next Rent Payment" card showing amount due
3. Clicks "Make a Payment" quick action → navigates to /tenant/payments
4. Sees "Outstanding Balance" card with total due ($1500)
5. Reviews breakdown (Rent: $1400, Late Fee: $100)
6. Clicks "Pay Now" button → PaymentProcessor modal opens
7. Modal pre-fills amount ($1500)
8. Selects payment method (saved card ending in 4242)
9. Reviews payment details
10. Clicks "Submit Payment"
11. System processes payment (2-second loading state)
12. Success message: "Payment of $1,500 processed successfully"
13. Modal closes
14. Outstanding Balance card updates to $0
15. Payment appears in Payment History table (top row)
16. Toast notification: "Payment successful"
17. Receipt available for download

**Alternate Paths:**
- **User wants to use different payment method at step 8:**
  - Clicks "Use Different Card"
  - Enters new card details
  - Continues from step 9

- **User enables auto-pay before paying:**
  - Scrolls to Auto-Pay section
  - Toggles "Enable Auto-Pay"
  - Selects payment method
  - Selects payment schedule (5th of month)
  - Saves auto-pay settings
  - Future payments automatic

- **Partial payment:**
  - User changes amount from $1500 to $1400 (rent only)
  - Clicks "Submit Payment"
  - Only late fee ($100) remains in Outstanding Balance

**Edge Cases:**
- Payment fails (card declined) → Error message, modal stays open, retry option
- Network error → Error with retry
- No payment method saved → Prompt to add payment method
- Already paid (refreshed page) → Show "Paid" status, no Pay Now button

---

**Flow 3: Tenant Submits Maintenance Request**

**Happy Path:**
1. Tenant navigates to /tenant/maintenance
2. Sees empty state OR list of previous requests
3. Clicks "Submit New Request" button → modal opens
4. Fills out form:
   - Title: "Leaky faucet in kitchen"
   - Category: Selects "Plumbing" from dropdown
   - Priority: Selects "Medium" radio button
   - Description: "The kitchen sink faucet has been dripping continuously..."
   - Location: "Kitchen"
   - Photos: Uploads 2 photos of faucet
   - Access: "I work from home, available anytime"
5. Clicks "Submit Request"
6. System validates (all required fields filled, min characters met)
7. Loading spinner appears (2 seconds)
8. Request created with status "Pending"
9. Modal closes
10. Success toast: "Maintenance request submitted successfully"
11. Request list refreshes
12. New request appears at top with status badge "Pending"
13. Notification sent to property manager

**Alternate Paths:**
- **User exits without submitting:**
  - Clicks "Cancel" or X
  - If form has content → Confirmation: "Discard changes?"
  - If confirmed → Modal closes, no request created

- **User saves as draft (future feature):**
  - Clicks "Save as Draft"
  - Request saved with status "Draft"
  - Can continue editing later

**Edge Cases:**
- Missing required field → Inline validation error, can't submit
- Description too short (< 20 chars) → Error: "Please provide more details"
- Photo upload fails → Error message, option to retry or skip photos
- Network error during submission → Error with retry option

---

**Flow 4: Owner Adds New Property**

**Happy Path:**
1. Owner logs in → Owner Dashboard
2. Clicks "Add New Property" quick action → modal opens
3. Fills out form (12 fields):
   - Property Name: "Maple Heights Apartments"
   - Type: "Apartment"
   - Address: "123 Maple St"
   - City: "Montreal"
   - Province: "Quebec"
   - Postal Code: "H1A 1A1"
   - Year Built: 2015
   - Total Sq Ft: 25000
   - Floors: 4
   - Photo: Uploads property image
   - Description: "Modern 4-story apartment building..."
4. Clicks "Submit" button
5. System validates all fields
6. Loading spinner (2 seconds)
7. Property created with auto-generated ID
8. Added to mockProperties array
9. Owner assigned (property_owner_id = current user)
10. Modal closes
11. Success toast: "Property added successfully"
12. Navigates to Property Detail page for new property
13. Can now add units, upload documents, etc.

**Alternate Paths:**
- **User uploads multiple photos:**
  - Selects multiple files
  - All uploaded, shown as thumbnails
  - Can set primary photo

- **User cancels:**
  - Clicks "Cancel"
  - Confirmation if form has content
  - Modal closes, no property created

**Edge Cases:**
- Invalid postal code format → Validation error
- Photo too large (> 10MB) → Error message
- Duplicate property name → Warning, allow proceed or change
- Network error → Retry option

---

**Flow 5: Owner Assigns Maintenance Request**

**Happy Path:**
1. Owner navigates to /maintenance
2. Sees list of requests, filters by "Pending" tab
3. Finds unassigned request: "Leaky faucet in kitchen - Unit 204"
4. Clicks "View Details" → detail modal opens
5. Reviews request details, photos, tenant info
6. In Assignment section, clicks "Assign" button → assign modal opens
7. Selects vendor from dropdown: "Joe's Plumbing"
8. Sets priority: "Medium" (already set)
9. Sets scheduled date: Tomorrow, 10 AM
10. Enters estimated cost: $150
11. Adds note: "Please call tenant to schedule exact time"
12. Checkbox "Send notification to tenant" checked
13. Clicks "Assign Task"
14. Request updated:
    - assigned_to = "Joe's Plumbing"
    - status = "in_progress"
    - scheduled_date = tomorrow 10 AM
15. Notification sent to tenant: "Your maintenance request has been assigned..."
16. Notification sent to vendor (Joe's Plumbing)
17. Assign modal closes
18. Detail modal updates with assignment info
19. Success toast: "Maintenance request assigned to Joe's Plumbing"
20. Request moves from "Pending" to "In Progress" tab

**Alternate Paths:**
- **Emergency priority:**
  - Owner sets priority to "Emergency"
  - Auto-assigns to emergency maintenance team
  - Immediate notification with urgent flag

- **No vendor selected:**
  - Owner assigns to "Internal Maintenance Team"
  - No external notification

- **Tenant unavailable:**
  - Owner adds note about access (use lockbox, etc.)
  - Coordinates with tenant via messages

**Edge Cases:**
- Vendor declines job (future) → Notification to owner, reassign
- Cost exceeds budget → Warning, require approval
- Scheduled date in past → Validation error

---

**Flow 6: Owner Shares Document with Tenants**

**Happy Path:**
1. Owner navigates to /documents
2. Sees folder structure and document list
3. Has document "Building Rules 2026.pdf" selected
4. Clicks "Share" button → share modal opens
5. In modal, selects tab "All Tenants"
6. Sets permissions: "View + Download"
7. No expiration date
8. Enables "Send email notification"
9. Adds custom message: "Please review updated building rules"
10. Clicks "Share Document"
11. System updates document metadata:
    - shared_with_tenants = true
    - shared_with = [all tenant IDs in property]
12. Notifications created for all tenants
13. Emails sent to all tenants with link to document
14. Modal closes
15. Success toast: "Document shared with 12 tenants"
16. Document now shows "Shared" badge in list

**Alternate Paths:**
- **Share with specific tenants only:**
  - Selects "Specific Tenants" tab
  - Checkboxes for each tenant
  - Selects units 101, 102, 103
  - Only those 3 tenants get access

- **Set expiration:**
  - Sets expiration date (30 days from now)
  - After 30 days, document auto-unshares
  - Tenants notified before expiration

- **External sharing:**
  - Selects "External Recipients" tab
  - Enters email addresses
  - Generates shareable link with password
  - Sends link to external parties

**Edge Cases:**
- No tenants in property → Warning: "No tenants to share with"
- Document already shared → Option to re-share or update settings
- Email delivery fails → Retry option, shows failed recipients

---

**Flow 7: Tenant Views and Downloads Lease Document**

**Happy Path:**
1. Tenant navigates to /tenant/documents
2. Sees categorized documents list (grid view)
3. Filters by category: "Lease Documents"
4. Sees "Lease Agreement - Unit 204.pdf"
5. Clicks document card → preview modal opens
6. Modal shows:
   - PDF viewer with lease document rendered
   - Details sidebar (filename, category, size, date, uploaded by)
   - Action buttons (Download, Share, Print)
7. Tenant reviews lease terms in PDF viewer
8. Navigates pages (Page 1 of 12, Next/Previous buttons)
9. Clicks "Download" button
10. Browser alert (mock): "Downloading Lease Agreement - Unit 204.pdf..."
11. Document download tracked in activity log
12. Tenant clicks "Close" to exit modal

**Alternate Paths:**
- **Tenant wants to print:**
  - Clicks "Print" button
  - Browser print dialog opens
  - Tenant prints lease

- **Tenant searches for specific clause:**
  - Uses browser Cmd+F to search within PDF
  - Finds keyword (e.g., "pet policy")
  - Reviews relevant section

**Edge Cases:**
- PDF fails to load → Error message, Download option available
- Large file, slow to render → Loading skeleton while rendering
- Mobile view → Full-screen modal, touch-optimized controls

---

**Flow 8: Owner Generates Financial Report**

**Happy Path:**
1. Owner navigates to /finances
2. Sees financial overview, charts, transactions
3. Clicks "Generate Financial Report" quick action → report modal opens
4. Selects report type (radio): "Profit & Loss (P&L) Statement"
5. Selects time period (dropdown): "Last Year (2025)"
6. Selects properties (checkboxes): "All Properties"
7. Selects format (radio): "PDF"
8. Clicks "Generate Report"
9. System calculates:
   - Total revenue (all income transactions in 2025)
   - Total expenses (all expense transactions in 2025)
   - Net income (revenue - expenses)
   - Category breakdowns
10. Loading spinner (3 seconds)
11. Browser alert (mock): "Report generated and downloaded"
12. Modal closes
13. Success toast: "Profit & Loss report for 2025 downloaded"
14. (In real app: PDF file downloaded with formatted report)

**Alternate Paths:**
- **Cash Flow Statement:**
  - Selects "Cash Flow Statement"
  - System generates cash inflows/outflows by month
  - Shows operating, investing, financing activities

- **Tax Summary:**
  - Selects "Tax Summary"
  - System generates tax-deductible expenses
  - Categorizes by IRS categories
  - Ready for tax preparation

- **Custom date range:**
  - Selects "Custom Range"
  - Date pickers appear
  - User selects Q3 2025 (July-Sept)
  - Report generated for that period only

- **Export to Excel:**
  - Selects format "Excel"
  - Generates .xlsx file with data tables
  - Formulas preserved for further analysis

**Edge Cases:**
- No transactions in selected period → Warning: "No data for this period"
- Very large dataset → Progress bar during generation
- Generation fails → Error with retry option

---

**Flow 9: Owner Schedules Board Meeting with Voting**

**Happy Path:**
1. Owner navigates to /meetings
2. Clicks "Schedule Meeting" button → modal opens
3. Fills out meeting form:
   - Type: "Board Meeting"
   - Title: "Q1 2026 Board Meeting"
   - Date/Time: March 15, 2026, 7:00 PM
   - Duration: 90 minutes
   - Location: "Community Room" (or checks "Virtual Meeting")
   - Agenda items (adds 4):
     a. "Review Q4 2025 Financials" (15 min)
     b. "Approve 2026 Budget" (20 min)
     c. "Discuss Roof Repairs" (30 min)
     d. "Vote on Landscaping Proposal" (25 min)
   - Attendees: Selects "All board members" (5 people)
   - Attaches "2026 Budget Draft.pdf"
   - "Send Invitations" checked
4. Clicks "Schedule Meeting"
5. Meeting created with unique ID
6. Calendar invitations sent to all attendees
7. Notifications created
8. Modal closes
9. Success toast: "Meeting scheduled and invitations sent"
10. Meeting appears in "Upcoming Meetings" list
11. Attendees receive email with agenda, attached docs, RSVP link

**Creating associated vote (agenda item 4):**
1. Owner clicks into meeting detail
2. For agenda item "Vote on Landscaping Proposal", clicks "Create Vote"
3. Vote creation form:
   - Title: "Approve $15,000 Landscaping Project"
   - Description: "Proposal to upgrade front yard landscaping..."
   - Vote type: "Simple Majority"
   - Deadline: March 20, 2026 (5 days after meeting)
   - Attach: "Landscaping Proposal.pdf"
4. Clicks "Create Vote"
5. Vote created, linked to meeting
6. Vote appears in "Active Votes" panel
7. Board members can now cast votes

**Alternate Paths:**
- **Virtual meeting:**
  - Checks "Virtual Meeting"
  - Enters Zoom link
  - Link sent in invitation

- **Recurring meeting:**
  - Checks "Recurring"
  - Sets frequency: Monthly, every 3rd Wednesday
  - Creates series of meetings

**Edge Cases:**
- Scheduling conflict → Warning if attendees have conflicts
- Past date selected → Validation error
- No attendees selected → Can't schedule, validation error

---

**Flow 10: Public User Becomes Tenant**

**Complete Journey:**
1. **Discovery:** User lands on Marketplace Home via Google search
2. **Browse:** Scrolls through featured properties
3. **Search:** Clicks "Search Properties", applies filters (Montreal, 2BR, <$2000)
4. **Property Detail:** Clicks "Riverside Condos", views photos, amenities
5. **Unit Selection:** Sees Unit 304 available, clicks "View Unit"
6. **Bid Intent:** Clicks "Login to Place Bid" → redirects to Login
7. **Sign Up:** Clicks "Create Account" (not yet built, but would be here)
   - Fills registration: Email, Password, Name, Phone
   - Selects role: "I'm looking to rent" (Tenant)
   - Submits registration
   - Email verification sent
8. **Profile Setup:** Completes tenant profile:
   - Employment info
   - Current address
   - References
   - Income verification documents
9. **O'Key Score:** System calculates initial O'Key Score (based on credit check, employment, references)
10. **Return to Bidding:** Redirected back to Unit 304
11. **Place Bid:** (Flow 1 above)
12. **Bid Won:** Highest bidder, owner accepts
13. **Lease Signing:** Digital lease sent via DocuSign (future feature)
14. **Lease Signed:** Tenant signs, owner signs
15. **Account Activation:** Account changes from "Applicant" to "Active Tenant"
16. **Onboarding:** Guided tour of tenant portal features
17. **Move-In Prep:** Tenant dashboard now shows:
    - Move-in date
    - First rent payment due
    - Move-in checklist
    - Building access info
18. **Ongoing Use:** Tenant uses platform for:
    - Monthly rent payments
    - Maintenance requests
    - Document access
    - Communication with property manager

**Complete lifecycle:** Public → Applicant → Tenant → (Eventually) Former Tenant

---

**Additional Flows (Brief):**

**Flow 11:** Owner adds tenant manually (instead of via bidding)
**Flow 12:** Tenant renews lease
**Flow 13:** Owner creates move-out checklist, processes security deposit return
**Flow 14:** Owner bulk sends rent reminders to all tenants
**Flow 15:** Tenant submits emergency maintenance request (after hours)
**Flow 16:** Owner reviews and approves vendor invoice
**Flow 17:** Board member casts vote on proposal
**Flow 18:** Owner exports tax documents for year-end
**Flow 19:** Tenant sets up auto-pay
**Flow 20:** Owner creates and assigns recurring maintenance task

---

## H) UI ARCHITECTURE

### Routing Strategy

**Router:** React Router v6 (industry standard as of 2026)

**Route Organization:**

```typescript
// Route structure
<BrowserRouter>
  <Routes>
    // Public routes (no layout)
    <Route path="/login" element={<LoginPage />} />

    // Public marketplace routes (with public layout)
    <Route element={<PublicLayout />}>
      <Route path="/" element={<MarketplaceHome />} />
      <Route path="/properties" element={<PropertySearch />} />
      <Route path="/properties/:id" element={<PropertyDetail />} />
      <Route path="/units/:id" element={<UnitDetail />} />
    </Route>

    // Protected routes (auth required, with app layout)
    <Route element={<ProtectedRoute />}>
      // Tenant routes (role-based)
      <Route element={<RoleRoute allowedRoles={['tenant']} />}>
        <Route element={<TenantLayout />}>
          <Route path="/tenant" element={<TenantDashboard />} />
          <Route path="/tenant/payments" element={<TenantPayments />} />
          <Route path="/tenant/maintenance" element={<TenantMaintenance />} />
          // ... more tenant routes
        </Route>
      </Route>

      // Owner routes (role-based)
      <Route element={<RoleRoute allowedRoles={['owner', 'property_manager']} />}>
        <Route element={<OwnerLayout />}>
          <Route path="/dashboard" element={<OwnerDashboard />} />
          <Route path="/properties" element={<OwnerProperties />} />
          // ... more owner routes
        </Route>
      </Route>

      // Shared routes (any authenticated user)
      <Route element={<AppLayout />}>
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/notifications" element={<AllNotifications />} />
      </Route>
    </Route>

    // Catch-all 404
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

**Route Protection Pattern:**

```typescript
// ProtectedRoute component
function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingScreen />

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

// RoleRoute component
function RoleRoute({ allowedRoles }: { allowedRoles: Role[] }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}
```

**Code Splitting (Route-based):**

```typescript
// Lazy load route components
const TenantDashboard = lazy(() => import('./features/tenant-portal/TenantDashboard'))
const OwnerDashboard = lazy(() => import('./features/owner-portal/OwnerDashboard'))
// ... etc for all routes

// Wrap in Suspense with loading fallback
<Suspense fallback={<PageLoader />}>
  <Routes>...</Routes>
</Suspense>
```

**Source:** [React Router Code Splitting Best Practices](https://medium.com/@ignatovich.dm/optimizing-react-apps-with-code-splitting-and-lazy-loading-e8c8791006e3)

### Layout System

**Layout Hierarchy:**

1. **App Shell** (root layout)
   - Error Boundary wrapper
   - Toast notification container
   - Command palette provider
   - Theme provider

2. **PublicLayout** (for marketplace)
   - Public header (logo, search, login CTA)
   - Main content area
   - Footer

3. **TenantLayout** (for tenant portal)
   - Tenant header (logo, search, notifications, messages, user menu)
   - Optional sidebar (desktop only, can hide on mobile)
   - Main content area
   - Mobile bottom navigation (< 768px)

4. **OwnerLayout** (for owner portal)
   - Owner header (logo, property selector, search, notifications, user menu)
   - Collapsible sidebar (navigation)
   - Main content area
   - Mobile bottom navigation

5. **AppLayout** (for shared pages)
   - Generic header
   - Main content area
   - No sidebar

**Layout Components:**

```typescript
// Example: TenantLayout
function TenantLayout() {
  const { sidebarOpen } = useNavigation()

  return (
    <div className="min-h-screen flex flex-col">
      <TenantHeader />

      <div className="flex flex-1">
        {/* Sidebar (desktop only, optional) */}
        {sidebarOpen && (
          <aside className="hidden md:block w-64 border-r border-neutral-200">
            <TenantSidebar />
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet /> {/* Route content renders here */}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav className="md:hidden" />
    </div>
  )
}
```

### Page Templates

**Template 1: Dashboard Template**
- Used by: TenantDashboard, OwnerDashboard
- Structure:
  - Page header (welcome message, date)
  - Alert banners (conditional)
  - Metrics cards row (2-4 cards)
  - Main content grid (2-3 columns on desktop)
  - Quick actions section
  - Activity timeline

**Template 2: List Template**
- Used by: Properties, Residents, Maintenance, Documents
- Structure:
  - Page header (title, breadcrumbs, primary CTA)
  - Stats summary bar
  - Filters & search bar
  - View toggle (grid/list)
  - Content area (cards or table)
  - Pagination

**Template 3: Detail Template**
- Used by: PropertyDetail, ResidentProfile, MaintenanceDetail
- Structure:
  - Page header (back button, title, actions)
  - Hero section (image, key info)
  - Tabs (different sections of detail)
  - Tab content area
  - Related items sidebar

**Template 4: Form Template**
- Used by: Modals, Settings pages
- Structure:
  - Form header (title, description)
  - Form sections (grouped fields)
  - Field layout (labels, inputs, validation errors)
  - Form actions (cancel, save)

### Responsive Breakpoints

**Based on research:** [Advanced Vite Guide](https://codeparrot.ai/blogs/advanced-guide-to-using-vite-with-react-in-2025)

```css
/* Tailwind default breakpoints (following mobile-first) */
/* xs: 0-639px (mobile) */
/* sm: 640px-767px (large mobile) */
/* md: 768px-1023px (tablet) */
/* lg: 1024px-1279px (desktop) */
/* xl: 1280px-1535px (large desktop) */
/* 2xl: 1536px+ (ultra-wide) */
```

**Responsive Rules:**

**Mobile (< 768px):**
- Single column layouts
- Bottom tab navigation (fixed)
- Stacked cards
- Tables → Card layouts
- Filters collapse into bottom sheet
- Modals → Full screen or 95% height
- Touch targets minimum 44x44px
- No sidebar (hamburger menu instead)

**Tablet (768px - 1023px):**
- 2-column layouts where appropriate
- Sidebar can be toggled
- Tables show essential columns only
- Modals → 90% width, centered
- Touch-optimized but not required

**Desktop (1024px+):**
- Multi-column layouts (2-4 columns)
- Persistent sidebar (collapsible)
- Full tables with all columns
- Modals → Fixed width (600px-800px), centered
- Hover states
- Keyboard shortcuts displayed

### Grid System

**Using Tailwind CSS Grid:**

```css
/* Dashboard grid example */
.dashboard-grid {
  @apply grid gap-6;
  @apply grid-cols-1;           /* Mobile: 1 column */
  @apply md:grid-cols-2;         /* Tablet: 2 columns */
  @apply lg:grid-cols-3;         /* Desktop: 3 columns */
  @apply xl:grid-cols-4;         /* Large: 4 columns */
}

/* Metrics cards row */
.metrics-row {
  @apply grid gap-4;
  @apply grid-cols-2;            /* Mobile: 2x2 */
  @apply md:grid-cols-4;         /* Tablet+: 1x4 */
}

/* Content + Sidebar layout */
.content-with-sidebar {
  @apply grid gap-6;
  @apply grid-cols-1;            /* Mobile: stacked */
  @apply lg:grid-cols-[1fr_300px]; /* Desktop: content + 300px sidebar */
}
```

**Spacing Scale (Tailwind):**
- Consistent use of spacing: 2, 4, 6, 8, 12, 16, 24 (in 0.25rem increments)
- Page padding: p-6 (24px) on desktop, p-4 (16px) on mobile
- Card padding: p-6 on desktop, p-4 on mobile
- Gap between items: gap-4 (16px) default, gap-6 (24px) for larger sections

---

**Continue to COMPONENT_ARCHITECTURE.md for sections I-J...**

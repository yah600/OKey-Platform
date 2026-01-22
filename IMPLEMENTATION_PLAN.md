# O'KEY PLATFORM - COMPLETE FRONTEND IMPLEMENTATION PLAN
**Version:** 2.0 - Apple-Style Redesign
**Created:** January 22, 2026
**Status:** Research-Backed, Ready for Implementation

---

## C) PROJECT FRAMING

### Goals

**Primary Goal:**
Build a complete, production-ready frontend for O'Key Platform - a revolutionary all-in-one real estate software that eliminates the need for brokers and agents.

**Secondary Goals:**
1. Implement authentic Apple-style UI with Liquid Glass design language
2. Create intuitive, logical UX that rivals best-in-class property management software
3. Ensure WCAG 2.1 Level AA accessibility compliance
4. Achieve premium performance (Lighthouse 90+)
5. Build component architecture that is maintainable and scalable

### Non-Goals

**Explicitly NOT in scope:**
- ❌ Backend development (Supabase, databases, APIs)
- ❌ Real payment processing (Stripe integration)
- ❌ Real authentication (mock only)
- ❌ Real-time features (WebSockets)
- ❌ Email/SMS services
- ❌ File storage infrastructure
- ❌ Server-side rendering (SSR)
- ❌ Mobile native apps (iOS/Android)
- ❌ Deployment to production servers
- ❌ Custom premium UI components from scratch

### Constraints

**Technical Constraints:**
- **Frontend-only:** All data from mock files, no backend calls
- **Vite-based:** Must use Vite 6.3.5 (no other build tools)
- **No premium libraries:** Only open-source, free components
- **Modern browsers:** Chrome, Safari, Firefox, Edge (last 2 versions)
- **TypeScript strict mode:** All code must be type-safe
- **No shadcn/ui:** Current implementation to be replaced entirely

**Design Constraints:**
- **Apple HIG compliance:** Follow Apple Human Interface Guidelines
- **Liquid Glass aesthetic:** Translucency, blur effects, depth
- **Responsive:** Mobile (375px+), Tablet (768px+), Desktop (1024px+)
- **Accessibility:** WCAG 2.1 Level AA minimum
- **Motion design:** Physics-based, intentional animations

**Performance Constraints:**
- **Bundle size:** < 2MB total (optimized)
- **Initial load:** < 3 seconds on 3G
- **Lighthouse score:** 90+ (Performance, Accessibility, Best Practices)
- **Core Web Vitals:** LCP < 2.5s, FID < 100ms, CLS < 0.1

### Target Users

**Primary User Personas:**

1. **Property Tenant (Sarah)**
   - Age: 28, Marketing Professional
   - Tech-savvy, expects modern UI
   - Needs: Easy rent payment, quick maintenance requests, document access
   - Pain points: Slow landlord responses, complicated payment processes

2. **Property Owner (Michael)**
   - Age: 45, Real Estate Investor
   - Owns 5 properties (12 units total)
   - Needs: Financial overview, tenant management, maintenance tracking
   - Pain points: Using multiple tools, manual processes, poor analytics

3. **Property Manager (Linda)**
   - Age: 38, Professional Property Manager
   - Manages 50+ units for multiple owners
   - Needs: Efficient workflows, automation, reporting
   - Pain points: Time-consuming tasks, coordination between owners/tenants

4. **Public User (James)**
   - Age: 32, Apartment Hunter
   - Looking for rental property
   - Needs: Easy search, transparent pricing, quick application
   - Pain points: Dealing with brokers, hidden fees, slow processes

### Platform

**Target Platforms:**
- **Primary:** Desktop Web (Chrome, Safari, Edge, Firefox)
- **Secondary:** Tablet Web (iPad, Android tablets)
- **Tertiary:** Mobile Web (iPhone, Android phones)
- **Future:** PWA (Progressive Web App) capabilities

**Screen Sizes:**
- Mobile: 375px - 767px (iPhone SE to iPhone Pro Max)
- Tablet: 768px - 1023px (iPad, Android tablets)
- Desktop: 1024px - 1920px+ (laptops, monitors)

### Success Criteria

**Functional Success:**
- [ ] All user flows work without errors
- [ ] All 9 user roles have appropriate access
- [ ] All forms validate correctly
- [ ] All CRUD operations function
- [ ] Navigation is intuitive and consistent
- [ ] Data persists appropriately (localStorage)
- [ ] Error states handled gracefully
- [ ] Loading states appear everywhere needed

**Design Success:**
- [ ] Authentic Apple-style aesthetics (Liquid Glass)
- [ ] Consistent design system applied throughout
- [ ] Smooth, physics-based animations
- [ ] Professional typography and spacing
- [ ] Proper color contrast (4.5:1 minimum)
- [ ] Clear visual hierarchy
- [ ] Responsive across all breakpoints

**Performance Success:**
- [ ] Lighthouse Performance: 90+
- [ ] Lighthouse Accessibility: 95+
- [ ] Lighthouse Best Practices: 95+
- [ ] Bundle size: < 2MB
- [ ] Initial load: < 3s on 3G
- [ ] Time to Interactive: < 5s
- [ ] No console errors in production

**Accessibility Success:**
- [ ] WCAG 2.1 Level AA compliance
- [ ] Keyboard navigation works everywhere
- [ ] Screen reader compatible
- [ ] Focus indicators visible
- [ ] ARIA labels where needed
- [ ] Semantic HTML throughout

**Code Quality Success:**
- [ ] TypeScript errors: 0
- [ ] ESLint warnings: 0
- [ ] Consistent code formatting
- [ ] No unused imports/variables
- [ ] Proper component composition
- [ ] Reusable patterns established

---

## D) PRODUCT SPEC

### Complete Feature Inventory

Based on research and project requirements, here's the COMPLETE feature list organized by module:

#### MODULE 1: MARKETPLACE & BIDDING SYSTEM

**Public Features (No Authentication Required):**

1.1 **Marketplace Homepage**
- Hero section with value proposition
- Featured properties carousel
- How it works (3-step process)
- O'Key score explainer
- Statistics dashboard (properties, success rate)
- Benefits grid (no brokers, transparent, fast)
- Testimonials slider
- Call-to-action sections
- Footer with links

1.2 **Property Search & Discovery**
- Advanced search with filters:
  - Location (city, neighborhood, proximity)
  - Price range (min-max slider)
  - Property type (apartment, condo, house)
  - Bedrooms (0-5+)
  - Bathrooms (1-3+)
  - Amenities (parking, gym, pool, pet-friendly, etc.)
  - Lease term (short-term, long-term)
  - Available date
- Sort options:
  - Newest first
  - Price (low to high)
  - Price (high to low)
  - Best match
  - Most popular
- View toggle: Grid / List / Map
- Pagination (20 per page)
- Save search criteria
- Property cards with:
  - Primary photo
  - Property name
  - Address
  - Price range
  - Available units count
  - Key amenities (icons)
  - Favorite button

1.3 **Property Detail Page**
- Image gallery (main + thumbnails, lightbox)
- Property information:
  - Name, address, description
  - Property type, year built
  - Total units, available units
  - Building amenities list
  - Nearby transit, schools, shopping
  - Pet policy, parking availability
- Available units section:
  - List of units with:
    - Unit number
    - Bedrooms/bathrooms
    - Square footage
    - Rent price
    - Availability date
    - "View Unit" CTA
- Building features grid
- Location map (embedded)
- Virtual tour (if available)
- Contact property button
- Share property button
- Similar properties carousel

1.4 **Unit Detail & Bidding Page**
- Unit specifications:
  - Floor plan image
  - Bedrooms, bathrooms, sq ft
  - Rent price (or minimum bid)
  - Security deposit
  - Availability date
  - Lease terms
- Unit amenities list
- Photo gallery (unit-specific)
- O'Key Score requirement display:
  - Minimum score needed
  - "What is O'Key Score?" link
  - Your score (if logged in)
  - Eligibility status
- Bidding section:
  - Current high bid (if auction)
  - Bid history table
  - Place bid button/form:
    - Bid amount input
    - Lease term selector
    - Move-in date picker
    - Message to landlord (optional)
    - Submit bid CTA
  - Bid validation:
    - Must meet minimum
    - Must have sufficient O'Key score
    - Must be higher than current high bid
- Application checklist
- Tenant screening requirements
- Contact landlord button

1.5 **My Bids Management** (Authenticated Tenants)
- Tabs:
  - Active Bids
  - Won Bids
  - Lost Bids
  - Expired Bids
- Each bid card shows:
  - Property + unit info
  - Your bid amount
  - Current status (leading, outbid, won, lost)
  - Time remaining (if auction)
  - Bid placed date
  - Actions:
    - Update bid (if active)
    - Withdraw bid
    - View property
    - Contact landlord
- Bid notifications:
  - Outbid alert
  - Auction ending soon
  - Bid won/lost
- Bid analytics:
  - Total bids placed
  - Win rate
  - Average bid amount

#### MODULE 2: TENANT PORTAL (COMPLETE)

2.1 **Tenant Dashboard**
- Welcome header with tenant name + unit
- Alert banners:
  - Overdue rent (red)
  - Lease expiring soon (yellow)
  - Maintenance updates (blue)
- Key stats cards (4):
  - Next rent payment (date + amount)
  - Outstanding balance
  - Maintenance requests (open count)
  - Lease info (end date, auto-renew status)
- Quick actions grid (6 cards):
  - Make a Payment
  - Submit Maintenance Request
  - View Documents
  - Contact Property Manager
  - View Payment History
  - Schedule Viewing (for renewals)
- Recent activity timeline:
  - Last 10 activities (payments, maintenance, messages, documents)
  - Filterable by type
  - Click to view details
- Upcoming events calendar:
  - Future rent payments
  - Scheduled maintenance
  - Lease milestones
  - Building events
- Property information card:
  - Property details
  - Manager contact
  - Emergency contact
  - Building rules link
- Tips & announcements:
  - Building notices
  - Payment reminders
  - Helpful tips

2.2 **Tenant Payments**
- Outstanding balance hero card:
  - Total amount due (large, prominent)
  - Breakdown by bill (description, due date, amount)
  - "Pay Now" button
  - Next payment due
  - Auto-pay status indicator
- Payment method management:
  - Saved payment methods (credit/debit cards)
  - Default method selector
  - Add payment method button
  - Edit/delete methods
- Payment history table:
  - Columns: Date, Description, Type, Amount, Status, Receipt
  - Filters:
    - Search by description
    - Type (Rent / Late Fee / Other)
    - Status (Paid / Pending / Failed)
    - Date range
  - Sort by date, amount, type
  - Pagination (10 per page)
  - Download receipt (per transaction)
- Auto-pay setup:
  - Toggle switch (enable/disable)
  - Selected payment method
  - Payment schedule (e.g., 5th of every month)
  - Benefits explainer
- Payment analytics:
  - Total paid to date
  - Average monthly payment
  - Payment history chart (last 12 months)
- Set up recurring payments
- Payment reminders configuration

2.3 **Tenant Maintenance Requests**
- Page header with stats:
  - Total requests count
  - Open requests
  - Resolved requests
  - Average response time
- Filter & search controls:
  - Search by title/description
  - Status filter (All / Pending / In Progress / Completed / Cancelled)
  - Priority filter (All / Low / Medium / High / Emergency)
  - Category filter (All / Plumbing / Electrical / HVAC / Appliance / Structural / Other)
  - Date range picker
  - Sort dropdown
- "Submit New Request" button (primary CTA)
- Requests list (card-based):
  - Each card shows:
    - Request ID, Status badge, Priority badge
    - Issue title (bold)
    - Category icon + name
    - Description preview
    - Submitted date, Last updated
    - Assigned to (name or "Unassigned")
    - "View Details" button
    - "Cancel Request" (if pending)
- Submit new request modal:
  - Form fields:
    - Title (required, min 10 chars)
    - Category (dropdown, required)
    - Priority (radio buttons with descriptions, required)
    - Description (textarea, required, min 20 chars)
    - Location within unit (optional)
    - Photos (upload, max 5 files)
    - Access instructions (optional)
  - Submit button
- Request detail modal:
  - Full request information
  - Activity timeline
  - Internal notes from maintenance team
  - Photos gallery
  - Cancel request option
- Request notifications:
  - Status change alerts
  - Assignment notifications
  - Completion notifications

2.4 **Tenant Documents**
- Page header with stats:
  - Total documents count
  - Recent uploads (last 30 days)
  - Storage used
- "Request Document" button
- Filter & view controls:
  - Search by filename/description
  - Category filter (All / Lease Documents / Receipts / Notices / Policies / Building Rules / Insurance / Other)
  - Date filter (All Time / Last 30 days / Last 3 months / Last 6 months / Last year)
  - View toggle: Grid / List
  - Sort (Newest / Oldest / Name A-Z / Name Z-A / Category)
- Documents display:
  - **Grid view:** Cards with file icon, filename, category badge, size, date
  - **List view:** Table with columns (Name, Category, Size, Date, Uploaded By, Actions)
  - Hover actions: Preview, Download, Share
- Document preview modal:
  - Full-screen/large modal
  - Content area (PDF viewer, image viewer, or download prompt)
  - Document details sidebar
  - Actions: Download, Share, Print
- Request document modal:
  - Document type (dropdown)
  - Description (textarea, why needed)
  - Urgency (radio: Not Urgent / Soon / Urgent)
  - Submit button
- Document categories with icons and colors
- Search functionality
- Download history tracking

2.5 **Tenant Messages**
- Integration with MessageCenter component
- Conversations list:
  - Property Manager
  - Maintenance Team
  - Building Management
- Each conversation shows:
  - Participant name + role
  - Last message preview
  - Last message time
  - Unread count badge
  - Online status indicator
- Message thread:
  - Chat interface
  - Message bubbles (sent/received)
  - Timestamps
  - Read receipts (check marks)
  - Typing indicator
- Message input:
  - Text input (expandable)
  - Attach file button
  - Attach image button
  - Send button
  - "Press Enter to send" hint
- Search conversations
- Filter by unread
- Mark as read/unread
- Archive conversations

2.6 **Tenant Profile & Settings**
- Personal information card:
  - Full name (editable)
  - Email (display only)
  - Phone (editable)
  - Emergency contact name (editable)
  - Emergency contact phone (editable)
  - "Save Changes" button
- Lease information card (read-only):
  - Property name + address
  - Unit number
  - Lease start/end dates
  - Monthly rent
  - Security deposit
  - Lease status badge
  - "View Full Lease" button
- Preferences & settings card:
  - Notification preferences (checkboxes):
    - Email notifications
    - SMS notifications
    - Push notifications
    - Types: Rent reminders, Maintenance updates, Building announcements, Payment receipts
  - Language preference (dropdown): English / Français
  - "Save Preferences" button
- Account security (optional):
  - Change password form
  - Enable Two-Factor Authentication
  - Active sessions list
  - Sign out all other sessions
- Danger zone:
  - Deactivate account
  - Delete account

#### MODULE 3: OWNER PORTAL (COMPLETE)

3.1 **Owner Dashboard**
- Welcome header with owner name
- Property selector dropdown (if multiple properties)
- Key metrics cards (4):
  - Total Properties (count, units total)
  - Monthly Revenue (amount, trend vs last month)
  - Occupancy Rate (percentage, occupied/total units)
  - Outstanding Balance (overdue rent, tenants count)
- Financial overview chart:
  - Revenue over last 6 months
  - Tabs: Revenue / Expenses / Net Income
  - "View Full Report" button
- Properties quick view:
  - Table showing properties (limit 3)
  - Columns: Name, Address, Units, Occupied, Monthly Revenue, Occupancy
  - "View All Properties" link
- Recent activity timeline:
  - Last 10 activities across all properties
  - Types: Payments received, Leases signed, Maintenance requests, Expenses
  - Timestamp, property name, description
  - Icons for activity types
- Alerts & notifications panel:
  - Overdue rent (red)
  - Expiring leases (yellow)
  - Pending maintenance (blue)
  - Upcoming inspections (green)
  - Each alert links to relevant page
  - Dismiss option
- Quick actions grid (6 cards):
  - Add New Property
  - View All Tenants
  - Financial Reports
  - Schedule Maintenance
  - Send Announcement
  - Generate Report

3.2 **Owner Properties Management**
- Page header:
  - "My Properties" title
  - Stats row (Total Properties, Total Units, Average Occupancy)
  - "Add New Property" button
- Filters & view:
  - Search by name/address
  - Occupancy filter (All / Fully Occupied / Partially Vacant / Fully Vacant)
  - Sort (Name A-Z / Name Z-A / Occupancy / Revenue)
  - View toggle: Grid / List
- Properties display:
  - **Grid view:** Cards with photo, name, address, stats, actions
  - **List view:** Table with columns
  - Each property shows:
    - Photo, Name, Address
    - Total units, Occupancy badge
    - Monthly revenue
    - Property type, Year built, Sq ft
    - Actions: View Details, Manage Units, View Finances, More menu
- Add new property modal:
  - Form with 12 fields (name, type, address, city, province, postal code, year built, sq ft, floors, photo, description)
  - Validation
  - Submit button
- Property details modal:
  - Tabs: Overview, Units, Financials, Maintenance, Documents
  - **Overview:** Property details, owner info, manager assigned
  - **Units:** List of units with status, rent, tenant, lease end
  - **Financials:** Revenue/expense summary, payment history
  - **Maintenance:** Active requests, maintenance history
  - **Documents:** Property documents, shared documents
- Edit property
- Archive property
- Delete property (with confirmation)

3.3 **Owner Financial Management**
- Page header:
  - Property filter (if multiple)
  - Date range selector
  - Export buttons (CSV, PDF, Send to QuickBooks)
- Financial summary cards (4):
  - Total Revenue (amount, trend)
  - Total Expenses (amount, trend)
  - Net Income (revenue - expenses, trend, colored)
  - Outstanding Receivables (unpaid rent, tenants count)
- Revenue vs Expenses chart:
  - Line/bar chart showing comparison
  - Toggleable view: Monthly / Quarterly / Yearly
  - Interactive (hover for exact amounts)
- Transactions table:
  - Tabs: All / Income / Expenses / Pending
  - Columns: Date, Type, Description, Property, Category, Amount, Status, Receipt
  - Filters: Search, Type, Category, Property, Status
  - Sort by date, amount, type
  - Pagination (20 per page)
  - Bulk actions: Mark as Reconciled
  - "Add Expense" button
- Category breakdown (pie/donut chart):
  - Visual breakdown of expenses by category
  - Click segment to filter transactions
  - Toggle: Expenses / Income categories
- Quick actions:
  - Record Expense
  - Generate Financial Report
  - Reconcile Transactions
  - Set Budget
- Record expense modal:
  - Form: Type, Property, Amount, Date, Vendor, Description, Category, Payment Method, Receipt
  - Submit button
- Generate report modal:
  - Report type (P&L, Cash Flow, Balance Sheet, Tax Summary)
  - Time period, Properties to include, Format (PDF/Excel/CSV)
  - Generate button

3.4 **Owner Resident Management**
- Page header:
  - Stats bar (Total Tenants, Active Leases, Expiring Soon, Average Stay)
  - Property filter
  - "Add New Tenant" button
- Filters & search:
  - Search by name/unit/email
  - Lease Status (All / Active / Expiring Soon / Expired / Pending)
  - Payment Status (All / Current / Overdue / Partial)
  - Sort (Name, Unit Number, Lease End Date, Move-in Date)
  - View toggle: Grid / List
- Tenants display:
  - **Grid view:** Cards with avatar, name, unit, status badges, info, actions
  - **List view:** Table with columns
  - Each tenant shows:
    - Avatar/initials, Name, Unit number
    - Lease status badge, Payment status indicator
    - Move-in date, Lease end date
    - Monthly rent, O'Key Score
    - Actions: View Profile, Send Message, View Lease, More menu
- Add new tenant modal:
  - Sections: Personal Information, Lease Information
  - Personal: First name, Last name, Email, Phone, Emergency contact
  - Lease: Property, Unit, Start/End dates, Rent amount, Security deposit, Move-in date
  - Buttons: Cancel, Save as Draft, Create Tenant & Send Invite
- Tenant detail modal:
  - Tabs: Overview, Lease Details, Payment History, Maintenance Requests, Communication, Documents
  - **Overview:** Personal info, Lease info, Payment summary, O'Key Score
  - **Lease Details:** Full lease terms, Document preview, Renewal options
  - **Payment History:** Table of all payments, Total paid summary
  - **Maintenance Requests:** List of issues, Status, Cost
  - **Communication:** Message history, Email/SMS log, Notices
  - **Documents:** Related documents, Lease agreement, Receipts
- Send announcement (to all/selected tenants)
- Export tenant list (CSV)
- Generate rent roll report

3.5 **Owner Maintenance Management**
- Page header:
  - Stats cards (Open Requests, Avg Response Time, Monthly Cost)
  - Property filter
- Tabs:
  - All Requests
  - Pending (needs assignment)
  - In Progress
  - Completed
  - Scheduled Maintenance
- Filters & search:
  - Search by issue/unit/tenant
  - Priority (All / Emergency / High / Medium / Low)
  - Category (All / Plumbing / Electrical / HVAC / Appliance / Structural / Other)
  - Property (All / specific)
  - Sort (Newest, Oldest, Priority, Status)
  - Date range
- Requests list (card-based):
  - Each card shows:
    - Request ID, Priority badge
    - Issue title, Category icon
    - Property + Unit, Submitted by (tenant)
    - Submitted date, Status badge
    - Assigned to (or "Unassigned")
    - Estimated cost
    - Actions: View Details, Assign, Update Status, Add Note
- Maintenance request detail modal:
  - Header: Title, ID, Priority, Status, Property, Unit, Tenant
  - Issue information: Category, Priority, Description, Location, Access instructions, Photos
  - Assignment section: Assigned to (dropdown), Assigned date, "Assign/Reassign" button
  - Work details: Status dropdown, Estimated cost, Actual cost, Scheduled date, Completion date, Internal notes, Work photos
  - Activity timeline: All changes, assignments, notes
  - Actions: Save Changes, Mark as Completed, Contact Tenant, Close
- Assign maintenance modal:
  - Select Vendor/Worker, Priority, Scheduled Date, Estimated Cost, Notes, "Send notification to tenant" checkbox
  - Assign button
- Schedule preventive maintenance modal:
  - Task type, Property, Unit, Description, Scheduled date, Frequency, Assign to, Estimated cost, Reminder
  - Submit button
- Maintenance calendar (optional):
  - Calendar view of scheduled tasks
  - Color-coded by property
  - Click date to see tasks
  - "Schedule New Task" button

3.6 **Owner Document Management**
- Page header:
  - Stats (Total Documents, Shared with Tenants, Storage Used)
  - Actions: Upload Document, Create Folder
- Folder tree sidebar:
  - Hierarchical structure:
    - All Documents
    - Properties (per property folders)
    - Financial Documents
    - Legal Documents
    - Leases
    - Shared with Tenants
  - Expandable/collapsible
  - Click to filter documents
- Filters & view:
  - Search documents
  - Type/Property/Date/Shared Status filters
  - Sort (Name, Date, Size, Type)
  - View toggle: Grid / List
- Documents display:
  - **Grid view:** Cards with file icon, filename, badges, size, date, shared badge
  - **List view:** Table with columns
  - Actions: Preview, Download, Share, Move, Delete
- Bulk actions:
  - Select multiple (checkboxes)
  - Toolbar: Move to Folder, Share with Tenants, Download Selected, Delete Selected
- Upload document modal:
  - Drag & drop or browse
  - Multiple files
  - For each file: Assign Property, Assign Folder, Description, Share with Tenants, Tags
  - Upload button with progress
- Document preview modal:
  - Content area (PDF/image viewer)
  - Details sidebar
  - Additional owner controls:
    - Edit (folder, description, tags)
    - Share Settings (toggle, select tenants, expiration, download allowed)
    - Delete
    - Move to Folder
    - Generate Public Link (with expiration, password)
- Share document modal:
  - Share with tabs: All Tenants / Specific Tenants / External Recipients
  - Permissions: View only / View + Download / View + Comment
  - Expiration (optional)
  - Notification: Send email, Custom message
  - Share button

3.7 **Owner Meetings & Governance**
- Page header:
  - Stats (Upcoming Meetings, Pending Votes, Decisions This Year)
  - "Schedule Meeting" button
- Tabs:
  - Upcoming Meetings
  - Past Meetings
  - Votes & Decisions
  - Meeting Minutes
- Meetings list:
  - Each meeting card shows:
    - Type badge (Board Meeting / AGM / Special / Emergency)
    - Title, Date/Time, Location (or "Virtual")
    - Agenda items count
    - RSVP status
    - Attendees count (X of Y confirmed)
    - Actions: View Details, RSVP, Add to Calendar
- Active votes panel:
  - List of votes requiring action
  - Each shows: Title, Time remaining, Current results, "Cast Vote" button
- Schedule meeting modal:
  - Type, Title, Date/Time, Duration, Location (or Virtual checkbox)
  - Agenda items (dynamic list, reorderable)
  - Attendees (multi-select)
  - Attach Documents
  - Send Invitations checkbox
  - Buttons: Cancel, Save as Draft, Schedule Meeting
- Meeting detail modal:
  - Meeting information (type, date, time, location, organizer, attendees)
  - Agenda (ordered list with time allocations)
  - RSVP section (your status, change RSVP, attendee list)
  - Documents (meeting materials, previous minutes)
  - Actions: Join Virtual Meeting, Download Agenda, Add to Calendar, Close
- Voting modal:
  - Vote title/question
  - Vote description/context
  - Vote type indicator
  - Current results (if visible)
  - Vote options (radio/checkboxes)
  - Comments section
  - Submit Vote button

3.8 **Owner Settings**
- Tabs: Account Settings, Property Management Preferences, Notification Preferences, Billing & Subscription, Security
- **Account Settings:**
  - Profile info (Name, Email, Phone, Company Name, Tax ID)
  - Save Changes button
- **Property Management Preferences:**
  - Default Settings: Late fee %, Grace period days, Default lease term, Auto-renewal, Security deposit amount
  - Maintenance Settings: Auto-assign, Default team, Emergency contact
  - Save Preferences button
- **Notification Preferences:**
  - Email Notifications (checkboxes for types)
  - SMS Notifications (checkboxes)
  - Frequency (Instant / Daily Digest / Weekly Summary)
  - Save button
- **Billing & Subscription:**
  - Current Plan card (name, price, features, Upgrade button)
  - Payment Method (card details, Update button)
  - Billing History table (Date, Description, Amount, Invoice)
- **Security:**
  - Change Password form
  - Two-Factor Authentication (toggle)
  - Active Sessions (list, Sign Out All button)
  - Danger Zone (Deactivate Account, Delete Account)

#### MODULE 4: ADVANCED FEATURES (NEW)

4.1 **Portfolio Analytics Dashboard** (for multi-property owners)
- Portfolio overview:
  - Total properties value
  - Total monthly revenue
  - Overall occupancy rate
  - Total units managed
  - Portfolio growth chart
- Property comparison table:
  - Compare all properties side-by-side
  - Metrics: Occupancy, Revenue, Expenses, Net Income, ROI
  - Sort by any metric
  - Identify top/bottom performers
- Revenue distribution (pie chart):
  - Revenue by property
  - Revenue by property type
  - Click to drill down
- Occupancy trends chart:
  - Historical occupancy rates per property
  - Identify seasonal patterns
  - Forecast future occupancy
- Expense analysis:
  - Compare expenses across properties
  - Identify cost outliers
  - Maintenance costs by property
- ROI calculator:
  - Calculate return on investment per property
  - Compare against market averages
  - Projected returns
- Benchmarking:
  - Compare your portfolio against market averages
  - Industry benchmarks
  - Performance scores

4.2 **Bulk Operations**
- Bulk rent collection:
  - Select multiple tenants
  - Send bulk payment reminders
  - Charge late fees in bulk
  - Export bulk payment report
- Bulk notices:
  - Select multiple tenants/units
  - Compose message/notice
  - Schedule delivery
  - Track delivery status
- Bulk lease renewals:
  - Select expiring leases
  - Generate renewal offers
  - Send to tenants
  - Track responses
- Bulk maintenance scheduling:
  - Schedule recurring tasks (e.g., HVAC inspection)
  - Assign to multiple properties
  - Bulk vendor assignment
- Bulk document sharing:
  - Select documents
  - Share with multiple tenants/units
  - Set permissions in bulk
  - Track access

4.3 **Calendar Integration**
- Unified calendar view:
  - Rent due dates
  - Lease start/end dates
  - Scheduled maintenance
  - Meetings
  - Inspections
  - Building events
- Color-coded by type
- Filter by property, type, priority
- Week/Month/Agenda views
- Sync with external calendars (Google, Outlook, iCal)
- Add events directly
- Set reminders
- Recurring events support
- Export calendar (ICS)

4.4 **Task Management System** (for property managers)
- Task dashboard:
  - Today's tasks
  - Overdue tasks
  - Upcoming tasks (next 7 days)
  - Task completion rate
- Create task:
  - Title, Description, Category
  - Assign to (team member)
  - Priority (Low/Medium/High)
  - Due date
  - Related to (property, unit, tenant)
  - Checklist items
  - Attach files
- Task views:
  - List view (default)
  - Kanban board (To Do / In Progress / Done)
  - Calendar view
  - Gantt chart (for projects)
- Task filters:
  - Assigned to me / Assigned by me / All
  - Status, Priority, Category, Property
  - Date range, Overdue only
- Task notifications:
  - Assignment notification
  - Due date reminder
  - Overdue alert
  - Completion notification
- Task templates:
  - Pre-defined task lists for common workflows
  - Move-in checklist
  - Move-out inspection
  - Quarterly property inspection
  - Lease renewal process

4.5 **Vendor Portal & Management**
- Vendor directory:
  - List of all vendors
  - Categories (Plumber, Electrician, Cleaner, etc.)
  - Contact info, Ratings
  - Service areas
  - Active contracts
- Add vendor:
  - Company name, Contact person
  - Email, Phone, Address
  - Category, Specialties
  - Hourly rate, Insurance info
  - Availability
- Vendor profiles:
  - Work history with your properties
  - Completed jobs count
  - Average rating
  - Total paid
  - Certifications/licenses
- Assign work to vendors:
  - Select from directory
  - Send work order
  - Vendor can accept/decline
  - Track job progress
  - Complete and rate work
- Vendor invoicing:
  - Receive invoices from vendors
  - Approve/reject
  - Track payment status
  - Payment history
- Vendor ratings & reviews:
  - Rate completed work
  - Leave review
  - View aggregate ratings
  - Filter vendors by rating
- Preferred vendors:
  - Mark vendors as preferred
  - Auto-assign to certain job types
  - Priority notification

4.6 **Move-In / Move-Out Checklists**
- **Move-In Checklist:**
  - Pre-move inspection items
  - Condition documentation (room by room)
  - Photo uploads (before tenant moves in)
  - Appliance conditions
  - Utility readings (meter numbers)
  - Key handover
  - Lease signing confirmation
  - Security deposit received
  - First month's rent received
  - Welcome packet delivered
  - Tenant signature
  - Generate PDF report
- **Move-Out Checklist:**
  - Pre-move-out inspection scheduling
  - Condition documentation (room by room)
  - Photo uploads (after tenant moves out)
  - Compare to move-in condition
  - Damage assessment
  - Cleaning requirements
  - Repair estimates
  - Utility readings (final)
  - Key return
  - Security deposit calculation:
    - Deductions for damages
    - Cleaning fees
    - Unpaid rent
    - Final refund amount
  - Forward address collection
  - Final walkthrough signature
  - Generate move-out report

4.7 **Lease Builder & Editor**
- Lease templates:
  - Standard residential lease
  - Short-term lease
  - Commercial lease
  - Roommate agreement
  - Lease renewal addendum
- Lease builder wizard:
  - Step 1: Select template
  - Step 2: Property & unit details (auto-populate)
  - Step 3: Tenant information (auto-populate)
  - Step 4: Lease terms:
    - Start/end dates
    - Rent amount, Due date
    - Late fee policy
    - Security deposit
    - Pet policy
    - Parking
    - Utilities responsibility
  - Step 5: Additional clauses:
    - Maintenance responsibilities
    - Renewal options
    - Subletting policy
    - Early termination clause
  - Step 6: Custom clauses (add your own)
  - Step 7: Review & preview
  - Step 8: Send for signature
- Lease editor:
  - Rich text editor
  - Drag-drop clauses
  - Variable insertion ({{tenant_name}}, {{rent_amount}})
  - Save as custom template
- Lease library:
  - All leases (active, expired, draft)
  - Filter by property, status, tenant
  - Search by tenant name
  - Bulk download
- Digital signatures:
  - Send for signature (DocuSign integration placeholder)
  - Track signature status
  - Reminder emails
  - Completed lease storage
- Lease renewals:
  - Automatically generate renewal offer
  - Adjust rent amount
  - Change terms
  - Send to tenant for approval

4.8 **Expense Tracking & Budgets**
- Expense categories:
  - Maintenance & Repairs
  - Utilities
  - Property Management Fees
  - Insurance
  - Property Taxes
  - HOA/Condo Fees
  - Marketing & Advertising
  - Legal & Professional Fees
  - Mortgage/Financing
  - Improvements/CapEx
- Expense entry:
  - Quick add expense
  - Receipt upload (OCR text extraction)
  - Categorization
  - Property assignment
  - Vendor/payee
  - Payment method
  - Tags (tax-deductible, recurring, etc.)
- Recurring expenses:
  - Set up recurring (monthly, quarterly, annual)
  - Auto-generate transactions
  - Reminder before due date
- Expense reports:
  - By category
  - By property
  - By time period
  - Tax-deductible expenses only
  - Export for tax preparation
- Budget management:
  - Set annual/monthly budgets per category
  - Set property-level budgets
  - Track actual vs budget
  - Variance analysis
  - Budget alerts (when approaching limit)
  - Year-over-year comparison
- Expense analytics:
  - Expense trends over time
  - Category breakdown
  - Property comparison
  - Identify cost-saving opportunities

4.9 **Tax Document Generation**
- Tax forms:
  - Schedule E (Supplemental Income and Loss)
  - 1099-MISC (for contractors/vendors)
  - Expense summary by category
  - Depreciation schedule
- Tax year selector
- Property selector (single or all)
- Generate reports:
  - Total rental income
  - Total expenses by category
  - Net rental income/loss
  - Mortgage interest paid
  - Property taxes paid
  - Depreciation
- Export options:
  - PDF (for records)
  - CSV (for accountant)
  - Send to tax software
- Tax deduction tracker:
  - Mark expenses as tax-deductible
  - Track potential deductions
  - Generate deduction summary

4.10 **Tenant Screening Workflow**
- Application management:
  - Receive applications
  - Application status (Pending, Under Review, Approved, Rejected)
  - Application timeline
- Screening checklist:
  - Credit check (placeholder - would integrate with service)
  - Background check (placeholder)
  - Employment verification
  - Previous landlord references
  - Income verification (3x rent rule)
  - Rental history
- Applicant comparison:
  - Side-by-side comparison
  - Scoring system
  - Notes and flags
- Communication with applicants:
  - Send requests for additional info
  - Schedule showing/interview
  - Approval/rejection notifications
- Fair housing compliance:
  - Standardized questions
  - Uniform screening criteria
  - Documentation of decisions

4.11 **Utility Management**
- Utility accounts:
  - Track utility accounts per property/unit
  - Types: Electric, Gas, Water, Sewer, Trash, Internet, Cable
  - Account numbers
  - Service providers
  - Responsibility (tenant/owner)
- Utility billing:
  - Enter meter readings
  - Calculate tenant portion
  - Generate utility bills
  - Add to tenant balance
- Utility usage tracking:
  - Historical usage per unit
  - Usage comparisons
  - Identify high usage (potential leaks)
  - Cost trends
- Utility setup/transfer:
  - Coordinate utility setup for move-ins
  - Transfer for move-outs
  - Track setup dates
  - Confirmation documentation

4.12 **Parking & Amenity Management**
- Parking:
  - Parking spot inventory
  - Assignment to tenants
  - Parking fees
  - Visitor parking
  - Permit generation
  - Parking violations
- Amenities booking:
  - Amenity list (gym, pool, party room, etc.)
  - Booking calendar
  - Reservation system
  - Capacity limits
  - Booking rules
  - Cancellation policy
- Amenity access control:
  - Access codes/keys
  - Usage logs
  - Access restrictions (residents only)

4.13 **Visitor Management**
- Visitor pre-registration:
  - Tenant can register visitors
  - Visitor info (name, date, time)
  - Purpose of visit
  - Vehicle info
- Visitor check-in/out:
  - Front desk check-in
  - QR code for visitors
  - Sign-in log
  - Badge printing
- Delivery management:
  - Package tracking
  - Notify tenant of delivery
  - Pickup confirmation
  - Storage location

4.14 **Emergency Protocols Dashboard**
- Emergency contacts:
  - Property manager
  - Maintenance team
  - Police, Fire, Ambulance
  - Utility companies
  - Building management
- Emergency procedures:
  - Fire evacuation plan
  - Severe weather procedures
  - Power outage protocol
  - Water leak response
  - Security breach protocol
- Emergency broadcast:
  - Send emergency alerts to all tenants
  - SMS/Email/Push notification
  - Acknowledge receipt tracking
- Incident reporting:
  - Log emergency incidents
  - Actions taken
  - Resolution
  - Follow-up items

#### MODULE 5: QUEBEC LAW 16 COMPLIANCE

5.1 **Maintenance Logbook**
- Digital logbook for condo buildings
- Mandatory entries:
  - Date of work
  - Type of work (preventive, corrective, improvement)
  - Location (common areas, specific systems)
  - Description of work
  - Contractor/vendor
  - Cost
  - Warranty information
  - Before/after photos
  - Compliance certificates
- Search and filter entries
- Export logbook (PDF for board meetings)
- Reminder for required maintenance
- Audit trail (who added/modified entries)

5.2 **Contingency Fund Study**
- Building information:
  - Age, Size, Number of units
  - Major systems inventory
  - Current fund balance
- Component inventory:
  - Roof, Foundation, Plumbing, Electrical, HVAC, Elevators, etc.
  - Installation date
  - Expected lifespan
  - Estimated replacement cost
- Replacement schedule:
  - Year-by-year projection (30 years)
  - Components needing replacement
  - Estimated costs
- Fund projections:
  - Current balance
  - Annual contributions
  - Projected expenses
  - Fund balance over time
- Recommendations:
  - Minimum required contribution
  - Suggested contribution
  - Special assessment needs
- Generate study report (PDF)

5.3 **Sales Certificates (Certificat d'Information)**
- Generate certificate for condo sales
- Required information:
  - Condo declaration
  - Co-ownership bylaws
  - Financial statements (last 2 years)
  - Budget (current year)
  - Minutes of meetings (last 2 years)
  - Contingency fund study
  - Insurance policy
  - Pending legal actions
  - Special assessments
  - Work planned
- Document checklist
- Certificate generation (PDF)
- Delivery tracking
- Expiration tracking (90 days)

5.4 **Common Systems Inventory**
- Building systems registry:
  - HVAC systems (details, age, capacity)
  - Plumbing systems
  - Electrical systems
  - Elevators
  - Fire protection systems
  - Security systems
  - Roof and waterproofing
  - Structural elements
- For each system:
  - Installation date
  - Manufacturer, Model
  - Maintenance schedule
  - Last maintenance date
  - Warranty info
  - Expected lifespan
  - Replacement cost estimate
  - Maintenance logs
  - Photos/diagrams
- Compliance tracking:
  - Required inspections
  - Certificates
  - Compliance status
  - Upcoming requirements

5.5 **Owner Responsibilities Tracker**
- Condo owner obligations:
  - Contribution payments (monthly fees)
  - Special assessment payments
  - Insurance requirements
  - Modification approvals
  - Meeting attendance
- Track compliance:
  - Payment status
  - Overdue amounts
  - Insurance certificates on file
  - Approved modifications
- Owner communication:
  - Reminders for payments
  - Notices of meetings
  - Requests for documents
- Violation tracking:
  - Document violations
  - Send notices
  - Track resolution
  - Fine management

#### MODULE 6: GLOBAL FEATURES & COMPONENTS

6.1 **Global Notifications System**
- Notifications panel (sliding from right):
  - Header: Tabs (All / Unread / Archived)
  - Mark all as read button
  - Settings icon
- Notification list:
  - Each notification shows:
    - Icon (varies by type, colored)
    - Title (bold)
    - Description (2 lines)
    - Timestamp (relative)
    - Unread indicator (blue dot)
  - Click: Mark as read, navigate to related page
  - Hover: Quick actions (Mark as read, Archive, Delete)
- Notification types:
  - **Tenants:** Rent due, Maintenance update, Message, Document shared, Lease expiring
  - **Owners:** Payment received, New maintenance request, Tenant application, Lease signed, Vote required
- Real-time updates (simulated)
- Pull to refresh (mobile)
- "View All Notifications" link
- "Clear All" button
- Empty state

6.2 **Global Search / Command Palette**
- Trigger: Cmd+K (Mac) or Ctrl+K (Windows/Linux)
- Trigger: Click search icon in header
- Modal overlay with centered search
- Large search input (autofocus)
- Clear button
- Keyboard shortcut hint
- Search results (categorized):
  - **Quick Actions:** Make payment, Submit request, View documents, Send message
  - **Properties:** Matching properties by name/address
  - **Tenants/Residents:** Matching by name/email
  - **Documents:** Matching by filename/description
  - **Transactions:** Matching by description
  - **Pages:** All app pages matching query
- Keyboard navigation:
  - ↓↑ navigate, ↵ select, Esc close, Tab switch categories
- Empty state: Recent searches, Suggested actions
- No results: "No results for '[query]'", Suggestions
- Search logic:
  - Fuzzy matching
  - Debounced (300ms)
  - Limit 5 per category
  - Sort by relevance

6.3 **Help Center**
- Header: Title, Search bar
- Popular articles (cards):
  - How to make rent payment
  - Submitting maintenance request
  - Understanding your lease
  - Setting up auto-pay
  - Viewing and downloading documents
  - Contacting property manager
- Categories grid:
  - Getting Started
  - Payments & Billing
  - Maintenance Requests
  - Documents & Leases
  - Account Settings
  - Troubleshooting
- Video tutorials (optional):
  - Embedded thumbnails
  - "Watch Video" links
- Contact support card:
  - Email: support@okey.com
  - Phone: 1-800-OKEY-HELP
  - Live Chat button
  - "Submit a Ticket" button
- Submit ticket modal:
  - Issue Type, Subject, Description, Attachment, Priority
  - Submit button

6.4 **User Onboarding**
- First-time user tour:
  - Welcome screen
  - Product tour (5-7 steps)
  - Interactive walkthrough
  - Skip option
  - "Don't show again" checkbox
- Role-specific onboarding:
  - Tenant: Payment, Maintenance, Documents
  - Owner: Dashboard overview, Add property, View finances
- Feature tooltips:
  - Contextual help on first use
  - Dismissible
  - "Learn more" links
- Progress tracking:
  - Setup checklist
  - Completion percentage
  - Next steps suggestions

6.5 **Multi-Language Support** (English/French)
- Language selector:
  - In user menu
  - In settings
  - Flag icons
- Translations:
  - All UI text
  - Error messages
  - Help content
  - Email templates
  - Document templates
- Locale-specific:
  - Date formats
  - Currency
  - Number formats
  - Address formats
- RTL support (future): For languages like Arabic

6.6 **Dark Mode / Theme Switcher**
- Theme options:
  - Light mode (default)
  - Dark mode
  - Auto (system preference)
- Theme switcher:
  - Toggle in header
  - Setting in user preferences
- Liquid Glass adjustments:
  - Dark mode vibrancy
  - Blur effects maintained
  - Color palette adjustments
  - Contrast compliance
- Persistence: localStorage

6.7 **Error Boundaries & Error Pages**
- Error Boundary component:
  - Catch React errors
  - Fallback UI:
    - Large error icon
    - "Oops! Something went wrong"
    - Description
    - Details toggle (dev only)
    - Reload Page button
    - Go to Dashboard button
    - Report Error button
  - Log errors to console
- 404 Not Found page:
  - Centered layout
  - Large "404" (gradient)
  - "Page Not Found"
  - Description
  - Illustration
  - Actions: Go to Dashboard, Go to Homepage
  - Search box
- 403 Forbidden:
  - "Access Denied"
  - Explanation
  - Contact admin link
- 500 Server Error (future):
  - "Server Error"
  - Retry button

6.8 **Loading States & Skeletons**
- Full page loader:
  - O'Key logo (animated)
  - Loading spinner
  - "Loading your dashboard..."
  - Gradient background
- Skeleton loaders:
  - Card skeleton
  - Table skeleton
  - Text skeleton
  - Shimmer animation
  - Match actual layout
- Suspense fallbacks:
  - Simple spinner
  - Minimal, fast render

6.9 **Toast Notifications**
- Toast container (top-right)
- Toast types:
  - Success (green, checkmark)
  - Error (red, X)
  - Warning (yellow, alert)
  - Info (blue, i)
- Auto-dismiss (3 seconds)
- Manual dismiss (X button)
- Queue management (max 3 visible)
- Action buttons (optional)

6.10 **Confirmation Modals**
- Standard confirmation:
  - Title: "Are you sure?"
  - Description: Action consequences
  - Actions: Cancel (secondary), Confirm (primary/danger)
- Destructive actions:
  - Red/danger styling
  - Extra confirmation ("Type 'DELETE' to confirm")
  - Can't be undone warning
- Examples:
  - Delete property
  - Remove tenant
  - Cancel lease
  - Delete document

### User Stories & Acceptance Criteria

(Due to length, showing structure - would be expanded for each feature)

**Example User Story:**

**As a** tenant
**I want to** submit a maintenance request
**So that** my property issues get fixed quickly

**Acceptance Criteria:**
1. GIVEN I am logged in as a tenant
   WHEN I navigate to /tenant/maintenance
   THEN I see a "Submit New Request" button

2. GIVEN I click "Submit New Request"
   WHEN the modal opens
   THEN I see a form with fields: Title, Category, Priority, Description, Location, Photos, Access Instructions

3. GIVEN I fill in required fields (Title, Category, Priority, Description)
   WHEN I click "Submit Request"
   THEN the request is created and added to my requests list

4. GIVEN the request is submitted
   WHEN I view my requests list
   THEN I see the new request at the top with status "Pending"

5. GIVEN the request is in the system
   WHEN the property manager views their maintenance page
   THEN they see my request in their list

[Continue for all 100+ features...]

---

**This completes Section D. Continuing with remaining sections...**

*Note: Due to length constraints, I'll create the remaining sections (E-R) in separate files.*

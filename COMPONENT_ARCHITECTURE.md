# O'KEY PLATFORM - COMPONENT ARCHITECTURE
**Component Design & State Management Strategy**

---

## I) COMPONENT ARCHITECTURE

### Component Library Selection

**Primary Library:** **Liquid Glass UI** + **React Cupertino**

Based on research ([Liquid Glass UI](https://liquidglassui.org/), [React Cupertino](https://github.com/vldmrkl/react-cupertino)), these libraries provide:

1. **Liquid Glass UI:**
   - Translucent materials with dynamic light effects
   - Backdrop-filter blur effects (authentic Apple glassmorphism)
   - Real-time rendering for environmental adaptation
   - Specular highlights responsive to interactions
   - Auto light/dark theme adaptation
   - GPU-accelerated performance

2. **React Cupertino:**
   - 100+ iOS 26-inspired components
   - TypeScript-first, fully accessible
   - Production-ready templates
   - Matches Apple Human Interface Guidelines

**Installation:**
```bash
npm install @liquid-glass/ui @react-cupertino/core
```

**Alternative/Complementary:**
- **Headless UI** (by Tailwind Labs) for unstyled, accessible primitives
- **Radix UI** for complex components (dropdowns, dialogs, tooltips)
- **React Aria** for accessibility-first components

**Source:** [Best React UI Libraries 2026](https://www.builder.io/blog/react-component-libraries-2026)

---

### Component Inventory

**Organized by Atomic Design Principles:**

#### **ATOMS** (Basic building blocks)

1. **Button**
   - Variants: primary, secondary, tertiary, danger, ghost
   - Sizes: sm, md, lg
   - States: default, hover, active, disabled, loading
   - With icon support (left/right)
   - Apple-style: Rounded, subtle shadows, smooth transitions

2. **Input**
   - Types: text, email, tel, number, password, date
   - States: default, focus, error, disabled, readonly
   - With label, helper text, error message
   - Apple-style: Clean borders, focus ring, floating labels

3. **Textarea**
   - Auto-resize option
   - Character counter
   - Same states as Input

4. **Checkbox**
   - Controlled/uncontrolled
   - Indeterminate state
   - Custom checkmark animation
   - Apple-style: Smooth toggle animation

5. **Radio**
   - Radio group wrapper
   - Custom styling
   - Apple-style: Circular selection indicator

6. **Toggle/Switch**
   - On/off states
   - Disabled state
   - Apple-style: iOS-like sliding toggle with smooth physics

7. **Badge**
   - Variants: default, success, warning, error, info
   - Sizes: sm, md, lg
   - With/without dot indicator
   - Notification count badges

8. **Tag**
   - Dismissible option
   - Color variants
   - Icon support

9. **Avatar**
   - Image or initials fallback
   - Sizes: xs, sm, md, lg, xl
   - Status indicator (online/offline/busy)
   - Avatar group (overlapping)

10. **Icon**
    - Lucide React icon library
    - Consistent sizing
    - Color theming

11. **Spinner/Loader**
    - Sizes: sm, md, lg
    - Variants: circular, dots, bars
    - Apple-style: Subtle, smooth animation

12. **Divider**
    - Horizontal/vertical
    - With label option
    - Thickness variants

13. **Skeleton**
    - For loading states
    - Shimmer animation
    - Shape variants: text, circle, rectangle
    - Apple-style: Subtle shimmer, matches glassmorphism

#### **MOLECULES** (Simple combinations)

14. **FormField**
    - Wrapper combining Label + Input/Select + Error
    - Consistent spacing
    - Validation state handling

15. **SearchBar**
    - Input with search icon
    - Clear button
    - Optional filters dropdown
    - Debounced onChange
    - Apple-style: Rounded, prominent, with subtle shadow

16. **Stat Card**
    - Number/metric display
    - Label
    - Trend indicator (up/down arrow, percentage)
    - Icon
    - Apple-style: Card with glassmorphism, depth

17. **Alert**
    - Variants: info, success, warning, error
    - Dismissible option
    - Icon + Title + Description
    - Action buttons
    - Apple-style: Translucent background, subtle border

18. **Toast**
    - Auto-dismiss
    - Variants matching Alert
    - Position: top-left, top-right, bottom-left, bottom-right
    - Progress bar for auto-dismiss
    - Apple-style: Slides in with physics-based animation

19. **Dropdown Menu**
    - Trigger + Menu items
    - Keyboard navigation
    - Nested menus
    - Icons, descriptions, shortcuts
    - Apple-style: Blurred background, smooth open animation

20. **Select**
    - Native select styled
    - Custom select with search
    - Multi-select option
    - Grouped options
    - Apple-style: Clean, iOS-like picker

21. **DatePicker**
    - Calendar view
    - Date range option
    - Min/max dates
    - Disabled dates
    - Apple-style: iOS calendar aesthetic

22. **TimePicker**
    - 12/24 hour format
    - Minute increments
    - AM/PM toggle
    - Apple-style: iOS time picker wheels

23. **Tabs**
    - Horizontal/vertical
    - Underline/pills/buttons variants
    - Controlled/uncontrolled
    - Keyboard navigation
    - Apple-style: Smooth sliding indicator

24. **Breadcrumbs**
    - Separator variants
    - Collapsed option (for long paths)
    - Click to navigate
    - Apple-style: Subtle, clean typography

25. **Pagination**
    - Page numbers
    - Previous/Next buttons
    - Items per page selector
    - Total count display
    - Jump to page
    - Apple-style: Minimal, clean

26. **File Upload**
    - Drag & drop area
    - File browser trigger
    - File list with preview thumbnails
    - Progress bars per file
    - Remove file option
    - Apple-style: Dashed border, smooth upload animation

27. **Rating**
    - Star rating (read-only or interactive)
    - Half-star support
    - Custom icons
    - Hover preview
    - Apple-style: Smooth fill animation

#### **ORGANISMS** (Complex combinations)

28. **Header**
    - Logo
    - Navigation links
    - Search bar
    - Notifications bell
    - Messages icon
    - User menu dropdown
    - Apple-style: Translucent with blur (like macOS menu bar)

29. **Sidebar**
    - Navigation links with icons
    - Collapsible
    - Active state highlighting
    - Nested navigation
    - Footer (logout, settings)
    - Apple-style: Translucent sidebar, subtle separators

30. **MobileNav (Bottom Tab Bar)**
    - 5 tab items maximum
    - Active tab indicator
    - Icon + label
    - Badge support (notification counts)
    - Apple-style: iOS tab bar aesthetic, translucent background

31. **Modal/Dialog**
    - Overlay (backdrop)
    - Content area (scrollable)
    - Header (title, close button)
    - Body
    - Footer (actions)
    - Sizes: sm, md, lg, xl, full
    - Apple-style: Translucent backdrop, smooth scale-in animation

32. **Drawer/Slide-over**
    - Side panel (left/right)
    - Overlay
    - Scrollable content
    - Close on outside click
    - Apple-style: Slide-in animation with spring physics

33. **Table**
    - Sortable columns
    - Filterable
    - Pagination integrated
    - Row selection (checkboxes)
    - Expandable rows
    - Sticky header
    - Empty state
    - Loading skeleton
    - Apple-style: Clean lines, subtle hover states

34. **Card**
    - Header (optional)
    - Body
    - Footer (optional)
    - Hover effects
    - Clickable variant
    - Apple-style: Glassmorphism background, subtle shadow, depth

35. **Accordion**
    - Multiple items
    - Single/multiple open
    - Controlled/uncontrolled
    - Smooth expand/collapse
    - Apple-style: Chevron rotation, smooth height transition

36. **Form**
    - FormField wrappers
    - Validation (React Hook Form + Zod)
    - Error summary
    - Submit button with loading state
    - Reset option
    - Multi-step wizard variant

37. **PropertyCard** (domain-specific)
    - Property image
    - Property name, address
    - Price, beds/baths
    - Amenities icons
    - Favorite button
    - "View Details" CTA
    - Apple-style: Card with depth, subtle hover lift

38. **UnitCard** (domain-specific)
    - Similar to PropertyCard
    - Unit-specific info
    - Availability badge
    - "Place Bid" CTA

39. **NotificationPanel**
    - Slide-over from right
    - Tabs: All/Unread/Archived
    - Notification list
    - Mark all as read
    - Individual notification items
    - Empty state
    - Apple-style: Translucent panel, notification cards

40. **CommandPalette**
    - Full-screen overlay
    - Search input (large, centered)
    - Categorized results
    - Keyboard navigation
    - Recent searches
    - Apple-style: Spotlight-like, blurred background

41. **Timeline** (Activity feed)
    - Chronological list
    - Activity items with icon, title, description, timestamp
    - Grouping by date
    - Infinite scroll
    - Apple-style: Clean, vertical line connecting items

42. **Chart Components** (using Recharts)
    - LineChart
    - BarChart
    - PieChart
    - AreaChart
    - Responsive
    - Tooltips
    - Legends
    - Apple-style theming: Clean, minimal, accent colors

43. **ImageGallery**
    - Thumbnail grid
    - Lightbox viewer (full-screen)
    - Zoom, pan controls
    - Navigation (prev/next)
    - Thumbnail navigation
    - Apple-style: Smooth transitions, translucent controls

44. **FilterPanel**
    - Multiple filter types (checkboxes, sliders, selects)
    - Clear all button
    - Apply filters button
    - Collapsible sections
    - Mobile: Bottom sheet
    - Desktop: Sidebar
    - Apple-style: Organized sections, smooth expand

45. **EmptyState**
    - Illustration/icon
    - Heading
    - Description
    - Call-to-action button
    - Different variants: No data, No results, Error, Success
    - Apple-style: Clean, friendly, with subtle animation

46. **LoadingScreen**
    - Full-page loader
    - Logo + spinner
    - Loading message
    - Apple-style: Minimal, brand-consistent

47. **MessageCenterComponent** (already exists)
    - Conversations list
    - Message thread
    - Message input
    - Online status
    - Read receipts
    - Reuse existing, re-style with Apple aesthetic

48. **PaymentProcessor** (domain-specific)
    - Amount input
    - Payment method selector
    - CVV, Zip code inputs
    - Submit button with loading
    - Success/error states
    - Apple-style: Secure appearance, smooth validation

---

### Component Hierarchy (Tree)

```
App
├── ErrorBoundary
│   └── BrowserRouter
│       ├── GlobalProviders
│       │   ├── ThemeProvider
│       │   ├── AuthProvider
│       │   └── NavigationProvider
│       └── Routes
│           ├── PublicLayout
│           │   ├── PublicHeader
│           │   │   ├── Logo
│           │   │   ├── SearchBar
│           │   │   └── Button (Login CTA)
│           │   ├── Outlet (route content)
│           │   │   ├── MarketplaceHome
│           │   │   │   ├── Hero
│           │   │   │   ├── PropertyCard[] (featured)
│           │   │   │   ├── HowItWorks
│           │   │   │   └── Benefits
│           │   │   ├── PropertySearch
│           │   │   │   ├── FilterPanel
│           │   │   │   ├── PropertyCard[] (results)
│           │   │   │   └── Pagination
│           │   │   ├── PropertyDetail
│           │   │   │   ├── ImageGallery
│           │   │   │   ├── PropertyInfo
│           │   │   │   ├── UnitCard[] (available units)
│           │   │   │   └── Map
│           │   │   └── UnitDetail
│           │   │       ├── UnitSpecs
│           │   │       ├── BiddingSection
│           │   │       └── PlaceBidModal
│           │   └── Footer
│           │
│           ├── ProtectedRoute
│           │   ├── RoleRoute (Tenant)
│           │   │   └── TenantLayout
│           │   │       ├── Header
│           │   │       │   ├── Logo
│           │   │       │   ├── SearchBar (opens CommandPalette)
│           │   │       │   ├── NotificationBell → NotificationPanel
│           │   │       │   ├── MessagesIcon → MessageCenter
│           │   │       │   └── UserMenu (Dropdown)
│           │   │       ├── Sidebar (optional, desktop)
│           │   │       ├── Main (Outlet)
│           │   │       │   ├── TenantDashboard
│           │   │       │   │   ├── Alert[]
│           │   │       │   │   ├── StatCard[] (4 metrics)
│           │   │       │   │   ├── QuickActions[] (6 cards)
│           │   │       │   │   ├── Timeline (activity)
│           │   │       │   │   └── UpcomingEvents
│           │   │       │   ├── TenantPayments
│           │   │       │   │   ├── OutstandingBalanceCard
│           │   │       │   │   ├── PaymentMethodsCard
│           │   │       │   │   ├── Table (payment history)
│           │   │       │   │   ├── AutoPayCard
│           │   │       │   │   └── PaymentProcessorModal
│           │   │       │   ├── TenantMaintenance
│           │   │       │   │   ├── StatsBar
│           │   │       │   │   ├── FilterPanel
│           │   │       │   │   ├── RequestCard[] (list)
│           │   │       │   │   ├── SubmitRequestModal
│           │   │       │   │   └── RequestDetailModal
│           │   │       │   ├── TenantDocuments
│           │   │       │   │   ├── StatsBar
│           │   │       │   │   ├── FilterPanel
│           │   │       │   │   ├── DocumentCard[] (grid)
│           │   │       │   │   ├── DocumentTable (list view)
│           │   │       │   │   ├── DocumentPreviewModal
│           │   │       │   │   └── RequestDocumentModal
│           │   │       │   ├── TenantMessages (MessageCenter)
│           │   │       │   └── TenantProfile
│           │   │       │       ├── PersonalInfoCard (Form)
│           │   │       │       ├── LeaseInfoCard
│           │   │       │       ├── PreferencesCard
│           │   │       │       └── SecurityCard
│           │   │       └── MobileNav (bottom tabs)
│           │   │
│           │   └── RoleRoute (Owner)
│           │       └── OwnerLayout
│           │           ├── Header (with property selector)
│           │           ├── Sidebar (collapsible)
│           │           ├── Main (Outlet)
│           │           │   ├── OwnerDashboard
│           │           │   │   ├── MetricsCards[] (4)
│           │           │   │   ├── Chart (financial)
│           │           │   │   ├── PropertiesTable
│           │           │   │   ├── Timeline
│           │           │   │   ├── AlertsPanel
│           │           │   │   └── QuickActions[]
│           │           │   ├── OwnerProperties
│           │           │   │   ├── Header (stats, add button)
│           │           │   │   ├── FilterPanel
│           │           │   │   ├── PropertyCard[] (grid)
│           │           │   │   ├── PropertyTable (list view)
│           │           │   │   ├── AddPropertyModal
│           │           │   │   └── PropertyDetailModal
│           │           │   ├── OwnerFinances
│           │           │   │   ├── SummaryCards[]
│           │           │   │   ├── Chart (revenue vs expenses)
│           │           │   │   ├── TransactionsTable
│           │           │   │   ├── CategoryPieChart
│           │           │   │   ├── RecordExpenseModal
│           │           │   │   └── GenerateReportModal
│           │           │   ├── OwnerResidents
│           │           │   ├── OwnerMaintenance
│           │           │   ├── OwnerDocuments
│           │           │   ├── OwnerMeetings
│           │           │   └── OwnerSettings
│           │           │       └── Tabs[] (5 tab panels)
│           │           └── MobileNav
│           │
│           └── ErrorRoutes
│               ├── NotFound (404)
│               └── AccessDenied (403)
│
└── GlobalComponents (rendered via portals)
    ├── ToastContainer
    ├── CommandPalette (Cmd+K)
    └── ConfirmationModal
```

---

### Component Wiring (Props, Events, State)

**Example: PropertyCard Component**

```typescript
// Component interface
interface PropertyCardProps {
  property: Property                 // Data
  onFavorite?: (id: string) => void  // Event handler
  onView?: (id: string) => void      // Event handler
  variant?: 'default' | 'compact'    // Style variant
  showActions?: boolean              // Conditional rendering
  className?: string                 // Styling override
}

// Component
export function PropertyCard({
  property,
  onFavorite,
  onView,
  variant = 'default',
  showActions = true,
  className
}: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited)
    onFavorite?.(property.id)
  }

  const handleViewClick = () => {
    onView?.(property.id)
  }

  return (
    <Card className={cn('property-card', variant, className)}>
      <CardImage src={property.photos[0]} alt={property.name} />
      <CardContent>
        <h3>{property.name}</h3>
        <p>{property.address}</p>
        <div className="amenities">
          {property.amenities.map(amenity => (
            <Badge key={amenity}>{amenity}</Badge>
          ))}
        </div>
      </CardContent>
      {showActions && (
        <CardFooter>
          <Button
            variant="ghost"
            icon={isFavorited ? HeartFilled : Heart}
            onClick={handleFavoriteClick}
          />
          <Button variant="primary" onClick={handleViewClick}>
            View Details
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
```

**Prop Patterns:**

1. **Data Props:** Pass domain data (property, user, transaction)
2. **Event Handler Props:** Callbacks for user actions (onClick, onChange, onSubmit)
3. **Style Props:** variant, size, className for customization
4. **Conditional Props:** Boolean flags (showActions, isLoading, isDisabled)
5. **Children Props:** For composition (modal content, card body)

**Event Bubbling:**
- Events bubble up from child to parent
- Parent components handle business logic
- Child components remain presentational

**State Ownership:**
- **Local UI state:** Owned by component (hover, focus, open/closed)
- **Form state:** Managed by React Hook Form
- **Derived state:** Calculated from props
- **Shared state:** Lifted to parent or context
- **Global state:** In Zustand store

**Sources:**
- [React Component Best Practices](https://react.dev/learn/passing-props-to-a-component)
- [Component Composition Patterns](https://www.patterns.dev/react/react-2026/)

---

### Reusable Patterns

**Pattern 1: Compound Components**

For complex components with multiple sub-components:

```typescript
// Tabs component example
<Tabs defaultValue="all">
  <TabsList>
    <TabsTrigger value="all">All</TabsTrigger>
    <TabsTrigger value="active">Active</TabsTrigger>
    <TabsTrigger value="completed">Completed</TabsTrigger>
  </TabsList>
  <TabsContent value="all">...</TabsContent>
  <TabsContent value="active">...</TabsContent>
  <TabsContent value="completed">...</TabsContent>
</Tabs>
```

**Pattern 2: Render Props**

For flexible rendering:

```typescript
<DataTable
  data={items}
  renderRow={(item) => <CustomRow item={item} />}
  renderEmpty={() => <EmptyState />}
/>
```

**Pattern 3: Controlled vs Uncontrolled**

Components support both:

```typescript
// Uncontrolled (internal state)
<Input defaultValue="test" />

// Controlled (external state)
<Input value={value} onChange={setValue} />
```

**Pattern 4: Loading States**

Consistent loading pattern:

```typescript
{loading ? (
  <Skeleton count={5} />
) : error ? (
  <ErrorState error={error} onRetry={refetch} />
) : data.length === 0 ? (
  <EmptyState />
) : (
  <DataList items={data} />
)}
```

**Pattern 5: Modal Pattern**

Consistent modal usage:

```typescript
const [isOpen, setIsOpen] = useState(false)

<Button onClick={() => setIsOpen(true)}>Open</Button>
<Modal open={isOpen} onClose={() => setIsOpen(false)}>
  <ModalHeader>Title</ModalHeader>
  <ModalBody>Content</ModalBody>
  <ModalFooter>
    <Button onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button variant="primary" onClick={handleSubmit}>Submit</Button>
  </ModalFooter>
</Modal>
```

**Source:** [React Patterns](https://www.patterns.dev/react/)

---

## J) STATE & LOGIC DESIGN

### State Domains

**1. Authentication State**
- Current user
- Auth token
- Login status
- User role
- Permissions

**2. Navigation State**
- Current route
- Sidebar open/closed
- Mobile menu open/closed
- Breadcrumbs

**3. UI State**
- Theme (light/dark)
- Language (en/fr)
- Modals (which are open)
- Toast notifications
- Command palette open
- Loading states per feature

**4. Domain Data State** (from mockData)
- Properties
- Units
- Leases
- Bids
- Transactions
- Bills
- Issues
- Documents
- Meetings
- Votes
- Conversations
- Messages
- Notifications

**5. Form State**
- Field values
- Validation errors
- Touched fields
- Submission status
- Dirty state

**6. Filter/Search State**
- Active filters
- Search query
- Sort order
- Pagination (current page, items per page)
- View mode (grid/list)

**7. Preferences State** (localStorage)
- User preferences (notifications, language)
- View preferences (grid vs list)
- Saved filters
- Auto-pay settings
- Onboarding completion

---

### Store Shape (Zustand)

**Recommended State Management Approach (2026):**

Based on research ([State Management 2026](https://www.nucamp.co/blog/state-management-in-2026-redux-context-api-and-modern-patterns)):

- **useState/useReducer:** Local UI state
- **Context API:** Theme, Auth (low-frequency updates)
- **Zustand:** Shared client state (notifications, nav state)
- **React Query:** Server data (future, when backend added)

**Auth Store (Context API):**

```typescript
// AuthContext.tsx
interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for existing session
    const storedUser = localStorage.getItem('okey_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Mock auth logic
    const user = mockUsers.find(u => u.email === email && u.password === password)
    if (!user) throw new Error('Invalid credentials')

    setUser(user)
    localStorage.setItem('okey_user', JSON.stringify(user))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('okey_user')
  }

  const updateUser = (updates: Partial<User>) => {
    if (!user) return
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('okey_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

**Global UI Store (Zustand):**

```typescript
// stores/useUIStore.ts
import { create } from 'zustand'

interface UIStore {
  // Sidebar
  sidebarOpen: boolean
  toggleSidebar: () => void

  // Mobile menu
  mobileMenuOpen: boolean
  toggleMobileMenu: () => void

  // Modals
  modals: Record<string, boolean>
  openModal: (id: string) => void
  closeModal: (id: string) => void

  // Command palette
  commandPaletteOpen: boolean
  toggleCommandPalette: () => void

  // Notifications panel
  notificationsPanelOpen: boolean
  toggleNotificationsPanel: () => void

  // Theme
  theme: 'light' | 'dark' | 'auto'
  setTheme: (theme: 'light' | 'dark' | 'auto') => void

  // Language
  language: 'en' | 'fr'
  setLanguage: (lang: 'en' | 'fr') => void
}

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  sidebarOpen: true,
  mobileMenuOpen: false,
  modals: {},
  commandPaletteOpen: false,
  notificationsPanelOpen: false,
  theme: 'light',
  language: 'en',

  // Actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  openModal: (id) => set((state) => ({
    modals: { ...state.modals, [id]: true }
  })),
  closeModal: (id) => set((state) => ({
    modals: { ...state.modals, [id]: false }
  })),

  toggleCommandPalette: () => set((state) => ({
    commandPaletteOpen: !state.commandPaletteOpen
  })),
  toggleNotificationsPanel: () => set((state) => ({
    notificationsPanelOpen: !state.notificationsPanelOpen
  })),

  setTheme: (theme) => {
    set({ theme })
    localStorage.setItem('theme', theme)
  },
  setLanguage: (language) => {
    set({ language })
    localStorage.setItem('language', language)
  },
}))
```

**Notifications Store (Zustand):**

```typescript
// stores/useNotificationsStore.ts
interface Notification {
  id: string
  type: 'payment' | 'maintenance' | 'message' | 'document' | 'alert'
  title: string
  description: string
  read: boolean
  created_at: string
  action_url?: string
}

interface NotificationsStore {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  loadNotifications: (userId: string) => void
}

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  loadNotifications: (userId) => {
    const notifications = getNotificationsByUser(userId)
    const unreadCount = notifications.filter(n => !n.read).length
    set({ notifications, unreadCount })
  },

  addNotification: (notification) => {
    const newNotification = {
      ...notification,
      id: generateId(),
      created_at: new Date().toISOString(),
    }
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }))
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }))
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0,
    }))
  },

  removeNotification: (id) => {
    set((state) => {
      const notification = state.notifications.find(n => n.id === id)
      const wasUnread = notification && !notification.read
      return {
        notifications: state.notifications.filter(n => n.id !== id),
        unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
      }
    })
  },
}))
```

**Source:** [Zustand Documentation](https://github.com/pmndrs/zustand) and [State Management Best Practices 2026](https://www.developerway.com/posts/react-state-management-2025)

---

### Client-Only Data Handling

**LocalStorage Strategy:**

```typescript
// lib/storage.ts

// Save to localStorage with type safety
export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Load from localStorage with type safety
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return defaultValue
  }
}

// Remove from localStorage
export function removeFromStorage(key: string): void {
  localStorage.removeItem(key)
}

// Clear all storage (logout)
export function clearStorage(): void {
  localStorage.clear()
}
```

**What to Store:**
- User session (token, user object)
- User preferences (theme, language, notification settings)
- View preferences (grid vs list, saved filters)
- Form drafts (auto-save)
- Auto-pay settings
- Onboarding progress

**What NOT to Store:**
- Sensitive data (passwords, payment details)
- Large datasets (store in memory, load from mockData)

**IndexedDB (Future, if needed for larger data):**

```typescript
// For future: Store large datasets client-side
// Use Dexie.js library for IndexedDB abstraction
```

---

### Validation Rules

**Using Zod for Schema Validation:**

```typescript
import { z } from 'zod'

// Example: Maintenance Request validation schema
export const maintenanceRequestSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(100),
  category: z.enum(['plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'emergency']),
  description: z.string().min(20, 'Please provide more details (min 20 characters)').max(1000),
  location: z.string().optional(),
  photos: z.array(z.string()).max(5, 'Maximum 5 photos').optional(),
  access_instructions: z.string().optional(),
})

export type MaintenanceRequestInput = z.infer<typeof maintenanceRequestSchema>
```

**Integration with React Hook Form:**

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

function SubmitRequestForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MaintenanceRequestInput>({
    resolver: zodResolver(maintenanceRequestSchema),
  })

  const onSubmit = async (data: MaintenanceRequestInput) => {
    // Data is type-safe and validated
    await submitRequest(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField>
        <Label>Title</Label>
        <Input {...register('title')} />
        {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
      </FormField>
      {/* More fields... */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Request'}
      </Button>
    </form>
  )
}
```

**Common Validation Schemas:**

1. **Login:**
   - email: valid email format
   - password: min 8 chars

2. **Bid Placement:**
   - amount: number, >= minimum bid, > current high bid
   - lease_term: enum
   - move_in_date: date, future date

3. **Payment:**
   - amount: number, > 0, <= total due
   - payment_method: required

4. **Property Creation:**
   - name: string, min 3 chars
   - address: string, required
   - postal_code: regex format (A1A 1A1 for Canada)
   - year_built: number, between 1800 and current year

**Source:** [React Hook Form Best Practices](https://react-hook-form.com/advanced-usage) and [Zod Documentation](https://zod.dev/)

---

### Derived State

**Pattern: Compute derived values instead of storing:**

```typescript
// ❌ BAD: Storing derived state
const [properties, setProperties] = useState<Property[]>([])
const [totalUnits, setTotalUnits] = useState(0) // Redundant!

useEffect(() => {
  setTotalUnits(properties.reduce((sum, p) => sum + p.total_units, 0))
}, [properties])

// ✅ GOOD: Compute on render
const [properties, setProperties] = useState<Property[]>([])
const totalUnits = properties.reduce((sum, p) => sum + p.total_units, 0)
```

**useMemo for Expensive Computations:**

```typescript
const filteredProperties = useMemo(() => {
  return properties
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(p => filters.type ? p.type === filters.type : true)
    .sort((a, b) => a.name.localeCompare(b.name))
}, [properties, searchQuery, filters])
```

**Source:** [React Performance Optimization](https://react.dev/reference/react/useMemo)

---

### Side Effects Management

**useEffect for Side Effects:**

```typescript
// Load notifications on mount
useEffect(() => {
  const loadData = async () => {
    const notifications = await loadNotificationsFromStorage(user.id)
    setNotifications(notifications)
  }
  loadData()
}, [user.id])

// Sync theme to document
useEffect(() => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}, [theme])

// Keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      toggleCommandPalette()
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [toggleCommandPalette])
```

**Cleanup Pattern:**

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    checkForNewNotifications()
  }, 30000) // Every 30 seconds

  return () => clearInterval(interval) // Cleanup
}, [])
```

---

**Continue to DESIGN_SYSTEM.md for sections K-M...**

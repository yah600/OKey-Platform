# O'KEY PLATFORM - TECHNICAL SPECIFICATIONS
**Performance, Testing & Project Structure**

---

## N) PERFORMANCE & RESPONSIVENESS

### Performance Budgets

**Based on 2026 Standards:**

**Bundle Size Targets:**
- **Initial JS bundle:** < 200 KB (gzipped)
- **Total JS (all chunks):** < 2 MB (gzipped)
- **CSS:** < 50 KB (gzipped)
- **Images per page:** < 500 KB total
- **Fonts:** < 100 KB (WOFF2 format)

**Lighthouse Targets:**
- **Performance:** 90+
- **Accessibility:** 95+
- **Best Practices:** 95+
- **SEO:** 90+

**Core Web Vitals:**
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **INP (Interaction to Next Paint):** < 200ms
- **TTFB (Time to First Byte):** < 800ms

**Source:** [React Performance 2026](https://simplifiedbyharsh.medium.com/ever-wondered-why-your-react-app-feels-slow-heres-what-nobody-tells-you-about-performance-661800dd34f8)

---

### Render Optimization

**1. Code Splitting (Route-Based)**

```typescript
// Lazy load all route components
import { lazy, Suspense } from 'react'

// Marketplace routes
const MarketplaceHome = lazy(() => import('./features/marketplace/marketplace-home'))
const PropertySearch = lazy(() => import('./features/marketplace/property-search'))
const PropertyDetail = lazy(() => import('./features/marketplace/property-detail'))
const UnitDetail = lazy(() => import('./features/marketplace/unit-detail'))

// Tenant routes
const TenantDashboard = lazy(() => import('./features/tenant-portal/TenantDashboard'))
const TenantPayments = lazy(() => import('./features/tenant-portal/TenantPayments'))
// ... etc

// Owner routes
const OwnerDashboard = lazy(() => import('./features/owner-portal/OwnerDashboard'))
const OwnerProperties = lazy(() => import('./features/owner-portal/OwnerProperties'))
// ... etc

// Wrap in Suspense with loading fallback
<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/" element={<MarketplaceHome />} />
    {/* ... */}
  </Routes>
</Suspense>
```

**Benefits:**
- Initial bundle reduced by 70-80%
- Each route loads only when accessed
- Parallel loading of multiple chunks

**Source:** [Code Splitting Best Practices](https://medium.com/@ignatovich.dm/optimizing-react-apps-with-code-splitting-and-lazy-loading-e8c8791006e3)

---

**2. Component-Level Code Splitting**

```typescript
// Split heavy components (charts, image galleries, rich editors)
const PropertyImageGallery = lazy(() => import('./components/PropertyImageGallery'))
const FinancialChart = lazy(() => import('./components/FinancialChart'))
const DocumentViewer = lazy(() => import('./components/DocumentViewer'))

// Usage with fallback
<Suspense fallback={<Skeleton height={400} />}>
  <PropertyImageGallery images={property.photos} />
</Suspense>
```

**When to split components:**
- Size > 50 KB
- Not immediately visible (below fold)
- User interaction required (modal, drawer)
- Heavy dependencies (charts, calendars, editors)

---

**3. React.memo for Expensive Components**

```typescript
// Prevent unnecessary re-renders
export const PropertyCard = React.memo(({ property, onView }: PropertyCardProps) => {
  return (
    <Card>
      {/* ... */}
    </Card>
  )
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if property.id changes
  return prevProps.property.id === nextProps.property.id
})
```

**When to use memo:**
- Pure presentational components
- Large lists with many items
- Expensive render logic
- Frequent parent re-renders

---

**4. useMemo for Expensive Calculations**

```typescript
// Memoize filtered/sorted data
const filteredProperties = useMemo(() => {
  return properties
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(p => !filters.type || p.type === filters.type)
    .filter(p => !filters.minPrice || p.rent >= filters.minPrice)
    .filter(p => !filters.maxPrice || p.rent <= filters.maxPrice)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.rent - b.rent
      if (sortBy === 'price-desc') return b.rent - a.rent
      return a.name.localeCompare(b.name)
    })
}, [properties, searchQuery, filters, sortBy])
```

**When to use useMemo:**
- Filtering/sorting large arrays
- Complex calculations
- Object/array creation passed as props

---

**5. useCallback for Event Handlers**

```typescript
// Prevent child re-renders from function reference changes
const handlePropertyClick = useCallback((propertyId: string) => {
  navigate(`/properties/${propertyId}`)
}, [navigate])

<PropertyCard onView={handlePropertyClick} />
```

---

**6. Virtual Scrolling for Long Lists**

```typescript
// Use react-window for 100+ items
import { FixedSizeList } from 'react-window'

const PropertyList = ({ properties }: { properties: Property[] }) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <PropertyCard property={properties[index]} />
    </div>
  )

  return (
    <FixedSizeList
      height={600}
      itemCount={properties.length}
      itemSize={200}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  )
}
```

**When to use virtualization:**
- Lists with 100+ items
- Infinite scroll
- Large tables

---

### Image Optimization Strategy

**1. Modern Formats**

```typescript
// Use WebP with fallbacks
<picture>
  <source srcSet={property.image.webp} type="image/webp" />
  <source srcSet={property.image.jpg} type="image/jpeg" />
  <img src={property.image.jpg} alt={property.name} />
</picture>
```

**2. Responsive Images**

```typescript
// Serve appropriate sizes
<img
  src={property.image.src}
  srcSet={`
    ${property.image.small} 400w,
    ${property.image.medium} 800w,
    ${property.image.large} 1200w
  `}
  sizes="(max-width: 768px) 400px, (max-width: 1024px) 800px, 1200px"
  alt={property.name}
/>
```

**3. Lazy Loading**

```typescript
// Native lazy loading
<img
  src={property.image.src}
  loading="lazy"
  alt={property.name}
/>

// Or with Intersection Observer for more control
import { useInView } from 'react-intersection-observer'

const LazyImage = ({ src, alt }: { src: string; alt: string }) => {
  const { ref, inView } = useInView({ triggerOnce: true })

  return (
    <div ref={ref}>
      {inView ? <img src={src} alt={alt} /> : <Skeleton />}
    </div>
  )
}
```

**4. Image Compression**

- Use tools: ImageOptim, TinyPNG, Squoosh
- Target: < 100 KB per image
- Quality: 80-85% for JPG

**5. Placeholder Strategy**

```typescript
// Low-quality image placeholder (LQIP)
<img
  src={property.image.lqip} // 20x15 blurred version
  style={{ filter: 'blur(10px)' }}
  onLoad={() => setHighQualityLoaded(true)}
/>
{highQualityLoaded && (
  <img src={property.image.full} />
)}

// Or dominant color placeholder
<div style={{ backgroundColor: property.image.dominantColor }}>
  <img src={property.image.src} />
</div>
```

---

### Lazy Loading Patterns

**1. Route-Based (already covered)**

**2. Component-Based**

```typescript
// Modal content only loads when opened
const PaymentProcessorModal = lazy(() => import('./PaymentProcessorModal'))

{isPaymentModalOpen && (
  <Suspense fallback={<ModalSkeleton />}>
    <PaymentProcessorModal onClose={closePaymentModal} />
  </Suspense>
)}
```

**3. Below-the-Fold Content**

```typescript
// Load content only when scrolled into view
const Footer = lazy(() => import('./components/Footer'))

function App() {
  return (
    <div>
      {/* Above-fold content loads immediately */}
      <Header />
      <Hero />
      <FeaturedProperties />

      {/* Below-fold content lazy loads */}
      <Suspense fallback={null}>
        <HowItWorks />
        <Testimonials />
        <Footer />
      </Suspense>
    </div>
  )
}
```

**4. Third-Party Libraries**

```typescript
// Heavy libraries only when needed
const loadChart = () => import('recharts')

const [Chart, setChart] = useState<any>(null)

useEffect(() => {
  loadChart().then(module => setChart(module))
}, [])
```

---

### Font Loading Strategy

**1. Self-Host Fonts (Faster than Google Fonts)**

```css
/* Preload critical fonts */
<link
  rel="preload"
  href="/fonts/inter-var.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>

/* Font-face with font-display */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap; /* Show fallback immediately, swap when loaded */
  font-style: normal;
}
```

**2. Subset Fonts**

- Include only characters needed
- Latin subset usually sufficient
- Reduces font file size by 50-70%

**3. Variable Fonts**

- Single file for all weights
- Better performance than multiple files
- Modern browsers support

---

### Debouncing & Throttling

**Debounce Search Input:**

```typescript
import { useDebouncedValue } from '@mantine/hooks' // or custom hook

const [searchQuery, setSearchQuery] = useState('')
const [debouncedQuery] = useDebouncedValue(searchQuery, 300)

// Expensive search only runs after user stops typing
useEffect(() => {
  if (debouncedQuery) {
    performSearch(debouncedQuery)
  }
}, [debouncedQuery])
```

**Throttle Scroll/Resize:**

```typescript
import { throttle } from 'lodash'

const handleScroll = throttle(() => {
  // Expensive scroll handler
}, 100) // Max once per 100ms

useEffect(() => {
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

---

### Vite Build Optimization

**vite.config.ts:**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', '@liquid-glass/ui'],
          'form-vendor': ['react-hook-form', 'zod'],
          'chart-vendor': ['recharts'],
        }
      }
    },
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 500
  },
  // Optimization during dev
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
```

**Source:** [Vite Best Practices 2026](https://medium.com/@robinviktorsson/complete-guide-to-setting-up-react-with-typescript-and-vite-2025-468f6556aaf2)

---

## O) TESTING STRATEGY

### Testing Pyramid

```
        /\
       /  \  E2E (5%)
      /    \
     /------\ Integration (15%)
    /        \
   /----------\ Unit (80%)
  /____________\
```

**Philosophy:**
- **80% Unit Tests** - Fast, isolated, component logic
- **15% Integration Tests** - Component interactions, data flow
- **5% E2E Tests** - Critical user paths

---

### Unit Testing (Vitest + React Testing Library)

**Setup:**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**vitest.config.ts:**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
      ]
    }
  }
})
```

**Example Unit Test:**

```typescript
// PropertyCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { PropertyCard } from './PropertyCard'

describe('PropertyCard', () => {
  const mockProperty = {
    id: '1',
    name: 'Maple Heights',
    address: '123 Maple St',
    rent: 1500,
    bedrooms: 2,
    bathrooms: 1,
    photos: ['photo.jpg']
  }

  it('renders property information', () => {
    render(<PropertyCard property={mockProperty} />)

    expect(screen.getByText('Maple Heights')).toBeInTheDocument()
    expect(screen.getByText('123 Maple St')).toBeInTheDocument()
    expect(screen.getByText('$1,500')).toBeInTheDocument()
  })

  it('calls onView when View Details clicked', () => {
    const handleView = vi.fn()
    render(<PropertyCard property={mockProperty} onView={handleView} />)

    const button = screen.getByRole('button', { name: /view details/i })
    fireEvent.click(button)

    expect(handleView).toHaveBeenCalledWith('1')
  })

  it('toggles favorite state', () => {
    const handleFavorite = vi.fn()
    render(<PropertyCard property={mockProperty} onFavorite={handleFavorite} />)

    const favoriteBtn = screen.getByLabelText(/favorite/i)
    fireEvent.click(favoriteBtn)

    expect(handleFavorite).toHaveBeenCalledWith('1')
  })
})
```

**What to Test:**
- Component renders correctly
- Props passed correctly
- User interactions (clicks, typing)
- Conditional rendering
- Error states
- Accessibility (ARIA labels, roles)

**What NOT to Test:**
- Implementation details
- Third-party library internals
- Trivial code (getters/setters)

---

### Integration Testing

**Test Component Interactions:**

```typescript
// TenantPayments.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TenantPayments } from './TenantPayments'
import { AuthProvider } from '@/context/AuthContext'

describe('TenantPayments Integration', () => {
  it('allows tenant to make payment', async () => {
    const user = userEvent.setup()

    render(
      <AuthProvider>
        <TenantPayments />
      </AuthProvider>
    )

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/outstanding balance/i)).toBeInTheDocument()
    })

    // Click Pay Now
    const payButton = screen.getByRole('button', { name: /pay now/i })
    await user.click(payButton)

    // Modal should open
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    // Enter payment details
    const amountInput = screen.getByLabelText(/amount/i)
    await user.clear(amountInput)
    await user.type(amountInput, '1500')

    // Submit payment
    const submitButton = screen.getByRole('button', { name: /submit payment/i })
    await user.click(submitButton)

    // Success message should appear
    await waitFor(() => {
      expect(screen.getByText(/payment successful/i)).toBeInTheDocument()
    })

    // Balance should update
    expect(screen.getByText(/\$0/i)).toBeInTheDocument()
  })
})
```

---

### E2E Testing (Playwright - Optional)

**For critical user paths:**

```typescript
// e2e/bid-placement.spec.ts
import { test, expect } from '@playwright/test'

test('user can place bid on unit', async ({ page }) => {
  // Navigate to marketplace
  await page.goto('http://localhost:3000')

  // Search for property
  await page.fill('[placeholder="Search properties"]', 'Maple Heights')
  await page.click('button:has-text("Search")')

  // Click property
  await page.click('text=Maple Heights')

  // Click unit
  await page.click('text=Unit 204')

  // Login if not authenticated
  const loginButton = page.locator('text=Login to Place Bid')
  if (await loginButton.isVisible()) {
    await loginButton.click()
    await page.fill('[name="email"]', 'tenant@okey.com')
    await page.fill('[name="password"]', 'tenant123')
    await page.click('button:has-text("Sign In")')
  }

  // Place bid
  await page.click('button:has-text("Place Bid")')
  await page.fill('[name="amount"]', '1600')
  await page.selectOption('[name="leaseTerm"]', '1-year')
  await page.click('button:has-text("Submit Bid")')

  // Verify success
  await expect(page.locator('text=Bid placed successfully')).toBeVisible()
})
```

---

### Visual Regression Testing (Optional)

**Using Chromatic or Percy:**

```bash
npm install -D @storybook/react
npx chromatic --project-token=<token>
```

**Benefits:**
- Catch unintended UI changes
- Visual diff of components
- Cross-browser testing

---

### Accessibility Testing

**Automated (Axe DevTools):**

```typescript
// Button.test.tsx
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

it('has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

**Manual Testing Checklist:**
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly (test with NVDA/VoiceOver)
- [ ] Focus indicators visible
- [ ] Color contrast passes
- [ ] ARIA labels present
- [ ] Form validation accessible

---

### Coverage Targets

**Minimum Coverage:**
- **Statements:** 80%
- **Branches:** 75%
- **Functions:** 80%
- **Lines:** 80%

**Run Coverage:**

```bash
npm run test:coverage
```

**Focus Coverage On:**
- Business logic functions
- Form validation
- Data transformation
- Calculations (rent, totals, etc.)
- Critical user paths

**Skip Coverage For:**
- Type definitions
- Constants
- Mock data
- Third-party wrappers

---

## P) PROJECT STRUCTURE

### Folder Organization

**Based on Feature-First Architecture:**

```
/OKey-Platform
├── /public
│   ├── /fonts              # Self-hosted fonts
│   ├── /images             # Static images
│   └── favicon.ico
│
├── /src
│   ├── /assets             # Images, icons used in components
│   │   ├── /images
│   │   └── /icons
│   │
│   ├── /components         # Shared/global components
│   │   ├── /auth
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── RoleRoute.tsx
│   │   ├── /global
│   │   │   ├── CommandPalette.tsx
│   │   │   ├── NotificationsPanel.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── LoadingScreen.tsx
│   │   │   └── Toast.tsx
│   │   ├── /layout
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Footer.tsx
│   │   ├── /ui             # Reusable UI components (atoms/molecules)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Tabs.tsx
│   │   │   └── ... (all UI components)
│   │   └── /messaging
│   │       └── MessageCenter.tsx
│   │
│   ├── /features           # Feature modules (domain-specific)
│   │   ├── /auth
│   │   │   └── LoginPage.tsx
│   │   ├── /marketplace
│   │   │   ├── marketplace-home.tsx
│   │   │   ├── property-search.tsx
│   │   │   ├── property-detail.tsx
│   │   │   ├── unit-detail.tsx
│   │   │   └── my-bids.tsx
│   │   ├── /tenant-portal
│   │   │   ├── TenantDashboard.tsx
│   │   │   ├── TenantPayments.tsx
│   │   │   ├── TenantMaintenance.tsx
│   │   │   ├── TenantDocuments.tsx
│   │   │   ├── TenantMessages.tsx
│   │   │   └── TenantProfile.tsx
│   │   ├── /owner-portal
│   │   │   ├── OwnerDashboard.tsx
│   │   │   ├── OwnerProperties.tsx
│   │   │   ├── OwnerFinances.tsx
│   │   │   ├── OwnerResidents.tsx
│   │   │   ├── OwnerMaintenance.tsx
│   │   │   ├── OwnerDocuments.tsx
│   │   │   ├── OwnerMeetings.tsx
│   │   │   └── OwnerSettings.tsx
│   │   └── /help
│   │       └── HelpCenter.tsx
│   │
│   ├── /context            # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── NavigationContext.tsx
│   │
│   ├── /stores             # Zustand stores
│   │   ├── useUIStore.ts
│   │   └── useNotificationsStore.ts
│   │
│   ├── /hooks              # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useLocalStorage.ts
│   │   └── useReducedMotion.ts
│   │
│   ├── /lib                # Utilities, helpers, config
│   │   ├── /data
│   │   │   └── mockData.ts # Mock data + helper functions
│   │   ├── /utils
│   │   │   ├── formatters.ts (date, currency, etc.)
│   │   │   ├── validators.ts
│   │   │   └── helpers.ts
│   │   ├── /schemas        # Zod validation schemas
│   │   │   ├── auth.schema.ts
│   │   │   ├── bid.schema.ts
│   │   │   ├── maintenance.schema.ts
│   │   │   └── ... (all schemas)
│   │   ├── storage.ts      # localStorage utilities
│   │   └── constants.ts    # App-wide constants
│   │
│   ├── /styles             # Global styles
│   │   ├── globals.css     # Tailwind directives, global CSS
│   │   └── tokens.css      # CSS custom properties (design tokens)
│   │
│   ├── /types              # TypeScript type definitions
│   │   ├── index.ts        # Main types (User, Property, etc.)
│   │   └── api.types.ts    # API-related types (future)
│   │
│   ├── /pages              # Error pages, static pages
│   │   ├── NotFound.tsx    # 404
│   │   └── AccessDenied.tsx # 403
│   │
│   ├── /test               # Test utilities and setup
│   │   ├── setup.ts
│   │   ├── mocks.ts
│   │   └── test-utils.tsx
│   │
│   ├── App.tsx             # Root component with routing
│   ├── main.tsx            # Entry point
│   └── vite-env.d.ts       # Vite types
│
├── .env.example            # Environment variables template
├── .eslintrc.json          # ESLint configuration
├── .prettierrc             # Prettier configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── vitest.config.ts        # Vitest configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── package.json
├── README.md
├── CONTEXT.md
├── FEATURE_PLAN.md
├── RESEARCH_DOSSIER.md
├── IMPLEMENTATION_PLAN.md
├── UX_ARCHITECTURE.md
├── COMPONENT_ARCHITECTURE.md
├── DESIGN_SYSTEM.md
├── TECHNICAL_SPECS.md      # This file
└── BUILDER_HANDOFF.md      # Next file
```

**Source:** [React Best Practices 2026](https://www.patterns.dev/react/react-2026/)

---

### File Naming Conventions

**Components:**
- **PascalCase** for component files: `PropertyCard.tsx`
- **PascalCase** for component names: `export function PropertyCard()`

**Utilities/Hooks:**
- **camelCase** for files: `useAuth.ts`, `formatCurrency.ts`
- **camelCase** for exports: `export function useAuth()`, `export function formatCurrency()`

**Constants:**
- **SCREAMING_SNAKE_CASE** for constants: `export const MAX_FILE_SIZE = 5000000`

**Folders:**
- **kebab-case** for multi-word folders: `tenant-portal`, `owner-portal`
- **lowercase** for single-word: `components`, `features`, `hooks`

**Test Files:**
- **Same name as component** with `.test.tsx`: `PropertyCard.test.tsx`
- **Co-located** with component: `PropertyCard.tsx` + `PropertyCard.test.tsx`

**Source:** [Vite Naming Conventions](https://medium.com/@taedmonds/best-practices-for-react-js-with-vite-and-typescript-what-i-use-and-why-f4482558ed89)

---

### Import Aliases

**tsconfig.json:**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/features/*": ["./src/features/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/context/*": ["./src/context/*"]
    }
  }
}
```

**vite.config.ts:**

```typescript
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/stores': path.resolve(__dirname, './src/stores'),
      '@/context': path.resolve(__dirname, './src/context'),
    }
  }
})
```

**Usage:**

```typescript
// ❌ BAD: Relative imports
import { Button } from '../../../components/ui/Button'
import { useAuth } from '../../../hooks/useAuth'

// ✅ GOOD: Aliased imports
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
```

---

### Module Boundaries

**Enforce Separation:**

1. **Components** should NOT import from **Features**
2. **Features** CAN import from **Components**
3. **Lib/Utils** should NOT import from **Components** or **Features**
4. **Hooks** CAN import from **Lib**, NOT from **Features**

**Example:**

```typescript
// ✅ ALLOWED
// Feature imports component
import { Button } from '@/components/ui/Button'

// Component imports hook
import { useAuth } from '@/hooks/useAuth'

// Hook imports util
import { formatCurrency } from '@/lib/utils/formatters'

// ❌ NOT ALLOWED
// Component imports feature
import { TenantDashboard } from '@/features/tenant-portal/TenantDashboard' // NO!

// Util imports component
import { Button } from '@/components/ui/Button' // NO!
```

---

## Q) RISKS, ASSUMPTIONS, OPEN QUESTIONS

### Risks

**1. Performance Risk: Large Mock Data**
- **Risk:** Loading all mock data at once could slow initial load
- **Mitigation:**
  - Lazy load data per feature
  - Use IndexedDB for larger datasets (future)
  - Pagination on all lists
  - Virtual scrolling for 100+ items

**2. State Management Complexity**
- **Risk:** Multiple state sources (Context, Zustand, localStorage) could cause sync issues
- **Mitigation:**
  - Clear separation of concerns (auth in Context, UI in Zustand)
  - Single source of truth for each data domain
  - Documented state ownership

**3. Browser Compatibility**
- **Risk:** Liquid Glass effects (backdrop-filter) not supported in older browsers
- **Mitigation:**
  - Graceful degradation (solid backgrounds fallback)
  - Feature detection with `@supports`
  - Target modern browsers only (last 2 versions)

**4. Accessibility Violations**
- **Risk:** Complex UI interactions may have a11y issues
- **Mitigation:**
  - Automated testing with Axe
  - Manual testing with screen readers
  - Follow ARIA patterns strictly
  - Regular accessibility audits

**5. Over-Engineering**
- **Risk:** Adding features not in spec, gold-plating
- **Mitigation:**
  - Strict adherence to feature list
  - Code reviews
  - "YAGNI" principle (You Aren't Gonna Need It)

---

### Assumptions

**1. Modern Browser Environment**
- **Assumption:** Users on Chrome, Safari, Firefox, Edge (last 2 versions)
- **Impact:** Can use modern CSS (grid, backdrop-filter, container queries)

**2. No Backend During Development**
- **Assumption:** All data from mockData.ts, no API calls
- **Impact:** Need to design data layer for easy backend swap later

**3. English Primary Language**
- **Assumption:** English UI text, French as secondary (i18n structure ready but not fully translated)
- **Impact:** All text in English initially, i18n keys for future translation

**4. Desktop-First Usage**
- **Assumption:** Primary usage on desktop, but fully responsive
- **Impact:** Desktop experience optimized, mobile functional but not native-app-like

**5. Single Currency (CAD)**
- **Assumption:** All amounts in Canadian dollars
- **Impact:** No multi-currency support needed

**6. Mock Authentication Sufficient**
- **Assumption:** Demo accounts acceptable for development
- **Impact:** Real auth deferred to backend integration phase

---

### Open Questions

**1. Third-Party Integrations**
- **Q:** How to mock Stripe, DocuSign, QuickBooks integrations?
- **Options:**
  - A) Show "Coming Soon" placeholders
  - B) Mock entire flow with fake data
  - C) Use sandbox APIs (requires backend)
- **Recommendation:** Option B (mock entire flow)

**2. Image/File Storage**
- **Q:** Where to store uploaded images (property photos, document files)?
- **Options:**
  - A) Base64 encode in localStorage (limited, ~5MB total)
  - B) IndexedDB (more storage, ~50MB+)
  - C) External service like Imgur (requires API)
- **Recommendation:** Option A for now (small dataset), B if needed

**3. Real-Time Features**
- **Q:** How to simulate real-time notifications and messages?
- **Options:**
  - A) Polling with setInterval (every 30s)
  - B) Mock WebSocket events
  - C) Manual refresh only
- **Recommendation:** Option A (polling) for demo

**4. Email Notifications**
- **Q:** How to handle email sending (rent reminders, notifications)?
- **Options:**
  - A) Log to console only
  - B) Show in-app notification instead
  - C) Mock email preview UI
- **Recommendation:** Option B (in-app notifications replace emails)

**5. Data Persistence**
- **Q:** Should user actions persist across page refreshes?
- **Options:**
  - A) All data resets on refresh
  - B) Save to localStorage (limited)
  - C) Save to IndexedDB (more robust)
- **Recommendation:** Option B for user session and preferences, A for transactional data

**6. Multi-Tenancy**
- **Q:** Can one owner manage properties for multiple other owners (property manager role)?
- **Options:**
  - A) Yes, property_manager role sees all assigned properties
  - B) No, each owner only sees their own
- **Recommendation:** Option A (matches spec, property_manager role exists)

**7. Search Performance**
- **Q:** How to handle search with 100+ properties without backend?
- **Options:**
  - A) Client-side search/filter all data
  - B) Use Web Workers for heavy filtering
  - C) Limit dataset to 50 properties
- **Recommendation:** Option A with debouncing, C if performance issues

**8. Analytics/Tracking**
- **Q:** Should we track user actions for analytics?
- **Options:**
  - A) No tracking (privacy-focused)
  - B) Console logging only
  - C) Google Analytics / Plausible
- **Recommendation:** Option B (dev logging only)

**9. Error Reporting**
- **Q:** How to handle production errors?
- **Options:**
  - A) Console logging only
  - B) Sentry / Rollbar integration
  - C) Custom error logging to localStorage
- **Recommendation:** Option A for now, B for production (future)

**10. Internationalization (i18n)**
- **Q:** Full bilingual support (English/French) or English-first?
- **Options:**
  - A) English only, i18n structure ready
  - B) Full bilingual with translated strings
  - C) Language toggle but incomplete translations
- **Recommendation:** Option A (matches "locale specific" note in spec)

---

### Decision Log

**Track key decisions here as development proceeds:**

| Date | Decision | Rationale | Impact |
|------|----------|-----------|--------|
| 2026-01-22 | Use Liquid Glass UI + React Cupertino | Authentic Apple style, open-source, well-maintained | Need to learn new library, but best match for requirements |
| 2026-01-22 | Zustand for global state | Lighter than Redux, growing popularity, good DX | Easier to learn, less boilerplate |
| 2026-01-22 | Vitest for testing | Fast, Vite-native, familiar API | Better performance than Jest with Vite |
| TBD | ... | ... | ... |

---

**This completes TECHNICAL_SPECS.md. Final file (BUILDER_HANDOFF.md) next...**

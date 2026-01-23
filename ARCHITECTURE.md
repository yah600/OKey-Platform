# O'Key Platform - Architecture Documentation

## System Overview

The O'Key Platform is a comprehensive property management and rental marketplace application built with modern web technologies. It serves three primary user roles: anonymous marketplace visitors, tenants, and property owners.

## Tech Stack

### Core Framework
- **React 18.3** - UI library with concurrent features
- **TypeScript 5.7** - Type-safe JavaScript
- **Vite 6.3** - Build tool and dev server
- **React Router DOM 7.12** - Client-side routing

### State Management
- **Zustand 5.0** - Lightweight state management
- **localStorage persistence** - Client-side data persistence
- **React Context** - Auth and global app state

### UI & Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Lucide React 0.468** - Icon library
- **Recharts 2.15** - Data visualization
- **Custom component library** - 48 reusable components

### Form Management
- **React Hook Form 7.54** - Form state and validation
- **Zod 3.24** - Schema validation

### Testing
- **Vitest 4.0** - Unit testing framework
- **React Testing Library 16.1** - Component testing
- **jsdom** - DOM simulation for tests

### Development
- **ESLint** - Code linting
- **PostCSS & Autoprefixer** - CSS processing
- **TypeScript strict mode** - Maximum type safety

---

## Project Structure

```
src/
├── assets/               # Static assets (images, fonts)
├── components/           # Reusable UI components
│   ├── atoms/           # Basic building blocks (13 components)
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Icon.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Textarea.tsx
│   │   └── ...
│   ├── molecules/       # Composed components (15 components)
│   │   ├── AreaChart.tsx
│   │   ├── Card.tsx
│   │   ├── DatePicker.tsx
│   │   ├── MultiSelect.tsx
│   │   ├── PieChart.tsx
│   │   ├── Rating.tsx
│   │   ├── SearchBar.tsx
│   │   └── ...
│   ├── organisms/       # Complex components (20 components)
│   │   ├── CommandPalette.tsx
│   │   ├── EmptyState.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── Modal.tsx
│   │   ├── NotificationsPanel.tsx
│   │   ├── TreeView.tsx
│   │   └── ...
│   ├── global/          # Global utilities
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── SkipLink.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── ...
│   ├── ui/              # UI layer components
│   ├── lease/           # Lease-specific components
│   ├── checklists/      # Checklist-specific components
│   ├── skeletons/       # Loading skeletons (7 types)
│   └── ...
├── context/             # React Context providers
│   ├── AppContext.tsx
│   ├── AuthContext.tsx
│   └── BidContext.tsx
├── hooks/               # Custom React hooks
│   ├── useAriaLive.ts
│   ├── useFocusTrap.ts
│   ├── useFocusRestore.ts
│   └── useDebounce.ts
├── layouts/             # Page layouts
│   └── DashboardLayout.tsx
├── lib/                 # Utilities and configurations
│   ├── api/            # API service layer
│   │   ├── base.ts     # HTTP client
│   │   ├── auth.ts
│   │   ├── properties.ts
│   │   ├── tenants.ts
│   │   ├── payments.ts
│   │   └── ...
│   ├── schemas/        # Zod validation schemas
│   ├── templates/      # Data templates (lease templates)
│   ├── config.ts       # Environment configuration
│   └── utils.ts        # Utility functions
├── pages/               # Page components (45 pages)
│   ├── marketplace/    # Public marketplace (5 pages)
│   ├── tenant/         # Tenant portal (7 pages)
│   ├── owner/          # Owner portal (20+ pages)
│   ├── compliance/     # Quebec Law 16 compliance (5 pages)
│   ├── errors/         # Error pages
│   └── shared/         # Shared pages
├── store/               # Zustand stores (13 stores)
│   ├── authStore.ts
│   ├── bidsStore.ts
│   ├── checklistStore.ts
│   ├── documentsStore.ts
│   ├── expenseStore.ts
│   ├── leaseBuilderStore.ts
│   ├── maintenanceStore.ts
│   ├── messagesStore.ts
│   ├── ownerPropertiesStore.ts
│   ├── paymentsStore.ts
│   ├── propertySearchStore.ts
│   ├── tenantScreeningStore.ts
│   └── utilityStore.ts
├── styles/              # Global styles
│   └── globals.css
├── test/                # Test utilities
│   ├── setup.ts
│   └── utils.tsx
├── types/               # TypeScript type definitions
│   ├── bid.ts
│   ├── checklist.ts
│   ├── expense.ts
│   ├── lease.ts
│   ├── property.ts
│   ├── screening.ts
│   ├── tenant.ts
│   └── ...
├── App.tsx              # Root component with routing
└── main.tsx             # Application entry point
```

---

## Architecture Patterns

### 1. Component Hierarchy (Atomic Design)

We follow Atomic Design principles for component organization:

- **Atoms** - Basic building blocks (Button, Input, Badge, Icon)
- **Molecules** - Simple combinations (DatePicker, Rating, SearchBar)
- **Organisms** - Complex UI sections (Modal, CommandPalette, FilterPanel)
- **Pages** - Full pages composing all components

### 2. State Management Strategy

#### Zustand Stores
- **Lightweight and performant** - No Provider wrappers needed
- **localStorage persistence** - Automatic data persistence
- **TypeScript-first** - Full type safety
- **Modular architecture** - Each domain has its own store

Example store structure:
```typescript
export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      // State
      expenses: [],
      budgets: [],

      // Actions
      addExpense: (expense) => { /* ... */ },
      updateBudget: (id, budget) => { /* ... */ },

      // Computed values
      getTotalExpenses: () => { /* ... */ },
    }),
    { name: 'expense-storage' }
  )
);
```

#### React Context
Used only for:
- **Authentication state** - User session management
- **Global app state** - Theme, language preferences
- **Cross-cutting concerns** - Error boundaries

### 3. Routing Architecture

All routes are **lazy-loaded** using `React.lazy()` and `Suspense` for optimal performance:

```typescript
const LeaseBuilder = lazy(() => import('./pages/owner/LeaseBuilder'));

<Route path="lease/new" element={
  <Suspense fallback={<LoadingScreen />}>
    <LeaseBuilder />
  </Suspense>
} />
```

**Route structure:**
- `/` - Public marketplace
- `/tenant/*` - Tenant portal (protected)
- `/owner/*` - Owner portal (protected)
- `/compliance/*` - Quebec Law 16 compliance pages

### 4. Form Management

All forms use **React Hook Form + Zod**:

```typescript
const formSchema = z.object({
  propertyName: z.string().min(1, 'Property name is required'),
  price: z.number().min(0),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(formSchema),
});
```

Benefits:
- Type-safe validation
- Minimal re-renders
- Built-in error handling
- Easy integration with TypeScript

### 5. API Service Layer

Centralized API client ready for backend integration:

```typescript
// src/lib/api/base.ts
export class ApiClient {
  async get<T>(endpoint: string): Promise<T> { /* ... */ }
  async post<T>(endpoint: string, data: unknown): Promise<T> { /* ... */ }
  // ...
}

// Domain-specific API modules
export const propertiesApi = {
  getAll: () => apiClient.get<Property[]>('/properties'),
  create: (data: CreatePropertyDTO) => apiClient.post<Property>('/properties', data),
};
```

Currently uses mock data, but structure is ready for Supabase or REST API integration.

---

## Performance Optimizations

### Code Splitting
- **Route-level splitting** - Each page is a separate chunk
- **Manual vendor chunking** - Separate bundles for:
  - `react-vendor` - React, React DOM, React Router
  - `ui-vendor` - Lucide icons, Radix UI
  - `form-vendor` - React Hook Form, Zod
  - `chart-vendor` - Recharts
  - `state-vendor` - Zustand

### Bundle Size
- **Total**: 951 KB (52% under 2MB target)
- **Initial bundle**: 51.90 KB gzipped (74% under 200KB target)
- **Largest route**: LeaseBuilder (51.64 KB)
- **Average route**: ~10-15 KB

### Lazy Loading
- All 45+ routes lazy-loaded
- Heavy components lazy-loaded (charts, editors)
- Images with `loading="lazy"` attribute

### Caching Strategy
- localStorage for user data and drafts
- Session storage for temporary UI state
- In-memory caching for API responses (future)

---

## Data Flow

### 1. User Authentication Flow
```
Login Page
  ↓
Auth Store (Zustand)
  ↓
localStorage persistence
  ↓
Protected Route Middleware
  ↓
Dashboard (role-based)
```

### 2. Property Search Flow
```
PropertySearch Page
  ↓
propertySearchStore (filters, results)
  ↓
FilterPanel (user interactions)
  ↓
updateFilters() action
  ↓
filteredProperties computed value
  ↓
PropertyCard components
```

### 3. Payment Flow
```
TenantPayments Page
  ↓
paymentsStore (payment history)
  ↓
makePayment() action
  ↓
API call (currently mock)
  ↓
Update store state
  ↓
Re-render with new data
```

### 4. Lease Creation Flow
```
LeaseBuilder Page
  ↓
leaseBuilderStore (wizard state)
  ↓
7-step wizard navigation
  ↓
saveDraft() on each step
  ↓
localStorage persistence
  ↓
finalizeLease() generates PDF
```

---

## Accessibility (WCAG 2.1 Level AA)

### Focus Management
- **useFocusTrap** - Traps focus within modals
- **useFocusRestore** - Restores focus after modal close
- **SkipLink** - Skip to main content for keyboard users
- Visible focus indicators (2px outline, high contrast)

### Screen Reader Support
- **ARIA labels** on all interactive elements
- **role** attributes (dialog, navigation, main)
- **aria-live** regions for dynamic content
- **aria-describedby** for error messages

### Keyboard Navigation
- All features accessible via keyboard
- Tab order follows visual hierarchy
- Escape closes modals/dropdowns
- Arrow keys navigate lists

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Dark Mode
- System preference detection
- Manual toggle in header
- Proper contrast ratios (4.5:1 minimum)
- Dark mode aware components

---

## Testing Strategy

### Unit Tests
- Component behavior testing
- Store action testing
- Utility function testing
- **Target**: 80% coverage

### Integration Tests
- Page-level user flows
- Multi-step processes
- Form submissions
- **Target**: 75% coverage

### Test Structure
```typescript
describe('Component', () => {
  beforeEach(() => {
    // Setup
  });

  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    render(<Component />);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(mockAction).toHaveBeenCalled();
    });
  });
});
```

---

## Security Considerations

### Authentication
- JWT tokens (when backend integrated)
- Secure session storage
- Automatic token refresh
- Role-based access control

### Input Validation
- Zod schema validation on all forms
- Server-side validation (future)
- XSS prevention via React's built-in escaping
- SQL injection prevention (parameterized queries in backend)

### Data Protection
- No sensitive data in localStorage
- HTTPS enforcement in production
- CORS configuration for API
- CSP headers (future)

---

## Deployment Architecture

### Build Process
```bash
npm run build
  ↓
Vite build (TypeScript → JavaScript)
  ↓
Tailwind CSS purge (remove unused styles)
  ↓
Minification (terser)
  ↓
Code splitting (manual chunks)
  ↓
dist/ folder (production assets)
```

### Environment Configuration
- `.env.example` - Template
- `.env.local` - Local development
- `.env.production` - Production settings

### Hosting Recommendations
- **Frontend**: Vercel, Netlify, or Cloudflare Pages
- **Backend** (future): Supabase or custom Node.js API
- **CDN**: Cloudflare or AWS CloudFront
- **Database** (future): Supabase PostgreSQL

---

## Future Enhancements

### Phase 7: Backend Integration
- Supabase setup (PostgreSQL + Auth + Storage)
- Real-time subscriptions for notifications
- Row-level security policies
- File storage for documents/images

### Phase 8: Advanced Features
- Real-time chat with Socket.io
- Email notifications (SendGrid)
- SMS notifications (Twilio)
- Payment processing (Stripe)
- Document signing (DocuSign)

### Phase 9: Mobile App
- React Native version
- Shared business logic
- Native push notifications
- Offline-first architecture

### Phase 10: Analytics & Monitoring
- Google Analytics 4
- Sentry error tracking
- LogRocket session replay
- Performance monitoring (Web Vitals)

---

## Development Workflow

### Starting Development
```bash
npm install
npm run dev
# App runs on http://localhost:5173
```

### Running Tests
```bash
npm test              # Run all tests
npm test:ui           # Open Vitest UI
npm run test:coverage # Generate coverage report
```

### Building for Production
```bash
npm run build         # Build production bundle
npm run preview       # Preview production build locally
```

### Code Quality
```bash
npm run lint          # Run ESLint
npm run type-check    # Run TypeScript compiler
```

---

## Contributing Guidelines

### Code Style
- Use TypeScript for all new files
- Follow Airbnb React style guide
- Use functional components with hooks
- Prefer named exports for components
- Use default exports for pages

### Component Structure
```typescript
// 1. Imports
import { useState } from 'react';
import { cn } from '@/lib/utils';

// 2. Types
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// 3. Component
export function Component({ title, onAction }: ComponentProps) {
  // 3a. Hooks
  const [state, setState] = useState(false);

  // 3b. Handlers
  const handleClick = () => {
    setState(true);
    onAction();
  };

  // 3c. Render
  return (
    <div className="...">
      <h1>{title}</h1>
      <button onClick={handleClick}>Action</button>
    </div>
  );
}
```

### Commit Conventions
```
feat: Add new feature
fix: Bug fix
docs: Documentation changes
style: Code style changes
refactor: Code refactoring
test: Add or update tests
chore: Build process or auxiliary tool changes
```

### Pull Request Process
1. Create feature branch from `main`
2. Implement changes with tests
3. Run `npm run build` to verify
4. Run `npm test` to ensure tests pass
5. Submit PR with description
6. Address review comments
7. Merge after approval

---

## Architecture Decisions

### Why Zustand over Redux?
- **Simpler API** - Less boilerplate
- **Better TypeScript support** - Inferred types
- **Smaller bundle size** - ~1KB vs ~5KB
- **No Provider wrapper** - Cleaner React tree
- **Built-in persistence** - Easy localStorage integration

### Why Vite over Create React App?
- **Faster dev server** - esbuild vs webpack
- **Faster builds** - Rollup optimization
- **Better defaults** - PostCSS, TypeScript, ESM
- **Active maintenance** - CRA is deprecated

### Why React Hook Form over Formik?
- **Better performance** - Fewer re-renders
- **Smaller bundle** - ~9KB vs ~15KB
- **TypeScript-first** - Better type inference
- **Zod integration** - Seamless validation

### Why Tailwind over CSS-in-JS?
- **Better performance** - No runtime
- **Smaller bundles** - Purges unused CSS
- **Better DX** - Utility classes in markup
- **Easier theming** - Design tokens

---

## Monitoring & Observability

### Performance Metrics
- **Lighthouse scores** - Performance, Accessibility, SEO
- **Core Web Vitals** - LCP, FID, CLS
- **Bundle size tracking** - CI/CD integration
- **Build time tracking** - Optimize build pipeline

### Error Tracking
- **ErrorBoundary** - Catches React errors
- **window.onerror** - Global error handler
- **Unhandled promise rejections** - Promise error handler
- **Future: Sentry integration** - Production error tracking

---

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

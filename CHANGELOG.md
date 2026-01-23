# Changelog

All notable changes to the O'Key Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-01-23

### Added - Phase 1: Foundation & Infrastructure
- **Testing Infrastructure**: Vitest + React Testing Library with 80% coverage targets
- **ErrorBoundary**: Global error handling with dev-mode details
- **Icon Component**: Wrapper for Lucide icons with consistent sizing and theming
- **Rating Component**: Interactive star ratings with half-star and keyboard support
- **MobileNav Component**: Role-based bottom navigation for mobile devices
- **Code Splitting**: React.lazy() on all 45+ routes for optimal performance

### Added - Phase 2: Advanced Features (10 features)

#### 1. Lease Builder & Editor
- 7-step wizard for creating leases
- 4 lease templates (residential, short-term, commercial, renewal)
- Auto-populate property and tenant data
- Custom clause editor
- PDF preview and draft persistence
- Route: `/owner/lease/new`

#### 2. Move-In/Move-Out Checklists
- Room-by-room inspections with 5 condition ratings
- Photo upload with before/after comparison
- Damage tracking with cost estimates
- Utility meter readings
- Security deposit calculator
- Routes: `/owner/checklist/move-in`, `/owner/checklist/move-out`

#### 3. Expense Tracking & Budgets
- 10 expense categories
- Budget variance analysis
- Tax-deductible tracking
- CSV export for accountants
- Route: `/owner/financials/expenses`

#### 4. Tax Document Generation
- Schedule E generator (IRS Form 1040)
- 1099-MISC generator for contractors
- Depreciation calculator (MACRS 27.5 years)
- Multi-property support
- Route: `/owner/financials/tax-documents`

#### 5. Tenant Screening Workflow
- 6-category screening checklist
- Overall scoring system (0-100)
- Side-by-side applicant comparison (up to 3)
- Fair housing compliance reminders
- Route: `/owner/screening`

#### 6. Utility Management
- 6 utility types tracking
- Provider and account information
- Billing type configuration
- Route: `/owner/utilities`

#### 7. Parking & Amenity Management
- Parking spot inventory
- QR code permit generation
- Route: `/owner/parking`

#### 8. Visitor Management
- Pre-registration system
- Check-in/out tracking
- Route: `/owner/visitors`

#### 9. Emergency Protocols Dashboard
- Emergency contacts directory
- Procedures documentation (fire, flood, gas, power)
- Broadcast messaging interface
- Route: `/owner/emergency`

#### 10. Bulk Operations
- Bulk rent reminders
- Mass notices to tenants
- Lease renewal offers
- Route: `/owner/bulk-operations`

### Added - Phase 3: Global Features
- **Environment Configuration**: `.env.example` and typed config module
- **Dark Mode Toggle**: ThemeToggle component with light/dark/system modes
- **Focus Management**: useFocusTrap, SkipLink, useAriaLive, useFocusRestore hooks
- **API Service Layer**: Typed HTTP client ready for Supabase backend integration

### Added - Phase 4: Component Polish
- **AreaChart**: For portfolio growth and trend visualization
- **PieChart**: For expense breakdown and distribution analysis
- **MultiSelect**: Checkbox dropdown with search and select all/deselect all
- **TreeView**: Expandable tree structure with keyboard navigation
- **FilterPanel**: Advanced filtering with collapsible sections

### Performance
- Total bundle size: 951 KB (52% under 2MB target)
- Initial bundle: 51.90 KB gzipped (74% under 200KB target)
- Build time: ~3.8 seconds
- All routes lazy-loaded for code splitting

### Technical
- 66 files changed (61 new, 5 modified)
- 9,526 lines of code added
- 10 new pages
- 30+ new components
- 5 new Zustand stores
- 6 new type definition files
- Zero TypeScript errors
- Zero build warnings

---

## [1.0.0] - Previous Version

Initial release with:
- Marketplace (property search, bidding)
- Tenant Portal (payments, maintenance)
- Owner Portal (properties, residents, financials)
- Quebec Law 16 compliance features

---

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

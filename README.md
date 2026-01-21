# OKey Platform

**The Complete Real Estate Ecosystem**

OKey Platform is a unified real estate solution that combines marketplace discovery, auction-based bidding, property management, and tenant services into one seamless application.

## 🌟 Vision

Replace traditional real estate brokers and property managers with a transparent, score-based platform that handles everything from property discovery to day-to-day management.

## 🏗️ Architecture

```
OKey Platform
│
├── 🏪 PUBLIC MARKETPLACE
│   ├── Property search & discovery
│   ├── Map-based browsing
│   ├── Auction bidding system
│   ├── Score-based applications
│   └── Property comparisons
│
├── 👤 TENANT PORTAL (Post-Rental)
│   ├── Rent payments
│   ├── Maintenance requests
│   ├── Document access
│   ├── Lease management
│   └── Communication hub
│
├── 🏢 OWNER/LANDLORD PORTAL
│   ├── Property & unit management
│   ├── Financial management
│   ├── Tenant management
│   ├── Maintenance tracking
│   ├── Document management
│   ├── Law 16 compliance (Quebec)
│   ├── Analytics & reporting
│   └── Bid review & acceptance
│
└── 🛠️ PROPERTY MANAGER PORTAL
    └── Multi-property management tools

```

## 🎯 Core Features

### Scoring System (O'Key Score)
- **300-850 point scale** similar to credit scores
- Based on:
  - Payment history (35%)
  - Rental duration (25%)
  - Income verification (20%)
  - References & reviews (15%)
  - Identity verification (5%)
- Transparent and objective tenant evaluation
- Owner/landlord scoring for credibility

### Bidding & Auction System
- Real-time bidding on rental units
- Minimum score requirements
- Auto-bid functionality
- "Buy Now" instant rental option
- Transparent bid history

### Property Management (ImmoLink)
- Complete financial management
- Maintenance request tracking
- Law 16 compliance (Quebec condos)
- Document management system
- Tenant screening & management
- Analytics & benchmarking
- Integration with QuickBooks, Stripe, DocuSign

### Unified Account System
- Single account with role-based views
- Users can be both tenants and owners
- Seamless transition from bidder to tenant
- Automatic access provisioning

## 🔐 Roles & Permissions

1. **Public User** - Browse marketplace, view properties
2. **Tenant/Bidder** - Submit bids, manage rental
3. **Property Owner** - Manage properties, review bids
4. **Property Manager** - Professional management services
5. **Board Member** - Condo board governance (Quebec)
6. **Accountant** - Financial oversight
7. **Vendor/Contractor** - Service provider access
8. **Admin** - Platform administration

## 🛠️ Tech Stack

- **Frontend**: React 18.3 + TypeScript
- **Build Tool**: Vite 6.3
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui + Material UI + Konsta
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Animations**: Motion (Framer Motion successor)
- **State**: React Context + hooks
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Real-time)
- **Payments**: Stripe
- **Documents**: DocuSign integration
- **Accounting**: QuickBooks Online integration

## 📁 Project Structure

```
src/
├── features/
│   ├── marketplace/        # Property discovery, search, bidding
│   ├── property-management/ # Owner/PM features (ImmoLink)
│   └── tenant-portal/       # Tenant-specific features
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── layout/              # Layout components
│   └── shared/              # Shared feature components
├── lib/
│   ├── auth/                # Authentication & session
│   ├── rbac/                # Role-based access control
│   ├── api/                 # API service layer
│   └── utils/               # Utility functions
├── context/                 # Global state contexts
├── types/                   # TypeScript type definitions
└── styles/                  # Global styles & themes
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yah600/OKey-Platform.git
cd OKey-Platform

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## 🎨 Design System

- **Primary Brand Color**: #0D7377 (Teal)
- **Secondary**: #F4A261 (Orange)
- **Accent**: #E76F51 (Coral)
- **Fonts**: Inter (body), Custom display fonts
- **Mobile-first responsive design**
- **Dark mode support**

## 📋 Development Roadmap

### Phase 1: Foundation (Current)
- [x] Repository setup
- [ ] Codebase merge (OkeyApp + ImmoflowNew)
- [ ] Unified routing system
- [ ] RBAC implementation
- [ ] Design system unification

### Phase 2: Backend Integration
- [ ] Supabase setup
- [ ] Database schema design
- [ ] Authentication system
- [ ] API service layer
- [ ] Real-time updates (WebSocket)

### Phase 3: Core Features
- [ ] Marketplace & bidding
- [ ] Scoring algorithm
- [ ] Payment processing (Stripe)
- [ ] Property management portal
- [ ] Tenant portal
- [ ] Document signing (DocuSign)

### Phase 4: Advanced Features
- [ ] Accounting integration (QuickBooks)
- [ ] Advanced analytics
- [ ] Mobile PWA
- [ ] Multi-language support (EN/FR)
- [ ] Law 16 compliance tools

### Phase 5: Scale & Polish
- [ ] Performance optimization
- [ ] Security audit
- [ ] Testing (unit + integration)
- [ ] Documentation
- [ ] Beta launch

## 🌍 Market Focus

- **Primary**: Quebec, Canada (Law 16 compliance)
- **Expansion**: Rest of Canada, then international

## 📄 License

Proprietary - All rights reserved

## 👥 Team

Built with vision to disrupt the real estate industry.

---

**OKey Platform** - Real Estate Reimagined 🏠✨

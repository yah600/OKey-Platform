import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight, User, Calendar, DollarSign, Mail, Phone, FileText, Wrench, MessageSquare, X, Plus, Download } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getPropertiesByOwner, getLeasesByProperty, getUserById, getBillsByTenant, getIssuesByReporter, getTransactionsByUser } from '@/lib/mockData';

type ViewMode = 'grid' | 'list';
type LeaseStatusFilter = 'all' | 'active' | 'expiring' | 'expired' | 'pending';
type PaymentStatusFilter = 'all' | 'current' | 'overdue' | 'partial';
type DetailTab = 'overview' | 'lease' | 'payments' | 'maintenance' | 'communication' | 'documents';

interface EnrichedTenant {
  tenant: any;
  lease: any;
  property: any;
  unit: any;
  paymentStatus: 'current' | 'overdue' | 'partial';
  outstandingBalance: number;
}

export function OwnerResidents() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [tenants, setTenants] = useState<EnrichedTenant[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [leaseStatusFilter, setLeaseStatusFilter] = useState<LeaseStatusFilter>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatusFilter>('all');
  const [sortBy, setSortBy] = useState<'name' | 'unit' | 'lease_end' | 'move_in'>('name');

  // Modals
  const [selectedTenant, setSelectedTenant] = useState<EnrichedTenant | null>(null);
  const [showTenantDetail, setShowTenantDetail] = useState(false);
  const [detailTab, setDetailTab] = useState<DetailTab>('overview');
  const [showAddTenant, setShowAddTenant] = useState(false);

  // Add Tenant form
  const [newTenantForm, setNewTenantForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    property_id: '',
    unit_id: '',
    lease_start: '',
    lease_end: '',
    monthly_rent: '',
    security_deposit: '',
    move_in_date: '',
  });
  const [tenantFormErrors, setTenantFormErrors] = useState<any>({});

  useEffect(() => {
    if (!user) return;
    const owned = getPropertiesByOwner(user.id);
    setProperties(owned);

    // Load all tenants with their leases
    const allTenants: EnrichedTenant[] = [];
    owned.forEach(property => {
      const leases = getLeasesByProperty(property.id);
      leases.forEach((lease: any) => {
        const tenant = getUserById(lease.tenant_id);
        if (tenant) {
          // Calculate payment status
          const bills = getBillsByTenant(tenant.id);
          const unpaidBills = bills.filter((b: any) => b.status !== 'paid');
          const overdueBills = unpaidBills.filter((b: any) => new Date(b.due_date) < new Date());
          const outstandingBalance = unpaidBills.reduce((sum: number, b: any) => sum + b.amount_due, 0);

          let paymentStatus: 'current' | 'overdue' | 'partial' = 'current';
          if (overdueBills.length > 0) {
            paymentStatus = 'overdue';
          } else if (unpaidBills.length > 0) {
            paymentStatus = 'partial';
          }

          allTenants.push({
            tenant,
            lease,
            property,
            unit: property.units?.find((u: any) => u.id === lease.unit_id),
            paymentStatus,
            outstandingBalance,
          });
        }
      });
    });

    setTenants(allTenants);
  }, [user]);

  // Calculate stats
  const stats = useMemo(() => {
    const activeLeases = tenants.filter(t => t.lease.status === 'active').length;
    const now = new Date();
    const expiringSoon = tenants.filter(t => {
      const endDate = new Date(t.lease.end_date);
      const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 60 && daysUntilExpiry > 0;
    }).length;

    // Calculate average stay
    const totalStayDays = tenants.reduce((sum, t) => {
      const startDate = new Date(t.lease.start_date);
      const daysSinceStart = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return sum + daysSinceStart;
    }, 0);
    const avgStayMonths = tenants.length > 0 ? Math.round(totalStayDays / tenants.length / 30) : 0;

    return {
      totalTenants: tenants.length,
      activeLeases,
      expiringSoon,
      avgStayMonths,
    };
  }, [tenants]);

  // Filter and sort tenants
  const filteredTenants = useMemo(() => {
    let filtered = tenants.filter(t => {
      const propertyMatch = selectedProperty === 'all' || t.property.id === selectedProperty;
      const searchMatch = searchQuery === '' ||
        t.tenant.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.unit?.unit_number?.toLowerCase().includes(searchQuery.toLowerCase());

      let leaseMatch = true;
      if (leaseStatusFilter === 'active') {
        leaseMatch = t.lease.status === 'active';
      } else if (leaseStatusFilter === 'expiring') {
        const endDate = new Date(t.lease.end_date);
        const daysUntilExpiry = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        leaseMatch = daysUntilExpiry <= 60 && daysUntilExpiry > 0;
      } else if (leaseStatusFilter === 'expired') {
        leaseMatch = t.lease.status === 'expired' || new Date(t.lease.end_date) < new Date();
      } else if (leaseStatusFilter === 'pending') {
        leaseMatch = t.lease.status === 'pending';
      }

      const paymentMatch = paymentStatusFilter === 'all' || t.paymentStatus === paymentStatusFilter;

      return propertyMatch && searchMatch && leaseMatch && paymentMatch;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.tenant.full_name.localeCompare(b.tenant.full_name);
      } else if (sortBy === 'unit') {
        return (a.unit?.unit_number || '').localeCompare(b.unit?.unit_number || '');
      } else if (sortBy === 'lease_end') {
        return new Date(a.lease.end_date).getTime() - new Date(b.lease.end_date).getTime();
      } else if (sortBy === 'move_in') {
        return new Date(b.lease.start_date).getTime() - new Date(a.lease.start_date).getTime();
      }
      return 0;
    });

    return filtered;
  }, [tenants, selectedProperty, searchQuery, leaseStatusFilter, paymentStatusFilter, sortBy]);

  // Handle add tenant
  const handleAddTenant = () => {
    const errors: any = {};
    if (!newTenantForm.first_name) errors.first_name = 'First name is required';
    if (!newTenantForm.last_name) errors.last_name = 'Last name is required';
    if (!newTenantForm.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(newTenantForm.email)) errors.email = 'Invalid email format';
    if (!newTenantForm.phone) errors.phone = 'Phone is required';
    if (!newTenantForm.property_id) errors.property_id = 'Property is required';
    if (!newTenantForm.unit_id) errors.unit_id = 'Unit is required';
    if (!newTenantForm.lease_start) errors.lease_start = 'Lease start date is required';
    if (!newTenantForm.lease_end) errors.lease_end = 'Lease end date is required';
    if (!newTenantForm.monthly_rent || parseFloat(newTenantForm.monthly_rent) <= 0) {
      errors.monthly_rent = 'Valid monthly rent is required';
    }
    if (!newTenantForm.security_deposit || parseFloat(newTenantForm.security_deposit) <= 0) {
      errors.security_deposit = 'Valid security deposit is required';
    }

    if (Object.keys(errors).length > 0) {
      setTenantFormErrors(errors);
      return;
    }

    alert(`Tenant ${newTenantForm.first_name} ${newTenantForm.last_name} added successfully! Invitation email sent.`);
    setShowAddTenant(false);
    setNewTenantForm({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      property_id: '',
      unit_id: '',
      lease_start: '',
      lease_end: '',
      monthly_rent: '',
      security_deposit: '',
      move_in_date: '',
    });
    setTenantFormErrors({});
  };

  const getLeaseStatusBadge = (lease: any) => {
    const endDate = new Date(lease.end_date);
    const daysUntilExpiry = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    if (lease.status === 'expired' || endDate < new Date()) {
      return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Expired</span>;
    } else if (daysUntilExpiry <= 60 && daysUntilExpiry > 0) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Expiring Soon</span>;
    } else if (lease.status === 'active') {
      return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>;
    } else if (lease.status === 'pending') {
      return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Pending</span>;
    }
    return null;
  };

  const getPaymentStatusIndicator = (status: string) => {
    if (status === 'current') {
      return <div className="w-3 h-3 rounded-full bg-green-500" title="Current" />;
    } else if (status === 'overdue') {
      return <div className="w-3 h-3 rounded-full bg-red-500" title="Overdue" />;
    } else if (status === 'partial') {
      return <div className="w-3 h-3 rounded-full bg-yellow-500" title="Partial Payment" />;
    }
    return null;
  };

  const openTenantDetail = (tenant: EnrichedTenant) => {
    setSelectedTenant(tenant);
    setDetailTab('overview');
    setShowTenantDetail(true);
  };

  const selectedPropertyUnits = useMemo(() => {
    if (!newTenantForm.property_id) return [];
    const property = properties.find(p => p.id === newTenantForm.property_id);
    return property?.units || [];
  }, [newTenantForm.property_id, properties]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <button onClick={() => navigate('/dashboard')} className="hover:text-blue-600 flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Residents</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Residents & Tenants</h1>
              <p className="text-gray-600 mt-1">Manage tenant relationships and leases</p>
            </div>

            <button
              onClick={() => setShowAddTenant(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Tenant
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{stats.totalTenants}</div>
              <div className="text-sm text-gray-600">Total Tenants</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{stats.activeLeases}</div>
              <div className="text-sm text-gray-600">Active Leases</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</div>
              <div className="text-sm text-gray-600">Expiring Soon</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{stats.avgStayMonths} mo</div>
              <div className="text-sm text-gray-600">Avg Tenant Stay</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {properties.length > 1 && (
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Properties</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}

            <input
              type="text"
              placeholder="Search by name, unit, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={leaseStatusFilter}
              onChange={(e) => setLeaseStatusFilter(e.target.value as LeaseStatusFilter)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Leases</option>
              <option value="active">Active</option>
              <option value="expiring">Expiring Soon</option>
              <option value="expired">Expired</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value as PaymentStatusFilter)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Payment Status</option>
              <option value="current">Current</option>
              <option value="overdue">Overdue</option>
              <option value="partial">Partial</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="unit">Sort by Unit</option>
              <option value="lease_end">Sort by Lease End</option>
              <option value="move_in">Sort by Move-in Date</option>
            </select>

            <div className="flex gap-1 border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredTenants.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tenants found</h3>
            <p className="text-gray-600">Try adjusting your filters or add a new tenant.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTenants.map(t => (
              <div key={t.tenant.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-lg font-semibold text-blue-600">
                          {t.tenant.full_name.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{t.tenant.full_name}</h3>
                        <span className="text-sm text-gray-600">{t.unit?.unit_number || 'N/A'}</span>
                      </div>
                    </div>
                    {getPaymentStatusIndicator(t.paymentStatus)}
                  </div>

                  <div className="space-y-2 mb-4">
                    {getLeaseStatusBadge(t.lease)}
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Move-in: {new Date(t.lease.start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Lease ends: {new Date(t.lease.end_date).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm text-gray-900 font-medium flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>${t.lease.monthly_rent?.toLocaleString()}/month</span>
                    </div>
                    {t.outstandingBalance > 0 && (
                      <div className="text-sm text-red-600 font-medium">
                        Outstanding: ${t.outstandingBalance.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openTenantDetail(t)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      View Profile
                    </button>
                    <button className="px-3 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                  {properties.length > 1 && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lease Term</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Outstanding</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTenants.map(t => (
                  <tr key={t.tenant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">
                            {t.tenant.full_name.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{t.tenant.full_name}</div>
                          <div className="text-sm text-gray-500">{t.tenant.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{t.unit?.unit_number || 'N/A'}</td>
                    {properties.length > 1 && (
                      <td className="px-6 py-4 text-sm text-gray-600">{t.property.name}</td>
                    )}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(t.lease.start_date).toLocaleDateString()} - {new Date(t.lease.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{getLeaseStatusBadge(t.lease)}</td>
                    <td className="px-6 py-4">{getPaymentStatusIndicator(t.paymentStatus)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${t.lease.monthly_rent?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-red-600">
                      {t.outstandingBalance > 0 ? `$${t.outstandingBalance.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openTenantDetail(t)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tenant Detail Modal */}
      {showTenantDetail && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-blue-600">
                    {selectedTenant.tenant.full_name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{selectedTenant.tenant.full_name}</h2>
                  <p className="text-gray-600">{selectedTenant.unit?.unit_number} - {selectedTenant.property.name}</p>
                </div>
              </div>
              <button onClick={() => setShowTenantDetail(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <div className="flex gap-6 px-6 overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview', icon: User },
                  { id: 'lease', label: 'Lease Details', icon: FileText },
                  { id: 'payments', label: 'Payments', icon: DollarSign },
                  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
                  { id: 'communication', label: 'Messages', icon: MessageSquare },
                  { id: 'documents', label: 'Documents', icon: FileText },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setDetailTab(tab.id as DetailTab)}
                    className={`py-4 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
                      detailTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {detailTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <p className="text-gray-900 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {selectedTenant.tenant.email}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Phone</label>
                        <p className="text-gray-900 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {selectedTenant.tenant.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lease Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">Unit</label>
                        <p className="text-gray-900">{selectedTenant.unit?.unit_number}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Property</label>
                        <p className="text-gray-900">{selectedTenant.property.name}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Lease Start</label>
                        <p className="text-gray-900">{new Date(selectedTenant.lease.start_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Lease End</label>
                        <p className="text-gray-900">{new Date(selectedTenant.lease.end_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Monthly Rent</label>
                        <p className="text-gray-900">${selectedTenant.lease.monthly_rent?.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Security Deposit</label>
                        <p className="text-gray-900">${selectedTenant.lease.security_deposit?.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Lease Status</label>
                        <div>{getLeaseStatusBadge(selectedTenant.lease)}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Outstanding Balance</span>
                        <span className="text-xl font-bold text-red-600">
                          ${selectedTenant.outstandingBalance.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Payment Status</span>
                        <div className="flex items-center gap-2">
                          {getPaymentStatusIndicator(selectedTenant.paymentStatus)}
                          <span className="capitalize">{selectedTenant.paymentStatus}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {detailTab === 'lease' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Lease Agreement</h3>
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <p className="text-gray-600 mb-4">Lease document preview</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Download Lease
                    </button>
                  </div>
                </div>
              )}

              {detailTab === 'payments' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
                  <p className="text-gray-600">Payment history will be displayed here.</p>
                </div>
              )}

              {detailTab === 'maintenance' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Requests</h3>
                  <p className="text-gray-600">Maintenance requests will be displayed here.</p>
                </div>
              )}

              {detailTab === 'communication' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication History</h3>
                  <p className="text-gray-600">Messages and communication history will be displayed here.</p>
                </div>
              )}

              {detailTab === 'documents' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                  <p className="text-gray-600">Tenant-related documents will be displayed here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add New Tenant Modal */}
      {showAddTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Add New Tenant</h2>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      value={newTenantForm.first_name}
                      onChange={(e) => setNewTenantForm({...newTenantForm, first_name: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        tenantFormErrors.first_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {tenantFormErrors.first_name && (
                      <p className="text-red-500 text-xs mt-1">{tenantFormErrors.first_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={newTenantForm.last_name}
                      onChange={(e) => setNewTenantForm({...newTenantForm, last_name: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        tenantFormErrors.last_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {tenantFormErrors.last_name && (
                      <p className="text-red-500 text-xs mt-1">{tenantFormErrors.last_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={newTenantForm.email}
                      onChange={(e) => setNewTenantForm({...newTenantForm, email: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        tenantFormErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {tenantFormErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{tenantFormErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={newTenantForm.phone}
                      onChange={(e) => setNewTenantForm({...newTenantForm, phone: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        tenantFormErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {tenantFormErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">{tenantFormErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                    <input
                      type="text"
                      value={newTenantForm.emergency_contact_name}
                      onChange={(e) => setNewTenantForm({...newTenantForm, emergency_contact_name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                    <input
                      type="tel"
                      value={newTenantForm.emergency_contact_phone}
                      onChange={(e) => setNewTenantForm({...newTenantForm, emergency_contact_phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Lease Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property *</label>
                    <select
                      value={newTenantForm.property_id}
                      onChange={(e) => setNewTenantForm({...newTenantForm, property_id: e.target.value, unit_id: ''})}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        tenantFormErrors.property_id ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select property</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    {tenantFormErrors.property_id && (
                      <p className="text-red-500 text-xs mt-1">{tenantFormErrors.property_id}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                    <select
                      value={newTenantForm.unit_id}
                      onChange={(e) => setNewTenantForm({...newTenantForm, unit_id: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        tenantFormErrors.unit_id ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={!newTenantForm.property_id}
                    >
                      <option value="">Select unit</option>
                      {selectedPropertyUnits.map((u: any) => (
                        <option key={u.id} value={u.id}>{u.unit_number}</option>
                      ))}
                    </select>
                    {tenantFormErrors.unit_id && (
                      <p className="text-red-500 text-xs mt-1">{tenantFormErrors.unit_id}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lease Start Date *</label>
                    <input
                      type="date"
                      value={newTenantForm.lease_start}
                      onChange={(e) => setNewTenantForm({...newTenantForm, lease_start: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        tenantFormErrors.lease_start ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {tenantFormErrors.lease_start && (
                      <p className="text-red-500 text-xs mt-1">{tenantFormErrors.lease_start}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lease End Date *</label>
                    <input
                      type="date"
                      value={newTenantForm.lease_end}
                      onChange={(e) => setNewTenantForm({...newTenantForm, lease_end: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        tenantFormErrors.lease_end ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {tenantFormErrors.lease_end && (
                      <p className="text-red-500 text-xs mt-1">{tenantFormErrors.lease_end}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={newTenantForm.monthly_rent}
                        onChange={(e) => setNewTenantForm({...newTenantForm, monthly_rent: e.target.value})}
                        className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          tenantFormErrors.monthly_rent ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {tenantFormErrors.monthly_rent && (
                      <p className="text-red-500 text-xs mt-1">{tenantFormErrors.monthly_rent}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={newTenantForm.security_deposit}
                        onChange={(e) => setNewTenantForm({...newTenantForm, security_deposit: e.target.value})}
                        className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          tenantFormErrors.security_deposit ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {tenantFormErrors.security_deposit && (
                      <p className="text-red-500 text-xs mt-1">{tenantFormErrors.security_deposit}</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Move-in Date</label>
                    <input
                      type="date"
                      value={newTenantForm.move_in_date}
                      onChange={(e) => setNewTenantForm({...newTenantForm, move_in_date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAddTenant(false);
                  setTenantFormErrors({});
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTenant}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Tenant & Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

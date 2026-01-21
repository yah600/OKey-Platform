import { useState } from 'react';
import {
  Building2, DollarSign, TrendingUp, Users, Key, Wrench, FileText,
  BarChart3, Shield, CheckCircle2, Clock, AlertCircle, Eye, Calendar,
  Plus, Download, Filter, Search
} from 'lucide-react';
import { mockProperties, mockUnits, mockBids, getBidsByUnitId, getUnitById } from '@/lib/data/mockData';

interface OwnerDashboardEnhancedProps {
  onNavigate: (route: string, id?: string) => void;
}

type Tab = 'dashboard' | 'properties' | 'tenants' | 'finances' | 'maintenance' | 'documents' | 'analytics' | 'law16';

export function OwnerDashboardEnhanced({ onNavigate }: OwnerDashboardEnhancedProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  // Mock owner data
  const ownerId = 'user-2';
  const ownerProperties = mockProperties.filter(p => p.ownerId === ownerId);
  const ownerUnits = mockUnits.filter(u =>
    ownerProperties.some(p => p.id === u.propertyId)
  );

  const allBids = ownerUnits.flatMap(unit => getBidsByUnitId(unit.id));
  const pendingBids = allBids.filter(b => b.status === 'active');

  const stats = {
    totalProperties: ownerProperties.length,
    totalUnits: ownerUnits.length,
    availableUnits: ownerUnits.filter(u => u.status === 'available').length,
    occupancyRate: Math.round(
      ((ownerUnits.length - ownerUnits.filter(u => u.status === 'available').length) /
        ownerUnits.length) *
        100
    ),
    monthlyRevenue: ownerUnits.reduce((sum, u) => sum + (u.askingPrice || 0), 0),
    activeBids: pendingBids.length,
    maintenanceRequests: 3,
    overduePayments: 1,
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'tenants', label: 'Tenants', icon: Users },
    { id: 'finances', label: 'Finances', icon: DollarSign },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'law16', label: 'Law 16', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Property Management Portal</h1>
            <p className="text-purple-100">Complete ImmoLink management suite</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`flex items-center gap-2 px-4 py-4 border-b-2 whitespace-nowrap font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold">{stats.totalProperties}</div>
                  <div className="text-sm text-gray-600">Total Properties</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold">${(stats.monthlyRevenue / 1000).toFixed(0)}k</div>
                  <div className="text-sm text-gray-600">Monthly Revenue</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold">{stats.occupancyRate}%</div>
                  <div className="text-sm text-gray-600">Occupancy Rate</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold">{stats.activeBids}</div>
                  <div className="text-sm text-gray-600">Pending Bids</div>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pending Bids */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-400 text-white">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">Pending Bids</h3>
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold mt-2">{pendingBids.length}</div>
                  </div>
                  <div className="p-4">
                    <button className="w-full py-2 text-orange-600 hover:bg-orange-50 rounded-lg font-medium transition-colors">
                      Review Bids
                    </button>
                  </div>
                </div>

                {/* Maintenance Requests */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-yellow-500 to-yellow-400 text-white">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">Maintenance</h3>
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Wrench className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold mt-2">{stats.maintenanceRequests}</div>
                  </div>
                  <div className="p-4">
                    <button
                      onClick={() => setActiveTab('maintenance')}
                      className="w-full py-2 text-yellow-600 hover:bg-yellow-50 rounded-lg font-medium transition-colors"
                    >
                      View Requests
                    </button>
                  </div>
                </div>

                {/* Overdue Payments */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-red-500 to-red-400 text-white">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">Overdue</h3>
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold mt-2">{stats.overduePayments}</div>
                  </div>
                  <div className="p-4">
                    <button
                      onClick={() => setActiveTab('finances')}
                      className="w-full py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Properties Overview */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Your Properties</h2>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Property
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {ownerProperties.map((property) => {
                      const propertyUnits = ownerUnits.filter(u => u.propertyId === property.id);
                      const availableUnits = propertyUnits.filter(u => u.status === 'available');

                      return (
                        <div
                          key={property.id}
                          className="p-6 border rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => onNavigate('property', property.id)}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-bold">{property.buildingName}</h3>
                              <p className="text-sm text-gray-600">{property.city}, {property.province}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                {property.occupancyRate}% Occupied
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-4">
                            <div>
                              <div className="text-sm text-gray-600">Total Units</div>
                              <div className="text-xl font-bold">{propertyUnits.length}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Available</div>
                              <div className="text-xl font-bold text-green-600">{availableUnits.length}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Revenue</div>
                              <div className="text-xl font-bold">${propertyUnits.reduce((sum, u) => sum + u.askingPrice, 0).toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Score</div>
                              <div className="text-xl font-bold">{(property.buildingScore / 100).toFixed(1)}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'finances' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-4">Financial Management</h2>
                <p className="text-gray-600 mb-6">Track rent collection, expenses, and generate financial reports</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-green-50 rounded-xl">
                    <div className="text-sm text-green-700 mb-1">Total Income (MTD)</div>
                    <div className="text-3xl font-bold text-green-700">${(stats.monthlyRevenue * 0.92).toLocaleString()}</div>
                    <div className="text-sm text-green-600 mt-2">+8% from last month</div>
                  </div>
                  <div className="p-6 bg-red-50 rounded-xl">
                    <div className="text-sm text-red-700 mb-1">Expenses (MTD)</div>
                    <div className="text-3xl font-bold text-red-700">$3,240</div>
                    <div className="text-sm text-red-600 mt-2">-12% from last month</div>
                  </div>
                  <div className="p-6 bg-blue-50 rounded-xl">
                    <div className="text-sm text-blue-700 mb-1">Net Profit (MTD)</div>
                    <div className="text-3xl font-bold text-blue-700">${(stats.monthlyRevenue * 0.92 - 3240).toLocaleString()}</div>
                    <div className="text-sm text-blue-600 mt-2">+15% from last month</div>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download P&L Report
                  </button>
                  <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Export to QuickBooks
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8">
                <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <div className="font-medium">Rent Payment - Unit 4B</div>
                      <div className="text-sm text-gray-600">Jean Tremblay • Jan 1, 2026</div>
                    </div>
                    <div className="text-green-600 font-bold">+$2,400</div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <div className="font-medium">Maintenance - Plumbing Repair</div>
                      <div className="text-sm text-gray-600">ABC Plumbing • Jan 15, 2026</div>
                    </div>
                    <div className="text-red-600 font-bold">-$450</div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <div className="font-medium">Rent Payment - Unit 12A</div>
                      <div className="text-sm text-gray-600">Sophie Gagnon • Jan 1, 2026</div>
                    </div>
                    <div className="text-green-600 font-bold">+$1,850</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'law16' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Law 16 Compliance (Quebec)</h2>
                    <p className="text-gray-600">Contingency fund & maintenance logbook management</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-green-50 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg">Contingency Fund</h3>
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-green-700 mb-2">$124,500</div>
                    <div className="text-sm text-gray-600">25% of annual budget (compliant)</div>
                    <div className="mt-4 h-2 bg-green-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-600" style={{ width: '78%' }}></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-2">Target: $160,000</div>
                  </div>

                  <div className="p-6 bg-blue-50 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg">Maintenance Logbook</h3>
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-blue-700 mb-2">47</div>
                    <div className="text-sm text-gray-600">Entries this year</div>
                    <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      View Logbook
                    </button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-yellow-800">Upcoming Requirement</div>
                      <div className="text-sm text-yellow-700">Annual contingency fund study due in 45 days</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'properties' && (
            <div className="space-y-6">
              {/* Search and Filter Bar */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search properties..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Property
                    </button>
                  </div>
                </div>
              </div>

              {/* Properties List */}
              <div className="space-y-4">
                {ownerProperties.map((property) => {
                  const propertyUnits = ownerUnits.filter(u => u.propertyId === property.id);
                  const availableUnits = propertyUnits.filter(u => u.status === 'available');
                  const occupiedUnits = propertyUnits.filter(u => u.status === 'occupied');

                  return (
                    <div key={property.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold">{property.buildingName}</h3>
                              {property.verified && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Verified
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600">{property.address}</p>
                            <p className="text-sm text-gray-500">{property.city}, {property.province}</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                              <Plus className="w-4 h-4" />
                              Add Unit
                            </button>
                          </div>
                        </div>

                        {/* Property Stats */}
                        <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                          <div>
                            <div className="text-sm text-gray-600">Total Units</div>
                            <div className="text-2xl font-bold">{propertyUnits.length}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Available</div>
                            <div className="text-2xl font-bold text-green-600">{availableUnits.length}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Occupied</div>
                            <div className="text-2xl font-bold text-blue-600">{occupiedUnits.length}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Revenue</div>
                            <div className="text-2xl font-bold">${propertyUnits.reduce((sum, u) => sum + u.askingPrice, 0).toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Score</div>
                            <div className="text-2xl font-bold">{(property.buildingScore / 100).toFixed(1)}</div>
                          </div>
                        </div>

                        {/* Units List */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold">Units</h4>
                          </div>
                          <div className="space-y-2">
                            {propertyUnits.map((unit) => {
                              const unitBids = getBidsByUnitId(unit.id).filter(b => b.status === 'active');
                              return (
                                <div key={unit.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                      <div className="font-medium">Unit {unit.unitNumber}</div>
                                      <div className="text-sm text-gray-600">{unit.bedrooms} bed • {unit.bathrooms} bath • {unit.size} sq ft</div>
                                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                        unit.status === 'available' ? 'bg-green-100 text-green-700' :
                                        unit.status === 'occupied' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                      }`}>
                                        {unit.status}
                                      </span>
                                      {unitBids.length > 0 && (
                                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                                          {unitBids.length} active bids
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <div className="font-bold">${unit.askingPrice.toLocaleString()}/mo</div>
                                      {unit.status === 'available' && unit.auctionEndDate && (
                                        <div className="text-xs text-gray-500">
                                          Auction ends {new Date(unit.auctionEndDate).toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'tenants' && (
            <div className="space-y-6">
              {/* Tenants Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold">{ownerUnits.filter(u => u.status === 'occupied').length}</div>
                  <div className="text-sm text-gray-600">Active Tenants</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold">98%</div>
                  <div className="text-sm text-gray-600">Payment Rate</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold">2</div>
                  <div className="text-sm text-gray-600">Lease Renewals Due</div>
                </div>
              </div>

              {/* Tenants List */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Current Tenants</h2>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Search
                      </button>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Tenant
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[
                      { name: 'Jean Tremblay', unit: '4B', property: 'The Maxwell', lease: '2025-02-01 to 2026-02-01', rent: 2400, score: 720, status: 'active', payment: 'current' },
                      { name: 'Sophie Gagnon', unit: '12A', property: 'Riverside Commons', lease: '2025-03-01 to 2026-03-01', rent: 1850, score: 680, status: 'active', payment: 'current' },
                      { name: 'Marc Leblanc', unit: '7C', property: 'Heritage Lofts', lease: '2024-06-01 to 2025-06-01', rent: 2100, score: 745, status: 'renewal_due', payment: 'current' },
                    ].map((tenant, index) => (
                      <div key={index} className="p-6 border rounded-xl hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                              {tenant.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">{tenant.name}</h3>
                              <p className="text-sm text-gray-600">Unit {tenant.unit} • {tenant.property}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                              tenant.status === 'active' ? 'bg-green-100 text-green-700' :
                              tenant.status === 'renewal_due' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {tenant.status === 'renewal_due' ? 'Renewal Due' : 'Active'}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <div className="text-sm text-gray-600">Lease Period</div>
                            <div className="font-medium text-sm">{tenant.lease}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Monthly Rent</div>
                            <div className="font-bold">${tenant.rent.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">O'Key Score</div>
                            <div className="font-bold">{tenant.score}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Payment Status</div>
                            <div className="flex items-center gap-1 text-green-600 font-medium">
                              <CheckCircle2 className="w-4 h-4" />
                              Current
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              {/* Maintenance Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold">5</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold">3</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold">47</div>
                  <div className="text-sm text-gray-600">Completed (MTD)</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold">2</div>
                  <div className="text-sm text-gray-600">Urgent</div>
                </div>
              </div>

              {/* Maintenance Requests */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Maintenance Requests</h2>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        All Status
                      </button>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        New Request
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[
                      { id: 'MR-001', title: 'Leaky faucet in kitchen', property: 'The Maxwell', unit: '4B', tenant: 'Jean Tremblay', priority: 'medium', status: 'in_progress', date: '2026-01-15', assignedTo: 'ABC Plumbing' },
                      { id: 'MR-002', title: 'Heating not working properly', property: 'Heritage Lofts', unit: '7C', tenant: 'Marc Leblanc', priority: 'high', status: 'pending', date: '2026-01-18', assignedTo: null },
                      { id: 'MR-003', title: 'Broken window latch', property: 'Riverside Commons', unit: '12A', tenant: 'Sophie Gagnon', priority: 'low', status: 'pending', date: '2026-01-20', assignedTo: null },
                    ].map((request) => (
                      <div key={request.id} className="p-6 border rounded-xl hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold">{request.title}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                request.priority === 'high' ? 'bg-red-100 text-red-700' :
                                request.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {request.priority} priority
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                request.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {request.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {request.property} • Unit {request.unit} • {request.tenant}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Submitted {new Date(request.date).toLocaleDateString()}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            {request.assignedTo ? (
                              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                                {request.assignedTo}
                              </button>
                            ) : (
                              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                                Assign Vendor
                              </button>
                            )}
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              {/* Document Categories */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { name: 'Leases', count: 12, icon: FileText, color: 'blue' },
                  { name: 'Invoices', count: 45, icon: DollarSign, color: 'green' },
                  { name: 'Maintenance', count: 23, icon: Wrench, color: 'yellow' },
                  { name: 'Legal', count: 8, icon: Shield, color: 'purple' },
                ].map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.name} className={`bg-white rounded-xl shadow-sm p-6 border-l-4 border-${category.color}-500 cursor-pointer hover:shadow-lg transition-shadow`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 text-${category.color}-600`} />
                        </div>
                      </div>
                      <div className="text-3xl font-bold">{category.count}</div>
                      <div className="text-sm text-gray-600">{category.name}</div>
                    </div>
                  );
                })}
              </div>

              {/* Document Library */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Document Library</h2>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Search
                      </button>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Upload Document
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {[
                      { name: 'Lease Agreement - Unit 4B', category: 'Leases', date: '2025-02-01', size: '245 KB', tenant: 'Jean Tremblay' },
                      { name: 'Maintenance Invoice - Plumbing', category: 'Invoices', date: '2026-01-15', size: '128 KB', vendor: 'ABC Plumbing' },
                      { name: 'Insurance Policy 2026', category: 'Legal', date: '2026-01-01', size: '1.2 MB', property: 'All Properties' },
                      { name: 'Property Tax Assessment', category: 'Legal', date: '2025-12-15', size: '389 KB', property: 'The Maxwell' },
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-sm text-gray-600">
                              {doc.category} • {doc.size} • {new Date(doc.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold">$12.4k</div>
                  <div className="text-sm text-gray-600">Avg Revenue/Unit</div>
                  <div className="text-xs text-green-600 mt-2">+12% YoY</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold">92%</div>
                  <div className="text-sm text-gray-600">Avg Occupancy</div>
                  <div className="text-xs text-blue-600 mt-2">+3% MoM</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold">18</div>
                  <div className="text-sm text-gray-600">Avg Days to Lease</div>
                  <div className="text-xs text-purple-600 mt-2">-5 days vs avg</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold">24%</div>
                  <div className="text-sm text-gray-600">Net Operating Margin</div>
                  <div className="text-xs text-yellow-600 mt-2">+2% vs target</div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold mb-4">Revenue Trend</h3>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {[65, 72, 68, 78, 85, 82, 90, 88, 92, 95, 98, 100].map((height, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-green-500 to-green-400 rounded-t" style={{ height: `${height}%` }}></div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-xs text-gray-600">
                    <span>Jan</span>
                    <span>Dec</span>
                  </div>
                </div>

                {/* Occupancy Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold mb-4">Occupancy Rate</h3>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {[88, 90, 87, 92, 91, 93, 92, 94, 93, 95, 94, 92].map((height, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t" style={{ height: `${height}%` }}></div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-xs text-gray-600">
                    <span>Jan</span>
                    <span>Dec</span>
                  </div>
                </div>
              </div>

              {/* Property Comparison */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4">Property Performance Comparison</h3>
                <div className="space-y-4">
                  {ownerProperties.map((property) => {
                    const propertyUnits = ownerUnits.filter(u => u.propertyId === property.id);
                    const revenue = propertyUnits.reduce((sum, u) => sum + u.askingPrice, 0);
                    const maxRevenue = Math.max(...ownerProperties.map(p =>
                      ownerUnits.filter(u => u.propertyId === p.id).reduce((sum, u) => sum + u.askingPrice, 0)
                    ));
                    const percentage = (revenue / maxRevenue) * 100;

                    return (
                      <div key={property.id}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{property.buildingName}</div>
                          <div className="text-sm font-bold">${revenue.toLocaleString()}/mo</div>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {!['dashboard', 'properties', 'tenants', 'finances', 'maintenance', 'documents', 'analytics', 'law16'].includes(activeTab) && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">{tabs.find(t => t.id === activeTab)?.label}</h3>
              <p className="text-gray-600">This section is under development</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

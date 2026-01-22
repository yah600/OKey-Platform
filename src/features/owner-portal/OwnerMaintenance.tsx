import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight, Wrench, Clock, DollarSign, AlertCircle, Filter, Calendar, User, X, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getPropertiesByOwner, getIssuesByProperty, getUserById } from '@/lib/data/mockData';

type TabType = 'all' | 'pending' | 'in_progress' | 'completed' | 'scheduled';
type PriorityFilter = 'all' | 'emergency' | 'high' | 'medium' | 'low';
type CategoryFilter = 'all' | 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'other';

interface EnrichedIssue {
  issue: any;
  reporter: any;
  unit: any;
  property: any;
}

export function OwnerMaintenance() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [issues, setIssues] = useState<EnrichedIssue[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');

  // Modals
  const [selectedIssue, setSelectedIssue] = useState<EnrichedIssue | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Assign modal form
  const [assignForm, setAssignForm] = useState({
    assigned_to: '',
    scheduled_date: '',
    scheduled_time: '',
    estimated_cost: '',
    notes: '',
    notify_tenant: true,
  });

  // Schedule preventive maintenance form
  const [scheduleForm, setScheduleForm] = useState({
    task_type: 'hvac_inspection',
    property_id: '',
    unit_id: '',
    description: '',
    scheduled_date: '',
    scheduled_time: '',
    frequency: 'one_time',
    assigned_to: '',
    estimated_cost: '',
    reminder_days: '7',
  });

  // Detail modal work tracking
  const [workDetails, setWorkDetails] = useState({
    status: '',
    estimated_cost: '',
    actual_cost: '',
    scheduled_date: '',
    completion_date: '',
    internal_notes: '',
  });

  useEffect(() => {
    if (!user) return;
    const owned = getPropertiesByOwner(user.id);
    setProperties(owned);

    // Load all maintenance issues
    const allIssues: EnrichedIssue[] = [];
    owned.forEach(property => {
      const propertyIssues = getIssuesByProperty(property.id);
      propertyIssues.forEach((issue: any) => {
        const reporter = getUserById(issue.reporter_id);
        const unit = property.units?.find((u: any) => u.id === issue.unit_id);
        allIssues.push({
          issue,
          reporter,
          unit,
          property,
        });
      });
    });

    setIssues(allIssues);
  }, [user]);

  // Calculate stats
  const stats = useMemo(() => {
    const openRequests = issues.filter(i => i.issue.status === 'pending' || i.issue.status === 'in_progress').length;
    const avgResponseTime = '< 24 hours'; // Mock
    const monthlyMaintenanceCost = 4250; // Mock

    return { openRequests, avgResponseTime, monthlyMaintenanceCost };
  }, [issues]);

  // Filter issues
  const filteredIssues = useMemo(() => {
    let filtered = issues.filter(i => {
      const propertyMatch = selectedProperty === 'all' || i.property.id === selectedProperty;
      const searchMatch = searchQuery === '' ||
        i.issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.unit?.unit_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.reporter?.full_name.toLowerCase().includes(searchQuery.toLowerCase());

      let tabMatch = true;
      if (activeTab === 'pending') {
        tabMatch = i.issue.status === 'pending';
      } else if (activeTab === 'in_progress') {
        tabMatch = i.issue.status === 'in_progress';
      } else if (activeTab === 'completed') {
        tabMatch = i.issue.status === 'completed';
      } else if (activeTab === 'scheduled') {
        tabMatch = i.issue.scheduled_date && new Date(i.issue.scheduled_date) > new Date();
      }

      const priorityMatch = priorityFilter === 'all' || i.issue.priority === priorityFilter;
      const categoryMatch = categoryFilter === 'all' || i.issue.category === categoryFilter;

      return propertyMatch && searchMatch && tabMatch && priorityMatch && categoryMatch;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.issue.created_at).getTime() - new Date(a.issue.created_at).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.issue.created_at).getTime() - new Date(b.issue.created_at).getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { emergency: 0, high: 1, medium: 2, low: 3 };
        return (priorityOrder[a.issue.priority as keyof typeof priorityOrder] || 4) -
               (priorityOrder[b.issue.priority as keyof typeof priorityOrder] || 4);
      }
      return 0;
    });

    return filtered;
  }, [issues, selectedProperty, searchQuery, activeTab, priorityFilter, categoryFilter, sortBy]);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Emergency</span>;
      case 'high':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">High</span>;
      case 'medium':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Medium</span>;
      case 'low':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Low</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Pending</span>;
      case 'in_progress':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">In Progress</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Completed</span>;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    return <Wrench className="w-5 h-5 text-gray-600" />;
  };

  const openDetailModal = (enrichedIssue: EnrichedIssue) => {
    setSelectedIssue(enrichedIssue);
    setWorkDetails({
      status: enrichedIssue.issue.status,
      estimated_cost: enrichedIssue.issue.estimated_cost || '',
      actual_cost: enrichedIssue.issue.actual_cost || '',
      scheduled_date: enrichedIssue.issue.scheduled_date || '',
      completion_date: enrichedIssue.issue.completed_at || '',
      internal_notes: enrichedIssue.issue.internal_notes || '',
    });
    setShowDetailModal(true);
  };

  const openAssignModal = (enrichedIssue: EnrichedIssue) => {
    setSelectedIssue(enrichedIssue);
    setAssignForm({
      assigned_to: enrichedIssue.issue.assigned_to || '',
      scheduled_date: enrichedIssue.issue.scheduled_date || '',
      scheduled_time: '',
      estimated_cost: enrichedIssue.issue.estimated_cost || '',
      notes: '',
      notify_tenant: true,
    });
    setShowAssignModal(true);
  };

  const handleAssign = () => {
    if (!assignForm.assigned_to) {
      alert('Please select a vendor/worker');
      return;
    }
    alert(`Maintenance request assigned to ${assignForm.assigned_to}`);
    setShowAssignModal(false);
  };

  const handleSchedulePreventive = () => {
    if (!scheduleForm.property_id || !scheduleForm.scheduled_date) {
      alert('Please fill in all required fields');
      return;
    }
    alert('Preventive maintenance scheduled successfully!');
    setShowScheduleModal(false);
    setScheduleForm({
      task_type: 'hvac_inspection',
      property_id: '',
      unit_id: '',
      description: '',
      scheduled_date: '',
      scheduled_time: '',
      frequency: 'one_time',
      assigned_to: '',
      estimated_cost: '',
      reminder_days: '7',
    });
  };

  const handleUpdateStatus = (newStatus: string) => {
    if (selectedIssue) {
      const updatedIssues = issues.map(i => {
        if (i.issue.id === selectedIssue.issue.id) {
          return { ...i, issue: { ...i.issue, status: newStatus } };
        }
        return i;
      });
      setIssues(updatedIssues);
      setSelectedIssue({ ...selectedIssue, issue: { ...selectedIssue.issue, status: newStatus } });
      alert(`Status updated to ${newStatus}`);
    }
  };

  const generateTimeline = (issue: any) => {
    const timeline = [];
    timeline.push({ event: 'Request submitted', date: issue.created_at, icon: AlertCircle });

    if (issue.assigned_to) {
      const assignedDate = new Date(new Date(issue.created_at).getTime() + 60 * 60 * 1000);
      timeline.push({ event: 'Assigned to maintenance team', date: assignedDate.toISOString(), icon: User });
    }

    if (issue.status === 'in_progress') {
      const startedDate = new Date(new Date(issue.created_at).getTime() + 2 * 60 * 60 * 1000);
      timeline.push({ event: 'Work started', date: startedDate.toISOString(), icon: Wrench });
    }

    if (issue.status === 'completed' && issue.completed_at) {
      timeline.push({ event: 'Work completed', date: issue.completed_at, icon: Clock });
    }

    return timeline;
  };

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
            <span className="text-gray-900 font-medium">Maintenance</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Maintenance Management</h1>
              <p className="text-gray-600 mt-1">Track and manage maintenance requests</p>
            </div>

            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Schedule Maintenance
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{stats.openRequests}</div>
                  <div className="text-sm text-gray-600">Open Requests</div>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.avgResponseTime}</div>
                  <div className="text-sm text-gray-600">Avg Response Time</div>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">${stats.monthlyMaintenanceCost.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Monthly Cost</div>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Property Filter */}
          {properties.length > 1 && (
            <div className="mb-4">
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
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-t-lg border-b">
          <div className="flex gap-8 px-6">
            {(['all', 'pending', 'in_progress', 'completed', 'scheduled'] as TabType[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Search by issue, unit, or tenant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="emergency">Emergency</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="hvac">HVAC</option>
              <option value="appliance">Appliance</option>
              <option value="structural">Structural</option>
              <option value="other">Other</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              {filteredIssues.length} requests
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-b-lg shadow">
          {filteredIssues.length === 0 ? (
            <div className="p-12 text-center">
              <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance requests</h3>
              <p className="text-gray-600">No requests match your current filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredIssues.map(enrichedIssue => (
                <div key={enrichedIssue.issue.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getCategoryIcon(enrichedIssue.issue.category)}
                        <h3 className="font-semibold text-gray-900">{enrichedIssue.issue.title}</h3>
                        {getPriorityBadge(enrichedIssue.issue.priority)}
                        {getStatusBadge(enrichedIssue.issue.status)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Property:</span> {enrichedIssue.property.name}
                        </div>
                        <div>
                          <span className="font-medium">Unit:</span> {enrichedIssue.unit?.unit_number || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Tenant:</span> {enrichedIssue.reporter?.full_name || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span> {new Date(enrichedIssue.issue.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">{enrichedIssue.issue.description}</p>

                      <div className="flex items-center gap-4 text-sm">
                        {enrichedIssue.issue.assigned_to ? (
                          <div className="text-gray-600">
                            <span className="font-medium">Assigned to:</span> {enrichedIssue.issue.assigned_to}
                          </div>
                        ) : (
                          <span className="text-orange-600 font-medium">Unassigned</span>
                        )}
                        {enrichedIssue.issue.estimated_cost && (
                          <div className="text-gray-600">
                            <span className="font-medium">Est. Cost:</span> ${enrichedIssue.issue.estimated_cost}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => openDetailModal(enrichedIssue)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 whitespace-nowrap"
                      >
                        View Details
                      </button>
                      {!enrichedIssue.issue.assigned_to && (
                        <button
                          onClick={() => openAssignModal(enrichedIssue)}
                          className="px-4 py-2 border border-blue-600 text-blue-600 text-sm rounded-lg hover:bg-blue-50 whitespace-nowrap"
                        >
                          Assign
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedIssue.issue.title}</h2>
                <p className="text-gray-600">Request ID: {selectedIssue.issue.id}</p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex gap-3">
                {getPriorityBadge(selectedIssue.issue.priority)}
                {getStatusBadge(selectedIssue.issue.status)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Property</label>
                  <p className="text-gray-900 font-medium">{selectedIssue.property.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Unit</label>
                  <p className="text-gray-900 font-medium">{selectedIssue.unit?.unit_number || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Submitted By</label>
                  <p className="text-gray-900 font-medium">{selectedIssue.reporter?.full_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Category</label>
                  <p className="text-gray-900 font-medium capitalize">{selectedIssue.issue.category}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Description</label>
                <p className="text-gray-900 mt-1">{selectedIssue.issue.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Work Tracking</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={workDetails.status}
                        onChange={(e) => {
                          setWorkDetails({...workDetails, status: e.target.value});
                          handleUpdateStatus(e.target.value);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                      <input
                        type="text"
                        value={selectedIssue.issue.assigned_to || 'Unassigned'}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                      <input
                        type="number"
                        value={workDetails.estimated_cost}
                        onChange={(e) => setWorkDetails({...workDetails, estimated_cost: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Actual Cost</label>
                      <input
                        type="number"
                        value={workDetails.actual_cost}
                        onChange={(e) => setWorkDetails({...workDetails, actual_cost: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                    <textarea
                      value={workDetails.internal_notes}
                      onChange={(e) => setWorkDetails({...workDetails, internal_notes: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add internal notes..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Activity Timeline</h3>
                <div className="space-y-3">
                  {generateTimeline(selectedIssue.issue).map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.event}</p>
                        <p className="text-xs text-gray-500">{new Date(item.date).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-xl w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Assign Maintenance Request</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Vendor/Worker *</label>
                <select
                  value={assignForm.assigned_to}
                  onChange={(e) => setAssignForm({...assignForm, assigned_to: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select worker...</option>
                  <option value="John's Plumbing">John's Plumbing</option>
                  <option value="ABC Electric">ABC Electric</option>
                  <option value="HVAC Masters">HVAC Masters</option>
                  <option value="Internal Team">Internal Team</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={assignForm.scheduled_date}
                    onChange={(e) => setAssignForm({...assignForm, scheduled_date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={assignForm.scheduled_time}
                    onChange={(e) => setAssignForm({...assignForm, scheduled_time: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                <input
                  type="number"
                  value={assignForm.estimated_cost}
                  onChange={(e) => setAssignForm({...assignForm, estimated_cost: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes to Assignee</label>
                <textarea
                  value={assignForm.notes}
                  onChange={(e) => setAssignForm({...assignForm, notes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add any special instructions..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={assignForm.notify_tenant}
                    onChange={(e) => setAssignForm({...assignForm, notify_tenant: e.target.checked})}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Send notification to tenant</span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Assign Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Preventive Maintenance Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Schedule Preventive Maintenance</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Type *</label>
                <select
                  value={scheduleForm.task_type}
                  onChange={(e) => setScheduleForm({...scheduleForm, task_type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hvac_inspection">HVAC Inspection</option>
                  <option value="fire_alarm">Fire Alarm Test</option>
                  <option value="plumbing_check">Plumbing Check</option>
                  <option value="elevator_service">Elevator Service</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property *</label>
                  <select
                    value={scheduleForm.property_id}
                    onChange={(e) => setScheduleForm({...scheduleForm, property_id: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select property</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit (Optional)</label>
                  <input
                    type="text"
                    value={scheduleForm.unit_id}
                    onChange={(e) => setScheduleForm({...scheduleForm, unit_id: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="or Common Area"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={scheduleForm.description}
                  onChange={(e) => setScheduleForm({...scheduleForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the maintenance task..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date *</label>
                  <input
                    type="date"
                    value={scheduleForm.scheduled_date}
                    onChange={(e) => setScheduleForm({...scheduleForm, scheduled_date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={scheduleForm.scheduled_time}
                    onChange={(e) => setScheduleForm({...scheduleForm, scheduled_time: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <select
                  value={scheduleForm.frequency}
                  onChange={(e) => setScheduleForm({...scheduleForm, frequency: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="one_time">One-time</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                  <select
                    value={scheduleForm.assigned_to}
                    onChange={(e) => setScheduleForm({...scheduleForm, assigned_to: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select worker...</option>
                    <option value="Internal Team">Internal Team</option>
                    <option value="External Vendor">External Vendor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                  <input
                    type="number"
                    value={scheduleForm.estimated_cost}
                    onChange={(e) => setScheduleForm({...scheduleForm, estimated_cost: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedulePreventive}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Schedule Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

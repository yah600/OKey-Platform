import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  ChevronRight,
  Wrench,
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  Upload,
  Loader2,
  Calendar,
  User,
  MapPin,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { getIssuesByReporter, getLeasesByTenant, getUserById, mockIssues } from '@/lib/data/mockData';

// ============================================================================
// TYPES
// ============================================================================

type IssueStatus = 'all' | 'pending' | 'in_progress' | 'completed' | 'cancelled';
type IssuePriority = 'all' | 'low' | 'medium' | 'high' | 'emergency';
type IssueCategory = 'all' | 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'pest_control' | 'other';
type DateRange = '30days' | '3months' | '6months' | 'all';
type SortOption = 'newest' | 'oldest' | 'priority' | 'status';

interface FormData {
  title: string;
  category: string;
  priority: string;
  description: string;
  location: string;
  photos: File[];
  accessInstructions: string;
}

interface FormErrors {
  title?: string;
  category?: string;
  priority?: string;
  description?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TenantMaintenance() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [loading, setLoading] = useState(true);
  const [allIssues, setAllIssues] = useState<any[]>([]);
  const [lease, setLease] = useState<any>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<IssueStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<IssuePriority>('all');
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRange>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: '',
    priority: 'medium',
    description: '',
    location: '',
    photos: [],
    accessInstructions: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);

  const itemsPerPage = 8;

  // Load data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      const issues = getIssuesByReporter(user.id);
      setAllIssues(issues);

      const leases = getLeasesByTenant(user.id);
      const activeLease = leases.find(l => l.status === 'active');
      setLease(activeLease);

      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = allIssues.length;
    const open = allIssues.filter(i => i.status === 'pending' || i.status === 'in_progress').length;
    const resolved = allIssues.filter(i => i.status === 'completed').length;
    return { total, open, resolved };
  }, [allIssues]);

  // Filter by date range
  const dateFilteredIssues = useMemo(() => {
    if (dateRangeFilter === 'all') return allIssues;

    const now = new Date();
    const days = dateRangeFilter === '30days' ? 30 : dateRangeFilter === '3months' ? 90 : 180;
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return allIssues.filter(issue => new Date(issue.created_at) >= cutoffDate);
  }, [allIssues, dateRangeFilter]);

  // Apply all filters
  const filteredIssues = useMemo(() => {
    let filtered = [...dateFilteredIssues];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        issue =>
          issue.title.toLowerCase().includes(query) ||
          issue.description?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(issue => issue.priority === priorityFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(issue => issue.category === categoryFilter);
    }

    // Sort
    const priorityOrder = { emergency: 4, high: 3, medium: 2, low: 1 };
    const statusOrder = { pending: 4, in_progress: 3, completed: 2, cancelled: 1 };

    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'priority':
          return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
        case 'status':
          return statusOrder[b.status as keyof typeof statusOrder] - statusOrder[a.status as keyof typeof statusOrder];
        default:
          return 0;
      }
    });

    return filtered;
  }, [dateFilteredIssues, searchQuery, statusFilter, priorityFilter, categoryFilter, sortOption]);

  // Pagination
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const paginatedIssues = filteredIssues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.title || formData.title.length < 10) {
      errors.title = 'Title must be at least 10 characters';
    }
    if (!formData.category) {
      errors.category = 'Please select a category';
    }
    if (!formData.priority) {
      errors.priority = 'Please select a priority';
    }
    if (!formData.description || formData.description.length < 20) {
      errors.description = 'Description must be at least 20 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitRequest = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newIssue = {
        id: `issue-${Date.now()}`,
        property_id: lease?.property_id || '',
        unit_id: lease?.unit_id || '',
        reporter_id: user?.id || '',
        assigned_to: null,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: 'pending',
        location: formData.location || null,
        photos: photoPreview,
        access_instructions: formData.accessInstructions || null,
        reported_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: null,
      };

      // Add to mock data
      mockIssues.push(newIssue);

      // Update local state
      setAllIssues([newIssue, ...allIssues]);

      // Reset form
      setFormData({
        title: '',
        category: '',
        priority: 'medium',
        description: '',
        location: '',
        photos: [],
        accessInstructions: '',
      });
      setPhotoPreview([]);
      setFormErrors({});

      setSubmitting(false);
      setShowSubmitModal(false);

      // Show success
      alert('Maintenance request submitted successfully!');
    }, 2000);
  };

  const handleCancelRequest = (issueId: string) => {
    if (!confirm('Are you sure you want to cancel this request? This action cannot be undone.')) {
      return;
    }

    // Update issue status
    const updatedIssues = allIssues.map(issue =>
      issue.id === issueId ? { ...issue, status: 'cancelled', updated_at: new Date().toISOString() } : issue
    );

    setAllIssues(updatedIssues);
    setShowDetailModal(false);
    alert(`Request #${issueId} cancelled successfully`);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.photos.length > 5) {
      alert('Maximum 5 photos allowed');
      return;
    }

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setPhotoPreview([...photoPreview, ...previews]);
    setFormData({ ...formData, photos: [...formData.photos, ...files] });
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...formData.photos];
    const newPreviews = [...photoPreview];
    newPhotos.splice(index, 1);
    newPreviews.splice(index, 1);
    setFormData({ ...formData, photos: newPhotos });
    setPhotoPreview(newPreviews);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setDateRangeFilter('all');
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-700',
      in_progress: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-gray-100 text-gray-700',
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-blue-100 text-blue-700',
      high: 'bg-orange-100 text-orange-700',
      emergency: 'bg-red-100 text-red-700',
    };
    return badges[priority as keyof typeof badges] || badges.medium;
  };

  const getCategoryIcon = (category: string) => {
    // Return wrench icon for all (can be customized later)
    return <Wrench className="w-4 h-4" />;
  };

  const generateTimeline = (issue: any) => {
    const timeline = [];

    timeline.push({
      event: 'Request submitted',
      date: issue.created_at,
    });

    if (issue.assigned_to) {
      const assignedDate = new Date(new Date(issue.created_at).getTime() + 60 * 60 * 1000);
      timeline.push({
        event: `Assigned to maintenance team`,
        date: assignedDate.toISOString(),
      });
    }

    if (issue.status === 'in_progress') {
      const startedDate = new Date(new Date(issue.created_at).getTime() + 2 * 60 * 60 * 1000);
      timeline.push({
        event: 'Work started',
        date: startedDate.toISOString(),
      });
    }

    if (issue.status === 'completed' && issue.completed_at) {
      timeline.push({
        event: 'Work completed',
        date: issue.completed_at,
      });
    }

    if (issue.status === 'cancelled') {
      timeline.push({
        event: 'Request cancelled',
        date: issue.updated_at,
      });
    }

    return timeline;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading maintenance requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <button onClick={() => navigate('/')} className="hover:text-blue-600 flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Maintenance</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Maintenance Requests</h1>
              <p className="text-gray-600 mt-1">Submit and track your maintenance requests</p>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Submit New Request
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="text-sm text-blue-700 mb-1">Total Requests</div>
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
              <div className="text-sm text-yellow-700 mb-1">Open</div>
              <div className="text-2xl font-bold text-yellow-900">{stats.open}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="text-sm text-green-700 mb-1">Resolved</div>
              <div className="text-2xl font-bold text-green-900">{stats.resolved}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="text-sm text-purple-700 mb-1">Avg Response</div>
              <div className="text-2xl font-bold text-purple-900">&lt; 24h</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as IssueStatus);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value as IssuePriority);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="emergency">Emergency</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value as IssueCategory);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="hvac">HVAC</option>
              <option value="appliance">Appliance</option>
              <option value="structural">Structural</option>
              <option value="pest_control">Pest Control</option>
              <option value="other">Other</option>
            </select>

            {/* Sort */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
            </select>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all') && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Request List */}
        {filteredIssues.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {allIssues.length === 0
                ? 'No maintenance requests yet'
                : 'No requests match your filters'}
            </h3>
            <p className="text-gray-600 mb-6">
              {allIssues.length === 0
                ? 'Submit your first request to get started'
                : 'Try adjusting your search or filters'}
            </p>
            {allIssues.length === 0 ? (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Submit New Request
              </button>
            ) : (
              <button
                onClick={clearFilters}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Request Cards */}
            <div className="space-y-4 mb-6">
              {paginatedIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-xs font-mono text-gray-500">#{issue.id.slice(-6).toUpperCase()}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(issue.status)}`}>
                              {issue.status.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(issue.priority)}`}>
                              {issue.priority.toUpperCase()}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{issue.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            {getCategoryIcon(issue.category)}
                            <span className="capitalize">{issue.category.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Description Preview */}
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {issue.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Submitted {formatDate(issue.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Updated {formatDate(issue.updated_at)}
                        </div>
                        {issue.assigned_to ? (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            Assigned
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            Unassigned
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:w-40">
                      <button
                        onClick={() => {
                          setSelectedIssue(issue);
                          setShowDetailModal(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium whitespace-nowrap"
                      >
                        View Details
                      </button>
                      {issue.status === 'pending' && (
                        <button
                          onClick={() => handleCancelRequest(issue.id)}
                          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium whitespace-nowrap"
                        >
                          Cancel Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages} ({filteredIssues.length} total)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    Next
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Submit Request Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-2xl w-full my-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">Submit Maintenance Request</h2>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of the issue"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (formErrors.title) setFormErrors({ ...formErrors, title: undefined });
                    }}
                    maxLength={100}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      formErrors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.title && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.title}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100 characters</p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value });
                      if (formErrors.category) setFormErrors({ ...formErrors, category: undefined });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      formErrors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="hvac">HVAC</option>
                    <option value="appliance">Appliance</option>
                    <option value="structural">Structural</option>
                    <option value="pest_control">Pest Control</option>
                    <option value="other">Other</option>
                  </select>
                  {formErrors.category && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.category}</p>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'low', label: 'Low', desc: 'Can wait a few days' },
                      { value: 'medium', label: 'Medium', desc: 'Needs attention soon' },
                      { value: 'high', label: 'High', desc: 'Urgent, affects daily life' },
                      { value: 'emergency', label: 'Emergency', desc: 'Immediate safety concern' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.priority === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="priority"
                          value={option.value}
                          checked={formData.priority === option.value}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          className="sr-only"
                        />
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Provide detailed information about the issue..."
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (formErrors.description) setFormErrors({ ...formErrors, description: undefined });
                    }}
                    maxLength={1000}
                    rows={5}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none ${
                      formErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.description && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{formData.description.length}/1000 characters</p>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Kitchen, Master Bathroom, Living Room"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Specify the exact location within your unit</p>
                </div>

                {/* Photos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photos (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Max 5 photos, 5MB each</p>
                    </label>
                  </div>

                  {/* Photo Previews */}
                  {photoPreview.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {photoPreview.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Access Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Instructions (Optional)
                  </label>
                  <textarea
                    placeholder="Any special instructions for accessing your unit..."
                    value={formData.accessInstructions}
                    onChange={(e) => setFormData({ ...formData, accessInstructions: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Let us know if someone will be home, where keys are, etc.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-6 border-t">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRequest}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* View Details Modal */}
      <AnimatePresence>
        {showDetailModal && selectedIssue && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-3xl w-full my-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedIssue.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-gray-500">
                      #{selectedIssue.id.slice(-6).toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedIssue.status)}`}>
                      {selectedIssue.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(selectedIssue.priority)}`}>
                      {selectedIssue.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto">
                {/* Request Information */}
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Category</div>
                    <div className="font-medium text-gray-900 capitalize flex items-center gap-2">
                      {getCategoryIcon(selectedIssue.category)}
                      {selectedIssue.category.replace('_', ' ')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Priority</div>
                    <div className="font-medium text-gray-900 capitalize">{selectedIssue.priority}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Submitted</div>
                    <div className="font-medium text-gray-900">{formatDate(selectedIssue.created_at)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Last Updated</div>
                    <div className="font-medium text-gray-900">{formatDate(selectedIssue.updated_at)}</div>
                  </div>
                  {selectedIssue.location && (
                    <div className="col-span-2">
                      <div className="text-xs text-gray-500 mb-1">Location</div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {selectedIssue.location}
                      </div>
                    </div>
                  )}
                  <div className="col-span-2">
                    <div className="text-xs text-gray-500 mb-1">Assigned To</div>
                    <div className="font-medium text-gray-900">
                      {selectedIssue.assigned_to ? 'Maintenance Team' : 'Unassigned'}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Description
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedIssue.description}</p>
                </div>

                {/* Photos */}
                {selectedIssue.photos && selectedIssue.photos.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Photos
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedIssue.photos.map((photo: string, index: number) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90"
                          onClick={() => window.open(photo, '_blank')}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Access Instructions */}
                {selectedIssue.access_instructions && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Access Instructions</h3>
                    <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                      {selectedIssue.access_instructions}
                    </p>
                  </div>
                )}

                {/* Activity Timeline */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Activity Timeline
                  </h3>
                  <div className="space-y-3">
                    {generateTimeline(selectedIssue).map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          {index < generateTimeline(selectedIssue).length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="font-medium text-gray-900">{item.event}</div>
                          <div className="text-sm text-gray-500">{formatDate(item.date)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-6 border-t">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Close
                </button>
                {(selectedIssue.status === 'pending' || selectedIssue.status === 'in_progress') && (
                  <button
                    onClick={() => handleCancelRequest(selectedIssue.id)}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

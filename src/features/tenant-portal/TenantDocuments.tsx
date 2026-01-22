import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  ChevronRight,
  FileText,
  Download,
  Share2,
  Grid,
  List,
  Search,
  X,
  File,
  Image as ImageIcon,
  Receipt,
  Shield,
  Book,
  Bell,
  Loader2,
  Eye,
  Calendar,
  User,
  Folder,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { getDocumentsByUser, getLeasesByTenant } from '@/lib/data/mockData';

// Types
type ViewMode = 'grid' | 'list';
type CategoryFilter = 'all' | 'lease' | 'receipts' | 'notices' | 'policies' | 'building_rules' | 'insurance' | 'other';
type DateFilter = 'all' | '30days' | '3months' | '6months' | '1year';
type SortOption = 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'category';

export function TenantDocuments() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [loading, setLoading] = useState(true);
  const [allDocuments, setAllDocuments] = useState<any[]>([]);
  const [lease, setLease] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Modal state
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  // Request form state
  const [requestForm, setRequestForm] = useState({
    documentType: '',
    description: '',
    urgency: 'soon',
  });
  const [requestErrors, setRequestErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  // Load data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      const docs = getDocumentsByUser(user.id);
      setAllDocuments(docs);

      const leases = getLeasesByTenant(user.id);
      const activeLease = leases.find(l => l.status === 'active');
      setLease(activeLease);

      // Load saved view preference
      const savedView = localStorage.getItem(`documentViewMode_${user.id}`);
      if (savedView) setViewMode(savedView as ViewMode);

      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = allDocuments.length;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recent = allDocuments.filter(d => new Date(d.uploaded_at) >= thirtyDaysAgo).length;
    const storageBytes = allDocuments.reduce((sum, d) => sum + (d.file_size || 0), 0);
    const storageMB = (storageBytes / (1024 * 1024)).toFixed(1);
    return { total, recent, storage: `${storageMB} MB of 500 MB` };
  }, [allDocuments]);

  // Filter by date
  const dateFilteredDocs = useMemo(() => {
    if (dateFilter === 'all') return allDocuments;
    const days = dateFilter === '30days' ? 30 : dateFilter === '3months' ? 90 : dateFilter === '6months' ? 180 : 365;
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return allDocuments.filter(d => new Date(d.uploaded_at) >= cutoff);
  }, [allDocuments, dateFilter]);

  // Apply all filters
  const filteredDocuments = useMemo(() => {
    let filtered = [...dateFilteredDocs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(query) ||
        d.description?.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(d => d.category === categoryFilter);
    }

    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
        case 'oldest':
          return new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime();
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [dateFilteredDocs, searchQuery, categoryFilter, sortOption]);

  // Handlers
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (user) {
      localStorage.setItem(`documentViewMode_${user.id}`, mode);
    }
  };

  const handleDownload = (doc: any) => {
    alert(`Downloading ${doc.name}...`);
  };

  const handleShare = (doc: any) => {
    alert('Link copied to clipboard!');
  };

  const validateRequestForm = () => {
    const errors: any = {};
    if (!requestForm.documentType) errors.documentType = 'Please select a document type';
    if (!requestForm.description || requestForm.description.length < 20) {
      errors.description = 'Description must be at least 20 characters';
    }
    setRequestErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitRequest = () => {
    if (!validateRequestForm()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setShowRequestModal(false);
      setRequestForm({ documentType: '', description: '', urgency: 'soon' });
      setRequestErrors({});
      alert("Document request submitted. You'll receive it via email when ready.");
    }, 2000);
  };

  const getCategoryBadge = (category: string) => {
    const badges: any = {
      lease: 'bg-blue-100 text-blue-700',
      receipts: 'bg-green-100 text-green-700',
      notices: 'bg-yellow-100 text-yellow-700',
      policies: 'bg-purple-100 text-purple-700',
      building_rules: 'bg-orange-100 text-orange-700',
      insurance: 'bg-indigo-100 text-indigo-700',
      other: 'bg-gray-100 text-gray-700',
    };
    return badges[category] || badges.other;
  };

  const getCategoryIcon = (category: string) => {
    const icons: any = {
      lease: FileText,
      receipts: Receipt,
      notices: Bell,
      policies: Shield,
      building_rules: Book,
      insurance: Shield,
      other: File,
    };
    const Icon = icons[category] || File;
    return <Icon className="w-5 h-5" />;
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <File className="w-12 h-12 text-red-500" />;
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) return <ImageIcon className="w-12 h-12 text-purple-500" />;
    if (['doc', 'docx'].includes(ext || '')) return <FileText className="w-12 h-12 text-blue-500" />;
    return <File className="w-12 h-12 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <button onClick={() => navigate('/')} className="hover:text-blue-600 flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Documents</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
              <p className="text-gray-600 mt-1">View and manage your documents</p>
            </div>
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Request Document
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="text-sm text-blue-700 mb-1">Total Documents</div>
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="text-sm text-green-700 mb-1">Recent Uploads</div>
              <div className="text-2xl font-bold text-green-900">{stats.recent}</div>
              <div className="text-xs text-green-600">Last 30 days</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="text-sm text-purple-700 mb-1">Storage Used</div>
              <div className="text-lg font-bold text-purple-900">{stats.storage}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by filename or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="lease">Lease Documents</option>
              <option value="receipts">Receipts</option>
              <option value="notices">Notices</option>
              <option value="policies">Policies</option>
              <option value="building_rules">Building Rules</option>
              <option value="insurance">Insurance</option>
              <option value="other">Other</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilter)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="30days">Last 30 days</option>
              <option value="3months">Last 3 months</option>
              <option value="6months">Last 6 months</option>
              <option value="1year">Last Year</option>
            </select>
            <div className="flex gap-2 border rounded-lg p-1">
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleViewModeChange('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        {/* Documents Display */}
        {filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {allDocuments.length === 0 ? 'No documents yet' : 'No documents match your search'}
            </h3>
            <p className="text-gray-600 mb-6">
              {allDocuments.length === 0 ? 'Your documents will appear here' : 'Try different keywords or filters'}
            </p>
            {allDocuments.length > 0 && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setDateFilter('all');
                }}
                className="px-6 py-3 border rounded-lg hover:bg-gray-50 font-medium"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => {
                  setSelectedDocument(doc);
                  setShowPreviewModal(true);
                }}
                className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">{getFileIcon(doc.name)}</div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{doc.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium mb-3 ${getCategoryBadge(doc.category)}`}>
                    {doc.category.replace('_', ' ')}
                  </span>
                  <div className="text-sm text-gray-600 mb-1">{formatFileSize(doc.file_size || 0)}</div>
                  <div className="text-xs text-gray-500">{formatDate(doc.uploaded_at)}</div>
                  <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(doc);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(doc);
                      }}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocument(doc);
                      setShowPreviewModal(true);
                    }}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">{getFileIcon(doc.name)}</div>
                        <span className="font-medium text-gray-900">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadge(doc.category)}`}>
                        {doc.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatFileSize(doc.file_size || 0)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(doc.uploaded_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(doc);
                          }}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(doc);
                          }}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <Share2 className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedDocument.name}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadge(selectedDocument.category)}`}>
                    {selectedDocument.category.replace('_', ' ')}
                  </span>
                </div>
                <button onClick={() => setShowPreviewModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-gray-100 rounded-lg p-12 text-center mb-6">
                  {getFileIcon(selectedDocument.name)}
                  <p className="text-gray-600 mt-4">PDF viewer would display here</p>
                </div>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">File Size</div>
                    <div className="font-medium text-gray-900">{formatFileSize(selectedDocument.file_size || 0)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Upload Date</div>
                    <div className="font-medium text-gray-900">{formatDate(selectedDocument.uploaded_at)}</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 p-6 border-t">
                <button
                  onClick={() => handleDownload(selectedDocument)}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
                <button
                  onClick={() => handleShare(selectedDocument)}
                  className="px-6 py-3 border rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-6 py-3 border rounded-lg hover:bg-gray-50 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Request Document Modal */}
      <AnimatePresence>
        {showRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">Request Document</h2>
                <button onClick={() => setShowRequestModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={requestForm.documentType}
                    onChange={(e) => {
                      setRequestForm({ ...requestForm, documentType: e.target.value });
                      if (requestErrors.documentType) setRequestErrors({ ...requestErrors, documentType: undefined });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      requestErrors.documentType ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Select a document type</option>
                    <option value="lease_amendment">Lease Amendment</option>
                    <option value="parking_permit">Parking Permit</option>
                    <option value="insurance_certificate">Insurance Certificate</option>
                    <option value="tax_statement">Tax Statement</option>
                    <option value="utility_bill">Utility Bill</option>
                    <option value="condo_fees">Condo Fees Breakdown</option>
                    <option value="move_in_checklist">Move-in Checklist</option>
                    <option value="other">Other</option>
                  </select>
                  {requestErrors.documentType && <p className="text-sm text-red-600 mt-1">{requestErrors.documentType}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Please describe what document you need and why..."
                    value={requestForm.description}
                    onChange={(e) => {
                      setRequestForm({ ...requestForm, description: e.target.value });
                      if (requestErrors.description) setRequestErrors({ ...requestErrors, description: undefined });
                    }}
                    maxLength={500}
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none ${
                      requestErrors.description ? 'border-red-500' : ''
                    }`}
                  />
                  {requestErrors.description && <p className="text-sm text-red-600 mt-1">{requestErrors.description}</p>}
                  <p className="text-xs text-gray-500 mt-1">{requestForm.description.length}/500 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'not_urgent', label: 'Not Urgent', desc: 'Can wait a week' },
                      { value: 'soon', label: 'Soon', desc: 'Need within a few days' },
                      { value: 'urgent', label: 'Urgent', desc: 'Need ASAP' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`p-3 border-2 rounded-lg cursor-pointer ${
                          requestForm.urgency === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="urgency"
                          value={option.value}
                          checked={requestForm.urgency === option.value}
                          onChange={(e) => setRequestForm({ ...requestForm, urgency: e.target.value })}
                          className="sr-only"
                        />
                        <div className="font-medium text-gray-900 text-sm">{option.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 p-6 border-t">
                <button
                  onClick={() => setShowRequestModal(false)}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 border rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
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
    </div>
  );
}

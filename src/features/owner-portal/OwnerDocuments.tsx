import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight, FileText, Upload, Folder, File, Image, Download, Share2, Trash2, Eye, X, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getPropertiesByOwner, getDocumentsByOwner } from '@/lib/mockData';

type ViewMode = 'grid' | 'list';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  folder: string;
  property_id?: string;
  uploaded_at: string;
  shared_with_tenants: boolean;
  tags?: string[];
}

export function OwnerDocuments() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  // Upload form
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadForms, setUploadForms] = useState<any[]>([]);

  // Share form
  const [shareForm, setShareForm] = useState({
    shareWith: 'all_tenants',
    selectedTenants: [] as string[],
    permissions: 'view',
    expiration: '',
    sendNotification: true,
    message: '',
  });

  useEffect(() => {
    if (!user) return;
    const owned = getPropertiesByOwner(user.id);
    setProperties(owned);

    const ownerDocs = getDocumentsByOwner(user.id);
    setDocuments(ownerDocs as Document[]);

    // Load view preference
    const savedView = localStorage.getItem(`ownerDocumentViewMode_${user.id}`);
    if (savedView) setViewMode(savedView as ViewMode);
  }, [user]);

  // Folder structure
  const folderStructure = useMemo(() => {
    return {
      all: 'All Documents',
      properties: 'Properties',
      financial: 'Financial Documents',
      legal: 'Legal Documents',
      leases: 'Leases',
      shared: 'Shared with Tenants',
    };
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const totalDocs = documents.length;
    const sharedCount = documents.filter(d => d.shared_with_tenants).length;
    const totalSize = documents.reduce((sum, d) => sum + d.size, 0);
    const storageUsed = (totalSize / (1024 * 1024 * 1024)).toFixed(2); // GB

    return { totalDocs, sharedCount, storageUsed };
  }, [documents]);

  // Filter documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents.filter(doc => {
      const folderMatch = selectedFolder === 'all' ||
        doc.folder === selectedFolder ||
        (selectedFolder === 'shared' && doc.shared_with_tenants);

      const searchMatch = searchQuery === '' ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const typeMatch = typeFilter === 'all' || doc.type === typeFilter;
      const propertyMatch = propertyFilter === 'all' || doc.property_id === propertyFilter;

      return folderMatch && searchMatch && typeMatch && propertyMatch;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'date') {
        return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
      } else if (sortBy === 'size') {
        return b.size - a.size;
      }
      return 0;
    });

    return filtered;
  }, [documents, selectedFolder, searchQuery, typeFilter, propertyFilter, sortBy]);

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-600" />;
    if (type.includes('image')) return <Image className="w-8 h-8 text-blue-600" />;
    if (type.includes('word') || type.includes('doc')) return <FileText className="w-8 h-8 text-blue-700" />;
    if (type.includes('excel') || type.includes('sheet')) return <FileText className="w-8 h-8 text-green-700" />;
    return <File className="w-8 h-8 text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (user) {
      localStorage.setItem(`ownerDocumentViewMode_${user.id}`, mode);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadFiles(files);
    setUploadForms(files.map(file => ({
      file,
      property_id: '',
      folder: 'properties',
      description: '',
      share_with_tenants: false,
      selected_tenants: [],
      tags: '',
    })));
  };

  const handleUpload = () => {
    if (uploadFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }

    setTimeout(() => {
      alert(`${uploadFiles.length} document(s) uploaded successfully!`);
      setShowUploadModal(false);
      setUploadFiles([]);
      setUploadForms([]);
    }, 2000);
  };

  const handleShare = () => {
    if (shareForm.shareWith === 'specific' && shareForm.selectedTenants.length === 0) {
      alert('Please select at least one tenant');
      return;
    }

    alert('Document(s) shared successfully!');
    setShowShareModal(false);
  };

  const handleDelete = (docId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(d => d.id !== docId));
      alert('Document deleted successfully');
    }
  };

  const toggleDocumentSelection = (docId: string) => {
    if (selectedDocuments.includes(docId)) {
      setSelectedDocuments(selectedDocuments.filter(id => id !== docId));
    } else {
      setSelectedDocuments([...selectedDocuments, docId]);
    }
  };

  const getPropertyName = (propertyId?: string) => {
    if (!propertyId) return 'All Properties';
    return properties.find(p => p.id === propertyId)?.name || 'Unknown';
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
            <span className="text-gray-900 font-medium">Documents</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
              <p className="text-gray-600 mt-1">Organize and share property documents</p>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Folder className="w-4 h-4" />
                Create Folder
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Document
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{stats.totalDocs}</div>
              <div className="text-sm text-gray-600">Total Documents</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{stats.sharedCount}</div>
              <div className="text-sm text-gray-600">Shared with Tenants</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{stats.storageUsed} GB</div>
              <div className="text-sm text-gray-600">Storage Used</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar - Folder Tree */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Folders</h3>
              <div className="space-y-1">
                {Object.entries(folderStructure).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedFolder(key)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      selectedFolder === key
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Folder className="w-4 h-4" />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-wrap gap-4 items-center">
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="application/pdf">PDF</option>
                  <option value="image">Images</option>
                  <option value="word">Word</option>
                  <option value="excel">Excel</option>
                </select>

                {properties.length > 1 && (
                  <select
                    value={propertyFilter}
                    onChange={(e) => setPropertyFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Properties</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                )}

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="size">Sort by Size</option>
                </select>

                <div className="flex gap-1 border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleViewModeChange('grid')}
                    className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => handleViewModeChange('list')}
                    className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedDocuments.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {selectedDocuments.length} document(s) selected
                </span>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    Move to Folder
                  </button>
                  <button
                    onClick={() => {
                      setShowShareModal(true);
                      setSelectedDocument(null);
                    }}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    Share
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    Download
                  </button>
                  <button
                    onClick={() => setSelectedDocuments([])}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Documents Display */}
            {filteredDocuments.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-600">Upload documents or adjust your filters.</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map(doc => (
                  <div key={doc.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedDocuments.includes(doc.id)}
                            onChange={() => toggleDocumentSelection(doc.id)}
                            className="w-4 h-4 text-blue-600"
                          />
                          {getFileIcon(doc.type)}
                        </label>
                        {doc.shared_with_tenants && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                            Shared
                          </span>
                        )}
                      </div>

                      <h3 className="font-medium text-gray-900 mb-2 truncate" title={doc.name}>
                        {doc.name}
                      </h3>

                      <div className="text-sm text-gray-600 space-y-1 mb-4">
                        <div>{formatFileSize(doc.size)}</div>
                        <div>{new Date(doc.uploaded_at).toLocaleDateString()}</div>
                        {doc.property_id && (
                          <div className="text-xs text-gray-500">{getPropertyName(doc.property_id)}</div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedDocument(doc);
                            setShowPreviewModal(true);
                          }}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                        <button className="px-3 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.length === filteredDocuments.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDocuments(filteredDocuments.map(d => d.id));
                            } else {
                              setSelectedDocuments([]);
                            }
                          }}
                          className="w-4 h-4 text-blue-600"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Folder</th>
                      {properties.length > 1 && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shared</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDocuments.map(doc => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedDocuments.includes(doc.id)}
                            onChange={() => toggleDocumentSelection(doc.id)}
                            className="w-4 h-4 text-blue-600"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">{getFileIcon(doc.type)}</div>
                            <div className="font-medium text-gray-900">{doc.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 capitalize">{doc.folder}</td>
                        {properties.length > 1 && (
                          <td className="px-6 py-4 text-sm text-gray-600">{getPropertyName(doc.property_id)}</td>
                        )}
                        <td className="px-6 py-4 text-sm text-gray-600">{formatFileSize(doc.size)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          {doc.shared_with_tenants ? (
                            <span className="text-green-600 text-sm">Yes</span>
                          ) : (
                            <span className="text-gray-400 text-sm">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedDocument(doc);
                                setShowPreviewModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-700">
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDocument(doc);
                                setShowShareModal(true);
                              }}
                              className="text-gray-600 hover:text-gray-700"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(doc.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
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
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Upload Documents</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Select Files
                </label>
                <p className="text-xs text-gray-500 mt-2">Max 25 MB per file. PDF, DOC, XLS, images, ZIP</p>
              </div>

              {uploadFiles.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Selected Files ({uploadFiles.length})</h3>
                  {uploadForms.map((form, idx) => (
                    <div key={idx} className="border border-gray-300 rounded-lg p-4 space-y-3">
                      <div className="font-medium text-gray-900">{form.file.name}</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                          <select
                            value={form.property_id}
                            onChange={(e) => {
                              const newForms = [...uploadForms];
                              newForms[idx].property_id = e.target.value;
                              setUploadForms(newForms);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="">All Properties</option>
                            {properties.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Folder</label>
                          <select
                            value={form.folder}
                            onChange={(e) => {
                              const newForms = [...uploadForms];
                              newForms[idx].folder = e.target.value;
                              setUploadForms(newForms);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="properties">Properties</option>
                            <option value="financial">Financial</option>
                            <option value="legal">Legal</option>
                            <option value="leases">Leases</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.share_with_tenants}
                            onChange={(e) => {
                              const newForms = [...uploadForms];
                              newForms[idx].share_with_tenants = e.target.checked;
                              setUploadForms(newForms);
                            }}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">Share with tenants</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFiles([]);
                  setUploadForms([]);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Upload Documents
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{selectedDocument.name}</h2>
              <button onClick={() => setShowPreviewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gray-100 rounded-lg p-12 text-center mb-6">
                {getFileIcon(selectedDocument.type)}
                <p className="text-gray-600 mt-4">Document preview</p>
                <p className="text-sm text-gray-500">{selectedDocument.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div>
                  <span className="text-gray-600">Size:</span>
                  <span className="ml-2 text-gray-900">{formatFileSize(selectedDocument.size)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Uploaded:</span>
                  <span className="ml-2 text-gray-900">{new Date(selectedDocument.uploaded_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Folder:</span>
                  <span className="ml-2 text-gray-900 capitalize">{selectedDocument.folder}</span>
                </div>
                <div>
                  <span className="text-gray-600">Shared:</span>
                  <span className="ml-2 text-gray-900">{selectedDocument.shared_with_tenants ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    setShowShareModal(true);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedDocument.id);
                    setShowPreviewModal(false);
                  }}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-xl w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Share Document(s)</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Share With</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="shareWith"
                      value="all_tenants"
                      checked={shareForm.shareWith === 'all_tenants'}
                      onChange={(e) => setShareForm({...shareForm, shareWith: e.target.value})}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">All Tenants</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="shareWith"
                      value="specific"
                      checked={shareForm.shareWith === 'specific'}
                      onChange={(e) => setShareForm({...shareForm, shareWith: e.target.value})}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Specific Tenants</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="permissions"
                      value="view"
                      checked={shareForm.permissions === 'view'}
                      onChange={(e) => setShareForm({...shareForm, permissions: e.target.value})}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">View Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="permissions"
                      value="download"
                      checked={shareForm.permissions === 'download'}
                      onChange={(e) => setShareForm({...shareForm, permissions: e.target.value})}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">View + Download</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date (Optional)</label>
                <input
                  type="date"
                  value={shareForm.expiration}
                  onChange={(e) => setShareForm({...shareForm, expiration: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shareForm.sendNotification}
                    onChange={(e) => setShareForm({...shareForm, sendNotification: e.target.checked})}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Send email notification</span>
                </label>
              </div>

              {shareForm.sendNotification && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom Message</label>
                  <textarea
                    value={shareForm.message}
                    onChange={(e) => setShareForm({...shareForm, message: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a message to recipients..."
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Share Document(s)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

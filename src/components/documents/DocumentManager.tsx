import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, Upload, Download, Eye, Trash2, File, FileSpreadsheet,
  FileImage, Search, Filter, Grid, List, X, Check, AlertCircle, Folder
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  size: string;
  uploadedDate: string;
  url?: string;
}

interface DocumentManagerProps {
  documents: Document[];
  onUpload: (file: File, category: string) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
  userRole: 'tenant' | 'owner';
}

const categories = [
  { id: 'lease', label: 'Lease Documents', icon: FileText, color: 'blue' },
  { id: 'invoice', label: 'Invoices & Receipts', icon: FileSpreadsheet, color: 'green' },
  { id: 'maintenance', label: 'Maintenance', icon: File, color: 'amber' },
  { id: 'insurance', label: 'Insurance', icon: FileText, color: 'purple' },
  { id: 'inspection', label: 'Inspections', icon: FileImage, color: 'cyan' },
  { id: 'other', label: 'Other', icon: Folder, color: 'neutral' },
];

export function DocumentManager({ documents, onUpload, onDelete, onDownload, userRole }: DocumentManagerProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploading, setUploading] = useState(false);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileText;
    if (type.includes('spreadsheet') || type.includes('excel')) return FileSpreadsheet;
    if (type.includes('image')) return FileImage;
    return File;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadCategory) return;

    setUploading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload
    onUpload(uploadFile, uploadCategory);
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadCategory('');
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Document Library</h2>
          <p className="text-neutral-600 mt-1">
            Manage and organize your documents securely
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-6 py-3 gradient-primary text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.slice(0, 4).map((category) => {
          const Icon = category.icon;
          const count = documents.filter(d => d.category === category.id).length;
          return (
            <div
              key={category.id}
              className="card-premium p-5 cursor-pointer"
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${category.color}-600`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-neutral-900">{count}</div>
              <div className="text-sm text-neutral-600">{category.label}</div>
            </div>
          );
        })}
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="input-premium w-full pl-12"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-premium"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
          <div className="flex bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-neutral-200'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-neutral-200'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Documents Display */}
      {filteredDocuments.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No documents found</h3>
          <p className="text-neutral-600 mb-4">
            {searchQuery ? 'Try adjusting your search' : 'Upload your first document to get started'}
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-2.5 gradient-primary text-white rounded-xl font-semibold hover:shadow-xl transition-all inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => {
            const Icon = getFileIcon(doc.type);
            const category = categories.find(c => c.id === doc.category);
            return (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-premium card-interactive p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 bg-${category?.color}-100 rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${category?.color}-600`} />
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-lg bg-${category?.color}-100 text-${category?.color}-700`}>
                    {category?.label}
                  </span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-1 truncate">{doc.name}</h3>
                <p className="text-sm text-neutral-600 mb-3">
                  {doc.size} • {new Date(doc.uploadedDate).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onDownload(doc.id)}
                    className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-1.5 text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  {userRole === 'owner' && (
                    <button
                      onClick={() => onDelete(doc.id)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="card-premium divide-y">
          {filteredDocuments.map((doc) => {
            const Icon = getFileIcon(doc.type);
            const category = categories.find(c => c.id === doc.category);
            return (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-5 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-${category?.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 text-${category?.color}-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 truncate">{doc.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded bg-${category?.color}-100 text-${category?.color}-700`}>
                        {category?.label}
                      </span>
                      <span className="text-sm text-neutral-600">
                        {doc.size} • {new Date(doc.uploadedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onDownload(doc.id)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    {userRole === 'owner' && (
                      <button
                        onClick={() => onDelete(doc.id)}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-neutral-900">Upload Document</h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6 text-neutral-500" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Select Category *
                    </label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="input-premium w-full"
                    >
                      <option value="">Choose a category...</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Choose File *
                    </label>
                    <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="document-upload"
                      />
                      <label
                        htmlFor="document-upload"
                        className="flex flex-col items-center cursor-pointer"
                      >
                        {uploadFile ? (
                          <>
                            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                              <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <div className="text-sm font-medium text-neutral-900 mb-1">
                              {uploadFile.name}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                              <Upload className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="text-sm font-medium text-neutral-900 mb-1">
                              Click to upload or drag and drop
                            </div>
                            <div className="text-xs text-neutral-500">
                              PDF, DOC, XLS, IMG up to 25MB
                            </div>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="flex-1 px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={!uploadFile || !uploadCategory || uploading}
                      className="flex-1 gradient-primary text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

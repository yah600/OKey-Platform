import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useDocumentsStore, type Document } from '../../store/documentsStore';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { toast } from 'sonner';

const documentUploadSchema = z.object({
  name: z.string().min(3, 'Document name must be at least 3 characters'),
  category: z.enum(['lease', 'receipt', 'inspection', 'addendum', 'notice', 'insurance', 'other']),
  description: z.string().optional(),
});

type DocumentUploadFormData = z.infer<typeof documentUploadSchema>;

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentUploadModal({ isOpen, onClose }: DocumentUploadModalProps) {
  const { user } = useAuthStore();
  const { addDocument } = useDocumentsStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DocumentUploadFormData>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      category: 'other',
    },
  });

  const onSubmit = async (data: DocumentUploadFormData) => {
    if (!user || !selectedFile) return;

    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Get file type
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      let fileType: Document['type'] = 'other';
      if (fileExtension === 'pdf') fileType = 'pdf';
      else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '')) fileType = 'image';
      else if (['doc', 'docx'].includes(fileExtension || '')) fileType = 'doc';

      addDocument({
        userId: user.id,
        propertyId: 'prop-1',
        unitId: 'unit-1',
        name: data.name,
        type: fileType,
        category: data.category,
        size: selectedFile.size,
        uploadedBy: 'tenant',
        description: data.description,
        isShared: true,
      });

      setShowSuccess(true);

      toast.success('Document Uploaded!', {
        description: `${data.name} has been uploaded successfully.`,
      });

      setTimeout(() => {
        setShowSuccess(false);
        setSelectedFile(null);
        reset();
        onClose();
      }, 2000);
    } catch (error) {
      toast.error('Upload Failed', {
        description: 'Please try again or contact support.',
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File Too Large', {
          description: 'Maximum file size is 10MB.',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <Card className="glass-card relative">
          {showSuccess ? (
            // Success State
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Upload Successful!</h2>
              <p className="text-sm text-neutral-600">
                Your document has been uploaded and is now accessible.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 mb-1">
                    Upload Document
                  </h2>
                  <p className="text-sm text-neutral-600">
                    Share documents with your property manager
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Select File <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center hover:border-primary-300 transition-colors">
                    {selectedFile ? (
                      <div className="flex items-center gap-3 justify-center">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-neutral-900">{selectedFile.name}</p>
                          <p className="text-xs text-neutral-500">{formatFileSize(selectedFile.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="ml-auto p-1 hover:bg-neutral-100 rounded"
                        >
                          <X className="w-4 h-4 text-neutral-500" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
                        <p className="text-sm text-neutral-600 mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-neutral-500">
                          PDF, DOC, DOCX, JPG, PNG (max 10MB)
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="hidden"
                      id="file-upload"
                    />
                    {!selectedFile && (
                      <label htmlFor="file-upload" className="mt-3 inline-block">
                        <Button type="button" variant="secondary" size="sm" asChild>
                          <span>Choose File</span>
                        </Button>
                      </label>
                    )}
                  </div>
                </div>

                {/* Document Name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Document Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="e.g., Renters Insurance Policy"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.name
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20'
                    } focus:outline-none focus:ring-2 transition-colors`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('category')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.category
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20'
                    } focus:outline-none focus:ring-2 transition-colors`}
                  >
                    <option value="lease">Lease Documents</option>
                    <option value="receipt">Receipts</option>
                    <option value="inspection">Inspection Reports</option>
                    <option value="addendum">Lease Addendums</option>
                    <option value="notice">Notices</option>
                    <option value="insurance">Insurance Documents</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    placeholder="Add any notes about this document..."
                    className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Privacy Notice */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-900">
                    <strong>Privacy:</strong> Documents uploaded here will be shared with your property
                    manager. Please do not upload sensitive personal information unless required.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-neutral-200">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    loading={isSubmitting}
                    disabled={!selectedFile}
                  >
                    {isSubmitting ? 'Uploading...' : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

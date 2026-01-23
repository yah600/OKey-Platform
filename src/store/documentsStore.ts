import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Document {
  id: string;
  userId: string;
  propertyId: string;
  unitId: string;
  name: string;
  type: 'pdf' | 'image' | 'doc' | 'other';
  category: 'lease' | 'receipt' | 'inspection' | 'addendum' | 'notice' | 'insurance' | 'other';
  size: number; // in bytes
  uploadedBy: 'tenant' | 'owner' | 'system';
  uploadedAt: string;
  url?: string; // In real app, would be storage URL
  description?: string;
  isShared: boolean;
}

interface DocumentsState {
  documents: Document[];

  // Actions
  addDocument: (document: Omit<Document, 'id' | 'uploadedAt'>) => void;
  removeDocument: (documentId: string) => void;
  getDocumentsByUser: (userId: string) => Document[];
  getDocumentsByCategory: (userId: string, category: Document['category']) => Document[];
  getDocumentById: (documentId: string) => Document | undefined;
}

export const useDocumentsStore = create<DocumentsState>()(
  persist(
    (set, get) => ({
      documents: [
        {
          id: 'doc-1',
          userId: 'user-1',
          propertyId: 'prop-1',
          unitId: 'unit-1',
          name: 'Lease Agreement - Sunset Apartments Unit 4B',
          type: 'pdf',
          category: 'lease',
          size: 2400000, // 2.4 MB
          uploadedBy: 'system',
          uploadedAt: '2025-12-01T10:00:00Z',
          description: 'Standard 12-month lease agreement',
          isShared: true,
        },
        {
          id: 'doc-2',
          userId: 'user-1',
          propertyId: 'prop-1',
          unitId: 'unit-1',
          name: 'Move-in Inspection Report',
          type: 'pdf',
          category: 'inspection',
          size: 1800000, // 1.8 MB
          uploadedBy: 'owner',
          uploadedAt: '2025-12-05T14:30:00Z',
          description: 'Initial unit condition documentation',
          isShared: true,
        },
        {
          id: 'doc-3',
          userId: 'user-1',
          propertyId: 'prop-1',
          unitId: 'unit-1',
          name: 'Parking Space Agreement',
          type: 'pdf',
          category: 'addendum',
          size: 500000, // 0.5 MB
          uploadedBy: 'owner',
          uploadedAt: '2025-12-01T10:30:00Z',
          description: 'Parking space #42 rental addendum',
          isShared: true,
        },
        {
          id: 'doc-4',
          userId: 'user-1',
          propertyId: 'prop-1',
          unitId: 'unit-1',
          name: 'Rent Receipt - January 2026',
          type: 'pdf',
          category: 'receipt',
          size: 300000, // 0.3 MB
          uploadedBy: 'system',
          uploadedAt: '2026-01-01T12:00:00Z',
          description: 'Payment confirmation for January 2026',
          isShared: true,
        },
        {
          id: 'doc-5',
          userId: 'user-1',
          propertyId: 'prop-1',
          unitId: 'unit-1',
          name: 'Renters Insurance Policy',
          type: 'pdf',
          category: 'insurance',
          size: 1200000, // 1.2 MB
          uploadedBy: 'tenant',
          uploadedAt: '2025-12-10T09:15:00Z',
          description: 'Proof of renters insurance coverage',
          isShared: true,
        },
      ],

      addDocument: (document) => {
        const newDocument: Document = {
          ...document,
          id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          uploadedAt: new Date().toISOString(),
        };

        set((state) => ({
          documents: [newDocument, ...state.documents],
        }));
      },

      removeDocument: (documentId) => {
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== documentId),
        }));
      },

      getDocumentsByUser: (userId) => {
        return get()
          .documents.filter((doc) => doc.userId === userId)
          .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
      },

      getDocumentsByCategory: (userId, category) => {
        return get()
          .documents.filter((doc) => doc.userId === userId && doc.category === category)
          .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
      },

      getDocumentById: (documentId) => {
        return get().documents.find((doc) => doc.id === documentId);
      },
    }),
    {
      name: 'okey-documents-storage',
    }
  )
);

// Helper function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Helper function to get file type icon color
export function getFileTypeColor(type: Document['type']): string {
  switch (type) {
    case 'pdf':
      return 'bg-red-50 text-red-600';
    case 'image':
      return 'bg-blue-50 text-blue-600';
    case 'doc':
      return 'bg-blue-50 text-blue-600';
    default:
      return 'bg-neutral-50 text-neutral-600';
  }
}

// Helper function to get category color
export function getCategoryColor(category: Document['category']): string {
  switch (category) {
    case 'lease':
      return 'bg-purple-100 text-purple-700';
    case 'receipt':
      return 'bg-green-100 text-green-700';
    case 'inspection':
      return 'bg-blue-100 text-blue-700';
    case 'addendum':
      return 'bg-amber-100 text-amber-700';
    case 'notice':
      return 'bg-red-100 text-red-700';
    case 'insurance':
      return 'bg-indigo-100 text-indigo-700';
    default:
      return 'bg-neutral-100 text-neutral-700';
  }
}

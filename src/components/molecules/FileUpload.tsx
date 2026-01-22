import { forwardRef, InputHTMLAttributes, useState, useRef } from 'react';
import { Upload, X, File, Image, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';

export interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedFileTypes?: string[];
  onFilesChange?: (files: File[]) => void;
  showPreview?: boolean;
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      maxFiles = 5,
      maxSize = 10,
      acceptedFileTypes,
      onFilesChange,
      showPreview = true,
      id,
      ...props
    },
    ref
  ) => {
    const [files, setFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true);
      } else if (e.type === 'dragleave') {
        setDragActive(false);
      }
    };

    const validateFile = (file: File): string | null => {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        return `File size exceeds ${maxSize}MB`;
      }
      if (acceptedFileTypes && !acceptedFileTypes.some(type => file.type.match(type))) {
        return 'File type not accepted';
      }
      return null;
    };

    const handleFiles = (newFiles: FileList | null) => {
      if (!newFiles) return;

      const validFiles: File[] = [];
      const errors: string[] = [];

      Array.from(newFiles).forEach(file => {
        if (files.length + validFiles.length >= maxFiles) {
          errors.push(`Maximum ${maxFiles} files allowed`);
          return;
        }

        const error = validateFile(file);
        if (error) {
          errors.push(`${file.name}: ${error}`);
        } else {
          validFiles.push(file);
        }
      });

      if (errors.length > 0) {
        console.error('File upload errors:', errors);
      }

      if (validFiles.length > 0) {
        const updatedFiles = [...files, ...validFiles];
        setFiles(updatedFiles);
        onFilesChange?.(updatedFiles);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    };

    const removeFile = (index: number) => {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const getFileIcon = (file: File) => {
      if (file.type.startsWith('image/')) return <Image className="w-5 h-5" />;
      if (file.type.includes('pdf')) return <FileText className="w-5 h-5" />;
      return <File className="w-5 h-5" />;
    };

    const formatFileSize = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            'relative border-2 border-dashed rounded-lg p-6 transition-colors',
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-neutral-300 bg-neutral-50 hover:border-neutral-400',
            className
          )}
        >
          <input
            ref={(node) => {
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              fileInputRef.current = node;
            }}
            type="file"
            id={inputId}
            className="sr-only"
            onChange={handleChange}
            multiple={maxFiles > 1}
            accept={acceptedFileTypes?.join(',')}
            {...props}
          />

          <div className="text-center">
            <Upload className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-neutral-900 mb-1">
              Drop files here or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary-600 hover:text-primary-700"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-neutral-500">
              {acceptedFileTypes ? `Accepted: ${acceptedFileTypes.join(', ')}` : 'All file types accepted'}
              {' • '}
              Max {maxSize}MB per file
              {maxFiles > 1 && ` • Up to ${maxFiles} files`}
            </p>
          </div>
        </div>

        {/* File List */}
        {showPreview && files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200"
              >
                <div className="text-neutral-600">{getFileIcon(file)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{file.name}</p>
                  <p className="text-xs text-neutral-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-xs text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;

'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, File as FileIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadFile } from '@/lib/supabase/storage';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  bucket: 'avatars' | 'portfolios' | 'attachments' | 'invoices';
  path?: string;
  onUploadComplete: (url: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export default function FileUpload({
  bucket,
  path = '',
  onUploadComplete,
  accept,
  maxSize = 5,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = async (file: File) => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    setFileName(file.name);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulating progress since Supabase JS SDK doesn't natively support progress in upload method easily without XHR
      const interval = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 200);

      const filePath = `${path}${Date.now()}-${file.name}`;
      const url = await uploadFile(bucket, filePath, file);
      
      clearInterval(interval);
      setUploadProgress(100);
      onUploadComplete(url);
      toast.success('File uploaded successfully');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setPreview(null);
    setFileName(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {!fileName ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors',
            isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
          )}
        >
          <Upload className="w-10 h-10 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 font-medium">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {accept ? `Accepted: ${accept}` : 'All files supported'} (Max {maxSize}MB)
          </p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={accept}
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 overflow-hidden">
              {preview ? (
                <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  <FileIcon className="w-6 h-6 text-gray-500" />
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                {isUploading && (
                  <p className="text-xs text-gray-500">Uploading...</p>
                )}
              </div>
            </div>
            <button
              onClick={removeFile}
              disabled={isUploading}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

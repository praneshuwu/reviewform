'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ImageUploaderProps {
  password: string;
  currentImageUrl?: string;
  onUpload: (url: string) => void;
  onRemove: () => void;
}

export default function ImageUploader({ password, currentImageUrl, onUpload, onRemove }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only JPEG, PNG, and WebP images are allowed';
    }
    if (file.size > MAX_SIZE) {
      return 'Image must be under 5MB';
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${password}` },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      setPreview(data.url);
      onUpload(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setPreview(currentImageUrl || null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localPreview);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [password]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onRemove();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (preview) {
    return (
      <div className="relative">
        <div className="relative aspect-[4/3] overflow-hidden bg-charcoal/5">
          <Image
            src={preview}
            alt="Menu item preview"
            fill
            className="object-cover"
            sizes="300px"
          />
          {uploading && (
            <div className="absolute inset-0 bg-pearl/60 flex items-center justify-center">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="font-sans text-xs uppercase tracking-wider text-charcoal/60"
              >
                Uploading...
              </motion.span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-2 right-2 w-8 h-8 bg-pearl/90 backdrop-blur-sm flex items-center justify-center text-charcoal/60 hover:text-crimson transition-colors text-sm"
        >
          ✕
        </button>
        {error && (
          <p className="text-crimson text-xs font-sans mt-2">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-crimson bg-crimson/5'
            : 'border-charcoal/20 hover:border-crimson/50'
        }`}
      >
        <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-charcoal/5 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-charcoal/40">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="font-sans text-xs text-charcoal/60 mb-1">
          {isDragging ? 'Drop image here' : 'Drag & drop or click to upload'}
        </p>
        <p className="font-sans text-[10px] text-charcoal/40">
          JPEG, PNG, WebP — Max 5MB
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
      {error && (
        <p className="text-crimson text-xs font-sans mt-2">{error}</p>
      )}
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import ErrorFallback from '@/components/ui/ErrorFallback';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin dashboard error:', error);
  }, [error]);

  return (
    <ErrorFallback
      error={error}
      reset={reset}
      message="Dashboard error. Please refresh the page."
    />
  );
}

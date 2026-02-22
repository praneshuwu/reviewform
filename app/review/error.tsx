'use client';

import { useEffect } from 'react';
import ErrorFallback from '@/components/ui/ErrorFallback';

export default function ReviewError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Review page error:', error);
  }, [error]);

  return (
    <ErrorFallback
      error={error}
      reset={reset}
      message="Unable to load the review form. Please try again."
    />
  );
}

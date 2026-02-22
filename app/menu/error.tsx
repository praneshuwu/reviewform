'use client';

import { useEffect } from 'react';
import ErrorFallback from '@/components/ui/ErrorFallback';

export default function MenuError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Menu page error:', error);
  }, [error]);

  return (
    <ErrorFallback
      error={error}
      reset={reset}
      message="Unable to load our menu. Please try again."
    />
  );
}

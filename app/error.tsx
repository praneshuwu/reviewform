'use client';

import { useEffect } from 'react';
import ErrorFallback from '@/components/ui/ErrorFallback';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <ErrorFallback
      error={error}
      reset={reset}
      message="We apologize for the inconvenience. Please try again."
    />
  );
}

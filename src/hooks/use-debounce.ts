import { useEffect, useState } from 'react';
import { TIME } from '@/lib/constants';

/**
 * Hook to debounce a value
 */
export function useDebounce<T>(value: T, delay: number = TIME.DEBOUNCE_DELAY): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}


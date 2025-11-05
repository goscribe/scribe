import { useState, useCallback } from 'react';

/**
 * Hook to manage boolean state (useful for modals, dropdowns, etc.)
 */
export function useDisclosure(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    onOpenChange: setIsOpen,
  };
}


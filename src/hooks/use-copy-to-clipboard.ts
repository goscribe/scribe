import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { SUCCESS_MESSAGES } from '@/lib/constants';

/**
 * Hook to copy text to clipboard
 */
export function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = useCallback(async (text: string, showToast = true) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      
      if (showToast) {
        toast.success(SUCCESS_MESSAGES.COPIED);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to copy text:', error);
      
      if (showToast) {
        toast.error('Failed to copy to clipboard');
      }
      
      return false;
    }
  }, []);

  return { copiedText, copy };
}


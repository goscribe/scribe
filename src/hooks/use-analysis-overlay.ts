import { useEffect } from 'react';
import { toast } from 'sonner';
import { usePusherAnalysis } from './pusher/use-pusher-analysis';

/**
 * Custom hook for managing AI analysis overlay and notifications
 * 
 * This hook wraps the Pusher analysis functionality and provides:
 * - Analysis state management
 * - Toast notifications for completion/errors
 * - Overlay visibility control
 * 
 * @param workspaceId - The ID of the workspace being analyzed
 * @returns Object containing analysis state and control functions
 * 
 * @example
 * ```tsx
 * const { loadingState, showOverlay, hideOverlay } = useAnalysisOverlay(workspaceId);
 * ```
 */
export const useAnalysisOverlay = (workspaceId: string) => {
  const { loadingState, showOverlay, resetState, hideOverlay } = usePusherAnalysis(workspaceId);

  /**
   * Handle analysis completion notifications via toast messages
   * Shows success/error toasts based on analysis results
   */
  useEffect(() => {
    if (!loadingState) return;
    
    if (!loadingState.isAnalyzing) {
      if (loadingState.errors.length > 0) {
        toast.error(loadingState.errors[0] || 'Analysis failed');
      } else if (Object.keys(loadingState.completedArtifacts).length > 0) {
        const count = Object.keys(loadingState.completedArtifacts).length;
        toast.success(`Analysis complete: ${count} artifact${count === 1 ? '' : 's'} generated`);
      }
    }
  }, [loadingState]);

  return {
    /** Current analysis loading state and progress */
    loadingState,
    /** Whether the analysis overlay should be visible */
    showOverlay,
    /** Function to reset the analysis state */
    resetState,
    /** Function to hide the analysis overlay */
    hideOverlay,
  };
};

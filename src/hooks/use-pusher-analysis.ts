import { useState, useEffect, useRef } from 'react';
import { PusherManager, AnalysisLoadingState } from '@/lib/pusher-manager';

export function usePusherAnalysis(workspaceId: string) {
  const [loadingState, setLoadingState] = useState<AnalysisLoadingState>({
    isAnalyzing: false,
    currentStep: '',
    progress: {
      fileAnalysis: false,
      studyGuide: false,
      flashcards: false,
      worksheet: false,
      cleanup: false,
    },
    errors: [],
    completedArtifacts: {},
  });
  
  const [showOverlay, setShowOverlay] = useState(false);
  const pusherManagerRef = useRef<PusherManager | null>(null);

  useEffect(() => {
    if (workspaceId && !pusherManagerRef.current) {
      pusherManagerRef.current = new PusherManager(workspaceId, (state) => {
        setLoadingState(state);
        setShowOverlay(
          state.isAnalyzing || 
          state.errors.length > 0 || 
          Object.keys(state.completedArtifacts).length > 0
        );
      });
    }

    return () => {
      if (pusherManagerRef.current) {
        pusherManagerRef.current.disconnect();
        pusherManagerRef.current = null;
      }
    };
  }, [workspaceId]);

  const resetState = () => {
    if (pusherManagerRef.current) {
      pusherManagerRef.current.resetState();
    }
  };

  const hideOverlay = () => {
    setShowOverlay(false);
  };

  return {
    loadingState,
    showOverlay,
    resetState,
    hideOverlay,
  };
}

// import { useState, useEffect, useCallback } from 'react';
// import { useLocalStorage } from './use-local-storage';

// export interface PodcastGenerationProgress {
//   podcastId?: string;
//   workspaceId: string;
//   stage: 'structuring' | 'generating_audio' | 'creating_summary' | 'complete' | 'failed';
//   progress: number;
//   currentSegment?: number;
//   totalSegments?: number;
//   segmentTitle?: string;
//   currentStep?: string;
//   startedAt: number;
//   lastUpdatedAt: number;
//   errors?: string[];
// }

// interface UsePodcastProgressOptions {
//   workspaceId: string;
//   autosave?: boolean;
//   saveInterval?: number;
// }

// /**
//  * Hook for persisting podcast generation progress
//  */
// export function usePodcastProgress(options: UsePodcastProgressOptions) {
//   const { workspaceId, autosave = true, saveInterval = 2000 } = options;

//   const storageKey = `podcast-progress-${workspaceId}`;
  
//   const [savedProgress, setSavedProgress, clearSavedProgress] = useLocalStorage<PodcastGenerationProgress | null>(
//     storageKey,
//     null
//   );

//   const [currentProgress, setCurrentProgress] = useState<PodcastGenerationProgress | null>(savedProgress);
//   const [hasRecoverableProgress, setHasRecoverableProgress] = useState(false);

//   /**
//    * Check if there's recoverable progress on mount
//    */
//   useEffect(() => {
//     if (savedProgress && savedProgress.stage !== 'complete' && savedProgress.stage !== 'failed') {
//       // Check if progress is recent (within last hour)
//       const hourAgo = Date.now() - (60 * 60 * 1000);
//       if (savedProgress.lastUpdatedAt > hourAgo) {
//         setHasRecoverableProgress(true);
//       } else {
//         // Clear stale progress
//         clearSavedProgress();
//       }
//     }
//   }, [savedProgress, clearSavedProgress]);

//   /**
//    * Update progress
//    */
//   const updateProgress = useCallback((progress: Partial<PodcastGenerationProgress>) => {
//     setCurrentProgress(prev => {
//       if (!prev) {
//         return {
//           workspaceId,
//           stage: 'structuring',
//           progress: 0,
//           startedAt: Date.now(),
//           lastUpdatedAt: Date.now(),
//           ...progress,
//         };
//       }

//       return {
//         ...prev,
//         ...progress,
//         lastUpdatedAt: Date.now(),
//       };
//     });
//   }, [workspaceId]);

//   /**
//    * Start new generation
//    */
//   const startProgress = useCallback((podcastId?: string) => {
//     const newProgress: PodcastGenerationProgress = {
//       podcastId,
//       workspaceId,
//       stage: 'structuring',
//       progress: 0,
//       startedAt: Date.now(),
//       lastUpdatedAt: Date.now(),
//     };

//     setCurrentProgress(newProgress);
    
//     if (autosave) {
//       setSavedProgress(newProgress);
//     }
//   }, [workspaceId, autosave, setSavedProgress]);

//   /**
//    * Mark as complete
//    */
//   const completeProgress = useCallback(() => {
//     updateProgress({ stage: 'complete', progress: 100 });
    
//     // Clear after a short delay so user can see completion
//     setTimeout(() => {
//       clearSavedProgress();
//       setCurrentProgress(null);
//       setHasRecoverableProgress(false);
//     }, 3000);
//   }, [updateProgress, clearSavedProgress]);

//   /**
//    * Mark as failed
//    */
//   const failProgress = useCallback((error?: string) => {
//     updateProgress({ 
//       stage: 'failed', 
//       errors: error ? [...(currentProgress?.errors || []), error] : currentProgress?.errors 
//     });
//   }, [updateProgress, currentProgress]);

//   /**
//    * Clear progress
//    */
//   const clearProgress = useCallback(() => {
//     setCurrentProgress(null);
//     clearSavedProgress();
//     setHasRecoverableProgress(false);
//   }, [clearSavedProgress]);

//   /**
//    * Recover progress
//    */
//   const recoverProgress = useCallback(() => {
//     if (savedProgress) {
//       setCurrentProgress(savedProgress);
//       setHasRecoverableProgress(false);
//       return savedProgress;
//     }
//     return null;
//   }, [savedProgress]);

//   /**
//    * Auto-save progress
//    */
//   useEffect(() => {
//     if (!autosave || !currentProgress) return;

//     const timer = setTimeout(() => {
//       setSavedProgress(currentProgress);
//     }, saveInterval);

//     return () => clearTimeout(timer);
//   }, [currentProgress, autosave, saveInterval, setSavedProgress]);

//   /**
//    * Calculate estimated time remaining
//    */
//   const estimatedTimeRemaining = useCallback((): number | null => {
//     if (!currentProgress || currentProgress.progress === 0) return null;

//     const elapsed = Date.now() - currentProgress.startedAt;
//     const progressPercent = currentProgress.progress / 100;
    
//     if (progressPercent === 0) return null;

//     const totalEstimated = elapsed / progressPercent;
//     const remaining = totalEstimated - elapsed;

//     return Math.max(0, remaining);
//   }, [currentProgress]);

//   /**
//    * Format time remaining
//    */
//   const formatTimeRemaining = useCallback((): string => {
//     const ms = estimatedTimeRemaining();
//     if (ms === null) return 'Calculating...';

//     const seconds = Math.ceil(ms / 1000);
    
//     if (seconds < 60) {
//       return `~${seconds}s remaining`;
//     }

//     const minutes = Math.ceil(seconds / 60);
//     return `~${minutes}m remaining`;
//   }, [estimatedTimeRemaining]);

//   return {
//     progress: currentProgress,
//     hasRecoverableProgress,
//     startProgress,
//     updateProgress,
//     completeProgress,
//     failProgress,
//     clearProgress,
//     recoverProgress,
//     estimatedTimeRemaining: estimatedTimeRemaining(),
//     formattedTimeRemaining: formatTimeRemaining(),
//   };
// }


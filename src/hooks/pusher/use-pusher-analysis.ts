import { useEffect, useState, useCallback } from 'react';
import { AnalysisProgress } from '@/types/analysis';
import Pusher from 'pusher-js';
import pusher from 'pusher-js';
import { trpc } from '@/lib/trpc';


interface UsePusherAnalysisOptions {
  workspaceId: string;
  onProgressUpdate?: (progress: AnalysisProgress) => void;
  enabled?: boolean;
}

export function usePusherAnalysis({ 
  workspaceId, 
  onProgressUpdate,
  enabled = true 
}: UsePusherAnalysisOptions) {
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const {data: workspace, refetch: refetchWorkspace} = trpc.workspace.get.useQuery({
    id: workspaceId,
  });

  useEffect(() => {
    if (workspace) {
      setProgress(workspace.analysisProgress as unknown as AnalysisProgress);
    }
  }, [workspace]);
  
  const handleProgressUpdate = useCallback((data: AnalysisProgress) => {
    refetchWorkspace();
    setProgress(data);
    onProgressUpdate?.(data);
  }, [onProgressUpdate, refetchWorkspace]);

  useEffect(() => {
    if (!enabled || !workspaceId) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });


    const channelName = `workspace_${workspaceId}`;
    // Subscribe to analysis channel
    
    const channel = pusher.subscribe(channelName);
    
    // Bind to analysis progress events
    channel.bind('analysis_progress', handleProgressUpdate);
    
    // Track connection state
    channel.bind('pusher:subscription_succeeded', () => {
      // Connected to analysis channel
      setIsConnected(true);
    });
    
    channel.bind('pusher:subscription_error', () => {
      console.error('[Analysis] Subscription error');
      setIsConnected(false);
    });

    return () => {
      // Unsubscribe from analysis channel
      channel.unbind('analysis_progress', handleProgressUpdate);
      channel.unbind('pusher:subscription_succeeded');
      channel.unbind('pusher:subscription_error');
      pusher.unsubscribe(channelName);
    };
  }, [workspaceId, enabled, pusher, handleProgressUpdate]);

  const calculateProgress = useCallback((progress: AnalysisProgress | null): number => {
    if (!progress || !progress.steps) return 0;
    
    const steps = Object.values(progress.steps);
    const completed = steps.filter(s => s.status === 'completed').length;
    const total = steps.filter(s => s.status !== 'skipped').length;
    
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, []);

  return {
    progress,
    isAnalyzing: workspace?.fileBeingAnalyzed,
    isConnected,
    percentage: calculateProgress(progress),
  };
}
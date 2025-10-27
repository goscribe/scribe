import { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import { GenerationProgress } from '@/components/podcast-generation-progress';

// Podcast event data interfaces
export interface PodcastGenerationStartData {
  title: string;
}

export interface PodcastStructureCompleteData {
  segmentsCount: number;
}

export interface PodcastAudioGenerationStartData {
  totalSegments: number;
}

export interface PodcastSegmentProgressData {
  currentSegment: number;
  totalSegments: number;
  segmentTitle: string;
}

export interface PodcastAudioGenerationCompleteData {
  totalSegments: number;
  totalDuration: number;
}

export interface PodcastAudioPreparationCompleteData {
  totalSegments: number;
}

export interface PodcastSummaryCompleteData {
  summaryGenerated: boolean;
}

export interface PodcastGenerationCompleteData {
  artifactId: string;
  title: string;
  status: 'completed';
}

export interface PodcastSegmentRegenerationStartData {
  segmentId: string;
  segmentTitle: string;
}

export interface PodcastSegmentAudioUpdatedData {
  segmentId: string;
  totalSegments: number;
}

export interface PodcastSegmentRegenerationCompleteData {
  segmentId: string;
  segmentTitle: string;
  duration: number;
}

export interface PodcastDeletionStartData {
  episodeId: string;
  episodeTitle: string;
}

export interface PodcastDeletionCompleteData {
  episodeId: string;
  episodeTitle: string;
}

export interface PodcastErrorData {
  error: string;
  analysisType: 'podcast';
  timestamp: string;
}

export interface PodcastSegmentErrorData {
  segmentIndex: number;
  error: string;
}

export interface PodcastSummaryErrorData {
  error: string;
}

export interface PodcastPusherState {
  isGenerating: boolean;
  progress: GenerationProgress;
  regeneratingSegments: Record<string, boolean>;
  deletingEpisodes: Record<string, boolean>;
  errors: string[];
}

export function usePusherPodcast(workspaceId: string) {
  const [state, setState] = useState<PodcastPusherState>({
    isGenerating: false,
    progress: {
      stage: 'structuring',
      progress: 0,
      currentStep: '',
      errors: [],
    },
    regeneratingSegments: {},
    deletingEpisodes: {},
    errors: [],
  });

  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<ReturnType<Pusher['subscribe']> | null>(null);

  useEffect(() => {
    if (!workspaceId) return;

    // Initialize Pusher
    pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
    });

    const channelName = `workspace_${workspaceId}`;
    channelRef.current = pusherRef.current.subscribe(channelName);

    // Podcast Generation Events
    channelRef.current.bind(`${workspaceId}_podcast_generation_start`, (data: PodcastGenerationStartData) => {
      setState(prev => ({
        ...prev,
        isGenerating: true,
        progress: {
          stage: 'structuring',
          progress: 0,
          currentStep: `Starting generation of "${data.title}"...`,
          errors: [],
        },
        errors: [],
      }));
    });

    channelRef.current.bind(`${workspaceId}_podcast_structure_complete`, (data: PodcastStructureCompleteData) => {
      setState(prev => ({
        ...prev,
        progress: {
          ...prev.progress,
          stage: 'generating_audio',
          progress: 20,
          currentStep: `Structure complete. ${data.segmentsCount} segments created.`,
          totalSegments: data.segmentsCount,
        },
      }));
    });

    channelRef.current.bind(`${workspaceId}_podcast_audio_generation_start`, (data: PodcastAudioGenerationStartData) => {
      setState(prev => ({
        ...prev,
        progress: {
          ...prev.progress,
          stage: 'generating_audio',
          progress: 25,
          currentStep: 'Starting audio generation...',
          totalSegments: data.totalSegments,
          currentSegment: 0,
        },
      }));
    });

    channelRef.current.bind(`${workspaceId}_podcast_segment_progress`, (data: PodcastSegmentProgressData) => {
      setState(prev => ({
        ...prev,
        progress: {
          ...prev.progress,
          stage: 'generating_audio',
          currentSegment: data.currentSegment,
          totalSegments: data.totalSegments,
          currentStep: `Generating audio for segment: ${data.segmentTitle}`,
          progress: 25 + (data.currentSegment / data.totalSegments) * 50,
        },
      }));
    });

    channelRef.current.bind(`${workspaceId}_podcast_audio_generation_complete`, (_data: PodcastAudioGenerationCompleteData) => {
      setState(prev => ({
        ...prev,
        progress: {
          ...prev.progress,
          stage: 'preparing_segments',
          progress: 75,
          currentStep: 'Audio generation complete. Preparing segments...',
        },
      }));
    });

    // Audio Preparation Complete (segments ready for frontend joining)
    channelRef.current.bind(`${workspaceId}_podcast_audio_preparation_complete`, (_data: PodcastAudioPreparationCompleteData) => {
      setState(prev => ({
        ...prev,
        progress: {
          ...prev.progress,
          stage: 'creating_summary',
          progress: 80,
          currentStep: 'Segments prepared. Creating summary...',
        },
      }));
    });

    channelRef.current.bind(`${workspaceId}_podcast_summary_complete`, (_data: PodcastSummaryCompleteData) => {
      setState(prev => ({
        ...prev,
        progress: {
          ...prev.progress,
          stage: 'creating_summary',
          progress: 90,
          currentStep: 'Summary generation complete.',
        },
      }));
    });

    channelRef.current.bind(`${workspaceId}_podcast_ended`, (_data: PodcastGenerationCompleteData) => {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        progress: {
          ...prev.progress,
          stage: 'complete',
          progress: 100,
          currentStep: 'Podcast generation completed successfully!',
        },
      }));
    });

    // Segment Regeneration Events
    channelRef.current.bind(`${workspaceId}_podcast_segment_regeneration_start`, (data: PodcastSegmentRegenerationStartData) => {
      setState(prev => ({
        ...prev,
        regeneratingSegments: {
          ...prev.regeneratingSegments,
          [data.segmentId]: true,
        },
      }));
    });

    channelRef.current.bind(`${workspaceId}_podcast_segment_audio_updated`, (_data: PodcastSegmentAudioUpdatedData) => {
      // Keep the regeneration state active until complete
    });

    channelRef.current.bind(`${workspaceId}_podcast_segment_regeneration_complete`, (data: PodcastSegmentRegenerationCompleteData) => {
      setState(prev => ({
        ...prev,
        regeneratingSegments: {
          ...prev.regeneratingSegments,
          [data.segmentId]: false,
        },
      }));
    });

    // Episode Deletion Events
    channelRef.current.bind(`${workspaceId}_podcast_deletion_start`, (data: PodcastDeletionStartData) => {
      setState(prev => ({
        ...prev,
        deletingEpisodes: {
          ...prev.deletingEpisodes,
          [data.episodeId]: true,
        },
      }));
    });

    channelRef.current.bind(`${workspaceId}_podcast_deletion_complete`, (data: PodcastDeletionCompleteData) => {
      setState(prev => ({
        ...prev,
        deletingEpisodes: {
          ...prev.deletingEpisodes,
          [data.episodeId]: false,
        },
      }));
    });

    // Error Events
    channelRef.current.bind(`${workspaceId}_podcast_error`, (data: PodcastErrorData) => {
      console.error('Podcast error:', data);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        errors: [...prev.errors, data.error],
        progress: {
          ...prev.progress,
          errors: [...prev.progress.errors, data.error],
        },
      }));
    });

    channelRef.current.bind(`${workspaceId}_podcast_segment_error`, (data: PodcastSegmentErrorData) => {
      console.error('Podcast segment error:', data);
      setState(prev => ({
        ...prev,
        regeneratingSegments: {
          ...prev.regeneratingSegments,
          [`segment_${data.segmentIndex}`]: false,
        },
        errors: [...prev.errors, `Segment ${data.segmentIndex + 1}: ${data.error}`],
      }));
    });

    channelRef.current.bind(`${workspaceId}_podcast_summary_error`, (data: PodcastSummaryErrorData) => {
      console.error('Podcast summary error:', data);
      setState(prev => ({
        ...prev,
        errors: [...prev.errors, `Summary error: ${data.error}`],
        progress: {
          ...prev.progress,
          errors: [...prev.progress.errors, `Summary error: ${data.error}`],
        },
      }));
    });

    return () => {
      if (pusherRef.current) {
        pusherRef.current.disconnect();
      }
    };
  }, [workspaceId]);

  const resetState = () => {
    setState({
      isGenerating: false,
      progress: {
        stage: 'structuring',
        progress: 0,
        currentStep: '',
        errors: [],
      },
      regeneratingSegments: {},
      deletingEpisodes: {},
      errors: [],
    });
  };

  const clearErrors = () => {
    setState(prev => ({
      ...prev,
      errors: [],
      progress: {
        ...prev.progress,
        errors: [],
      },
    }));
  };

  return {
    state,
    resetState,
    clearErrors,
  };
}

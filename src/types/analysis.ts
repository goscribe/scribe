export interface AnalysisProgress {
  status: AnalysisStatus;
  filename: string;
  fileType: 'image' | 'pdf';
  startedAt: string; // ISO 8601 timestamp
  completedAt?: string; // ISO 8601 timestamp (only when completed)
  error?: string; // Error message (only when status is 'error')
  steps: {
    fileUpload: {
      status: StepStatus;
      order: number;
    };
    fileAnalysis: {
      status: StepStatus;
      order: number;
    };
    studyGuide: {
      status: StepStatus;
      order: number;
    };
    flashcards: {
      status: StepStatus;
      order: number;
    };
  };
}

export type AnalysisStatus = 
  | 'starting'
  | 'uploading'
  | 'analyzing'
  | 'generating_artifacts'
  | 'generating_study_guide'
  | 'generating_flashcards'
  | 'completed'
  | 'error';

export type StepStatus = 
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'skipped'
  | 'error';

export const STATUS_MESSAGES: Record<AnalysisStatus, string> = {
  starting: 'Initializing...',
  uploading: 'Uploading file...',
  analyzing: 'Analyzing content...',
  generating_artifacts: 'Preparing artifacts...',
  generating_study_guide: 'Creating study guide...',
  generating_flashcards: 'Generating flashcards...',
  completed: 'Analysis complete!',
  error: 'An error occurred',
};

export const STEP_ICONS: Record<StepStatus, string> = {
  pending: '⏳',
  in_progress: '🔄',
  completed: '✅',
  skipped: '⏭️',
  error: '❌',
};

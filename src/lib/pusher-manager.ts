import Pusher from 'pusher-js';
import { Channel } from 'pusher-js';

// Event data interfaces
export interface FileAnalysisStartData {
  filename: string;
  fileType: 'image' | 'pdf';
}

export interface FileAnalysisCompleteData {
  filename: string;
  fileType: 'image' | 'pdf';
}

export interface StudyGuideLoadStartData {
  filename: string;
}

export interface StudyGuideInfoData {
  contentLength: number;
}

export interface StudyGuideEndedData {
  type: 'studyguide';
  result: {
    artifactId: string;
    title: string;
    status: 'completed';
  };
  timestamp: string;
}

export interface FlashCardLoadStartData {
  filename: string;
}

export interface FlashCardInfoData {
  contentLength: number;
}

export interface FlashCardEndedData {
  type: 'flashcard';
  result: {
    artifactId: string;
    title: string;
    status: 'completed';
  };
  timestamp: string;
}

export interface WorksheetLoadStartData {
  filename: string;
}

export interface WorksheetInfoData {
  contentLength: number;
}

export interface WorksheetEndedData {
  type: 'worksheet';
  result: {
    artifactId: string;
    title: string;
    status: 'completed';
  };
  timestamp: string;
}

export interface AnalysisCleanupStartData {
  filename: string;
}

export interface AnalysisCleanupCompleteData {
  filename: string;
}

export interface AnalysisEndedData {
  filename: string;
  artifacts: {
    studyGuide: any | null;
    flashcards: any | null;
    worksheet: any | null;
  };
  timestamp: string;
}

export interface AnalysisErrorData {
  error: string;
  analysisType?: string;
  timestamp: string;
}

export interface SpecificErrorData {
  error: string;
  analysisType: string;
  timestamp: string;
}

// Loading state interface
export interface AnalysisLoadingState {
  isAnalyzing: boolean;
  currentStep: string;
  progress: {
    fileAnalysis: boolean;
    studyGuide: boolean;
    flashcards: boolean;
    worksheet: boolean;
    cleanup: boolean;
  };
  errors: string[];
  completedArtifacts: {
    studyGuide?: any;
    flashcards?: any;
    worksheet?: any;
  };
}

export class PusherManager {
  private pusher: Pusher;
  private channel: Channel;
  private workspaceId: string;
  private onStateChange?: (state: AnalysisLoadingState) => void;
  private currentState: AnalysisLoadingState;

  constructor(workspaceId: string, onStateChange?: (state: AnalysisLoadingState) => void) {
    this.workspaceId = workspaceId;
    this.onStateChange = onStateChange;
    
    // Initialize loading state
    this.currentState = {
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
    };

    // Initialize Pusher
    this.pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
    });
    
    this.channel = this.pusher.subscribe(`workspace_${workspaceId}`);
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // File Analysis Events
    this.channel.bind(`file_analysis_start`, (data: FileAnalysisStartData) => {
      console.log('File analysis started:', data);
      this.updateState({
        isAnalyzing: true,
        currentStep: `Analyzing ${data.filename}...`,
        progress: { ...this.currentState.progress, fileAnalysis: true },
      });
    });

    this.channel.bind(`file_analysis_complete`, (data: FileAnalysisCompleteData) => {
      console.log('File analysis completed:', data);
      this.updateState({
        currentStep: 'File analysis completed, generating content...',
      });
    });

    // Study Guide Events
    this.channel.bind(`study_guide_load_start`, (data: StudyGuideLoadStartData) => {
      console.log('Study guide generation started:', data);
      this.updateState({
        currentStep: 'Generating study guide...',
        progress: { ...this.currentState.progress, studyGuide: true },
      });
    });

    this.channel.bind(`study_guide_info`, (data: StudyGuideInfoData) => {
      console.log('Study guide content generated:', data);
      this.updateState({
        currentStep: `Study guide content generated (${data.contentLength} characters)`,
      });
    });

    this.channel.bind(`studyguide_ended`, (data: StudyGuideEndedData) => {
      console.log('Study guide completed:', data);
      this.updateState({
        currentStep: 'Study guide completed!',
        completedArtifacts: { ...this.currentState.completedArtifacts, studyGuide: data.result },
      });
    });

    // Flashcard Events
    this.channel.bind(`flash_card_load_start`, (data: FlashCardLoadStartData) => {
      console.log('Flashcard generation started:', data);
      this.updateState({
        currentStep: 'Generating flashcards...',
        progress: { ...this.currentState.progress, flashcards: true },
      });
    });

    this.channel.bind(`flash_card_info`, (data: FlashCardInfoData) => {
      console.log('Flashcard content generated:', data);
      this.updateState({
        currentStep: `Flashcard content generated (${data.contentLength} characters)`,
      });
    });

    this.channel.bind(`flashcard_ended`, (data: FlashCardEndedData) => {
      console.log('Flashcards completed:', data);
      this.updateState({
        currentStep: 'Flashcards completed!',
        completedArtifacts: { ...this.currentState.completedArtifacts, flashcards: data.result },
      });
    });

    // Worksheet Events
    this.channel.bind(`worksheet_load_start`, (data: WorksheetLoadStartData) => {
      console.log('Worksheet generation started:', data);
      this.updateState({
        currentStep: 'Generating worksheet...',
        progress: { ...this.currentState.progress, worksheet: true },
      });
    });

    this.channel.bind(`worksheet_info`, (data: WorksheetInfoData) => {
      console.log('Worksheet content generated:', data);
      this.updateState({
        currentStep: `Worksheet content generated (${data.contentLength} characters)`,
      });
    });

    this.channel.bind(`worksheet_ended`, (data: WorksheetEndedData) => {
      console.log('Worksheet completed:', data);
      this.updateState({
        currentStep: 'Worksheet completed!',
        completedArtifacts: { ...this.currentState.completedArtifacts, worksheet: data.result },
      });
    });

    // Cleanup Events
    this.channel.bind(`analysis_cleanup_start`, (data: AnalysisCleanupStartData) => {
      console.log('Cleanup started:', data);
      this.updateState({
        currentStep: 'Cleaning up...',
        progress: { ...this.currentState.progress, cleanup: true },
      });
    });

    this.channel.bind(`analysis_cleanup_complete`, (data: AnalysisCleanupCompleteData) => {
      console.log('Cleanup completed:', data);
      this.updateState({
        currentStep: 'Cleanup completed!',
      });
    });

    // Overall Completion
    this.channel.bind(`analysis_ended`, (data: AnalysisEndedData) => {
      console.log('Analysis completed:', data);
      this.updateState({
        isAnalyzing: false,
        currentStep: 'Analysis completed successfully!',
        completedArtifacts: data.artifacts,
        progress: {
          fileAnalysis: false,
          studyGuide: false,
          flashcards: false,
          worksheet: false,
          cleanup: false,
        },
      });
    });

    // Error Events
    this.channel.bind(`analysis_error`, (data: AnalysisErrorData) => {
      console.error('Analysis error:', data);
      this.updateState({
        isAnalyzing: false,
        currentStep: 'Error occurred during analysis',
        progress: {
          fileAnalysis: false,
          studyGuide: false,
          flashcards: false,
          worksheet: false,
          cleanup: false,
        },
        errors: [...this.currentState.errors, data.error],
      });
    });

    this.channel.bind(`file_analysis_error`, (data: SpecificErrorData) => {
      console.error('File analysis error:', data);
      this.updateState({
        isAnalyzing: false,
        currentStep: 'File analysis error',
        errors: [...this.currentState.errors, `File analysis error: ${data.error}`],
      });
    });
  }

  private updateState(updates: Partial<AnalysisLoadingState>) {
    this.currentState = { ...this.currentState, ...updates };
    if (this.onStateChange) {
      this.onStateChange(this.currentState);
    }
  }

  public getCurrentState(): AnalysisLoadingState {
    return this.currentState;
  }

  public resetState() {
    this.currentState = {
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
    };
    if (this.onStateChange) {
      this.onStateChange(this.currentState);
    }
  }

  public disconnect() {
    this.pusher.disconnect();
  }
}

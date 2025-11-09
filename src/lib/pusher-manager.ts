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

}
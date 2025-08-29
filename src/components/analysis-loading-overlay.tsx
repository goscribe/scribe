"use client";

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Loader2, FileText, Brain, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AnalysisLoadingState } from '@/lib/pusher-manager';

interface AnalysisLoadingOverlayProps {
  isVisible: boolean;
  loadingState: AnalysisLoadingState;
  onClose: () => void;
}

export function AnalysisLoadingOverlay({ isVisible, loadingState, onClose }: AnalysisLoadingOverlayProps) {
  const [progress, setProgress] = useState(0);

  // Calculate progress based on completed steps
  useEffect(() => {
    const steps = [
      loadingState.progress.fileAnalysis,
      loadingState.progress.studyGuide,
      loadingState.progress.flashcards,
      loadingState.progress.worksheet,
      loadingState.progress.cleanup,
    ];
    
    const completedSteps = steps.filter(Boolean).length;
    const totalSteps = steps.length;
    const calculatedProgress = (completedSteps / totalSteps) * 100;
    
    setProgress(calculatedProgress);
  }, [loadingState.progress]);

  if (!isVisible) return null;

  const getStepIcon = (stepName: string, isCompleted: boolean) => {
    if (isCompleted) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
      
    switch (stepName) {
      case 'fileAnalysis':
        return <FileText className="h-5 w-5 text-muted-foreground" />;
      case 'studyGuide':
        return <BookOpen className="h-5 w-5 text-muted-foreground" />;
      case 'flashcards':
        return <Brain className="h-5 w-5 text-muted-foreground" />;
      case 'worksheet':
        return <FileText className="h-5 w-5 text-muted-foreground" />;
      case 'cleanup':
        return <Loader2 className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Loader2 className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStepLabel = (stepName: string) => {
    switch (stepName) {
      case 'fileAnalysis':
        return 'File Analysis';
      case 'studyGuide':
        return 'Study Guide';
      case 'flashcards':
        return 'Flashcards';
      case 'worksheet':
        return 'Worksheet';
      case 'cleanup':
        return 'Cleanup';
      default:
        return stepName;
    }
  };

  const steps = [
    { key: 'fileAnalysis', label: 'File Analysis' },
    { key: 'studyGuide', label: 'Study Guide' },
    { key: 'flashcards', label: 'Flashcards' },
    { key: 'worksheet', label: 'Worksheet' },
    { key: 'cleanup', label: 'Cleanup' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                AI Analysis in Progress
              </h3>
              <p className="text-sm text-gray-500">
                {loadingState.currentStep || 'Initializing...'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={loadingState.isAnalyzing}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="text-gray-900 font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step) => {
            const isCompleted = loadingState.progress[step.key as keyof typeof loadingState.progress];
            
            return (
              <div
                key={step.key}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isCompleted ? 'bg-green-50 border border-green-200' : 
                  'bg-gray-50 border border-gray-200'
                }`}
              >
                {getStepIcon(step.key, isCompleted)}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    isCompleted ? 'text-green-900' : 
                    'text-gray-700'
                  }`}>
                    {step.label}
                  </p>
                </div>
                {isCompleted && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Complete
                  </Badge>
                )}
              </div>
            );
          })}
        </div>

        {/* Errors */}
        {loadingState.errors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-900">Errors</span>
            </div>
            <div className="space-y-1">
              {loadingState.errors.map((error, index) => (
                <p key={index} className="text-xs text-red-700 bg-red-50 p-2 rounded">
                  {error}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Completed Artifacts */}
        {Object.keys(loadingState.completedArtifacts).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Completed</h4>
            <div className="space-y-1">
              {loadingState.completedArtifacts.studyGuide && (
                <div className="flex items-center space-x-2 text-xs text-green-700">
                  <CheckCircle className="h-3 w-3" />
                  <span>Study Guide</span>
                </div>
              )}
              {loadingState.completedArtifacts.flashcards && (
                <div className="flex items-center space-x-2 text-xs text-green-700">
                  <CheckCircle className="h-3 w-3" />
                  <span>Flashcards</span>
                </div>
              )}
              {loadingState.completedArtifacts.worksheet && (
                <div className="flex items-center space-x-2 text-xs text-green-700">
                  <CheckCircle className="h-3 w-3" />
                  <span>Worksheet</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          {!loadingState.isAnalyzing && (
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

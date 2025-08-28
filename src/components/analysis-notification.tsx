"use client";

import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnalysisLoadingState } from '@/lib/pusher-manager';

interface AnalysisNotificationProps {
  loadingState: AnalysisLoadingState;
  onClose: () => void;
}

export function AnalysisNotification({ loadingState, onClose }: AnalysisNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show notification when analysis is completed or has errors
    if (!loadingState.isAnalyzing && (loadingState.errors.length > 0 || Object.keys(loadingState.completedArtifacts).length > 0)) {
      setIsVisible(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [loadingState, onClose]);

  if (!isVisible) return null;

  const hasErrors = loadingState.errors.length > 0;
  const hasCompletedArtifacts = Object.keys(loadingState.completedArtifacts).length > 0;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`rounded-lg shadow-lg p-4 max-w-sm border-l-4 ${
        hasErrors 
          ? 'bg-red-50 border-red-400' 
          : 'bg-green-50 border-green-400'
      }`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {hasErrors ? (
              <AlertCircle className="h-5 w-5 text-red-400" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${
              hasErrors ? 'text-red-800' : 'text-green-800'
            }`}>
              {hasErrors ? 'Analysis Error' : 'Analysis Completed'}
            </p>
            <p className={`text-sm mt-1 ${
              hasErrors ? 'text-red-700' : 'text-green-700'
            }`}>
              {hasErrors 
                ? loadingState.errors[0] 
                : `Successfully generated ${Object.keys(loadingState.completedArtifacts).length} artifact(s)`
              }
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className={`p-1 ${
              hasErrors ? 'text-red-400 hover:text-red-600' : 'text-green-400 hover:text-green-600'
            }`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

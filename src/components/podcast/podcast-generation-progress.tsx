"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Mic, 
  FileText, 
  Volume2,
  BookOpen,
  X,
  RefreshCw,
  List
} from "lucide-react";

export interface GenerationProgress {
  stage: 'structuring' | 'generating_audio' | 'preparing_segments' | 'creating_summary' | 'complete';
  currentSegment?: number;
  totalSegments?: number;
  progress: number; // 0-100
  currentStep: string;
  errors: string[];
}

interface PodcastGenerationProgressProps {
  isVisible: boolean;
  progress: GenerationProgress;
  onClose?: () => void;
  onRetry?: () => void;
}

const STAGE_CONFIG = {
  structuring: {
    title: "Structuring Content",
    description: "Analyzing and organizing your content into logical segments",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  generating_audio: {
    title: "Generating Audio",
    description: "Converting text to speech and creating audio segments",
    icon: Volume2,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  preparing_segments: {
    title: "Preparing Segments",
    description: "Finalizing audio segments for playback",
    icon: List,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  creating_summary: {
    title: "Creating Summary",
    description: "Generating learning objectives and key concepts",
    icon: BookOpen,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  complete: {
    title: "Generation Complete",
    description: "Your podcast is ready to listen",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
};

export function PodcastGenerationProgress({
  isVisible,
  progress,
  onClose,
  onRetry
}: PodcastGenerationProgressProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isVisible) return null;

  const currentStage = STAGE_CONFIG[progress.stage];
  const IconComponent = currentStage.icon;

  const getProgressPercentage = () => {
    if (progress.stage === 'complete') return 100;
    
    // Use the progress value from the state, which now accounts for the new flow
    return progress.progress;
  };

  const progressPercentage = getProgressPercentage();

  // Check if we're in the audio preparation phase
  const isPreparingSegments = progress.currentStep.includes('Preparing segments') || 
                             progress.currentStep.includes('Preparing segments');

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className={`shadow-lg border-2 ${progress.errors.length > 0 ? 'border-red-200' : 'border-green-200'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${currentStage.bgColor}`}>
                <IconComponent className={`h-5 w-5 ${currentStage.color}`} />
              </div>
              <div>
                <CardTitle className="text-base">{currentStage.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {currentStage.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {progress.errors.length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  Error
                </Badge>
              )}
              <Button
                onClick={() => setIsMinimized(!isMinimized)}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
              >
                {isMinimized ? '−' : '−'}
              </Button>
              {onClose && (
                <Button
                  onClick={onClose}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{progress.currentStep}</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Stage-specific details */}
            {progress.stage === 'generating_audio' && progress.totalSegments && (
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  <span>
                    Segment {progress.currentSegment || 0} of {progress.totalSegments}
                  </span>
                </div>
              </div>
            )}

            {progress.stage === 'preparing_segments' && progress.totalSegments && (
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  <span>Preparing {progress.totalSegments} segments for playback</span>
                </div>
              </div>
            )}

            {/* Errors */}
            {progress.errors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  Generation Errors
                </div>
                <div className="space-y-1">
                  {progress.errors.map((error, index) => (
                    <p key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                      {error}
                    </p>
                  ))}
                </div>
                {onRetry && (
                  <Button
                    onClick={onRetry}
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry Generation
                  </Button>
                )}
              </div>
            )}

            {/* Success message */}
            {progress.stage === 'complete' && progress.errors.length === 0 && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Your podcast has been generated successfully!</span>
                </div>
                <p className="text-xs mt-1 text-green-700">
                  All segments are ready for playback with seamless virtual joining.
                </p>
              </div>
            )}

            {/* Loading animation for active stages */}
            {progress.stage !== 'complete' && progress.errors.length === 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Please wait while we process your content...</span>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}

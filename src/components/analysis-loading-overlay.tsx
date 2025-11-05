"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Loader2, 
  X, 
  Maximize2, 
  Minimize2,
  CheckCircle,
  AlertCircle,
  FileText,
  Upload,
  Brain,
  BookOpen,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePusherAnalysis } from "@/hooks/pusher/use-pusher-analysis";
import { trpc } from "@/lib/trpc";
import { AnalysisProgress, STATUS_MESSAGES } from "@/types/analysis";
import { toast } from "sonner";

interface AnalysisLoadingOverlayProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AnalysisLoadingOverlay({ 
  workspaceId, 
  isOpen, 
  onClose 
}: AnalysisLoadingOverlayProps) {
  const router = useRouter();
  const [isMinimized, setIsMinimized] = useState(true); // Start minimized
  const [hasShownToast, setHasShownToast] = useState(false);
  
  // Get workspace data
  const { data: workspace } = trpc.workspace.get.useQuery(
    { id: workspaceId },
  );
  
  // Get real-time progress
  const { progress, percentage } = usePusherAnalysis({
    workspaceId,
    enabled: isOpen,
  });
  
  const currentProgress = progress || workspace?.analysisProgress as unknown as AnalysisProgress;
  
  // Show initial toast notification
  useEffect(() => {
    if (isOpen && !hasShownToast && currentProgress) {
      setHasShownToast(true);
    }
  }, [isOpen, hasShownToast, currentProgress]);
  
  // Handle completion
  useEffect(() => {
    if (currentProgress?.status === 'completed') {
      toast.success('Analysis completed successfully!');
      setTimeout(() => {
        onClose();
        router.refresh();
      }, 2000);
    } else if (currentProgress?.status === 'error') {
      toast.error(`Analysis failed: ${currentProgress.error}`);
      setIsMinimized(false); // Show full view on error
    }
  }, [currentProgress?.status, currentProgress?.error, onClose, router]);
  
  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setHasShownToast(false);
      setIsMinimized(true);
    }
  }, [isOpen]);
  
  const handleMinimize = () => {
    setIsMinimized(true);
  };
  
  const handleMaximize = () => {
    setIsMinimized(false);
  };
  
  const getStepIcon = (step: string) => {
    switch (step) {
      case 'fileUpload': return <Upload className="h-4 w-4" />;
      case 'fileAnalysis': return <Brain className="h-4 w-4" />;
      case 'studyGuide': return <BookOpen className="h-4 w-4" />;
      case 'flashcards': return <Sparkles className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };
  
  const getStepName = (step: string) => {
    switch (step) {
      case 'fileUpload': return 'Uploading File';
      case 'fileAnalysis': return 'Analyzing Content';
      case 'studyGuide': return 'Creating Study Guide';
      case 'flashcards': return 'Generating Flashcards';
      default: return step;
    }
  };
  
  if (!isOpen || !currentProgress) return null;
  
  // Minimized view - toast-like
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card 
          onClick={handleMaximize}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            {currentProgress.status === 'error' ? (
              <AlertCircle className="h-5 w-5 text-destructive" />
            ) : currentProgress.status === 'completed' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            )}
            
            <div className="flex-1">
              <p className="text-sm font-medium">
                {STATUS_MESSAGES[currentProgress.status]}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentProgress.filename} • {percentage}%
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                handleMaximize();
              }}
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          
          {/* Mini progress bar */}
          <div className="h-1 bg-muted">
            <div 
              className="h-full bg-primary transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </Card>
      </div>
    );
  }
  
  // Expanded view
  return (
    <div className="fixed bottom-6 right-6 z-50 w-96">
      <Card>
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {currentProgress.status === 'error' ? (
                <AlertCircle className="h-5 w-5 text-destructive" />
              ) : currentProgress.status === 'completed' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                  <Loader2 className="h-5 w-5 animate-spin text-primary relative" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-sm">
                  {currentProgress.status === 'completed' ? 'Analysis Complete!' : 'Analyzing File'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {currentProgress.filename}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleMinimize}
              >
                <Minimize2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          
          <CardContent className="p-4 space-y-4">
            {/* Status Message */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {STATUS_MESSAGES[currentProgress.status]}
              </span>
              <span className="text-sm text-muted-foreground">
                {percentage}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <Progress value={percentage} className="h-2" />
            
            {/* Steps */}
            <div className="space-y-3">
              {Object.entries(currentProgress.steps).sort((a, b) => a[1].order - b[1].order).map(([step, data]) => {
                const status = data.status;
                if (status === 'skipped') return null;
                
                return (
                  <div key={step} className="flex items-center gap-3">
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full transition-all",
                      status === 'completed' && "bg-green-500/10 text-green-500",
                      status === 'in_progress' && "bg-primary/10 text-primary",
                      status === 'pending' && "bg-muted text-muted-foreground",
                      status === 'error' && "bg-destructive/10 text-destructive"
                    )}>
                      {status === 'in_progress' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : status === 'completed' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : status === 'error' ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        getStepIcon(step)
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className={cn(
                        "text-sm font-medium",
                        status === 'completed' && "text-muted-foreground",
                        status === 'in_progress' && "text-foreground"
                      )}>
                        {getStepName(step)}
                      </div>
                      {status === 'in_progress' && (
                        <div className="text-xs text-muted-foreground">
                          Processing...
                        </div>
                      )}
                    </div>
                    
                  </div>
                );
              })}
            </div>
            
            {/* Error Message */}
            {currentProgress.error && (
              <div className="rounded-lg bg-destructive/10 p-3">
                <p className="text-xs text-destructive">
                  {currentProgress.error}
                </p>
              </div>
            )}
            
            {/* Duration */}
            {currentProgress.completedAt && (
              <div className="text-center text-xs text-muted-foreground pt-2">
                Completed in {calculateDuration(
                  currentProgress.startedAt, 
                  currentProgress.completedAt
                )}
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

function calculateDuration(start: string, end: string): string {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const seconds = Math.floor(ms / 1000);
  
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}
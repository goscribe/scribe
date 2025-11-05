// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Button } from "@/components/ui/button";
// import { AlertCircle, CheckCircle, Loader2, X } from "lucide-react";
// import { usePusherAnalysis } from "@/hooks/pusher/use-pusher-analysis";
// import { trpc } from "@/lib/trpc";
// import { 
//   AnalysisProgress, 
//   StepStatus, 
//   STATUS_MESSAGES, 
//   STEP_ICONS 
// } from "@/types/analysis";
// import { cn } from "@/lib/utils";

// interface AnalysisProgressIndicatorProps {
//   workspaceId: string;
//   onClose?: () => void;
//   onComplete?: () => void;
//   className?: string;
// }

// export function AnalysisProgressIndicator({ 
//   workspaceId, 
//   onClose,
//   onComplete,
//   className 
// }: AnalysisProgressIndicatorProps) {
//   const router = useRouter();
//   const [showSuccess, setShowSuccess] = useState(false);
  
//   // Get initial state from database
//   const { data: workspace } = trpc.workspace.get.useQuery(
//     { id: workspaceId },
//     { 
//       refetchInterval: (data) => {
//         // Poll every 2 seconds while analyzing, as fallback
//         return data?.fileBeingAnalyzed ? 2000 : false;
//       }
//     }
//   );
  
//   // Subscribe to real-time updates
//   const { progress, percentage, isConnected } = usePusherAnalysis({
//     workspaceId,
//     enabled: true,
//   });
  
//   // Use Pusher progress if available, otherwise fall back to DB
//   const currentProgress = progress || workspace?.analysisProgress;
//   const isAnalyzing = workspace?.fileBeingAnalyzed || 
//     (currentProgress && currentProgress.status !== 'completed' && currentProgress.status !== 'error');
  
//   useEffect(() => {
//     if (currentProgress?.status === 'completed' && !showSuccess) {
//       setShowSuccess(true);
//       onComplete?.();
      
//       // Auto-close after 3 seconds
//       setTimeout(() => {
//         onClose?.();
//       }, 3000);
//     }
//   }, [currentProgress?.status, showSuccess, onComplete, onClose]);
  
//   if (!isAnalyzing && !showSuccess) return null;
  
//   return (
//     <Card className={cn("w-full max-w-lg", className)}>
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <CardTitle className="text-lg">
//             {showSuccess ? 'Analysis Complete!' : 'Analyzing File'}
//           </CardTitle>
//           {onClose && (
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-8 w-8"
//               onClick={onClose}
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           )}
//         </div>
//       </CardHeader>
      
//       <CardContent className="space-y-4">
//         {currentProgress && (
//           <>
//             {/* File info */}
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-muted-foreground">File:</span>
//               <span className="font-medium">{currentProgress.filename}</span>
//             </div>
            
//             {/* Status message */}
//             <div className="flex items-center gap-2">
//               {currentProgress.status === 'error' ? (
//                 <AlertCircle className="h-4 w-4 text-destructive" />
//               ) : currentProgress.status === 'completed' ? (
//                 <CheckCircle className="h-4 w-4 text-green-500" />
//               ) : (
//                 <Loader2 className="h-4 w-4 animate-spin text-primary" />
//               )}
//               <span className="text-sm font-medium">
//                 {STATUS_MESSAGES[currentProgress.status]}
//               </span>
//             </div>
            
//             {/* Progress bar */}
//             {currentProgress.status !== 'error' && (
//               <Progress value={percentage} className="h-2" />
//             )}
            
//             {/* Steps */}
//             <div className="space-y-2">
//               <StepIndicator 
//                 name="Upload" 
//                 status={currentProgress.steps.fileUpload} 
//               />
//               <StepIndicator 
//                 name="Analysis" 
//                 status={currentProgress.steps.fileAnalysis} 
//               />
//               <StepIndicator 
//                 name="Study Guide" 
//                 status={currentProgress.steps.studyGuide} 
//               />
//               <StepIndicator 
//                 name="Flashcards" 
//                 status={currentProgress.steps.flashcards} 
//               />
//             </div>
            
//             {/* Error message */}
//             {currentProgress.error && (
//               <div className="rounded-lg bg-destructive/10 p-3">
//                 <p className="text-sm text-destructive">
//                   {currentProgress.error}
//                 </p>
//               </div>
//             )}
            
//             {/* Duration */}
//             {currentProgress.completedAt && (
//               <div className="text-center text-sm text-muted-foreground">
//                 Completed in {calculateDuration(
//                   currentProgress.startedAt, 
//                   currentProgress.completedAt
//                 )}
//               </div>
//             )}
//           </>
//         )}
        
//         {/* Connection status (debug) */}
//         {!isConnected && isAnalyzing && (
//           <div className="text-xs text-muted-foreground text-center">
//             Using fallback polling (Pusher disconnected)
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// function StepIndicator({ 
//   name, 
//   status 
// }: { 
//   name: string; 
//   status: StepStatus;
// }) {
//   if (status === 'skipped') return null;
  
//   return (
//     <div className={cn(
//       "flex items-center gap-3 text-sm",
//       status === 'completed' && "text-muted-foreground",
//       status === 'error' && "text-destructive"
//     )}>
//       <span className="text-base">{STEP_ICONS[status]}</span>
//       <span className={cn(
//         status === 'in_progress' && "font-medium"
//       )}>
//         {name}
//       </span>
//     </div>
//   );
// }

// function calculateDuration(start: string, end: string): string {
//   const ms = new Date(end).getTime() - new Date(start).getTime();
//   const seconds = Math.floor(ms / 1000);
  
//   if (seconds < 60) {
//     return `${seconds}s`;
//   }
  
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;
//   return `${minutes}m ${remainingSeconds}s`;
// }

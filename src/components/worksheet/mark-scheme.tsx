"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  XCircle, 
  Target,
  MessageSquare,
  FileText,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserMarkSchemePoint } from "@/types/worksheet";

interface MarkSchemeProps {
  /** Question/Problem title */
  questionTitle: string;
  /** The user's answer */
  userAnswer: string;
  /** The correct/model answer */
  modelAnswer: string;
  /** Mark breakdown points */
  markPoints: UserMarkSchemePoint[];
  /** Total marks available */
  totalMarks: number;
  /** Marks achieved */
  marksAchieved: number;
  /** Overall feedback */
  feedback?: string;
  /** Additional tips or improvements */
  /** Whether to show detailed breakdown */
  showDetails?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Mark Scheme component for displaying grading results with detailed feedback
 */
export const MarkScheme = ({
  questionTitle,
  userAnswer,
  modelAnswer,
  markPoints,
  totalMarks,
  marksAchieved,
  feedback,
  showDetails = true,
  className
}: MarkSchemeProps) => {
  const [expandedFeedback, setExpandedFeedback] = useState<Set<number>>(new Set());
  const percentage = Math.round((marksAchieved / totalMarks) * 100);
  
  const toggleFeedback = (index: number) => {
    setExpandedFeedback(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };
  
  return (
    <Card className={cn("border border-border/50 shadow-sm flex-1 flex flex-col max-h-[600px]", className)}>
      <CardHeader className="pb-3 pt-4 flex-shrink-0">
        <div className="space-y-2">
          {/* Header with score */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">{questionTitle}</h3>
              <p className="text-xs text-muted-foreground">Mark Scheme & Feedback</p>
            </div>
            
            {/* Score Display */}
            <div className="text-right">
              <div className="text-xl font-bold">
                {marksAchieved}/{totalMarks}
              </div>
              <div className="text-xs text-muted-foreground">
                {percentage}%
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <Progress 
            value={percentage} 
            className="h-1.5"
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 pt-0 flex-1 flex flex-col min-h-0 overflow-y-auto">
        
        {/* Tabs for Model Answer and Mark Breakdown */}
        <Tabs defaultValue="breakdown" className="w-full flex-1 flex flex-col min-h-0">
          <div>
<TabsList className="flex-shrink-0">
            <TabsTrigger value="breakdown" >
              Mark Breakdown
            </TabsTrigger>
            <TabsTrigger value="model" >
              Model Answer
            </TabsTrigger>
          </TabsList>
          </div>
          
          <TabsContent value="breakdown" className="mt-2 flex-1 min-h-0 overflow-y-auto">
            <div className="space-y-1.5 pr-2">
              {markPoints.map((point: UserMarkSchemePoint, index: number) => (
              <div 
                key={index}
                className={cn(
                  "flex items-start gap-2 p-2 rounded-md border",
                  point.achievedPoints 
                    ? "bg-green-50/50 dark:bg-green-500/5 border-green-200 dark:border-green-500/20"
                    : "bg-red-50/50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20"
                )}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {point.achievedPoints ? (
                    <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs leading-relaxed flex-1">{point.requirements}</p>
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-xs flex-shrink-0",
                        point.achievedPoints && "bg-green-100 dark:bg-green-500/20",
                        !point.achievedPoints && "bg-red-100 dark:bg-red-500/20"
                      )}
                    >
                      {point.achievedPoints ? point.achievedPoints : 0}/{point.point}
                    </Badge>
                  </div>
                  {point.feedback && (
                    <div className="mt-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFeedback(index)}
                        className="h-6 px-1.5 text-xs text-muted-foreground hover:text-foreground"
                      >
                        {expandedFeedback.has(index) ? (
                          <>
                            <ChevronUp className="h-3 w-3 mr-1" />
                            Hide feedback
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3 mr-1" />
                            Show feedback
                          </>
                        )}
                      </Button>
                      {expandedFeedback.has(index) && (
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {point.feedback}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            </div>
          </TabsContent>
          
          <TabsContent value="model" className="mt-2 flex-1 min-h-0 overflow-y-auto">
            <div className="p-2 bg-muted/30 rounded-md border border-green-200 dark:border-green-500/20">
              <p className="text-xs whitespace-pre-wrap leading-relaxed">{modelAnswer || 'No model answer provided'}</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

/**
 * Simplified mark display for inline use
 */
export const MarkBadge = ({ 
  achieved, 
  total, 
  size = "default" 
}: { 
  achieved: number; 
  total: number; 
  size?: "sm" | "default" | "lg";
}) => {
  const percentage = Math.round((achieved / total) * 100);
  const isGood = percentage >= 70;
  const isMedium = percentage >= 50 && percentage < 70;
  
  return (
    <Badge 
      variant="outline"
      className={cn(
        "font-medium",
        isGood && "border-green-500/50 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400",
        isMedium && "border-yellow-500/50 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
        !isGood && !isMedium && "border-red-500/50 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400",
        size === "sm" && "text-xs px-2 py-0.5",
        size === "lg" && "text-base px-4 py-1.5"
      )}
    >
      {achieved}/{total}
    </Badge>
  );
};

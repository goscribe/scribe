"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Award, 
  Target,
  TrendingUp,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserMarkSchemePoint } from "@/types/worksheet";

interface MarkPoint {
  id: string;
  description: string;
  marks: number;
  achieved: boolean;
}

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
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  
  const percentage = Math.round((marksAchieved / totalMarks) * 100);
  
  return (
    <Card className={cn("border border-border/50 shadow-sm", className)}>
      <CardHeader className="pb-4">
        <div className="space-y-4">
          {/* Header with score */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{questionTitle}</h3>
              <p className="text-sm text-muted-foreground">Mark Scheme & Feedback</p>
            </div>
            
            {/* Score Display */}
            <div className="flex items-center gap-3">              
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {marksAchieved}/{totalMarks}
                </div>
                <div className="text-xs text-muted-foreground">
                  Marks
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={percentage} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{percentage}% achieved</span>
              <span>{totalMarks - marksAchieved} marks to improve</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* User's Answer Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Your Answer</span>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm whitespace-pre-wrap">{userAnswer}</p>
          </div>
        </div>
        
        {/* Mark Breakdown */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full justify-between hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">Mark Breakdown</span>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          
          {isExpanded && (
            <div className="space-y-2 pl-1">
              {markPoints.map((point: UserMarkSchemePoint, index: number) => (
                <div 
                  key={index}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border",
                    point.achievedPoints 
                      ? "bg-green-50/50 dark:bg-green-500/5 border-green-200 dark:border-green-500/20"
                      : "bg-red-50/50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20"
                  )}
                >
                  <div className="mt-0.5">
                    {point.achievedPoints ? (
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{point.requirements}</p>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs",
                          point.achievedPoints && "bg-green-100 dark:bg-green-500/20",
                          !point.achievedPoints && "bg-red-100 dark:bg-red-500/20"
                        )}
                      >
                        {point.achievedPoints ? point.achievedPoints : 0}/{point.point} marks
                      </Badge>
                    </div>
                    {point.feedback && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {point.feedback}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Model Answer */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowModelAnswer(!showModelAnswer)}
            className="w-full justify-between hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span className="text-sm font-medium">Model Answer</span>
            </div>
            {showModelAnswer ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          
          {showModelAnswer && (
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{modelAnswer}</p>
            </div>
          )}
        </div>
        
        {/* Overall Feedback */}
        {feedback && (
          <Card className="border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <h4 className="text-sm font-medium">Feedback</h4>
                  <p className="text-sm text-muted-foreground">{feedback}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
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

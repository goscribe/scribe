"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2,
  RotateCcw,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudyBlock {
  type: string;
  data: {
    text?: string;
    items?: string[];
    caption?: string;
  };
}

interface StudyModeProps {
  content: string;
  onExit: () => void;
}

export function StudyMode({ content, onExit }: StudyModeProps) {
  const [paragraphs, setParagraphs] = useState<StudyBlock[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userSummary, setUserSummary] = useState("");
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  // Extract paragraphs from EditorJS content
  useEffect(() => {
    try {
      const editorData = content.startsWith("{") || content.startsWith("[") 
        ? JSON.parse(content) 
        : { blocks: [] };

      // Filter for paragraph blocks and list items
      const textBlocks = editorData.blocks?.filter((block: StudyBlock) => 
        (block.type === "paragraph" && block.data.text) ||
        (block.type === "list" && block.data.items && block.data.items.length > 0) ||
        (block.type === "quote" && block.data.text)
      ) || [];

      setParagraphs(textBlocks);
    } catch (error) {
      console.error("Error parsing content:", error);
      setParagraphs([]);
    }
  }, [content]);

  const currentBlock = paragraphs[currentIndex];
  const progress = (completed.size / paragraphs.length) * 100;

  const handleNext = () => {
    if (currentIndex < paragraphs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserSummary("");
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setUserSummary("");
    }
  };

  const handleComplete = () => {
    const newCompleted = new Set(completed);
    newCompleted.add(currentIndex);
    setCompleted(newCompleted);

    handleNext();
  };

  const handleReset = () => {
    setCompleted(new Set());
    setCurrentIndex(0);
    setUserSummary("");
  };

  const stripHtmlTags = (text: string | undefined) => {
    if (!text || typeof text !== 'string') return '';
    return text.replace(/<[^>]*>/g, '');
  };

  const getCurrentText = () => {
    if (!currentBlock) return "";
    
    if (currentBlock.type === "paragraph" || currentBlock.type === "quote") {
      return stripHtmlTags(currentBlock.data.text || "");
    } else if (currentBlock.type === "list") {
      return currentBlock.data.items?.map(item => {
        const itemText = typeof item === 'string' ? item : String(item);
        return `• ${stripHtmlTags(itemText)}`;
      }).join("\n") || "";
    }
    return "";
  };

  if (paragraphs.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
          <p className="text-muted-foreground">
            No content available for study mode.
          </p>
          <Button variant="ghost" onClick={onExit}>Back to Study Guide</Button>
        </div>
      </div>
    );
  }

  const isCompleted = completed.has(currentIndex);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Study Mode</h3>
            <p className="text-sm text-muted-foreground">
              Read and summarize in your own words
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onExit}
          >
            Exit
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground font-medium">
            {currentIndex + 1} / {paragraphs.length}
          </span>
          <span className="text-muted-foreground">
            {completed.size} completed
          </span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Original Text */}
        <Card className={cn(
          "border-2 transition-colors",
          isCompleted ? "border-green-200 bg-green-50/30" : "border-border"
        )}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium text-muted-foreground">
                Read this passage
              </CardTitle>
              {isCompleted && (
                <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
                {getCurrentText()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* User Summary */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-base font-medium text-muted-foreground">
              Summarize in your own words
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What are the key ideas? Try to explain it as if teaching someone else..."
              value={userSummary}
              onChange={(e) => setUserSummary(e.target.value)}
              className="min-h-[140px] resize-none text-base border-0 focus-visible:ring-0 px-0"
            />
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button
          onClick={handleComplete}
          disabled={userSummary.trim().length === 0}
          className={cn(
            "gap-2 px-6",
            currentIndex === paragraphs.length - 1 
              ? "gradient-primary" 
              : "bg-foreground text-background hover:bg-foreground/90"
          )}
        >
          {currentIndex === paragraphs.length - 1 ? (
            <>
              Complete Study
              <CheckCircle2 className="h-4 w-4" />
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Completion Message */}
      {completed.size === paragraphs.length && currentIndex === paragraphs.length - 1 && (
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 mt-8">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Well done!
            </h3>
            <p className="text-muted-foreground mb-6">
              You've completed all {paragraphs.length} paragraphs
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={handleReset} variant="outline">
                Study Again
              </Button>
              <Button onClick={onExit} className="gradient-primary">
                Exit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


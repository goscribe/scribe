"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, ChevronDown, CheckCircle, PenTool, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import EditorJSMarkdownConverter from '@vingeray/editorjs-markdown-converter';

interface StudySection {
  id: string;
  title: string;
  content: string;
  isRevealed: boolean;
  isCompleted: boolean;
  userSummary?: string;
  feedbackGiven?: boolean;
}

export default function StudyModePage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;
  
  const { data: guideData, isLoading } = trpc.studyguide.get.useQuery(
    { workspaceId },
    { enabled: !!workspaceId }
  );

  const [sections, setSections] = useState<StudySection[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showAllContent, setShowAllContent] = useState(false);
  const [focusMode, setFocusMode] = useState(true);
  const [currentSummary, setCurrentSummary] = useState("");
  const [studyPhase, setStudyPhase] = useState<"reading" | "summarizing">("reading");

  // Parse guide content into sections
  useEffect(() => {
    if (guideData?.latestVersion?.content) {
      const content = guideData.latestVersion.content.startsWith("{") || guideData.latestVersion.content.startsWith("[") ? JSON.parse(guideData.latestVersion.content) : {
        time: Date.now(),
        blocks: EditorJSMarkdownConverter.toBlocks(guideData.latestVersion.content)
      };
      const parsedSections: StudySection[] = [];
      
      // Parse the EditorJS blocks into sections
      if (content.blocks) {
        let currentSection: StudySection | null = null;
        
        content.blocks.forEach((block: {
          type: string;
          data: {
            text: string;
            level: number;
            items: string[];
            code: string;
          };
          id: string;
        }) => {
          if (block.type === 'header' && block.data.level <= 2) {
            // Start a new section
            if (currentSection) {
              parsedSections.push(currentSection);
            }
            currentSection = {
              id: block.id || Math.random().toString(),
              title: block.data.text,
              content: '',
              isRevealed: false,
              isCompleted: false,
            };
          } else if (currentSection) {
            // Add content to current section
            let blockContent = '';
            switch (block.type) {
              case 'paragraph':
                blockContent = block.data.text;
                break;
              case 'list':
                blockContent = block.data.items.map((item: string) => `• ${item}`).join('\n');
                break;
              case 'quote':
                blockContent = `"${block.data.text}"`;
                break;
              case 'code':
                blockContent = block.data.code;
                break;
              default:
                blockContent = block.data.text || '';
            }
            currentSection.content += (currentSection.content ? '\n\n' : '') + blockContent;
          }
        });
        
        if (currentSection) {
          parsedSections.push(currentSection);
        }
      }
      
      setSections(parsedSections);
    }
  }, [guideData]);

  const toggleSectionReveal = (index: number) => {
    setSections(prev => prev.map((section, i) => 
      i === index ? { ...section, isRevealed: !section.isRevealed } : section
    ));
  };

  const startSummarizing = () => {
    setStudyPhase("summarizing");
    setCurrentSummary("");
  };

  const submitSummary = (index: number) => {
    if (!currentSummary.trim()) {
      toast.error("Please write a summary before submitting");
      return;
    }

    setSections(prev => prev.map((section, i) => 
      i === index ? { ...section, userSummary: currentSummary } : section
    ));
    
    // Mark complete and advance immediately
    markSectionComplete(index);
    toast.success("Summary saved!");
  };

  const markSectionComplete = (index: number) => {
    setSections(prev => prev.map((section, i) => 
      i === index ? { ...section, isCompleted: true, isRevealed: true } : section
    ));
    
    // Reset for next section
    setStudyPhase("reading");
    setCurrentSummary("");
    
    // Auto-advance to next section
    if (index < sections.length - 1) {
      setCurrentSectionIndex(index + 1);
      // Smooth scroll to next section
      setTimeout(() => {
        document.getElementById(`section-${index + 1}`)?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 300);
    }
  };

  const goToSection = (index: number) => {
    setCurrentSectionIndex(index);
    // Smooth scroll to section
    document.getElementById(`section-${index}`)?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  };

  const completedCount = sections.filter(s => s.isCompleted).length;
  const progress = sections.length > 0 ? (completedCount / sections.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto animate-pulse" />
          <p className="text-muted-foreground">Loading study guide...</p>
        </div>
      </div>
    );
  }

  if (!guideData || sections.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">No study guide available</p>
          <Button onClick={() => router.push(`/workspace/${workspaceId}/study-guide`)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push(`/workspace/${workspaceId}/study-guide`)}
            className="-ml-2 hover:bg-muted/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 bg-muted/50 rounded-full">
              <span className="text-sm font-medium">
                {currentSectionIndex + 1} <span className="text-muted-foreground">of</span> {sections.length}
              </span>
            </div>
          </div>
        </div>
        
        {/* Progress Section */}
        <div className="space-y-3">
          <Progress value={progress} className="h-1.5" />
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-4">
              {completedCount > 0 && (
                <>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="font-medium">{completedCount} completed</span>
                  </div>
                  {sections.length - completedCount > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
                      <span className="font-medium">{sections.length - completedCount} remaining</span>
                    </div>
                  )}
                </>
              )}
            </div>
            <span className="text-muted-foreground">
              {Math.round(progress)}% complete
            </span>
          </div>
        </div>


        {/* Study Sections - Only show current in focus mode */}
        <ErrorBoundary>
        {sections.filter((_, idx) => !focusMode || idx === currentSectionIndex).map((section, displayIndex) => {
          const index = focusMode ? currentSectionIndex : sections.indexOf(section);
          return (
            <Card
              key={section.id}
              id={`section-${index}`}
              className="border border-border/50 shadow-sm"
            >
              <div className="p-8">
                {/* Section Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">
                      Section {index + 1} • {studyPhase === "reading" ? "Reading" : "Summarize"}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold text-center leading-relaxed px-4">
                    {section.title}
                  </h2>
                </div>

                {/* Section Content */}
                <div className="mt-6 space-y-6">
                  {/* Reading Phase */}
                  {(studyPhase === "reading" || index !== currentSectionIndex) && (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-base leading-relaxed">
                        {section.content}
                      </div>
                    </div>
                  )}

                  {/* Summarizing Phase */}
                  {studyPhase === "summarizing" && index === currentSectionIndex && (
                    <div className="space-y-4">
                      <Card className="border-dashed border-2 border-primary/30 bg-primary/5 p-4">
                        <div className="flex items-start gap-3">
                          <PenTool className="h-5 w-5 text-primary mt-1" />
                          <div className="flex-1">
                            <h3 className="font-medium text-sm mb-2">Write Your Summary</h3>
                            <p className="text-xs text-muted-foreground mb-3">
                              Summarize the key points from this section in your own words. This helps reinforce your understanding.
                            </p>
                            <Textarea
                              value={currentSummary}
                              onChange={(e) => setCurrentSummary(e.target.value)}
                              placeholder="Write your summary here..."
                              className="min-h-[120px] resize-none"
                              autoFocus
                            />
                          </div>
                        </div>
                      </Card>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setStudyPhase("reading");
                            setCurrentSummary("");
                          }}
                          className="text-xs"
                        >
                          Back to Reading
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => submitSummary(index)}
                          disabled={!currentSummary.trim()}
                          className="text-xs"
                        >
                          Submit Summary
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center gap-3 mt-8 pt-6 border-t border-border/50">
                    {index === currentSectionIndex && (
                      <>
                        {studyPhase === "reading" && !section.isCompleted && (
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="lg"
                              onClick={() => markSectionComplete(index)}
                              className="px-5 text-sm"
                            >
                              <SkipForward className="h-4 w-4 mr-2" />
                              {index < sections.length - 1 ? "Skip to Next" : "Finish"}
                            </Button>
                            <Button
                              size="lg"
                              onClick={startSummarizing}
                              className="px-5 text-sm"
                            >
                              <PenTool className="h-4 w-4 mr-2" />
                              Write Summary
                            </Button>
                          </div>
                        )}
                        
                        {section.isCompleted && (
                          <>
                            <div className="text-center">
                              <Badge variant="secondary" className="text-sm bg-green-500/10 text-green-700 dark:text-green-400">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Section Completed
                              </Badge>
                            </div>
                            {index < sections.length - 1 && (
                              <Button
                                variant="ghost"
                                size="lg"
                                onClick={() => goToSection(index + 1)}
                                className="px-6 text-sm hover:bg-muted/50"
                              >
                                Next Section
                              </Button>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
        </ErrorBoundary>

        {/* Completion Message */}
        {completedCount === sections.length && sections.length > 0 && (
          <Card className="mt-8 border-green-500/30 bg-green-500/5">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold mb-2">Study Complete!</h3>
                <p className="text-muted-foreground">
                  You've completed all {sections.length} sections of the study guide.
                </p>
              </div>
              
              {/* Summary Review */}
              {sections.some(s => s.userSummary) && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3 text-center">Your Study Summaries</h4>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {sections.filter(s => s.userSummary).map((section, index) => (
                      <div key={section.id} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs shrink-0">
                            Section {sections.indexOf(section) + 1}
                          </Badge>
                          <div className="flex-1">
                            <p className="text-xs font-medium mb-1">{section.title}</p>
                            <p className="text-xs text-muted-foreground">{section.userSummary}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSections(prev => prev.map(s => ({ 
                      ...s, 
                      isCompleted: false, 
                      isRevealed: false,
                      userSummary: undefined,
                    })));
                    setCurrentSectionIndex(0);
                    setStudyPhase("reading");
                    setCurrentSummary("");
                  }}
                >
                  Study Again
                </Button>
                <Button onClick={() => router.push(`/workspace/${workspaceId}/study-guide`)}>
                  Back to Editor
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Save, 
  Edit3, 
  Trash2, 
  Download, 
  Share2, 
  Settings,
  Bold,
  Italic,
  List as ListIcon,
  ListOrdered,
  Quote as QuoteIcon,
  Code,
  Link,
  Image,
  Undo,
  Redo,
  Eye,
  EyeOff
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import CodeTool from "@editorjs/code";
import LinkTool from "@editorjs/link";
import ImageTool from "@editorjs/image";
import "./page.css";
import { trpc } from "@/lib/trpc";
import { useParams } from "next/navigation";

interface StudyGuide {
    id: string;
    title: string;
    content: string; // JSON string for EditorJS data
    lastModified: string;
    workspaceId: string;
}

export default function StudyGuidePanel() {
    const params = useParams();
    const workspaceId = params.id as string;
    
    // TRPC queries and mutations
    const { data, isLoading, error } = trpc.studyguide.get.useQuery({
        workspaceId,
    }, {
        enabled: !!workspaceId,
    });

    const guideInfo = data;
    const guide = data?.latestVersion;

    const updateGuideMutation = trpc.studyguide.edit.useMutation({
        onSuccess: () => {
            // Refetch the guide data
            utils.studyguide.get.invalidate({ workspaceId });
        },
    });

    const utils = trpc.useUtils();

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<string>("");

    const editorRef = useRef<EditorJS | null>(null);



    // Initialize title when guide data loads
    useEffect(() => {
        if (guide) {
            setTitle(guideInfo?.artifactId || "Untitled Study Guide");
            setLastSaved(guideInfo?.latestVersion?.createdAt.toLocaleString() || "Never");
        }
    }, [guide]);

    const initializeEditor = () => {
        if (editorRef.current && typeof editorRef.current.destroy === 'function') {
            try {
                editorRef.current.destroy();
            } catch (error) {
                console.warn('Error destroying editor:', error);
            }
        }

        const editorData = guide?.content && JSON.parse(guide.content).blocks ? JSON.parse(guide.content) : {
            time: Date.now(),
            blocks: [
                {
                    type: "header",
                    data: {
                        text: "Study Guide",
                        level: 1,
                    },
                },
                {
                    type: "paragraph",
                    data: {
                        text: "Start writing your study notes here...",
                    },
                },
            ],
        };

        editorRef.current = new EditorJS({
            holder: "editorjs-container",
            data: editorData,
            tools: {
                header: {
                    class: Header,
                    config: {
                        placeholder: 'Enter a header',
                        levels: [1, 2, 3, 4, 5, 6],
                        defaultLevel: 2
                    }
                },
                list: {
                    class: List,
                    inlineToolbar: true,
                    config: {
                        defaultStyle: 'unordered'
                    }
                },
                quote: {
                    class: Quote,
                    inlineToolbar: true,
                    config: {
                        quotePlaceholder: 'Enter a quote',
                        captionPlaceholder: 'Quote\'s author',
                    },
                },
                code: CodeTool,
                linkTool: {
                    class: LinkTool,
                    config: {
                        endpoint: '/api/link', // You'll need to implement this endpoint
                    }
                },
                image: {
                    class: ImageTool,
                    config: {
                        endpoints: {
                            byFile: '/api/upload', // You'll need to implement this endpoint
                            byUrl: '/api/fetch-url', // You'll need to implement this endpoint
                        }
                    }
                },
            },
            readOnly: !isEditing,
            placeholder: 'Start writing your study notes...',
            onChange: () => {
                // Auto-save functionality could be added here
            },
        });
    };

    useEffect(() => {
        if (!isLoading && !error) {
            initializeEditor();
        }

        return () => {
            if (editorRef.current && typeof editorRef.current.destroy === 'function') {
                try {
                    editorRef.current.destroy();
                } catch (error) {
                    console.warn('Error destroying editor during cleanup:', error);
                }
            }
        };
    }, [guide, isEditing, isLoading, error]);

    const handleSave = async () => {
        if (!editorRef.current) return;

        setIsSaving(true);
        try {
            const savedData = await editorRef.current.save();
            
                // Update existing guide
                await updateGuideMutation.mutateAsync({
                    workspaceId,
                    title: guideInfo?.artifactId,
                    content: JSON.stringify(savedData),
                    workspaceId,
                });
            
            setLastSaved("Just now");
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save study guide:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset title to original
        if (guide) {
            setTitle("study guide");
        }
        // Reinitialize editor with original data
        initializeEditor();
    };

    const handleExport = async () => {
        if (!editorRef.current) return;
        
        const data = await editorRef.current.save();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title || 'study-guide'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleShare = () => {
        // Implement sharing functionality
        navigator.clipboard.writeText(window.location.href);
        // You could add a toast notification here
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="animate-pulse">
                        <div className="h-6 bg-muted rounded w-48 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-64"></div>
                    </div>
                    <div className="animate-pulse">
                        <div className="h-9 bg-muted rounded w-20"></div>
                    </div>
                </div>
                <Card className="shadow-soft">
                    <CardContent className="p-6">
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-muted rounded w-full"></div>
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-4 bg-muted rounded w-1/2"></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <div className="text-center py-8">
                    <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Study Guide</h3>
                    <p className="text-muted-foreground mb-4">{error.message}</p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    {isEditing ? (
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-lg font-semibold h-8 border-0 p-0 focus-visible:ring-0"
                            placeholder="Enter study guide title..."
                        />
                    ) : (
                        <h3 className="text-lg font-semibold">{title || "Untitled Study Guide"}</h3>
                    )}
                    <p className="text-sm text-muted-foreground">
                        {guide ? `Last modified: ${lastSaved}` : "Create your study guide"}
                    </p>
                </div>
                
                <div className="flex items-center space-x-2">
                    {isEditing ? (
                        <>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                className="gradient-primary"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save
                                    </>
                                )}
                            </Button>
                        </>
                    ) : (
                        <>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleExport}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Export as JSON</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleShare}
                                        >
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Share study guide</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            
                            <Button
                                size="sm"
                                className="gradient-primary"
                                onClick={handleEdit}
                            >
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Editor Toolbar */}
            {isEditing && (
                <Card className="shadow-soft">
                    <CardContent className="p-3">
                        <div className="flex items-center space-x-1">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
                                            onClick={() => {
                                                // Implement bold formatting
                                            }}
                                        >
                                            <Bold className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Bold (Ctrl+B)</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
                                            onClick={() => {
                                                // Implement italic formatting
                                            }}
                                        >
                                            <Italic className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Italic (Ctrl+I)</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            
                            <Separator orientation="vertical" className="h-6" />
                            
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
                                            onClick={() => {
                                                // Implement list formatting
                                            }}
                                        >
                                            <ListIcon className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Bullet List</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
                                            onClick={() => {
                                                // Implement numbered list
                                            }}
                                        >
                                            <ListOrdered className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Numbered List</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            
                            <Separator orientation="vertical" className="h-6" />
                            
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
                                            onClick={() => {
                                                // Implement quote block
                                            }}
                                        >
                                            <QuoteIcon className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Quote Block</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
                                            onClick={() => {
                                                // Implement code block
                                            }}
                                        >
                                            <Code className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Code Block</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            
                            <Separator orientation="vertical" className="h-6" />
                            
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
                                            onClick={() => {
                                                // Implement link
                                            }}
                                        >
                                            <Link className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Add Link</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
                                            onClick={() => {
                                                // Implement image upload
                                            }}
                                        >
                                            <Image className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Add Image</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Editor */}
            <Card className="shadow-soft">
                <CardContent className="p-6">
                    <div
                        id="editorjs-container"
                        className={`editorjs-container ${
                            !isEditing ? "pointer-events-none" : ""
                        }`}
                    ></div>
                </CardContent>
            </Card>

            {/* Status Bar */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-4">
                    <span>Words: {guide?.content ? JSON.parse(guide.content).blocks.length : 0}</span>
                    <span>Last saved: {lastSaved}</span>
                </div>
                <div className="flex items-center space-x-2">
                    {isEditing && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            Editing
                        </Badge>
                    )}
                    {guide && (
                        <Badge variant="outline">
                            Auto-save enabled
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    );
}
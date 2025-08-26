"use client";

import { useState, useEffect, useRef } from "react";
import {Plus, Edit3, Trash2} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import "./page.css"
import ImageTool from "@editorjs/image";

interface StudyGuide {
    id: string;
    title: string;
    content: string; // JSON string for EditorJS data
    lastModified: string;
}

export default function StudyGuidePanel() {
    const [guides, setGuides] = useState<StudyGuide[]>([
        {
            id: "1",
            title: "Main Study Guide",
            content: JSON.stringify({
                time: Date.now(),
                blocks: [
                    {
                        type: "header",
                        data: {
                            text: "Chapter 5: Calculus Fundamentals",
                            level: 2,
                        },
                    },
                    {
                        type: "list",
                        data: {
                            style: "unordered",
                            items: [
                                "**Derivatives**: The rate of change of a function at any point",
                                "**Integrals**: The area under a curve, inverse of derivatives",
                                "**Limits**: The value a function approaches as input approaches a value",
                            ],
                        },
                    },
                ],
            }),
            lastModified: "2 hours ago",
        },
    ]);

    const [editingId, setEditingId] = useState<string | null>(null);

    const editorRef = useRef<Record<string, EditorJS>>({});

    const deleteGuide = async (id: string) => {
        setGuides(guides.filter(guide => guide.id !== id));
    }

    const handleEdit = (guide: StudyGuide) => {
        setEditingId(guide.id);
    };

    const handleSave = async (id: string) => {
        const editor = editorRef.current[id];
        if (editor) {
            editor.focus(true);
            const savedData = await editor.save();
            setGuides((prevGuides) =>
                prevGuides.map((guide) =>
                    guide.id === id
                        ? {
                            ...guide,
                            content: JSON.stringify(savedData),
                            lastModified: "Just now",
                        }
                        : guide
                )
            );
        }
        setEditingId(null);
    };

    const addNewGuide = () => {
        const newGuide: StudyGuide = {
            id: Date.now().toString(),
            title: `Study Guide ${guides.length + 1}`,
            content: JSON.stringify({
                time: Date.now(),
                blocks: [
                    {
                        type: "header",
                        data: {
                            text: "New Study Guide",
                            level: 2,
                        },
                    },
                    {
                        type: "paragraph",
                        data: {
                            text: "Start writing your notes here...",
                        },
                    },
                ],
            }),
            lastModified: "Just now",
        };
        setGuides([...guides, newGuide]);
    };

    useEffect(() => {
      // Initialize EditorJS instances for all guides
      guides.forEach((guide) => {
        if (!editorRef.current[guide.id]) {
          editorRef.current[guide.id] = new EditorJS({
            holder: `editorjs-${guide.id}`,
            data: JSON.parse(guide.content),
            tools: {
              header: Header,
              list: List,
              image: {
                class: ImageTool,
                config: {
                  endpoints: {
                    byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
                    byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
                  }
                }
              },
            },
            readOnly: editingId !== guide.id,
          });
        } else {
            // Update the readOnly state for existing instances
            const editor = editorRef.current[guide.id];
            editor.isReady.then(() => {
                editor.readOnly.toggle(editingId !== guide.id);
            });
        }
      });

      return () => {
      };
    }, [guides, editingId]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Study Guides</h3>
                    <p className="text-sm text-muted-foreground">
                        AI-generated summaries and your personal notes
                    </p>
                </div>
                <Button onClick={addNewGuide} size="sm" className="gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    New Guide
                </Button>
            </div>

            {guides.map((guide) => (
                <Card key={guide.id} className="shadow-soft">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{guide.title}</CardTitle>
                            <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  Modified {guide.lastModified}
                </span>
                                {editingId === guide.id ? (
                                    <>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 w-8 p-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteGuide(guide.id);
                                        }}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleSave(guide.id)}
                                    >
                                        Save
                                    </Button>
                                    </>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEdit(guide)}
                                    >
                                        <Edit3 className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div
                            id={`editorjs-${guide.id}`}
                            className={`editorjs-container ${
                                editingId === guide.id ? "" : "pointer-events-none"
                            }`}
                        ></div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
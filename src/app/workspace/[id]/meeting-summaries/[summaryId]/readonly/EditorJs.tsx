"use client";

import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import { Card, CardContent } from "@/components/ui/card";
import EJLaTeX from "editorjs-latex";
import "./page.css";

export interface MeetingSummaryContent {
    id: string;
    title: string;
    content: string; // JSON string for EditorJS data
    lastModified: string;
}

interface MeetingSummaryEditorJsROProp {
    dsummary: MeetingSummaryContent;
}

export default function MeetingSummaryEditorJsRO({ dsummary }: MeetingSummaryEditorJsROProp) {
    const editorRef = useRef<EditorJS | null>(null);
    useEffect(() => {
        if (typeof window !== "undefined" && !editorRef.current && dsummary.content) {
            const editorContainerId = `editorjs-${dsummary.id}`;
            const editorElement = document.getElementById(editorContainerId);
            if (editorElement) {
                editorRef.current = new EditorJS({
                    holder: editorContainerId,
                    data: JSON.parse(dsummary.content),
                    tools: {
                        header: Header,
                        list: List,
                        image: {
                            class: ImageTool,
                            config: {
                                endpoints: {
                                    byFile: "http://localhost:8008/uploadFile", // Your backend file uploader endpoint
                                    byUrl: "http://localhost:8008/fetchUrl", // Your endpoint that provides uploading by Url
                                },
                            },
                        },
                        Math: {
                            class: EJLaTeX,
                            shortcut: "CMD+SHIFT+M",
                        },
                    },
                    readOnly: true,
                });
            }
        }
    }, [dsummary]);

    return (
        <Card className="shadow-soft">
            <CardContent>
                <div
                    id={`editorjs-${dsummary.id}`}
                    className="editorjs-container"
                ></div>
            </CardContent>
        </Card>
    );
}
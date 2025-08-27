"use client";

import {useEffect, useRef, useState} from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import {Card, CardContent} from "@/components/ui/card";
import EJLaTeX from "editorjs-latex";
import "./page.css"

interface MeetingSummary {
    id: string;
    title: string;
    content: string; // JSON string for EditorJS data
    lastModified: string;
}

export default function MeetingSummaryPage() {
    const editorRef = useRef<EditorJS>(null);
    const [summary, setSummary] = useState<MeetingSummary>({
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
    });
    useEffect(() => {
        if(!editorRef.current && typeof window !== "undefined" && summary.content) {
            editorRef.current = new EditorJS({
                holder: `editorjs-${summary.id}`,
                data: JSON.parse(summary.content),
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
                    Math: {
                        class: EJLaTeX,
                        shortcut: 'CMD+SHIFT+M'
                    },
                },
                readOnly: true,
            });
        }
    })
    return(
        <Card className="shadow-soft">
            <CardContent>
                <div
                    id={`editorjs-${summary.id}`}
                    className='editorjs-container'
                ></div>
            </CardContent>
        </Card>
    );
}
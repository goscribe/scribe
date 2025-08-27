"use client";

import {useEffect, useState} from "react";
import "./page.css"
import MeetingSummaryEditorJsRO from "@/app/workspace/[id]/meeting-summaries/[summaryId]/editing/EditorJs";
import {MeetingSummaryContent} from "@/app/workspace/[id]/meeting-summaries/[summaryId]/editing/EditorJs";
import {CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ArrowLeftIcon} from "lucide-react";
import {useParams, useRouter} from "next/navigation";

export default function MeetingSummaryPage() {
    const { id } = useParams();
    const router = useRouter();
    const [onSave, setOnSave] = useState(false);
    const [summary, setSummary] = useState<MeetingSummaryContent>({
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

    const handleExitOnCancel = () => {
        handleExit();
    }

    const handleExitOnSave = () => {
        setOnSave(true);
        handleExit();
    }

    const handleExit = () => {
        router.push(`/workspace/${id}/meeting-summaries`);
    }

    useEffect(() => {
    }, []);
    return(
        <>
        <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                    <Button size="sm" variant="outline" onClick={handleExitOnCancel}><ArrowLeftIcon className="h-3 w-3" /></Button>
                </CardTitle>
                <CardTitle className="text-base">{summary.title}</CardTitle>
                <div className="flex items-center space-x-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExitOnSave()}
                    >
                        Save
                    </Button>
                </div>

            </div>
        </CardHeader>
        <MeetingSummaryEditorJsRO dsummary={summary} isOnSave={onSave} setOnSave={setOnSave}/>
        </>
    );
}
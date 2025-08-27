"use client";

import {useEffect, useState} from "react";
import "./page.css"
import MeetingSummaryEditorJsRO from "@/app/workspace/[id]/meeting-summaries/[summaryId]/readonly/EditorJs";
import {MeetingSummaryContent} from "@/app/workspace/[id]/meeting-summaries/[summaryId]/readonly/EditorJs";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ArrowLeftIcon} from "lucide-react";
import {useParams, useRouter} from "next/navigation";
import {
    MeetingSummary,
    SummaryActionItems,
    SummaryKeyPoints,
    SummaryMetadata
} from "@/app/workspace/[id]/meeting-summaries/page";

export default function MeetingSummaryPage() {
    const { id, summaryId } = useParams();
    const router = useRouter();
    const [summaries, setSummaries] = useState<MeetingSummary[]>([
        {
            id: '1',
            title: 'Team Planning Meeting',
            date: '2024-01-15',
            duration: '45 min',
            participants: ['Alice Johnson', 'Bob Smith', 'Carol Davis'],
            keyPoints: ['Project timeline discussed', 'Resource allocation reviewed'],
            actionItems: ['Update project roadmap', 'Schedule follow-up'],
            status: 'Final'
        },
        {
            id: '2',
            title: 'Client Requirements Review',
            date: '2024-01-12',
            duration: '60 min',
            participants: ['John Doe', 'Jane Smith'],
            keyPoints: ['Requirements clarification', 'Technical constraints'],
            actionItems: ['Draft technical specification'],
            status: 'Draft'
        }
    ]);
    const [curSum, setCurSum] = useState<MeetingSummary | undefined>(summaries.at(0));
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
    useEffect(() => {
        setCurSum(summaries.find(summary=> summary.id === summaryId));
    }, [summaries, summaryId]);
    return(
        <>
        <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
            <CardTitle className="text-base">
                <Button size="sm" variant="outline" onClick={() => {router.push(`/workspace/${id}/meeting-summaries`);}}><ArrowLeftIcon className="h-3 w-3" /></Button>
            </CardTitle>
            <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  Modified {summary.lastModified}
                </span>
            </div>
            </div>
        </CardHeader>
            <div className="flex items-center justify-between pb-3">
                {
                    (curSum !== undefined) ? (
                        <Card className="space-y-4 min-w-full">
                            <>
                                <CardContent className="space-y-4 min-w-full">
                                    <SummaryMetadata summary={curSum}></SummaryMetadata>
                                </CardContent>
                            </>
                        </Card>
                    ) : <></>
                }
            </div>
        <MeetingSummaryEditorJsRO dsummary={summary} />
        </>
    );
}
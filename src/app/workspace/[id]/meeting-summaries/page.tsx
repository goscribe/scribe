"use client";

import {useState} from "react";
import {Edit3, Eye, Plus} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useParams, useRouter} from "next/navigation";
import {SummaryActionItems, SummaryMetadata, SummaryKeyPoints} from "@/app/workspace/[id]/meeting-summaries/summaryInfoComponents";

export interface MeetingSummary {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: string[];
  keyPoints: string[];
  actionItems: string[];
  status: 'Draft' | 'Final' | 'Reviewed';
}

export interface MetadataProp {
    summary: MeetingSummary;
}


export default function SummariesPanel() {
  const router = useRouter();
  const { id } = useParams();
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

  const addNewSummary = () => {
    const newSummary: MeetingSummary = {
      id: Date.now().toString(),
      title: `Meeting Summary ${summaries.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      duration: '30 min',
      participants: ['You'],
      keyPoints: ['Add key discussion points'],
      actionItems: ['Add action items'],
      status: 'Draft'
    };
    setSummaries([...summaries, newSummary]);
  };

  const openSummary = (summaryId: string) => {
    console.log('Opening summary:', summaryId);
    router.push(`/workspace/${id}/meeting-summaries/${summaryId}/readonly`);
  };

  const editSummary = (summaryId: string) => {
    console.log('Editing summary:', summaryId);
    router.push(`/workspace/${id}/meeting-summaries/${summaryId}/editing`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Meeting Summaries</h3>
          <p className="text-sm text-muted-foreground">
            Organized summaries of meetings and discussions
          </p>
        </div>
        <Button onClick={addNewSummary} size="sm" className="gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Summary
        </Button>
      </div>
        <div className="grid gap-4">
            {summaries.map((summary) => (
                <Card key={summary.id} className="shadow-soft hover:shadow-md transition-shadow">
                    <SummaryMetadata summary={summary}/>
                    <CardContent className="space-y-4">
                        <SummaryKeyPoints summary={summary}/>
                        <SummaryActionItems summary={summary}/>
                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                            <Button
                                onClick={() => openSummary(summary.id)}
                                size="sm"
                                className="flex-1"
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                            </Button>
                            <Button
                                onClick={() => editSummary(summary.id)}
                                size="sm"
                                variant="outline"
                            >
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>

      {summaries.length === 0 && (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No meeting summaries yet.</p>
            <Button onClick={addNewSummary} className="mt-2" variant="outline">
              Create your first summary
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
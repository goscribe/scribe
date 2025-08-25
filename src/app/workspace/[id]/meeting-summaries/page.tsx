"use client";

import { useState } from "react";
import { Plus, Eye, Edit3, Calendar, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MeetingSummary {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: string[];
  keyPoints: string[];
  actionItems: string[];
  status: 'Draft' | 'Final' | 'Reviewed';
}

export default function SummariesPanel() {
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
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Final': return 'bg-green-100 text-green-800 border-green-200';
      case 'Reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-muted text-muted-foreground';
    }
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
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base mb-2">{summary.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {summary.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {summary.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {summary.participants.length} participants
                    </div>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={getStatusColor(summary.status)}
                >
                  {summary.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Key Points Preview */}
              <div>
                <h4 className="text-sm font-medium mb-2">Key Points</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {summary.keyPoints.slice(0, 2).map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {point}
                    </li>
                  ))}
                  {summary.keyPoints.length > 2 && (
                    <li className="text-xs">+{summary.keyPoints.length - 2} more</li>
                  )}
                </ul>
              </div>

              {/* Action Items Preview */}
              <div>
                <h4 className="text-sm font-medium mb-2">Action Items</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {summary.actionItems.slice(0, 2).map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">□</span>
                      {item}
                    </li>
                  ))}
                  {summary.actionItems.length > 2 && (
                    <li className="text-xs">+{summary.actionItems.length - 2} more</li>
                  )}
                </ul>
              </div>

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
                  onClick={() => openSummary(summary.id)}
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
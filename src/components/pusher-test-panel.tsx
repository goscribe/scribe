"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnalysisLoadingState } from '@/lib/pusher-manager';

interface PusherTestPanelProps {
  workspaceId: string;
  loadingState: AnalysisLoadingState;
  onReset: () => void;
}

export function PusherTestPanel({ workspaceId, loadingState, onReset }: PusherTestPanelProps) {
  const [isVisible, setIsVisible] = useState(false);

  const simulateEvent = async (eventName: string, data: any) => {
    try {
      // This would normally be triggered by your backend
      // For testing, we'll just log the event
      console.log(`Simulating event: ${workspaceId}_${eventName}`, data);
      
      // In a real implementation, your backend would emit this event
      // For now, we'll just show what would happen
      alert(`Event ${eventName} would be emitted with data: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('Error simulating event:', error);
    }
  };

  const testEvents = [
    {
      name: 'file_analysis_start',
      data: { filename: 'test.pdf', fileType: 'pdf' },
      label: 'File Analysis Start'
    },
    {
      name: 'file_analysis_complete',
      data: { filename: 'test.pdf', fileType: 'pdf' },
      label: 'File Analysis Complete'
    },
    {
      name: 'study_guide_load_start',
      data: { filename: 'test.pdf' },
      label: 'Study Guide Start'
    },
    {
      name: 'study_guide_info',
      data: { contentLength: 1500 },
      label: 'Study Guide Info'
    },
    {
      name: 'studyguide_ended',
      data: {
        type: 'studyguide',
        result: { artifactId: 'sg_123', title: 'Test Study Guide', status: 'completed' },
        timestamp: new Date().toISOString()
      },
      label: 'Study Guide Complete'
    },
    {
      name: 'flash_card_load_start',
      data: { filename: 'test.pdf' },
      label: 'Flashcards Start'
    },
    {
      name: 'flash_card_info',
      data: { contentLength: 800 },
      label: 'Flashcards Info'
    },
    {
      name: 'flashcard_ended',
      data: {
        type: 'flashcard',
        result: { artifactId: 'fc_123', title: 'Test Flashcards', status: 'completed' },
        timestamp: new Date().toISOString()
      },
      label: 'Flashcards Complete'
    },
    {
      name: 'worksheet_load_start',
      data: { filename: 'test.pdf' },
      label: 'Worksheet Start'
    },
    {
      name: 'worksheet_info',
      data: { contentLength: 1200 },
      label: 'Worksheet Info'
    },
    {
      name: 'worksheet_ended',
      data: {
        type: 'worksheet',
        result: { artifactId: 'ws_123', title: 'Test Worksheet', status: 'completed' },
        timestamp: new Date().toISOString()
      },
      label: 'Worksheet Complete'
    },
    {
      name: 'analysis_cleanup_start',
      data: { filename: 'test.pdf' },
      label: 'Cleanup Start'
    },
    {
      name: 'analysis_cleanup_complete',
      data: { filename: 'test.pdf' },
      label: 'Cleanup Complete'
    },
    {
      name: 'analysis_ended',
      data: {
        filename: 'test.pdf',
        artifacts: {
          studyGuide: { artifactId: 'sg_123', title: 'Test Study Guide' },
          flashcards: { artifactId: 'fc_123', title: 'Test Flashcards' },
          worksheet: { artifactId: 'ws_123', title: 'Test Worksheet' }
        },
        timestamp: new Date().toISOString()
      },
      label: 'Analysis Complete'
    },
    {
      name: 'analysis_error',
      data: { error: 'Test error message', timestamp: new Date().toISOString() },
      label: 'Analysis Error'
    }
  ];

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-50"
      >
        Test Pusher Events
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Pusher Event Tester</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
              >
                Reset
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
              >
                ×
              </Button>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Workspace: {workspaceId}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xs font-medium mb-2">Current State:</div>
          <div className="space-y-1 text-xs">
            <div>Analyzing: <Badge variant={loadingState.isAnalyzing ? "default" : "secondary"}>{loadingState.isAnalyzing ? "Yes" : "No"}</Badge></div>
            <div>Step: {loadingState.currentStep || "None"}</div>
            <div>Errors: {loadingState.errors.length}</div>
            <div>Completed: {Object.keys(loadingState.completedArtifacts).length}</div>
          </div>
          
          <div className="text-xs font-medium mt-4 mb-2">Test Events:</div>
          <div className="grid grid-cols-2 gap-1">
            {testEvents.map((event) => (
              <Button
                key={event.name}
                variant="outline"
                size="sm"
                onClick={() => simulateEvent(event.name, event.data)}
                className="text-xs h-8"
              >
                {event.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

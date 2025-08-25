"use client";

import { useState } from "react";
import { Plus, Eye, Edit3, Play, Pause, Download, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Podcast {
  id: string;
  title: string;
  description: string;
  duration: string;
  dateCreated: string;
  isPlaying: boolean;
  progress: number;
  transcript: string;
  status: 'Ready' | 'Processing' | 'Draft';
}

export default function PodcastsPanel() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([
    {
      id: '1',
      title: 'Calculus Fundamentals',
      description: 'Introduction to derivatives and their applications',
      duration: '15:30',
      dateCreated: '2024-01-15',
      isPlaying: false,
      progress: 65,
      transcript: 'Today we\'ll explore the fundamental concepts of calculus...',
      status: 'Ready'
    },
    {
      id: '2',
      title: 'Integration Techniques',
      description: 'Advanced methods for solving complex integrals',
      duration: '22:45',
      dateCreated: '2024-01-12',
      isPlaying: false,
      progress: 0,
      transcript: 'Integration is the reverse process of differentiation...',
      status: 'Ready'
    },
    {
      id: '3',
      title: 'Limits and Continuity',
      description: 'Understanding the foundation of calculus',
      duration: '18:20',
      dateCreated: '2024-01-10',
      isPlaying: false,
      progress: 100,
      transcript: 'Limits form the theoretical foundation...',
      status: 'Processing'
    }
  ]);

  const generateNewPodcast = () => {
    const newPodcast: Podcast = {
      id: Date.now().toString(),
      title: `Podcast ${podcasts.length + 1}`,
      description: 'AI-generated educational content',
      duration: '20:00',
      dateCreated: new Date().toISOString().split('T')[0],
      isPlaying: false,
      progress: 0,
      transcript: 'Podcast content will be generated...',
      status: 'Draft'
    };
    setPodcasts([...podcasts, newPodcast]);
  };

  const togglePlayback = (podcastId: string) => {
    setPodcasts(podcasts.map(podcast =>
      podcast.id === podcastId
        ? { ...podcast, isPlaying: !podcast.isPlaying }
        : { ...podcast, isPlaying: false }
    ));
  };

  const openPodcast = (podcastId: string) => {
    console.log('Opening podcast:', podcastId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'Processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Podcasts</h3>
          <p className="text-sm text-muted-foreground">
            AI-generated audio content for learning on the go
          </p>
        </div>
        <Button onClick={generateNewPodcast} size="sm" className="gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Generate Podcast
        </Button>
      </div>

      <div className="grid gap-4">
        {podcasts.map((podcast) => (
          <Card key={podcast.id} className="shadow-soft hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base mb-2">{podcast.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-3">
                    {podcast.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {podcast.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {podcast.dateCreated}
                    </div>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={getStatusColor(podcast.status)}
                >
                  {podcast.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress */}
              {podcast.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{podcast.progress}%</span>
                  </div>
                  <Progress value={podcast.progress} className="h-2" />
                </div>
              )}

              {/* Transcript Preview */}
              <div>
                <h4 className="text-sm font-medium mb-2">Transcript Preview</h4>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {podcast.transcript}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={() => togglePlayback(podcast.id)}
                  size="sm" 
                  variant="outline"
                  disabled={podcast.status === 'Processing'}
                >
                  {podcast.isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button 
                  onClick={() => openPodcast(podcast.id)}
                  size="sm" 
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button 
                  onClick={() => openPodcast(podcast.id)}
                  size="sm" 
                  variant="outline"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  disabled={podcast.status !== 'Ready'}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {podcasts.length === 0 && (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No podcasts yet.</p>
            <Button onClick={generateNewPodcast} className="mt-2" variant="outline">
              Generate your first podcast
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
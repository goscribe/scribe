"use client";

import { useState } from "react";
import { 
  Play, 
  Pause, 
  Download, 
  Calendar, 
  Clock, 
  Volume2, 
  Share2, 
  Edit3,
  ArrowLeft,
  Bookmark,
  BookmarkPlus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";

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
  audioUrl?: string;
  topics: string[];
  speaker: string;
}

export default function PodcastDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;
  const podcastId = params.podcastId as string;

  // Mock data - in a real app, this would come from tRPC
  const [podcast, setPodcast] = useState<Podcast>({
    id: podcastId,
    title: 'Calculus Fundamentals: Derivatives and Applications',
    description: 'A comprehensive introduction to derivatives, their geometric interpretation, and practical applications in physics and engineering.',
    duration: '15:30',
    dateCreated: '2024-01-15',
    isPlaying: false,
    progress: 65,
    transcript: `Welcome to today's podcast on Calculus Fundamentals. I'm Dr. Sarah Chen, and today we'll be exploring one of the most important concepts in calculus: derivatives.

Let's start with the basic definition. A derivative represents the rate of change of a function at any given point. Think of it as the slope of the tangent line to the curve at that specific point. This might sound abstract, but it has incredibly practical applications.

For example, if you're driving a car, your speed is the derivative of your position with respect to time. When you accelerate, you're changing your speed, which is the derivative of your position. This is why calculus is so fundamental to physics and engineering.

Let's look at a simple example. Consider the function f(x) = x². To find its derivative, we use the power rule: the derivative of x^n is n*x^(n-1). So the derivative of x² is 2x.

What does this mean? Well, at any point x, the slope of the tangent line to the parabola y = x² is 2x. At x = 0, the slope is 0, which makes sense because that's the vertex of the parabola. At x = 1, the slope is 2, and at x = -1, the slope is -2.

Now, let's talk about some applications. In physics, derivatives are used to describe motion. Velocity is the derivative of position, and acceleration is the derivative of velocity. This gives us powerful tools to analyze how objects move.

In economics, derivatives help us understand marginal cost and marginal revenue. The derivative of a cost function tells us how much the cost changes when we produce one more unit. This is crucial for business decisions.

In biology, derivatives model population growth rates. The derivative of a population function tells us how fast the population is growing or shrinking at any given time.

One of the most beautiful applications is in optimization. When we want to find the maximum or minimum of a function, we look for points where the derivative is zero. These are called critical points, and they often represent the optimal solutions to real-world problems.

For instance, if you're designing a box with a fixed volume and want to minimize the surface area, calculus helps you find the optimal dimensions. This kind of optimization is used in everything from engineering design to economics.

Let's also discuss the geometric interpretation. The derivative at a point gives us the slope of the tangent line. This tangent line is the best linear approximation to the function near that point. This is why derivatives are so useful for approximation and numerical methods.

In computer graphics, derivatives are used for shading and lighting calculations. They help determine how light reflects off curved surfaces, creating realistic 3D images.

The concept of derivatives also leads us to differential equations, which model how systems change over time. These are fundamental in modeling everything from weather patterns to the spread of diseases.

As we wrap up, remember that derivatives are not just abstract mathematical concepts. They're powerful tools that help us understand and model the world around us. Whether you're studying physics, engineering, economics, or any other field, derivatives will be essential.

In our next episode, we'll explore integration, which is essentially the reverse process of differentiation. We'll see how these two operations are connected by the fundamental theorem of calculus.

Thank you for listening to today's podcast on Calculus Fundamentals. I'm Dr. Sarah Chen, and I hope you found this introduction to derivatives helpful. Don't forget to subscribe for more mathematical insights, and feel free to reach out with any questions.`,
    status: 'Ready',
    topics: ['Calculus', 'Derivatives', 'Mathematics', 'Physics', 'Engineering'],
    speaker: 'Dr. Sarah Chen'
  });

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);

  const togglePlayback = () => {
    setPodcast(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleProgressChange = (newProgress: number) => {
    setPodcast(prev => ({ ...prev, progress: newProgress }));
    setCurrentTime((newProgress / 100) * 15.5); // Convert percentage to minutes
  };

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'Processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const goBack = () => {
    router.push(`/workspace/${workspaceId}/podcasts`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={goBack} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Podcasts
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{podcast.title}</h1>
            <p className="text-sm text-muted-foreground">by {podcast.speaker}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsBookmarked(!isBookmarked)}
            variant="outline"
            size="sm"
          >
            {isBookmarked ? (
              <Bookmark className="h-4 w-4" />
            ) : (
              <BookmarkPlus className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Audio Player Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Audio Player</span>
                <Badge variant="outline" className={getStatusColor(podcast.status)}>
                  {podcast.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{formatTime(currentTime)}</span>
                  <span>{podcast.duration}</span>
                </div>
                <Progress 
                  value={podcast.progress} 
                  className="h-2 cursor-pointer"
                  onValueChange={handleProgressChange}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={togglePlayback}
                    size="lg"
                    className="rounded-full w-12 h-12 p-0"
                  >
                    {podcast.isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-20"
                    />
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transcript Card */}
          <Card>
            <CardHeader>
              <CardTitle>Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {podcast.transcript}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Podcast Info */}
          <Card>
            <CardHeader>
              <CardTitle>Podcast Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {podcast.description}
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Duration: {podcast.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Created: {new Date(podcast.dateCreated).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Speaker:</span>
                  <span>{podcast.speaker}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2">Topics</h4>
                <div className="flex flex-wrap gap-1">
                  {podcast.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Generate Flashcards
              </Button>
              <Button className="w-full" variant="outline">
                Create Study Guide
              </Button>
              <Button className="w-full" variant="outline">
                Export Transcript
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

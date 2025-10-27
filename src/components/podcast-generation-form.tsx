"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Loader2, Mic, Volume2, Lightbulb } from "lucide-react";

export interface PodcastGenerationForm {
  title: string;
  description?: string;
  userPrompt: string;
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  speed: number;
  generateIntro: boolean;
  generateOutro: boolean;
  segmentByTopics: boolean;
}

interface PodcastGenerationFormProps {
  onSubmit: (data: PodcastGenerationForm) => void;
  isLoading?: boolean;
  defaultValues?: Partial<PodcastGenerationForm>;
}

const VOICE_OPTIONS = [
  { value: 'alloy', label: 'Alloy', description: 'Balanced and versatile' },
  { value: 'echo', label: 'Echo', description: 'Clear and professional' },
  { value: 'fable', label: 'Fable', description: 'Warm and engaging' },
  { value: 'onyx', label: 'Onyx', description: 'Deep and authoritative' },
  { value: 'nova', label: 'Nova', description: 'Bright and energetic' },
  { value: 'shimmer', label: 'Shimmer', description: 'Smooth and melodic' },
];

const PROMPT_EXAMPLES = [
  "Create a podcast about the history of artificial intelligence",
  "Explain quantum computing in simple terms for beginners",
  "Discuss the impact of social media on mental health",
  "Create a podcast episode about sustainable living practices",
  "Explain the basics of machine learning for non-technical audiences",
  "Discuss the future of renewable energy and its challenges",
];

export function PodcastGenerationForm({ onSubmit, isLoading = false, defaultValues }: PodcastGenerationFormProps) {
  const [formData, setFormData] = useState<PodcastGenerationForm>({
    title: defaultValues?.title || '',
    description: defaultValues?.description || '',
    userPrompt: defaultValues?.userPrompt || '',
    voice: defaultValues?.voice || 'nova',
    speed: defaultValues?.speed || 1.0,
    generateIntro: defaultValues?.generateIntro ?? true,
    generateOutro: defaultValues?.generateOutro ?? true,
    segmentByTopics: defaultValues?.segmentByTopics ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showExamples, setShowExamples] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.userPrompt.trim()) {
      newErrors.userPrompt = 'User prompt is required';
    }

    if (formData.userPrompt.length < 20) {
      newErrors.userPrompt = 'User prompt must be at least 20 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const updateField = (field: keyof PodcastGenerationForm, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const insertExample = (example: string) => {
    setFormData(prev => ({ ...prev, userPrompt: example }));
    setShowExamples(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Enter podcast title..."
              className={errors.title ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Brief description of the podcast..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* User Prompt */}
          <div className="space-y-2">
            <Label htmlFor="userPrompt" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              What would you like the podcast to be about? <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-2">
              <Textarea
                id="userPrompt"
                value={formData.userPrompt}
                onChange={(e) => updateField('userPrompt', e.target.value)}
                placeholder="Describe the topic, questions, or content you want the podcast to cover..."
                rows={6}
                className={errors.userPrompt ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {formData.userPrompt.length} characters
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExamples(!showExamples)}
                  disabled={isLoading}
                >
                  {showExamples ? 'Hide' : 'Show'} Examples
                </Button>
              </div>
              {errors.userPrompt && (
                <p className="text-sm text-red-500">{errors.userPrompt}</p>
              )}
            </div>

            {/* Prompt Examples */}
            {showExamples && (
              <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Example prompts:</p>
                <div className="space-y-2">
                  {PROMPT_EXAMPLES.map((example, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => insertExample(example)}
                      className="block w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                      disabled={isLoading}
                    >
                      "{example}"
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Voice Selection */}
          <div className="space-y-2">
            <Label htmlFor="voice">Voice</Label>
            <Select
              value={formData.voice}
              onValueChange={(value) => updateField('voice', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VOICE_OPTIONS.map((voice) => (
                  <SelectItem key={voice.value} value={voice.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{voice.label}</span>
                      <span className="text-sm text-muted-foreground">{voice.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Speed Control */}
          <div className="space-y-2">
            <Label htmlFor="speed" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Speed: {formData.speed}x
            </Label>
            <Slider
              id="speed"
              min={0.25}
              max={4.0}
              step={0.25}
              value={[formData.speed]}
              onValueChange={([value]) => updateField('speed', value)}
              disabled={isLoading}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.25x</span>
              <span>1.0x</span>
              <span>2.0x</span>
              <span>4.0x</span>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="generateIntro">Generate Introduction</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically create an engaging intro for your podcast
                </p>
              </div>
              <Switch
                id="generateIntro"
                checked={formData.generateIntro}
                onCheckedChange={(checked) => updateField('generateIntro', checked)}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="generateOutro">Generate Conclusion</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically create a conclusion and call-to-action
                </p>
              </div>
              <Switch
                id="generateOutro"
                checked={formData.generateOutro}
                onCheckedChange={(checked) => updateField('generateOutro', checked)}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="segmentByTopics">Segment by Topics</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically break content into logical segments
                </p>
              </div>
              <Switch
                id="segmentByTopics"
                checked={formData.segmentByTopics}
                onCheckedChange={(checked) => updateField('segmentByTopics', checked)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Podcast...
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Generate Podcast
              </>
            )}
          </Button>
    </form>
  );
}

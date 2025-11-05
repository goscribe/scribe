"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Mic, Lightbulb, Plus, X, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

export type VoiceType = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export interface Speaker {
  id: string;
  name: string;
  voice: VoiceType;
  role?: string;
}

export interface PodcastGenerationForm {
  title: string;
  description?: string;
  userPrompt: string;
  speakers: Speaker[];
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
    speakers: defaultValues?.speakers || [
      { id: '1', name: 'Host', voice: 'nova', role: 'Main Host' },
      { id: '2', name: 'Guest', voice: 'alloy', role: 'Expert Guest' }
    ],
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

    if (formData.userPrompt.trim().length < 2) {
      newErrors.userPrompt = 'User prompt must be at least 2 characters';
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

  const addSpeaker = () => {
    const newSpeaker: Speaker = {
      id: Date.now().toString(),
      name: `Speaker ${formData.speakers.length + 1}`,
      voice: 'echo',
      role: ''
    };
    setFormData(prev => ({
      ...prev,
      speakers: [...prev.speakers, newSpeaker]
    }));
  };

  const removeSpeaker = (id: string) => {
    if (formData.speakers.length > 2) {
      setFormData(prev => ({
        ...prev,
        speakers: prev.speakers.filter(s => s.id !== id)
      }));
    }
  };

  const updateSpeaker = (id: string, field: keyof Speaker, value: string) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.map(s => 
        s.id === id ? { ...s, [field]: value } : s
      )
    }));
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

          {/* Speakers Configuration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Speakers ({formData.speakers.length})
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSpeaker}
                disabled={isLoading || formData.speakers.length >= 6}
                className="text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Speaker
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.speakers.map((speaker, index) => (
                <Card key={speaker.id} className="p-4 border border-border/50">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor={`name-${speaker.id}`} className="text-xs">Name</Label>
                          <Input
                            id={`name-${speaker.id}`}
                            value={speaker.name}
                            onChange={(e) => updateSpeaker(speaker.id, 'name', e.target.value)}
                            placeholder="Speaker name..."
                            className="h-8 text-sm"
                            disabled={isLoading}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor={`role-${speaker.id}`} className="text-xs">Role (Optional)</Label>
                          <Input
                            id={`role-${speaker.id}`}
                            value={speaker.role || ''}
                            onChange={(e) => updateSpeaker(speaker.id, 'role', e.target.value)}
                            placeholder="e.g., Host, Expert, Guest..."
                            className="h-8 text-sm"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      
                      {formData.speakers.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSpeaker(speaker.id)}
                          disabled={isLoading}
                          className="h-8 w-8 p-0 ml-2"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor={`voice-${speaker.id}`} className="text-xs">Voice</Label>
                      <Select
                        value={speaker.voice}
                        onValueChange={(value) => updateSpeaker(speaker.id, 'voice', value as VoiceType)}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {VOICE_OPTIONS.map((voice) => (
                            <SelectItem key={voice.value} value={voice.value}>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{voice.label}</span>
                                <span className="text-xs text-muted-foreground">- {voice.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <p className="text-xs text-muted-foreground">
              Create a conversational podcast with multiple speakers. Each speaker will have their own voice and perspective.
            </p>
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

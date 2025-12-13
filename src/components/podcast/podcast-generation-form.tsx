"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Loader2, 
  Lightbulb, 
  Plus, 
  X, 
  Users,
  ChevronDown,
  Mic,
  User,
  Brain
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export type SpeakerRole = 'host' | 'guest' | 'expert';

export interface Speaker {
  id: string; // This IS the ElevenLabs voice ID
  role: SpeakerRole;
  name?: string;
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

const ROLE_OPTIONS = [
  { value: 'host', label: 'Host', icon: <Mic className="h-4 w-4" /> },
  { value: 'guest', label: 'Guest', icon: <User className="h-4 w-4" /> },
  { value: 'expert', label: 'Expert', icon: <Brain className="h-4 w-4" /> },
];

// ElevenLabs Voice IDs - Popular voices
const ELEVENLABS_VOICES = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Calm & warm', gender: 'F', image: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=rachel' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', description: 'Strong & confident', gender: 'F', image: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=domi' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Soft & friendly', gender: 'F', image: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=bella' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', description: 'Well-rounded', gender: 'M', image: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=antoni' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', description: 'Young & energetic', gender: 'F', image: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=elli' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', description: 'Deep & narrative', gender: 'M', image: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=josh' },
  { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', description: 'Crisp & mature', gender: 'M', image: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=arnold' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'Professional', gender: 'M', image: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=adam' },
  { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', description: 'Young & casual', gender: 'M', image: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=sam' },
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
      { role: 'host', name: 'Rachel', id: '21m00Tcm4TlvDq8ikWAM' },
      { role: 'guest', name: 'Josh', id: 'TxGEqnHWrfWFTfGW9XjX' }
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

    if (formData.speakers.length === 0) {
      newErrors.speakers = 'At least one speaker is required';
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

  const addSpeaker = (voice: typeof ELEVENLABS_VOICES[0]) => {
    // Check if this voice is already in use
    if (formData.speakers.some(s => s.id === voice.id)) {
      return; // Don't add duplicate voices
    }
    
    const newSpeaker: Speaker = {
      id: voice.id, // Use the ElevenLabs voice ID as the speaker ID
      role: 'guest',
      name: voice.name
    };
    setFormData(prev => ({
      ...prev,
      speakers: [...prev.speakers, newSpeaker]
    }));
  };

  const removeSpeaker = (id: string) => {
    if (formData.speakers.length > 1) {
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
          disabled={isLoading}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-muted-foreground text-xs">(Optional)</span>
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Brief description of your podcast..."
          rows={2}
          disabled={isLoading}
          className="resize-none"
        />
      </div>

      {/* User Prompt */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="prompt">
            Topic/Prompt <span className="text-red-500">*</span>
          </Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowExamples(!showExamples)}
            className="text-xs h-7"
          >
            <Lightbulb className="h-3 w-3 mr-1" />
            Examples
          </Button>
        </div>
        <Textarea
          id="prompt"
          value={formData.userPrompt}
          onChange={(e) => updateField('userPrompt', e.target.value)}
          placeholder="What should the podcast be about? Be specific..."
          rows={3}
          disabled={isLoading}
          className="resize-none"
        />
        {errors.userPrompt && (
          <p className="text-xs text-destructive">{errors.userPrompt}</p>
        )}
        
        {showExamples && (
          <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs font-medium text-muted-foreground">Click to use:</p>
            <div className="space-y-1">
              {PROMPT_EXAMPLES.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => insertExample(example)}
                  className="text-xs text-left p-2 hover:bg-background rounded transition-colors w-full"
                  disabled={isLoading}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Simplified Speakers Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Speakers ({formData.speakers.length})
          </Label>
          
          {/* Simple dropdown to add speakers */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isLoading || formData.speakers.length >= 6}
                className="h-8"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Speaker
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              {ELEVENLABS_VOICES.map((voice) => (
                <DropdownMenuItem
                  key={voice.id}
                  onClick={() => addSpeaker(voice)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Image src={voice.image} alt={voice.name} width={20} height={20} unoptimized />
                    <span className="font-medium">{voice.name}</span>
                    <span className="text-xs font-mono bg-muted px-1 rounded">
                      {voice.gender}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {voice.description}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Clean speaker list */}
        <div className="space-y-2">
          {formData.speakers.map((speaker) => {
            const voice = ELEVENLABS_VOICES.find(v => v.id === speaker.id);
            const roleOption = ROLE_OPTIONS.find(r => r.value === speaker.role);
            
            return (
              <div key={speaker.id} className="flex items-center gap-2 p-2 rounded-lg border bg-card">

                {/* Voice display */}
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Image src={voice?.image || ''} alt={voice?.name || ''} width={20} height={20} unoptimized />
                    <span className="text-sm font-medium">{speaker.name || voice?.name || 'Unknown Voice'}</span>
                    {voice && (
                      <span className="text-xs text-muted-foreground">
                        ({voice.description})
                      </span>
                    )}
                  </div>
                </div>
                <Select
                  value={speaker.role}
                  onValueChange={(value) => updateSpeaker(speaker.id, 'role', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[110px] h-8">
                    <SelectValue>
                      {roleOption && (
                        <span className="flex items-center gap-1">
                          <span>{roleOption.icon}</span>
                          <span className="text-sm">{roleOption.label}</span>
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <span className="flex items-center gap-2">
                          <span>{role.icon}</span>
                          <span>{role.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                
                {/* Remove button */}
                {formData.speakers.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSpeaker(speaker.id)}
                    disabled={isLoading}
                    className="h-7 w-7 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
        
        {errors.speakers && (
          <p className="text-xs text-destructive">{errors.speakers}</p>
        )}
        
        <p className="text-xs text-muted-foreground">
          Add up to 6 speakers with different voices to create a conversational podcast.
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
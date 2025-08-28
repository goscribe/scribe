# Podcast Frontend Integration Documentation

## Overview

This document describes the complete frontend integration for the podcast functionality, including real-time updates via Pusher, UI components, and user interactions. The implementation follows the specification provided and provides a modern, accessible, and performant user experience.

## Architecture

### Components Structure

```
src/
├── components/
│   ├── podcast-generation-form.tsx      # Podcast creation form
│   ├── podcast-player.tsx               # Audio player with segments
│   ├── segment-editor.tsx               # Segment editing interface
│   └── podcast-generation-progress.tsx  # Real-time progress overlay
├── hooks/
│   └── use-pusher-podcast.ts           # Pusher event handling
└── app/workspace/[id]/podcasts/
    ├── page.tsx                        # Podcast list view
    └── [podcastId]/page.tsx            # Podcast detail view
```

## Audio Joining Functionality

The podcast system now generates both individual segment audio files and a complete joined episode audio file:

### Individual Segments
- Each segment is generated as a separate audio file
- Useful for segment-by-segment playback and editing
- Allows users to jump to specific parts of the episode

### Full Episode Audio
- All segments are joined into a single continuous audio file
- Provides a seamless listening experience
- Useful for traditional podcast playback
- Stored as a separate file with its own signed URL

### Audio Joining Process
1. After all individual segments are generated
2. Audio buffers are concatenated in the correct order
3. The joined audio is uploaded to cloud storage
4. A signed URL is generated for the full episode
5. Both individual segments and full episode remain available

## Components

### 1. PodcastGenerationForm

A comprehensive form component for creating new podcasts with the following features:

- **Required Fields**: Title, User Prompt
- **Optional Fields**: Description, Voice selection, Speed control
- **Options**: Generate intro/outro, Segment by topics
- **Validation**: Real-time form validation with error messages
- **Accessibility**: Proper labels, ARIA attributes, keyboard navigation
- **Prompt Examples**: Built-in examples to help users get started

```typescript
interface PodcastGenerationForm {
  title: string;
  description?: string;
  userPrompt: string;
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  speed: number; // 0.25 - 4.0
  generateIntro: boolean;
  generateOutro: boolean;
  segmentByTopics: boolean;
}
```

**User Prompt Field:**
The `userPrompt` field is the primary input for podcast generation. Users provide a prompt describing:
- The topic they want the podcast to cover
- Specific questions they want answered
- The type of content they're looking for
- Any particular angle or perspective they want

Examples of user prompts:
- "Create a podcast about the history of artificial intelligence"
- "Explain quantum computing in simple terms for beginners"
- "Discuss the impact of social media on mental health"
- "Create a podcast episode about sustainable living practices"

The AI will use this prompt to generate complete podcast content, including all segments, scripts, and structure.

**Usage:**
```tsx
<PodcastGenerationForm
  onSubmit={handleGeneratePodcast}
  isLoading={isGenerating}
  defaultValues={defaultFormData}
/>
```

### 2. PodcastPlayer

A sophisticated audio player component with segment navigation and full episode support:

- **Dual Playback Modes**: Toggle between individual segments and full episode
- **Audio Controls**: Play/pause, skip forward/backward, volume control
- **Segment Navigation**: Click to jump to specific segments
- **Progress Tracking**: Visual progress bar with time display
- **Error Handling**: Automatic URL refresh on audio errors
- **Accessibility**: Keyboard controls, screen reader support

```typescript
interface PodcastPlayerProps {
  segments: PodcastSegment[];
  totalDuration: number;
  fullEpisodeUrl?: string; // URL for the complete joined episode
  onSegmentChange?: (segmentId: string) => void;
  onPlayPause?: () => void;
  onSeek?: (time: number) => void;
  isLoading?: boolean;
  className?: string;
}
```

**Playback Modes:**
- **Segments Mode**: Play individual segments with automatic switching
- **Full Episode Mode**: Play the complete joined episode with segment highlighting

**Usage:**
```tsx
<PodcastPlayer
  segments={podcastSegments}
  totalDuration={episode.metadata.totalDuration}
  fullEpisodeUrl={fullEpisodeUrlData?.fullEpisodeUrl}
  onSegmentChange={handleSegmentChange}
  isLoading={!signedUrlsData}
/>
```

### 3. SegmentEditor

An inline editor for podcast segments with regeneration capabilities:

- **Inline Editing**: Edit title, content, and key points
- **Key Points Management**: Add/remove key points dynamically
- **Regeneration**: Regenerate individual segments
- **Real-time Updates**: Show regeneration progress
- **Validation**: Form validation with error handling

```typescript
interface SegmentEditorProps {
  segment: PodcastSegment;
  onSave: (segment: Partial<PodcastSegment>) => void;
  onRegenerate: (newContent?: string) => void;
  onCancel?: () => void;
  isRegenerating?: boolean;
  isSaving?: boolean;
}
```

**Usage:**
```tsx
<SegmentEditor
  segment={segment}
  onSave={handleSegmentSave}
  onRegenerate={handleSegmentRegenerate}
  isRegenerating={pusherState.regeneratingSegments[segment.id]}
/>
```

### 4. PodcastGenerationProgress

A real-time progress overlay that displays generation status:

- **Stage Tracking**: Shows current generation stage including audio joining
- **Progress Bar**: Visual progress indicator
- **Error Handling**: Displays errors with retry options
- **Minimizable**: Can be minimized to avoid blocking UI
- **Auto-dismiss**: Automatically hides on completion

```typescript
interface GenerationProgress {
  stage: 'structuring' | 'generating_audio' | 'creating_summary' | 'complete';
  currentSegment?: number;
  totalSegments?: number;
  progress: number; // 0-100
  currentStep: string;
  errors: string[];
}
```

**Generation Stages:**
1. **Structuring**: Content analysis and segment creation
2. **Generating Audio**: Individual segment audio generation + joining
3. **Creating Summary**: Learning objectives and key concepts
4. **Complete**: Ready for playback

**Usage:**
```tsx
<PodcastGenerationProgress
  isVisible={showProgress}
  progress={pusherState.progress}
  onClose={handleCloseProgress}
  onRetry={handleRetryGeneration}
/>
```

## Real-Time Events (Pusher)

### Event Channel
All podcast events are broadcast on: `workspace_{workspaceId}`

### Event Types

#### Generation Events
- `{workspaceId}_podcast_generation_start` - Generation begins
- `{workspaceId}_podcast_structure_complete` - Content structuring complete
- `{workspaceId}_podcast_audio_generation_start` - Audio generation begins
- `{workspaceId}_podcast_segment_progress` - Individual segment progress
- `{workspaceId}_podcast_audio_generation_complete` - Audio generation complete
- `{workspaceId}_podcast_audio_joining_start` - Audio joining begins
- `{workspaceId}_podcast_audio_joining_complete` - Audio joining complete
- `{workspaceId}_podcast_audio_joining_error` - Audio joining error
- `{workspaceId}_podcast_summary_complete` - Summary generation complete
- `{workspaceId}_podcast_ended` - Generation complete

#### Segment Events
- `{workspaceId}_podcast_segment_regeneration_start` - Segment regeneration begins
- `{workspaceId}_podcast_segment_regeneration_complete` - Segment regeneration complete

#### Deletion Events
- `{workspaceId}_podcast_deletion_start` - Episode deletion begins
- `{workspaceId}_podcast_deletion_complete` - Episode deletion complete

#### Error Events
- `{workspaceId}_podcast_error` - General podcast error
- `{workspaceId}_podcast_segment_error` - Segment-specific error
- `{workspaceId}_podcast_summary_error` - Summary generation error

### Hook: usePusherPodcast

A custom hook that manages all Pusher events for podcast functionality:

```typescript
const { state, resetState, clearErrors } = usePusherPodcast(workspaceId);

// State includes:
interface PodcastPusherState {
  isGenerating: boolean;
  progress: GenerationProgress;
  regeneratingSegments: Record<string, boolean>;
  deletingEpisodes: Record<string, boolean>;
  errors: string[];
}
```

## Pages

### 1. Podcast List Page (`/workspace/[id]/podcasts`)

Features:
- **Episode Grid**: Display all podcasts with metadata
- **Generation Form**: Modal dialog for creating new podcasts
- **Real-time Progress**: Overlay showing generation progress
- **Episode Management**: View, edit, delete episodes
- **Empty State**: Helpful empty state with call-to-action

### 2. Podcast Detail Page (`/workspace/[id]/podcasts/[podcastId]`)

Features:
- **Audio Player**: Full-featured podcast player with dual modes
- **Content Tabs**: Segments, Transcript, Summary views
- **Segment Editing**: Inline editing of individual segments
- **Episode Information**: Metadata and summary display
- **Quick Actions**: Generate flashcards, study guides, etc.

## API Integration

### TRPC Endpoints Used

```typescript
// Queries
trpc.podcast.listEpisodes.useQuery({ workspaceId })
trpc.podcast.getEpisode.useQuery({ episodeId })
trpc.podcast.getSignedUrls.useQuery({ episodeId })
trpc.podcast.getFullEpisodeUrl.useQuery({ episodeId }) // New

// Mutations
trpc.podcast.generateEpisode.useMutation()
trpc.podcast.deleteEpisode.useMutation()
trpc.podcast.updateEpisode.useMutation()
```

### Data Flow

1. **Generation**: Form submission → TRPC mutation → Pusher events → Progress updates
2. **Playback**: Episode load → Signed URL fetch → Audio player initialization
3. **Editing**: Segment edit → Save → Real-time updates
4. **Deletion**: Delete confirmation → TRPC mutation → Navigation

## User Experience Flow

### 1. Podcast Generation
1. User clicks "Generate Podcast" button
2. Modal opens with generation form
3. User fills form with:
   - Title for the podcast
   - User prompt describing the topic, question, or request
   - Optional description
   - Voice and speed preferences
   - Generation options (intro, outro, segmentation)
4. User submits form → modal closes, progress overlay appears
5. Real-time updates show generation progress:
   - Structure complete
   - Audio generation (individual segments)
   - Audio joining (full episode)
   - Summary generation
6. On completion, user is redirected to new podcast

### 2. Podcast Playback
1. User navigates to podcast detail page
2. Episode data and signed URLs are fetched (segments + full episode)
3. Audio player initializes with both playback modes
4. User can toggle between segments and full episode
5. Progress is tracked and displayed

### 3. Segment Management
1. User clicks "Edit" on a segment
2. Inline editor opens with current content
3. User makes changes and saves
4. Changes are persisted to backend
5. Real-time updates reflect changes

## Error Handling

### Generation Errors
- Displayed in progress overlay
- Retry functionality provided
- Clear error messages with context
- Audio joining errors handled separately

### Audio Loading Errors
- Automatic URL refresh on expired URLs
- Fallback handling for failed segments
- User-friendly error messages
- Full episode fallback to segments

### Network Errors
- Retry logic for failed requests
- Offline indicators when appropriate
- Graceful degradation of functionality

## Accessibility Features

### Audio Controls
- Keyboard navigation (space for play/pause, arrow keys for seek)
- Screen reader support for progress and controls
- Volume controls with proper labels
- Playback mode toggle accessibility

### Form Accessibility
- Proper form labels and associations
- Required field indicators
- Error message associations
- Keyboard navigation support

### Navigation
- Skip links for main content
- Focus management during modal interactions
- ARIA labels for interactive elements

## Performance Considerations

### Audio Loading
- Lazy loading of audio segments
- Preloading of next segment
- Audio caching for better performance
- Full episode streaming support

### Real-time Updates
- Debounced UI updates to prevent excessive re-renders
- Batched state updates for better performance
- Optimized event handling

### Data Management
- Efficient caching of episode metadata
- Optimized image and audio loading
- Pagination support for large episode lists

## Browser Support

### Required Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Audio Support
- Web Audio API
- Media Source Extensions (for streaming)
- AudioContext support

## Security Considerations

### Audio URLs
- Signed URLs with 24-hour expiration
- Automatic URL refresh logic
- Secure handling of expired URLs
- Separate URLs for segments and full episode

### User Permissions
- Workspace ownership verification
- Episode access validation
- Input sanitization

### Content Security
- Audio file type validation
- File size limits
- Metadata sanitization

## Testing

### Unit Tests
- Component rendering tests
- Event handling tests
- Form validation tests
- Audio player mode switching tests

### Integration Tests
- API interaction tests
- Real-time event handling tests
- Audio playback tests
- Full episode vs segments tests

### E2E Tests
- Complete podcast generation flow
- Playback functionality tests
- Error scenario tests
- Audio joining process tests

## Future Enhancements

### Planned Features
- **Offline Support**: Download podcasts for offline listening
- **Playlists**: Create and manage podcast playlists
- **Analytics**: Track listening progress and engagement
- **Sharing**: Share podcasts with other users
- **Collaboration**: Multi-user podcast editing

### Performance Improvements
- **Streaming**: Implement audio streaming for large files
- **Caching**: Advanced caching strategies
- **Compression**: Audio compression for faster loading

## Troubleshooting

### Common Issues

1. **Audio not playing**
   - Check signed URL expiration
   - Verify audio file format support
   - Check browser audio permissions
   - Try switching between segments and full episode

2. **Real-time updates not working**
   - Verify Pusher configuration
   - Check network connectivity
   - Ensure workspace ID is correct

3. **Generation stuck**
   - Check for error messages in progress overlay
   - Verify backend service status
   - Try refreshing the page

4. **Audio joining errors**
   - Check for audio joining error messages
   - Verify segment audio files are complete
   - Retry generation if needed

### Debug Information

Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'podcast:*');
```

This will log all podcast-related events and state changes to the console.

## Contributing

When contributing to the podcast frontend integration:

1. Follow the existing component patterns
2. Ensure accessibility compliance
3. Add appropriate error handling
4. Include unit tests for new functionality
5. Update this documentation for new features

## Support

For issues or questions about the podcast frontend integration:

1. Check the troubleshooting section
2. Review the browser console for errors
3. Verify Pusher configuration
4. Contact the development team

---

This implementation provides a complete, production-ready podcast frontend integration that follows modern web development best practices and provides an excellent user experience with both individual segment and full episode playback capabilities.

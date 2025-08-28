# Pusher Integration Setup

This document explains how to set up and use the Pusher real-time integration for AI analysis progress tracking.

## Overview

The Pusher integration provides real-time progress updates during AI analysis of uploaded files. It shows users exactly what's happening during the analysis process, including:

- File analysis progress
- Study guide generation
- Flashcard creation
- Worksheet generation
- Cleanup processes
- Error handling

## Setup

### 1. Environment Variables

Add the following to your `.env.local` file:

```bash
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key-here
NEXT_PUBLIC_PUSHER_CLUSTER=us2
```

You can get these values from your [Pusher dashboard](https://dashboard.pusher.com/).

### 2. Backend Integration

Your backend needs to emit Pusher events during the AI analysis process. The events should follow this naming convention:

- Channel: `workspace_{workspaceId}`
- Events: `{workspaceId}_{eventName}`

Example:
```typescript
// Channel: workspace_cmesjxwhz0002ry9ozjg0gpvn
// Event: cmesjxwhz0002ry9ozjg0gpvn_file_analysis_start
```

## Event Types

### File Analysis Events
- `{workspaceId}_file_analysis_start` - When file analysis begins
- `{workspaceId}_file_analysis_complete` - When file analysis completes

### Study Guide Events
- `{workspaceId}_study_guide_load_start` - When study guide generation begins
- `{workspaceId}_study_guide_info` - When study guide content is generated
- `{workspaceId}_studyguide_ended` - When study guide is fully created

### Flashcard Events
- `{workspaceId}_flash_card_load_start` - When flashcard generation begins
- `{workspaceId}_flash_card_info` - When flashcard content is generated
- `{workspaceId}_flashcard_ended` - When flashcards are fully created

### Worksheet Events
- `{workspaceId}_worksheet_load_start` - When worksheet generation begins
- `{workspaceId}_worksheet_info` - When worksheet content is generated
- `{workspaceId}_worksheet_ended` - When worksheet is fully created

### Cleanup Events
- `{workspaceId}_analysis_cleanup_start` - When cleanup begins
- `{workspaceId}_analysis_cleanup_complete` - When cleanup finishes

### Completion Events
- `{workspaceId}_analysis_ended` - When entire process finishes

### Error Events
- `{workspaceId}_analysis_error` - When general errors occur
- `{workspaceId}_{type}_error` - When specific error types occur

## Frontend Usage

### Using the Hook

```typescript
import { usePusherAnalysis } from '@/hooks/use-pusher-analysis';

function MyComponent({ workspaceId }: { workspaceId: string }) {
  const { loadingState, showOverlay, resetState, hideOverlay } = usePusherAnalysis(workspaceId);

  return (
    <div>
      {/* Your component content */}
      
      {/* Show loading overlay when analysis is in progress */}
      {showOverlay && (
        <AnalysisLoadingOverlay
          isVisible={showOverlay}
          loadingState={loadingState}
          onClose={hideOverlay}
        />
      )}
    </div>
  );
}
```

### Loading State Structure

```typescript
interface AnalysisLoadingState {
  isAnalyzing: boolean;
  currentStep: string;
  progress: {
    fileAnalysis: boolean;
    studyGuide: boolean;
    flashcards: boolean;
    worksheet: boolean;
    cleanup: boolean;
  };
  errors: string[];
  completedArtifacts: {
    studyGuide?: any;
    flashcards?: any;
    worksheet?: any;
  };
}
```

## Components

### AnalysisLoadingOverlay

A full-screen overlay that shows real-time progress during analysis.

```typescript
<AnalysisLoadingOverlay
  isVisible={showOverlay}
  loadingState={loadingState}
  onClose={hideOverlay}
/>
```

### AnalysisNotification

A notification that appears when analysis completes or encounters errors.

```typescript
<AnalysisNotification
  loadingState={loadingState}
  onClose={hideOverlay}
/>
```

## Testing

In development mode, a test panel is available that allows you to simulate Pusher events. This helps with testing the UI without needing the backend to emit real events.

The test panel appears as a button in the bottom-left corner of the workspace.

## Backend Implementation Example

Here's how your backend might emit these events:

```typescript
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true
});

// During file analysis
await pusher.trigger(
  `workspace_${workspaceId}`,
  `${workspaceId}_file_analysis_start`,
  { filename: 'document.pdf', fileType: 'pdf' }
);

// When study guide generation starts
await pusher.trigger(
  `workspace_${workspaceId}`,
  `${workspaceId}_study_guide_load_start`,
  { filename: 'document.pdf' }
);

// When analysis completes
await pusher.trigger(
  `workspace_${workspaceId}`,
  `${workspaceId}_analysis_ended`,
  {
    filename: 'document.pdf',
    artifacts: {
      studyGuide: { /* study guide data */ },
      flashcards: { /* flashcard data */ },
      worksheet: { /* worksheet data */ }
    },
    timestamp: new Date().toISOString()
  }
);
```

## Troubleshooting

### Common Issues

1. **Events not showing up**: Check that your Pusher key and cluster are correct
2. **Channel not connecting**: Verify the workspace ID is valid
3. **Events not triggering**: Ensure your backend is emitting events with the correct channel and event names

### Debug Mode

Enable debug logging by checking the browser console. All Pusher events are logged with their data.

### Test Panel

Use the test panel in development mode to verify the frontend is working correctly before integrating with your backend.

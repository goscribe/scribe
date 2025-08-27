# Study Guide Component

## Overview
The Study Guide component provides a rich text editor for creating and managing study notes within each workspace. It uses EditorJS for the rich text editing experience and includes a comprehensive toolbar.

## Features

### ✨ **Rich Text Editor**
- **Headers**: Multiple heading levels (H1-H6)
- **Lists**: Bullet and numbered lists
- **Quotes**: Blockquote support with author attribution
- **Code Blocks**: Syntax highlighting for code
- **Links**: URL embedding and preview
- **Images**: File upload and URL embedding
- **Auto-save**: Automatic saving of content

### 🛠️ **Toolbar Features**
- **Text Formatting**: Bold, italic, underline
- **Block Elements**: Headers, lists, quotes, code blocks
- **Media**: Links and images
- **Export**: Download as JSON
- **Share**: Copy link to clipboard

### 💾 **Data Management**
- **Single Guide per Workspace**: Each workspace has one study guide
- **Real-time Editing**: Edit mode with save/cancel functionality
- **Version History**: Track last modified timestamps
- **Export Functionality**: Download study guide as JSON

## API Integration

### Current Implementation
The component currently uses a simple API route (`/api/studygui`) for data persistence. This is a temporary solution until the TRPC backend is properly configured.

### TRPC Backend Integration
To integrate with your TRPC backend, you'll need to:

1. **Create TRPC Router Methods**:
```typescript
// In your TRPC router
export const studyguideRouter = router({
  get: publicProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ input }) => {
      // Fetch study guide for workspace
      return await db.studyGuide.findUnique({
        where: { workspaceId: input.workspaceId }
      });
    }),
    
  create: publicProcedure
    .input(z.object({
      title: z.string(),
      content: z.string(),
      workspaceId: z.string()
    }))
    .mutation(async ({ input }) => {
      // Create new study guide
      return await db.studyGuide.create({
        data: input
      });
    }),
    
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
      workspaceId: z.string()
    }))
    .mutation(async ({ input }) => {
      // Update existing study guide
      return await db.studyGuide.update({
        where: { id: input.id },
        data: {
          title: input.title,
          content: input.content,
          lastModified: new Date()
        }
      });
    })
});
```

2. **Update Component**:
Replace the API calls in the component with TRPC mutations:
```typescript
// Replace API calls with TRPC
const { data: guide, isLoading, error } = trpc.studyguide.get.useQuery({
  workspaceId,
}, {
  enabled: !!workspaceId,
});

const updateGuideMutation = trpc.studyguide.update.useMutation();
const createGuideMutation = trpc.studyguide.create.useMutation();
```

## Database Schema
```sql
-- Example database schema for study guides
CREATE TABLE study_guides (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  workspace_id VARCHAR(255) NOT NULL,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
);
```

## File Upload Endpoints
The component expects these endpoints for file uploads:

- `/api/upload` - For image file uploads
- `/api/fetch-url` - For fetching images by URL
- `/api/link` - For link previews

## Styling
The component uses the existing design system:
- `gradient-primary` for primary buttons
- `card-hover` for hover effects
- `shadow-soft` for card shadows
- Consistent spacing and typography

## Future Enhancements
- [ ] Auto-save functionality
- [ ] Collaborative editing
- [ ] Version history
- [ ] Rich media support
- [ ] Export to PDF/Markdown
- [ ] AI-powered content suggestions

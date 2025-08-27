import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage (replace with your database)
let studyGuides: Record<string, any> = {};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get('workspaceId');
  
  if (!workspaceId) {
    return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 });
  }
  
  const guide = studyGuides[workspaceId];
  return NextResponse.json(guide || null);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, workspaceId } = body;
    
    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 });
    }
    
    const newGuide = {
      id: Date.now().toString(),
      title: title || 'Untitled Study Guide',
      content: content || JSON.stringify({
        time: Date.now(),
        blocks: [
          {
            type: "header",
            data: {
              text: "Study Guide",
              level: 1,
            },
          },
          {
            type: "paragraph",
            data: {
              text: "Start writing your study notes here...",
            },
          },
        ],
      }),
      lastModified: new Date().toISOString(),
      workspaceId,
    };
    
    studyGuides[workspaceId] = newGuide;
    
    return NextResponse.json(newGuide);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create study guide' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, content, workspaceId } = body;
    
    if (!workspaceId || !id) {
      return NextResponse.json({ error: 'Workspace ID and Guide ID are required' }, { status: 400 });
    }
    
    const existingGuide = studyGuides[workspaceId];
    if (!existingGuide) {
      return NextResponse.json({ error: 'Study guide not found' }, { status: 404 });
    }
    
    const updatedGuide = {
      ...existingGuide,
      title: title || existingGuide.title,
      content: content || existingGuide.content,
      lastModified: new Date().toISOString(),
    };
    
    studyGuides[workspaceId] = updatedGuide;
    
    return NextResponse.json(updatedGuide);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update study guide' }, { status: 500 });
  }
}

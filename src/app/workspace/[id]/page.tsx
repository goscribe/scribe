"use client";

import { useState } from "react";
import { Plus, Edit3, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface StudyGuide {
  id: string;
  title: string;
  content: string;
  lastModified: string;
}

export default function StudyGuidePanel() {
  const [guides, setGuides] = useState<StudyGuide[]>([
    {
      id: '1',
      title: 'Main Study Guide',
      content: `# Chapter 5: Calculus Fundamentals

## Key Concepts
- **Derivatives**: The rate of change of a function at any point
- **Integrals**: The area under a curve, inverse of derivatives
- **Limits**: The value a function approaches as input approaches a value

## Important Formulas
- d/dx(x^n) = nx^(n-1)
- ∫x^n dx = x^(n+1)/(n+1) + C
- Chain Rule: d/dx[f(g(x))] = f'(g(x)) × g'(x)

## Practice Problems
1. Find the derivative of f(x) = 3x² + 2x - 1
2. Evaluate ∫(2x + 3)dx
3. Use the chain rule to find d/dx[sin(2x)]

## Study Tips
- Practice derivative rules daily
- Visualize functions using graphing tools
- Work through examples step by step`,
      lastModified: '2 hours ago'
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleEdit = (guide: StudyGuide) => {
    setEditingId(guide.id);
    setEditContent(guide.content);
  };

  const handleSave = (id: string) => {
    setGuides(guides.map(guide => 
      guide.id === id 
        ? { ...guide, content: editContent, lastModified: 'Just now' }
        : guide
    ));
    setEditingId(null);
    setEditContent('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditContent('');
  };

  const addNewGuide = () => {
    const newGuide: StudyGuide = {
      id: Date.now().toString(),
      title: `Study Guide ${guides.length + 1}`,
      content: '# New Study Guide\n\nStart writing your notes here...',
      lastModified: 'Just now'
    };
    setGuides([...guides, newGuide]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Study Guides</h3>
          <p className="text-sm text-muted-foreground">
            AI-generated summaries and your personal notes
          </p>
        </div>
        <Button onClick={addNewGuide} size="sm" className="gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Guide
        </Button>
      </div>

      {guides.map((guide) => (
        <Card key={guide.id} className="shadow-soft">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{guide.title}</CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  Modified {guide.lastModified}
                </span>
                {editingId === guide.id ? (
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSave(guide.id)}
                    >
                      <Save className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(guide)}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {editingId === guide.id ? (
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Write your study guide content here..."
              />
            ) : (
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {guide.content}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
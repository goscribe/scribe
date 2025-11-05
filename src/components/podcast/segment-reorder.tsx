"use client";

import { useState } from "react";
import { GripVertical, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export interface PodcastSegment {
  id: string;
  title: string;
  duration: number;
  order: number;
}

interface SegmentReorderProps {
  segments: PodcastSegment[];
  onReorder: (newOrder: PodcastSegment[]) => Promise<void>;
  onCancel: () => void;
}

/**
 * Component for reordering podcast segments with drag and drop
 */
export function SegmentReorder({ segments, onReorder, onCancel }: SegmentReorderProps) {
  const [orderedSegments, setOrderedSegments] = useState([...segments].sort((a, b) => a.order - b.order));
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;

    const newSegments = [...orderedSegments];
    const draggedSegment = newSegments[draggedIndex];
    
    // Remove from old position
    newSegments.splice(draggedIndex, 1);
    
    // Insert at new position
    newSegments.splice(index, 0, draggedSegment);
    
    setOrderedSegments(newSegments);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    
    const newSegments = [...orderedSegments];
    [newSegments[index - 1], newSegments[index]] = [newSegments[index], newSegments[index - 1]];
    setOrderedSegments(newSegments);
  };

  const handleMoveDown = (index: number) => {
    if (index === orderedSegments.length - 1) return;
    
    const newSegments = [...orderedSegments];
    [newSegments[index], newSegments[index + 1]] = [newSegments[index + 1], newSegments[index]];
    setOrderedSegments(newSegments);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Update order values
      const reorderedSegments = orderedSegments.map((seg, index) => ({
        ...seg,
        order: index + 1,
      }));
      
      await onReorder(reorderedSegments);
      toast.success('Segment order updated successfully');
    } catch (error) {
      toast.error('Failed to update segment order');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = () => {
    return orderedSegments.some((seg, index) => {
      const original = segments.find(s => s.id === seg.id);
      return original && original.order !== index + 1;
    });
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reorder Segments</CardTitle>
        <p className="text-sm text-muted-foreground">
          Drag segments to reorder them, or use the arrow buttons
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {orderedSegments.map((segment, index) => (
            <div
              key={segment.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                flex items-center gap-3 p-3 rounded-lg border bg-card
                transition-all cursor-move
                ${draggedIndex === index ? 'opacity-50 scale-95' : 'hover:border-primary'}
              `}
            >
              <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    #{index + 1}
                  </span>
                  <span className="font-medium truncate">
                    {segment.title}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDuration(segment.duration)}
                </span>
              </div>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="h-8 w-8 p-0"
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === orderedSegments.length - 1}
                  className="h-8 w-8 p-0"
                >
                  ↓
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges() || isSaving}
            className="flex-1"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Save Order
              </>
            )}
          </Button>
        </div>

        {hasChanges() && (
          <p className="text-sm text-muted-foreground text-center">
            Note: Start times will be automatically recalculated
          </p>
        )}
      </CardContent>
    </Card>
  );
}


// "use client";

// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { 
//   Edit3, 
//   Save, 
//   RefreshCw, 
//   Loader2, 
//   X,
//   Plus
// } from "lucide-react";

// export interface PodcastSegment {
//   id: string;
//   title: string;
//   content: string;
//   keyPoints: string[];
//   order: number;
//   startTime: number;
//   duration: number;
// }

// interface SegmentEditorProps {
//   segment: PodcastSegment;
//   onSave: (segment: Partial<PodcastSegment>) => void;
//   onRegenerate: (newContent?: string) => void;
//   onCancel?: () => void;
//   isRegenerating?: boolean;
//   isSaving?: boolean;
// }

// export function SegmentEditor({
//   segment,
//   onSave,
//   onRegenerate,
//   onCancel,
//   isRegenerating = false,
//   isSaving = false
// }: SegmentEditorProps) {
//   const [editedSegment, setEditedSegment] = useState<PodcastSegment>({ ...segment });
//   const [isEditing, setIsEditing] = useState(false);
//   const [newKeyPoint, setNewKeyPoint] = useState("");

//   const handleSave = () => {
//     onSave(editedSegment);
//     setIsEditing(false);
//   };

//   const handleCancel = () => {
//     setEditedSegment({ ...segment });
//     setIsEditing(false);
//     onCancel?.();
//   };

//   const handleRegenerate = () => {
//     onRegenerate(editedSegment.content);
//   };

//   const addKeyPoint = () => {
//     if (newKeyPoint.trim()) {
//       setEditedSegment(prev => ({
//         ...prev,
//         keyPoints: [...prev.keyPoints, newKeyPoint.trim()]
//       }));
//       setNewKeyPoint("");
//     }
//   };

//   const removeKeyPoint = (index: number) => {
//     setEditedSegment(prev => ({
//       ...prev,
//       keyPoints: prev.keyPoints.filter((_, i) => i !== index)
//     }));
//   };

//   const updateField = (field: keyof PodcastSegment, value: any) => {
//     setEditedSegment(prev => ({ ...prev, [field]: value }));
//   };

//   const formatDuration = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   };

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <CardTitle className="flex items-center gap-2">
//             <Edit3 className="h-5 w-5" />
//             Segment {segment.order + 1}
//           </CardTitle>
//           <div className="flex items-center gap-2">
//             <Badge variant="outline">
//               {formatDuration(segment.duration)}
//             </Badge>
//             {!isEditing && (
//               <Button
//                 onClick={() => setIsEditing(true)}
//                 size="sm"
//                 variant="outline"
//               >
//                 <Edit3 className="h-4 w-4 mr-2" />
//                 Edit
//               </Button>
//             )}
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {/* Title */}
//         <div className="space-y-2">
//           <Label htmlFor="title">Title</Label>
//           {isEditing ? (
//             <Input
//               id="title"
//               value={editedSegment.title}
//               onChange={(e) => updateField('title', e.target.value)}
//               placeholder="Enter segment title..."
//             />
//           ) : (
//             <p className="text-sm font-medium">{segment.title}</p>
//           )}
//         </div>

//         {/* Content */}
//         <div className="space-y-2">
//           <Label htmlFor="content">Content</Label>
//           {isEditing ? (
//             <Textarea
//               id="content"
//               value={editedSegment.content}
//               onChange={(e) => updateField('content', e.target.value)}
//               placeholder="Enter segment content..."
//               rows={6}
//             />
//           ) : (
//             <p className="text-sm text-muted-foreground leading-relaxed">
//               {segment.content}
//             </p>
//           )}
//         </div>

//         {/* Key Points */}
//         <div className="space-y-2">
//           <Label>Key Points</Label>
//           {isEditing ? (
//             <div className="space-y-2">
//               <div className="flex gap-2">
//                 <Input
//                   value={newKeyPoint}
//                   onChange={(e) => setNewKeyPoint(e.target.value)}
//                   placeholder="Add a key point..."
//                   onKeyPress={(e) => e.key === 'Enter' && addKeyPoint()}
//                 />
//                 <Button
//                   onClick={addKeyPoint}
//                   size="sm"
//                   variant="outline"
//                   disabled={!newKeyPoint.trim()}
//                 >
//                   <Plus className="h-4 w-4" />
//                 </Button>
//               </div>
//               <div className="flex flex-wrap gap-1">
//                 {editedSegment.keyPoints.map((point, index) => (
//                   <Badge key={index} variant="secondary" className="text-xs">
//                     {point}
//                     <Button
//                       onClick={() => removeKeyPoint(index)}
//                       size="sm"
//                       variant="ghost"
//                       className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
//                     >
//                       <X className="h-3 w-3" />
//                     </Button>
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-wrap gap-1">
//               {segment.keyPoints.map((point, index) => (
//                 <Badge key={index} variant="secondary" className="text-xs">
//                   {point}
//                 </Badge>
//               ))}
//             </div>
//           )}
//         </div>

//         <Separator />

//         {/* Actions */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Button
//               onClick={handleRegenerate}
//               size="sm"
//               variant="outline"
//               disabled={isRegenerating}
//             >
//               {isRegenerating ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Regenerating...
//                 </>
//               ) : (
//                 <>
//                   <RefreshCw className="h-4 w-4 mr-2" />
//                   Regenerate
//                 </>
//               )}
//             </Button>
//           </div>

//           {isEditing && (
//             <div className="flex items-center gap-2">
//               <Button
//                 onClick={handleCancel}
//                 size="sm"
//                 variant="outline"
//                 disabled={isSaving}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleSave}
//                 size="sm"
//                 disabled={isSaving}
//               >
//                 {isSaving ? (
//                   <>
//                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="h-4 w-4 mr-2" />
//                     Save
//                   </>
//                 )}
//               </Button>
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

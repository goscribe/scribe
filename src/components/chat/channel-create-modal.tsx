// "use client";

// import { useState } from "react";
// import { CreateChannelInput } from "@/hooks/use-chat";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Hash } from "lucide-react";

// interface ChannelCreateModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onCreateChannel: (input: CreateChannelInput) => Promise<void>;
//   workspaceId: string;
// }

// export function ChannelCreateModal({
//   open,
//   onOpenChange,
//   onCreateChannel,
//   workspaceId,
// }: ChannelCreateModalProps) {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!name.trim()) return;

//     setIsSubmitting(true);
//     try {
//       await onCreateChannel({
//         name: name.trim(),
//         description: description.trim() || undefined,
//         workspaceId,
//       });
      
//       // Reset form
//       setName("");
//       setDescription("");
//       onOpenChange(false);
//     } catch (error) {
//       console.error("Failed to create channel:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     setName("");
//     setDescription("");
//     onOpenChange(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle className="flex items-center space-x-2">
//             <Hash className="h-5 w-5" />
//             <span>Create Channel</span>
//           </DialogTitle>
//           <DialogDescription>
//             Create a new channel for your workspace. Channels help organize conversations by topic.
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="name">Channel Name</Label>
//             <Input
//               id="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="e.g., general, announcements, questions"
//               disabled={isSubmitting}
//               required
//             />
//             <p className="text-xs text-muted-foreground">
//               Channel names should be lowercase and can contain hyphens or underscores.
//             </p>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="description">Description (Optional)</Label>
//             <Textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="What is this channel about?"
//               disabled={isSubmitting}
//               rows={3}
//             />
//           </div>

//           <DialogFooter>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={handleCancel}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={!name.trim() || isSubmitting}
//             >
//               {isSubmitting ? "Creating..." : "Create Channel"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

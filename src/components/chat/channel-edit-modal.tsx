// "use client";

// import { useState, useEffect } from "react";
// import { EditChannelInput } from "@/hooks/use-chat";
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
// import { RouterOutputs } from '@goscribe/server';

// type Channel = RouterOutputs['chat']['getChannels'][number];

// interface ChannelEditModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   channel: Channel;
//   onEditChannel: (input: EditChannelInput) => Promise<void>;
// }

// export function ChannelEditModal({
//   open,
//   onOpenChange,
//   channel,
//   onEditChannel,
// }: ChannelEditModalProps) {
//   const [name, setName] = useState(channel.name);
//   const [description, setDescription] = useState(channel.description || "");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Update form when channel changes
//   useEffect(() => {
//     setName(channel.name);
//     setDescription(channel.description || "");
//   }, [channel]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!name.trim()) return;

//     setIsSubmitting(true);
//     try {
//       await onEditChannel({
//         id: channel.id,
//         name: name.trim(),
//         description: description.trim() || undefined,
//       });
      
//       onOpenChange(false);
//     } catch (error) {
//       console.error("Failed to edit channel:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     setName(channel.name);
//     setDescription(channel.description || "");
//     onOpenChange(false);
//   };

//   const hasChanges = name !== channel.name || description !== (channel.description || "");

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle className="flex items-center space-x-2">
//             <Hash className="h-5 w-5" />
//             <span>Edit Channel</span>
//           </DialogTitle>
//           <DialogDescription>
//             Update the channel name and description. Changes will be visible to all workspace members.
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
//               disabled={!name.trim() || isSubmitting || !hasChanges}
//             >
//               {isSubmitting ? "Saving..." : "Save Changes"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { trpc } from "@/lib/trpc";
import { useParams, useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";

export default function CreateFileModal({
    isOpen,
    setIsOpen,
    onSuccess
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSuccess: () => void;
}) {
    const [fileName, setFileName] = useState("");
    const [description, setDescription] = useState("");
    const router = useRouter();

    const { folderId } = useParams();

    const createFileMutation = trpc.workspace.create.useMutation({
        onSuccess: (data) => {
            onSuccess();
            // Navigate to the newly created workspace
            if (data?.id) {
                router.push(`/workspace/${data.id}`);
            }
        }
    });

    const handleCreateFile = () => {
        if (fileName.trim()) {
          createFileMutation.mutate({
            name: fileName,
            description: description || undefined,
            ...(folderId && { parentId: folderId as string }),
          });
          setFileName("");
          setIsOpen(false);
        }
      };

    
    
    return       <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create New File</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-name">File Name</Label>
          <Input
            id="file-name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="My Study Notes"
            onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="file-description">Description</Label>
          <Textarea
            id="file-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description for your file"
            rows={3}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateFile} disabled={createFileMutation.isPending}>
            {createFileMutation.isPending ? "Creating..." : "Create File"}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
}
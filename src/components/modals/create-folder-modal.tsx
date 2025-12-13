import { useState } from "react";
import { Button } from "../ui/button";
import { ColorPicker } from "../ui/color-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc";

export default function CreateFolderModal({
    isOpen,
    setIsOpen,
    onSuccess
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSuccess: () => void;
}) {
    const [folderName, setFolderName] = useState("");
    const [folderColor, setFolderColor] = useState("#6366f1");

    const { folderId } = useParams();

    const createFolderMutation = trpc.workspace.createFolder.useMutation({
        onSuccess: () => {
            onSuccess();
        }
    });

    const handleCreateFolder = () => {
        if (folderName.trim()) {
          createFolderMutation.mutate({
            name: folderName,
            color: folderColor,
            ...(folderId && { parentId: folderId as string }),
          });
          setFolderName("");
          setFolderColor("#6366f1"); // Reset to default
          setIsOpen(false);
        }
      };

    return       <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create New Folder</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="folder-name">Folder Name</Label>
          <Input
            id="folder-name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Project Folder"
            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
          />
        </div>
        <div className="space-y-2">
          <Label>Folder Color</Label>
          <ColorPicker
            value={folderColor}
            onChange={setFolderColor}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateFolder} disabled={createFolderMutation.isPending}>
            {createFolderMutation.isPending ? "Creating..." : "Create Folder"}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
}
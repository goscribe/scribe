import { useEffect, useState } from "react";
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label";
import { FolderItem } from "@/lib/storage/transformFileFolderInfo";
import { trpc } from "@/lib/trpc";
import { ColorPicker } from "../ui/color-picker";

export default function EditFolderModal({
    isOpen,
    setIsOpen,
    editingFolder,
    onSuccess
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    editingFolder: FolderItem | null;
    onSuccess: () => void;
}) {    

    const [folderName, setFolderName] = useState(editingFolder?.name || "");
    const [folderColor, setFolderColor] = useState(editingFolder?.color || "#6366f1");

    const updateFolderMutation = trpc.workspace.updateFolder.useMutation({
        onSuccess: () => {
            onSuccess();
        }
    });

    useEffect(() => {
        setFolderName(editingFolder?.name || "");
        setFolderColor(editingFolder?.color || "#6366f1");
    }, [editingFolder]);

    const handleSaveRename = () => {
        if (folderName.trim() && updateFolderMutation) {
            updateFolderMutation.mutate({
                id: editingFolder?.id || "",
                name: folderName.trim(),
                color: folderColor,
            });
            setIsOpen(false);
        }
    };
    return <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Folder</DialogTitle>
          <DialogDescription>
            Update the name and color for your folder.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-folder-name">Folder Name</Label>
            <Input
              id="edit-folder-name"
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && folderName.trim() && handleSaveRename()}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-folder-color">Folder Color</Label>
            <div className="flex items-center gap-2">
              <ColorPicker
                value={folderColor}
                onChange={setFolderColor}
                showLabel={true}
              />
              <span className="text-sm text-muted-foreground">
                Update the folder color
              </span>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRename} disabled={!folderName.trim() || updateFolderMutation.isPending}>
              {updateFolderMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
}
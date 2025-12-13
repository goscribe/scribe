import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

export default function DeletionConfirmationModal({
    isOpen,
    type,
    specificName,
    onConfirm,
    setIsOpen,
}: {
    isOpen: boolean;
    type: string;
    specificName: string;
    onConfirm: () => void;
    setIsOpen: (open: boolean) => void;
}) {
    return     <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete {type}</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete "{specificName}"? This action cannot be undone and will delete all files within this folder.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
}       
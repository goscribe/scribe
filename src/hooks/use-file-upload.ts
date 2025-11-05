import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

/**
 * Custom hook for handling file uploads with drag & drop support
 * 
 * @param workspaceId - The ID of the workspace to upload files to
 * @param onSuccess - Optional callback function to execute after successful upload
 * @returns Object containing upload state and handlers
 * 
 * @example
 * ```tsx
 * const { isUploading, handleFileUpload, handleDrop } = useFileUpload(
 *   workspaceId, 
 *   () => console.log('Upload complete!')
 * );
 * ```
 */
export const useFileUpload = (workspaceId: string, onSuccess?: () => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadAndAnalyzeMutation = trpc.workspace.uploadAndAnalyzeMedia.useMutation({
    onSuccess: () => {
      setIsUploading(false);
      onSuccess?.();
    },
    onError: () => {
      setIsUploading(false);
    },
  });

  /**
   * Converts a File object to base64 string
   * @param file - The file to convert
   * @returns Promise that resolves to base64 string
   */
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  /**
   * Uploads multiple files to the workspace and triggers AI analysis
   * @param files - Array of File objects to upload
   */
  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    toast.info(`Uploading ${files.length} file(s)...`);

    try {
      for (const file of files) {
        const base64Content = await convertFileToBase64(file);

        uploadAndAnalyzeMutation.mutate({
          workspaceId,
          file: {
            filename: file.name,
            contentType: file.type,
            size: file.size,
            content: base64Content,
          },
          generateStudyGuide: true,
          generateFlashcards: true,
          generateWorksheet: true,
        });
      }

      toast.success('Files uploaded successfully!');
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
      setIsUploading(false);
    }
  };

  /**
   * Handles file input change events
   * @param event - The file input change event
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      await uploadFiles(Array.from(files));
      event.target.value = '';
    }
  };

  /**
   * Handles drag over events to show drag state
   * @param e - The drag event
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  /**
   * Handles drag leave events to hide drag state
   * @param e - The drag event
   */
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  /**
   * Handles file drop events
   * @param e - The drop event
   */
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    await uploadFiles(droppedFiles);
  };

  /**
   * Triggers the file input click to open file picker
   */
  const handleUploadClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return {
    /** Whether files are currently being uploaded */
    isUploading,
    /** Whether files are being dragged over the drop zone */
    isDragOver,
    /** Reference to the hidden file input element */
    fileInputRef,
    /** Handler for file input change events */
    handleFileUpload,
    /** Handler for drag over events */
    handleDragOver,
    /** Handler for drag leave events */
    handleDragLeave,
    /** Handler for file drop events */
    handleDrop,
    /** Handler to trigger file picker */
    handleUploadClick,
  };
};

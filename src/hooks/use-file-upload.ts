import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { client } from '@/lib/trpc-client';

interface FileUploadUrlResponse {
  fileId: string;
  uploadUrl: string;
}

interface UploadAndAnalyzeInput {
  workspaceId: string;
  files: Array<{ id: string }>;
  generateStudyGuide: boolean;
  generateFlashcards: boolean;
  generateWorksheet: boolean;
}

/**
 * Custom hook for handling file uploads with drag & drop support
 * 
 * Uses the new upload flow:
 * 1. Get signed upload URLs from backend
 * 2. Upload files directly to Supabase storage
 * 3. Trigger AI analysis with file IDs
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
      toast.success('Files uploaded and analysis started!');
      onSuccess?.();
    },
    onError: (error) => {
      setIsUploading(false);
      toast.error(error.message || 'Failed to start analysis');
    },
  });

  /**
   * Uploads a single file to Supabase storage using a signed URL
   * @param file - The file to upload
   * @param uploadUrl - The signed upload URL from Supabase
   * @returns Promise that resolves when upload is complete
   */
  const uploadFileToStorage = async (file: File, uploadUrl: string): Promise<void> => {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file to storage: ${response.statusText}`);
    }
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
      const fileIds: string[] = [];

      // Step 1: Get upload URLs and upload files to Supabase
      for (const file of files) {
        try {
          // Get signed upload URL from backend
          // Note: Types may need to be regenerated after backend changes
          const workspaceRouter = client.workspace as {
            getFileUploadUrl?: {
              query: (input: {
                workspaceId: string;
                filename: string;
                contentType: string;
                size: number;
              }) => Promise<FileUploadUrlResponse>;
            };
          };

          if (!workspaceRouter.getFileUploadUrl) {
            throw new Error('getFileUploadUrl endpoint not available');
          }

          const uploadUrlData = await workspaceRouter.getFileUploadUrl.query({
            workspaceId,
            filename: file.name,
            contentType: file.type,
            size: file.size,
          });

          // Upload file directly to Supabase
          await uploadFileToStorage(file, uploadUrlData.uploadUrl);

          // Store file ID for analysis step
          fileIds.push(uploadUrlData.fileId);
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          toast.error(`Failed to upload ${file.name}`);
          // Continue with other files
        }
      }

      if (fileIds.length === 0) {
        throw new Error('No files were successfully uploaded');
      }

      // Step 2: Trigger AI analysis with uploaded file IDs
      // Note: Type assertion needed until backend types are regenerated
      const analyzeInput: UploadAndAnalyzeInput = {
        workspaceId,
        files: fileIds.map(id => ({ id })),
        generateStudyGuide: true,
        generateFlashcards: true,
        generateWorksheet: true,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      uploadAndAnalyzeMutation.mutate(analyzeInput as unknown as any);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload files');
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

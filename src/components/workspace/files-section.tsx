"use client";

import { useState } from 'react';
import { Upload, FileText, Image, Volume2, ChevronRight, Download } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

/**
 * File object interface
 */
interface File {
  /** Unique identifier for the file */
  id: string;
  /** Display name of the file */
  name: string;
  /** MIME type of the file (optional) */
  mimeType?: string;
}

/**
 * Props for the FilesSection component
 */
interface FilesSectionProps {
  /** Array of files to display */
  files: File[];
  /** Whether files are currently being uploaded */
  isUploading: boolean;
  /** Callback function when upload button is clicked */
  onUploadClick: () => void;
  /** Callback function when download button is clicked */
  // onDownload: (fileId: string, fileName: string) => void;
}

/**
 * Files section component for displaying and managing workspace files
 * 
 * Features:
 * - Collapsible file list with count display
 * - File type icons based on MIME type
 * - Upload button with loading state
 * - File truncation for large lists
 * 
 * @param props - FilesSectionProps
 * @returns JSX element containing the files section
 */
export const FilesSection = ({ files, isUploading, onUploadClick, /*onDownload*/ }: FilesSectionProps) => {
  const [isFilesOpen, setIsFilesOpen] = useState(true);

  /**
   * Determines the appropriate icon for a file based on its MIME type
   * @param mimeType - The MIME type of the file
   * @returns The appropriate icon component
   */
  const getFileIcon = (mimeType?: string) => {
    if (mimeType?.includes('image')) return Image;
    if (mimeType?.includes('audio')) return Volume2;
    return FileText;
  };

  return (
    <div className="px-2 mt-2">
      <div className="border-t border-border pt-2">
        <Collapsible open={isFilesOpen} onOpenChange={setIsFilesOpen}>
          <div className="w-full flex items-center justify-between px-3 py-1 group">
            <CollapsibleTrigger className="flex items-center gap-1.5 flex-1 hover:text-foreground transition-colors">
              <ChevronRight className={cn(
                "h-3 w-3 text-muted-foreground transition-transform duration-200",
                isFilesOpen && "rotate-90"
              )} />
              <span className="text-[11px] font-medium text-muted-foreground">
                Files{files.length > 0 ? ` (${files.length})` : ''}
              </span>
            </CollapsibleTrigger>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onUploadClick();
              }}
              disabled={isUploading}
              className={cn(
                "p-1 rounded-md transition-all hover:bg-accent",
                isUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}
              title={isUploading ? "Uploading..." : "Upload files"}
            >
              {isUploading ? (
                <div className="h-3 w-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="h-3 w-3 text-muted-foreground" />
              )}
            </button>
          </div>
          <CollapsibleContent className="mt-0.5">
            {isUploading && (
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground">
                <div className="h-3 w-3 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
                Uploading...
              </div>
            )}
            {!isUploading && files.length === 0 ? (
              <div className="px-3 py-2">
                <p className="text-xs text-muted-foreground">No files yet</p>
              </div>
            ) : !isUploading ? (
              <div className="space-y-px">
                {files.slice(0, 10).map((file) => {
                  const FileIcon = getFileIcon(file.mimeType);
                  return (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 px-3 py-1 rounded-md transition-colors hover:bg-accent mx-1"
                    >
                      <FileIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="text-xs truncate text-muted-foreground">
                        {file.name}
                      </span>
                    </div>
                  );
                })}
                {files.length > 10 && (
                  <div className="px-3 py-1">
                    <span className="text-xs text-muted-foreground">
                      +{files.length - 10} more
                    </span>
                  </div>
                )}
              </div>
            ) : null}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

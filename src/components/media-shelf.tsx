"use client";

import { File, Trash2, Download, MoreVertical, Image, FileText, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface MediaFile {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'ppt' | 'txt' | 'audio' | 'image';
  size: string;
  uploadedAt: string;
  url?: string;
}

interface MediaShelfProps {
  files: MediaFile[];
  onFileDelete: (fileId: string) => void;
}

// Mock data - in real app this would come from your database
const mockFiles: MediaFile[] = [
  { id: '1', name: 'React Tutorial.pdf', type: 'pdf', size: '2.4 MB', uploadedAt: '2024-01-15' },
  { id: '2', name: 'Meeting Recording.mp3', type: 'audio', size: '15.2 MB', uploadedAt: '2024-01-14' },
  { id: '3', name: 'Presentation Slides.pptx', type: 'ppt', size: '5.1 MB', uploadedAt: '2024-01-13' },
  { id: '4', name: 'Notes.txt', type: 'txt', size: '24 KB', uploadedAt: '2024-01-12' },
  { id: '5', name: 'Diagram.png', type: 'image', size: '1.8 MB', uploadedAt: '2024-01-11' },
];

const getFileIcon = (type: MediaFile['type']) => {
  switch (type) {
    case 'image':
      return Image;
    case 'audio':
      return Volume2;
    default:
      return FileText;
  }
};

const getFileTypeColor = (type: MediaFile['type']) => {
  switch (type) {
    case 'pdf':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'docx':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'ppt':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'txt':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'audio':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'image':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export const MediaShelf = ({ files, onFileDelete }: MediaShelfProps) => {

  const processFile = (file: File) => {
    const newFile: MediaFile = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type.startsWith('audio/') ? 'audio' : 
            file.type.startsWith('image/') ? 'image' :
            file.name.endsWith('.pdf') ? 'pdf' :
            file.name.endsWith('.docx') ? 'docx' :
            file.name.endsWith('.pptx') ? 'ppt' : 'txt',
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    // This will be handled by the parent component
    return newFile;
  };



  return (
    <div className="space-y-4 bg-white p-4 rounded-lg">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => {
          const FileIcon = getFileIcon(file.type);
          return (
            <Card key={file.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-lg border",
                      getFileTypeColor(file.type)
                    )}>
                      <FileIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{file.name}</h4>
                      <p className="text-xs text-muted-foreground">{file.size}</p>
                      <p className="text-xs text-muted-foreground">{file.uploadedAt}</p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => onFileDelete(file.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {files.length === 0 && (
        <div className="text-center py-12">
          <File className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No files uploaded</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload your first file to get started with AI-powered content generation.
          </p>
        </div>
      )}
    </div>
  );
};
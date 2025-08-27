"use client";

import { useState } from "react";
import { Folder, FileText, MoreHorizontal, Grid3X3, List } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/lib/useSession";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  lastModified: string;
  size?: string;
}

interface DashboardProps {
  onFileClick: (file: FileItem) => void;
}

const sampleFiles: FileItem[] = [
  { id: "1", name: "Biology Notes", type: "folder", lastModified: "2 days ago" },
  { id: "2", name: "Math Worksheets", type: "folder", lastModified: "1 week ago" },
  { id: "3", name: "Chapter 5 Summary", type: "file", lastModified: "3 hours ago", size: "2.4 MB" },
  { id: "4", name: "History Research", type: "file", lastModified: "1 day ago", size: "1.8 MB" },
  { id: "5", name: "Physics Lab Report", type: "file", lastModified: "2 days ago", size: "3.1 MB" },
  { id: "6", name: "Chemistry Study Guide", type: "file", lastModified: "5 days ago", size: "1.2 MB" },
];

export default function DashboardPage({ onFileClick }: DashboardProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { data: session, isLoading: sessionLoading, error } = useSession(); 
  const router = useRouter();
  const { data: files, isLoading: filesLoading, error: filesError } = trpc.workspace.list.useQuery();


  if (filesLoading || !files) {
    return <div>Loading...</div>;
  }

  if (filesError) {
    return <div>Error: {filesError.message}</div>;
  }
  return (
    <div className="p-6 min-h-screen bg-gradient-subtle">
      {/* Header */}
      <h1>Welcome, {session?.user?.name}</h1>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">My Files</h2>
          <p className="text-muted-foreground mt-1">
            {files.length} items
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Files Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {files.map((item) => (
            <Card
              key={item.id}
              className="group cursor-pointer transition-all duration-200 hover:shadow-medium hover:-translate-y-1 bg-gradient-card border-border/50"
              onClick={() => router.push(`/workspace/${item.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="relative">
                    {item.folderId ? (
                      <Folder className="h-12 w-12 text-primary" />
                    ) : (
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -top-1 -right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => router.push(`/workspace/${item.id}`)}
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {item.updatedAt.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sampleFiles.map((item) => (
            <Card
              key={item.id}
              className="group cursor-pointer transition-all duration-200 hover:shadow-soft bg-gradient-card border-border/50"
              onClick={() => onFileClick(item)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {item.type === "folder" ? (
                      <Folder className="h-5 w-5 text-primary" />
                    ) : (
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.lastModified} {item.size && `• ${item.size}`}
                      </p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
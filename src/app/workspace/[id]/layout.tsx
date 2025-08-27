"use client";

import { BookOpen, Brain, FileText, MessageSquare, Podcast, ChevronDown, Search, Plus, FolderOpen, Upload, PanelLeftClose, PanelLeftOpen, InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { MediaShelf } from "@/components/media-shelf";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";

export type WorkspaceTab = 'def' | 'study-guide' | 'flashcards' | 'worksheet' | 'summaries' | 'podcasts';

interface WorkspaceSidebarProps {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
}

// Mock notes data - in real app this would come from your database
const mockNotes = [
  { id: '1', title: 'Introduction to React', type: 'study-guide' },
  { id: '2', title: 'JavaScript Fundamentals', type: 'flashcards' },
  { id: '3', title: 'Meeting Notes - Project Kickoff', type: 'summaries' },
  { id: '4', title: 'Data Structures Practice', type: 'worksheet' },
  { id: '5', title: 'Frontend Development Podcast', type: 'podcasts' },
  { id: '6', title: 'CSS Grid Tutorial', type: 'study-guide' },
  { id: '7', title: 'Algorithm Practice', type: 'flashcards' },
];

interface MediaFile {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'ppt' | 'txt' | 'audio' | 'image';
  size: string;
  uploadedAt: string;
  url?: string;
}

// Mock files data - in real app this would come from your database
const mockFiles: MediaFile[] = [
  { id: '1', name: 'React Tutorial.pdf', type: 'pdf', size: '2.4 MB', uploadedAt: '2024-01-15' },
  { id: '2', name: 'Meeting Recording.mp3', type: 'audio', size: '15.2 MB', uploadedAt: '2024-01-14' },
  { id: '3', name: 'Presentation Slides.pptx', type: 'ppt', size: '5.1 MB', uploadedAt: '2024-01-13' },
  { id: '4', name: 'Notes.txt', type: 'txt', size: '24 KB', uploadedAt: '2024-01-12' },
  { id: '5', name: 'Diagram.png', type: 'image', size: '1.8 MB', uploadedAt: '2024-01-11' },
];

const tabs = [
  {
    id: 'def' as WorkspaceTab,
    label: 'Default(You should not see this)',
    icon: InfoIcon,
    description: 'Invisible default tab',
    invisible: true,
  },{
    id: 'study-guide' as WorkspaceTab,
    label: 'Study Guide',
    icon: BookOpen,
    description: 'AI-generated summaries and notes'
  },
  {
    id: 'flashcards' as WorkspaceTab,
    label: 'Flashcards',
    icon: Brain,
    description: 'Interactive Q&A cards'
  },
  {
    id: 'worksheet' as WorkspaceTab,
    label: 'Worksheet',
    icon: FileText,
    description: 'Practice exercises and problems'
  },
  {
    id: 'meeting-summaries' as WorkspaceTab,
    label: 'Meeting Summaries',
    icon: MessageSquare,
    description: 'Structured meeting notes'
  },
  {
    id: 'podcasts' as WorkspaceTab,
    label: 'Podcasts',
    icon: Podcast,
    description: 'Audio content and transcripts'
  }
];

export const WorkspaceSidebar = ({ activeTab, onTabChange, isCollapsed }: WorkspaceSidebarProps & { isCollapsed: boolean }) => {
  const [selectedNote, setSelectedNote] = useState(mockNotes[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = mockNotes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn(
      "bg-card border-r shadow-soft transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
              {/* Notion-style workspace dropdown */}
        <div className="p-4 border-b">
          {!isCollapsed && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm truncate">{selectedNote.title}</div>
                    <div className="text-xs text-muted-foreground capitalize">{selectedNote.type.replace('-', ' ')}</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="start">
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 bg-muted/50 border-0 focus:bg-card transition-colors"
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredNotes.map((note) => (
                <DropdownMenuItem
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className="flex flex-col items-start p-3 cursor-pointer"
                >
                  <div className="font-medium text-sm">{note.title}</div>
                  <div className="text-xs text-muted-foreground capitalize">{note.type.replace('-', ' ')}</div>
                </DropdownMenuItem>
              ))}
            </div>
                      </DropdownMenuContent>
          </DropdownMenu>
          )}
        </div>


      <nav className="p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.invisible) { return(<div key={tab.id}></div>); }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "w-full flex items-start space-x-3 p-3 rounded-lg text-left transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "hover:bg-muted/50 text-foreground"
              )}
              title={isCollapsed ? tab.label : undefined}
            >
              <Icon className={cn(
                "h-5 w-5 mt-0.5 flex-shrink-0",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "font-medium text-sm",
                    isActive && "text-primary"
                  )}>
                    {tab.label}
                  </div>
                  <div className={cn(
                    "text-xs mt-1 leading-relaxed",
                    isActive ? "text-primary/70" : "text-muted-foreground"
                  )}>
                    {tab.description}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('study-guide');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const router = useRouter();
  const { id } = useParams();
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: workspace, isLoading: workspaceLoading, error: workspaceError, refetch: refetchWorkspace } = trpc.workspace.get.useQuery({
    id: id as string,
  }, {
    enabled: !!id,
  });

  const files = workspace?.uploads || []; // TODO: fix this

  const uploadFileMutation = trpc.workspace.uploadFiles.useMutation();
  const deleteFileMutation = trpc.workspace.deleteFiles.useMutation({
    onSuccess: () => {
      refetchWorkspace();
    },
  });
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const result = await uploadFileMutation.mutateAsync({
          files: [{
            filename: file.name,
            contentType: file.type,
            size: file.size,
          }],
          id: id as string,
        });

        setIsUploadOpen(false);
        
        refetchWorkspace();
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };





  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setIsUploadOpen(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex h-screen">
      <WorkspaceSidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          router.push(`/workspace/${id}/${tab}`);
        }}
        isCollapsed={isSidebarCollapsed}
      />
      
      {/* Sidebar Toggle Button */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -left-3 top-4 z-10 h-6 w-6 rounded-full border bg-background shadow-sm hover:bg-muted"
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="h-3 w-3" />
          ) : (
            <PanelLeftClose className="h-3 w-3" />
          )}
        </Button>
      </div>
      <main className="flex-1 overflow-auto">
      <div className="border-b bg-white p-5">
          <Collapsible open={isMediaOpen} onOpenChange={setIsMediaOpen}>
            <div className="flex items-center justify-between mb-2">
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-3 hover:bg-muted/30 transition-colors"
                >
                  <FolderOpen className="h-5 w-5 text-primary/60" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Media Library</p>
                    <p className="text-xs text-muted-foreground">
                      Upload and manage your files
                    </p>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isMediaOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              
              <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Upload New File</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Drag and Drop Area */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={handleUploadClick}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                        isDragOver 
                          ? 'border-primary bg-primary/5 scale-105' 
                          : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20'
                      }`}
                    >
                      <Upload className={`mx-auto h-12 w-12 mb-4 transition-colors ${
                        isDragOver ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <div className="space-y-2">
                        <p className="text-lg font-medium">
                          {isDragOver ? 'Drop files here' : 'Drag and drop files here'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          or click to browse files
                        </p>
                      </div>
                    </div>
                    
                    {/* Hidden File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.pptx,.txt,.mp3,.wav,.jpg,.jpeg,.png,.gif"
                      onChange={handleFileUpload}
                      className="hidden"
                      multiple
                    />
                    
                    <p className="text-xs text-muted-foreground text-center">
                      Supported formats: PDF, DOCX, PPT, TXT, audio files (MP3, WAV), and images
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <CollapsibleContent className="animate-accordion-down bg-white">
              <MediaShelf files={files} onFileDelete={
                async (fileId) => {
                  deleteFileMutation.mutate({
                    fileId: [fileId],
                    id: id as string,
                  });
                }
              } />
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div className="m-5">
        {children}
        </div>
      </main>
    </div>
  );
}
"use client";

import {
    BookOpen,
    Brain,
    FileText,
    MessageSquare,
    Podcast,
    ChevronDown,
    Search,
    Plus,
    FolderOpen,
    InfoIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
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

export const WorkspaceSidebar = ({ activeTab, onTabChange }: WorkspaceSidebarProps) => {
  const [selectedNote, setSelectedNote] = useState(mockNotes[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = mockNotes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-64 bg-card border-r shadow-soft">
      {/* Notion-style workspace dropdown */}
      <div className="p-4 border-b">
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
      </div>


      <nav className="p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.invisible) { return(<></>); }

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
            >
              <Icon className={cn(
                "h-5 w-5 mt-0.5 flex-shrink-0",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
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
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('def');
  const router = useRouter();
  const { id } = useParams();
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  return (
    <div className="flex h-screen">
      <WorkspaceSidebar activeTab={activeTab} onTabChange={(tab) => {
        setActiveTab(tab);
        router.push(`/workspace/${id}/${tab}`);
      }} />
      <main className="flex-1 overflow-auto">
      <div className="border-b bg-white p-5">
          <Collapsible open={isMediaOpen} onOpenChange={setIsMediaOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between h-auto hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FolderOpen className="h-5 w-5 text-primary/60" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Media Library</p>
                    <p className="text-xs text-muted-foreground">
                      Upload and manage your files
                    </p>
                  </div>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${isMediaOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="animate-accordion-down bg-white">
              <MediaShelf />
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
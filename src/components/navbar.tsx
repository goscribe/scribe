"use client";

import { Search, User, Settings, LogOut, Plus, Share, UserPlus, ChevronDown, File, FolderPlus, FileText, Brain, BookOpen, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NavbarProps {
  onNewClick?: () => void;
  onCreateFile?: (name: string) => void;
  onCreateFolder?: (name: string) => void;
}

export const Navbar = ({ onNewClick, onCreateFile, onCreateFolder }: NavbarProps) => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isNewFileOpen, setIsNewFileOpen] = useState(false);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fileName, setFileName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Mock search results
  const mockSearchResults = [
    { id: 1, name: "React Fundamentals", type: "file", icon: FileText },
    { id: 2, name: "JavaScript Study Guide", type: "study-guide", icon: Brain },
    { id: 3, name: "API Documentation", type: "file", icon: FileText },
    { id: 4, name: "Learning Podcasts", type: "podcast", icon: Headphones },
    { id: 5, name: "Project Notes", type: "folder", icon: FolderPlus },
    { id: 6, name: "CSS Flexbox Worksheet", type: "worksheet", icon: BookOpen },
  ];

  const filteredResults = mockSearchResults.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateFile = () => {
    if (fileName.trim()) {
      onCreateFile?.(fileName);
      setFileName("");
      setIsNewFileOpen(false);
    }
  };

  const handleCreateFolder = () => {
    if (folderName.trim()) {
      onCreateFolder?.(folderName);
      setFolderName("");
      setIsNewFolderOpen(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchResults(value.length > 0);
  };

  const handleSearchResultClick = (result: any) => {
    setSearchQuery("");
    setShowSearchResults(false);
    // In a real app, you'd navigate to the selected item
    console.log("Selected:", result);
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm shadow-soft">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
            Scribe
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              className="pl-10 bg-muted/50 border border-border focus:bg-card transition-colors"
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && filteredResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                <div className="p-2">
                  <p className="text-xs text-muted-foreground mb-2 px-2">Search Results</p>
                  {filteredResults.slice(0, 6).map((result) => {
                    const IconComponent = result.icon;
                    return (
                      <button
                        key={result.id}
                        onClick={() => handleSearchResultClick(result)}
                        className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors text-left"
                      >
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{result.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{result.type.replace('-', ' ')}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* No Results Message */}
            {showSearchResults && searchQuery.length > 0 && filteredResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">No results found for "{searchQuery}"</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          {/* New Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                New
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsNewFileOpen(true)}>
                <File className="mr-2 h-4 w-4" />
                New File
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsNewFolderOpen(true)}>
                <FolderPlus className="mr-2 h-4 w-4" />
                New Folder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback className="gradient-primary text-primary-foreground">
                    JD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">John Doe</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    john.doe@example.com
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* New File Modal */}
      <Dialog open={isNewFileOpen} onOpenChange={setIsNewFileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-name">File Name</Label>
              <Input
                id="file-name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="My Study Notes"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsNewFileOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateFile} className="gradient-primary">
                Create File
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Folder Modal */}
      <Dialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen}>
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
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsNewFolderOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateFolder} className="gradient-primary">
                Create Folder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};
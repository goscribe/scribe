"use client";

import { Search, User, Settings, LogOut, Plus, Share, UserPlus, ChevronDown, File, FolderPlus, FileText, Brain, BookOpen, Headphones, LogIn, Mail, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useSession } from "@/lib/useSession";
import Link from "next/link";
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
import { ColorPicker } from "@/components/ui/color-picker";
import { trpc } from "@/lib/trpc";
import { Textarea } from "./ui/textarea";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavbarProps {
  onNewClick?: () => void;
  onCreateFile?: (name: string) => void;
  onCreateFolder?: (name: string) => void;
}

export const Navbar = ({ onNewClick, onCreateFile, onCreateFolder }: NavbarProps) => {
  const { data: session, isLoading, error } = useSession();
  const router = useRouter();
  // Determine status based on @auth session
  const status = isLoading ? "loading" : session?.user ? "authenticated" : "unauthenticated";
  
  // Get user initials for avatar fallback
  const getUserInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (session?.user?.name) return session.user.name;
    if (session?.user?.email) return session.user.email.split('@')[0];
    return "User";
  };

  const [isNewFileOpen, setIsNewFileOpen] = useState(false);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fileName, setFileName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [folderColor, setFolderColor] = useState("#6366f1");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const { data: searchResults, isLoading: isSearching, error: searchError } = trpc.workspace.search.useQuery({
    query: searchQuery,
  }, {
    enabled: !!searchQuery,
  });
  

  const createFile = trpc.workspace.create.useMutation();
  const createFolder = trpc.workspace.createFolder.useMutation();
    const [description, setDescription] = useState("");
    
  const handleCreateFile = () => {
    if (fileName.trim()) {
      onCreateFile?.(fileName);
      createFile.mutate({
        name: fileName,
        description: description || undefined,
        ...(folderId && { parentId: folderId as string }),
      });
      setFileName("");
      setIsNewFileOpen(false);
    }
  };

  const handleCreateFolder = () => {
    if (folderName.trim()) {
      onCreateFolder?.(folderName);
      createFolder.mutate({
        name: folderName,
        color: folderColor,
        ...(folderId && { parentId: folderId as string }),
      });
      setFolderName("");
      setFolderColor("#6366f1"); // Reset to default
      setIsNewFolderOpen(false);
    }
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.length > 0) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const { folderId } = useParams();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="flex h-14 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => router.push("/dashboard")}>
          <img src="/logo.png" alt="Scribe Logo" className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
          <span className="text-lg font-bold text-foreground">
            scribe
          </span>
        </div>

        {/* Search Bar */}
        {status === "authenticated" && <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="Search workspaces..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              className="pl-10 h-9 bg-muted/30 border border-border/50 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all duration-200 text-sm"
            />
            {/* Loading State */}
            {isSearching && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                <div className="p-2">
                  <p className="text-xs text-muted-foreground mb-2 px-2">Searching...</p>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-3 p-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-3 w-3/4" />
                          <Skeleton className="h-2 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Search Results Dropdown */} 
            {showSearchResults && !isSearching && searchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                <div className="p-2">
                  <p className="text-xs text-muted-foreground mb-2 px-2">Search Results</p>
                  {searchResults.slice(0, 6).map((result) => {
                    return (
                      <button
                        key={result.id}
                        onClick={() => router.push(`/workspace/${result.id}`)}
                        className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{result.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">{result.description || "No description"}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* No Results Message */}
            {showSearchResults && !isSearching && searchQuery.length > 0 && searchResults && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">No results found for &quot;{searchQuery}&quot;</p>
                </div>
              </div>
            )}
          </div>
        </div>}

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          {status === "loading" ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : status === "authenticated" ? (
            <>
              {/* New Dropdown */}
              <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 border-border/50 hover:bg-muted/50">
                <Plus className="h-4 w-4 mr-1.5" />
                New
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
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 hover:bg-muted/50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={session?.user?.image || undefined} 
                        alt={getUserDisplayName()} 
                      />
                      <AvatarFallback className="text-xs border border-border/50 bg-muted/20">
                        {getUserInitials(session?.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end">
                  <div className="flex items-center gap-3 p-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage 
                        src={session?.user?.image || undefined} 
                        alt={getUserDisplayName()} 
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getUserInitials(session?.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5 leading-none">
                      <p className="font-medium text-sm">{getUserDisplayName()}</p>
                      {session?.user?.email && (
                        <p className="w-[180px] truncate text-xs text-muted-foreground">
                          {session.user.email}
                        </p>
                      )}
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
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive" 
                    onClick={async () => {
                      try {
                        // await signOut.mutateAsync();
                        window.location.href = '/';
                      } catch (error) {
                        console.error('Sign out failed:', error);
                      }
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/signup">
                <Button variant="outline" size="sm" className="h-9 border-border/50 hover:bg-muted/50">
                  Sign Up
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="h-9 bg-primary/90 hover:bg-primary">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
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
            <div className="space-y-2">
              <Label htmlFor="file-description">Description</Label>
              <Textarea
                id="file-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description for your file"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsNewFileOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateFile}>
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
            <div className="space-y-2">
              <Label>Folder Color</Label>
              <ColorPicker
                value={folderColor}
                onChange={setFolderColor}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsNewFolderOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateFolder}>
                Create Folder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};
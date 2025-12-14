"use client";

import { Search, Plus, File, FolderPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useSession } from "@/lib/useSession";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import CreateFileModal from "../modals/create-file-modal";
import CreateFolderModal from "../modals/create-folder-modal";

interface NavbarProps {
  onNewClick?: () => void;
  onCreateFile?: (name: string) => void;
  onCreateFolder?: (name: string) => void;
}

export const Navbar = ({}: NavbarProps) => {
  const { data: session, isLoading } = useSession();
  const router = useRouter();
  // Determine status based on @auth session
  const status = isLoading ? "loading" : session?.user ? "authenticated" : "unauthenticated";

  const [isNewFileOpen, setIsNewFileOpen] = useState(false);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const { data: searchResults, isLoading: isSearching } = trpc.workspace.search.useQuery({
    query: searchQuery,
  }, {
    enabled: !!searchQuery,
  });

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.length > 0) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const utils = trpc.useUtils();

  return (
    <header className="fixed top-0 z-40 w-full border-b border-border bg-background">
      <div className="flex h-14 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => router.push("/storage")}>
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
              <Button variant="outline" size="sm">
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

      <CreateFileModal isOpen={isNewFileOpen} setIsOpen={setIsNewFileOpen} onSuccess={() => {
        utils.workspace.list.invalidate();
        utils.workspace.getStats.invalidate();
      }} />
      <CreateFolderModal isOpen={isNewFolderOpen} setIsOpen={setIsNewFolderOpen} onSuccess={() => {
        utils.workspace.list.invalidate();
        utils.workspace.getStats.invalidate();
      }} />

    </header>
  );
};
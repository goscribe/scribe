"use client";

import { Search, Plus, File, FolderPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
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
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search results on click outside (avoids onBlur race condition)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <header className="fixed top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-5">
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          onClick={() => router.push("/storage")}
        >
          <img
            src="/logo.png"
            alt="Scribe Logo"
            className="h-6 w-6 transition-transform duration-200 group-hover:scale-105"
          />
          <span className="text-[15px] font-bold tracking-tight text-foreground hidden sm:inline">
            scribe
          </span>
        </div>

        {/* Search Bar */}
        {status === "authenticated" && (
          <div className="flex-1 max-w-lg mx-6" ref={searchContainerRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60 z-10" />
              <Input
                placeholder="Search workspaces..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
                className="pl-9 pr-3 h-8 bg-muted/40 border-0 ring-1 ring-border/40 focus-visible:ring-2 focus-visible:ring-primary/30 rounded-lg text-[13px] placeholder:text-muted-foreground/50 transition-all duration-200"
              />
              {/* Keyboard shortcut hint */}
              {!searchQuery && (
                <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground/50">
                  /
                </kbd>
              )}

              {/* Loading State */}
              {isSearching && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-popover border border-border/60 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-2">
                    <div className="flex items-center gap-2 px-2 py-1.5">
                      <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Searching...</span>
                    </div>
                    <div className="space-y-1">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg">
                          <Skeleton className="h-8 w-8 rounded-lg" />
                          <div className="flex-1 space-y-1.5">
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
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-popover border border-border/60 rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto">
                  <div className="p-1.5">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50 px-2.5 py-1.5">
                      Results
                    </p>
                    {searchResults.slice(0, 6).map((result) => (
                      <button
                        key={result.id}
                        onMouseDown={() => {
                          router.push(`/workspace/${result.id}`);
                          setShowSearchResults(false);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-muted/60 transition-colors text-left group"
                      >
                        <div className="h-8 w-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0 group-hover:bg-muted">
                          <File className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{result.title}</p>
                          <p className="text-[11px] text-muted-foreground/70 truncate">
                            {result.description || "No description"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {showSearchResults && !isSearching && searchQuery.length > 0 && searchResults && searchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-popover border border-border/60 rounded-xl shadow-xl z-50">
                  <div className="p-6 text-center">
                    <Search className="h-5 w-5 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No results for &quot;{searchQuery}&quot;
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <ThemeToggle />
          {status === "loading" ? (
            <div className="flex items-center gap-2 px-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            </div>
          ) : status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 px-3 text-xs font-medium gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => setIsNewFileOpen(true)} className="gap-2.5">
                  <File className="h-4 w-4 text-muted-foreground" />
                  New Workspace
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsNewFolderOpen(true)} className="gap-2.5">
                  <FolderPlus className="h-4 w-4 text-muted-foreground" />
                  New Folder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/signup">
                <Button variant="ghost" size="sm" className="h-8 text-xs font-medium">
                  Sign Up
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="h-8 text-xs font-medium">
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
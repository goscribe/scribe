"use client";

import { BookOpen, Brain, FileText, Podcast, MessageCircle, Users, Settings, InfoIcon, LayoutGrid, FileText as Content } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Available workspace tabs for navigation
 */
export type WorkspaceTab = 'def' | 'study-guide' | 'flashcards' | 'worksheet' | 'summaries' | 'podcasts' | 'chat' | 'members' | 'settings';

/**
 * Props for the NavigationTabs component
 */
interface NavigationTabsProps {
  /** Currently active tab */
  activeTab: WorkspaceTab;
  /** Callback function when tab changes */
  onTabChange: (tab: WorkspaceTab) => void;
  /** Whether the sidebar is collapsed */
  isCollapsed: boolean;
}

/**
 * Navigation tabs configuration with sections and metadata
 * Each tab includes icon, label, description, and optional section grouping
 */
const tabs = [
  {
    id: 'def' as WorkspaceTab,
    label: 'Default(You should not see this)',
    icon: InfoIcon,
    description: 'Invisible default tab',
    invisible: true,
  },
  {
    section: 'Study Tools'
  },
  {
    id: 'study-guide' as WorkspaceTab,
    label: 'Study Guide',
    icon: BookOpen,
    description: 'AI-generated summaries and notes'
  },
  {
    id: 'flashcards' as WorkspaceTab,
    label: 'Flashcards',
    icon: LayoutGrid,
    description: 'Interactive Q&A cards'
  },
  {
    id: 'worksheet' as WorkspaceTab,
    label: 'Worksheet',
    icon: Content,
    description: 'Practice exercises and problems'
  },
  {
    section: 'Media'
  },
  {
    id: 'podcasts' as WorkspaceTab,
    label: 'Podcasts',
    icon: Podcast,
    description: 'Audio content and transcripts'
  },
  {
    section: 'Communication'
  },
  {
    id: 'chat' as WorkspaceTab,
    label: 'Chat',
    icon: MessageCircle,
    description: 'Real-time messaging and collaboration'
  },
  {
    section: 'Workspace'
  },
  {
    id: 'members' as WorkspaceTab,
    label: 'Members',
    icon: Users,
    description: 'Workspace members',
  },
  {
    id: 'settings' as WorkspaceTab,
    label: 'Settings',
    icon: Settings,
    description: 'Workspace settings',
  }
];

/**
 * Navigation tabs component for workspace sidebar
 * 
 * Renders a list of navigation tabs with sections, icons, and tooltips.
 * Supports both collapsed and expanded states with appropriate styling.
 * 
 * @param props - NavigationTabsProps
 * @returns JSX element containing the navigation tabs
 */
export const NavigationTabs = ({ activeTab, onTabChange, isCollapsed }: NavigationTabsProps) => {
  return (
    <TooltipProvider delayDuration={300}>
      <nav className={cn(isCollapsed ? "px-1 flex flex-col items-center" : "px-2")}>
        {tabs.map((tab, index) => {
          // Section header
          if ('section' in tab) {
            if (isCollapsed) {
              return <div key={`section-${index}`} className="h-px bg-border my-3 w-8" />;
            }
            return (
              <div key={`section-${index}`} className={`px-2 pt-4 pb-2`}>
                <div className="text-xs font-semibold text-muted-foreground">
                  {tab.section}
                </div>
              </div>
            );
          }

          const Icon = tab.icon!;
          const isActive = activeTab === tab.id;

          if (tab.invisible) { 
            return <div key={tab.id}></div>; 
          }

          return (
            <Tooltip key={tab.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onTabChange(tab.id!)}
                  className={cn(
                    "flex items-center rounded-sm transition-colors mb-0.5",
                    isCollapsed ? "justify-center w-10 h-10" : "w-full gap-2 p-1.5 text-left",
                    isActive
                      ? "bg-muted text-muted-foreground"
                      : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className={cn(
                    "h-4 w-4 flex-shrink-0",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )} />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "text-sm",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {tab.label}
                      </div>
                    </div>
                  )}
                </button>
              </TooltipTrigger>
              {!isCollapsed && (
                <TooltipContent side="right" className="text-xs">
                  {tab.description}
                </TooltipContent>
              )}
              {isCollapsed && (
                <TooltipContent side="right" className="text-xs">
                  {tab.label}
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </nav>
    </TooltipProvider>
  );
};

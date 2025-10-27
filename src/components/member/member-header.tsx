"use client";

import { UserPlus, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

/**
 * Props for the MemberHeader component
 */
interface MemberHeaderProps {
  /** Number of members */
  memberCount: number;
  /** Search query */
  searchQuery: string;
  /** Callback when search query changes */
  onSearchChange: (query: string) => void;
  /** Callback when invite button is clicked */
  onInviteClick: () => void;
  /** Whether invite is loading */
  isInviting?: boolean;
  /** Current user's role */
  currentUserRole: "owner" | "admin" | "member";
}

/**
 * Member header component with search and invite functionality
 * 
 * Features:
 * - Member count display
 * - Search functionality
 * - Invite member button (role-based visibility)
 * - Responsive design
 * 
 * @param props - MemberHeaderProps
 * @returns JSX element containing the member header
 */
export const MemberHeader = ({
  memberCount,
  searchQuery,
  onSearchChange,
  onInviteClick,
  isInviting = false,
  currentUserRole
}: MemberHeaderProps) => {
  const canInvite = currentUserRole === "owner" || currentUserRole === "admin";

  return (
    <div className="space-y-4">
      {/* Title and member count */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium">Members</h3>
          <p className="text-sm text-muted-foreground">
            {memberCount} member{memberCount !== 1 ? 's' : ''}
          </p>
        </div>
        {canInvite && (
          <Button 
            onClick={onInviteClick} 
            size="sm" 
            variant="outline"
            className="h-8 gap-1.5"
            disabled={isInviting}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Invite
          </Button>
        )}
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Role info */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Users className="h-3 w-3" />
        <span>Your role: </span>
        <Badge 
          variant="outline" 
          className={
            currentUserRole === "owner" 
              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
              : currentUserRole === "admin"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-gray-50 text-gray-700 border-gray-200"
          }
        >
          {currentUserRole}
        </Badge>
      </div>
    </div>
  );
};

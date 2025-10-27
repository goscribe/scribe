"use client";

import { useState } from "react";
import { MoreHorizontal, UserMinus, Shield, Crown, User, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

/**
 * Member role type
 */
export type MemberRole = "owner" | "admin" | "member";

/**
 * Member interface
 */
export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: MemberRole;
  joinedAt: Date;
  lastActive?: Date;
  isOnline?: boolean;
}

/**
 * Props for the MemberList component
 */
interface MemberListProps {
  /** Array of workspace members */
  members: Member[];
  /** Current user's role in the workspace */
  currentUserRole: MemberRole;
  /** Callback when member role is changed */
  onRoleChange: (memberId: string, newRole: MemberRole) => void;
  /** Callback when member is removed */
  onRemoveMember: (memberId: string) => void;
  /** Whether operations are loading */
  isLoading?: boolean;
}

/**
 * Gets the appropriate icon for member role
 * @param role - The member role
 * @returns JSX element with role icon
 */
const getRoleIcon = (role: MemberRole) => {
  switch (role) {
    case "owner":
      return <Crown className="h-3 w-3" />;
    case "admin":
      return <Shield className="h-3 w-3" />;
    case "member":
      return <User className="h-3 w-3" />;
  }
};

/**
 * Gets the appropriate badge styling for member role
 * @param role - The member role
 * @returns CSS classes for the badge
 */
const getRoleBadgeClasses = (role: MemberRole) => {
  switch (role) {
    case "owner":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "admin":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "member":
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

/**
 * Gets user initials for avatar fallback
 * @param name - The user's name
 * @returns Initials string
 */
const getUserInitials = (name: string) => {
  return name
    .split(" ")
    .map(word => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Formats date for display
 * @param date - The date to format
 * @returns Formatted date string
 */
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

/**
 * Member list component for displaying and managing workspace members
 * 
 * Features:
 * - Member cards with avatar, name, email, and role
 * - Role-based actions (change role, remove member)
 * - Online status indicators
 * - Responsive design with proper spacing
 * - Confirmation dialogs for destructive actions
 * 
 * @param props - MemberListProps
 * @returns JSX element containing the member list
 */
export const MemberList = ({
  members,
  currentUserRole,
  onRoleChange,
  onRemoveMember,
  isLoading = false
}: MemberListProps) => {
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  /**
   * Checks if current user can perform action on target member
   * @param targetMemberRole - The role of the member being acted upon
   * @param action - The action being performed
   * @returns Whether the action is allowed
   */
  const canPerformAction = (targetMemberRole: MemberRole, action: 'changeRole' | 'remove') => {
    // Owners can do everything
    if (currentUserRole === 'owner') return true;
    
    // Admins can manage members but not owners
    if (currentUserRole === 'admin') {
      if (action === 'changeRole') return targetMemberRole !== 'owner';
      if (action === 'remove') return targetMemberRole !== 'owner';
    }
    
    // Members can't perform any management actions
    return false;
  };

  /**
   * Handles member removal confirmation
   * @param memberId - The ID of the member to remove
   */
  const handleRemoveMember = (memberId: string) => {
    onRemoveMember(memberId);
    setMemberToRemove(null);
  };

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <Card key={member.id} className="group">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar with online status */}
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-sm">
                      {getUserInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  {member.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>

                {/* Member info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm truncate">{member.name}</h3>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs gap-1", getRoleBadgeClasses(member.role))}
                    >
                      {getRoleIcon(member.role)}
                      {member.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Joined {formatDate(member.joinedAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={isLoading}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {/* Role change options */}
                  {canPerformAction(member.role, 'changeRole') && (
                    <>
                      {member.role !== 'admin' && (
                        <DropdownMenuItem
                          onClick={() => onRoleChange(member.id, 'admin')}
                          disabled={isLoading}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Make Admin
                        </DropdownMenuItem>
                      )}
                      {member.role !== 'member' && (
                        <DropdownMenuItem
                          onClick={() => onRoleChange(member.id, 'member')}
                          disabled={isLoading}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Make Member
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                    </>
                  )}
                  
                  {/* Remove member option */}
                  {canPerformAction(member.role, 'remove') && (
                    <DropdownMenuItem
                      onClick={() => setMemberToRemove(member.id)}
                      className="text-destructive focus:text-destructive"
                      disabled={isLoading}
                    >
                      <UserMinus className="h-4 w-4 mr-2" />
                      Remove Member
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Remove member confirmation dialog */}
      <AlertDialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this member from the workspace? 
              They will lose access to all workspace content and this action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => memberToRemove && handleRemoveMember(memberToRemove)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

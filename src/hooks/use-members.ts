"use client";

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Member, MemberRole } from "@/components/member/member-list";

/**
 * Props for the useMembers hook
 */
interface UseMembersProps {
  /** Workspace ID */
  workspaceId: string;
}

/**
 * Custom hook for managing workspace members
 * 
 * Features:
 * - Fetch workspace members
 * - Search and filter members
 * - Invite new members
 * - Change member roles
 * - Remove members
 * - Real-time updates via Pusher
 * 
 * @param props - UseMembersProps
 * @returns Member management state and functions
 */
export const useMembers = ({ workspaceId }: UseMembersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Fetch workspace members
  const { 
    data: members = [], 
    isLoading, 
    error, 
    refetch 
  } = trpc.workspace.members.getMembers.useQuery(
    { workspaceId },
    { enabled: !!workspaceId }
  );

  // Get current user's role in workspace
  const { data: currentUserRole = "member" } = trpc.workspace.members.getCurrentUserRole.useQuery(
    { workspaceId },
    { enabled: !!workspaceId }
  );

  // Invite member mutation
  const inviteMemberMutation = trpc.workspace.members.inviteMember.useMutation({
    onSuccess: () => {
      setIsInviteModalOpen(false);
      refetch();
    },
  });

  // Change member role mutation
  const changeRoleMutation = trpc.workspace.members.changeMemberRole.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Remove member mutation
  const removeMemberMutation = trpc.workspace.members.removeMember.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;
    
    const query = searchQuery.toLowerCase();
    return members.filter((member: Member) =>
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query)
    );
  }, [members, searchQuery]);

  /**
   * Handles inviting a new member
   * @param email - The email address to invite
   * @param role - The role to assign to the new member
   */
  const inviteMember = (email: string, role: string) => {
    inviteMemberMutation.mutate({
      workspaceId,
      email,
      role: role as "member" | "admin",
    });
  };

  /**
   * Handles changing a member's role
   * @param memberId - The ID of the member
   * @param newRole - The new role to assign
   */
  const changeMemberRole = (memberId: string, newRole: MemberRole) => {
    changeRoleMutation.mutate({
      workspaceId,
      memberId,
      role: newRole as "member" | "admin",
    });
  };

  /**
   * Handles removing a member from the workspace
   * @param memberId - The ID of the member to remove
   */
  const removeMember = (memberId: string) => {
    removeMemberMutation.mutate({
      workspaceId,
      memberId,
    });
  };

  /**
   * Opens the invite modal
   */
  const openInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  /**
   * Closes the invite modal
   */
  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  return {
    // State
    members: filteredMembers,
    searchQuery,
    isInviteModalOpen,
    currentUserRole: currentUserRole as MemberRole,
    
    // Loading states
    isLoading,
    isInviting: inviteMemberMutation.isPending,
    isChangingRole: changeRoleMutation.isPending,
    isRemovingMember: removeMemberMutation.isPending,
    
    // Error states
    error,
    inviteError: inviteMemberMutation.error?.message,
    roleChangeError: changeRoleMutation.error?.message,
    removeMemberError: removeMemberMutation.error?.message,
    
    // Actions
    setSearchQuery,
    inviteMember,
    changeMemberRole,
    removeMember,
    openInviteModal,
    closeInviteModal,
    refetch,
  };
};

"use client";

import { useParams } from "next/navigation";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Users, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MemberHeader } from "@/components/member/member-header";
import { MemberList } from "@/components/member/member-list";
import { MemberInviteModal } from "@/components/member/member-invite-modal";
import { useMembers } from "@/hooks/use-members";

/**
 * Members page component for managing workspace members
 * 
 * Features:
 * - Display workspace members with roles and status
 * - Search and filter members
 * - Invite new members via email
 * - Change member roles (admin/member)
 * - Remove members from workspace
 * - Role-based permissions and actions
 * - Real-time updates via Pusher
 * 
 * @returns JSX element containing the members page
 */
export default function MembersPage() {
  const params = useParams();
  const workspaceId = params.id as string;

  // Custom hook for member management
  const {
    members,
    searchQuery,
    isInviteModalOpen,
    currentUserRole,
    isLoading,
    isInviting,
    isChangingRole,
    isRemovingMember,
    error,
    inviteError,
    roleChangeError,
    removeMemberError,
    setSearchQuery,
    inviteMember,
    changeMemberRole,
    removeMember,
    openInviteModal,
    closeInviteModal,
  } = useMembers({ workspaceId });

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton type="members" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-semibold text-foreground">Members</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Manage workspace members and permissions
          </p>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading members: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Member management interface */}
      <div className="space-y-6">
        {/* Header with search and invite */}
        <MemberHeader
          memberCount={members.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onInviteClick={openInviteModal}
          isInviting={isInviting}
          currentUserRole={currentUserRole}
        />

        {/* Error alerts */}
        {(inviteError || roleChangeError || removeMemberError) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {inviteError || roleChangeError || removeMemberError}
            </AlertDescription>
          </Alert>
        )}

        {/* Member list or empty state */}
        {members.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No members found"
            description={
              searchQuery 
                ? "No members match your search criteria"
                : "This workspace doesn't have any members yet"
            }
            action={
              (currentUserRole === "owner" || currentUserRole === "admin") && !searchQuery
                ? {
                    label: "Invite Member",
                    onClick: openInviteModal
                  }
                : undefined
            }
          />
        ) : (
          <MemberList
            members={members}
            currentUserRole={currentUserRole}
            onRoleChange={changeMemberRole}
            onRemoveMember={removeMember}
            isLoading={isChangingRole || isRemovingMember}
          />
        )}
      </div>

      {/* Invite member modal */}
      <MemberInviteModal
        isOpen={isInviteModalOpen}
        onOpenChange={closeInviteModal}
        onInvite={inviteMember}
        isLoading={isInviting}
        error={inviteError}
      />
    </div>
  );
}


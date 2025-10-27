"use client";

import { useState } from "react";
import { Mail, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * Props for the MemberInviteModal component
 */
interface MemberInviteModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** Callback when invite is sent */
  onInvite: (email: string, role: string) => void;
  /** Whether the invite is being sent */
  isLoading?: boolean;
  /** Error message to display */
  error?: string;
}

/**
 * Member invite modal component for inviting new members to workspace
 * 
 * Features:
 * - Email input with validation
 * - Role selection (Admin, Member)
 * - Error handling and display
 * - Loading states
 * - Form validation
 * 
 * @param props - MemberInviteModalProps
 * @returns JSX element containing the invite modal
 */
export const MemberInviteModal = ({
  isOpen,
  onOpenChange,
  onInvite,
  isLoading = false,
  error
}: MemberInviteModalProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [emailError, setEmailError] = useState("");

  /**
   * Validates email format
   * @param email - The email to validate
   * @returns Whether the email is valid
   */
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Handles form submission
   */
  const handleSubmit = () => {
    setEmailError("");
    
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    onInvite(email.trim(), role);
  };

  /**
   * Handles modal close and resets form
   */
  const handleClose = () => {
    setEmail("");
    setRole("member");
    setEmailError("");
    onOpenChange(false);
  };

  /**
   * Handles Enter key press
   * @param e - Keyboard event
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Member
          </DialogTitle>
          <DialogDescription>
            Send an invitation to join this workspace. They will receive an email with instructions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            {emailError && (
              <p className="text-sm text-destructive">{emailError}</p>
            )}
          </div>

          {/* Role selection */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                      Member
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Can view and edit content
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Admin
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Can manage members and settings
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Error display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !email.trim()}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Sending...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Send Invite
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

"use client";

import { useRef, useState } from "react";
import { User, Mail, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/lib/useSession";
import { toast } from "sonner";
import ProfilePicture from "@/components/profilePicture";
import { trpc } from "@/lib/trpc";

export default function SettingsPage() {
  const { data: session, isLoading } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [name, setName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const utils = trpc.useUtils();

  const updateProfileMutation = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      utils.auth.getSession.invalidate();
    }
  });

  const uploadProfilePictureMutation = trpc.auth.uploadProfilePicture.useMutation();

  // Initialize name from session when loaded
  useState(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  });

  const handleSave = async () => {
    setIsSaving(true);
    await updateProfileMutation.mutateAsync({
      name: name,
    });

    toast.success("Profile updated successfully!");
    setIsSaving(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    const file = e.target.files?.[0];
    if (file) {
      const result = await uploadProfilePictureMutation.mutateAsync();

      await fetch(result.signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      utils.auth.getSession.invalidate();
      toast.success("Profile picture updated successfully!");
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted/50 rounded w-1/3"></div>
          <div className="h-96 bg-muted/50 rounded"></div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Not Signed In</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Please sign in to access your settings.
          </p>
          <Button asChild variant="outline" size="sm">
            <a href="/login">Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your account settings and preferences.
          </p>
        </div>

        <Separator />

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile</CardTitle>
            <CardDescription>
              Update your personal information and profile picture.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <ProfilePicture id={session.user.id} name={session.user.name || "No Name"} />
              <div className="space-y-1">
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                  {isUploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" id="profile-picture-input" />
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or GIF. Max 2MB.
                </p>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Display Name
              </Label>
              <Input
                id="name"
                value={name || session.user.name || ""}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="max-w-md"
              />
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email Address
              </Label>
              <Input
                id="email"
                value={session.user.email || ""}
                disabled
                className="max-w-md bg-muted/50"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed.
              </p>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account</CardTitle>
            <CardDescription>
              Manage your account settings and subscription.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Delete Account</p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete your account and all data.
                </p>
              </div>
              <Button variant="destructive" size="sm" disabled>
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

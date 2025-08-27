"use client";

import { useSession } from "@/lib/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Brain, BookOpen, Headphones, Plus, Sparkles } from "lucide-react";

export default function WorkspacePage() {
  const { data: session, isLoading, error } = useSession();
  const router = useRouter();
  
  // Determine status based on @auth session
  const status = isLoading ? "loading" : session?.user ? "authenticated" : "unauthenticated";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!
          </h1>
        </div>
        <p className="text-muted-foreground">
          Ready to continue your learning journey?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="card-hover cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Plus className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-medium">New Note</h3>
                <p className="text-sm text-muted-foreground">Create a new study note</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-medium">AI Study Guide</h3>
                <p className="text-sm text-muted-foreground">Generate with AI</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-medium">Organize</h3>
                <p className="text-sm text-muted-foreground">Manage your folders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Headphones className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-medium">Listen</h3>
                <p className="text-sm text-muted-foreground">Audio learning</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Recent Notes</span>
            </CardTitle>
            <CardDescription>
              Your latest study materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">React Fundamentals</p>
                  <p className="text-sm text-muted-foreground">Updated 2 hours ago</p>
                </div>
                <Button variant="ghost" size="sm">Open</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">JavaScript Study Guide</p>
                  <p className="text-sm text-muted-foreground">Updated yesterday</p>
                </div>
                <Button variant="ghost" size="sm">Open</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI Insights</span>
            </CardTitle>
            <CardDescription>
              Personalized learning recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="font-medium text-primary">Study Reminder</p>
                <p className="text-sm text-muted-foreground">
                  You have 3 notes that could benefit from review
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="font-medium text-primary">New Feature</p>
                <p className="text-sm text-muted-foreground">
                  Try our new AI-powered quiz generator
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

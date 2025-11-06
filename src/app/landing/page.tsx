"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { 
  Brain, 
  Sparkles, 
  BookOpen, 
  Users, 
  Zap, 
  Shield, 
  ChevronRight,
  Star,
  ArrowRight,
  Check,
  Headphones,
  FileText,
  MessageSquare
} from "lucide-react";
import { Footer } from "@/components/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                AI-Powered Learning Platform
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Transform Your Learning
              <span className="text-primary block mt-2">With AI</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create intelligent flashcards, generate AI podcasts from your notes, 
              and collaborate with classmates in real-time. 
              The ultimate study companion for modern students.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-base px-8 py-6 shadow-lg hover:shadow-xl">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base px-8 py-6 border-2"
                >
                  Learn More
                </Button>
              </Link>
            </div>
            
            {/* <div className="flex items-center justify-center gap-8 pt-8">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="h-10 w-10 rounded-full bg-muted border-2 border-background"
                  />
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Trusted by 10,000+ students
                </p>
              </div>
            </div> */}
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-background">
          <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">
              Everything you need to excel
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful AI tools designed to make studying more effective and enjoyable
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-border/50 p-8 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Smart Flashcards</h3>
                <p className="text-muted-foreground">
                  AI-generated flashcards that adapt to your learning pace and identify knowledge gaps
                </p>
              </div>
            </Card>
            
            <Card className="border-2 border-border/50 p-8 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">AI Podcasts</h3>
                <p className="text-muted-foreground">
                  Turn your notes into engaging audio content for learning on the go
                </p>
              </div>
            </Card>
            
            <Card className="border-2 border-border/50 p-8 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Study Guides</h3>
                <p className="text-muted-foreground">
                  Comprehensive study materials generated from your documents and notes
                </p>
              </div>
            </Card>
            
            <Card className="border-2 border-border/50 p-8 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Collaborative Chat</h3>
                <p className="text-muted-foreground">
                  Study together with classmates in real-time with shared workspaces
                </p>
              </div>
            </Card>
            
            <Card className="border-2 border-border/50 p-8 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Practice Tests</h3>
                <p className="text-muted-foreground">
                  Auto-generated worksheets and quizzes to test your knowledge
                </p>
              </div>
            </Card>
            
            <Card className="border-2 border-border/50 p-8 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Adaptive Learning</h3>
                <p className="text-muted-foreground">
                  Adaptive and research-proven learning for maximum retention and comprehension. 
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      {/* <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">
              Loved by students worldwide
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our users have to say
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Medical Student",
                content: "Scribe transformed how I study. The AI-generated flashcards save me hours of prep time.",
              },
              {
                name: "Marcus Johnson",
                role: "Computer Science Major",
                content: "The podcast feature is incredible. I can review concepts during my commute.",
              },
              {
                name: "Emily Rodriguez",
                role: "Law Student",
                content: "Collaborative workspaces made group study sessions so much more productive.",
              },
            ].map((testimonial, i) => (
              <Card key={i} className="border-2 border-border/50 p-8">
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold">
              Ready to ace your exams?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of students already using Scribe to improve their grades
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-base px-8 py-6 shadow-lg hover:shadow-xl">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base px-8 py-6 border-2"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required • 14-day free trial
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

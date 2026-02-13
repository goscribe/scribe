"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Brain, 
  Sparkles, 
  Zap, 
  Shield, 
  ArrowRight,
  Headphones,
  FileText,
  Users,
  Upload,
  BookOpen,
} from "lucide-react";
import { Footer } from "@/components/navigation/footer";

const features = [
  {
    icon: FileText,
    title: "Study Guides",
    description: "Upload your notes, PDFs, or slides. Get a comprehensive, exam-ready study guide in seconds.",
  },
  {
    icon: Brain,
    title: "Smart Flashcards",
    description: "AI-generated cards with spaced repetition. Adapts to what you know and what needs work.",
  },
  {
    icon: Zap,
    title: "Practice Worksheets",
    description: "Auto-generated problems with AI grading and detailed mark schemes. Know exactly where you stand.",
  },
  {
    icon: Headphones,
    title: "AI Podcasts",
    description: "Turn any material into a multi-speaker podcast. Learn on the go, in your own time.",
  },
  {
    icon: Users,
    title: "Collaborative Workspaces",
    description: "Invite classmates, share study materials, and chat in real-time. Study better together.",
  },
  {
    icon: Shield,
    title: "Adaptive Learning",
    description: "SM-2 spaced repetition, progress tracking, and study streaks. Research-proven methods built in.",
  },
];

const steps = [
  {
    num: "1",
    title: "Upload your materials",
    description: "Drop in PDFs, lecture slides, images, or notes. Scribe handles the rest.",
    icon: Upload,
  },
  {
    num: "2",
    title: "AI generates your toolkit",
    description: "Study guides, flashcards, worksheets, and podcasts -- all created automatically.",
    icon: Sparkles,
  },
  {
    num: "3",
    title: "Study smarter, not harder",
    description: "Review with spaced repetition, practice with AI-graded tests, and track your progress.",
    icon: BookOpen,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 pt-24 pb-20 lg:pt-36 lg:pb-28">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">AI-powered study platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Stop re-reading.
              <br />
              <span className="text-primary">Start learning.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Upload your notes and Scribe generates study guides, flashcards, 
              practice tests, and podcasts -- so you can focus on understanding, not organizing.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/signup">
                <Button size="lg" className="h-12 px-8 text-sm font-medium shadow-md">
                  Get started free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="h-12 px-8 text-sm font-medium">
                  How it works
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground pt-1">
              Free to use. No credit card required.
            </p>
          </div>
        </div>

        {/* Dot grid background */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-background">
          <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]" />
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
              Three steps from raw notes to exam-ready materials.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step) => (
              <div key={step.num} className="text-center space-y-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything you need to excel
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
              Powerful tools that work together so you can study less and learn more.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-background border border-border rounded-lg p-6 space-y-3 hover:border-primary/30 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to study smarter?
            </h2>
            <p className="text-muted-foreground">
              Join students who are already using Scribe to save time and improve their grades.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup">
                <Button size="lg" className="h-12 px-8 text-sm font-medium shadow-md">
                  Get started free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

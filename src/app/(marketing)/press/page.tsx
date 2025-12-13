"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, Mail } from "lucide-react";

export default function PressPage() {
  const pressReleases = [
    {
      date: "November 15, 2024",
      title: "Scribe Raises $5M Series A to Expand AI Study Tools",
      outlet: "TechCrunch",
      link: "#",
    },
    {
      date: "October 2, 2024",
      title: "Y Combinator-Backed Scribe Hits 10,000 Users",
      outlet: "EdSurge",
      link: "#",
    },
    {
      date: "September 10, 2024",
      title: "How AI is Transforming Student Study Habits",
      outlet: "Forbes",
      link: "#",
    },
    {
      date: "August 5, 2024",
      title: "Scribe Launches Revolutionary AI Podcast Feature",
      outlet: "VentureBeat",
      link: "#",
    },
  ];

  const mediaKit = [
    {
      name: "Scribe Logo Pack",
      description: "High-resolution logos in various formats",
      size: "2.3 MB",
    },
    {
      name: "Product Screenshots",
      description: "Latest screenshots of key features",
      size: "8.7 MB",
    },
    {
      name: "Company Fact Sheet",
      description: "Key facts, figures, and milestones",
      size: "245 KB",
    },
    {
      name: "Executive Bios & Photos",
      description: "Leadership team information",
      size: "4.1 MB",
    },
  ];

  const stats = [
    { label: "Active Users", value: "10,000+" },
    { label: "Flashcards Created", value: "1M+" },
    { label: "Study Hours Saved", value: "50,000+" },
    { label: "Universities", value: "500+" },
  ];

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-5xl font-bold">Press & Media</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Latest news, press releases, and media resources
          </p>
        </div>

        {/* Key Stats */}
        <section className="mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Coverage */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8">Recent Coverage</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {pressReleases.map((release, i) => (
              <Card key={i} className="border-2 border-border/50 p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{release.date}</p>
                    <p className="text-sm font-medium text-primary mt-1">{release.outlet}</p>
                  </div>
                  <h3 className="text-xl font-semibold">{release.title}</h3>
                  <a 
                    href={release.link}
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    Read Article
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Company Overview */}
        <section className="mb-24">
          <Card className="border-2 border-border/50 p-12">
            <h2 className="text-3xl font-bold mb-6">Company Overview</h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                Scribe is an AI-powered study platform that helps students learn more effectively 
                through intelligent flashcards, AI-generated podcasts, and collaborative study tools. 
                Founded in 2023 and backed by Y Combinator, Scribe is transforming how over 10,000 
                students worldwide approach their education.
              </p>
              <div className="grid md:grid-cols-2 gap-8 pt-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Quick Facts</h3>
                  <ul className="space-y-2 text-base">
                    <li>• Founded: 2023</li>
                    <li>• Headquarters: San Francisco, CA</li>
                    <li>• Employees: 15</li>
                    <li>• Funding: $5M Series A</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Leadership</h3>
                  <ul className="space-y-2 text-base">
                    <li>• Alex Chen, Co-founder & CEO</li>
                    <li>• Sarah Kim, Co-founder & CTO</li>
                    <li>• Michael Brown, Head of Product</li>
                    <li>• Jennifer Lee, Head of Growth</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Media Kit */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8">Media Kit</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {mediaKit.map((item, i) => (
              <Card key={i} className="border-2 border-border/50 p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{item.size}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Press Contact */}
        <section>
          <Card className="border-2 border-primary/20 bg-primary/5 p-12">
            <div className="text-center space-y-6">
              <Mail className="h-12 w-12 text-primary mx-auto" />
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Press Inquiries</h2>
                <p className="text-lg text-muted-foreground">
                  For press inquiries, interviews, or additional information
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold">press@scribe.ai</p>
                <p className="text-muted-foreground">We typically respond within 24 hours</p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

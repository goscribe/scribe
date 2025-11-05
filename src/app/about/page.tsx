"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Users, Target, Lightbulb, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold">
              Revolutionizing how students learn
            </h1>
            <p className="text-xl text-muted-foreground">
              We're on a mission to make quality education accessible to everyone through AI
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                Scribe was born out of frustration. As students ourselves, we spent countless 
                hours creating flashcards, summarizing notes, and organizing study materials. 
                We knew there had to be a better way.
              </p>
              <p>
                In 2023, we set out to build the study tool we wished we had. Leveraging the 
                latest advances in AI, we created Scribe - a platform that transforms how 
                students engage with their learning materials.
              </p>
              <p>
                Today, Scribe helps over 10,000 students worldwide study more effectively, 
                retain information better, and achieve their academic goals. We're backed by 
                Y Combinator and a team of advisors from leading education and technology companies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-border/50 p-6">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Student First</h3>
                <p className="text-muted-foreground">
                  Every decision we make starts with how it benefits students
                </p>
              </div>
            </Card>
            
            <Card className="border-2 border-border/50 p-6">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Excellence</h3>
                <p className="text-muted-foreground">
                  We hold ourselves to the highest standards in everything we build
                </p>
              </div>
            </Card>
            
            <Card className="border-2 border-border/50 p-6">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Innovation</h3>
                <p className="text-muted-foreground">
                  We constantly push boundaries to create better learning experiences
                </p>
              </div>
            </Card>
            
            <Card className="border-2 border-border/50 p-6">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Accessibility</h3>
                <p className="text-muted-foreground">
                  Quality education tools should be available to everyone
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">Meet the Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The people working hard to transform education
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Alex Chen",
                role: "Co-founder & CEO",
                bio: "Former Google engineer, Stanford CS grad",
              },
              {
                name: "Sarah Kim",
                role: "Co-founder & CTO",
                bio: "AI researcher, MIT PhD in Machine Learning",
              },
              {
                name: "Michael Brown",
                role: "Head of Product",
                bio: "Previously at Khan Academy and Coursera",
              },
            ].map((member, i) => (
              <Card key={i} className="border-2 border-border/50 p-6">
                <div className="space-y-4 text-center">
                  <div className="h-24 w-24 rounded-full bg-muted mx-auto" />
                  <div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-sm text-primary">{member.role}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investors Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">Backed by the Best</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trusted by leading investors in education and technology
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-12">
            <div className="text-2xl font-bold text-muted-foreground">
              Y Combinator
            </div>
            <div className="text-2xl font-bold text-muted-foreground">
              Sequoia Capital
            </div>
            <div className="text-2xl font-bold text-muted-foreground">
              OpenAI Fund
            </div>
            <div className="text-2xl font-bold text-muted-foreground">
              Founders Fund
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold">
              Join us in transforming education
            </h2>
            <p className="text-xl text-muted-foreground">
              Whether you're a student, educator, or just passionate about learning, 
              we'd love to have you as part of our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-base px-8 py-6">
                  Try Scribe Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/careers">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base px-8 py-6 border-2"
                >
                  View Open Positions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

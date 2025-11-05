"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Check, X, Sparkles } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for trying out Scribe",
      features: [
        { text: "50 AI flashcards per month", included: true },
        { text: "1 AI podcast per month", included: true },
        { text: "Basic study guides", included: true },
        { text: "1 workspace", included: true },
        { text: "Community support", included: true },
        { text: "Unlimited collaborators", included: false },
        { text: "Advanced AI features", included: false },
        { text: "Priority support", included: false },
      ],
      cta: "Get Started",
      href: "/signup",
      variant: "outline" as const,
    },
    {
      name: "Pro",
      price: "$12",
      period: "/month",
      description: "For serious students",
      popular: true,
      features: [
        { text: "Unlimited AI flashcards", included: true },
        { text: "Unlimited AI podcasts", included: true },
        { text: "Advanced study guides", included: true },
        { text: "Unlimited workspaces", included: true },
        { text: "Email support", included: true },
        { text: "Up to 10 collaborators", included: true },
        { text: "Advanced AI features", included: true },
        { text: "Priority support", included: false },
      ],
      cta: "Start Free Trial",
      href: "/signup",
      variant: "default" as const,
    },
    {
      name: "Team",
      price: "$29",
      period: "/month",
      description: "For study groups & classrooms",
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Unlimited collaborators", included: true },
        { text: "Team management", included: true },
        { text: "Shared workspaces", included: true },
        { text: "Analytics dashboard", included: true },
        { text: "Custom AI training", included: true },
        { text: "API access", included: true },
        { text: "24/7 priority support", included: true },
      ],
      cta: "Contact Sales",
      href: "/contact",
      variant: "outline" as const,
    },
  ];

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-5xl font-bold">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your study needs. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`border-2 p-8 relative ${
                plan.popular 
                  ? 'border-primary shadow-xl scale-105' 
                  : 'border-border/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-muted-foreground mt-2">{plan.description}</p>
                </div>
                
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  )}
                </div>
                
                <Link href={plan.href}>
                  <Button 
                    variant={plan.variant} 
                    className="w-full py-6 text-base"
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
                
                <div className="space-y-3 pt-6 border-t">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-primary mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground/50 mt-0.5" />
                      )}
                      <span className={`text-sm ${
                        feature.included 
                          ? 'text-foreground' 
                          : 'text-muted-foreground/50'
                      }`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently asked questions
          </h2>
          
          <div className="space-y-8">
            {[
              {
                q: "Can I change plans anytime?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes, all paid plans come with a 14-day free trial. No credit card required to start.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, debit cards, and PayPal. Enterprise customers can pay via invoice.",
              },
              {
                q: "Can I cancel my subscription?",
                a: "You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
              },
              {
                q: "Do you offer student discounts?",
                a: "Yes! Students with a valid .edu email get 20% off all paid plans.",
              },
            ].map((faq, i) => (
              <div key={i} className="space-y-2">
                <h3 className="text-lg font-semibold">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center space-y-4">
          <h2 className="text-3xl font-bold">
            Ready to start learning smarter?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of students already using Scribe
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-base px-8 py-6">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

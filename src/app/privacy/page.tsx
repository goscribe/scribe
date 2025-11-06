"use client";

import { Footer } from "@/components/footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              At Scribe, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Information We Collect</h2>
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Name and email address when you create an account</li>
                <li>Educational institution information (optional)</li>
                <li>Payment information for premium subscriptions</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Usage Information</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Study materials you upload and create</li>
                <li>Learning progress and analytics</li>
                <li>Collaboration and sharing preferences</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>To provide and maintain our service</li>
              <li>To generate AI-powered study materials</li>
              <li>To improve and personalize your learning experience</li>
              <li>To communicate with you about updates and features</li>
              <li>To process payments and prevent fraud</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your 
              personal information. All data is encrypted in transit and at rest. We never use your 
              study materials to train our AI models without your explicit consent.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Your Rights</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Access and receive a copy of your personal data</li>
              <li>Correct or update your information</li>
              <li>Delete your account and associated data</li>
              <li>Export your study materials</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@scribe.study" className="text-primary hover:underline">
                privacy@scribe.study
              </a>
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

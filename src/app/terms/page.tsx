"use client";

import { Footer } from "@/components/navigation/footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
            <h1 className="text-4xl font-bold">Terms of Service</h1>
            <p className="text-muted-foreground">Effective Date: {new Date().toLocaleDateString()}</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using Scribe, you agree to be bound by these Terms of Service. 
              If you disagree with any part of these terms, you may not access the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              Scribe provides AI-powered study tools including flashcard generation, podcast creation, 
              worksheets, and collaborative study features. We reserve the right to modify or 
              discontinue any part of the service at any time.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. User Accounts</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining account security</li>
              <li>You must be at least 13 years old to use the service</li>
              <li>One person or legal entity may not maintain more than one free account</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You agree not to use Scribe to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Violate any laws or regulations</li>
              <li>Upload copyrighted material without permission</li>
              <li>Share inappropriate or harmful content</li>
              <li>Attempt to gain unauthorized access to the service</li>
              <li>Use the service for commercial purposes without a proper license</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Content Ownership</h2>
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Your Content</h3>
              <p className="text-muted-foreground">
                You retain ownership of all content you upload to Scribe. By uploading content, 
                you grant us a license to process and display it as necessary to provide the service.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Generated Content</h3>
              <p className="text-muted-foreground">
                AI-generated content created through Scribe is owned by you, subject to our 
                acceptable use policy.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Payment Terms</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Subscription fees are billed in advance</li>
              <li>All fees are non-refundable except as required by law</li>
              <li>You can cancel your subscription at any time</li>
              <li>Price changes will be notified 30 days in advance</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              Scribe is provided "as is" without warranties of any kind. We shall not be liable for 
              any indirect, incidental, special, consequential, or punitive damages resulting from 
              your use of the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of any 
              material changes via email or through the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:legal@scribe.study" className="text-primary hover:underline">
                legal@scribe.study
              </a>
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

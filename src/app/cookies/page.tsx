"use client";

import { Footer } from "@/components/footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CookiesPage() {
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
            <h1 className="text-4xl font-bold">Cookie Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">What Are Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device when you 
              visit our website. They help us provide you with a better experience by remembering your 
              preferences and understanding how you use our service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">How We Use Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We use cookies for the following purposes:
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Essential Cookies</h3>
                <p className="text-muted-foreground">
                  Required for the website to function properly. These include authentication cookies 
                  that keep you logged in and security cookies that protect your account.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Functional Cookies</h3>
                <p className="text-muted-foreground">
                  Remember your preferences such as language, theme (dark/light mode), and other 
                  settings to provide a personalized experience.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Analytics Cookies</h3>
                <p className="text-muted-foreground">
                  Help us understand how visitors interact with our website, which pages are most 
                  popular, and how we can improve our service.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Types of Cookies We Use</h2>
            <div className="space-y-3">
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-medium">Session Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Temporary cookies that expire when you close your browser. Used for maintaining 
                  your session state.
                </p>
              </div>
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-medium">Persistent Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Remain on your device for a set period. Used to remember your preferences and 
                  login information.
                </p>
              </div>
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-medium">First-party Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Set by Scribe directly and only accessible by us.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Managing Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You have several options for managing cookies:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Browser Settings:</strong> Most browsers allow you to refuse cookies or delete 
                cookies. The methods for doing so vary from browser to browser.
              </li>
              <li>
                <strong>Cookie Preferences:</strong> You can manage your cookie preferences directly 
                on our website through the cookie settings panel.
              </li>
              <li>
                <strong>Opt-out Links:</strong> You can opt out of analytics cookies by using the 
                opt-out tools provided by analytics services.
              </li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Please note that disabling certain cookies may limit the functionality of our service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Third-party Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may use third-party services that set their own cookies, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Payment processors for handling transactions</li>
              <li>Analytics services to improve our platform</li>
              <li>Customer support tools</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Updates to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices 
              or for legal requirements. We will notify you of any significant changes through our 
              website or via email.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about our use of cookies, please contact us at{" "}
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

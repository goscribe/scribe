"use client";

import Link from "next/link";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  MessageCircle,
  BookOpen,
  GraduationCap,
  Sparkles
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Section - Spans 2 columns on desktop */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <img 
                src="/logo.png" 
                alt="Scribe Logo" 
                className="h-7 w-7 transition-transform duration-200 group-hover:scale-110" 
              />
              <span className="text-xl font-bold">scribe</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Transform your learning with AI-powered study tools. Create flashcards, 
              generate podcasts, and collaborate with classmates.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/goscribe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com/company/scribe-study" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="mailto:hello@scribe.study" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="mailto:hello@scribe.study" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  hello@scribe.study
                </a>
              </li>
              <li>
                <a 
                  href="mailto:press@scribe.study" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  press@scribe.study
                </a>
              </li>
              <li>
                <a 
                  href="mailto:collab@scribe.study" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  collab@scribe.study
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {currentYear} Scribe. All rights reserved.</span>
            </div>
            
            {/* Language/Region Selector and Status */}
            <div className="flex items-center gap-6 text-sm">
              <button className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                English (US)
              </button>
              
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                System Status
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

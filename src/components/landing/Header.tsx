import { Button } from "@/components/ui/button";
import { Search, Plus, User } from "lucide-react";

const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <div className="font-bold text-2xl bg-hero-gradient bg-clip-text text-transparent">
                            Scribe
                        </div>

                        <nav className="hidden md:flex items-center space-x-6">
                            <a href="#features" className="text-muted-foreground hover:text-foreground transition-smooth">
                                Features
                            </a>
                            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-smooth">
                                How it Works
                            </a>
                            <a href="#about" className="text-muted-foreground hover:text-foreground transition-smooth">
                                About
                            </a>
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative hidden lg:block">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <input
                                placeholder="Search files and folders..."
                                className="pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth w-64"
                            />
                        </div>

                        <Button variant="feature" size="sm" className="hidden sm:flex">
                            <Plus className="w-4 h-4 mr-2" />
                            New
                        </Button>

                        <Button variant="ghost" size="sm" className="rounded-full">
                            <User className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
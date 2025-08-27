import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    FileText,
    Heart,
    Brain,
    BookOpen,
    MessageSquare,
    Podcast
} from "lucide-react";

const KeyFeaturesSection = () => {
    const keyFeatures = [
        {
            icon: BookOpen,
            title: "Study Guides",
            description: "AI-generated summaries and notes tailored to your learning style"
        },
        {
            icon: Brain,
            title: "Interactive Flashcards",
            description: "Interactive Q&A cards that adapt to your progress"
        },
        {
            icon: FileText,
            title: "Practice Worksheets",
            description: "Practice exercises and problems to reinforce learning"
        },
        {
            icon: MessageSquare,
            title: "Meeting Summaries",
            description: "Structured meeting notes and organized summaries"
        },
        {
            icon: Podcast,
            title: "Podcast",
            description: "Audio content and transcripts helps to learn on the way"
        },
        {
            icon: Heart,
            title: "Structured Approach",
            description: "Tackle anxiety in learning with our systematic methodology"
        }
    ];

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl lg:text-5xl font-bold">Key Features</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Everything you need for effective, structured learning
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {keyFeatures.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card key={index} className="text-center border-primary/10 hover:border-primary/20 transition-smooth hover:shadow-lg">
                                <CardHeader>
                                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                        <Icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="bg-hero-bg rounded-2xl p-8 md:p-12 text-center space-y-6">
                    <h3 className="text-3xl font-bold">Learn from scratch and build upon your knowledge</h3>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Amplify understanding instead of automating work. Integrated workflow for seamless and effective learning.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <span className="bg-primary/10 text-primary px-4 py-2 rounded-full">✓ Effective learning science</span>
                        <span className="bg-primary/10 text-primary px-4 py-2 rounded-full">✓ Connected ecosystem</span>
                        <span className="bg-primary/10 text-primary px-4 py-2 rounded-full">✓ Structured approach</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default KeyFeaturesSection;
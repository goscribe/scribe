import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, Zap, BarChart, Book, Lightbulb } from "lucide-react";

const FeaturesSection = () => {
    const features = [
        {
            icon: Lightbulb,
            title: "Depth over Speed",
            description: "Unlike passive summary tools like Quizlet and Chegg, Scribe focuses on understanding and reinforcing concepts."
        },
        {
            icon: Target,
            title: "Contextual Understanding",
            description: "Scribe condenses information into clear concepts, ensuring comprehensive learning."
        },
        {
            icon: Users,
            title: "Integrated Learning Loop",
            description: "Avoid workflow fragmentation with Scribe's connected ecosystem."
        },
        {
            icon: Zap,
            title: "Structured Pedagogy",
            description: "Where tools like ChatGPT offer flexibility, Scribe delivers effective learning science."
        },
        {
            icon: Book,
            title: "Learn from Scratch",
            description: "Build upon your knowledge and reinforce understanding instead of automating work."
        },
        {
            icon: BarChart,
            title: "Amplify Understanding",
            description: "Integrated workflow for seamless and effective learning experiences."
        }
    ];

    return (
        <section className="py-20 bg-feature-gradient">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl lg:text-5xl font-bold">
                        Why Choose <span className="text-primary">Scribe</span>?
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Experience the difference of AI that learns with you, not for you
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card key={index} className="border-primary/10 hover:border-primary/20 transition-smooth hover:shadow-lg">
                                <CardHeader className="text-center">
                                    <div className="mx-auto w-12 h-12 bg-hero-gradient rounded-lg flex items-center justify-center mb-4">
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-center text-base leading-relaxed">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
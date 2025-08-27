"use client"
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/scribe-hero.jpg";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {Github} from "lucide-react";

const HeroSection = () => {
    const router = useRouter();
    const handleLearnMoreOnClick = () => {
        router.push("https://github.com/goscribe");
    }
    const handleStartLearningOnClick = () => {
        router.push("/workspace/0");
    }
    return (
        <section className="relative min-h-screen flex items-center justify-center bg-hero-bg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5" />

            <div className="container mx-auto px-4 py-20 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                                Welcome to{" "}
                                <span className="bg-hero-gradient bg-clip-text text-transparent">
                  Scribe
                </span>
                            </h1>
                            <p className="text-xl lg:text-2xl text-muted-foreground font-medium">
                                Structured Pedagogy for Amplified Understanding
                            </p>
                        </div>

                        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                            Scribe is designed to address the AI learning crisis by being the AI that learns{" "}
                            <span className="font-semibold text-primary">with</span> you. We prioritize depth
                            over speed, helping you reinforce and build understanding.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button variant="hero" size="lg" className="text-lg px-8 py-6" onClick={handleStartLearningOnClick}>
                                Start Learning
                            </Button>
                            <Button variant="feature" size="lg" className="text-lg px-8 py-6" onClick={handleLearnMoreOnClick}>
                                <Github></Github>
                                Learn More
                            </Button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-glow">
                            <Image
                                src={heroImage}
                                alt="Scribe - AI Learning Platform"
                                className="w-full h-auto"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
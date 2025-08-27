const HowItWorksSection = () => {
    return (
        <section id="how-it-works" className="py-20 bg-feature-gradient">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl lg:text-5xl font-bold">How it Works</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Scribe integrates active learning formats and connected ecosystems to deliver meaningful and effective learning experiences
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-background rounded-2xl p-8 md:p-12 shadow-lg">
                        <p className="text-lg leading-relaxed text-muted-foreground text-center">
                            Our tools are optimized to help you reinforce concepts and make information stick.
                            Unlike traditional tools that provide instant answers, Scribe focuses on building
                            deep understanding through structured, active learning methodologies.
                        </p>

                        <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                    <span className="text-primary font-bold text-xl">1</span>
                                </div>
                                <h3 className="font-semibold text-lg">Upload Content</h3>
                                <p className="text-muted-foreground">Share your learning materials with Scribe</p>
                            </div>

                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                    <span className="text-primary font-bold text-xl">2</span>
                                </div>
                                <h3 className="font-semibold text-lg">AI Analysis</h3>
                                <p className="text-muted-foreground">Our AI structures content for optimal learning</p>
                            </div>

                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                    <span className="text-primary font-bold text-xl">3</span>
                                </div>
                                <h3 className="font-semibold text-lg">Interactive Learning</h3>
                                <p className="text-muted-foreground">Engage with personalized study materials</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
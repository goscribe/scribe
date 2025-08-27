//import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import KeyFeaturesSection from "@/components/landing/KeyFeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import Footer from "@/components/landing/Footer";
import "./page_index.css"

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* <Header /> discarded, use header defined in app/layout.tsx instead */}
            <HeroSection />
            <FeaturesSection />
            <KeyFeaturesSection />
            <HowItWorksSection />
            <Footer />
        </div>
    );
};

export default LandingPage;
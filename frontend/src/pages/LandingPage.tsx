import FeatureSection from "../components/FeatureSection";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import "../styles/landing.css";

export default function LandingPage() {
    return (
        <div className="landing-page">
            <Navbar />
            <HeroSection />
            <FeatureSection />
        </div>
    );
}
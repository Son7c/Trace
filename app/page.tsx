"use client";

import NavLanding from "@/components/navLanding";
import HeroSection from "@/components/HeroSection";
import ProblemHook from "@/components/landing/ProblemHook";
import HowItWorks from "@/components/landing/HowItWorks";
import WhyTrace from "@/components/landing/WhyTrace";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="relative bg-[#020507] min-h-screen w-full overflow-x-hidden">
      <NavLanding />
      <HeroSection />
      <ProblemHook />
      <HowItWorks />
      <WhyTrace />
      <FeaturesSection />
      <Footer />
    </div>
  );
}

"use client";

import {
  BookOpenIcon,
  BrainIcon,
  MouseSimpleIcon,
  NotebookIcon,
  SealCheckIcon,
} from "@phosphor-icons/react";
import IconCircle from "./IconCircle";
import TimelineLine from "./TimeLineLine";
import TimelineParticles from "./TimeLineParticles";
import ColorBends from "./ColorBends-landing/ColorBends";
import { useRouter } from "next/navigation";
import SpecularButton from "./Spectacular-btn/SpecularButton";
import { handleLogin } from "@/utils/handleLogin";
import { useEffect, useRef } from "react";
import { useLenis } from "@/components/providers/lenis-provider";

export default function HeroSection() {
  const router = useRouter();
  const lenis = useLenis();

  // Direct DOM refs to avoid React state re-render jitter
  const contentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lenis) return;

    const handleScroll = (e: { scroll: number }) => {
      const scrollY = e.scroll;

      // GPU hardware-accelerated parallax via direct DOM mutations (0 React re-renders = 0 jitter)
      if (contentRef.current) {
        contentRef.current.style.transform = `translate3d(0, ${scrollY * 0.25}px, 0)`;
      }
      if (timelineRef.current) {
        timelineRef.current.style.transform = `translate3d(0, ${scrollY * 0.15}px, 0)`;
      }
      if (scrollIndicatorRef.current) {
        const opacity = Math.max(0, 1 - scrollY / 150);
        scrollIndicatorRef.current.style.opacity = `${opacity}`;
      }
    };

    lenis.on("scroll", handleScroll);
    return () => lenis.off("scroll", handleScroll);
  }, [lenis]);

  return (
    <main className="relative h-screen w-full overflow-hidden flex flex-col justify-between pt-24 pb-4">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 opacity-90 pointer-events-none"
      >
        <ColorBends
          colors={["#99E372"]}
          rotation={60}
          speed={0.2}
          scale={1.3}
          frequency={1}
          warpStrength={1}
          mouseInfluence={0.4}
          parallax={0.25}
          iterations={1}
          intensity={1.3}
          bandWidth={3}
          transparent={true}
          autoRotate={0}
        />
      </div>

      {/* Main Content: Vertically Centered in remaining space */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="flex justify-start w-full px-8 md:px-16 lg:px-24">
          {/* Main content column on the left with Direct GPU Parallax Ref */}
          <div
            ref={contentRef}
            className="text-[#a6e795] flex flex-col w-full md:w-[70%] lg:w-[60%] justify-center select-none will-change-transform"
          >
            {/* Content Tag */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#a6e795]/20 bg-[#0B0F14]/20 text-[#fff] text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] backdrop-blur-sm">
                consistency &gt; motivation
              </span>
            </div>

            {/* Main Heading */}
            <div className="mt-6 flex flex-col">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                <span className="block">Small steps.</span>
                <span className="block text-[#a6e795]">Compound mastery.</span>
              </h1>
            </div>

            {/* Description */}
            <div className="mt-6">
              <p className="text-zinc-200 text-sm md:text-base lg:text-lg leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] max-w-lg">
                Trace helps you remember, revisit, and master what truly
                matters.
              </p>
            </div>

            {/* CTA Button */}
            <div className="mt-6">
              <SpecularButton
                size="md"
                radius={18}
                tint="#ffffff"
                tintOpacity={0}
                blur={0}
                textColor="#f5f5f5"
                lineColor="#ffffff"
                baseColor="#525252"
                intensity={1}
                shineSize={10}
                shineFade={40}
                thickness={1}
                speed={0.35}
                followMouse
                proximity={250}
                autoAnimate={false}
                onClick={() => handleLogin(router)}
              >
                Get Started
              </SpecularButton>
            </div>

            {/* Secondary Badge info */}
            <div className="mt-6">
              <p className="text-white text-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.98)]">
                Built for{" "}
                <span className="text-[#a6e795] font-medium">developers.</span>{" "}
                Backed by{" "}
                <span className="text-[#a6e795] font-medium">science.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About section: Timeline with Direct GPU Parallax Ref */}
      <section
        ref={timelineRef}
        className="relative w-full py-4 mb-10 z-10 will-change-transform"
      >
        <div className="flex justify-center gap-8 md:gap-14 px-4 relative z-10">
          {/* Anchored to this marker row: 1rem padding + half of the 3rem icon. */}
          <div className="absolute inset-x-0 top-4 h-12 z-0">
            <TimelineLine />
            <TimelineParticles />
          </div>

          <div className="group relative z-10 flex flex-col items-center justify-center p-4">
            <div>
              <IconCircle>
                <BookOpenIcon size={28} weight="light" />
              </IconCircle>
            </div>
            <h3 className="text-white text-sm font-semibold mt-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-colors duration-300 group-hover:text-[#a6e795]">
              1. Learn
            </h3>
            <div className="flex flex-col justify-center items-center mt-1.5 text-center">
              <p className="text-zinc-300 text-xs drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] transition-colors duration-300 group-hover:text-white">
                Solve Problems and
              </p>
              <p className="text-zinc-300 text-xs drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] transition-colors duration-300 group-hover:text-white">
                Add notes that matter.
              </p>
            </div>
          </div>

          <div className="group relative z-10 flex flex-col items-center justify-center p-4">
            <div>
              <IconCircle>
                <NotebookIcon size={28} weight="light" />
              </IconCircle>
            </div>
            <h3 className="text-white text-sm font-semibold mt-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-colors duration-300 group-hover:text-[#a6e795]">
              2. Review
            </h3>
            <div className="flex flex-col justify-center items-center mt-1.5 text-center">
              <p className="text-zinc-300 text-xs drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] transition-colors duration-300 group-hover:text-white">
                We remind you at the
              </p>
              <p className="text-zinc-300 text-xs drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] transition-colors duration-300 group-hover:text-white">
                perfect time.
              </p>
            </div>
          </div>

          <div className="group relative z-10 flex flex-col items-center justify-center p-4">
            <div>
              <IconCircle>
                <BrainIcon size={28} weight="light" />
              </IconCircle>
            </div>
            <h3 className="text-white text-sm font-semibold mt-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-colors duration-300 group-hover:text-[#a6e795]">
              3. Recall
            </h3>
            <div className="flex flex-col justify-center items-center mt-1.5 text-center">
              <p className="text-zinc-300 text-xs drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] transition-colors duration-300 group-hover:text-white">
                Active recall strengthens
              </p>
              <p className="text-zinc-300 text-xs drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] transition-colors duration-300 group-hover:text-white">
                your understanding.
              </p>
            </div>
          </div>

          <div className="group relative z-10 flex flex-col items-center justify-center p-4">
            <div>
              <IconCircle>
                <SealCheckIcon size={28} weight="light" />
              </IconCircle>
            </div>
            <h3 className="text-white text-sm font-semibold mt-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-colors duration-300 group-hover:text-[#a6e795]">
              4. Master
            </h3>
            <div className="flex flex-col justify-center items-center mt-1.5 text-center">
              <p className="text-zinc-300 text-xs drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] transition-colors duration-300 group-hover:text-white">
                Knowledge you build
              </p>
              <p className="text-zinc-300 text-xs drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] transition-colors duration-300 group-hover:text-white">
                today, stays forever
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll indicator with Direct Ref */}
      <div
        ref={scrollIndicatorRef}
        className="flex justify-center gap-2 text-[#99e372] drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] pb-2 -mt-5 transition-opacity duration-150 relative z-10"
      >
        <MouseSimpleIcon
          weight="thin"
          size={28}
          className="animate-bounce"
          style={{ animationDuration: "2s" }}
        />
        <span className="text-[12px] text-white font-medium tracking-[0.18em]">
          Scroll to explore
        </span>
      </div>
    </main>
  );
}

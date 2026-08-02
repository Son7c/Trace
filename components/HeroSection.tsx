"use client";

import {
  ArrowRightIcon,
  BookOpenIcon,
  BrainIcon,
  CircleIcon,
  MouseSimpleIcon,
  NotebookIcon,
  SealCheckIcon,
} from "@phosphor-icons/react";
import IconCircle from "./IconCircle";
import TimelineLine from "./TimeLineLine";
import TimelineParticles from "./TimeLineParticles";
import ColorBends from "./ColorBends-landing/ColorBends";

export default function HeroSection() {
  return (
    <main className="relative h-screen w-full overflow-hidden flex flex-col justify-between pt-24 pb-4">
      <div aria-hidden="true" className="absolute inset-0 z-0 opacity-90">
        <ColorBends
          colors={["#99E372"]}
          rotation={60}
          speed={0.2}
          scale={1.3}
          frequency={1}
          warpStrength={1}
          mouseInfluence={0.4}
          noise={0.15}
          parallax={0.25}
          iterations={1}
          intensity={1.3}
          bandWidth={3}
          transparent={false}
          autoRotate={0}
        />
      </div>

      {/* Main Content: Vertically Centered in remaining space */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-center w-full px-8 md:px-16">
          {/* Main content column on the left */}
          <div className="text-[#a6e795] flex flex-col w-[55%] justify-center pr-8 select-none">
            {/* Content Tag */}
            <div>
              <span className="tracking-[0.25em] text-[#a6e795] text-xs font-semibold uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                CONSISTENCY&gt;MOTIVATION
              </span>
            </div>

            {/* Main Heading */}
            <div className="mt-4 flex flex-col gap-1.5">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                Small steps.
              </h1>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                Compound <span className="text-[#a6e795]">mastery.</span>
              </h1>
            </div>

            {/* Description */}
            <div className="mt-4">
              <p className="text-zinc-200 text-sm md:text-base leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] max-w-md">
                Trace helps you remember, revisit,
                <br />
                and master what truly matters.
              </p>
            </div>

            {/* CTA Button */}
            <div className="mt-4">
              <button className="group relative flex items-center justify-between gap-3 px-5 py-3 text-xs font-semibold text-black bg-[#a6e795] rounded-xl transition-all duration-300 hover:bg-[#bbfda8] hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.4)] w-36">
                Start Training
                <ArrowRightIcon size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Secondary Badge info */}
            <div className="mt-4">
              <p className="text-zinc-300 text-xs md:text-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.98)]">
                Built for <span className="text-[#a6e795] font-medium">developers.</span>{" "}
                Backed by <span className="text-[#a6e795] font-medium">science.</span>
              </p>
            </div>
          </div>

          {/* Right spacer for original asymmetric layout */}
          <div className="w-[45%]" />
        </div>
      </div>

      {/* About section: Timeline */}
      <section className="relative w-full py-4">
        <div className="flex justify-center gap-8 md:gap-14 px-4 relative z-10">
          {/* Anchored to this marker row: 1rem padding + half of the 3rem icon. */}
          <div className="absolute inset-x-0 top-4 h-12 z-0">
            <TimelineLine />
            <TimelineParticles />
          </div>

          <div className="group relative z-10 flex flex-col items-center justify-center p-4 transition-all duration-300 hover:-translate-y-1">
            <div className="transition-transform duration-300 group-hover:scale-110">
              <IconCircle>
                <BookOpenIcon size={28} weight="light" />
              </IconCircle>
            </div>
            <h3 className="text-white text-sm font-semibold mt-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-colors duration-300 group-hover:text-[#a6e795]">1. Learn</h3>
            <div className="flex flex-col justify-center items-center mt-1.5 text-center">
              <p className="text-zinc-300 text-xs drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] transition-colors duration-300 group-hover:text-white">Solve Problems and</p>
              <p className="text-zinc-300 text-xs drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] transition-colors duration-300 group-hover:text-white">Add notes that matter.</p>
            </div>
          </div>

          <div className="group relative z-10 flex flex-col items-center justify-center p-4 transition-all duration-300 hover:-translate-y-1">
            <div className="transition-transform duration-300 group-hover:scale-110">
              <IconCircle>
                <NotebookIcon size={28} weight="light" />
              </IconCircle>
            </div>
            <h3 className="text-white text-sm font-semibold mt-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-colors duration-300 group-hover:text-[#a6e795]">2. Review</h3>
            <div className="flex flex-col justify-center items-center mt-1.5 text-center">
              <p className="text-zinc-300 text-xs drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] transition-colors duration-300 group-hover:text-white">We remind you at the</p>
              <p className="text-zinc-300 text-xs drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] transition-colors duration-300 group-hover:text-white">perfect time.</p>
            </div>
          </div>

          <div className="group relative z-10 flex flex-col items-center justify-center p-4 transition-all duration-300 hover:-translate-y-1">
            <div className="transition-transform duration-300 group-hover:scale-110">
              <IconCircle>
                <BrainIcon size={28} weight="light" />
              </IconCircle>
            </div>
            <h3 className="text-white text-sm font-semibold mt-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-colors duration-300 group-hover:text-[#a6e795]">3. Recall</h3>
            <div className="flex flex-col justify-center items-center mt-1.5 text-center">
              <p className="text-zinc-300 text-xs drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] transition-colors duration-300 group-hover:text-white">Active recall strengthens</p>
              <p className="text-zinc-300 text-xs drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] transition-colors duration-300 group-hover:text-white">your understanding.</p>
            </div>
          </div>

          <div className="group relative z-10 flex flex-col items-center justify-center p-4 transition-all duration-300 hover:-translate-y-1">
            <div className="transition-transform duration-300 group-hover:scale-110">
              <IconCircle>
                <SealCheckIcon size={28} weight="light" />
              </IconCircle>
            </div>
            <h3 className="text-white text-sm font-semibold mt-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-colors duration-300 group-hover:text-[#a6e795]">4. Master</h3>
            <div className="flex flex-col justify-center items-center mt-1.5 text-center">
              <p className="text-zinc-300 text-xs drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] transition-colors duration-300 group-hover:text-white">Knowledge you build</p>
              <p className="text-zinc-300 text-xs drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] transition-colors duration-300 group-hover:text-white">today, stays forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll indicator */}
      <div className="flex justify-center items-center gap-2 text-[#99e372] drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] pb-2">
        <MouseSimpleIcon weight="thin" size={28} className="animate-bounce" style={{ animationDuration: '2s' }} />
        <span className="text-[10px] text-zinc-300 tracking-[0.18em] uppercase">
          Scroll to explore
        </span>
      </div>
    </main>
  );
}

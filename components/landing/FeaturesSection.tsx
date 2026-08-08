"use client";

import { useState, useEffect, useRef } from "react";
import { useLenis } from "@/components/providers/lenis-provider";
import {
  ArrowsClockwise,
  ArrowRight,
  CheckCircle,
  Lightning,
} from "@phosphor-icons/react";

const mechanismSteps = [
  { step: "01", label: "Solve", detail: "Solve problem on LeetCode & add notes" },
  { step: "02", label: "Recall", detail: "Trace prompts review at optimal decay point" },
  { step: "03", label: "Feedback", detail: "Rate your recall: Again, Hard, Good, Easy" },
  { step: "04", label: "Reschedule", detail: "SM-2 updates your next interval automatically" },
  { step: "05", label: "Master", detail: "Solution pattern shifts to long-term memory" },
];

const concreteBenefits = [
  "Review timing is 100% automatic",
  "Difficult problems return sooner",
  "Strong memories are spaced further apart",
  "Every review influences the next schedule",
  "You don't have to manually maintain review dates",
];

export default function FeaturesSection() {
  const lenis = useLenis();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0.5);

  useEffect(() => {
    if (!lenis) return;

    const updateProgress = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const rawProgress = (windowH - rect.top) / (windowH + rect.height);
      const clamped = Math.max(0, Math.min(1, rawProgress));
      setProgress(clamped);
    };

    lenis.on("scroll", updateProgress);
    updateProgress();
    return () => lenis.off("scroll", updateProgress);
  }, [lenis]);

  const cardsParallax = (progress - 0.5) * -20;

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-28 px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden font-sans"
    >
      {/* Hairline Divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#99E372]/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Core Concept Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl">
          <Lightning className="w-3.5 h-3.5 text-[#99E372]" weight="fill" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-300">
            Product Mechanism
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
          Stop deciding what to review.
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
          Trace turns your past performance into your next review queue. You solve the problems. Trace handles when they come back.
        </p>
      </div>

      {/* Product Mechanism Pipeline (Solve -> Recall -> Feedback -> Reschedule -> Master) */}
      <div
        className="relative z-10 transition-all duration-300 ease-out mb-16"
        style={{ transform: `translateY(${cardsParallax}px)` }}
      >
        <div className="rounded-2xl border border-white/[0.08] bg-[#07090E] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-8">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <ArrowsClockwise className="w-4 h-4 text-[#99E372]" /> Trace Active Review Loop
            </span>
            <span className="text-[11px] font-mono text-[#99E372] bg-[#99E372]/10 border border-[#99E372]/30 px-2.5 py-0.5 rounded">
              Closed Feedback System
            </span>
          </div>

          {/* Horizontal Mechanism Pipeline */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            {mechanismSteps.map((step, idx) => (
              <div
                key={step.step}
                className="relative p-4 rounded-xl border border-white/[0.06] bg-[#030407] space-y-2 group hover:border-[#99E372]/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">{step.step}</span>
                  {idx < mechanismSteps.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-[#99E372] transition-colors hidden sm:block" />
                  )}
                </div>
                <h3 className="text-sm font-semibold text-white group-hover:text-[#99E372] transition-colors">
                  {step.label}
                </h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-normal">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Concrete Benefits Grid */}
      <div className="relative z-10 max-w-4xl mx-auto rounded-2xl border border-white/[0.08] bg-[#07090E] p-6 sm:p-8 backdrop-blur-2xl">
        <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-4 border-b border-white/[0.08] pb-3">
          Core Engine Principles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {concreteBenefits.map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-zinc-200">
              <CheckCircle className="w-4 h-4 text-[#99E372] shrink-0" weight="fill" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

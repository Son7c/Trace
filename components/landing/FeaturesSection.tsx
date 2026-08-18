"use client";

import { useState, useEffect, useRef } from "react";
import { useLenis } from "@/components/providers/lenis-provider";
import {
  Brain,
  Code,
  Sliders,
  TrendUp,
  Eye,
  Lightning,
  CheckCircle,
} from "@phosphor-icons/react";

const premiumFeatures = [
  {
    icon: Brain,
    title: "SuperMemo-2 Adaptive Math",
    description:
      "Dynamic interval updates based on your self-reported recall performance. The math ensures you review right before memory decay.",
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Code,
    title: "Rich Code & Approach Sandbox",
    description:
      "Attach optimal C++, Python, or TS code snippets, time/space complexity notes, and key insights directly to every problem.",
    accent: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: TrendUp,
    title: "Cognitive Retention Analytics",
    description:
      "Visualize your retention curve, active streak, memory stability age, and problem distribution across DP, sliding window, and graphs.",
    accent: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Sliders,
    title: "Custom Interview Tuning",
    description:
      "Calibrate decay aggressiveness and ease multipliers for target deadlines (e.g. 14-day FAANG speedrun vs 6-month system study).",
    accent: "text-teal-400 bg-teal-500/10 border-teal-500/20",
  },
  {
    icon: Eye,
    title: "Zen Focus Workspace",
    description:
      "A distraction-free active recall environment built for deep concentration without context switching or clutter.",
    accent: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: Lightning,
    title: "Instant Daily Queue Fetching",
    description:
      "Zero loading times. Open Trace every morning to get straight to your computed problem queue without decision fatigue.",
    accent: "text-[#a6e795] bg-[#a6e795]/10 border-[#a6e795]/20",
  },
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
      {/* Subtle Hairline Divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Contained Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#a6e795]/[0.025] rounded-full blur-[120px] pointer-events-none" />

      {/* Core Concept Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
          <Brain className="w-3.5 h-3.5 text-[#a6e795]" weight="bold" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-300 font-semibold">
            Premium Capabilities
          </span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
          A memory engine built for{" "}
          <span className="text-[#a6e795]">peak execution</span>.
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
          Trace integrates cognitive science principles directly into your
          software engineering workflow to eliminate solution decay completely.
        </p>
      </div>

      {/* Features Bento Grid */}
      <div
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 ease-out mb-16"
        style={{ transform: `translateY(${cardsParallax}px)` }}
      >
        {premiumFeatures.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="group rounded-2xl border border-white/[0.08] bg-[#07090E] p-6 backdrop-blur-2xl transition-all duration-300 hover:border-[#a6e795]/40 hover:shadow-[0_10px_30px_-15px_rgba(166,231,149,0.12)] flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 group-hover:scale-105 transition-transform ${item.accent}`}
                >
                  <IconComponent className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#a6e795] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scientific Foundation Section */}
      <div className="relative z-10 max-w-4xl mx-auto rounded-2xl border border-white/[0.08] bg-[#07090E] p-8 sm:p-9 backdrop-blur-2xl flex flex-col items-center text-center space-y-4 shadow-xl hover:border-[#a6e795]/30 transition-all duration-300">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#a6e795]/20 bg-[#a6e795]/10">
          <Brain className="w-3.5 h-3.5 text-[#a6e795]" weight="bold" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#a6e795] font-bold">
            Scientific Foundation
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Built on Proven Cognitive Spacing Research
        </h3>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed font-normal">
          Trace leverages the psychological spacing effect. By systematically
          expanding review intervals after every successful recall attempt,
          solution patterns lock permanently into your long-term memory with
          minimal daily effort.
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2 text-xs font-mono text-zinc-300">
            <CheckCircle className="w-4 h-4 text-[#a6e795]" weight="fill" />
            <span>SuperMemo SM-2 Model</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2 text-xs font-mono text-zinc-300">
            <CheckCircle className="w-4 h-4 text-[#a6e795]" weight="fill" />
            <span>Ebbinghaus Decay Curve</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2 text-xs font-mono text-zinc-300">
            <CheckCircle className="w-4 h-4 text-[#a6e795]" weight="fill" />
            <span>Active Retrieval Triggers</span>
          </div>
        </div>
      </div>
    </section>
  );
}

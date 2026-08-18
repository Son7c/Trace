"use client";

import { useState, useEffect, useRef } from "react";
import { useLenis } from "@/components/providers/lenis-provider";
import {
  CheckCircle,
  WarningCircle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Brain,
} from "@phosphor-icons/react";

export default function ProblemHook() {
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
      id="problem-hook"
      ref={sectionRef}
      className="relative py-28 px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden font-sans"
    >
      {/* Subtle Hairline Top Divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Contained Top Center Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#a6e795]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-16 space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#a6e795]/20 bg-[#a6e795]/10 backdrop-blur-xl">
          <Brain className="w-4 h-4 text-[#a6e795]" weight="bold" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#a6e795] font-bold">
            The LeetCode Blank Stare
          </span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          You solve 100+ LeetCode problems.{" "}
          <span className="block text-[#a6e795] mt-2">
            Then 2 weeks later, you draw a blank.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto font-normal">
          That gut-wrenching feeling when an interviewer asks a pattern you{" "}
          <em className="text-zinc-200 not-italic font-semibold">know</em> you
          solved last month, but your memory freezes up. Trace eliminates the
          panic by prompting 2-minute active recall reviews right before memory
          decay strikes.
        </p>
      </div>

      {/* 3-Stage Timeline Grid */}
      <div
        className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 transition-all duration-300 ease-out"
        style={{ transform: `translateY(${cardsParallax}px)` }}
      >
        {/* Stage 1: Day 1 */}
        <div className="group relative rounded-2xl border border-white/[0.08] bg-[#07090E] p-7 backdrop-blur-2xl transition-all duration-300 hover:border-[#a6e795]/40 hover:shadow-[0_10px_30px_-15px_rgba(166,231,149,0.15)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-6">
              <span className="text-[10px] font-mono text-[#a6e795] bg-[#a6e795]/10 border border-[#a6e795]/20 px-2.5 py-1 rounded-md font-bold tracking-wider uppercase">
                DAY 1 • FRESH IN MIND
              </span>
              <span className="text-[11px] font-mono text-[#a6e795] font-semibold">
                100% Recall
              </span>
            </div>

            <div className="w-11 h-11 rounded-xl bg-[#a6e795]/10 border border-[#a6e795]/20 flex items-center justify-center text-[#a6e795] mb-5 group-hover:scale-105 transition-transform">
              <CheckCircle className="w-5.5 h-5.5" weight="fill" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#a6e795] transition-colors">
              High-Energy Breakthrough
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
              You debug a tricky Sliding Window problem, get green checks on
              LeetCode, and feel on top of the world.
            </p>
          </div>

          <div className="pt-5 mt-5 border-t border-white/[0.04] flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>Pattern: Crisp</span>
            <span className="text-[#a6e795] flex items-center gap-1 font-semibold">
              Peak Recall <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Stage 2: Day 7 */}
        <div className="group relative rounded-2xl border border-white/[0.08] bg-[#07090E] p-7 backdrop-blur-2xl transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_10px_30px_-15px_rgba(245,158,11,0.15)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-6">
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md font-bold tracking-wider uppercase">
                DAY 7 • SILENT DECAY
              </span>
              <span className="text-[11px] font-mono text-amber-400 font-semibold">
                45% Recall
              </span>
            </div>

            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-105 transition-transform">
              <WarningCircle className="w-5.5 h-5.5" weight="fill" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
              Fading Conviction
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
              Without structured review, key pointer boundaries and window
              contraction tricks start blurring into memory fog.
            </p>
          </div>

          <div className="pt-5 mt-5 border-t border-white/[0.04] flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>Pattern: Slipping</span>
            <span className="text-amber-400 font-semibold">Needs Review</span>
          </div>
        </div>

        {/* Stage 3: Day 14 */}
        <div className="group relative rounded-2xl border border-white/[0.08] bg-[#07090E] p-7 backdrop-blur-2xl transition-all duration-300 hover:border-red-500/40 hover:shadow-[0_10px_30px_-15px_rgba(239,68,68,0.15)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-6">
              <span className="text-[10px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-md font-bold tracking-wider uppercase">
                DAY 14 • PANIC & FREEZE
              </span>
              <span className="text-[11px] font-mono text-red-400 font-semibold">
                0% Recall
              </span>
            </div>

            <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-5 group-hover:scale-105 transition-transform">
              <XCircle className="w-5.5 h-5.5" weight="fill" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
              Interview Screen Freeze
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
              Under live pressure with an interviewer watching, your mind draws
              a complete blank on the core algorithm trick.
            </p>
          </div>

          <div className="pt-5 mt-5 border-t border-white/[0.04] flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>Pattern: Forgotten</span>
            <span className="text-red-400 font-semibold">Total Lockout</span>
          </div>
        </div>
      </div>

      {/* Solution Banner Callout */}
      <div className="relative z-10 max-w-4xl mx-auto rounded-2xl border border-[#a6e795]/20 bg-[#07090E] p-6 sm:p-7 backdrop-blur-2xl shadow-[0_15px_40px_-15px_rgba(166,231,149,0.1)] flex flex-col sm:flex-row items-center justify-between gap-5 hover:border-[#a6e795]/40 transition-all duration-300">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-[#a6e795]/10 border border-[#a6e795]/20 text-[#a6e795] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" weight="fill" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Walk into technical interviews with complete clarity.
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 leading-relaxed max-w-xl font-normal">
              Spaced active recall prompts 2-minute refresher cards right before
              memory decay happens—so solution logic stays permanently fresh in
              your mind.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 sm:border-l sm:border-white/[0.08] sm:pl-6 shrink-0">
          <div className="text-left sm:text-right font-mono">
            <div className="text-xl font-extrabold text-[#a6e795] tracking-tight">
              100%
            </div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
              Pattern Retention
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

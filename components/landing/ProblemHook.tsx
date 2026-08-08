"use client";

import { useState, useEffect, useRef } from "react";
import { useLenis } from "@/components/providers/lenis-provider";
import {
  Question,
  ClockAfternoon,
  Brain,
  WarningCircle,
  Lightning,
  CheckCircle,
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

  const cardsParallax = (progress - 0.5) * -30;

  return (
    <section
      id="problem-hook"
      ref={sectionRef}
      className="relative py-28 px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Hairline Top Divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#99E372]/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Question Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl mb-6">
          <Question className="w-3.5 h-3.5 text-[#99E372]" weight="bold" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-300">
            The Developer Dilemma
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
          Have you ever solved a LeetCode problem...{" "}
          <span className="text-[#99E372] block mt-1">
            only to completely forget it 2 weeks later?
          </span>
        </h2>
        <p className="mt-4 text-base text-zinc-400 leading-relaxed max-w-xl mx-auto font-normal">
          You spend hours mastering a tricky pattern, but without scheduled
          recall, 80% of that knowledge silently decays.
        </p>
      </div>

      {/* 3 Relatable Pain Point Cards */}
      <div
        className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 transition-all duration-300 ease-out"
        style={{ transform: `translateY(${cardsParallax}px)` }}
      >
        {/* Pain 1 */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#07090E] p-6 backdrop-blur-2xl shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-amber-400 mb-4">
            <ClockAfternoon className="w-5 h-5" />
          </div>
          <h3 className="text-base font-medium text-white mb-1.5">
            1. The 2-Hour Grind
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            You debug a Hard sliding window solution, finally get it accepted,
            and feel great.
          </p>
        </div>

        {/* Pain 2 */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#07090E] p-6 backdrop-blur-2xl shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-red-400 mb-4">
            <WarningCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-medium text-white mb-1.5">
            2. Silent Memory Decay
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Without structured review, key edge cases and optimal pointer logic
            vanish from memory within days.
          </p>
        </div>

        {/* Pain 3 */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#07090E] p-6 backdrop-blur-2xl shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#99E372] mb-4">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="text-base font-medium text-white mb-1.5">
            3. The Interview Blank
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            In a live technical interview, the problem looks familiar... but
            your mind freezes on the core trick.
          </p>
        </div>
      </div>

      {/* Solution Banner */}
      <div className="relative z-10 max-w-4xl mx-auto rounded-2xl border border-[#99E372]/30 bg-[#07090E] p-6 text-center backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="p-2.5 rounded-xl bg-[#99E372]/10 text-[#99E372] shrink-0">
            <Lightning className="w-5 h-5" weight="fill" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              Trace stops the memory leak.
            </div>
            <div className="text-xs text-zinc-400">
              We remind you to review each problem right before you forget
              it...in 2 minutes flat.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#99E372] bg-[#99E372]/10 border border-[#99E372]/20 px-3.5 py-1.5 rounded-lg shrink-0">
          <CheckCircle className="w-4 h-4" weight="fill" />
          100% Solution Retention
        </div>
      </div>
    </section>
  );
}

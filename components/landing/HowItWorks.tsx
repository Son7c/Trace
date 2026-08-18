"use client";

import { useState, useEffect, useRef } from "react";
import { useLenis } from "@/components/providers/lenis-provider";
import {
  Brain,
  ArrowsClockwise,
  CheckCircle,
  TerminalWindow,
  CalendarBlank,
  ShieldCheck,
  Eye,
  EyeSlash,
  Lightbulb,
  Lightning,
} from "@phosphor-icons/react";

export default function HowItWorks() {
  const lenis = useLenis();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0.5);

  // Interactive SM-2 Simulator State
  const [rating, setRating] = useState<"AGAIN" | "HARD" | "GOOD" | "EASY">(
    "GOOD",
  );
  const [interval, setInterval] = useState(7);
  const [easeFactor, setEaseFactor] = useState(2.5);
  const [showHint, setShowHint] = useState(false);

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

  const handleSimulateRating = (
    selected: "AGAIN" | "HARD" | "GOOD" | "EASY",
  ) => {
    setRating(selected);
    if (selected === "AGAIN") {
      setInterval(1);
      setEaseFactor((prev) => Math.max(1.3, Number((prev - 0.2).toFixed(2))));
    } else if (selected === "HARD") {
      setInterval((prev) => Math.max(2, Math.round(prev * 1.2)));
      setEaseFactor((prev) => Math.max(1.3, Number((prev - 0.15).toFixed(2))));
    } else if (selected === "GOOD") {
      setInterval((prev) => Math.round(prev * easeFactor));
    } else if (selected === "EASY") {
      const newEase = Number((easeFactor + 0.15).toFixed(2));
      setEaseFactor(newEase);
      setInterval((prev) => Math.round(prev * newEase * 1.3));
    }
  };

  const cardsParallax = (progress - 0.5) * -20;

  // Compute status metrics based on rating selection
  const getRatingInfo = () => {
    switch (rating) {
      case "AGAIN":
        return {
          status: "Memory Overdue",
          risk: "High decay risk",
          bg: "bg-red-500/10 border-red-500/30 text-red-400",
          barWidth: "w-2/12 bg-red-400",
        };
      case "HARD":
        return {
          status: "Weakening Pattern",
          risk: "Moderate decay risk",
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
          barWidth: "w-5/12 bg-amber-400",
        };
      case "GOOD":
        return {
          status: "Recall Confirmed",
          risk: "Low decay risk",
          bg: "bg-[#a6e795]/10 border-[#a6e795]/30 text-[#a6e795]",
          barWidth: "w-8/12 bg-[#a6e795]",
        };
      case "EASY":
        return {
          status: "Permanent Mastery",
          risk: "Negligible decay risk",
          bg: "bg-teal-500/10 border-teal-500/30 text-teal-400",
          barWidth: "w-full bg-teal-400",
        };
    }
  };

  const ratingInfo = getRatingInfo();

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-28 px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden font-sans"
    >
      {/* Subtle Hairline Divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Contained Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#a6e795]/[0.025] rounded-full blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 max-w-3xl mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
          <Lightning className="w-3.5 h-3.5 text-[#a6e795]" weight="fill" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-300 font-semibold">
            Engine Architecture
          </span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          Engineered for{" "}
          <span className="text-[#a6e795]">permanent recall</span>.
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl font-normal">
          Trace applies SuperMemo-2 spaced repetition math to calculate your
          optimal recall window, stopping pattern decay before interview day.
        </p>
      </div>

      {/* Bento Grid */}
      <div
        className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 transition-all duration-300 ease-out"
        style={{ transform: `translateY(${cardsParallax}px)` }}
      >
        {/* Bento Main Card: Interactive Simulator (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#07090E] p-6 sm:p-7 backdrop-blur-2xl shadow-xl hover:border-[#a6e795]/30 transition-all duration-300 flex flex-col justify-between">
          <div>
            {/* Card Top Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-6">
              <div className="flex items-center gap-2">
                <TerminalWindow className="w-4 h-4 text-[#a6e795]" />
                <span className="font-mono text-[11px] text-zinc-300 uppercase tracking-wider font-semibold">
                  Interactive Spaced Flashcard Simulator
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#a6e795] bg-[#a6e795]/10 border border-[#a6e795]/30 px-2.5 py-0.5 rounded-md font-bold uppercase">
                SM-2 ACTIVE
              </span>
            </div>

            {/* Flashcard Item Preview */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#030407] border border-white/[0.06] mb-6 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#a6e795] font-semibold">
                  LeetCode #76 • Hard
                </span>
                <span className="text-zinc-400 uppercase bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                  Sliding Window
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Minimum Window Substring
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    Time Complexity: O(N) • Space Complexity: O(1)
                  </p>
                </div>

                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-zinc-300 transition-colors shrink-0 cursor-pointer"
                >
                  {showHint ? (
                    <>
                      <EyeSlash className="w-3.5 h-3.5 text-zinc-400" /> Hide
                      Approach
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-[#a6e795]" /> Reveal
                      Approach
                    </>
                  )}
                </button>
              </div>

              {/* Revealable Code Hint Drawer */}
              {showHint && (
                <div className="p-3.5 rounded-lg bg-[#07090E] border border-[#a6e795]/20 font-mono text-xs text-zinc-300 space-y-1.5 animate-fadeIn">
                  <div className="flex items-center gap-1.5 text-[#a6e795] text-[11px] font-bold uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4" weight="fill" /> Core
                    Solution Insight:
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Expand right pointer until target frequency satisfied. Then
                    shrink left pointer to find minimum window length.
                  </p>
                </div>
              )}
            </div>

            {/* Memory Strength & Scheduling Panel */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#030407] border border-white/[0.06] mb-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 flex items-center gap-2 font-medium">
                  <Brain className="w-4 h-4 text-[#a6e795]" /> Memory Stability:
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-md border font-mono text-[10px] font-bold uppercase tracking-wider ${ratingInfo.bg}`}
                >
                  {ratingInfo.status}
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.06]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${ratingInfo.barWidth}`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span>Forgetting threshold</span>
                  <span>{ratingInfo.risk}</span>
                </div>
              </div>

              {/* Scheduled Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/[0.06]">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block">
                    Calculated Review Interval
                  </span>
                  <div className="flex items-center gap-2">
                    <CalendarBlank className="w-4 h-4 text-[#a6e795]" />
                    <span className="text-base font-bold text-white font-mono">
                      In {interval} {interval === 1 ? "day" : "days"}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block">
                    Memory Ease Multiplier
                  </span>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#a6e795]" />
                    <span className="text-base font-bold text-white font-mono">
                      {easeFactor}x multiplier
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grade Buttons */}
          <div>
            <span className="text-[11px] text-zinc-400 block mb-3 font-mono uppercase tracking-wider">
              Simulate Recall Rating:
            </span>
            <div className="grid grid-cols-4 gap-2.5">
              {(["AGAIN", "HARD", "GOOD", "EASY"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSimulateRating(opt)}
                  className={`py-2.5 rounded-xl text-xs font-mono transition-all duration-200 font-bold cursor-pointer ${
                    rating === opt
                      ? "bg-[#a6e795] text-black shadow-[0_0_15px_rgba(166,231,149,0.3)] scale-[1.02]"
                      : "bg-white/[0.03] text-zinc-300 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bento Side Card: Daily Review Deck Preview & Pillars (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Automated Daily Queue Widget */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#07090E] p-6 backdrop-blur-2xl shadow-xl hover:border-[#a6e795]/30 transition-all duration-300 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#a6e795]" weight="bold" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-semibold">
                  Today&apos;s Review Deck
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#a6e795] bg-[#a6e795]/10 border border-[#a6e795]/20 px-2 py-0.5 rounded font-bold">
                3 QUEUED
              </span>
            </div>

            {/* Queue Items */}
            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#030407] border border-[#a6e795]/30 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-white font-bold text-xs">
                    #76 Minimum Window
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Sliding Window • Hard
                  </div>
                </div>
                <span className="text-[10px] bg-[#a6e795]/15 text-[#a6e795] border border-[#a6e795]/30 px-2 py-1 rounded font-bold">
                  DUE TODAY
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-zinc-300 font-semibold text-xs">
                    #207 Course Schedule
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    Topological Sort • Medium
                  </div>
                </div>
                <span className="text-[10px] text-zinc-400 bg-white/[0.04] px-2 py-1 rounded border border-white/[0.06]">
                  In 3 days
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-zinc-300 font-semibold text-xs">
                    #42 Trapping Rain Water
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    Two Pointers • Hard
                  </div>
                </div>
                <span className="text-[10px] text-zinc-400 bg-white/[0.04] px-2 py-1 rounded border border-white/[0.06]">
                  In 14 days
                </span>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#07090E] p-6 space-y-5 hover:border-[#a6e795]/30 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-[#a6e795]/10 border border-[#a6e795]/20 text-[#a6e795] shrink-0">
                <ArrowsClockwise className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Dynamic Spaced Scheduling
                </h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Automatic curve adjustments keep your daily workload
                  predictable and stress-free. No backlogs, just clean reviews.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-[#a6e795]/10 border border-[#a6e795]/20 text-[#a6e795] shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Zero Decision Overhead
                </h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Open your review deck each morning to an exact queue
                  calculated for long-term retention. Never wonder what to solve
                  next.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

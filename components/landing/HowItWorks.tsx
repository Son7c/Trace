"use client";

import { useState, useEffect, useRef } from "react";
import { useLenis } from "@/components/providers/lenis-provider";
import {
  Brain,
  Code,
  Sparkle,
  ArrowsClockwise,
  CheckCircle,
  TerminalWindow,
} from "@phosphor-icons/react";

export default function HowItWorks() {
  const lenis = useLenis();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0.5);

  // Interactive SM-2 Simulator State
  const [rating, setRating] = useState<"AGAIN" | "HARD" | "GOOD" | "EASY">(
    "GOOD",
  );
  const [interval, setInterval] = useState(6);
  const [easeFactor, setEaseFactor] = useState(2.5);

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

  const bgOrbOffset = (progress - 0.5) * 80;
  const cardsParallax = (progress - 0.5) * -30;

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-32 px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Hairline Divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Subtle Ambient Radial Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#99E372]/5 rounded-full blur-[180px] pointer-events-none"
        style={{ transform: `translate(-50%, ${bgOrbOffset}px)` }}
      />

      {/* Section Header */}
      <div className="relative z-10 max-w-3xl mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl mb-4">
          <Sparkle className="w-3.5 h-3.5 text-[#99E372]" weight="fill" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-300">
            Engine Architecture
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
          Engineered for{" "}
          <span className="text-[#99E372]">permanent recall</span>.
        </h2>
        <p className="mt-4 text-base text-zinc-400 leading-relaxed max-w-xl font-normal">
          Trace applies SuperMemo-2 spaced repetition math to compute your
          optimal recall interval, eliminating solution decay before interview
          day.
        </p>
      </div>

      {/* Sleek Bento Grid */}
      <div
        className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-300 ease-out"
        style={{ transform: `translateY(${cardsParallax}px)` }}
      >
        {/* Bento Main Card: Interactive Simulator (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#07090E] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl hover:border-white/20 transition-colors">
          {/* Card Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
            <div className="flex items-center gap-2">
              <TerminalWindow className="w-4 h-4 text-[#99E372]" />
              <span className="font-mono text-xs text-zinc-300">
                Interactive Recall Simulation
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#99E372] bg-[#99E372]/10 border border-[#99E372]/20 px-2.5 py-0.5 rounded-md">
              SM-2 Active
            </span>
          </div>

          {/* Flashcard Item Preview */}
          <div className="p-5 rounded-xl bg-[#030407] border border-white/[0.06] mb-6">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
              <span className="text-[#99E372]">LeetCode #76 • Hard</span>
              <span className="text-zinc-500">Sliding Window</span>
            </div>
            <h3 className="text-lg font-medium text-white mb-1">
              Minimum Window Substring
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              O(N) Time Complexity • Two-Pointer Window Shrink
            </p>
          </div>

          {/* Minimal Retention Curve */}
          <div className="p-4 rounded-xl bg-[#030407] border border-white/[0.06] mb-6">
            <div className="flex items-center justify-between text-xs font-mono mb-3">
              <span className="text-zinc-300 flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#99E372]" /> Retention Curve
              </span>
              <span className="text-[#99E372]">
                Interval: {interval}d | Ease: {easeFactor}x
              </span>
            </div>

            <div className="h-20 w-full my-1">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 400 80"
              >
                <path
                  d="M 10 15 Q 150 75 390 75"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  opacity="0.3"
                />
                <path
                  d={`M 10 15 Q 100 ${80 - Math.min(60, interval * 6)} 200 20 T 390 10`}
                  fill="none"
                  stroke="#99E372"
                  strokeWidth="2"
                />
                <circle cx="10" cy="15" r="4" fill="#99E372" />
                <circle cx="200" cy="20" r="4" fill="#99E372" />
                <circle cx="390" cy="10" r="4" fill="#99E372" />
              </svg>
            </div>
          </div>

          {/* Grade Buttons */}
          <div>
            <span className="text-xs text-zinc-400 block mb-3 font-mono">
              Simulate Recall Rating:
            </span>
            <div className="grid grid-cols-4 gap-2">
              {(["AGAIN", "HARD", "GOOD", "EASY"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSimulateRating(opt)}
                  className={`py-2.5 rounded-lg text-xs font-mono transition-all ${
                    rating === opt
                      ? "bg-[#99E372] text-black font-semibold shadow-sm"
                      : "bg-white/[0.04] text-zinc-300 border border-white/[0.06] hover:bg-white/[0.08]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bento Side Card: Algorithm Engine (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="rounded-2xl border border-white/[0.08] bg-[#07090E] p-6 backdrop-blur-2xl shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-4 h-4 text-[#99E372]" />
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                Algorithm Specification
              </span>
            </div>

            <pre className="p-4 rounded-xl bg-[#030407] border border-white/[0.06] text-[11px] font-mono text-zinc-300 overflow-x-auto leading-relaxed">
              <code>
                <span className="text-purple-400">function</span>{" "}
                <span className="text-blue-400">calculateInterval</span>(
                <br />
                {"  "}rating: <span className="text-emerald-400">Rating</span>,
                <br />
                {"  "}prevInterval:{" "}
                <span className="text-yellow-400">number</span>
                <br />
                ): <span className="text-yellow-400">number</span> &#123;
                <br />
                {"  "}
                <span className="text-purple-400">if</span> (rating ==={" "}
                <span className="text-[#99E372]">&quot;AGAIN&quot;</span>){" "}
                <span className="text-purple-400">return</span> 1;
                <br />
                {"  "}
                <span className="text-purple-400">const</span> ease = prevEase +
                0.1 - (5 - rating) * 0.08;
                <br />
                {"  "}
                <span className="text-purple-400">return</span>{" "}
                Math.round(prevInterval * ease);
                <br />
                &#125;
              </code>
            </pre>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#07090E] p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#99E372]">
                <ArrowsClockwise className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">
                  Dynamic Scheduling
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Automatic curve adjustments keep your daily workload
                  predictable and stress-free.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#99E372]">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">
                  Zero Decision Overhead
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Open your review deck each morning to an exact queue
                  calculated for long-term retention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

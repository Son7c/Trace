"use client";

import { useState, useEffect, useRef } from "react";
import { useLenis } from "@/components/providers/lenis-provider";
import {
  Lightning,
  ArrowRight,
  Table,
  ShieldCheck,
  XCircle,
  CheckCircle,
} from "@phosphor-icons/react";

export default function WhyTrace() {
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
      id="why-trace"
      ref={sectionRef}
      className="relative py-28 px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden font-sans"
    >
      {/* Subtle Hairline Top Divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Contained Ambient Glow - Pure Radial Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[280px] bg-[radial-gradient(ellipse_at_top,rgba(166,231,149,0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* Core Message Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
          <Lightning className="w-3.5 h-3.5 text-[#a6e795]" weight="fill" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-300 font-semibold">
            System Comparison
          </span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
          Spreadsheets store your problems.{" "}
          <span className="text-[#a6e795] block mt-2 sm:inline sm:mt-0">
            Trace decides what you remember next.
          </span>
        </h2>
      </div>

      {/* Visual Contrast Grid */}
      <div
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch transition-all duration-300 ease-out"
        style={{ transform: `translateY(${cardsParallax}px)` }}
      >
        {/* LEFT: SPREADSHEET (You manage the system) */}
        <div className="group rounded-2xl border border-white/[0.08] bg-[#07090E] p-6 sm:p-7 backdrop-blur-2xl hover:border-white/[0.15] transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Tag Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs">
                <Table className="w-4 h-4 text-zinc-400" />
                <span className="uppercase tracking-wider font-semibold text-zinc-300">
                  LEGACY SPREADSHEETS
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded font-semibold uppercase">
                Manual Maintenance
              </span>
            </div>

            {/* Dense Manual Spreadsheet Visual */}
            <div className="p-4 rounded-xl bg-[#030407] border border-white/[0.06] font-mono text-[11px] space-y-3">
              <div className="grid grid-cols-4 text-zinc-500 pb-2 border-b border-white/[0.06] text-[10px] uppercase tracking-wider font-bold">
                <span>Problem</span>
                <span>Last Seen</span>
                <span>Next Review</span>
                <span className="text-right">Status</span>
              </div>
              <div className="grid grid-cols-4 text-zinc-400 items-center">
                <span className="truncate text-zinc-300">Min Window</span>
                <span>14d ago</span>
                <span className="text-amber-400/90 font-semibold">Manual?</span>
                <span className="text-right text-zinc-500">Unsure</span>
              </div>
              <div className="grid grid-cols-4 text-zinc-400 items-center">
                <span className="truncate text-zinc-300">Rain Water</span>
                <span>21d ago</span>
                <span className="text-zinc-600">None</span>
                <span className="text-right text-rose-400/90 font-semibold">
                  Overdue
                </span>
              </div>
              <div className="grid grid-cols-4 text-zinc-400 items-center">
                <span className="truncate text-zinc-300">LRU Cache</span>
                <span>34d ago</span>
                <span className="text-zinc-600">Unknown</span>
                <span className="text-right text-rose-400/90 font-semibold">
                  Decayed
                </span>
              </div>
            </div>

            {/* User Responsibilities List */}
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-300 font-normal">
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4.5 h-4.5 text-zinc-500 shrink-0 mt-0.5" />
                <span>
                  You must manually guess review dates for every problem
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4.5 h-4.5 text-zinc-500 shrink-0 mt-0.5" />
                <span>No automated Ebbinghaus memory curve calculations</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4.5 h-4.5 text-zinc-500 shrink-0 mt-0.5" />
                <span>
                  Requires updating cells, dates, and status rows daily
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4.5 h-4.5 text-zinc-500 shrink-0 mt-0.5" />
                <span>Messy rows become overwhelming and hard to maintain</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4.5 h-4.5 text-zinc-500 shrink-0 mt-0.5" />
                <span>
                  Zero warning before solution patterns slip away completely
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-5 mt-5 border-t border-white/[0.06] text-xs font-mono text-zinc-500">
            &ldquo;Your spreadsheet stores rows. You do all the heavy lifting.&rdquo;
          </div>
        </div>

        {/* RIGHT: TRACE (Trace manages the system) */}
        <div className="group rounded-2xl border border-white/[0.08] bg-[#07090E] p-6 sm:p-7 backdrop-blur-2xl hover:border-white/[0.15] transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Tag Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-white font-mono text-xs">
                <ShieldCheck className="w-4 h-4 text-[#a6e795]" weight="fill" />
                <span className="uppercase tracking-wider font-semibold text-white">
                  TRACE MEMORY ENGINE
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-300 bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded font-semibold uppercase">
                Autonomous Recall
              </span>
            </div>

            {/* Intelligent Workflow Visual */}
            <div className="p-4 rounded-xl bg-[#030407] border border-white/[0.06] font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-zinc-400 text-[10px] pb-2 border-b border-white/[0.06]">
                <span className="text-zinc-300 font-semibold flex items-center gap-1.5 uppercase tracking-wider">
                  TODAY&apos;S TARGETED QUEUE
                </span>
                <span className="text-zinc-400 font-mono">
                  8 problems • ~18 min
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">
                    Minimum Window Substring
                  </div>
                  <div className="text-[10px] text-[#a6e795] font-semibold">
                    Calculated Decay Point • Hard
                  </div>
                </div>
                <div className="px-3.5 py-2 rounded-lg bg-white text-black font-extrabold text-[11px] flex items-center gap-1.5 hover:bg-zinc-200 transition-colors cursor-pointer">
                  Review Now{" "}
                  <ArrowRight className="w-3.5 h-3.5" weight="bold" />
                </div>
              </div>
            </div>

            {/* Trace Automated Features List */}
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-300 font-normal">
              <li className="flex items-start gap-2.5">
                <CheckCircle
                  className="w-4.5 h-4.5 text-[#a6e795] shrink-0 mt-0.5"
                  weight="fill"
                />
                <span>
                  Zero setup required—log in and immediately start your daily deck
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle
                  className="w-4.5 h-4.5 text-[#a6e795] shrink-0 mt-0.5"
                  weight="fill"
                />
                <span>
                  Trace calculates exact SuperMemo-2 decay dates automatically
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle
                  className="w-4.5 h-4.5 text-[#a6e795] shrink-0 mt-0.5"
                  weight="fill"
                />
                <span>
                  Adaptive engine: Hard problems return sooner to combat decay
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle
                  className="w-4.5 h-4.5 text-[#a6e795] shrink-0 mt-0.5"
                  weight="fill"
                />
                <span>
                  Spaced repetition locks algorithm patterns into permanent memory
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle
                  className="w-4.5 h-4.5 text-[#a6e795] shrink-0 mt-0.5"
                  weight="fill"
                />
                <span>
                  Pure focus on coding; Trace manages all your memory queues
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-5 mt-5 border-t border-white/[0.06] text-xs font-mono text-zinc-400">
            &ldquo;You solve the code. Trace guarantees the retention.&rdquo;
          </div>
        </div>
      </div>
    </section>
  );
}

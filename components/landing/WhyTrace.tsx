"use client";

import { useState, useEffect, useRef } from "react";
import { useLenis } from "@/components/providers/lenis-provider";
import { Lightning, ArrowRight, Table, Sparkle } from "@phosphor-icons/react";

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
      {/* Hairline Top Divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#99E372]/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Core Message Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl">
          <Lightning className="w-3.5 h-3.5 text-[#99E372]" weight="fill" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-300">
            System Comparison
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
          Spreadsheets store your problems.{" "}
          <span className="text-[#99E372] block mt-1 sm:inline sm:mt-0">
            Trace decides what you need to remember next.
          </span>
        </h2>
      </div>

      {/* Visual Contrast Grid */}
      <div
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch transition-all duration-300 ease-out"
        style={{ transform: `translateY(${cardsParallax}px)` }}
      >
        {/* LEFT: SPREADSHEET (You manage the system) */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#07090E] p-6 sm:p-8 backdrop-blur-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Tag Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs">
                <Table className="w-4 h-4" />
                <span className="uppercase tracking-wider font-semibold text-zinc-400">
                  SPREADSHEET
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] border border-white/[0.06] px-2.5 py-0.5 rounded">
                You manage the revision system
              </span>
            </div>

            {/* Dense Manual Spreadsheet Visual */}
            <div className="p-3.5 rounded-xl bg-[#030407] border border-white/[0.06] font-mono text-[11px] space-y-2">
              <div className="grid grid-cols-4 text-zinc-500 pb-1.5 border-b border-white/[0.06] text-[10px]">
                <span>Problem</span>
                <span>Last Seen</span>
                <span>Next Review</span>
                <span className="text-right">Status</span>
              </div>
              <div className="grid grid-cols-4 text-zinc-400 items-center">
                <span className="truncate text-zinc-300">Min Window</span>
                <span>14d ago</span>
                <span className="text-amber-400 font-semibold">Manual?</span>
                <span className="text-right text-zinc-500">Unsure</span>
              </div>
              <div className="grid grid-cols-4 text-zinc-400 items-center">
                <span className="truncate text-zinc-300">Rain Water</span>
                <span>21d ago</span>
                <span className="text-zinc-500">None</span>
                <span className="text-right text-red-400 font-semibold">Overdue</span>
              </div>
            </div>

            {/* User Responsibilities List */}
            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 shrink-0">•</span>
                <span>Decide when every problem should be reviewed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 shrink-0">•</span>
                <span>Track what you forgot</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 shrink-0">•</span>
                <span>Manually manage review dates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 shrink-0">•</span>
                <span>Search through rows to find what needs attention</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 shrink-0">•</span>
                <span>Maintain the system yourself</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-white/[0.06] text-xs font-mono text-zinc-400">
            &ldquo;Your spreadsheet stores the data. You do the thinking.&rdquo;
          </div>
        </div>

        {/* RIGHT: TRACE (Trace manages the system) */}
        <div className="rounded-2xl border border-[#99E372]/40 bg-[#07090E] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Tag Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2 text-[#99E372] font-mono text-xs">
                <Sparkle className="w-4 h-4" weight="fill" />
                <span className="uppercase tracking-wider font-semibold">
                  TRACE
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#99E372] bg-[#99E372]/10 border border-[#99E372]/30 px-2.5 py-0.5 rounded font-semibold">
                Trace manages the revision system
              </span>
            </div>

            {/* Intelligent Workflow Visual */}
            <div className="p-3.5 rounded-xl bg-[#030407] border border-[#99E372]/30 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-zinc-400 text-[11px] pb-2 border-b border-white/[0.06]">
                <span className="text-white font-semibold flex items-center gap-1.5">
                  TODAY&apos;S REVIEW
                </span>
                <span className="text-[#99E372]">8 problems • ~18 min</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div className="space-y-0.5">
                  <div className="text-xs font-medium text-white">
                    Minimum Window Substring
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Calculated review window • Hard
                  </div>
                </div>
                <div className="px-3 py-1 rounded bg-[#99E372] text-black font-semibold text-[11px] flex items-center gap-1">
                  Review <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Trace Automated Features List */}
            <ul className="space-y-2.5 text-xs text-zinc-200 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-[#99E372] shrink-0">•</span>
                <span>Solve &rarr; review &rarr; give feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#99E372] shrink-0">•</span>
                <span>Trace calculates when to review again</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#99E372] shrink-0">•</span>
                <span>Difficult problems return sooner</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#99E372] shrink-0">•</span>
                <span>Strong memories are spaced further apart</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#99E372] shrink-0">•</span>
                <span>Open Trace and see exactly what needs attention</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-white/[0.08] text-xs font-mono text-[#99E372] font-semibold">
            &ldquo;You solve the problems. Trace manages the memory.&rdquo;
          </div>
        </div>
      </div>
    </section>
  );
}

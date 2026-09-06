"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, House, Archive, Fire, ClockClockwise } from "@phosphor-icons/react";

interface ReviewCompletedProps {
  totalCount?: number;
  ratingsBreakdown?: Record<string, number>;
}

export default function ReviewCompleted({ totalCount, ratingsBreakdown }: ReviewCompletedProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <div className="max-w-lg w-full rounded-2xl border border-zinc-800/80 bg-[#0d1015]/95 p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md flex flex-col items-center">
        {/* Glowing Success Badge */}
        <div className="w-16 h-16 rounded-2xl bg-[#a6e795]/10 border border-[#a6e795]/30 flex items-center justify-center text-[#a6e795] shadow-[0_0_30px_rgba(166,231,149,0.25)] mb-5">
          <CheckCircle size={36} weight="duotone" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Review Session Complete!
        </h1>

        <p className="text-sm text-zinc-400 mt-2 max-w-sm leading-relaxed">
          {totalCount
            ? `You reviewed ${totalCount} algorithm ${totalCount === 1 ? "problem" : "problems"} today.`
            : "You reviewed all your scheduled problems for today."}
        </p>

        {/* Session Ratings Breakdown */}
        {ratingsBreakdown && (
          <div className="grid grid-cols-4 gap-2.5 w-full mt-6">
            <div className="flex flex-col items-center py-2 px-1 rounded-xl border border-rose-500/25 bg-rose-500/10">
              <span className="text-base font-bold font-mono text-rose-400">
                {ratingsBreakdown.AGAIN || 0}
              </span>
              <span className="text-[10px] text-zinc-400 uppercase font-semibold mt-0.5">Again</span>
            </div>
            <div className="flex flex-col items-center py-2 px-1 rounded-xl border border-amber-500/25 bg-amber-500/10">
              <span className="text-base font-bold font-mono text-amber-400">
                {ratingsBreakdown.HARD || 0}
              </span>
              <span className="text-[10px] text-zinc-400 uppercase font-semibold mt-0.5">Hard</span>
            </div>
            <div className="flex flex-col items-center py-2 px-1 rounded-xl border border-sky-500/25 bg-sky-500/10">
              <span className="text-base font-bold font-mono text-sky-400">
                {ratingsBreakdown.MEDIUM || 0}
              </span>
              <span className="text-[10px] text-zinc-400 uppercase font-semibold mt-0.5">Good</span>
            </div>
            <div className="flex flex-col items-center py-2 px-1 rounded-xl border border-[#a6e795]/25 bg-[#a6e795]/10">
              <span className="text-base font-bold font-mono text-[#a6e795]">
                {ratingsBreakdown.EASY || 0}
              </span>
              <span className="text-[10px] text-zinc-400 uppercase font-semibold mt-0.5">Easy</span>
            </div>
          </div>
        )}

        {/* Info Metric Pill */}
        <div className="flex items-center gap-2 mt-5 px-4 py-2 rounded-xl border border-zinc-800/80 bg-zinc-900/60 text-xs text-zinc-300">
          <ClockClockwise size={15} weight="bold" className="text-[#a6e795]" />
          <span>Spaced repetition intervals recalculated</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#a6e795] hover:bg-[#93d382] text-zinc-950 font-bold text-xs shadow-[0_0_20px_rgba(166,231,149,0.2)] hover:shadow-[0_0_25px_rgba(166,231,149,0.3)] transition-all cursor-pointer"
          >
            <House size={16} weight="bold" />
            <span>Back to Dashboard</span>
          </button>

          <button
            onClick={() => router.push("/problems")}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs transition-all cursor-pointer"
          >
            <Archive size={16} />
            <span>Problem Library</span>
          </button>
        </div>
      </div>
    </div>
  );
}


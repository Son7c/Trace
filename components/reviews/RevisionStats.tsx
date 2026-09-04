import type { Problem } from "@/prisma/generated/client/client";
import { ClockCounterClockwise, TrendUp, CalendarCheck } from "@phosphor-icons/react";

type Props = {
  problem: Problem;
};

export default function RevisionStats({ problem }: Props) {
  const isDueToday =
    problem.nextRevisionDate &&
    new Date(problem.nextRevisionDate) <= new Date();

  const nextDate = problem.nextRevisionDate
    ? new Date(problem.nextRevisionDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "Not scheduled";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      {/* Total Revisions Card */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 backdrop-blur-sm transition-all hover:border-zinc-700/80">
        <div className="flex items-center justify-between text-zinc-500 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            Total Reviews
          </span>
          <ClockCounterClockwise size={16} className="text-zinc-400" />
        </div>
        <p className="text-2xl font-bold text-white tracking-tight">
          {problem.revisionCount || 0}
        </p>
        <span className="text-[10px] text-zinc-500 mt-0.5 block">
          Repetition iterations
        </span>
      </div>

      {/* Ease Factor Card */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 backdrop-blur-sm transition-all hover:border-zinc-700/80">
        <div className="flex items-center justify-between text-zinc-500 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            Ease Factor
          </span>
          <TrendUp size={16} className="text-[#A6E795]" weight="bold" />
        </div>
        <p className="text-2xl font-bold text-[#A6E795] tracking-tight">
          {Number(problem.easeFactor || 2.5).toFixed(2)}
        </p>
        <span className="text-[10px] text-zinc-500 mt-0.5 block">
          SM-2 memory strength
        </span>
      </div>

      {/* Next Review Card */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 backdrop-blur-sm transition-all hover:border-zinc-700/80">
        <div className="flex items-center justify-between text-zinc-500 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            Next Review
          </span>
          <CalendarCheck size={16} className={isDueToday ? "text-[#A6E795]" : "text-zinc-400"} />
        </div>
        <p className={`text-base font-bold tracking-tight ${isDueToday ? "text-[#A6E795]" : "text-zinc-200"}`}>
          {isDueToday ? "Due Today" : nextDate}
        </p>
        <span className="text-[10px] text-zinc-500 mt-0.5 block">
          {isDueToday ? "Ready for spaced recall" : "Scheduled repetition"}
        </span>
      </div>
    </div>
  );
}


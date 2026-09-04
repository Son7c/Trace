import type { RevisionLog } from "@/prisma/generated/client/client";
import { Clock } from "@phosphor-icons/react";

type Prop = {
  revision: RevisionLog;
};

export default function RevisionHistory({ revision }: Prop) {
  const revDate = new Date(revision.reviewedAt);
  const dateStr = revDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = revDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const feedbackColors: Record<string, string> = {
    AGAIN: "border-rose-500/40 bg-rose-500/15 text-rose-400",
    HARD: "border-amber-500/40 bg-amber-500/15 text-amber-400",
    MEDIUM: "border-sky-500/40 bg-sky-500/15 text-sky-400",
    EASY: "border-[#A6E795]/40 bg-[#A6E795]/15 text-[#A6E795]",
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-4 py-3 text-xs transition-colors hover:border-zinc-700">
      <div className="flex items-center gap-3">
        <Clock size={14} className="text-zinc-500 shrink-0" />
        <span className="text-zinc-300 font-medium">{dateStr}</span>
        <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
          {timeStr}
        </span>
      </div>

      <span
        className={`rounded-md border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${feedbackColors[revision.userFeedback] ||
          "border-zinc-700 bg-zinc-800 text-zinc-300"
          }`}
      >
        {revision.userFeedback}
      </span>
    </div>
  );
}


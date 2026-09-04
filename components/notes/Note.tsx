import { Note as PrismaNote } from "@/prisma/generated/client/client";

type NoteProps = {
  note: PrismaNote | null | undefined;
};

export default function Note({ note }: NoteProps) {
  if (!note) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-6 text-center text-xs text-zinc-500">
        No notes recorded for this problem yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Section title="Brute Force Approach" content={note.bruteForceApproach} isCode />
      <Section title="Optimized Approach" content={note.optimizedApproach} isCode />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Section title="Time Complexity" content={note.timeComplexity} isBadge />
        <Section title="Space Complexity" content={note.spaceComplexity} isBadge />
      </div>

      <Section title="Key Learning" content={note.keyLearning} />
      <Section title="Core Intuition" content={note.intuition} />
      <Section title="Mistakes & Edge Cases" content={note.mistakes} />
      <Section title="Interview Explanation" content={note.interviewExplanation} />
    </div>
  );
}

function Section({
  title,
  content,
  isCode,
  isBadge,
}: {
  title: string;
  content: string | null | undefined;
  isCode?: boolean;
  isBadge?: boolean;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
        {title}
      </h3>

      {isBadge ? (
        <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-xs font-mono font-semibold text-[#A6E795]">
          {content || "Not specified"}
        </div>
      ) : isCode ? (
        <div className="rounded-xl border border-zinc-800 bg-[#0C0E15] p-4 font-mono text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed shadow-inner">
          {content || <span className="text-zinc-600 font-sans italic">Not provided</span>}
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
          {content || <span className="text-zinc-600 italic">Not provided</span>}
        </div>
      )}
    </div>
  );
}

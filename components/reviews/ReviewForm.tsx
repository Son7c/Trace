"use client";
import { Feedback } from "@/prisma/generated/client/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FormProps = {
  id: string | null;
};

export default function ReviewForm({ id }: FormProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<Feedback>("AGAIN");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleReview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/problems/${id}/revision`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userFeedback: feedback }),
      });
      if (!response.ok) {
        console.error("Coudn't publish revisionLog");
        return;
      }
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleReview} className="space-y-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
        Log a Quick Review
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(["AGAIN", "HARD", "MEDIUM", "EASY"] as Feedback[]).map((type) => {
          const isSelected = feedback === type;
          const colorMap: Record<Feedback, string> = {
            AGAIN: isSelected
              ? "bg-rose-500/20 border-rose-500 text-rose-400"
              : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
            HARD: isSelected
              ? "bg-amber-500/20 border-amber-500 text-amber-400"
              : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
            MEDIUM: isSelected
              ? "bg-sky-500/20 border-sky-500 text-sky-400"
              : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
            EASY: isSelected
              ? "bg-[#A6E795]/20 border-[#A6E795] text-[#A6E795]"
              : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
          };

          return (
            <button
              key={type}
              type="button"
              onClick={() => setFeedback(type)}
              className={`rounded-xl border p-2.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${colorMap[type]}`}
            >
              {type}
            </button>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/60 py-2 text-xs font-semibold text-white transition-all cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? "Logging..." : `Log Review as ${feedback}`}
      </button>
    </form>
  );
}

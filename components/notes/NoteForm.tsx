"use client";

import { Note } from "@/prisma/generated/client/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type FormProps = {
  id: string | null;
};

export default function NoteForm({ id }: FormProps) {
  const [brute, setBrute] = useState("");
  const [optimized, setOptimized] = useState("");
  const [tc, setTc] = useState("");
  const [sc, setSc] = useState("");
  const [mistakes, setMistakes] = useState("");
  const [keyLearning, setKeyLearning] = useState("");
  const [intuition, setIntuition] = useState("");
  const [interview, setInterview] = useState("");
  const [hasNote, setHasNote] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    const fetchNote = async () => {
      const response = await fetch(`/api/problems/${id}/note`);

      if (response.status === 404) {
        return;
      }

      if (!response.ok) {
        console.error("Failed to fetch note");
        return;
      }

      const res = await response.json();
      setFormData(res);
      setHasNote(true);
    };
    fetchNote();
  }, [id]);

  const noteData = {
    bruteForceApproach: brute,
    optimizedApproach: optimized,
    timeComplexity: tc,
    spaceComplexity: sc,
    mistakes,
    keyLearning,
    intuition,
    interviewExplanation: interview,
  };

  const setFormData = (note: Note) => {
    setBrute(note?.bruteForceApproach ?? "");
    setOptimized(note?.optimizedApproach ?? "");
    setTc(note?.timeComplexity ?? "");
    setSc(note?.spaceComplexity ?? "");
    setMistakes(note?.mistakes ?? "");
    setKeyLearning(note?.keyLearning ?? "");
    setIntuition(note?.intuition ?? "");
    setInterview(note?.interviewExplanation ?? "");
  };

  const handleEditNote = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/problems/${id}/note`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });
      if (!response.ok) {
        console.error("Failed to update note");
        return;
      }
      const data = await response.json();
      setFormData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const formReset = () => {
    setBrute("");
    setOptimized("");
    setTc("");
    setSc("");
    setMistakes("");
    setKeyLearning("");
    setIntuition("");
    setInterview("");
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/problems/${id}/note`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });
      if (!response.ok) {
        console.error("Failed to update note");
        return;
      }
      formReset();
    } catch (err) {
      console.error(err);
      return;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) {
      console.error("Problem id is missing");
      return;
    }
    if (hasNote) {
      await handleEditNote();
      router.push(`/problems/${id}`);
    } else {
      setIsSaving(true);
      try {
        const response = await fetch(`/api/problems/${id}/note`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noteData),
        });
        if (!response.ok) {
          console.error("Failed to Create note");
          return;
        }
        const data = await response.json();
        setHasNote(true);
        setFormData(data);
      } catch (err) {
        console.error(err);
        return;
      } finally {
        setIsSaving(false);
        router.push(`/problems/${id}`);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Time Complexity</label>
            <input
              type="text"
              placeholder="e.g. O(N) or O(log N)"
              value={tc}
              onChange={(e) => setTc(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-[#A6E795]/60 focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Space Complexity</label>
            <input
              type="text"
              placeholder="e.g. O(1) or O(N)"
              value={sc}
              onChange={(e) => setSc(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-[#A6E795]/60 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">Core Intuition</label>
          <textarea
            rows={3}
            placeholder="Mental model and core insight behind the solution..."
            value={intuition}
            onChange={(e) => setIntuition(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:border-[#A6E795]/60 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">Key Learning</label>
          <textarea
            rows={2}
            placeholder="Key takeaway or concept to remember..."
            value={keyLearning}
            onChange={(e) => setKeyLearning(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:border-[#A6E795]/60 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">Mistakes & Edge Cases</label>
          <textarea
            rows={3}
            placeholder="Edge cases to consider (one per line)..."
            value={mistakes}
            onChange={(e) => setMistakes(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:border-[#A6E795]/60 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">Interview Pitch / Walkthrough</label>
          <textarea
            rows={3}
            placeholder="How you would explain this solution in an interview..."
            value={interview}
            onChange={(e) => setInterview(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:border-[#A6E795]/60 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">Brute Force Approach Code</label>
          <textarea
            rows={4}
            placeholder="Brute force code snippet..."
            value={brute}
            onChange={(e) => setBrute(e.target.value)}
            className="w-full font-mono rounded-xl border border-zinc-800 bg-[#0C0E15] p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:border-[#A6E795]/60 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">Optimized Approach Code</label>
          <textarea
            rows={4}
            placeholder="Optimized approach code snippet..."
            value={optimized}
            onChange={(e) => setOptimized(e.target.value)}
            className="w-full font-mono rounded-xl border border-zinc-800 bg-[#0C0E15] p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:border-[#A6E795]/60 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
          {hasNote && (
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete Notes"}
            </button>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-[#A6E795] hover:bg-[#93d382] px-5 py-2 text-xs font-semibold text-black transition-all shadow-[0_0_15px_rgba(166,231,149,0.2)] cursor-pointer disabled:opacity-50"
          >
            {isSaving ? "Saving..." : hasNote ? "Update Notes" : "Create Notes"}
          </button>
        </div>
      </form>
    </div>
  );
}

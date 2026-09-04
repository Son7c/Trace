"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  PencilSimple,
  CircleNotch,
  WarningCircle,
  Check,
} from "@phosphor-icons/react";
import PlatformLogo from "./PlatformLogo";

export type PlatformType =
  | "LEETCODE"
  | "GFG"
  | "CODEFORCES"
  | "CODECHEF"
  | "HACKERRANK"
  | "OTHERS";

export type DifficultyType = "EASY" | "MEDIUM" | "HARD";

export type EditProblemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  problem: {
    id: string;
    title: string;
    questNo?: string | number | null;
    platform: PlatformType;
    difficulty: DifficultyType;
    url: string;
    tags?: string[];
  };
  onSuccess: (updatedProblem: any) => void;
};

const PLATFORMS: { id: PlatformType; label: string }[] = [
  { id: "LEETCODE", label: "LeetCode" },
  { id: "GFG", label: "GFG" },
  { id: "CODEFORCES", label: "Codeforces" },
  { id: "CODECHEF", label: "CodeChef" },
  { id: "HACKERRANK", label: "HackerRank" },
  { id: "OTHERS", label: "Other" },
];

const DIFFICULTIES: { id: DifficultyType; label: string; color: string }[] = [
  {
    id: "EASY",
    label: "Easy",
    color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  },
  {
    id: "MEDIUM",
    label: "Medium",
    color: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  },
  {
    id: "HARD",
    label: "Hard",
    color: "bg-rose-500/10 border-rose-500/30 text-rose-400",
  },
];

export default function EditProblemModal({
  isOpen,
  onClose,
  problem,
  onSuccess,
}: EditProblemModalProps) {
  const [title, setTitle] = useState(problem.title || "");
  const [questNo, setQuestNo] = useState(problem.questNo?.toString() || "");
  const [platform, setPlatform] = useState<PlatformType>(problem.platform);
  const [difficulty, setDifficulty] = useState<DifficultyType>(problem.difficulty);
  const [url, setUrl] = useState(problem.url || "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(problem.tags || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(problem.title || "");
      setQuestNo(problem.questNo?.toString() || "");
      setPlatform(problem.platform);
      setDifficulty(problem.difficulty);
      setUrl(problem.url || "");
      setTags(problem.tags || []);
      setError(null);
    }
  }, [isOpen, problem]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/problems/${problem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          questNo: questNo.trim() || null,
          platform,
          difficulty,
          url: url.trim(),
          tags,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update problem");
      }

      const updated = await res.json();
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#0C0E15] p-6 shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#A6E795]/10 border border-[#A6E795]/20 text-[#A6E795]">
              <PencilSimple size={18} weight="bold" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Edit Problem</h2>
              <p className="text-xs text-zinc-400">Update problem details and tags</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
            <WarningCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title & Problem ID */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1.5">
              <label className="font-semibold text-zinc-300">Problem Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-zinc-200 focus:border-[#A6E795]/60 focus:outline-none transition-colors"
                placeholder="e.g. Two Sum"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Problem #</label>
              <input
                type="text"
                value={questNo}
                onChange={(e) => setQuestNo(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-zinc-200 focus:border-[#A6E795]/60 focus:outline-none transition-colors"
                placeholder="e.g. 1"
              />
            </div>
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Problem URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-zinc-200 focus:border-[#A6E795]/60 focus:outline-none transition-colors font-mono text-[11px]"
              placeholder="https://leetcode.com/problems/..."
            />
          </div>

          {/* Platform & Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as PlatformType)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-200 focus:border-[#A6E795]/60 focus:outline-none transition-colors"
              >
                {PLATFORMS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyType)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-200 focus:border-[#A6E795]/60 focus:outline-none transition-colors"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-zinc-200 focus:border-[#A6E795]/60 focus:outline-none transition-colors"
                placeholder="Add tag and press Enter"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold transition-colors"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 text-[11px]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-rose-400 text-zinc-500"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#A6E795] hover:bg-[#93d382] text-black font-bold transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <CircleNotch size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={14} weight="bold" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

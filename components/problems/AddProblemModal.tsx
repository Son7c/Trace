"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  ArrowRight,
  Link as LinkIcon,
  Plus,
  CircleNotch,
  WarningCircle,
} from "@phosphor-icons/react";

export type PlatformType =
  | "LEETCODE"
  | "GFG"
  | "CODEFORCES"
  | "CODECHEF"
  | "HACKERRANK"
  | "OTHERS";

export type AddProblemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newProblem: any) => void;
};

const PLATFORMS: { id: PlatformType; label: string }[] = [
  { id: "LEETCODE", label: "LeetCode" },
  { id: "GFG", label: "GFG" },
  { id: "CODEFORCES", label: "Codeforces" },
  { id: "CODECHEF", label: "CodeChef" },
  { id: "HACKERRANK", label: "HackerRank" },
  { id: "OTHERS", label: "Other" },
];

function detectPlatform(val: string): PlatformType | null {
  const lower = val.toLowerCase();
  if (lower.includes("leetcode.com")) return "LEETCODE";
  if (lower.includes("geeksforgeeks.org")) return "GFG";
  if (lower.includes("codeforces.com")) return "CODEFORCES";
  if (lower.includes("codechef.com")) return "CODECHEF";
  if (lower.includes("hackerrank.com")) return "HACKERRANK";
  if (lower.startsWith("http://") || lower.startsWith("https://"))
    return "OTHERS";
  return null;
}

export default function AddProblemModal({
  isOpen,
  onClose,
  onSuccess,
}: AddProblemModalProps) {
  const router = useRouter();
  const [urlOrTitle, setUrlOrTitle] = useState("");
  const [selectedPlatform, setSelectedPlatform] =
    useState<PlatformType>("LEETCODE");
  const [isAutoDetected, setIsAutoDetected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, loading]);

  // Platform auto-detection on typing/pasting
  useEffect(() => {
    const detected = detectPlatform(urlOrTitle);
    if (detected) {
      setSelectedPlatform(detected);
      setIsAutoDetected(true);
    } else {
      setIsAutoDetected(false);
    }
  }, [urlOrTitle]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlOrTitle.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      let problemPayload: any = null;

      // 1. LeetCode Auto-Fetch
      if (selectedPlatform === "LEETCODE") {
        const fetchRes = await fetch("/api/leetcode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urlOrSlug: urlOrTitle.trim() }),
        });

        if (fetchRes.ok) {
          const leetcodeData = await fetchRes.json();
          problemPayload = {
            title: leetcodeData.title,
            platform: "LEETCODE",
            difficulty: leetcodeData.difficulty.toUpperCase(),
            url: leetcodeData.url,
            tags: leetcodeData.tags,
            questNo: leetcodeData.questionId,
          };
        } else {
          problemPayload = {
            title: urlOrTitle.trim(),
            platform: "LEETCODE",
            difficulty: "EASY",
            url: urlOrTitle.startsWith("http") ? urlOrTitle.trim() : "#",
            tags: ["General"],
            questNo: /^\d+$/.test(urlOrTitle.trim())
              ? urlOrTitle.trim()
              : undefined,
          };
        }
      } else {
        // 2. Non-LeetCode Platforms
        problemPayload = {
          title: urlOrTitle.trim(),
          platform: selectedPlatform,
          difficulty: "MEDIUM",
          url: urlOrTitle.startsWith("http") ? urlOrTitle.trim() : "#",
          tags: ["General"],
          questNo: undefined,
        };
      }

      // Save to Prisma database
      const saveRes = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(problemPayload),
      });

      if (!saveRes.ok) {
        const errData = await saveRes.json();
        throw new Error(errData.error || "Failed to save problem");
      }

      const created = await saveRes.json();
      setUrlOrTitle("");
      setSelectedPlatform("LEETCODE");
      onSuccess?.(created);
      onClose();
      router.push(`/problems/${created.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to add problem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Backdrop */}
      <div
        onClick={() => !loading && onClose()}
        className="fixed inset-0 bg-black/80 transition-opacity duration-75"
      />

      {/* Glass Modal Window */}
      <div className="relative w-full max-w-md bg-[#0C0E15] border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-2xl z-10 space-y-4 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-[#a6e795] shrink-0">
              <Plus size={16} weight="bold" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight leading-none">
                Add Problem
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1">
                Paste problem URL or enter title
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X size={15} />
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <WarningCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Problem URL or Title
            </label>

            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-zinc-500 pointer-events-none">
                <LinkIcon size={16} />
              </div>

              <input
                ref={inputRef}
                type="text"
                disabled={loading}
                value={urlOrTitle}
                onChange={(e) => setUrlOrTitle(e.target.value)}
                placeholder="https://leetcode.com/problems/3sum/ or '3Sum'"
                className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-[#a6e795]/60 text-white text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none transition-colors placeholder:text-zinc-500 font-sans shadow-inner disabled:opacity-60"
              />
            </div>
          </div>

          {/* Platform Chips */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-zinc-400">Platform</span>
              {isAutoDetected && (
                <span className="text-[#a6e795] font-medium text-[10px]">
                  ✓ Auto-detected from link
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {PLATFORMS.map((p) => {
                const isActive = selectedPlatform === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setSelectedPlatform(p.id);
                      setIsAutoDetected(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer border ${
                      isActive
                        ? "bg-[#a6e795]/15 border-[#a6e795] text-[#a6e795] font-extrabold shadow-[0_0_10px_rgba(166,231,149,0.15)]"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 font-medium"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-800/80">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!urlOrTitle.trim() || loading}
              className="px-4.5 py-2 rounded-xl bg-white hover:bg-zinc-200 disabled:opacity-40 disabled:hover:bg-white text-black text-xs font-bold transition-colors cursor-pointer shadow-md flex items-center gap-1.5 min-w-[85px] justify-center"
            >
              {loading ? (
                <>
                  <CircleNotch size={14} className="animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight size={14} weight="bold" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

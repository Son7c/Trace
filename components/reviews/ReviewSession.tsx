"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  CaretLeft,
  CaretRight,
  CaretDown,
  ArrowSquareOut,
  ArrowCounterClockwise,
  Warning,
  Check,
  TrendUp,
  X,
  Code,
  Copy,
} from "@phosphor-icons/react";
import PlatformLogo from "@/components/problems/PlatformLogo";
import ReviewCompleted from "./ReviewCompleted";
import { calculateSM2 } from "@/lib/sm2";
import type { Problem, Note as NoteModel } from "@/prisma/generated/client/client";
import { Feedback } from "@/prisma/generated/client/enums";

export type ProblemWithNote = Problem & {
  note?: NoteModel | null;
};

interface ReviewSessionProps {
  problems: ProblemWithNote[];
}

const PLATFORM_LABELS: Record<string, string> = {
  LEETCODE: "LeetCode",
  GFG: "GFG",
  CODEFORCES: "Codeforces",
  CODECHEF: "CodeChef",
  HACKERRANK: "HackerRank",
  OTHERS: "Other",
};

export default function ReviewSession({ problems }: ReviewSessionProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [ratingsBreakdown, setRatingsBreakdown] = useState<Record<Feedback, number>>({
    AGAIN: 0,
    HARD: 0,
    MEDIUM: 0,
    EASY: 0,
  });

  const currentProblem = problems[currentIndex];

  // Real SM-2 calculation to pre-calculate next interval days for each rating
  const calcNextInterval = useCallback(
    (feedback: Feedback) => {
      if (!currentProblem) return "";
      try {
        const safeProblem: Problem = {
          ...currentProblem,
          easeFactor: currentProblem.easeFactor ?? 2.5,
          intervalDays: currentProblem.intervalDays ?? 1,
          revisionCount: currentProblem.revisionCount ?? 0,
        };
        const { intervalDays } = calculateSM2(safeProblem, feedback);
        return intervalDays <= 1 ? `${intervalDays} day` : `${intervalDays} days`;
      } catch (err) {
        console.error("SM-2 calculation error:", err);
        return "1 day";
      }
    },
    [currentProblem]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < problems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsRevealed(false);
      setCopiedCode(false);
    }
  }, [currentIndex, problems.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsRevealed(false);
      setCopiedCode(false);
    }
  }, [currentIndex]);

  // Optimistic review submission: instant card transition with background sync
  const submitReview = useCallback(
    (feedback: Feedback) => {
      if (!currentProblem) return;

      const problemId = currentProblem.id;

      // Track session metrics
      setRatingsBreakdown((prev) => ({
        ...prev,
        [feedback]: (prev[feedback] || 0) + 1,
      }));

      // Fire backend revision logging asynchronously without blocking UI
      fetch(`/api/problems/${problemId}/revision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userFeedback: feedback }),
      }).catch((err) => {
        console.error("Failed to submit review feedback:", err);
      });

      // Advance card immediately for zero-lag review flow
      if (currentIndex >= problems.length - 1) {
        setIsCompleted(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
        setIsRevealed(false);
        setCopiedCode(false);
      }
    },
    [currentProblem, currentIndex, problems.length]
  );

  // Keyboard navigation & rating shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input or textarea
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === "1") {
        e.preventDefault();
        submitReview(Feedback.AGAIN);
      } else if (e.key === "2") {
        e.preventDefault();
        submitReview(Feedback.HARD);
      } else if (e.key === "3") {
        e.preventDefault();
        submitReview(Feedback.MEDIUM);
      } else if (e.key === "4") {
        e.preventDefault();
        submitReview(Feedback.EASY);
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        handleNext();
      } else if (e.key === " ") {
        e.preventDefault();
        setIsRevealed((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [submitReview, handlePrevious, handleNext]);

  if (problems.length === 0) {
    return null;
  }

  if (isCompleted) {
    return (
      <ReviewCompleted
        totalCount={problems.length}
        ratingsBreakdown={ratingsBreakdown}
      />
    );
  }

  const codeSnippet =
    currentProblem.note?.optimizedApproach ||
    currentProblem.note?.bruteForceApproach ||
    "";

  const handleCopyCode = () => {
    if (!codeSnippet) return;
    navigator.clipboard.writeText(codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const diffKey = (currentProblem.difficulty || "MEDIUM").toUpperCase();
  const difficultyStyles: Record<string, string> = {
    EASY: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    MEDIUM: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    HARD: "border-rose-500/30 bg-rose-500/10 text-rose-400",
  };
  const diffClass = difficultyStyles[diffKey] || difficultyStyles.MEDIUM;

  const progressPercent = Math.round(((currentIndex + 1) / problems.length) * 100);
  const platformName =
    PLATFORM_LABELS[currentProblem.platform?.toUpperCase()] || currentProblem.platform;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-8 py-4 sm:py-6 pb-32 min-h-dvh flex flex-col justify-between select-none">
      {/* ═══════════════════════════════════════════════════════════
            TOP HEADER BAR
        ═══════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-zinc-850/60">
        {/* Left: Title & Subtitle */}
        <div className="flex items-center justify-between sm:block">
          <div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight">
              Review Session
            </h1>
            <p className="text-[11px] sm:text-xs text-zinc-400 font-medium mt-0.5">
              Revisit. Reinforce. Retain.
            </p>
          </div>

          {/* End Session Button for mobile inline */}
          <button
            onClick={() => {
              if (confirm("Are you sure you want to end this review session early?")) {
                router.push("/dashboard");
              }
            }}
            className="flex sm:hidden items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/80 text-xs text-zinc-300"
          >
            <X size={13} weight="bold" />
            <span>Exit</span>
          </button>
        </div>

        {/* Middle: Prominent, High-Visibility Progress Bar */}
        <div className="flex flex-col items-center justify-center w-full max-w-xs sm:max-w-sm mx-auto sm:mx-0">
          <div className="w-full h-2.5 sm:h-3 rounded-full bg-zinc-900 border border-zinc-700/80 p-0.5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)] overflow-hidden">
            <div
              className="h-full bg-[#a6e795] rounded-full shadow-[0_0_14px_rgba(166,231,149,0.8)] transition-all duration-300"
              style={{ width: `${Math.max(4, progressPercent)}%` }}
            />
          </div>
          <div className="flex items-center justify-between w-full mt-1 px-0.5 text-[11px] sm:text-xs font-mono">
            <span className="font-semibold text-zinc-200">
              {currentIndex + 1} of {problems.length}
            </span>
            <span className="text-zinc-400">
              {progressPercent}% complete
            </span>
          </div>
        </div>

        {/* Right: End Session Button for desktop */}
        <div className="hidden sm:flex justify-end">
          <button
            onClick={() => {
              if (confirm("Are you sure you want to end this review session early?")) {
                router.push("/dashboard");
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/80 hover:bg-zinc-850 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <X size={14} weight="bold" />
            <span>End Session</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
            MAIN REVIEW FLASHCARD & NAVIGATION ARROWS
        ═══════════════════════════════════════════════════════════ */}
      <div className="my-auto py-4 sm:py-6 flex items-center justify-between gap-2 sm:gap-4 w-full">
        {/* Previous Button (Left - Desktop) */}
        <div className="hidden sm:flex flex-col items-center gap-1.5 shrink-0">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="w-11 h-11 rounded-full border border-zinc-800 bg-[#0d1015] hover:bg-zinc-850 hover:border-zinc-700 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-all cursor-pointer shadow-lg"
            title="Previous problem (← or A)"
          >
            <CaretLeft size={18} />
          </button>
          <span className="text-[11px] text-zinc-500 font-medium">Previous</span>
          <span className="px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900/80 text-[10px] font-mono text-zinc-500">
            A
          </span>
        </div>

        {/* Center Flashcard */}
        <div
          key={currentProblem.id}
          className="flex-1 w-full max-w-2xl mx-auto rounded-2xl border border-zinc-800/80 bg-[#0c0f14]/90 p-4 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md relative transition-all duration-300 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Card Top Header: Platform Logo + Difficulty Badge */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <PlatformLogo platform={currentProblem.platform} size={18} />
              <span className="text-xs font-semibold text-zinc-300">
                {platformName}
              </span>
            </div>

            <span
              className={`px-2.5 py-0.5 rounded-md border text-[11px] font-bold tracking-wide uppercase ${diffClass}`}
            >
              {currentProblem.difficulty}
            </span>
          </div>

          {/* Problem Title */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center tracking-tight mt-2 mb-3">
            {currentProblem.title}
          </h2>

          {/* Tags */}
          {currentProblem.tags && currentProblem.tags.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6">
              {currentProblem.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md border border-zinc-800 bg-zinc-900/80 text-[11px] text-zinc-400 font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Prompt / Instructions to Solve First on the Platform */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 sm:p-5 text-center mb-6">
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
              Before grading yourself, first attempt this problem on{" "}
              <span className="text-zinc-200 font-medium">{platformName}</span>.
              Test your recall, then reveal the solution code and notes to evaluate your performance.
            </p>

            {currentProblem.url && (
              <a
                href={currentProblem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-[#a6e795] hover:bg-[#93d382] text-zinc-950 font-bold text-xs shadow-[0_0_15px_rgba(166,231,149,0.2)] hover:shadow-[0_0_20px_rgba(166,231,149,0.3)] transition-all cursor-pointer"
              >
                <span>Solve on {platformName}</span>
                <ArrowSquareOut size={15} weight="bold" />
              </a>
            )}
          </div>

          {/* Intuition Preview if available */}
          {currentProblem.note?.intuition && !isRevealed && (
            <p className="text-xs text-zinc-400 text-center italic max-w-lg mx-auto mb-4 line-clamp-2">
              &ldquo;{currentProblem.note.intuition}&rdquo;
            </p>
          )}

          {/* Reveal / Collapse Code Toggle */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setIsRevealed(!isRevealed)}
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-[#a6e795] transition-colors py-1 px-3 rounded-lg hover:bg-zinc-850 cursor-pointer"
            >
              <span>{isRevealed ? "Hide Solution & Code" : "Reveal Solution"}</span>
              <CaretDown
                size={14}
                className={`transition-transform duration-200 ${isRevealed ? "rotate-180" : ""
                  }`}
              />
            </button>
          </div>

          {/* ═══════════════════════════════════════════════════════════
                REVEALED CONTAINER (Code Snippet, Notes & Complexities)
            ═══════════════════════════════════════════════════════════ */}
          {isRevealed && (
            <div className="mt-5 pt-5 border-t border-zinc-850 space-y-4 animate-in fade-in duration-200">
              {/* Complexities Pill Badges */}
              {(currentProblem.note?.timeComplexity || currentProblem.note?.spaceComplexity) && (
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  {currentProblem.note?.timeComplexity && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-zinc-800 bg-zinc-900/80">
                      <span className="text-zinc-500 uppercase font-semibold text-[10px]">Time</span>
                      <span className="font-mono text-[#a6e795]">{currentProblem.note.timeComplexity}</span>
                    </div>
                  )}
                  {currentProblem.note?.spaceComplexity && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-zinc-800 bg-zinc-900/80">
                      <span className="text-zinc-500 uppercase font-semibold text-[10px]">Space</span>
                      <span className="font-mono text-[#a6e795]">{currentProblem.note.spaceComplexity}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Code Snippet Box */}
              <div>
                <div className="flex items-center justify-between pb-2 text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Code size={14} className="text-[#a6e795]" />
                    <span className="font-medium text-zinc-300">
                      Solution Code ({currentProblem.note?.language || "Optimal"})
                    </span>
                  </div>
                  {codeSnippet && (
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                    >
                      {copiedCode ? (
                        <>
                          <Check size={13} className="text-[#a6e795]" />
                          <span className="text-[#a6e795]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="rounded-xl border border-zinc-800 bg-[#07090c] p-4 font-mono text-xs text-zinc-200 whitespace-pre overflow-x-auto max-h-72 leading-relaxed shadow-inner">
                  {codeSnippet ? (
                    codeSnippet
                  ) : (
                    <span className="text-zinc-600 font-sans italic">
                      No code snippet saved for this problem yet.
                    </span>
                  )}
                </div>
              </div>

              {/* Key Learnings / Interview Tips if available */}
              {currentProblem.note?.keyLearning && (
                <div className="rounded-xl border border-zinc-850 bg-zinc-900/50 p-3.5 text-xs text-zinc-300 leading-relaxed">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                    Key Learning
                  </span>
                  {currentProblem.note.keyLearning}
                </div>
              )}
            </div>
          )}

          {/* Card Bottom Meta: Quest No & External Link */}
          <div className="mt-6 pt-3 border-t border-zinc-850/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>
              {currentProblem.questNo
                ? `#${currentProblem.questNo.replace(/^Q\.?/i, "")}`
                : `#${currentIndex + 1}`}
            </span>

            {currentProblem.url && (
              <a
                href={currentProblem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                title="Open external link"
              >
                <ArrowSquareOut size={16} />
              </a>
            )}
          </div>
        </div>

        {/* Next Button (Right - Desktop) */}
        <div className="hidden sm:flex flex-col items-center gap-1.5 shrink-0">
          <button
            onClick={handleNext}
            disabled={currentIndex === problems.length - 1}
            className="w-11 h-11 rounded-full border border-zinc-800 bg-[#0d1015] hover:bg-zinc-850 hover:border-zinc-700 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-all cursor-pointer shadow-lg"
            title="Next problem (→ or D)"
          >
            <CaretRight size={18} />
          </button>
          <span className="text-[11px] text-zinc-500 font-medium">Next</span>
          <span className="px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900/80 text-[10px] font-mono text-zinc-500">
            D
          </span>
        </div>
      </div>

      {/* Mobile Prev / Next Controls */}
      <div className="flex sm:hidden items-center justify-between gap-2.5 w-full max-w-2xl mx-auto my-2">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex-1 py-2 px-3 rounded-xl border border-zinc-800 bg-[#0d1015] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-1.5 text-xs text-zinc-300 font-medium cursor-pointer active:scale-95"
        >
          <CaretLeft size={15} />
          <span>Previous</span>
        </button>
        <span className="text-[11px] text-zinc-500 font-mono shrink-0 px-2">
          {currentIndex + 1} / {problems.length}
        </span>
        <button
          onClick={handleNext}
          disabled={currentIndex === problems.length - 1}
          className="flex-1 py-2 px-3 rounded-xl border border-zinc-800 bg-[#0d1015] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-1.5 text-xs text-zinc-300 font-medium cursor-pointer active:scale-95"
        >
          <span>Next</span>
          <CaretRight size={15} />
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════
            BOTTOM RATING ACTION BAR (Again, Hard, Good, Easy)
        ═══════════════════════════════════════════════════════════ */}
      <div className="w-full max-w-3xl mx-auto mt-2 sm:mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {/* Rating 1: Again */}
          <button
            onClick={() => submitReview(Feedback.AGAIN)}
            className="group relative flex items-center justify-between p-2.5 sm:p-4 rounded-xl border border-rose-900/50 hover:border-rose-500/80 bg-rose-950/15 hover:bg-rose-950/30 text-rose-400 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(244,63,94,0.15)] active:scale-95"
          >
            <div className="text-left">
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-bold text-zinc-100">
                <ArrowCounterClockwise size={13} className="text-rose-400 shrink-0" />
                <span>Again</span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-rose-400/90 font-mono mt-0.5">
                {calcNextInterval(Feedback.AGAIN)}
              </div>
            </div>
            <span className="px-1.5 sm:px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/60 text-[10px] sm:text-[11px] font-mono font-bold text-rose-300">
              1
            </span>
          </button>

          {/* Rating 2: Hard */}
          <button
            onClick={() => submitReview(Feedback.HARD)}
            className="group relative flex items-center justify-between p-2.5 sm:p-4 rounded-xl border border-amber-900/50 hover:border-amber-500/80 bg-amber-950/15 hover:bg-amber-950/30 text-amber-400 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(251,146,60,0.15)] active:scale-95"
          >
            <div className="text-left">
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-bold text-zinc-100">
                <Warning size={13} className="text-amber-400 shrink-0" />
                <span>Hard</span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-amber-400/90 font-mono mt-0.5">
                {calcNextInterval(Feedback.HARD)}
              </div>
            </div>
            <span className="px-1.5 sm:px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/60 text-[10px] sm:text-[11px] font-mono font-bold text-amber-300">
              2
            </span>
          </button>

          {/* Rating 3: Good (Medium) */}
          <button
            onClick={() => submitReview(Feedback.MEDIUM)}
            className="group relative flex items-center justify-between p-2.5 sm:p-4 rounded-xl border border-sky-900/50 hover:border-sky-500/80 bg-sky-950/15 hover:bg-sky-950/30 text-sky-400 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(56,189,248,0.15)] active:scale-95"
          >
            <div className="text-left">
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-bold text-zinc-100">
                <Check size={13} weight="bold" className="text-sky-400 shrink-0" />
                <span>Good</span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-sky-400/90 font-mono mt-0.5">
                {calcNextInterval(Feedback.MEDIUM)}
              </div>
            </div>
            <span className="px-1.5 sm:px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800/60 text-[10px] sm:text-[11px] font-mono font-bold text-sky-300">
              3
            </span>
          </button>

          {/* Rating 4: Easy */}
          <button
            onClick={() => submitReview(Feedback.EASY)}
            className="group relative flex items-center justify-between p-2.5 sm:p-4 rounded-xl border border-emerald-900/50 hover:border-emerald-500/80 bg-emerald-950/15 hover:bg-emerald-950/30 text-emerald-400 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(52,211,153,0.15)] active:scale-95"
          >
            <div className="text-left">
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-bold text-zinc-100">
                <TrendUp size={13} weight="bold" className="text-emerald-400 shrink-0" />
                <span>Easy</span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-emerald-400/90 font-mono mt-0.5">
                {calcNextInterval(Feedback.EASY)}
              </div>
            </div>
            <span className="px-1.5 sm:px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-[10px] sm:text-[11px] font-mono font-bold text-emerald-300">
              4
            </span>
          </button>
        </div>

        {/* Footer Shortcut Hints (Desktop only) */}
        <div className="mt-4 sm:mt-6 hidden sm:flex items-center justify-center text-xs text-zinc-500">
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-zinc-500 font-mono">
            <span>Use</span>
            <span className="px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 font-bold">
              1-4
            </span>
            <span>to rate</span>
            <span className="text-zinc-700 mx-1">•</span>
            <span className="px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 font-bold">
              Space
            </span>
            <span>to reveal solution</span>
            <span className="text-zinc-700 mx-1">•</span>
            <span className="px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 font-bold">
              ← / →
            </span>
            <span>to navigate</span>
          </div>
        </div>
      </div>
    </div>
  );
}

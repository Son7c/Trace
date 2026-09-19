"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowSquareOut,
  CalendarBlank,
  Clock,
  Warning,
  CheckCircle,
  CaretRight,
} from "@phosphor-icons/react";
import PlatformLogo from "./PlatformLogo";
import type { Problem, RevisionLog, Note } from "@/prisma/generated/client/client";

export type ProblemWithLogs = Problem & {
  revisionLogs?: RevisionLog[];
  note?: Note | null;
};

interface ProblemCardProps {
  problem: ProblemWithLogs;
  onEdit?: (problem: ProblemWithLogs) => void;
  onDelete?: (problem: ProblemWithLogs) => void;
}

// Format display text and styling for platform names
const PLATFORM_LABELS: Record<string, string> = {
  LEETCODE: "LeetCode",
  GFG: "GFG",
  CODEFORCES: "Codeforces",
  CODECHEF: "CodeChef",
  HACKERRANK: "HackerRank",
  OTHERS: "Other",
};

export default function ProblemCard({ problem, onEdit, onDelete }: ProblemCardProps) {
  const router = useRouter();

  // Difficulty badge styling matching the reference screenshot
  const difficultyBadgeConfig = {
    EASY: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    MEDIUM: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    HARD: "border-rose-500/30 bg-rose-500/10 text-rose-400",
  };

  const diffKey = (problem.difficulty || "MEDIUM").toUpperCase() as keyof typeof difficultyBadgeConfig;
  const diffClass = difficultyBadgeConfig[diffKey] || difficultyBadgeConfig.MEDIUM;

  // Spaced repetition status calculation (Overdue, Due today, Due in X days, Stable memory)
  const getRevisionStatus = () => {
    const nextDate = problem.nextRevisionDate ? new Date(problem.nextRevisionDate) : null;

    if (!nextDate) {
      return {
        type: "due_today",
        label: "Due today",
        icon: <Clock size={15} weight="bold" className="text-amber-400 shrink-0" />,
        textClass: "text-amber-400",
      };
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const targetDate = new Date(nextDate);
    targetDate.setUTCHours(0, 0, 0, 0);

    const diffMs = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    // 1. Overdue (< 0 days) -> Rose/Red
    if (diffDays < 0) {
      const overdueDays = Math.abs(diffDays);
      return {
        type: "overdue",
        label: `Overdue by ${overdueDays} day${overdueDays > 1 ? "s" : ""}`,
        icon: <Warning size={15} weight="bold" className="text-rose-400 shrink-0" />,
        textClass: "text-rose-400",
      };
    }

    // 2. Stable Memory (High retention & interval >= 21)
    if (problem.intervalDays >= 21 && (problem.easeFactor || 2.5) >= 2.4) {
      return {
        type: "stable",
        label: "Stable memory",
        icon: <CheckCircle size={15} weight="bold" className="text-[#a6e795] shrink-0" />,
        textClass: "text-[#a6e795]",
      };
    }

    // 3. Due today (0 days) -> Amber/Yellow
    if (diffDays === 0) {
      return {
        type: "due_today",
        label: "Due today",
        icon: <Clock size={15} weight="bold" className="text-amber-400 shrink-0" />,
        textClass: "text-amber-400",
      };
    }

    // 4. Due later (3+ days) -> Upcoming
    return {
      type: "upcoming",
      label: `Due in ${diffDays} days`,
      icon: <CalendarBlank size={15} weight="bold" className="text-zinc-400 shrink-0" />,
      textClass: "text-zinc-400",
    };
  };

  const status = getRevisionStatus();
  const revisions = problem.revisionCount || 0;
  const platformDisplay = PLATFORM_LABELS[problem.platform?.toUpperCase()] || problem.platform;

  return (
    <div
      onClick={() => router.push(`/problems/${problem.id}`)}
      className="group relative flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-[#101316] hover:bg-[#13171b] hover:border-zinc-700/80 transition-all duration-200 p-5 cursor-pointer shadow-sm hover:shadow-md select-none"
    >
      <div>
        {/* Top Header: #QuestNo, Platform Logo + Name, External Link */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            {problem.questNo && (
              <span className="text-xs font-mono font-medium text-zinc-400 shrink-0">
                #{problem.questNo.replace(/^Q\.?/i, "")}
              </span>
            )}
            <div className="flex items-center gap-1.5 min-w-0">
              <PlatformLogo platform={problem.platform} size={15} />
              <span className="text-xs font-medium text-zinc-300 truncate">
                {platformDisplay}
              </span>
            </div>
          </div>

          {problem.url && (
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors shrink-0"
              title="Open problem link"
            >
              <ArrowSquareOut size={16} />
            </a>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-semibold text-zinc-100 group-hover:text-white line-clamp-1 transition-colors">
          {problem.title}
        </h3>

        {/* Intuition / Note Subtitle if present */}
        {problem.note?.intuition ? (
          <p className="text-xs text-zinc-400 mt-1 line-clamp-1 leading-relaxed">
            {problem.note.intuition}
          </p>
        ) : null}

        {/* Difficulty Badge & Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <span
            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase ${diffClass}`}
          >
            {problem.difficulty}
          </span>

          {problem.tags &&
            problem.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900/90 px-2 py-0.5 text-[11px] text-zinc-400 font-mono"
              >
                {tag}
              </span>
            ))}

          {problem.tags && problem.tags.length > 3 && (
            <span className="text-[11px] text-zinc-400 font-mono">
              +{problem.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Footer: Spaced Repetition Status & Revisions Count */}
      <div className="mt-5 pt-3.5 border-t border-zinc-800/60 flex items-center justify-between text-xs">
        <div className={`flex items-center gap-1.5 font-medium ${status.textClass}`}>
          {status.icon}
          <span>{status.label}</span>
        </div>

        <div className="flex items-center gap-1 text-zinc-400 group-hover:text-zinc-300 transition-colors font-mono">
          <span>{revisions} revision{revisions === 1 ? "" : "s"}</span>
          <CaretRight size={14} className="text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}

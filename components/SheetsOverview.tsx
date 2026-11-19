"use client";

import Link from "next/link";
import { ALL_SHEETS, CuratedSheet } from "@/data/sheets";
import { ArrowRight, House } from "@phosphor-icons/react";

interface SheetProgressData {
  sheetId: string;
  problemId: string[];
}

interface SheetsOverviewProps {
  progressList: SheetProgressData[];
}

interface SheetCardData {
  sheet: CuratedSheet;
  creator: string;
  description: string;
  glowColor: string;
  totalCount: number;
  solvedCount: number;
  percentage: number;
  easyCount: number;
  medCount: number;
  hardCount: number;
  topicsCount: number;
  sampleTopics: string[];
}

interface SheetSectionGroup {
  id: string;
  title: string;
  description: string;
  sheetIds: string[];
}

// A2Z / Comprehensive Roadmaps placed ABOVE Interview Preparation
const SECTION_GROUPS: SheetSectionGroup[] = [
  {
    id: "comprehensive-roadmaps",
    title: "Comprehensive Roadmaps",
    description:
      "Complete end-to-end curriculums covering foundational concepts through advanced algorithmic mastery.",
    sheetIds: ["striver-a2z", "love-babbar-450"],
  },
  {
    id: "interview-prep",
    title: "Interview Preparation",
    description:
      "High-yield, pattern-focused problem sets optimized for technical interviews and coding rounds.",
    sheetIds: ["neetcode-150", "striver-sde"],
  },
];

const SHEET_METADATA: Record<
  string,
  {
    creator: string;
    description: string;
    glowColor: string;
  }
> = {
  "striver-a2z": {
    creator: "takeUforward",
    description:
      "419 problems spanning basic syntax, recursion, trees, graphs, dynamic programming, and advanced data structures.",
    glowColor: "rgba(168, 85, 247, 0.15)", // purple blur mix
  },
  "love-babbar-450": {
    creator: "Love Babbar",
    description:
      "450 core DSA problems curated across 15 standard computer science topics for placement preparation.",
    glowColor: "rgba(245, 158, 11, 0.14)", // warm amber blur mix
  },
  "neetcode-150": {
    creator: "NeetCode",
    description:
      "150 essential LeetCode problems categorized by pattern across 18 core topics. Curated for pattern recognition and technical interviews.",
    glowColor: "rgba(166, 231, 149, 0.15)", // signature green blur mix
  },
  "striver-sde": {
    creator: "takeUforward",
    description:
      "191 top interview questions curated by Raj Vikramaditya, specifically tailored for product-based company rounds.",
    glowColor: "rgba(56, 189, 248, 0.14)", // sky blue blur mix
  },
};

export default function SheetsOverview({ progressList }: SheetsOverviewProps) {
  // Map progress by sheetId
  const progressMap = new Map<string, string[]>();
  progressList.forEach((p) => {
    progressMap.set(p.sheetId, p.problemId || []);
  });

  // Calculate stats for each sheet
  const sheetsMap = new Map<string, SheetCardData>();

  ALL_SHEETS.forEach((sheet: CuratedSheet) => {
    const allProblems = sheet.sections.flatMap((s) => s.problems);
    const solvedSet = new Set(progressMap.get(sheet.sheetId) || []);
    const solvedCount = solvedSet.size;
    const totalCount = sheet.totalProblems;
    const percentage = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

    const easyCount = allProblems.filter((p) => p.difficulty === "EASY").length;
    const medCount = allProblems.filter((p) => p.difficulty === "MEDIUM").length;
    const hardCount = allProblems.filter((p) => p.difficulty === "HARD").length;

    const meta = SHEET_METADATA[sheet.sheetId] || {
      creator: "Curated",
      description: `Curated roadmap of ${sheet.totalProblems} problems across ${sheet.sections.length} topics.`,
      glowColor: "rgba(166, 231, 149, 0.12)",
    };

    const sampleTopics = sheet.sections.slice(0, 4).map((s) => s.topic);

    sheetsMap.set(sheet.sheetId, {
      sheet,
      creator: meta.creator,
      description: meta.description,
      glowColor: meta.glowColor,
      totalCount,
      solvedCount,
      percentage,
      easyCount,
      medCount,
      hardCount,
      topicsCount: sheet.sections.length,
      sampleTopics,
    });
  });

  return (
    <div className="min-h-screen bg-[#07080C] text-zinc-100 font-sans selection:bg-[#a6e795]/20 selection:text-[#a6e795] pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* ══════════════════════════════════════════════════════════════
            1. TOP NAVIGATION / BREADCRUMB
            ══════════════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between text-xs text-zinc-400 pb-2">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <House size={14} />
              <span>Dashboard</span>
            </Link>
            <span>/</span>
            <span className="text-[#a6e795] font-medium">Sheets</span>
          </div>

          <div className="font-mono text-zinc-500 text-xs">
            {ALL_SHEETS.length} Roadmaps
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            2. SECTION GROUPS
            ══════════════════════════════════════════════════════════════ */}
        <div className="space-y-12">
          {SECTION_GROUPS.map((group) => {
            const groupCards = group.sheetIds
              .map((id) => sheetsMap.get(id))
              .filter((card): card is SheetCardData => Boolean(card));

            return (
              <section key={group.id} className="space-y-5">
                {/* Section Header */}
                <div className="flex items-baseline justify-between border-b border-zinc-800/80 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      {group.title}
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {group.description}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-zinc-500 shrink-0 ml-4">
                    {groupCards.length} roadmaps
                  </span>
                </div>

                {/* Section Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {groupCards.map((card) => {
                    const isCompleted =
                      card.totalCount > 0 && card.solvedCount === card.totalCount;
                    const hasStarted = card.solvedCount > 0;

                    return (
                      <Link
                        key={card.sheet.sheetId}
                        href={`/sheets/${card.sheet.sheetId}`}
                        className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-[#0F0F12] p-5 sm:p-6 hover:border-zinc-700 hover:bg-[#131317] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
                      >
                        {/* Single-color ambient gradient blur in corner mixing into #0F0F12 */}
                        <div
                          className="absolute -top-16 -right-16 w-52 h-52 rounded-full blur-3xl pointer-events-none opacity-50 group-hover:opacity-90 transition-all duration-500 group-hover:scale-110"
                          style={{ background: card.glowColor }}
                        />

                        {/* Subtle hairline gradient top edge */}
                        <div
                          className="absolute inset-x-0 top-0 h-px pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${card.glowColor}, transparent)`,
                          }}
                        />

                        {/* Big Number of Questions */}
                        <div className="absolute top-3 right-5 text-6xl sm:text-7xl font-black font-mono tracking-tighter text-white/[0.14] group-hover:text-white/[0.25] transition-all duration-300 select-none pointer-events-none">
                          {card.totalCount}
                        </div>

                        <div className="space-y-4 relative z-10">
                          {/* Top Meta: Creator Pill + Status grouped on left, leaving top-right clear */}
                          <div className="flex items-center gap-2 pr-24">
                            <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
                              {card.creator}
                            </span>

                            {/* Status indicator */}
                            <div className="flex items-center gap-1.5 text-xs font-mono">
                              {isCompleted ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#a6e795]/10 text-[#a6e795] border border-[#a6e795]/20 text-[11px] font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#a6e795]" />
                                  Completed
                                </span>
                              ) : hasStarted ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-300 border border-white/[0.08] text-[11px] font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#a6e795]" />
                                  {card.percentage}% Done
                                </span>
                              ) : (
                                <span className="text-zinc-500 text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/[0.02] border border-white/[0.06]">
                                  Not started
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Title & Description */}
                          <div className="pr-12">
                            <h3 className="text-lg font-bold text-white group-hover:text-[#a6e795] transition-colors tracking-tight">
                              {card.sheet.title}
                            </h3>
                            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed line-clamp-2">
                              {card.description}
                            </p>
                          </div>

                          {/* Monochrome Breakdown */}
                          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-zinc-400 pt-1">
                            <span className="px-2 py-0.5 rounded bg-white/[0.03] text-zinc-300 border border-white/[0.08]">
                              {card.totalCount} problems
                            </span>
                            <span className="px-2 py-0.5 rounded bg-white/[0.03] text-zinc-300 border border-white/[0.08]">
                              {card.topicsCount} topics
                            </span>
                            <span className="h-3 w-px bg-zinc-800 mx-1 hidden sm:inline" />
                            <span className="text-zinc-400 text-[11px]">
                              {card.easyCount} Easy
                            </span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-400 text-[11px]">
                              {card.medCount} Med
                            </span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-400 text-[11px]">
                              {card.hardCount} Hard
                            </span>
                          </div>

                          {/* Sample Topics Tags */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            {card.sampleTopics.map((topic) => (
                              <span
                                key={topic}
                                className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.02] text-zinc-400 border border-white/[0.06]"
                              >
                                {topic}
                              </span>
                            ))}
                            {card.topicsCount > 4 && (
                              <span className="text-[10px] font-mono text-zinc-500 px-1">
                                +{card.topicsCount - 4} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bottom: Progress Bar & Open CTA */}
                        <div className="mt-6 pt-4 border-t border-zinc-800/80 space-y-3 relative z-10">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-zinc-400">
                              Solved: <strong className="text-white">{card.solvedCount}</strong> /{" "}
                              {card.totalCount}
                            </span>
                            <span className="text-zinc-300 font-semibold">
                              {card.percentage}%
                            </span>
                          </div>

                          <div className="w-full bg-[#18181C] rounded-full h-1.5 overflow-hidden border border-zinc-800/80">
                            <div
                              className="bg-[#a6e795] h-full rounded-full transition-all duration-300"
                              style={{ width: `${card.percentage}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">
                              {isCompleted
                                ? "Review completed sheet"
                                : hasStarted
                                ? "Continue roadmap"
                                : "Start practicing"}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#a6e795] group-hover:underline">
                              <span>Open Sheet</span>
                              <ArrowRight
                                size={13}
                                className="group-hover:translate-x-1 transition-transform"
                              />
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

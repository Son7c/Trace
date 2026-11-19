"use client";

import { ALL_SHEETS, CuratedSheet } from "@/data/sheets";
import { useState, useMemo } from "react";
import SheetProblem from "./SheetProblem";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

const SHEET_THEME: Record<
  string,
  {
    glowColor: string;
    accentColor: string;
  }
> = {
  "striver-a2z": {
    glowColor: "rgba(168, 85, 247, 0.15)", // purple blur mix
    accentColor: "#c084fc",
  },
  "love-babbar-450": {
    glowColor: "rgba(245, 158, 11, 0.14)", // amber blur mix
    accentColor: "#fbbf24",
  },
  "neetcode-150": {
    glowColor: "rgba(166, 231, 149, 0.15)", // signature green blur mix
    accentColor: "#a6e795",
  },
  "striver-sde": {
    glowColor: "rgba(56, 189, 248, 0.14)", // sky blue blur mix
    accentColor: "#38bdf8",
  },
};

export default function Sheet({
  sheet,
  problems,
}: {
  sheet: CuratedSheet | undefined;
  problems: string[];
}) {
  const [checkedProbs, setCheckedProbs] = useState<string[]>(problems);

  const handleCheck = async (id: string) => {
    setCheckedProbs((prev) => {
      if (prev.includes(id)) {
        return prev.filter((p) => p !== id);
      }
      return [...prev, id];
    });

    try {
      const res = await fetch(`/api/sheets/${sheet?.sheetId}`, {
        method: "PATCH",
        body: JSON.stringify({
          problemId: id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        setCheckedProbs((prev) =>
          prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
      }
    } catch (error) {
      console.log(error);
      setCheckedProbs((prev) =>
        prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
      );
    }
  };

  // ══════════════════════════════════════════════════════════════════
  // OVERALL PROGRESS METRICS & STATS
  // ══════════════════════════════════════════════════════════════════
  const stats = useMemo(() => {
    const all = sheet?.sections.flatMap((s) => s.problems) ?? [];
    const total = all.length;
    const solved = all.filter((p) => checkedProbs.includes(p.id)).length;
    const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

    const easyAll = all.filter((p) => p.difficulty === "EASY");
    const easySolved = easyAll.filter((p) => checkedProbs.includes(p.id)).length;

    const medAll = all.filter((p) => p.difficulty === "MEDIUM");
    const medSolved = medAll.filter((p) => checkedProbs.includes(p.id)).length;

    const hardAll = all.filter((p) => p.difficulty === "HARD");
    const hardSolved = hardAll.filter((p) => checkedProbs.includes(p.id)).length;

    return {
      total,
      solved,
      percentage,
      easyAll: easyAll.length,
      easySolved,
      medAll: medAll.length,
      medSolved,
      hardAll: hardAll.length,
      hardSolved,
    };
  }, [sheet, checkedProbs]);

  const theme = (sheet && SHEET_THEME[sheet.sheetId]) || {
    glowColor: "rgba(166, 231, 149, 0.15)",
    accentColor: "#a6e795",
  };

  if (!sheet) {
    return (
      <div className="min-h-screen bg-[#07080C] text-zinc-100 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Sheet Not Found</h1>
          <Link
            href="/sheets/neetcode-150"
            className="text-sm text-[#a6e795] hover:underline"
          >
            Go to NeetCode 150
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080C] text-zinc-100 pb-32">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-6">
        {/* ══════════════════════════════════════════════════════════════
            1. SHEET SWITCHER TABS
            ══════════════════════════════════════════════════════════════ */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-zinc-800/80">
          {ALL_SHEETS.map((s) => {
            const isActive = s.sheetId === sheet.sheetId;
            // Clean concise title for tab so it fits perfectly on all screens
            const tabTitle = s.title
              .replace(" DSA Sheet", "")
              .replace(" DSA Course", "")
              .replace(" Sheet", "");

            return (
              <Link
                key={s.sheetId}
                href={`/sheets/${s.sheetId}`}
                className="relative shrink-0 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSheetTab"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-[#18181C] border shadow-sm -z-0"
                    style={{ borderColor: `${theme.accentColor}4D` }}
                  />
                )}
                <span className="relative z-10 text-zinc-300">
                  <span style={{ color: isActive ? theme.accentColor : undefined }}>
                    {tabTitle}
                  </span>
                  <span className="ml-1.5 text-[10px] opacity-60 text-zinc-400">
                    ({s.totalProblems})
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            ANIMATED SHEET CONTENT TRANSITION
            ══════════════════════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={sheet.sheetId}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* ══════════════════════════════════════════════════════════════
                2. HERO & OVERALL PROGRESS CARD
                ══════════════════════════════════════════════════════════════ */}
            <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#0F0F12] p-5 sm:p-6 shadow-xl space-y-5">
              {/* Ambient corner gradient blur */}
              <div
                className="absolute -top-16 -right-16 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-50"
                style={{ background: theme.glowColor }}
              />

              {/* Subtle hairline gradient top edge */}
              <div
                className="absolute inset-x-0 top-0 h-px pointer-events-none opacity-40"
                style={{
                  background: `linear-gradient(90deg, transparent, ${theme.glowColor}, transparent)`,
                }}
              />

              {/* Big Number of Questions */}
              <div className="absolute top-2 right-4 text-7xl sm:text-8xl font-black font-mono tracking-tighter text-white/[0.12] select-none pointer-events-none">
                {sheet.totalProblems}
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                    <Link
                      href="/sheets"
                      className="hover:text-white transition-colors"
                    >
                      Sheets
                    </Link>
                    <span>/</span>
                    <span style={{ color: theme.accentColor }}>{sheet.title}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    {sheet.title}
                  </h1>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                    Curated roadmap of {sheet.totalProblems} problems across{" "}
                    {sheet.sections.length} core topics.
                  </p>
                </div>

                {/* Big Counter with frosted glass */}
                <div className="flex items-baseline gap-2 bg-white/[0.04] backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/[0.08] self-start sm:self-auto shadow-lg">
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                    {stats.solved}
                  </span>
                  <span className="text-sm font-mono text-zinc-500">
                    / {stats.total}
                  </span>
                  <span
                    className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${theme.accentColor}1A`,
                      color: theme.accentColor,
                      border: `1px solid ${theme.accentColor}33`,
                    }}
                  >
                    {stats.percentage}%
                  </span>
                </div>
              </div>

              {/* Overall Progress Bar */}
              <div className="relative z-10 space-y-1.5">
                <div className="w-full h-2 rounded-full bg-zinc-800/80 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-[#a6e795] transition-all duration-500 rounded-full"
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>
              </div>

              {/* Difficulty Breakdown (Easy / Medium / Hard Mini Bars) */}
              <div className="relative z-10 grid grid-cols-3 gap-3 pt-1">
                {/* Easy */}
                <div className="bg-[#18181C]/80 border border-zinc-800/60 rounded-xl p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] sm:text-xs">
                    <span className="text-emerald-400 font-semibold">Easy</span>
                    <span className="font-mono text-zinc-400 text-[10px] sm:text-[11px]">
                      {stats.easySolved} / {stats.easyAll}
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 transition-all duration-300"
                      style={{
                        width: `${
                          stats.easyAll > 0
                            ? (stats.easySolved / stats.easyAll) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Medium */}
                <div className="bg-[#18181C]/80 border border-zinc-800/60 rounded-xl p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] sm:text-xs">
                    <span className="text-amber-400 font-semibold">Medium</span>
                    <span className="font-mono text-zinc-400 text-[10px] sm:text-[11px]">
                      {stats.medSolved} / {stats.medAll}
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all duration-300"
                      style={{
                        width: `${
                          stats.medAll > 0
                            ? (stats.medSolved / stats.medAll) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Hard */}
                <div className="bg-[#18181C]/80 border border-zinc-800/60 rounded-xl p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] sm:text-xs">
                    <span className="text-rose-400 font-semibold">Hard</span>
                    <span className="font-mono text-zinc-400 text-[10px] sm:text-[11px]">
                      {stats.hardSolved} / {stats.hardAll}
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-rose-400 transition-all duration-300"
                      style={{
                        width: `${
                          stats.hardAll > 0
                            ? (stats.hardSolved / stats.hardAll) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                3. TOPICS LIST (Accordions)
                ══════════════════════════════════════════════════════════════ */}
            <div className="space-y-2">
              {sheet.sections.map((section) => (
                <SheetProblem
                  key={section.topic}
                  section={section}
                  checkedProbs={checkedProbs}
                  handleCheck={handleCheck}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

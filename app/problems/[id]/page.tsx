"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { Problem, Note as PrismaNote, RevisionLog, Feedback } from "@/prisma/generated/client/client";

import RevisionStats from "@/components/reviews/RevisionStats";
import RevisionHistory from "@/components/reviews/RevisionHistory";
import PlatformLogo from "@/components/problems/PlatformLogo";
import CodeEditor from "@/components/problems/CodeEditor";
import EditProblemModal from "@/components/problems/EditProblemModal";
import { calculateSM2 } from "@/lib/sm2";

import {
  ArrowLeft,
  Play,
  CheckCircle,
  CalendarBlank,
  ChatText,
  Hash,
  ClockCounterClockwise,
  ArrowSquareOut,
  DotsThreeVertical,
  Lightbulb,
  Clock,
  GraduationCap,
  Warning,
  ChatCircleDots,
  Check,
  X,
  Code,
  CalendarCheck,
  PencilSimple,
  Trash,
  CaretDown,
  FloppyDisk,
  CircleNotch,
} from "@phosphor-icons/react";

const PLATFORM_NAMES: Record<string, string> = {
  LEETCODE: "LeetCode",
  CODEFORCES: "Codeforces",
  GFG: "GFG",
  CODECHEF: "CodeChef",
  HACKERRANK: "HackerRank",
  ATCODER: "AtCoder",
  OTHERS: "Other",
};

export type ProblemWithDetails = Problem & {
  note?: PrismaNote | null;
  revisionLogs?: RevisionLog[];
};

const COMPLEXITY_OPTIONS = [
  "O(1)",
  "O(log N)",
  "O(N)",
  "O(N log N)",
  "O(N²)",
  "O(N³)",
  "O(2^N)",
  "O(N!)",
  "O(V + E)",
  "O(N × W)",
  "O(√N)",
];

export default function ProblemPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [problem, setProblem] = useState<ProblemWithDetails | null>(null);
  const [lang, setLang] = useState<string>("cpp");
  const [approach, setApproach] = useState<"brute" | "optimal">("optimal");
  const [activeTab, setActiveTab] = useState<"code" | "revisions">("code");
  const [highlightReviewBar, setHighlightReviewBar] = useState(false);
  const [reviewNotification, setReviewNotification] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Unified notes states for all 5 canvas cards
  const [intuition, setIntuition] = useState("");
  const [timeComplexity, setTimeComplexity] = useState("O(N)");
  const [spaceComplexity, setSpaceComplexity] = useState("O(1)");
  const [keyLearning, setKeyLearning] = useState("");
  const [mistakes, setMistakes] = useState("");
  const [interviewExplanation, setInterviewExplanation] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedStatus, setNotesSavedStatus] = useState<"idle" | "saved" | "error">("idle");

  const reviewBarRef = useRef<HTMLDivElement>(null);
  const optionsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProblem = async () => {
      try {
        const res = await fetch(`/api/problems/${id}`);
        if (!res.ok) {
          router.push("/problems");
          return;
        }
        const data = await res.json();
        setProblem(data);
        if (data.note?.language) {
          setLang(data.note.language);
        } else {
          setLang("cpp");
        }
        if (data.note) {
          setIntuition(data.note.intuition || "");
          setTimeComplexity(data.note.timeComplexity || "O(N)");
          setSpaceComplexity(data.note.spaceComplexity || "O(1)");
          setKeyLearning(data.note.keyLearning || "");
          setMistakes(data.note.mistakes || "");
          setInterviewExplanation(data.note.interviewExplanation || "");
        }
      } catch (err) {
        console.error("Failed to load problem:", err);
      }
    };

    fetchProblem();
  }, [id, router]);

  useEffect(() => {
    if (problem?.note?.language) {
      setLang(problem.note.language);
    }
    if (problem?.note) {
      setIntuition((prev) => (prev === "" ? problem.note?.intuition || "" : prev));
      setTimeComplexity((prev) => (prev === "O(N)" && problem.note?.timeComplexity ? problem.note.timeComplexity : prev));
      setSpaceComplexity((prev) => (prev === "O(1)" && problem.note?.spaceComplexity ? problem.note.spaceComplexity : prev));
      setKeyLearning((prev) => (prev === "" ? problem.note?.keyLearning || "" : prev));
      setMistakes((prev) => (prev === "" ? problem.note?.mistakes || "" : prev));
      setInterviewExplanation((prev) => (prev === "" ? problem.note?.interviewExplanation || "" : prev));
    }
  }, [problem?.note]);

  const hasNotesChanges =
    intuition !== (problem?.note?.intuition || "") ||
    timeComplexity !== (problem?.note?.timeComplexity || "O(N)") ||
    spaceComplexity !== (problem?.note?.spaceComplexity || "O(1)") ||
    keyLearning !== (problem?.note?.keyLearning || "") ||
    mistakes !== (problem?.note?.mistakes || "") ||
    interviewExplanation !== (problem?.note?.interviewExplanation || "");

  const handleSaveAllNotes = async () => {
    if (!problem || isSavingNotes || !hasNotesChanges) return;
    setIsSavingNotes(true);
    setNotesSavedStatus("idle");
    try {
      await handleSaveNoteField({
        intuition,
        timeComplexity,
        spaceComplexity,
        keyLearning,
        mistakes,
        interviewExplanation,
      });
      setNotesSavedStatus("saved");
      setTimeout(() => setNotesSavedStatus("idle"), 2500);
    } catch (err) {
      console.error("Failed to save notes:", err);
      setNotesSavedStatus("error");
      setTimeout(() => setNotesSavedStatus("idle"), 2500);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Click outside to close options menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(e.target as Node)) {
        setIsOptionsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSaveNoteField = async (fields: Partial<PrismaNote>) => {
    if (!problem) return;
    const method = problem.note ? "PATCH" : "POST";
    try {
      const res = await fetch(`/api/problems/${id}/note`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      if (!res.ok && res.status === 409) {
        // If note exists now, fallback to PATCH
        await fetch(`/api/problems/${id}/note`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fields),
        });
      }

      if (res.ok) {
        const updated = await res.json();
        setProblem((prev) =>
          prev
            ? {
              ...prev,
              note: {
                ...(prev.note || ({} as any)),
                ...updated,
              },
            }
            : prev
        );
      }
    } catch (err) {
      console.error("Failed to save note canvas:", err);
    }
  };

  const handleDeleteProblem = async () => {
    if (!confirm("Are you sure you want to delete this problem and all its logs?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/problems/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/problems");
      }
    } catch (err) {
      console.error("Failed to delete problem:", err);
      setIsDeleting(false);
    }
  };

  const handleLogFeedback = async (feedback: "AGAIN" | "HARD" | "MEDIUM" | "EASY") => {
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/problems/${id}/revision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userFeedback: feedback }),
      });
      if (res.ok) {
        const updated = await res.json();
        const intervalDays = updated.intervalDays ?? 1;
        const intervalLabel = intervalDays <= 1 ? `${intervalDays} day` : `${intervalDays} days`;
        const capitalized = feedback.charAt(0) + feedback.slice(1).toLowerCase();
        setReviewNotification(
          `Recall logged as "${capitalized}"! Next repetition scheduled in ${intervalLabel}.`
        );
        setTimeout(() => setReviewNotification(null), 4500);

        setProblem((prev) =>
          prev
            ? {
              ...prev,
              ...updated,
              revisionLogs: [
                {
                  id: "temp-" + Date.now(),
                  problemId: id,
                  reviewedAt: new Date(),
                  userFeedback: feedback as any,
                },
                ...(prev.revisionLogs || []),
              ],
            }
            : prev
        );
      }
    } catch (err) {
      console.error("Failed to log review:", err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!problem) {
    return null;
  }

  const currentCode =
    approach === "brute"
      ? problem.note?.bruteForceApproach || "// No brute force code yet"
      : problem.note?.optimizedApproach || "// No optimized code yet";


  // next dates SM2
  const calcNextInterval = (problem: Problem | null, feedback: Feedback) => {
    if (!problem) return "Error";
    const { intervalDays } = calculateSM2(problem, feedback);
    return intervalDays <= 1 ? `${intervalDays} day` : `${intervalDays} days`;
  }

  return (
    <main className="px-3.5 sm:px-8 md:px-12 lg:px-20 xl:px-24 py-4 lg:py-6 max-w-[1560px] mx-auto min-h-screen pb-32">
      {/* Top Navigation Row */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <div>
          <Link
            href="/problems"
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Problems</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Edit Problem Button */}
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-zinc-800/80 bg-zinc-900/70 hover:bg-zinc-800/80 text-xs font-semibold text-zinc-300 hover:text-white transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <PencilSimple size={14} />
            <span>Edit Problem</span>
          </button>

          {/* Start Review Button */}
          <button
            type="button"
            onClick={() => {
              setHighlightReviewBar(true);
              reviewBarRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
              setTimeout(() => setHighlightReviewBar(false), 2200);
            }}
            className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold rounded-xl px-3.5 sm:px-4 py-1.5 sm:py-2 transition-all shadow-[0_0_15px_rgba(166,231,149,0.25)] bg-[#a6e795] hover:bg-[#93d382] text-black cursor-pointer active:scale-95"
            title="Jump to recall feedback ratings"
          >
            <Play size={14} weight="bold" />
            <span>Start Review</span>
          </button>

          {/* Options Menu Button */}
          <div className="relative" ref={optionsMenuRef}>
            <button
              type="button"
              onClick={() => setIsOptionsMenuOpen((prev) => !prev)}
              className="p-1.5 sm:p-2 rounded-xl border border-zinc-800/80 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors cursor-pointer"
              title="Options"
            >
              <DotsThreeVertical size={16} weight="bold" />
            </button>

            {isOptionsMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-zinc-800 bg-[#0C0E15] p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-100 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsOptionsMenuOpen(false);
                    setIsEditModalOpen(true);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-300 hover:bg-zinc-800/70 hover:text-white transition-colors"
                >
                  <PencilSimple size={14} />
                  <span>Edit Metadata</span>
                </button>

                {problem.url && (
                  <a
                    href={problem.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-300 hover:bg-zinc-800/70 hover:text-white transition-colors"
                    onClick={() => setIsOptionsMenuOpen(false)}
                  >
                    <ArrowSquareOut size={14} />
                    <span>Open in {PLATFORM_NAMES[problem.platform] || "Platform"}</span>
                  </a>
                )}

                <div className="border-t border-zinc-800/80 my-1" />

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => {
                    setIsOptionsMenuOpen(false);
                    handleDeleteProblem();
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                >
                  <Trash size={14} />
                  <span>{isDeleting ? "Deleting..." : "Delete Problem"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout: Left ~67% (col-span-8), Right ~33% (col-span-4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Problem Header + Tabs + Code/Logs */}
        <div className="lg:col-span-8 space-y-6 min-w-0">
          {/* Problem Header Card */}
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              {/* Left: Checkmark, Title, Badges, Link */}
              <div className="space-y-3.5 flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <CheckCircle size={24} className="text-[#a6e795] shrink-0" weight="bold" />
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                    {problem.questNo ? `${problem.questNo}. ` : ""}
                    {problem.title}
                  </h1>
                </div>

                {/* Badges Row */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Platform Badge */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-900/90 border border-zinc-800 text-zinc-200">
                    <PlatformLogo platform={problem.platform} size={14} />
                    <span>{PLATFORM_NAMES[problem.platform] || problem.platform}</span>
                  </span>

                  {/* Difficulty Badge */}
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${problem.difficulty === "EASY"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : problem.difficulty === "MEDIUM"
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      }`}
                  >
                    {problem.difficulty.charAt(0) + problem.difficulty.slice(1).toLowerCase()}
                  </span>

                  {/* Tags */}
                  {problem.tags &&
                    problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-900/80 border border-zinc-800/80 text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                </div>

                {/* External Problem URL */}
                {problem.url && (
                  <div className="pt-0.5">
                    <a
                      href={problem.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#a6e795]/90 hover:text-[#a6e795] hover:underline transition-all font-medium break-all"
                    >
                      <span>{problem.url}</span>
                      <ArrowSquareOut size={14} className="shrink-0" />
                    </a>
                  </div>
                )}
              </div>

              {/* Right: Meta Details Grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs shrink-0 border-t lg:border-t-0 lg:border-l border-zinc-800/80 pt-4 lg:pt-0 lg:pl-6">
                <div className="flex items-center gap-2 text-zinc-400">
                  <CalendarBlank size={15} className="text-zinc-500 shrink-0" />
                  <span>Added on</span>
                </div>
                <div className="text-zinc-200 font-medium text-right lg:text-left">
                  {new Date(problem.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>

                <div className="flex items-center gap-2 text-zinc-400">
                  <ChatText size={15} className="text-zinc-500 shrink-0" />
                  <span>Platform</span>
                </div>
                <div className="text-zinc-200 font-medium text-right lg:text-left">
                  {PLATFORM_NAMES[problem.platform] || problem.platform}
                </div>

                <div className="flex items-center gap-2 text-zinc-400">
                  <Hash size={15} className="text-zinc-500 shrink-0" />
                  <span>Problem ID</span>
                </div>
                <div className="text-zinc-200 font-medium text-right lg:text-left">
                  {problem.questNo || "-"}
                </div>

                <div className="flex items-center gap-2 text-zinc-400">
                  <ClockCounterClockwise size={15} className="text-zinc-500 shrink-0" />
                  <span>Total Revisions</span>
                </div>
                <div className="text-zinc-200 font-medium text-right lg:text-left">
                  {problem.revisionCount || 0}
                </div>

                <div className="flex items-center gap-2 text-zinc-400">
                  <CalendarCheck size={15} className="text-zinc-500 shrink-0" />
                  <span>Next Review</span>
                </div>
                <div className="text-zinc-200 font-medium text-right lg:text-left">
                  {problem.nextRevisionDate ? (
                    <span
                      className={
                        new Date(problem.nextRevisionDate) <= new Date()
                          ? "text-[#A6E795] font-semibold"
                          : ""
                      }
                    >
                      {new Date(problem.nextRevisionDate) <= new Date()
                        ? "Due Today"
                        : new Date(problem.nextRevisionDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                    </span>
                  ) : (
                    <span className="text-zinc-500">Not scheduled</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Controls Bar: Segmented Tabs (Left) + Quick Recall Bar (Right) */}
          <div
            ref={reviewBarRef}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-0.5"
          >
            {/* Segmented Pill Tabs: Code, Revision & Logs */}
            <div className="inline-flex items-center p-1 rounded-xl bg-zinc-900/90 border border-zinc-800/80 shadow-inner backdrop-blur-md self-start">
              <button
                type="button"
                onClick={() => setActiveTab("code")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === "code"
                  ? "bg-zinc-800 text-[#A6E795] border border-zinc-700/60 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
                  }`}
              >
                <Code size={14} weight="bold" />
                <span>Code</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("revisions")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === "revisions"
                  ? "bg-zinc-800 text-[#A6E795] border border-zinc-700/60 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
                  }`}
              >
                <ClockCounterClockwise size={14} weight="bold" />
                <span>Revision & Logs</span>
                {problem.revisionLogs && problem.revisionLogs.length > 0 && (
                  <span className="rounded-full bg-zinc-800 border border-zinc-700/50 px-1.5 py-0.2 text-[10px] text-zinc-300 font-mono">
                    {problem.revisionLogs.length}
                  </span>
                )}
              </button>
            </div>

            {/* Quick Recall Rating Bar */}
            <div
              ref={reviewBarRef}
              className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 p-1.5 sm:p-1 rounded-xl bg-zinc-900/90 border border-zinc-800/80 shadow-inner backdrop-blur-md transition-all duration-300 w-full sm:w-auto self-start lg:self-auto ${highlightReviewBar
                ? "ring-2 ring-[#A6E795] shadow-[0_0_20px_rgba(166,231,149,0.35)] scale-[1.01]"
                : ""
                }`}
            >
              <div className="flex items-center gap-1.5 pl-2 pr-1 text-[11px] font-semibold text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A6E795] animate-pulse" />
                <span>Recall rating:</span>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 sm:gap-1 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={isSubmittingReview}
                  onClick={() => handleLogFeedback("AGAIN")}
                  className="group flex items-center justify-between sm:justify-start gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/60 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                  title="Repeat recall in < 1 minute"
                >
                  <span>Again</span>
                  <span className="text-[10px] font-mono opacity-70 group-hover:opacity-100">{calcNextInterval(problem, "AGAIN")}</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmittingReview}
                  onClick={() => handleLogFeedback("HARD")}
                  className="group flex items-center justify-between sm:justify-start gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/60 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                  title="Hard recall - review again in 1 day"
                >
                  <span>Hard</span>
                  <span className="text-[10px] font-mono opacity-70 group-hover:opacity-100">{calcNextInterval(problem, "HARD")}</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmittingReview}
                  onClick={() => handleLogFeedback("MEDIUM")}
                  className="group flex items-center justify-between sm:justify-start gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 hover:border-sky-500/60 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                  title="Good recall - review again in 3 days"
                >
                  <span>Medium</span>
                  <span className="text-[10px] font-mono opacity-70 group-hover:opacity-100">{calcNextInterval(problem, "MEDIUM")}</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmittingReview}
                  onClick={() => handleLogFeedback("EASY")}
                  className="group flex items-center justify-between sm:justify-start gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#A6E795]/40 bg-[#A6E795]/15 text-[#A6E795] hover:bg-[#A6E795]/25 hover:border-[#A6E795]/70 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                  title="Effortless recall - review again in 7 days"
                >
                  <span>Easy</span>
                  <span className="text-[10px] font-mono opacity-70 group-hover:opacity-100">{calcNextInterval(problem, "EASY")}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Inline Feedback Toast Confirmation */}
          {reviewNotification && (
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-[#A6E795]/40 bg-[#A6E795]/10 text-xs text-[#A6E795] shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} weight="bold" className="text-[#A6E795] shrink-0" />
                <span className="font-semibold">{reviewNotification}</span>
              </div>
              <button
                type="button"
                onClick={() => setReviewNotification(null)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer"
                title="Dismiss"
              >
                <X size={13} />
              </button>
            </div>
          )}

          {/* Tab Content 2: Code Tab */}
          {activeTab === "code" && (
            <div className="space-y-4">
              {/* Monaco Code Editor */}
              <CodeEditor
                approach={approach}
                setApproach={setApproach}
                code={currentCode}
                problemId={id}
                language={lang}
                setLanguage={setLang}
                hasNote={!!problem.note}
                onSaved={(savedApproach, savedCode) => {
                  setProblem((prev) => {
                    if (!prev) return prev;
                    const existingNote = prev.note || ({} as any);
                    return {
                      ...prev,
                      note: {
                        ...existingNote,
                        [savedApproach === "brute"
                          ? "bruteForceApproach"
                          : "optimizedApproach"]: savedCode,
                      },
                    };
                  });
                }}
              />
            </div>
          )}

          {/* Tab Content 3: Revision & Logs Tab */}
          {activeTab === "revisions" && (
            <div className="space-y-6">
              {/* Revision Stats Card */}
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-xl space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Spaced Repetition Stats
                </h2>
                <RevisionStats problem={problem as any} />
              </div>

              {/* Quick Feedback Logger in Tab */}
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-xl space-y-3.5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                    Log a New Revision
                  </span>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Select your recall strength to update next repetition interval via SM-2.
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(
                    [
                      {
                        key: "AGAIN",
                        label: "Again",
                        interval: calcNextInterval(problem, "AGAIN"),
                        desc: "Reset interval",
                        color:
                          "border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/60",
                      },
                      {
                        key: "HARD",
                        label: "Hard",
                        interval: calcNextInterval(problem, "HARD"),
                        desc: "Small interval",
                        color:
                          "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/60",
                      },
                      {
                        key: "MEDIUM",
                        label: "Medium",
                        interval: calcNextInterval(problem, "MEDIUM"),
                        desc: "Normal interval",
                        color:
                          "border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 hover:border-sky-500/60",
                      },
                      {
                        key: "EASY",
                        label: "Easy",
                        interval: calcNextInterval(problem, "EASY"),
                        desc: "Long interval",
                        color:
                          "border-[#A6E795]/40 bg-[#A6E795]/15 text-[#A6E795] hover:bg-[#A6E795]/25 hover:border-[#A6E795]/70",
                      },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      disabled={isSubmittingReview}
                      onClick={() => handleLogFeedback(item.key)}
                      className={`flex flex-col items-center justify-center rounded-xl border p-3 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 active:scale-95 ${item.color}`}
                    >
                      <span className="font-bold uppercase tracking-wider">{item.label}</span>
                      <span className="text-[11px] font-mono mt-0.5">{item.interval}</span>
                      <span className="text-[10px] opacity-60 font-normal mt-0.5">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Revision History Logs */}
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Revision History
                  </h2>
                  <span className="text-xs text-zinc-500">
                    {problem.revisionLogs?.length || 0} revisions logged
                  </span>
                </div>

                {problem.revisionLogs && problem.revisionLogs.length > 0 ? (
                  <div className="space-y-2">
                    {problem.revisionLogs.map((revision) => (
                      <RevisionHistory key={revision.id} revision={revision} />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic py-4 text-center">
                    No revisions logged yet. Review this problem above to build retention!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar Column: Header with Single Save Button + 5 Canvas Cards */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* Header Row: Title & Single Unified Save Button for Notes */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Notes & Analysis
              </span>
              {hasNotesChanges && (
                <span className="h-1.5 w-1.5 rounded-full bg-[#A6E795] animate-pulse" title="Unsaved changes" />
              )}
            </div>

            {/* Single Unified Save Button for all Note Cards */}
            <button
              type="button"
              disabled={isSavingNotes || !hasNotesChanges}
              onClick={handleSaveAllNotes}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${notesSavedStatus === "saved"
                ? "bg-[#A6E795]/20 text-[#A6E795] border border-[#A6E795]/50 shadow-xs"
                : hasNotesChanges
                  ? "bg-[#A6E795] text-black hover:bg-[#93d382] shadow-[0_0_15px_rgba(166,231,149,0.35)] active:scale-95"
                  : "bg-zinc-900 text-zinc-500 border border-zinc-800/80 opacity-60 cursor-not-allowed"
                }`}
              title="Save all notes"
            >
              {isSavingNotes ? (
                <>
                  <CircleNotch size={13} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : notesSavedStatus === "saved" ? (
                <>
                  <Check size={13} weight="bold" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <FloppyDisk size={13} weight="bold" />
                  <span>Save Notes</span>
                </>
              )}
            </button>
          </div>

          {/* Card 1: Core Intuition */}
          <WritableCard
            icon={Lightbulb}
            iconColor="text-[#A6E795]"
            title="Core Intuition"
            placeholder="Instead of searching forward, look backward for target - nums[i] in a Hash Map to get the required complement in O(1) time."
            value={intuition}
            onChange={setIntuition}
          />

          {/* Card 2: Complexity Analysis (Time & Space) with Options */}
          <WritableComplexityCard
            timeComplexity={timeComplexity}
            spaceComplexity={spaceComplexity}
            onChangeTime={setTimeComplexity}
            onChangeSpace={setSpaceComplexity}
          />

          {/* Card 3: Key Learning */}
          <WritableCard
            icon={GraduationCap}
            iconColor="text-amber-400"
            title="Key Learning"
            placeholder="Hash Map converts an O(N) linear scan into O(1) constant lookup."
            value={keyLearning}
            onChange={setKeyLearning}
          />

          {/* Card 4: Mistakes & Edge Cases */}
          <WritableCard
            icon={Warning}
            iconColor="text-orange-400"
            title="Mistakes & Edge Cases"
            placeholder="• Cannot use the same element twice.&#10;• Handle cases with duplicates carefully.&#10;• Empty array or less than 2 elements.&#10;• Large numbers (overflow in other langs)."
            value={mistakes}
            onChange={setMistakes}
          />

          {/* Card 5: Interview Pitch */}
          <WritableCard
            icon={ChatCircleDots}
            iconColor="text-indigo-400"
            title="Interview Pitch"
            placeholder="I'll first explain the brute force approach with O(N²) time. Then, I'll optimize it using a Hash Map to achieve O(N) by storing numbers and checking for complements."
            value={interviewExplanation}
            onChange={setInterviewExplanation}
          />
        </div>
      </div>

      {/* Edit Problem Modal */}
      <EditProblemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        problem={{
          id: problem.id,
          title: problem.title,
          questNo: problem.questNo,
          platform: problem.platform,
          difficulty: problem.difficulty,
          url: problem.url,
          tags: problem.tags,
        }}
        onSuccess={(updated) => {
          setProblem((prev) => (prev ? { ...prev, ...updated } : prev));
        }}
      />
    </main>
  );
}

// Lightweight Writable Textarea Card with Title on the LEFT side (Controlled)
function WritableCard({
  icon: Icon,
  iconColor,
  title,
  placeholder,
  value,
  onChange,
  maxLength = 5000,
}: {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  maxLength?: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 56)}px`;
    }
  }, [value]);

  return (
    <div className="relative z-10 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-xl backdrop-blur-md space-y-3 transition-all focus-within:border-[#A6E795]/50 focus-within:bg-zinc-900/80 group">
      {/* Header: Left is Icon + Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Icon size={18} weight="fill" className={`${iconColor} shrink-0`} />
          <h3 className="text-xs sm:text-[13px] font-bold text-zinc-100 tracking-tight">{title}</h3>
        </div>
      </div>

      {/* Spacious Full-Width Writable Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={2}
        className="w-full resize-none overflow-hidden bg-transparent text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none leading-relaxed transition-colors selection:bg-[#A6E795]/20 selection:text-white text-left"
      />
    </div>
  );
}

// Lightweight Writable Complexity Card with Options Picker & Title on the LEFT (Controlled)
function WritableComplexityCard({
  timeComplexity,
  spaceComplexity,
  onChangeTime,
  onChangeSpace,
}: {
  timeComplexity: string;
  spaceComplexity: string;
  onChangeTime: (tc: string) => void;
  onChangeSpace: (sc: string) => void;
}) {
  const [openDropdown, setOpenDropdown] = useState<"tc" | "sc" | null>(null);

  return (
    <div
      className={`rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-xl backdrop-blur-md space-y-3.5 transition-all focus-within:border-[#A6E795]/50 focus-within:bg-zinc-900/80 group ${openDropdown ? "relative z-40" : "relative z-20"
        }`}
    >
      {/* Header: Left is Icon + Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Clock size={18} weight="fill" className="text-sky-400 shrink-0" />
          <h3 className="text-xs sm:text-[13px] font-bold text-zinc-100 tracking-tight">
            Complexity Analysis
          </h3>
        </div>
      </div>

      {/* Complexity Rows with interactive Big-O options */}
      <div className="space-y-2.5 text-xs pt-0.5">
        {/* Time Complexity Row */}
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2.5">
          <span className="text-zinc-400 font-medium">Time Complexity</span>
          <ComplexityOptionSelector
            currentValue={timeComplexity}
            isOpen={openDropdown === "tc"}
            onToggle={() => setOpenDropdown(openDropdown === "tc" ? null : "tc")}
            onClose={() => setOpenDropdown(null)}
            onSelect={(val) => {
              onChangeTime(val);
              setOpenDropdown(null);
            }}
          />
        </div>

        {/* Space Complexity Row */}
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-zinc-400 font-medium">Space Complexity</span>
          <ComplexityOptionSelector
            currentValue={spaceComplexity}
            isOpen={openDropdown === "sc"}
            onToggle={() => setOpenDropdown(openDropdown === "sc" ? null : "sc")}
            onClose={() => setOpenDropdown(null)}
            onSelect={(val) => {
              onChangeSpace(val);
              setOpenDropdown(null);
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Popover / Dropdown Selector with Standard Big-O Options and Custom Input
function ComplexityOptionSelector({
  currentValue,
  isOpen,
  onToggle,
  onClose,
  onSelect,
}: {
  currentValue: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSelect: (val: string) => void;
}) {
  const [customInput, setCustomInput] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-[#A6E795]/50 text-xs font-mono font-bold text-[#A6E795] transition-all cursor-pointer shadow-xs active:scale-95"
      >
        <span>{currentValue || "O(1)"}</span>
        <CaretDown
          size={11}
          weight="bold"
          className={`text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#A6E795]" : ""
            }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-64 rounded-xl border border-zinc-700/80 bg-[#0F1218] p-3 shadow-[0_12px_40px_rgba(0,0,0,0.85)] z-[100] animate-in fade-in zoom-in-95 duration-150 space-y-2.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-0.5">
            Select Complexity
          </div>

          {/* Quick Preset Grid */}
          <div className="grid grid-cols-3 gap-1.5">
            {COMPLEXITY_OPTIONS.map((opt) => {
              const isSelected = currentValue === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onSelect(opt)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${isSelected
                    ? "bg-[#A6E795]/20 text-[#A6E795] border border-[#A6E795]/50 shadow-xs"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800/80 bg-zinc-900/80"
                    }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Custom Input */}
          <div className="pt-2 border-t border-zinc-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customInput.trim()) {
                  onSelect(customInput.trim());
                  setCustomInput("");
                }
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                maxLength={50}
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Custom e.g. O(N+M)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-[#A6E795]/60"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 shrink-0 cursor-pointer"
              >
                Set
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import type { Problem, Note as PrismaNote, RevisionLog } from "@/prisma/generated/client/client";

import Note from "@/components/notes/Note";
import NoteForm from "@/components/notes/NoteForm";
import ReviewCard from "@/components/reviews/ReviewForm";
import RevisionStats from "@/components/reviews/RevisionStats";
import RevisionHistory from "@/components/reviews/RevisionHistory";
import PlatformLogo from "@/components/problems/PlatformLogo";
import CodeEditor from "@/components/problems/CodeEditor";

import {
  ArrowLeft,
  PencilSimpleLine,
  Play,
  CheckCircle,
  CalendarBlank,
  ChatText,
  Hash,
  ClockCounterClockwise,
  ArrowSquareOut,
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
  questNo?: number | string | null;
};

export default function ProblemPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const [problem, setProblem] = useState<ProblemWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<string>("");
  const [approach, setApproach] = useState<"brute" | "optimal">("brute");



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
      } catch (err) {
        console.error("Failed to load problem:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id, router]);

  useEffect(() => {
    if (problem?.note?.language) {
      setLang(problem.note.language);
    }
  }, [problem?.note?.language]);


  if (isSessionLoading || loading) {
    return (
      <main className="flex h-[70vh] flex-col items-center justify-center gap-3 text-zinc-400">
        <CircleNotch size={28} className="animate-spin text-[#a6e795]" />
        <p className="text-sm font-medium">Loading problem details...</p>
      </main>
    );
  }

  if (!problem) {
    return (
      <main className="flex h-[70vh] flex-col items-center justify-center gap-4 text-zinc-400">
        <p className="text-base text-zinc-300">Problem not found.</p>
        <Link
          href="/problems"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white hover:border-zinc-700 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Problems
        </Link>
      </main>
    );
  }

  const currentCode =
    approach === "brute"
      ? problem.note?.bruteForceApproach || "// No brute force code yet"
      : problem.note?.optimizedApproach || "// No optimized code yet";

  return (
    <main className="px-6 py-6">
      {/* Top Row Navigation & Actions */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link
            href="/problems"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Problems
          </Link>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex items-center gap-2 text-sm border border-zinc-800 hover:border-zinc-700 rounded-xl px-4 py-2 text-zinc-300 transition-colors cursor-pointer bg-zinc-900/50"
          >
            <PencilSimpleLine size={16} />
            Edit problem
          </button>
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-semibold rounded-xl px-4 py-2 bg-[#a6e795] hover:bg-[#93d382] text-black transition-all shadow-[0_0_15px_rgba(166,231,149,0.2)] cursor-pointer"
          >
            <Play size={16} weight="bold" />
            Start Review
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Problem Detail Card */}
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            {/* Left: Checkmark, Title, Badges, Link */}
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {problem.questNo ? `${problem.questNo}. ` : ""}
                  {problem.title}
                </h1>
                <CheckCircle size={24} className="text-[#a6e795]/90 shrink-0" weight="bold" />
              </div>

              {/* Badges Row */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Platform Badge */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-200">
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
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-900 border border-zinc-800/80 text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
              </div>

              {/* External Problem URL */}
              {problem.url && (
                <div className="pt-1">
                  <a
                    href={problem.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#a6e795]/90 hover:text-[#a6e795] hover:underline transition-all font-medium"
                  >
                    <span>{problem.url}</span>
                    <ArrowSquareOut size={14} className="shrink-0" />
                  </a>
                </div>
              )}
            </div>

            {/* Right: Meta Details Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-xs shrink-0 border-t lg:border-t-0 lg:border-l border-zinc-800/80 pt-4 lg:pt-0 lg:pl-6">
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
            </div>
          </div>
        </div>

        {/* Monaco Editor */}
        <div>
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
                    [savedApproach === "brute" ? "bruteForceApproach" : "optimizedApproach"]: savedCode,
                  },
                };
              });
            }}
          />
        </div>
      </div>

      {/* Problem Raw Details (Legacy / For Reference) */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "24px",
          marginTop: "20px",
        }}
      >
        <h1>{problem.title}</h1>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              border: "1px solid #ccc",
              padding: "4px 10px",
              borderRadius: "999px",
            }}
          >
            {problem.platform}
          </span>

          <span
            style={{
              border: "1px solid #ccc",
              padding: "4px 10px",
              borderRadius: "999px",
            }}
          >
            {problem.difficulty}
          </span>
        </div>

        <p>
          <strong>Tags:</strong> {problem.tags.join(", ")}
        </p>

        <p>
          <strong>Problem:</strong>{" "}
          <a href={problem.url} target="_blank" rel="noreferrer">
            Solve ↗
          </a>
        </p>
      </div>

      {/* Notes Section */}
      <section
        style={{
          marginTop: "30px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h2>📝 Notes</h2>
        {problem.note ? (
          <Note note={problem.note} />
        ) : (
          <p>No notes yet. Create one!</p>
        )}
      </section>

      {/* Review Form */}
      <section
        style={{
          marginTop: "30px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h2>Review form</h2>
        <ReviewCard id={id} />
      </section>

      {/* Revision History */}
      <section
        style={{
          marginTop: "30px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h2>Revision History</h2>
        {problem.revisionLogs && problem.revisionLogs.length > 0 ? (
          problem.revisionLogs.map((revision) => (
            <RevisionHistory key={revision.id} revision={revision} />
          ))
        ) : (
          <p>No Revisions Yet!</p>
        )}
      </section>

      {/* Revision Stats */}
      <section
        style={{
          marginTop: "30px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <RevisionStats problem={problem as any} />
      </section>

      {/* Note Form */}
      <section>
        <NoteForm id={id} />
      </section>
    </main>
  );
}

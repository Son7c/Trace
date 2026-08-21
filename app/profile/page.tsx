"use client";

import Dock from "@/components/Dock";
import { authClient } from "@/lib/auth-client";
import { Problem, RevisionLog } from "@/prisma/generated/client/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  House,
  Play,
  Plus,
  Archive,
  User,
  SignOut,
  Brain,
  Fire,
  Lightning,
  BookOpen,
  Barbell,
  Timer,
  Camera,
  Check,
  X,
  Trash,
  Info,
  CaretDown,
  CaretRight,
  Code,
  CheckCircle,
  Eye,
  UploadSimple,
  CircleNotch,
  DownloadSimple,
} from "@phosphor-icons/react";

type ProblemWithLogs = Problem & {
  revisionLogs: RevisionLog[];
};

type TagMastery = {
  tag: string;
  percentage: number;
  problemCount: number;
  status: "Mastered" | "Optimal" | "Review Due";
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getHighResAvatarUrl(
  url: string | null | undefined,
): string | undefined {
  if (!url) return undefined;

  // Google OAuth avatar high-res upgrade (e.g. =s96-c or =s96 -> =s1000-c)
  if (url.includes("googleusercontent.com")) {
    if (url.match(/=s\d+(-c)?/)) {
      return url.replace(/=s\d+(-c)?/, "=s1000-c");
    }
    return url.includes("?") ? `${url}&sz=1000` : `${url}?sz=1000`;
  }

  // GitHub avatar high-res upgrade (e.g. ?s=96 -> ?s=1000)
  if (url.includes("githubusercontent.com")) {
    if (url.includes("s=")) {
      return url.replace(/s=\d+/, "s=1000");
    }
    return url.includes("?") ? `${url}&s=1000` : `${url}?s=1000`;
  }

  // Dicebear avatar high-res SVG size upgrade
  if (url.includes("dicebear.com")) {
    if (url.includes("size=")) {
      return url.replace(/size=\d+/, "size=600");
    }
    return url.includes("?") ? `${url}&size=600` : `${url}?size=600`;
  }

  return url;
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}mo ago`;
}

function useCountUp(target: number, duration = 700): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

// LeetCode exact green theme color steps
const HEAT_LEVEL_CLASSES = [
  "bg-zinc-800/80 border border-zinc-700/30 hover:border-zinc-500",
  "bg-[#0e4429] border border-[#0e4429]",
  "bg-[#006d32] border border-[#006d32]",
  "bg-[#26a641] border border-[#26a641]",
  "bg-[#39d353] border border-[#39d353] shadow-[0_0_6px_rgba(57,211,83,0.4)]",
];

const DIFF_FILL: Record<string, string> = {
  EASY: "bg-emerald-500",
  MEDIUM: "bg-amber-500",
  HARD: "bg-rose-500",
};

const DIFF_TEXT: Record<string, string> = {
  EASY: "text-emerald-400",
  MEDIUM: "text-amber-400",
  HARD: "text-rose-400",
};

const DIFF_BG: Record<string, string> = {
  EASY: "bg-emerald-500/10 border-emerald-500/20",
  MEDIUM: "bg-amber-500/10 border-amber-500/20",
  HARD: "bg-rose-500/10 border-rose-500/20",
};

const FEEDBACK_BORDER: Record<string, string> = {
  EASY: "border-l-emerald-500",
  MEDIUM: "border-l-amber-500",
  HARD: "border-l-rose-500",
  AGAIN: "border-l-rose-600",
};

const FEEDBACK_TEXT: Record<string, string> = {
  EASY: "text-emerald-400",
  MEDIUM: "text-amber-400",
  HARD: "text-rose-400",
  AGAIN: "text-rose-400",
};

const STATUS_BAR: Record<TagMastery["status"], string> = {
  Mastered:
    "bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]",
  Optimal:
    "bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]",
  "Review Due":
    "bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.4)]",
};

const STATUS_TEXT: Record<TagMastery["status"], string> = {
  Mastered: "text-emerald-400",
  Optimal: "text-amber-400",
  "Review Due": "text-rose-400",
};

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [problems, setProblems] = useState<ProblemWithLogs[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [avatarMode, setAvatarMode] = useState<"file" | "url" | "preset">(
    "file",
  );
  const [avatarUrlInput, setAvatarUrlInput] = useState("");
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("trace_user_avatar_url");
    if (saved) {
      setCustomAvatar(saved);
    }
  }, []);

  const handleSaveAvatarToDB = async (url: string) => {
    setIsSavingAvatar(true);
    try {
      const trimmed = url.trim();
      const response = await fetch("/api/user/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: trimmed || null }),
      });

      if (response.ok) {
        if (trimmed) {
          setCustomAvatar(trimmed);
          localStorage.setItem("trace_user_avatar_url", trimmed);
        } else {
          setCustomAvatar(null);
          localStorage.removeItem("trace_user_avatar_url");
        }
        setImageError(false);
        setIsPhotoModalOpen(false);
        setUploadPreview(null);
      } else {
        console.error("Failed to save avatar to database");
      }
    } catch (err) {
      console.error("Error saving avatar to database:", err);
    } finally {
      setIsSavingAvatar(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image file under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setUploadPreview(result);
        setAvatarUrlInput(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const rawAvatarUrl =
    customAvatar ||
    session?.user?.image ||
    (session?.user as Record<string, any>)?.picture ||
    (session?.user as Record<string, any>)?.avatarUrl;

  const userAvatarUrl = useMemo(
    () => getHighResAvatarUrl(rawAvatarUrl),
    [rawAvatarUrl],
  );

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("/api/problems");
        if (response.ok) {
          const data = await response.json();
          setProblems(data);
        }
      } catch (error) {
        console.error("Failed to fetch user problems:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchProblems();
    }
  }, [session]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  const totalProblems = problems.length;

  const memoryScore = useMemo(() => {
    if (problems.length === 0) return 0;
    const totalEF = problems.reduce((acc, p) => acc + (p.easeFactor || 2.5), 0);
    const avgEF = totalEF / problems.length;
    return Math.round(Math.min(99, Math.max(35, (avgEF / 2.5) * 85)));
  }, [problems]);

  const topicMasteries = useMemo<TagMastery[]>(() => {
    if (problems.length === 0) return [];
    const tagMap: Record<string, { totalEF: number; count: number }> = {};

    problems.forEach((p) => {
      const tags = p.tags && p.tags.length > 0 ? p.tags : ["General"];
      tags.forEach((tag) => {
        const normalized = tag.trim();
        if (!tagMap[normalized]) {
          tagMap[normalized] = { totalEF: 0, count: 0 };
        }
        tagMap[normalized].totalEF += p.easeFactor || 2.5;
        tagMap[normalized].count += 1;
      });
    });

    return Object.entries(tagMap)
      .map(([tag, { totalEF, count }]) => {
        const avgEF = totalEF / count;
        const percentage = Math.round(
          Math.min(99, Math.max(35, (avgEF / 2.5) * 85)),
        );
        const status: TagMastery["status"] =
          percentage >= 80
            ? "Mastered"
            : percentage >= 60
              ? "Optimal"
              : "Review Due";
        return { tag, percentage, problemCount: count, status };
      })
      .sort(
        (a, b) =>
          b.problemCount - a.problemCount || b.percentage - a.percentage,
      )
      .slice(0, 6);
  }, [problems]);

  const difficultyCounts = useMemo(() => {
    const counts = { EASY: 0, MEDIUM: 0, HARD: 0 };
    problems.forEach((p) => {
      if (p.difficulty in counts) {
        counts[p.difficulty as keyof typeof counts]++;
      }
    });
    return counts;
  }, [problems]);

  const totalDiff = useMemo(() => {
    return (
      difficultyCounts.EASY + difficultyCounts.MEDIUM + difficultyCounts.HARD ||
      1
    );
  }, [difficultyCounts]);

  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    problems.forEach((p) => {
      const platform = p.platform || "OTHERS";
      counts[platform] = (counts[platform] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [problems]);

  const recentRevisions = useMemo(() => {
    const logs: Array<{
      id: string;
      problemTitle: string;
      userFeedback: string;
      reviewedAt: Date;
    }> = [];

    problems.forEach((p) => {
      if (p.revisionLogs && p.revisionLogs.length > 0) {
        p.revisionLogs.forEach((log) => {
          logs.push({
            id: log.id,
            problemTitle: p.title,
            userFeedback: log.userFeedback,
            reviewedAt: new Date(log.reviewedAt),
          });
        });
      }
    });

    return logs
      .sort((a, b) => b.reviewedAt.getTime() - a.reviewedAt.getTime())
      .slice(0, 6);
  }, [problems]);

  const recentProblems = useMemo(() => {
    return [...problems]
      .sort((a, b) => {
        const aDate = a.revisionLogs?.[0]?.reviewedAt
          ? new Date(a.revisionLogs[0].reviewedAt).getTime()
          : 0;
        const bDate = b.revisionLogs?.[0]?.reviewedAt
          ? new Date(b.revisionLogs[0].reviewedAt).getTime()
          : 0;
        return bDate - aDate;
      })
      .slice(0, 6);
  }, [problems]);

  const revisionsByDate = useMemo(() => {
    const map = new Map<string, number>();
    problems.forEach((p) => {
      (p.revisionLogs || []).forEach((log) => {
        const key = dateKey(new Date(log.reviewedAt));
        map.set(key, (map.get(key) || 0) + 1);
      });
    });
    return map;
  }, [problems]);

  const currentStreak = useMemo(() => {
    if (revisionsByDate.size === 0) return 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    if (!revisionsByDate.has(dateKey(cursor))) {
      cursor.setDate(cursor.getDate() - 1);
    }
    let streak = 0;
    while (revisionsByDate.has(dateKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }, [revisionsByDate]);

  const maxStreak = useMemo(() => {
    if (revisionsByDate.size === 0) return 0;
    const sortedDates = Array.from(revisionsByDate.keys())
      .map((d) => new Date(d).getTime())
      .sort((a, b) => a - b);

    let maxS = 0;
    let currentS = 0;
    let prevTime: number | null = null;

    for (const time of sortedDates) {
      if (prevTime === null) {
        currentS = 1;
      } else {
        const diffDays = Math.round((time - prevTime) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentS += 1;
        } else if (diffDays > 1) {
          currentS = 1;
        }
      }
      prevTime = time;
      if (currentS > maxS) maxS = currentS;
    }
    return Math.max(maxS, currentStreak);
  }, [revisionsByDate, currentStreak]);

  // Exact LeetCode Month-Segregated Heatmap Logic
  const heatmapData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxCount = Math.max(1, ...Array.from(revisionsByDate.values()));
    const months = [];
    let totalSubmissionsPastYear = 0;
    let activeDaysCount = 0;

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed: 7 = August

    // Start specifically from August 2026 (August index = 7)
    const startYear = 2026;
    const startMonthIndex = 7; // August 2026

    let monthOffset = 0;
    while (true) {
      const monthObj = new Date(startYear, startMonthIndex + monthOffset, 1);
      const year = monthObj.getFullYear();
      const monthIndex = monthObj.getMonth();

      // Stop once we go beyond the current year/month
      if (
        year > currentYear ||
        (year === currentYear && monthIndex > currentMonth)
      ) {
        break;
      }

      const monthLabel = monthObj.toLocaleDateString("en-US", {
        month: "short",
      });

      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      const firstDayOfWeek = new Date(year, monthIndex, 1).getDay(); // 0 = Sun

      const weeks: Array<
        Array<{
          key: string;
          date: Date;
          count: number;
          level: number;
          isFuture: boolean;
          isEmpty: boolean;
        }>
      > = [];

      let currentWeek: Array<{
        key: string;
        date: Date;
        count: number;
        level: number;
        isFuture: boolean;
        isEmpty: boolean;
      }> = [];

      for (let b = 0; b < firstDayOfWeek; b++) {
        currentWeek.push({
          key: `blank-start-${year}-${monthIndex}-${b}`,
          date: new Date(year, monthIndex, 1),
          count: 0,
          level: 0,
          isFuture: false,
          isEmpty: true,
        });
      }

      for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
        const date = new Date(year, monthIndex, dayNum);
        date.setHours(0, 0, 0, 0);
        const key = dateKey(date);
        const count = revisionsByDate.get(key) || 0;
        const isFuture = date.getTime() > today.getTime();

        if (!isFuture && count > 0) {
          totalSubmissionsPastYear += count;
          activeDaysCount += 1;
        }

        let level = 0;
        if (!isFuture && count > 0) {
          const ratio = count / maxCount;
          level = ratio >= 0.75 ? 4 : ratio >= 0.5 ? 3 : ratio >= 0.25 ? 2 : 1;
        }

        currentWeek.push({
          key,
          date,
          count,
          level,
          isFuture,
          isEmpty: false,
        });

        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
      }

      if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
          currentWeek.push({
            key: `blank-end-${year}-${monthIndex}-${currentWeek.length}`,
            date: new Date(year, monthIndex, daysInMonth),
            count: 0,
            level: 0,
            isFuture: false,
            isEmpty: true,
          });
        }
        weeks.push(currentWeek);
      }

      months.push({
        year,
        monthIndex,
        monthLabel,
        weeks,
      });

      monthOffset++;
    }

    return {
      months,
      totalSubmissionsPastYear,
      activeDaysCount,
      maxCount,
    };
  }, [revisionsByDate]);

  const animatedMemoryScore = useCountUp(memoryScore);
  const animatedStreak = useCountUp(currentStreak, 500);
  const animatedProblems = useCountUp(totalProblems, 600);
  const animatedSubmissions = useCountUp(
    heatmapData.totalSubmissionsPastYear,
    700,
  );

  const usernameHandle = useMemo(() => {
    if (!session?.user?.name) return "engineer";
    return session.user.name.toLowerCase().replace(/[^a-z0-9]/g, "");
  }, [session]);

  const revealClass = `transition-all duration-500 ease-out ${
    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
  }`;
  const revealStyle = (delay: number) => ({ transitionDelay: `${delay}ms` });

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pb-32 relative overflow-hidden">
        <main className="max-w-6xl mx-auto px-6 pt-12 space-y-6">
          <div className="h-28 rounded-2xl border border-zinc-800/80 bg-[#0D0D0D] animate-pulse" />
          <div className="h-52 rounded-2xl border border-zinc-800/80 bg-[#0D0D0D] animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-80 rounded-2xl border border-zinc-800/80 bg-[#0D0D0D] animate-pulse" />
            <div className="h-80 rounded-2xl border border-zinc-800/80 bg-[#0D0D0D] animate-pulse" />
          </div>
        </main>
      </div>
    );
  }

  const userInitial = session?.user.name
    ? session.user.name[0].toUpperCase()
    : "U";
  const userJoinedDate = session?.user.createdAt
    ? new Date(session.user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  // Donut chart stroke dashes
  const donutTotal = totalDiff;
  const easyDash = (difficultyCounts.EASY / donutTotal) * 251.2;
  const medDash = (difficultyCounts.MEDIUM / donutTotal) * 251.2;
  const hardDash = (difficultyCounts.HARD / donutTotal) * 251.2;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 antialiased selection:bg-emerald-500/20 selection:text-emerald-300 pb-32 relative overflow-hidden">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 space-y-6 relative z-10">
        {/* ═══════════════════════════════════════════════════════════
            1. TOP PROFILE HEADER CARD (FULL WIDTH)
        ═══════════════════════════════════════════════════════════ */}
        <section
          style={revealStyle(0)}
          className={`${revealClass} rounded-2xl border border-zinc-800/90 bg-[#0D0D0D]/90 backdrop-blur-xl p-6 sm:p-7 shadow-2xl`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* User Details */}
            <div className="flex items-center gap-5">
              <div
                onClick={() => {
                  setAvatarUrlInput(customAvatar || userAvatarUrl || "");
                  setUploadPreview(customAvatar || userAvatarUrl || null);
                  setIsPhotoModalOpen(true);
                }}
                title="Click to view & upload profile picture"
                className="relative group/avatar cursor-pointer shrink-0"
              >
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-emerald-500/30 via-purple-500/10 to-indigo-500/10 blur-sm opacity-60 group-hover/avatar:opacity-100 transition-opacity" />

                {userAvatarUrl && !imageError ? (
                  <img
                    src={userAvatarUrl}
                    alt={session?.user?.name || "User avatar"}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-zinc-700/90 object-cover bg-[#0A0A0A] shadow-md transition-transform group-hover/avatar:scale-105"
                  />
                ) : (
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-zinc-700/90 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex items-center justify-center text-2xl font-bold text-zinc-100 shadow-inner transition-transform group-hover/avatar:scale-105">
                    {userInitial}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
                  {session?.user.name || "Trace Engineer"}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                  <span>@{usernameHandle}</span>
                  <span className="text-zinc-700">·</span>
                  <span className="text-zinc-500">Joined {userJoinedDate}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats & Actions */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="hidden sm:flex items-center gap-5 px-4 py-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/60 text-xs">
                <div>
                  <div className="text-zinc-500 text-[10px] uppercase">
                    Streak
                  </div>
                  <div className="text-amber-400 font-bold text-sm flex items-center gap-1">
                    <Fire size={14} weight="fill" />
                    {animatedStreak}d
                  </div>
                </div>
                <div className="w-px h-6 bg-zinc-800" />
                <div>
                  <div className="text-zinc-500 text-[10px] uppercase">
                    Score
                  </div>
                  <div className="text-emerald-400 font-bold text-sm">
                    {animatedMemoryScore}%
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push("/review")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-zinc-950 text-xs font-bold uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-md cursor-pointer"
              >
                <Play size={14} weight="fill" />
                <span>Start Review</span>
              </button>

              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl border border-zinc-800 bg-[#0A0A0A] text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors cursor-pointer"
                title="Sign out"
              >
                <SignOut size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            2. MONTH-SEGREGATED SUBMISSION HEATMAP CARD (BELOW PROFILE)
        ═══════════════════════════════════════════════════════════ */}
        <section
          style={revealStyle(20)}
          className={`${revealClass} rounded-2xl border border-zinc-800/90 bg-[#0D0D0D]/90 backdrop-blur-xl p-5 sm:p-6 shadow-2xl space-y-5`}
        >
          {/* Heatmap Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-zinc-800/60 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-zinc-100 tracking-tight">
                {animatedSubmissions.toLocaleString()}
              </span>
              <span className="text-zinc-400 font-medium">
                submissions since August 2026
              </span>
              <Info size={14} className="text-zinc-500 cursor-pointer" />
            </div>

            <div className="flex items-center gap-5 text-zinc-400 text-xs">
              <div>
                <span>Total active days: </span>
                <span className="text-zinc-100 font-bold">
                  {heatmapData.activeDaysCount}
                </span>
              </div>

              <div>
                <span>Max streak: </span>
                <span className="text-zinc-100 font-bold">{maxStreak}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-200 text-xs font-medium cursor-pointer hover:border-zinc-700 transition-colors">
                <span>Current</span>
                <CaretDown size={12} className="text-zinc-400" />
              </div>
            </div>
          </div>

          {/* 12 HORIZONTAL MONTH BLOCKS WITH GAPS & LABELS BELOW */}
          <div className="overflow-x-auto pb-2 pt-1">
            <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-max">
              {heatmapData.months.map((m) => (
                <div
                  key={`${m.year}-${m.monthIndex}`}
                  className="flex flex-col items-center gap-2"
                >
                  {/* Month Week Columns */}
                  <div className="flex gap-[3px]">
                    {m.weeks.map((week, wIdx) => (
                      <div key={wIdx} className="flex flex-col gap-[3px]">
                        {week.map((day) => (
                          <div
                            key={day.key}
                            title={
                              day.isEmpty || day.isFuture
                                ? undefined
                                : `${day.count} ${
                                    day.count === 1
                                      ? "submission"
                                      : "submissions"
                                  } on ${day.date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}`
                            }
                            className={`w-[11px] h-[11px] sm:w-[12px] sm:h-[12px] rounded-[2.5px] transition-all cursor-pointer ${
                              day.isEmpty || day.isFuture
                                ? "bg-transparent pointer-events-none"
                                : HEAT_LEVEL_CLASSES[day.level]
                            }`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Centered Month Label Underneath */}
                  <span className="text-[11px] text-zinc-400 font-medium">
                    {m.monthLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap Footer Legend */}
          <div className="flex items-center justify-end gap-2 text-[10px] text-zinc-400 pt-2 border-t border-zinc-800/40">
            <span>Less</span>
            {HEAT_LEVEL_CLASSES.map((cls, i) => (
              <span
                key={i}
                className={`w-[11px] h-[11px] sm:w-[12px] sm:h-[12px] rounded-[2.5px] ${cls}`}
              />
            ))}
            <span>More</span>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            3. PERFECTLY CONSISTENT & SYMMETRIC 2-COLUMN TILES GRID
        ═══════════════════════════════════════════════════════════ */}

        {/* ROW 1: SOLVED BREAKDOWN & TOPIC MASTERY */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Tile 1: Solved Problems Breakdown */}
          <div
            style={revealStyle(40)}
            className={`${revealClass} rounded-2xl border border-zinc-800/80 bg-[#0D0D0D]/90 backdrop-blur-md p-6 shadow-xl space-y-5 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
              <h2 className="text-xs uppercase tracking-wider text-zinc-300 font-bold flex items-center gap-2">
                <CheckCircle
                  size={16}
                  weight="duotone"
                  className="text-emerald-400"
                />
                Solved Problems Breakdown
              </h2>
              <span className="text-[11px] text-zinc-500">
                {totalProblems} total
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center flex-1">
              {/* Donut Chart */}
              <div className="sm:col-span-5 flex items-center justify-center py-2">
                <div className="relative w-36 h-36">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full -rotate-90 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.15)]"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#18181B"
                      strokeWidth="9"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="9"
                      strokeDasharray={`${easyDash} 251.2`}
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="9"
                      strokeDasharray={`${medDash} 251.2`}
                      strokeDashoffset={`-${easyDash}`}
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#F43F5E"
                      strokeWidth="9"
                      strokeDasharray={`${hardDash} 251.2`}
                      strokeDashoffset={`-${easyDash + medDash}`}
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-zinc-100 tracking-tight">
                      {animatedProblems}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium mt-0.5">
                      Solved
                    </span>
                  </div>
                </div>
              </div>

              {/* Difficulty Rows */}
              <div className="sm:col-span-7 space-y-3">
                {(["EASY", "MEDIUM", "HARD"] as const).map((d) => {
                  const count = difficultyCounts[d];
                  const pct = Math.round((count / totalDiff) * 100);
                  return (
                    <div key={d} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-semibold ${DIFF_TEXT[d]}`}>
                          {d}
                        </span>
                        <span className="text-zinc-400">
                          <span className="text-zinc-100 font-bold">
                            {count}
                          </span>
                          <span className="text-zinc-600 font-normal">
                            {" "}
                            / {totalProblems}
                          </span>
                          <span className="text-zinc-500 font-normal ml-1.5">
                            ({pct}%)
                          </span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80">
                        <div
                          style={{ width: mounted ? `${pct}%` : "0%" }}
                          className={`h-full rounded-full transition-[width] duration-1000 ease-out ${DIFF_FILL[d]}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Platforms Footer summary */}
            {platformCounts.length > 0 && (
              <div className="pt-3 border-t border-zinc-800/60 flex items-center gap-2 overflow-x-auto text-[11px] text-zinc-400">
                <span className="text-zinc-500 font-medium uppercase text-[10px] mr-1">
                  Platforms:
                </span>
                {platformCounts.map(([platform, count]) => (
                  <span
                    key={platform}
                    className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 shrink-0 text-zinc-300"
                  >
                    {platform}:{" "}
                    <strong className="text-zinc-100">{count}</strong>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tile 2: Topic & Skill Mastery */}
          <div
            style={revealStyle(60)}
            className={`${revealClass} rounded-2xl border border-zinc-800/80 bg-[#0D0D0D]/90 backdrop-blur-md p-6 shadow-xl space-y-4 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
              <h2 className="text-xs uppercase tracking-wider text-zinc-300 font-bold flex items-center gap-2">
                <Barbell
                  size={16}
                  weight="duotone"
                  className="text-emerald-400"
                />
                Topic & Skill Mastery
              </h2>
              <span className="text-[11px] text-zinc-500">
                {topicMasteries.length} tags
              </span>
            </div>

            {topicMasteries.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-zinc-800/80 rounded-xl bg-zinc-900/20 my-auto">
                <Brain size={24} className="mx-auto text-zinc-600 mb-1.5" />
                <p className="text-xs text-zinc-500">No tagged topics yet.</p>
              </div>
            ) : (
              <div className="space-y-3.5 my-auto">
                {topicMasteries.map(
                  ({ tag, percentage, problemCount, status }) => (
                    <div key={tag} className="group">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-semibold text-zinc-200 text-xs truncate">
                            {tag}
                          </span>
                          <span
                            className={`text-[9px] uppercase tracking-wider font-bold ${STATUS_TEXT[status]}`}
                          >
                            · {status}
                          </span>
                        </div>
                        <span className="text-zinc-400 text-xs shrink-0">
                          {problemCount}× ·{" "}
                          <span className="text-zinc-100 font-bold">
                            {percentage}%
                          </span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80">
                        <div
                          style={{ width: mounted ? `${percentage}%` : "0%" }}
                          className={`h-full rounded-full transition-[width] duration-1000 ease-out ${STATUS_BAR[status]}`}
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </section>

        {/* ROW 2: RECENT SUBMISSIONS & RECALL HISTORY */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Tile 3: Recent Submissions Feed */}
          <div
            style={revealStyle(80)}
            className={`${revealClass} rounded-2xl border border-zinc-800/80 bg-[#0D0D0D]/90 backdrop-blur-md p-6 shadow-xl space-y-4 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
              <h2 className="text-xs uppercase tracking-wider text-zinc-300 font-bold flex items-center gap-2">
                <Lightning
                  size={16}
                  weight="duotone"
                  className="text-emerald-400"
                />
                Recent Submissions
              </h2>
              <button
                onClick={() => router.push("/problems")}
                className="text-[11px] text-zinc-500 hover:text-zinc-200 inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                View All
                <CaretRight size={12} />
              </button>
            </div>

            {recentProblems.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-zinc-800/80 rounded-xl bg-zinc-900/20 my-auto">
                <BookOpen size={24} className="mx-auto text-zinc-600 mb-1.5" />
                <p className="text-xs text-zinc-500">
                  No indexed problems found.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 my-auto">
                {recentProblems.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => router.push(`/problems/${p.id}`)}
                    className="group flex items-center justify-between p-3.5 rounded-xl border border-zinc-800/70 bg-zinc-900/30 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${DIFF_FILL[p.difficulty] || "bg-zinc-700"}`}
                      />
                      <span className="text-xs text-zinc-200 truncate font-semibold group-hover:text-emerald-400 transition-colors">
                        {p.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-xs">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${DIFF_BG[p.difficulty]} ${DIFF_TEXT[p.difficulty]}`}
                      >
                        {p.difficulty}
                      </span>
                      <span className="text-zinc-500 text-[11px]">
                        {p.revisionLogs?.length || 0} reviews
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tile 4: Live Recall History Stream */}
          <div
            style={revealStyle(100)}
            className={`${revealClass} rounded-2xl border border-zinc-800/80 bg-[#0D0D0D]/90 backdrop-blur-md p-6 shadow-xl space-y-4 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
              <h2 className="text-xs uppercase tracking-wider text-zinc-300 font-bold flex items-center gap-2">
                <Timer
                  size={16}
                  weight="duotone"
                  className="text-emerald-400"
                />
                Live Recall History
              </h2>
              <button
                onClick={() => router.push("/review")}
                className="text-[11px] text-zinc-500 hover:text-zinc-200 inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                Review Session
                <CaretRight size={12} />
              </button>
            </div>

            {recentRevisions.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-zinc-800/80 rounded-xl bg-zinc-900/20 my-auto">
                <Brain size={24} className="mx-auto text-zinc-600 mb-1.5" />
                <p className="text-xs text-zinc-500">
                  No recall logs recorded yet.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 my-auto">
                {recentRevisions.map((log) => (
                  <div
                    key={log.id}
                    className={`flex items-center justify-between p-3.5 rounded-r-xl border-l-2 ${
                      FEEDBACK_BORDER[log.userFeedback] || "border-l-zinc-700"
                    } bg-zinc-900/30 hover:bg-zinc-900/70 transition-colors`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`text-[10px] uppercase font-bold shrink-0 ${
                          FEEDBACK_TEXT[log.userFeedback] || "text-zinc-500"
                        }`}
                      >
                        {log.userFeedback}
                      </span>
                      <span className="text-xs text-zinc-300 truncate font-medium">
                        {log.problemTitle}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 shrink-0">
                      {formatRelativeTime(log.reviewedAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════
          PROFILE PHOTO POPUP MODAL (LIVE PREVIEW + FILE UPLOAD)
      ═══════════════════════════════════════════════════════════ */}
      {isPhotoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => {
            setIsPhotoModalOpen(false);
            setUploadPreview(null);
          }}
        >
          <div
            className="relative w-full max-w-md bg-[#0D0D0D] border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5 text-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 relative z-10">
              <div className="flex items-center gap-2">
                <UploadSimple size={18} className="text-emerald-400" />
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
                  Profile Photo
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsPhotoModalOpen(false);
                  setUploadPreview(null);
                }}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* High-Res Live Preview */}
            <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-zinc-700 bg-black/60 shadow-2xl flex items-center justify-center">
              {uploadPreview || avatarUrlInput ? (
                <img
                  src={uploadPreview || avatarUrlInput}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-3xl transition-all duration-200"
                  onError={() => setImageError(true)}
                />
              ) : userAvatarUrl && !imageError ? (
                <img
                  src={userAvatarUrl}
                  alt={session?.user?.name || "Profile Photo"}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-3xl transition-all duration-200"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex items-center justify-center text-5xl font-bold text-zinc-200">
                  {userInitial}
                </div>
              )}
            </div>

            {/* Upload Option Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAvatarMode("file")}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  avatarMode === "file"
                    ? "bg-zinc-800 text-emerald-400 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Device File
              </button>
              <button
                type="button"
                onClick={() => setAvatarMode("url")}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  avatarMode === "url"
                    ? "bg-zinc-800 text-emerald-400 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Image URL
              </button>
              <button
                type="button"
                onClick={() => setAvatarMode("preset")}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  avatarMode === "preset"
                    ? "bg-zinc-800 text-emerald-400 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Presets
              </button>
            </div>

            {/* Tab 1: Device File */}
            {avatarMode === "file" && (
              <div className="space-y-3 text-left">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer space-y-2 group"
                >
                  <div className="p-3 rounded-2xl bg-zinc-800/80 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 text-zinc-400 transition-colors">
                    <UploadSimple size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-200">
                      Click to browse photo from device
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">
                      Supports PNG, JPG, WebP (max 5MB)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Direct Image URL */}
            {avatarMode === "url" && (
              <div className="space-y-2 text-left">
                <label className="text-xs text-zinc-400">Direct Image Link (HTTPS)</label>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.png"
                  value={avatarUrlInput}
                  onChange={(e) => {
                    setAvatarUrlInput(e.target.value);
                    setUploadPreview(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-[#0A0A0A] text-zinc-100 text-xs focus:outline-none focus:border-emerald-500/60 transition-colors"
                />
              </div>
            )}

            {/* Tab 3: Presets */}
            {avatarMode === "preset" && (
              <div className="space-y-2 text-left">
                <label className="text-[11px] text-zinc-500 uppercase tracking-wider">
                  Choose a Developer Avatar
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    "https://api.dicebear.com/7.x/bottts/svg?seed=Trace1",
                    "https://api.dicebear.com/7.x/bottts/svg?seed=Developer",
                    "https://api.dicebear.com/7.x/identicon/svg?seed=TraceCode",
                    "https://api.dicebear.com/7.x/shapes/svg?seed=TraceEngine",
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAvatarUrlInput(preset);
                        setUploadPreview(preset);
                      }}
                      className={`p-1.5 rounded-xl border bg-[#0A0A0A] transition-all flex items-center justify-center overflow-hidden h-14 cursor-pointer ${
                        (uploadPreview || avatarUrlInput) === preset
                          ? "border-emerald-500 ring-2 ring-emerald-500/20"
                          : "border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <img
                        src={preset}
                        alt={`Preset ${idx}`}
                        className="w-10 h-10 object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs">
              {customAvatar ? (
                <button
                  type="button"
                  disabled={isSavingAvatar}
                  onClick={() => handleSaveAvatarToDB("")}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Trash size={14} />
                  <span>Remove</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isSavingAvatar}
                  onClick={() => {
                    setIsPhotoModalOpen(false);
                    setUploadPreview(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={
                    isSavingAvatar || (!avatarUrlInput && !uploadPreview)
                  }
                  onClick={() =>
                    handleSaveAvatarToDB(uploadPreview || avatarUrlInput)
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSavingAvatar ? (
                    <>
                      <CircleNotch size={14} className="animate-spin" />
                      <span>Saving to DB...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>Upload</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dock Navigation */}
      <Dock
        items={[
          {
            icon: <House size={18} />,
            label: "Dashboard",
            onClick: () => router.push("/dashboard"),
          },
          {
            icon: <Play size={18} />,
            label: "Start Review",
            onClick: () => router.push("/review"),
          },
          {
            icon: <Plus size={18} />,
            label: "Add Problem",
            onClick: () => router.push("/problems"),
          },
          {
            icon: <Archive size={18} />,
            label: "Archive",
            onClick: () => router.push("/problems"),
          },
          {
            icon: <User size={18} />,
            label: "Profile",
            onClick: () => router.push("/profile"),
          },
        ]}
      />
    </div>
  );
}

"use client";
import { Problem, RevisionLog } from "@/prisma/generated/client/client";
import { User } from "better-auth";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import {
    CalendarCheck,
    TrendUp,
    Medal,
    ArrowRight,
    SignOut,
    CheckCircle,
    Fire,
} from "@phosphor-icons/react";
import { authClient } from "@/lib/auth-client";

export type ProblemWithLogs = Problem & {
    revisionLogs: RevisionLog[];
};

const dateKey = (date: Date): string => {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${y}-${m}-${d}`;
};

export default function DashboardClient({
    user,
    problems,
    loading = false,
}: {
    user: User;
    problems: ProblemWithLogs[];
    loading?: boolean;
}) {
    const router = useRouter();

    // 1. Derive reviews due today in-memory (0 DB queries!)
    const reviews = useMemo(() => {
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        return problems.filter((p) => new Date(p.nextRevisionDate) <= endOfDay);
    }, [problems]);

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning,";
        if (hour < 18) return "Good afternoon,";
        return "Good evening,";
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

    // 3. Memory Score Calculation
    const memoryScore = useMemo(() => {
        if (problems.length === 0) return 0;
        const totalEF = problems.reduce((acc, p) => acc + (p.easeFactor || 2.5), 0);
        const avgEF = totalEF / problems.length;
        return Math.round(Math.min(99, Math.max(35, (avgEF / 2.5) * 85)));
    }, [problems]);

    // 4. Total Mastered Problems Calculation (interval >= 21 days & easeFactor >= 2.4)
    const totalMastered = useMemo(() => {
        return problems.filter((p) => {
            const isOverDue = new Date(p.nextRevisionDate) <= new Date();
            return (
                !isOverDue && p.intervalDays >= 21 && (p.easeFactor || 2.5) >= 2.4
            );
        }).length;
    }, [problems]);

    // 5. Streaks Calculation using HashSet
    const { currentStreak } = useMemo(() => {
        const allLogs = problems.flatMap(
            (p) => (p.revisionLogs as RevisionLog[]) || [],
        );

        if (!allLogs || allLogs.length === 0) {
            return { currentStreak: 0, maxStreak: 0 };
        }

        const dateSet = new Set<string>();
        allLogs.forEach((log) => {
            dateSet.add(dateKey(new Date(log.reviewedAt)));
        });

        let currentStreak = 0;
        const cursor = new Date();
        cursor.setHours(0, 0, 0, 0);

        // If today is not reviewed yet, check if yesterday was reviewed
        if (!dateSet.has(dateKey(cursor))) {
            cursor.setDate(cursor.getDate() - 1);
        }

        while (dateSet.has(dateKey(cursor))) {
            currentStreak++;
            cursor.setDate(cursor.getDate() - 1);
        }

        const sortedTimestamps = Array.from(dateSet)
            .map((dateStr) => {
                const [y, m, d] = dateStr.split("-").map(Number);
                return new Date(y, m - 1, d).getTime();
            })
            .sort((a, b) => a - b);

        let maxStreak = 0;
        let tempStreak = 0;
        let prevTime: number | null = null;

        for (const time of sortedTimestamps) {
            if (prevTime === null) {
                tempStreak = 1;
            } else {
                const diffDays = Math.round((time - prevTime) / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                    tempStreak++;
                } else if (diffDays > 1) {
                    tempStreak = 1;
                }
            }
            prevTime = time;
            if (tempStreak > maxStreak) {
                maxStreak = tempStreak;
            }
        }

        return {
            currentStreak,
            maxStreak: Math.max(maxStreak, currentStreak),
        };
    }, [problems]);

    const firstName = user?.name
        ? user.name.trim().split(" ")[0]
        : "Engineer";
    const userAvatarUrl = user?.image;

    return (
        <div className="min-h-screen bg-[#07080C] text-zinc-100 font-sans selection:bg-[#a6e795]/20 selection:text-[#a6e795] pb-32 relative overflow-x-hidden">
            {/* ═══════════════════════════════════════════════════════════
              1. TOP NAVIGATION BAR
          ═══════════════════════════════════════════════════════════ */}
            <header className="max-w-7xl mx-auto px-4 sm:px-10 py-4 sm:py-6 flex items-center justify-between gap-3">
                {/* Brand & Main Links */}
                <div className="flex items-center gap-6 sm:gap-10">
                    <div
                        onClick={() => router.push("/dashboard")}
                        className="text-xl sm:text-2xl font-extrabold tracking-tight text-white select-none cursor-pointer"
                    >
                        Trace<span className="text-[#a6e795]"></span>
                    </div>
                </div>

                {/* User Profile Pill & Quick Actions */}
                <div className="flex items-center gap-2">
                    {/* Profile Pill (Navigates to /profile) */}
                    <div
                        onClick={() => router.push("/profile")}
                        className="bg-[#0C0E15]/80 backdrop-blur-xl border border-zinc-800/80 hover:border-zinc-700/90 rounded-full p-1 sm:p-1.5 pr-2.5 sm:pr-3.5 flex items-center gap-2 sm:gap-2.5 text-xs text-zinc-200 shadow-[0_4px_20px_rgba(0,0,0,0.4)] cursor-pointer transition-all duration-300 group hover:-translate-y-0.5"
                        title="View Profile"
                    >
                        {/* Avatar with subtle glow ring */}
                        <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#a6e795]/50 via-emerald-500/20 to-transparent shrink-0">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-zinc-900 overflow-hidden flex items-center justify-center font-bold text-white text-[10px]">
                                {userAvatarUrl ? (
                                    <img
                                        src={userAvatarUrl}
                                        alt={firstName}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    firstName[0]?.toUpperCase()
                                )}
                            </div>
                        </div>

                        {/* Username */}
                        <span className="font-bold text-zinc-100 tracking-tight truncate max-w-[70px] sm:max-w-[90px] group-hover:text-white transition-colors text-[11px] sm:text-xs">
                            {firstName}
                        </span>

                        {/* Vertical Separator */}
                        <span className="h-3.5 w-px bg-zinc-800/90" />

                        {/* Streak Badge */}
                        <div className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] sm:text-[11px] font-semibold">
                            <Fire size={11} weight="fill" className="text-amber-400 animate-pulse" />
                            <span>{currentStreak}d</span>
                        </div>
                    </div>

                    {/* Quick Sign Out Button */}
                    <button
                        onClick={handleLogout}
                        title="Sign Out"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0C0E15]/80 backdrop-blur-xl border border-zinc-800/80 hover:border-rose-500/40 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-md hover:-translate-y-0.5"
                    >
                        <SignOut size={13} weight="bold" />
                    </button>
                </div>
            </header>

            {/* ═══════════════════════════════════════════════════════════
              MAIN CONTENT AREA
          ═══════════════════════════════════════════════════════════ */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6 sm:space-y-8 pb-32">
                {/* 2. GREETING HERO SECTION */}
                <section className="space-y-1.5">
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                        {greeting} <span className="text-[#a6e795]">{firstName}.</span>
                    </h1>
                    <p className="text-zinc-400 text-xs sm:text-sm font-normal tracking-wide">
                        {reviews.length > 0
                            ? `You have ${reviews.length} problem${reviews.length === 1 ? "" : "s"
                            } due for review today.`
                            : "All caught up for today! No problems due for review."}
                    </p>
                </section>

                {/* 3. METRIC CARDS GRID */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
                    {/* Card 1: Due Today */}
                    <div
                        onClick={() => router.push("/review")}
                        className="rounded-2xl border border-zinc-800/80 bg-[#0F121A]/70 backdrop-blur-xl p-5 flex items-center gap-4 shadow-xl cursor-pointer hover:border-zinc-700/80 transition-all group"
                    >
                        <div className="w-11 h-11 rounded-full bg-[#a6e795]/10 border border-[#a6e795]/30 flex items-center justify-center text-[#a6e795] shrink-0 group-hover:scale-105 transition-transform">
                            <CalendarCheck size={20} weight="bold" />
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                {reviews.length}
                            </div>
                            <div className="text-xs text-zinc-400 font-medium">Due Today</div>
                        </div>
                    </div>

                    {/* Card 2: Memory Score */}
                    <div
                        onClick={() => router.push("/profile")}
                        className="rounded-2xl border border-zinc-800/80 bg-[#0F121A]/70 backdrop-blur-xl p-5 flex items-center gap-4 shadow-xl cursor-pointer hover:border-zinc-700/80 transition-all group"
                    >
                        <div className="w-11 h-11 rounded-full bg-[#a6e795]/10 border border-[#a6e795]/30 flex items-center justify-center text-[#a6e795] shrink-0 group-hover:scale-105 transition-transform">
                            <TrendUp size={20} weight="bold" />
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                {memoryScore}%
                            </div>
                            <div className="text-xs text-zinc-400 font-medium">
                                Memory Score
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Total Mastered */}
                    <div
                        onClick={() => router.push("/problems")}
                        className="rounded-2xl border border-zinc-800/80 bg-[#0F121A]/70 backdrop-blur-xl p-5 flex items-center gap-4 shadow-xl cursor-pointer hover:border-zinc-700/80 transition-all group"
                    >
                        <div className="w-11 h-11 rounded-full bg-amber-950/40 border border-amber-800/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                            <Medal size={20} weight="bold" />
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                {totalMastered}
                            </div>
                            <div className="text-xs text-zinc-400 font-medium">
                                Total Mastered
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. TODAY'S FOCUS (REVIEW QUEUE LIST) */}
                <section className="rounded-2xl border border-zinc-800/80 bg-[#0F121A]/70 backdrop-blur-xl p-4 sm:p-7 shadow-2xl space-y-4 sm:space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                            Today's Focus
                        </h2>
                        {reviews.length > 0 && (
                            <button
                                onClick={() => router.push("/review")}
                                className="self-start sm:self-auto border border-[#a6e795]/30 bg-[#a6e795]/10 text-[#a6e795] hover:bg-[#a6e795]/20 text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                            >
                                <span>Start Daily Review</span>
                                <ArrowRight size={13} weight="bold" />
                            </button>
                        )}
                    </div>

                    {/* List Items */}
                    {loading ? (
                        <div className="py-8 text-center text-xs text-zinc-500 animate-pulse">
                            Loading review queue...
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="py-10 text-center space-y-3">
                            <CheckCircle
                                size={36}
                                className="text-[#a6e795] mx-auto opacity-90"
                            />
                            <div className="text-sm font-semibold text-zinc-200">
                                You're all caught up for today! 🎉
                            </div>
                            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                                No problems due right now. Keep up your active streak by adding
                                new problems or exploring your repository archive.
                            </p>
                            <div className="pt-2">
                                <button
                                    onClick={() => router.push("/problems")}
                                    className="text-xs text-[#a6e795] hover:underline font-medium cursor-pointer"
                                >
                                    Browse Problem Archive →
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-800/50">
                            {reviews.map((problem, idx) => (
                                <div
                                    key={problem.id}
                                    className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm group"
                                >
                                    <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 w-full sm:w-auto">
                                        <span className="text-[#a6e795] font-semibold text-xs w-4 shrink-0">
                                            {idx + 1}.
                                        </span>
                                        <span
                                            onClick={() => router.push(`/problems/${problem.id}`)}
                                            className="font-semibold text-zinc-100 hover:text-white transition-colors cursor-pointer truncate"
                                        >
                                            {problem.title}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 shrink-0 w-full sm:w-auto pl-6 sm:pl-0">
                                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                                            <span className="text-zinc-400 text-xs">
                                                {problem.platform}
                                            </span>
                                            <span className="text-zinc-600">·</span>
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold ${problem.difficulty === "HARD"
                                                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                                                    : problem.difficulty === "MEDIUM"
                                                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                                        : "bg-[#a6e795]/10 text-[#a6e795] border border-[#a6e795]/30"
                                                    }`}
                                            >
                                                {problem.difficulty}
                                            </span>
                                            <span className="text-zinc-600">·</span>
                                            <span className="text-zinc-400 text-xs">
                                                {problem.intervalDays}d interval
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => router.push("/review")}
                                            className="text-xs font-semibold text-[#a6e795] hover:brightness-110 flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                                        >
                                            <span>Review</span>
                                            <ArrowRight size={12} weight="bold" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );

}

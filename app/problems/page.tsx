"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import ProblemCard, { ProblemWithLogs } from "@/components/problems/ProblemCard";
import AddProblemModal from "@/components/problems/AddProblemModal";
import EditProblemModal from "@/components/problems/EditProblemModal";
import {
  MagnifyingGlass,
  CaretDown,
  CaretLeft,
  CaretRight,
  Plus,
  CircleNotch,
  Faders,
  ArrowsCounterClockwise,
} from "@phosphor-icons/react";

const ITEMS_PER_PAGE = 9;

type TabType = "all" | "due_today" | "overdue" | "mastered";

export default function ProblemsPage() {
  const router = useRouter();

  const [problems, setProblems] = useState<ProblemWithLogs[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("NEWEST");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<ProblemWithLogs | null>(null);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/problems");
      if (res.ok) {
        const data = await res.json();
        setProblems(data);
      }
    } catch (err) {
      console.error("Failed to load problems:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  // Compute status helpers
  const getProblemStatusType = (p: ProblemWithLogs): "overdue" | "due_today" | "due_soon" | "stable" | "upcoming" => {
    const nextDate = p.nextRevisionDate ? new Date(p.nextRevisionDate) : null;
    if (!nextDate) return "due_today";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(nextDate);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "overdue";
    if (p.intervalDays >= 21 && (p.easeFactor || 2.5) >= 2.4) return "stable";
    if (diffDays === 0) return "due_today";
    if (diffDays <= 2) return "due_soon";
    return "upcoming";
  };

  // Counts for tabs
  const tabCounts = useMemo(() => {
    let dueToday = 0;
    let overdue = 0;
    let mastered = 0;

    problems.forEach((p) => {
      const st = getProblemStatusType(p);
      if (st === "due_today") dueToday++;
      if (st === "overdue") overdue++;
      if (st === "stable") mastered++;
    });

    return {
      all: problems.length,
      dueToday,
      overdue,
      mastered,
    };
  }, [problems]);

  // Combined filtered problems
  const filteredProblems = useMemo(() => {
    const q = search.trim().toLowerCase();

    return problems.filter((p) => {
      // 1. Search Query Filter
      if (q) {
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchPlatform = (p.platform || "").toLowerCase().includes(q);
        const matchTags = (p.tags ?? []).some((t) => t.toLowerCase().includes(q));
        const matchQuest = p.questNo ? p.questNo.toLowerCase().includes(q) : false;
        if (!matchTitle && !matchPlatform && !matchTags && !matchQuest) return false;
      }

      // 2. Status Filter (Synchronized between activeTab and selectedStatus)
      const statusType = getProblemStatusType(p);
      if (selectedStatus !== "ALL") {
        if (selectedStatus === "DUE_TODAY" && statusType !== "due_today") return false;
        if (selectedStatus === "OVERDUE" && statusType !== "overdue") return false;
        if (selectedStatus === "MASTERED" && statusType !== "stable") return false;
        if (selectedStatus === "UPCOMING" && statusType !== "upcoming" && statusType !== "due_soon") return false;
      }

      // 3. Platform Dropdown Filter
      if (selectedPlatform !== "ALL" && p.platform?.toUpperCase() !== selectedPlatform) {
        return false;
      }

      // 4. Difficulty Dropdown Filter
      if (selectedDifficulty !== "ALL" && p.difficulty?.toUpperCase() !== selectedDifficulty) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "NEWEST") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "OLDEST") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "TITLE") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "REVISIONS_DESC") {
        return (b.revisionCount || 0) - (a.revisionCount || 0);
      }
      if (sortBy === "REVISIONS_ASC") {
        return (a.revisionCount || 0) - (b.revisionCount || 0);
      }
      return 0;
    });
  }, [problems, search, activeTab, selectedPlatform, selectedDifficulty, selectedStatus, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeTab, selectedPlatform, selectedDifficulty, selectedStatus, sortBy]);

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / ITEMS_PER_PAGE));
  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProblems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProblems, currentPage]);

  const handleProblemAdded = (newProblem: any) => {
    setProblems((prev) => [newProblem, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleProblemUpdated = (updatedProblem: any) => {
    setProblems((prev) => prev.map((p) => (p.id === updatedProblem.id ? updatedProblem : p)));
    setEditingProblem(null);
  };

  const handleDeleteProblem = async (problemToDelete: ProblemWithLogs) => {
    if (!confirm(`Are you sure you want to delete "${problemToDelete.title}"?`)) return;
    try {
      const res = await fetch(`/api/problems/${problemToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setProblems((prev) => prev.filter((p) => p.id !== problemToDelete.id));
      }
    } catch (err) {
      console.error("Failed to delete problem:", err);
    }
  };

  // Synchronize Tab and Status Dropdown
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === "all") setSelectedStatus("ALL");
    else if (tab === "due_today") setSelectedStatus("DUE_TODAY");
    else if (tab === "overdue") setSelectedStatus("OVERDUE");
    else if (tab === "mastered") setSelectedStatus("MASTERED");
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    if (status === "ALL") setActiveTab("all");
    else if (status === "DUE_TODAY") setActiveTab("due_today");
    else if (status === "OVERDUE") setActiveTab("overdue");
    else if (status === "MASTERED") setActiveTab("mastered");
    else setActiveTab("all"); // For "UPCOMING", reset top tab highlight to avoid conflicting states
  };

  const handleResetFilters = () => {
    setSearch("");
    setActiveTab("all");
    setSelectedPlatform("ALL");
    setSelectedDifficulty("ALL");
    setSelectedStatus("ALL");
  };

  const hasActiveFilters = Boolean(
    search.trim() ||
    selectedPlatform !== "ALL" ||
    selectedDifficulty !== "ALL" ||
    selectedStatus !== "ALL" ||
    activeTab !== "all"
  );

  return (
    <div className="min-h-screen bg-[#07090C] text-zinc-100 font-sans selection:bg-[#a6e795]/20 selection:text-[#a6e795]">
      {/* Main Content Area */}
      <main className="px-4 sm:px-10 py-6 sm:py-10 pb-32 max-w-7xl mx-auto w-full">
        {/* PAGE HERO: Title, Subtitle, & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Problems
            </h1>
            <p className="text-xs sm:text-sm font-medium text-zinc-300 mt-1">
              Your problem library.
            </p>
            <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5">
              Every problem you solve becomes another trace in memory.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-[#a6e795] hover:bg-[#93d382] text-zinc-950 font-bold text-xs shadow-[0_0_20px_rgba(166,231,149,0.25)] hover:shadow-[0_0_25px_rgba(166,231,149,0.35)] transition-all cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Plus size={16} weight="bold" />
            <span>Add Problem</span>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════
              FILTER & SEARCH TOOLBAR (Matches Screenshot)
          ═══════════════════════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2 pb-4">
          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <MagnifyingGlass
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0d1015] border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 transition-all"
            />
          </div>

          {/* Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Platform Dropdown */}
            <div className="relative flex-1 sm:flex-none min-w-[100px]">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full appearance-none bg-[#0d1015] border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-lg px-3 py-2 pr-7 text-xs focus:outline-none cursor-pointer transition-colors"
              >
                <option value="ALL">Platform</option>
                <option value="LEETCODE">LeetCode</option>
                <option value="GFG">GFG</option>
                <option value="CODEFORCES">Codeforces</option>
                <option value="CODECHEF">CodeChef</option>
                <option value="HACKERRANK">HackerRank</option>
                <option value="OTHERS">Other</option>
              </select>
              <CaretDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            </div>

            {/* Difficulty Dropdown */}
            <div className="relative flex-1 sm:flex-none min-w-[95px]">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full appearance-none bg-[#0d1015] border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-lg px-3 py-2 pr-7 text-xs focus:outline-none cursor-pointer transition-colors"
              >
                <option value="ALL">Difficulty</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
              <CaretDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            </div>

            {/* Status Dropdown */}
            <div className="relative flex-1 sm:flex-none min-w-[90px]">
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full appearance-none bg-[#0d1015] border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-lg px-3 py-2 pr-7 text-xs focus:outline-none cursor-pointer transition-colors"
              >
                <option value="ALL">Status</option>
                <option value="DUE_TODAY">Due Today</option>
                <option value="OVERDUE">Overdue</option>
                <option value="MASTERED">Stable Memory</option>
                <option value="UPCOMING">Upcoming</option>
              </select>
              <CaretDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            </div>

            {/* Sort by Dropdown */}
            <div className="relative flex-1 sm:flex-none min-w-[125px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-[#0d1015] border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-lg px-3 py-2 pr-7 text-xs focus:outline-none cursor-pointer transition-colors"
              >
                <option value="NEWEST">Sort by: Newest</option>
                <option value="OLDEST">Sort by: Oldest</option>
                <option value="TITLE">Sort by: Title</option>
                <option value="REVISIONS_DESC">Sort by: Most Revisions</option>
                <option value="REVISIONS_ASC">Sort by: Least Revisions</option>
              </select>
              <CaretDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            </div>

            {/* Reset filters button matching dropdown styling */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 bg-[#0d1015] border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 rounded-lg px-3 py-2 text-xs transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <ArrowsCounterClockwise size={13} className="text-zinc-400" />
                <span>Reset filters</span>
              </button>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
              STATUS TABS BAR (All, Due Today, Overdue, Mastered)
          ═══════════════════════════════════════════════════════════ */}
        <div className="border-b border-zinc-850 flex items-center gap-4 sm:gap-6 mt-1 mb-6 text-xs overflow-x-auto whitespace-nowrap pb-px">
          <button
            onClick={() => handleTabChange("all")}
            className={`pb-3 font-medium transition-all relative ${activeTab === "all"
              ? "text-[#a6e795] font-semibold"
              : "text-zinc-400 hover:text-zinc-200"
              }`}
          >
            <span>All ({tabCounts.all})</span>
            {activeTab === "all" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#a6e795] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleTabChange("due_today")}
            className={`pb-3 font-medium transition-all relative ${activeTab === "due_today"
              ? "text-[#a6e795] font-semibold"
              : "text-zinc-400 hover:text-zinc-200"
              }`}
          >
            <span>Due Today ({tabCounts.dueToday})</span>
            {activeTab === "due_today" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#a6e795] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleTabChange("overdue")}
            className={`pb-3 font-medium transition-all relative ${activeTab === "overdue"
              ? "text-[#a6e795] font-semibold"
              : "text-zinc-400 hover:text-zinc-200"
              }`}
          >
            <span>Overdue ({tabCounts.overdue})</span>
            {activeTab === "overdue" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#a6e795] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleTabChange("mastered")}
            className={`pb-3 font-medium transition-all relative ${activeTab === "mastered"
              ? "text-[#a6e795] font-semibold"
              : "text-zinc-400 hover:text-zinc-200"
              }`}
          >
            <span>Mastered ({tabCounts.mastered})</span>
            {activeTab === "mastered" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#a6e795] rounded-full" />
            )}
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════
              PROBLEM CARDS GRID (3 Columns)
          ═══════════════════════════════════════════════════════════ */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-500 gap-3">
            <CircleNotch size={32} className="animate-spin text-[#a6e795]" />
            <p className="text-xs">Loading problem library...</p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-zinc-800 rounded-2xl bg-[#0c0e13]/50">
            <Faders size={40} className="text-zinc-600 mb-3" />
            <h3 className="text-base font-semibold text-zinc-200">No problems found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-5">
              {problems.length === 0
                ? "Your library is empty. Add your first algorithm to begin your spaced repetition journey."
                : "No problems match your current search and filter combination."}
            </p>
            {problems.length === 0 ? (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#a6e795] hover:bg-[#93d382] text-zinc-950 font-bold text-xs shadow-md transition-all"
              >
                <Plus size={15} weight="bold" />
                <span>Add First Problem</span>
              </button>
            ) : (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-xs text-zinc-300 transition-colors"
              >
                <ArrowsCounterClockwise size={13} className="text-zinc-400" />
                <span>Reset filters</span>
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedProblems.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  onEdit={(p) => setEditingProblem(p)}
                  onDelete={handleDeleteProblem}
                />
              ))}
            </div>

            {/* ═══════════════════════════════════════════════════════════
                  PAGINATION FOOTER (Matches Screenshot)
              ═══════════════════════════════════════════════════════════ */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-900 text-xs text-zinc-400">
              <div>
                Showing{" "}
                <span className="text-zinc-200 font-mono">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredProblems.length)}
                </span>{" "}
                of <span className="text-zinc-200 font-mono">{filteredProblems.length}</span> problems
              </div>

              {/* Pagination Number Controls */}
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded border border-zinc-800 bg-[#0d1015] hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  <CaretLeft size={14} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    if (totalPages <= 7) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (Math.abs(page - currentPage) <= 1) return true;
                    return false;
                  })
                  .map((page, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev && page - prev > 1;

                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && (
                          <span className="px-1 text-zinc-600 font-mono">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded text-xs font-mono transition-all flex items-center justify-center ${currentPage === page
                            ? "border border-[#a6e795] bg-[#a6e795]/15 text-[#a6e795] font-semibold shadow-[0_0_10px_rgba(166,231,149,0.15)]"
                            : "border border-zinc-800 bg-[#0d1015] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                            }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="w-8 h-8 rounded border border-zinc-800 bg-[#0d1015] hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  <CaretRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* ═══════════════════════════════════════════════════════════
          MODALS
      ═══════════════════════════════════════════════════════════ */}
      <AddProblemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleProblemAdded}
      />

      {editingProblem && (
        <EditProblemModal
          isOpen={!!editingProblem}
          onClose={() => setEditingProblem(null)}
          problem={{
            id: editingProblem.id,
            title: editingProblem.title,
            questNo: editingProblem.questNo,
            platform: editingProblem.platform as any,
            difficulty: editingProblem.difficulty as any,
            url: editingProblem.url,
            tags: editingProblem.tags,
          }}
          onSuccess={handleProblemUpdated}
        />
      )}
    </div>
  );
}

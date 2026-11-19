"use client";

import { SheetSection } from "@/data/sheets";
import { CaretRight } from "@phosphor-icons/react";
import { useState } from "react";
import CheckBox from "./CheckBox";

export default function SheetProblem({
  section,
  checkedProbs,
  handleCheck,
}: {
  section: SheetSection;
  checkedProbs: string[];
  handleCheck: (id: string) => void;
}) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const total = section.problems.length;
  const solvedCount = checkedProbs.filter((id) =>
    section.problems.map((p) => p.id).includes(id)
  );
  const percentage = total > 0 ? (solvedCount.length / total) * 100 : 0;

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#0F0F12] rounded-xl border border-zinc-800/80 overflow-hidden mb-2.5 shadow-sm transition-all">
      <div key={section.topic}>
        {/* Topic Header Accordion - Pure Charcoal/Grey-Black */}
        <div
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center justify-between px-4 py-3 bg-[#18181C] hover:bg-[#222226] cursor-pointer transition-all select-none ${
            collapsed ? "border-b border-zinc-800/70" : "border-b border-transparent"
          }`}
        >
          {/* Left: Chevron + Topic Title */}
          <h2 className="text-sm sm:text-base font-semibold text-zinc-100 flex items-center gap-2.5">
            <span className="text-xs text-zinc-400 flex items-center">
              <CaretRight
                size={14}
                weight="bold"
                className={`text-zinc-400 transition-transform duration-300 ease-in-out ${
                  collapsed ? "rotate-90 text-white" : "rotate-0"
                }`}
              />
            </span>
            {section.topic}
          </h2>

          {/* Right: Mini Progress Bar + Solved Count */}
          <div className="flex items-center gap-3">
            <div className="w-20 sm:w-28 h-1.5 rounded-full bg-zinc-800 overflow-hidden hidden sm:block">
              <div
                className="h-full bg-[#a6e795] transition-all duration-300 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs font-mono text-zinc-300 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/50 min-w-[38px] text-center">
              {solvedCount.length}/{total}
            </span>
          </div>
        </div>

        {/* Problems List with Smooth Height & Opacity Transition */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            collapsed
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0 pointer-events-none"
          }`}
        >
          <div className="overflow-hidden">
            <div className="p-2 space-y-1">
              {section.problems.map((p) => {
                const isChecked = checkedProbs.includes(p.id);

                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors group"
                  >
                    {/* Left: Checkbox + Title */}
                    <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                      <CheckBox
                        handleCheck={() => handleCheck(p.id)}
                        isChecked={isChecked}
                      />
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm truncate transition-colors ${
                          isChecked
                            ? "line-through text-zinc-500"
                            : "text-zinc-200 group-hover:text-white"
                        }`}
                      >
                        {p.title}
                      </a>
                    </div>

                    {/* Right: Difficulty Badge + Platform Icon */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${
                          p.difficulty === "EASY"
                            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                            : p.difficulty === "MEDIUM"
                            ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                            : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                        }`}
                      >
                        {p.difficulty}
                      </span>

                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Open in ${p.platform}`}
                        className="p-0.5 hover:scale-110 transition-transform"
                      >
                        <img
                          src={`/${p.platform}.svg`}
                          alt={p.platform}
                          className="w-4.5 h-4.5 object-contain"
                        />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

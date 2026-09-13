"use client"

import { Note, Problem } from "@/prisma/generated/client/client";
import { useRouter } from "next/navigation";
import { CircleNotch, CheckCircle, House, Archive } from "@phosphor-icons/react";
import ReviewSession from "./reviews/ReviewSession";

type ProblemWithNote = Problem & {
    note?: Note | null;
};

export default function ReviewClient({ problems }: { problems: ProblemWithNote[] }) {

    const router = useRouter();
    if (problems.length === 0) {
        return (
            <div className="min-h-screen bg-[#07090C] text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md w-full rounded-2xl border border-zinc-800/80 bg-[#0d1015]/90 p-8 shadow-2xl backdrop-blur-md flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#a6e795]/10 border border-[#a6e795]/30 flex items-center justify-center text-[#a6e795] shadow-[0_0_25px_rgba(166,231,149,0.2)] mb-4">
                        <CheckCircle size={28} weight="duotone" />
                    </div>
                    <h2 className="text-xl font-bold text-white">All Caught Up!</h2>
                    <p className="text-xs text-zinc-400 mt-2 mb-6 leading-relaxed">
                        No problems are due for review right now. Your spaced repetition queue is clear for today.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                        <button
                            onClick={() => router.push("/problems")}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#a6e795] hover:bg-[#93d382] text-zinc-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                        >
                            <Archive size={16} weight="bold" />
                            <span>Problem Library</span>
                        </button>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-850 text-zinc-300 font-semibold text-xs transition-all cursor-pointer"
                        >
                            <House size={16} />
                            <span>Dashboard</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#07090C] text-zinc-100">
            <ReviewSession problems={problems} />
        </div>
    );
}
"use client";

import {
  ArrowRightIcon,
  BookOpenIcon,
  BrainIcon,
  CircleIcon,
  NotebookIcon,
  SealCheckIcon,
} from "@phosphor-icons/react";
import IconCircle from "./IconCircle";

export default function HeroSection() {
  return (
    <main>
      <div className="flex justify-center min-h-[calc(70vh-72px)] w-full">
        {/* To be made */}
        <div className="text-4xl text-white flex justify-center items-center w-[45%]">
          Wave Particle
        </div>
        <div className="text-[#8dca7d] flex flex-col w-[55%]">
          {/* Content */}
          <div className="mt-10">
            <span className="tracking-[0.25em]">CONSISTENCY&gt;MOTIVATION</span>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <h3 className="text-5xl text-white">Small steps.</h3>
            <h3 className="text-5xl text-white">
              Compound <span className="text-[#92d382] text-5xl">mastery.</span>
            </h3>
          </div>
          <div className="mt-6">
            <p className="text-[#A8A8B0] text-sm">
              Trace helps you remember, revisit,
              <br />
              and master what truly matters.
            </p>
          </div>
          <div className="mt-6">
            <button className="text-black text-xs bg-[#a6e795] px-4 py-2 rounded-lg w-36 flex items-center justify-between">
              Start Training{" "}
              <span>
                <ArrowRightIcon size={16} />
              </span>
            </button>
          </div>
          <div className="mt-6">
            <p className="text-[#A8A8B0] text-sm">
              Built for <span className="text-[#80bc65]">developers.</span>{" "}
              Backed by <span className="text-[#80bc65]">science.</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-14 mt-4">
        <div className="flex flex-col items-center justify-center p-4">
          <IconCircle>
            <BookOpenIcon size={28} weight="light" />
          </IconCircle>
          <h3 className="text-white text-sm mt-2">1.Learn</h3>
          <div className="flex flex-col justify-center items-center mt-1">
            <p className="text-[#A8A8B0] text-xs">Solve Problems and</p>
            <p className="text-[#A8A8B0] text-xs">Add notes that matter.</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <IconCircle>
            <NotebookIcon size={28} weight="light" />
          </IconCircle>
          <h3 className="text-white text-sm mt-2">2.Review</h3>
          <div className="flex flex-col justify-center items-center mt-1">
            <p className="text-[#A8A8B0] text-xs">We remind you at the</p>
            <p className="text-[#A8A8B0] text-xs">perfect time.</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <IconCircle>
            <BrainIcon size={28} weight="light" />
          </IconCircle>
          <h3 className="text-white text-sm mt-2">3.Recall</h3>
          <div className="flex flex-col justify-center items-center mt-1">
            <p className="text-[#A8A8B0] text-xs">Active recall strengthens</p>
            <p className="text-[#A8A8B0] text-xs">your understanding.</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <IconCircle>
            <SealCheckIcon size={28} weight="light" />
          </IconCircle>
          <h3 className="text-white text-sm mt-2">4.Master</h3>
          <div className="flex flex-col justify-center items-center mt-1">
            <p className="text-[#A8A8B0] text-xs">Knowledge you build</p>
            <p className="text-[#A8A8B0] text-xs">today, stays forever</p>
          </div>
        </div>
      </div>
    </main>
  );
}

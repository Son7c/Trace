"use client";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <main>
      <div className="flex justify-center min-h-[calc(100vh-72px)] w-full">
        {/* To be made */}
        <div className="text-4xl text-white flex justify-center items-center w-[40%]">
          Wave Particle
        </div>
        <div className="text-[#8dca7d] flex flex-col w-[60%]">
          {/* Content */}
          <div className="mt-20">
            <span className="tracking-[0.25em]">CONSISTENCY&gt;MOTIVATION</span>
          </div>
          <div className="mt-8 flex flex-col gap-2">
            <h3 className="text-5xl text-white">Small steps.</h3>
            <h3 className="text-5xl text-white">
              Compound <span className="text-[#92d382] text-5xl">mastery.</span>
            </h3>
          </div>
          <div className="mt-8">
            <p className="text-[#A8A8B0] text-lg">
              Trace helps you remember, revisit,
              <br />
              and master what truly matters.
            </p>
          </div>
          <div className="mt-8">
            <button className="text-black text-sm bg-[#a6e795] px-4 py-2 rounded-lg w-42 flex items-center justify-between">
              Start Training{" "}
              <span className="ml-">
                <ArrowRight size={16} />
              </span>
            </button>
          </div>
          <div className="mt-8">
            <p className="text-[#A8A8B0] text-lg">
              Built for developers. Backed by science.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useRouter } from "next/navigation";
import SpecularButton from "@/components/Spectacular-btn/SpecularButton";
import { handleLogin } from "@/utils/handleLogin";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#030407] pt-20 pb-12 px-6 lg:px-8 font-sans">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#99E372]/5 rounded-full blur-[180px] pointer-events-none" />

      {/* FINAL PRE-FOOTER CTA */}
      <div className="relative z-10 max-w-4xl mx-auto rounded-2xl border border-white/[0.08] bg-[#07090E] p-8 sm:p-14 backdrop-blur-2xl mb-24 shadow-2xl text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white leading-tight">
            Your next breakthrough is probably something you&apos;ve already solved.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-normal">
            Trace makes sure you remember it.
          </p>
        </div>

        <div className="flex justify-center pt-2">
          <SpecularButton
            size="md"
            radius={14}
            tint="#ffffff"
            tintOpacity={0}
            blur={0}
            textColor="#ffffff"
            lineColor="#ffffff"
            baseColor="#99E372"
            intensity={1}
            shineSize={12}
            shineFade={40}
            thickness={1}
            speed={0.35}
            followMouse
            proximity={250}
            onClick={() => handleLogin(router)}
          >
            Start Training &rarr;
          </SpecularButton>
        </div>
      </div>

      {/* PRODUCT FOOTER */}
      <div className="relative z-10 max-w-6xl mx-auto space-y-16">
        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs font-mono">
          {/* Brand Column */}
          <div className="col-span-2 space-y-3">
            <span className="text-lg font-bold tracking-tight text-white block">
              TRACE
            </span>
            <p className="text-zinc-400 font-sans text-xs max-w-xs leading-relaxed">
              Remember what you solve.
            </p>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-3">
            <span className="text-white font-semibold uppercase text-[11px] tracking-wider block">
              Product
            </span>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-white transition-colors">
                  Review
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-white transition-colors">
                  Progress
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-3">
            <span className="text-white font-semibold uppercase text-[11px] tracking-wider block">
              Resources
            </span>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <a href="/login" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-white transition-colors">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Legal */}
          <div className="space-y-3">
            <span className="text-white font-semibold uppercase text-[11px] tracking-wider block">
              Company
            </span>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <a href="/login" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-zinc-300 transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-zinc-300 transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>&copy; 2026 Trace</div>
          <div className="text-zinc-400">
            Built for engineers who want to remember, not just solve.
          </div>
        </div>
      </div>
    </footer>
  );
}

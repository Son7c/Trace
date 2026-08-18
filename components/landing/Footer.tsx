"use client";

import { GithubLogo, TwitterLogo, ArrowUpRight } from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.08] bg-[#030407] pt-20 pb-12 px-6 lg:px-8 font-sans overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto space-y-20">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-xs">
          {/* Brand Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Brand Name */}
            <div>
              <span className="text-xl font-bold tracking-tight text-white block">
                TRACE
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">
                Memory Engine
              </span>
            </div>

            {/* Tagline */}
            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed font-normal">
              An active recall engine built for software engineers to retain
              algorithm patterns permanently, not just solve problems once.
            </p>

            {/* System Status Pill & Social Links */}
            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
                >
                  <GithubLogo className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
                >
                  <TwitterLogo className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Links Grid (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 font-mono">
            {/* Column 1: Product */}
            <div className="space-y-4">
              <span className="text-white font-semibold uppercase text-[11px] tracking-wider block">
                Product
              </span>
              <ul className="space-y-2.5 text-zinc-400">
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>How it Works</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>Features</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#problem-hook"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>Problem Hook</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#why-trace"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>System Comparison</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div className="space-y-4">
              <span className="text-white font-semibold uppercase text-[11px] tracking-wider block">
                Resources
              </span>
              <ul className="space-y-2.5 text-zinc-400">
                <li>
                  <a
                    href="/login"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>Documentation</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </a>
                </li>
                <li>
                  <a
                    href="/login"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>SM-2 Specification</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/login"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>Changelog</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Company & Legal */}
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <span className="text-white font-semibold uppercase text-[11px] tracking-wider block">
                Company
              </span>
              <ul className="space-y-2.5 text-zinc-400">
                <li>
                  <a
                    href="/login"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/login"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/login"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/login"
                    className="hover:text-white transition-colors"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>&copy; 2026 TRACE INC. ALL RIGHTS RESERVED.</div>
          <div className="text-zinc-400">
            Built for engineers who want to remember, not just solve.
          </div>
        </div>
      </div>
    </footer>
  );
}

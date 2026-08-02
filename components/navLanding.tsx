"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NavLanding() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  const handleLogin = () => {
    setLeaving(true);

    setTimeout(() => {
      router.push("/login");
    }, 300);
  };
  return (
    <nav
      className="
    fixed top-3 left-1/2 -translate-x-1/2
    z-50
    flex h-14 w-[60vw] max-w-7xl
    items-center justify-between
    rounded-full
    border border-white/8
    bg-[#0B0F14]/45
    px-8 lg:px-10
    backdrop-blur-2xl
    shadow-[0_8px_40px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.04)]
    transition-all duration-300
  "
    >
      <div className="text-white text-3xl font-bold tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] select-none">Trace</div>
      <div className="flex items-center">
        <a href="#product" className="text-white text-md drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:text-[#a6e795]">
          Product
        </a>
        <a href="#how-it-works" className="text-white text-md ml-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:text-[#a6e795]">
          How it works
        </a>
        <a href="#features" className="text-white text-md ml-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:text-[#a6e795]">
          Features
        </a>
        <a href="#pricing" className="text-white text-md ml-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:text-[#a6e795]">
          Pricing
        </a>
        <a href="#about" className="text-white text-md ml-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:text-[#a6e795]">
          About
        </a>
      </div>

      <div className="text-white text-md">
        <button
          className="text-white text-md hover:cursor-pointer drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:text-[#a6e795]"
          onClick={() => handleLogin()}
        >
          Log in
        </button>
      </div>
    </nav>
  );
}

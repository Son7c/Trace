"use client";

import ColorBends from "@/components/ColorBends/ColorBends";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-[#020507]">
      {/* Background */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        <ColorBends
          rotation={90}
          speed={0.2}
          colors={["#A6E795"]} // Adding complementary gradient tones works best
          transparent={true} // Set to true so background blends cleanly
          autoRotate={0}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={0.5}
          noise={0.15}
          iterations={1}
          intensity={1.5}
          bandWidth={16}
          className="w-full h-full"
        />
      </div>

      {/* Login Form */}
      <div className="relative z-10 flex min-h-svh items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#070a0b]/70 p-6 backdrop-blur-[8px] text-white transition-all ease-out duration-200 hover:border-[#2F3135] hover:shadow-[0_0_20px_rgba(46,125,90,0.12)] hover:-translate-y-0.5">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

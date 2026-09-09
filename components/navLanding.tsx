"use client";

import { useRouter } from "next/navigation";
import SpecularButton from "./Spectacular-btn/SpecularButton";
import { handleLogin } from "@/utils/handleLogin";
import { authClient } from "@/lib/auth-client";

export default function NavLanding() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const firstName = session?.user?.name
    ? session.user.name.trim().split(" ")[0]
    : session?.user?.email
      ? session.user.email.split("@")[0]
      : null;

  return (
    <nav
      className="
    fixed top-3 left-1/2 -translate-x-1/2
    z-50
    flex h-14 w-[95vw] sm:w-[85vw] md:w-[75vw] lg:w-[60vw] max-w-7xl
    items-center justify-between
    rounded-full
    border border-white/8
    bg-[#0B0F14]/65
    px-4 sm:px-8 lg:px-10
    backdrop-blur-2xl
    shadow-[0_8px_40px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.04)]
    transition-all duration-300
  "
    >
      <div className="text-white text-xl sm:text-2xl md:text-3xl font-bold tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] select-none">
        <a href="#">Trace</a>
      </div>
      <div className="hidden sm:flex items-center">
        <a
          href="#how-it-works"
          className="text-white text-sm md:text-base ml-4 md:ml-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:text-[#a6e795]"
        >
          How it works
        </a>
        <a
          href="#why-trace"
          className="text-white text-sm md:text-base ml-4 md:ml-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:text-[#a6e795]"
        >
          Why Trace?
        </a>
        <a
          href="#features"
          className="text-white text-sm md:text-base ml-4 md:ml-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:text-[#a6e795]"
        >
          Features
        </a>
      </div>

      <div className="text-white text-sm md:text-lg flex items-center gap-2 sm:gap-3">
        {session?.user ? (
          <>
            {firstName && (
              <span className="hidden md:inline text-xs sm:text-sm text-zinc-300 font-medium">
                Yo, <span className="text-[#a6e795] font-semibold">{firstName}</span>
              </span>
            )}
            <SpecularButton
              size="sm"
              radius={18}
              tint="#ffffff"
              tintOpacity={0}
              blur={0}
              textColor="#f5f5f5"
              lineColor="#ffffff"
              baseColor="#525252"
              intensity={1}
              shineSize={10}
              shineFade={40}
              thickness={1}
              speed={0.35}
              followMouse
              proximity={250}
              autoAnimate={false}
              onClick={() => router.push("/dashboard")}
            >
              Get Started
            </SpecularButton>
          </>
        ) : (
          <SpecularButton
            size="sm"
            radius={18}
            tint="#ffffff"
            tintOpacity={0}
            blur={0}
            textColor="#f5f5f5"
            lineColor="#ffffff"
            baseColor="#525252"
            intensity={1}
            shineSize={10}
            shineFade={40}
            thickness={1}
            speed={0.35}
            followMouse
            proximity={250}
            autoAnimate={false}
            onClick={() => handleLogin(router)}
          >
            Sign in
          </SpecularButton>
        )}
      </div>
    </nav>
  );
}

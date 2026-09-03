import React from "react";
import Image from "next/image";
import { Platform } from "@/prisma/generated/client/enums";
import { Code } from "@phosphor-icons/react/dist/ssr";

type PlatformLogoProps = {
  platform: Platform | string;
  size?: number;
  className?: string;
};

const LOGO_MAP: Record<string, string> = {
  LEETCODE: "/logos/leetcode.png",
  CODEFORCES: "/logos/codeforces.png",
  GFG: "/logos/gfg.png",
  HACKERRANK: "/logos/hackerrank.png",
  CODECHEF: "/logos/codeechef.png",
  ATCODER: "/logos/atcoder.png",
};

export default function PlatformLogo({
  platform,
  size = 16,
  className = "",
}: PlatformLogoProps) {
  const normalizedKey = (platform || "").toUpperCase().trim();
  const logoSrc = LOGO_MAP[normalizedKey];

  if (!logoSrc) {
    return <Code size={size} className={`text-zinc-400 shrink-0 ${className}`} />;
  }

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={logoSrc}
        alt={`${platform} logo`}
        width={size}
        height={size}
        className="w-full h-full object-contain"
        priority
      />
    </span>
  );
}

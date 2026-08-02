import { ReactNode } from "react";
import GlowNode from "./GlowNode";

type Props = {
  children: ReactNode;
};

export default function IconCircle({ children }: Props) {
  return (
    <div className="relative">
      {/* Left Dot */}
      <div className="absolute w-full right-1/2 top-1/2">
        <GlowNode />
      </div>
      <div className="relative z-10 w-12 h-12 border-[1.4px] border-[#93d872] rounded-full flex justify-center items-center text-[#93d872] bg-[#0e100f] shadow-[0_0_12px_rgba(147,216,114,0.25)] transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(147,216,114,0.6)]">
        {children}
      </div>
      {/* Right Dot */}
      <div className="absolute w-full left-1/2 top-1/2">
        <GlowNode />
      </div>
    </div>
  );
}

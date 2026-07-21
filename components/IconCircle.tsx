"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function IconCircle({ children }: Props) {
  return (
    <div className="w-12 h-12 border-[1.4px] border-[#93d872] rounded-full flex justify-center items-center text-[#93d872]">
      {children}
    </div>
  );
}

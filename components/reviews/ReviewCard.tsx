"use client";

import { Problem } from "@/prisma/generated/client/client";
import { useRouter } from "next/navigation";

type Props = {
  problem: Problem;
};

export default function ReviewCard({ problem }: Props) {
  const router=useRouter();
  return (
    <div>
      <p>{problem.title}</p>
    </div>
  );
}
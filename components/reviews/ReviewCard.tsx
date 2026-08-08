"use client";

import { Problem } from "@/prisma/generated/client/client";

type Props = {
  problem: Problem;
};

export default function ReviewCard({ problem }: Props) {
  return (
    <div>
      <p>{problem.title}</p>
    </div>
  );
}

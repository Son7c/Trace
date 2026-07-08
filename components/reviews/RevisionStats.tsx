"use client";
import { Problem } from "@/prisma/generated/client/client";

type Props = {
  problem: Problem;
};

export default function RevisionStats({ problem }: Props) {
  return (
    <div>
      <p>Reviews: {problem.revisionCount}</p>
      <p>Ease Factor: {problem.easeFactor}</p>
      <p>Next Review: {problem.nextRevisionDate.toString()}</p>
    </div>
  );
}

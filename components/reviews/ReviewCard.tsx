"use client";

import { Problem } from "@/prisma/generated/client/client";

type Props = {
  review: Problem;
};

export default function ReviewCard({ review }: Props) {
  return (
    <div>
      <p>{review.title}</p>
    </div>
  );
}

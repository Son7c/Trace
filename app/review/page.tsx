"use client";

import ReviewSession from "@/components/reviews/ReviewSession";
import type { Problem } from "@/prisma/generated/client/client";
import { useState, useEffect } from "react";

export default function Review() {
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("/api/problems/reviews");
        if (response.ok) {
          const data = await response.json();
          setProblems(data);
        }
      } catch (err) {
        console.error("Failed to load review problems:", err);
      }
    };
    fetchProblems();
  }, []);

  return (
    <div className="pb-32 min-h-screen">
      <ReviewSession problems={problems} />
    </div>
  );
}

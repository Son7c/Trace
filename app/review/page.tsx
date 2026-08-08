"use client";

import ReviewSession from "@/components/reviews/ReviewSession";
import { Problem } from "@/prisma/generated/client/client";
import { useState, useEffect } from "react";

export default function Review() {
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    const fetchProblems = async () => {
      const response = await fetch("/api/problems/reviews");
      const data = await response.json();
      setProblems(data);
    };
    fetchProblems();
  }, []);
  return <div>
    <ReviewSession problems={problems}/>
  </div>;
}

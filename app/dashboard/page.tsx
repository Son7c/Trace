"use client";

import ReviewCard from "@/components/reviews/ReviewCard";
import { authClient } from "@/lib/auth-client";
import { Problem } from "@/prisma/generated/client/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session, error, isPending } = authClient.useSession();
  const router = useRouter();
  const [problems, setProblems] = useState<any[]>([]);
  const [reviews, setReviews] = useState<[]>([]);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  useEffect(() => {
    const fetchProblems = async () => {
      const response = await fetch("/api/problems");
      const data = await response.json();
      setProblems(data);
    };
    fetchProblems();

    const fetchReviews = async () => {
      const response = await fetch("/api/problems/reviews");
      const data = await response.json();
      setReviews(data);
    };
    fetchReviews();
  }, []);
  const reviewCount = problems.reduce((acc, cur) => {
    return acc + cur.revisionLogs.length;
  }, 0);
  return (
    <div>
      <div style={{ display: "flex", gap: "full" }}>
        <h1>Welcome {session?.user.name}</h1>
        <button type="button" onClick={handleLogout}>
          Log out
        </button>
      </div>
      <div>
        <h2>Due Today</h2>
        {reviews.length != 0
          ? reviews.map((r: Problem) => <ReviewCard review={r} key={r.id} />)
          : "No dues for today!!"}
      </div>
      <div style={{border:"2px solid black"}}>
        <p>No of total problems:{problems.length}</p>
        <p>No of reviews {reviewCount > 0 ? reviewCount : 0}</p>
      </div>
    </div>
  );
}

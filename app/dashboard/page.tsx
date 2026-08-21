"use client";

import Dock from "@/components/Dock";
import ReviewCard from "@/components/reviews/ReviewCard";
import { authClient } from "@/lib/auth-client";
import { Problem } from "@/prisma/generated/client/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  VscHome,
  VscPlay,
  VscAdd,
  VscArchive,
  VscAccount,
} from "react-icons/vsc";

type ProblemWithLogs = Problem & {
  revisionLogs: unknown[];
};

export default function Dashboard() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [problems, setProblems] = useState<ProblemWithLogs[]>([]);
  const [reviews, setReviews] = useState<Problem[]>([]);

  const items = [
    {
      icon: <VscHome size={20} />,
      label: "Dashboard",
      onClick: () => router.push("/dashboard"),
    },
    {
      icon: (
        <div className="relative flex items-center justify-center">
          <VscPlay size={20} />
          {reviews.length > 0 && (
            <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow">
              {reviews.length}
            </span>
          )}
        </div>
      ),
      label: reviews.length > 0 ? `Review (${reviews.length} due)` : "Start Review",
      onClick: () => router.push("/review"),
    },
    {
      icon: <VscAdd size={20} />,
      label: "Add Problem",
      onClick: () => router.push("/problems/new"),
    },
    {
      icon: <VscArchive size={20} />,
      label: "Problem Archive",
      onClick: () => router.push("/problems"),
    },
    {
      icon: <VscAccount size={20} />,
      label: "Profile",
      onClick: () => router.push("/profile"),
    },
  ];

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
    return acc + (cur.revisionLogs?.length || 0);
  }, 0);
  return (
    <div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <h1>Welcome {session?.user.name}</h1>
        <button type="button" onClick={handleLogout}>
          Log out
        </button>
      </div>
      <div>
        <h2>Due Today</h2>
        <div>
          {reviews.length !== 0
            ? reviews.map((p: Problem) => <ReviewCard problem={p} key={p.id} />)
            : "No dues for today!!"}
        </div>
        <div>
          <button onClick={() => router.push(`/review`)}>
            Start Review Session
          </button>
        </div>
      </div>
      <div style={{ border: "2px solid black" }}>
        <p>No of total problems:{problems.length}</p>
        <p>No of reviews {reviewCount > 0 ? reviewCount : 0}</p>
      </div>
      <Dock
        items={items}
        panelHeight={70}
        baseItemSize={50}
        magnification={70}
      />
    </div>
  );
}

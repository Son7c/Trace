"use client";

import { useRouter } from "next/navigation";

export default function ReviewCompleted() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold">
        🎉 Review Session Complete!
      </h1>

      <p className="mt-4">
        You reviewed all your due problems today.
      </p>

      <button
        className="mt-6"
        onClick={() => router.push("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
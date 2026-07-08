"use client";
import { Feedback } from "@/prisma/generated/client/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FormProps = {
  id: string | null;
};

export default function ReviewCard({ id }: FormProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<Feedback>("AGAIN");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleReview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/problems/${id}/revision`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userFeedback: feedback }),
      });
      if (!response.ok) {
        console.error("Coudn't publish revisionLog");
        return;
      }
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleReview}>
      <select
        name="feedback"
        id="feeedback"
        onChange={(e) => setFeedback(e.target.value as Feedback)}
      >
        <option value="AGAIN">Again</option>
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

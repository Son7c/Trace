"use client";

import { useState } from "react";
import Note from "@/components/notes/Note";
import { Feedback } from "@/prisma/generated/client/enums";
import ReviewCompleted from "./ReviewCompleted";

type ReviewSessionProps = {
  problems: any[];
};

export default function ReviewSession({ problems }: ReviewSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isReviewCompleted, setIsReviewCompleted] = useState(false);

  
  if (problems.length === 0) {
    return <h1 className="text-center text-xl">No problems due today.</h1>;
  }
  if (isReviewCompleted) {
    return <ReviewCompleted />;
  }
  const currentProblem = problems[currentIndex];
  
  const handleNext = () => {
    setCurrentIndex((prev) => {
      if (prev === problems.length - 1) return prev;
      return prev + 1;
    });
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) return 0;
      return prev - 1;
    });
  };

  const submitReview = async (feedback: Feedback) => {
    await fetch(`/api/problems/${currentProblem.id}/revision`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userFeedback: feedback }),
    });

    if (currentIndex === problems.length - 1) {
      setIsReviewCompleted(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setIsVisible(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        Problem {currentIndex + 1} / {problems.length}
      </h2>

      <div className="rounded-xl border p-6">
        <h1 className="text-3xl font-bold">{currentProblem.title}</h1>

        <p>{currentProblem.platform}</p>

        <p>{currentProblem.difficulty}</p>

        <button onClick={handlePrevious}>Previous</button>

        <button onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? "Collapse Notes" : "Reveal Notes"}
        </button>

        <button onClick={() => submitReview("AGAIN")}>Again</button>

        <button onClick={() => submitReview("HARD")}>Hard</button>

        <button onClick={() => submitReview("MEDIUM")}>Medium</button>

        <button onClick={() => submitReview("EASY")}>Easy</button>
      </div>

      <button className="mt-10" onClick={handleNext}>
        Next →
      </button>

      <div style={{ display: isVisible ? "" : "none" }}>
        <div>
          <Note note={currentProblem.note} />
        </div>
      </div>
    </div>
  );
}

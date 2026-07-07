import { Feedback, Problem } from "@/prisma/generated/client/client";

export function calculateSM2(problem: Problem, feedback: Feedback) {
  let Q: number;
  switch (feedback) {
    case Feedback.AGAIN:
      Q = 0;
      break;
    case Feedback.HARD:
      Q = 3;
      break;
    case Feedback.MEDIUM:
      Q = 4;
      break;
    case Feedback.EASY:
      Q = 5;
      break;
  }
  let ef = problem.easeFactor;
  let interval = problem.intervalDays;
  let n = problem.revisionCount;

  ef = ef + (0.1 - (5 - Q) * (0.08 + (5 - Q) * 0.02));
  if (ef < 1.3) ef = 1.3;
  if (Q >= 3) {
    if (n == 0) {
      interval = 1;
    } else if (n == 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ef);
    }
    n += 1;
  } else {
    n = 0;
    interval = 1;
  }
  const nextRevisionDate = new Date();
  nextRevisionDate.setDate(nextRevisionDate.getDate() + interval);
  return {
    easeFactor: ef,
    intervalDays: interval,
    revisionCount: n,
    nextRevisionDate,
  };
}

import prisma from "@/lib/prisma";
import {
  CreateProblemInput,
  CreateProblemSchema,
} from "@/lib/validators/problem";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const req = await request.json();
  const parsed = CreateProblemSchema.safeParse(req);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const {
    title,
    platform,
    difficulty,
    url,
    tags,
    questNo,
  }: CreateProblemInput = parsed.data;
  const h = await headers();
  const session = await auth.api.getSession({
    headers: h,
  });
  if (!session) {
    return Response.json(
      { message: "Unauthorized" },
      {
        status: 401,
      },
    );
  }
  const userId = session.user.id;

  const daily_limit = 25;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const count = await prisma.problem.count({
    where: {
      userId,
      createdAt: {
        gte: today,
      },
    },
  });

  if (daily_limit <= count) {
    return Response.json(
      {
        error: "Daily Limit reached",
        message: "You've added 25 problems today. Focus on reviewing.",
      },
      {
        status: 429,
      },
    );
  }

  const cleanUrl = url.trim().replace(/\/+$/, "");

  const existingProblem = await prisma.problem.findFirst({
    where: {
      userId,
      OR: [
        {
          OR: [
            {
              url: {
                equals: cleanUrl,
                mode: "insensitive",
              },
            },
            {
              url: {
                equals: url.trim(),
                mode: "insensitive",
              },
            },
          ],
        },
        questNo
          ? {
              platform,
              questNo,
            }
          : {
              platform,
              title: {
                equals: title,
                mode: "insensitive",
              },
            },
      ],
    },
  });

  if (existingProblem) {
    return Response.json(
      {
        error: "This problem is already in your library.",
      },
      {
        status: 409,
      },
    );
  }
  const res = await prisma.problem.create({
    data: {
      userId,
      title,
      questNo: questNo,
      platform,
      difficulty,
      url,
      tags,
    },
  });
  return Response.json(res, {
    status: 201,
  });
}
export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return Response.json(
      { message: "Unauthorized" },
      {
        status: 401,
      },
    );
  }
  const userId = session.user.id;
  const problems = await prisma.problem.findMany({
    where: { userId },
    include: {
      revisionLogs: true,
      note: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return Response.json(problems);
}

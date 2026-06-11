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
  const { title, platform, difficulty, url, tags }: CreateProblemInput =
    parsed.data;

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
  const res = await prisma.problem.create({
    data: {
      userId,
      title,
      platform,
      difficulty,
      url,
      tags,
    },
  });
  return Response.json(res,{
    status:201
  });
}
export async function GET(request: Request) {
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
    where:{userId}
  });
  return Response.json(problems);
}

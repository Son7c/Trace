import prisma from "@/lib/prisma";
import {
  CreateProblemInput,
  CreateProblemSchema,
} from "@/lib/validators/problem";

export async function POST(request: Request) {
  const req = await request.json();
  const parsed = CreateProblemSchema.safeParse(req);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const { userId, title, platform, difficulty, url, tags }: CreateProblemInput =
    parsed.data;
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
  return Response.json(res);
}
export async function GET(request: Request) {
  const problems = await prisma.problem.findMany();
  return Response.json(problems);
}

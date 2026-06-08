import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const req = await request.json();
  const { userId, title, platform, difficulty, url, tags } = req;
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

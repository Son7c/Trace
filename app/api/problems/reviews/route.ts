import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

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
  const userId = session.session.userId;

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const problems = await prisma.problem.findMany({
    where: {
      userId,
      nextRevisionDate: { lte: endOfDay },
    },
    include: {
      note: true,
    },
  });
  return Response.json(problems);
}

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
  endOfDay.setUTCHours(23, 59, 59, 999);

  const count = await prisma.problem.count({
    where: {
      userId,
      nextRevisionDate: { lte: endOfDay },
    },
  });
  return Response.json(count);
}

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ReviewClient from "@/components/ReviewClient";

export default async function Review() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const problems = await prisma.problem.findMany({
    where: {
      userId: session.user.id,
      nextRevisionDate: {
        lte: endOfDay,
      },
    },
    orderBy:{
      nextRevisionDate:"asc",
    },
    include: {
      note: true,
    },
  });

  return <ReviewClient problems={problems} />;
}


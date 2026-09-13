import { redirect } from "next/navigation";
import { headers } from "next/headers";

import DashboardClient from "@/components/DashboardClient"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";





export default async function Dashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const problems = await prisma.problem.findMany({
    where: { userId: session.user.id },
    include: { revisionLogs: true },
    orderBy: { createdAt: "desc" },
  });

  // 3. Hand data directly to your UI
  return <DashboardClient user={session.user} problems={problems} />
}

import ProfileClient from "@/components/ProfileClient";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const problems = await prisma.problem.findMany({
    where: { userId: session.user.id },
    include: { revisionLogs: true },
    orderBy: { createdAt: "desc" },
  });

  return <ProfileClient user={session.user} problems={problems} />
}

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SheetsOverview from "@/components/SheetsOverview";

export default async function SheetsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const progressList = await prisma.sheetProgress.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      sheetId: true,
      problemId: true,
    },
  });

  return <SheetsOverview progressList={progressList} />;
}

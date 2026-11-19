import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SheetClient from "@/components/SheetClient";

export default async function sheetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const { id } = await params;
  const userId = session.user.id;

  const sheetData = await prisma.sheetProgress.findUnique({
    where: {
      userId_sheetId: { userId, sheetId: id },
    },
  });

  const problems = sheetData?.problemId ?? [];

  return <SheetClient sheetId={id} problems={problems as string[]} />;
}

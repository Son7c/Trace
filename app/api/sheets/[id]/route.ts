import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/sheets/[id]">,
) {
  const { id } = await params;
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
  const sheetData = await prisma.sheetProgress.findUnique({
    where: {
      userId_sheetId: { userId, sheetId: id },
    },
  });
  return Response.json(sheetData ?? { sheetId: id, problemId: [] }, {
    status: 200,
  });
}

export async function PATCH(
  request: Request,
  { params }: RouteContext<"/api/sheets/[id]">,
) {
  const { id } = await params;
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
  const { problemId } = await request.json();
  if (!problemId) {
    return Response.json({ message: "problemId is required" }, { status: 400 });
  }
  const sheetProgress = await prisma.sheetProgress.findUnique({
    where: { userId_sheetId: { userId, sheetId: id } },
  });
  let problems = sheetProgress?.problemId;
  if (problems?.includes(problemId)) {
    problems = problems.filter((p) => p !== problemId);
  } else {
    problems = [...(problems ?? []), problemId];
  }

  const updatedSheetProgress = await prisma.sheetProgress.upsert({
    where: { userId_sheetId: { userId, sheetId: id } },
    update: {
      problemId: problems,
    },
    create: {
      sheetId: id,
      userId,
      problemId: problems,
    },
  });

  return Response.json(updatedSheetProgress, { status: 200 });
}

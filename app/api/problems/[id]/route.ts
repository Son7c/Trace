import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UpdateProblemSchema } from "@/lib/validators/problem";
import { headers } from "next/headers";

export async function GET(
  request: Request,
  { params }: RouteContext<"/api/problems/[id]">,
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
  const problem = await prisma.problem.findUnique({
    where: {
      id: id,
    },
  });
  if (!problem)
    return Response.json({ message: "Problem Not Found" }, { status: 404 });
  if (userId != problem.userId) {
    return Response.json(
      {
        message: "Forbidden",
      },
      { status: 403 },
    );
  }
  return Response.json(problem);
}

export async function PATCH(
  request: Request,
  { params }: RouteContext<"/api/problems/[id]">,
) {
  try {
    const { id } = await params;
    const req = await request.json();
    const parsed = UpdateProblemSchema.safeParse(req);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
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
    const problem = await prisma.problem.findUnique({
      where: { id },
    });
    if (!problem) {
      return Response.json({ message: "Problem not found" }, { status: 404 });
    }
    if (userId != problem.userId) {
      return Response.json(
        { message: "Forbidden" },
        {
          status: 403,
        },
      );
    }
    const res = await prisma.problem.update({
      where: { id },
      data: { ...parsed.data },
    });
    return Response.json(res, { status: 200 });
  } catch (err) {
    console.error(err);

    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext<"/api/problems/[id]">,
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return Response.json({
        message:"Unauthorized"
      }, {
        status: 401,
      });
    }
    const userId = session.user.id;
    const problem = await prisma.problem.findUnique({
      where: { id },
    });
    if (!problem) {
      return Response.json({ message: "Problem not found" }, { status: 404 });
    }
    if (userId != problem.userId) {
      return Response.json(
        { message: "Forbidden" },
        {
          status: 403,
        },
      );
    }
    console.time("delete");
    const res = await prisma.problem.delete({
      where: { id },
    });
    console.timeEnd("delete");
    return Response.json(
      { message: "Problem deleted successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);

    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

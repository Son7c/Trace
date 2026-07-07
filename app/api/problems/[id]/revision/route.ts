import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  CreateRevisionInput,
  CreateRevisionSchema,
} from "@/lib/validators/revision";
import { calculateSM2 } from "@/lib/sm2";

export async function POST(
  request: Request,
  { params }: RouteContext<"/api/problems/[id]/revision">,
) {
  try {
    const { id } = await params;
    const req = await request.json();
    const parsed = CreateRevisionSchema.safeParse(req);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const { userFeedback }: CreateRevisionInput = parsed.data;
    const h = await headers();
    const session = await auth.api.getSession({
      headers: h,
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
    const problem = await prisma.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem)
      return Response.json({ message: "Problem Not Found" }, { status: 404 });

    if (userId !== problem.userId) {
      return Response.json(
        {
          message: "Forbidden",
        },
        { status: 403 },
      );
    }
    const result = await prisma.$transaction(async (tx) => {
      await tx.revisionLog.create({
        data: {
          problemId: id,
          userFeedback,
        },
      });
      const updatedProblem = calculateSM2(problem, userFeedback);
      return await tx.problem.update({
        where: {
          id,
        },
        data: updatedProblem,
      });
    });

    return Response.json(result, {
      status: 201,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/problems/[id]/revision">,
) {
  try {
    const { id } = await params;
    const h = await headers();
    const session = await auth.api.getSession({
      headers: h,
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
    const problem = await prisma.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem)
      return Response.json({ message: "Problem Not Found" }, { status: 404 });

    if (userId !== problem.userId) {
      return Response.json(
        {
          message: "Forbidden",
        },
        { status: 403 },
      );
    }
    const revisions = await prisma.revisionLog.findMany({
      where: {
        problemId: id,
      },
      orderBy: {
        reviewedAt: "desc",
      },
    });
    return Response.json(revisions, {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: "Internal server error" },
      {
        status: 500,
      },
    );
  }
}

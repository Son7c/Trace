import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateNoteSchema, UpdateNoteSchema } from "@/lib/validators/notes";
import { headers } from "next/headers";

export async function POST(
  request: Request,
  { params }: RouteContext<"/api/problems/[id]/note">,
) {
  const req = await request.json();
  const { id } = await params;
  const parsed = CreateNoteSchema.safeParse(req);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const noteData = parsed.data;

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
    include: {
      note: true,
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

  if (problem.note) {
    return Response.json({ message: "Note already exists" }, { status: 409 });
  }

  const hasContent = Object.values(noteData).some(
    (value) => value?.trim() !== "",
  );

  if (!hasContent)
    return Response.json(
      {
        message: "No note content provided",
      },
      {
        status: 200,
      },
    );
  const note = await prisma.note.create({
    data: {
      problemId: id,
      ...noteData,
    },
  });
  return Response.json(note, {
    status: 201,
  });
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/problems/[id]/note">,
) {
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
  const problem = await prisma.problem.findUnique({
    where: {
      id,
    },
    include: {
      note: true,
    },
  });
  if (!problem)
    return Response.json({ message: "Problem Not Found" }, { status: 404 });

  const userId = session.session.userId;
  if (userId !== problem.userId) {
    return Response.json(
      {
        message: "Forbidden",
      },
      { status: 403 },
    );
  }
  if (!problem.note) {
    return Response.json({ message: "Note not found" }, { status: 404 });
  }
  return Response.json(problem.note, {
    status: 200,
  });
}

export async function PATCH(
  request: Request,
  { params }: RouteContext<"/api/problems/[id]/note">,
) {
  const req = await request.json();
  const { id } = await params;
  const parsed = UpdateNoteSchema.safeParse(req);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const noteData = parsed.data;

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
    include: {
      note: true,
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

  if (!problem.note) {
    return Response.json({ message: "Note not found" }, { status: 404 });
  }

  const updatedNote = await prisma.note.update({
    where: {
      id: problem.note.id,
    },
    data: {
      ...noteData,
    },
  });

  return Response.json(updatedNote, {
    status: 200,
  });
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext<"/api/problems/[id]/note">,
) {
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
  const problem = await prisma.problem.findUnique({
    where: {
      id,
    },
    include: {
      note: true,
    },
  });

  if (!problem) {
    return Response.json(
      { message: "Problem not found" },
      {
        status: 404,
      },
    );
  }
  const userId = session.session.userId;
  if (userId !== problem.userId) {
    return Response.json(
      {
        message: "Forbidden",
      },
      {
        status: 403,
      },
    );
  }

  if (!problem.note) {
    return Response.json(
      { message: "Note not found" },
      {
        status: 404,
      },
    );
  }

  await prisma.note.delete({
    where: {
      id: problem.note.id,
    },
  });

  return new Response(null, {
    status: 204,
  });
}

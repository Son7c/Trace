import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateNoteSchema, CreateNoteInput } from "@/lib/validators/notes";
import { headers } from "next/headers";

export async function POST(
  request: Request,
  { params }: PageProps <"/api/problems/[id]/note">,
) {
  const req = await request.json();
  const parsed = CreateNoteSchema.safeParse(req);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const {
    bruteForceApproach,
    optimizedApproach,
    timeComplexity,
    spaceComplexity,
    mistakes,
    keyLearning,
    intuition,
    interviewExplanation,
  }: CreateNoteInput = parsed.data;

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
  const note = await prisma.note.create({
    data: {
      bruteForceApproach,
      optimizedApproach,
      timeComplexity,
      spaceComplexity,
      mistakes,
      keyLearning,
      intuition,
      interviewExplanation,
    },
  });
}

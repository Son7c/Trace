import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const h = await headers();
    const session = await auth.api.getSession({
      headers: h,
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { image } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: image || null },
    });

    return Response.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user avatar:", error);
    return Response.json({ error: "Failed to update avatar in database" }, { status: 500 });
  }
}

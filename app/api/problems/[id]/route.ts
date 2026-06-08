import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: RouteContext<"/api/problems/[id]">,
) {
  const { id } = await params;
  const problem = await prisma.problem.findUnique({
    where: {
      id: id,
    },
  });
  if (!problem)
    return Response.json({ message: "Problem Not Found" }, { status: 404 });
  return Response.json(problem);
}

export async function PATCH(
  request: Request,
  { params }: RouteContext<"/api/problems/[id]">,
) {
  try {
    const { id } = await params;
    const req = await request.json();
    const res = await prisma.problem.update({
      where: { id },
      data: { ...req },
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
    const res = await prisma.problem.delete({
      where: { id },
    });
    return Response.json(
      { message: "Problem deleted successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);

    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

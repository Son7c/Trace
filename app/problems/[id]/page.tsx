import Note from "@/components/notes/Note";
import NoteForm from "@/components/notes/NoteForm";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProblemPage({ params }: Props) {
  const { id } = await params;

  const problem = await prisma.problem.findUnique({
    where: {
      id,
    },
    include: {
      note: true,
    },
  });

  if (!problem) {
    notFound();
  }

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <Link href="/dashboard">← Back to Dashboard</Link>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "24px",
          marginTop: "20px",
        }}
      >
        <h1>{problem.title}</h1>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              border: "1px solid #ccc",
              padding: "4px 10px",
              borderRadius: "999px",
            }}
          >
            {problem.platform}
          </span>

          <span
            style={{
              border: "1px solid #ccc",
              padding: "4px 10px",
              borderRadius: "999px",
            }}
          >
            {problem.difficulty}
          </span>
        </div>

        <p>
          <strong>Tags:</strong> {problem.tags.join(", ")}
        </p>

        <p>
          <strong>Problem:</strong>{" "}
          <a href={problem.url} target="_blank">
            Solve ↗
          </a>
        </p>
      </div>

      <section
        style={{
          marginTop: "30px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h2>📝 Notes</h2>

        {problem.note ? (
          <Note note={problem.note} />
        ) : (
          <p>No notes yet. Create one!</p>
        )}
      </section>

      <section
        style={{
          marginTop: "30px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h2>📅 Revision History</h2>

        <p>No revisions yet.</p>
      </section>

      <section
        style={{
          marginTop: "30px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h2>📊 Review Statistics</h2>

        <p>Reviews: 0</p>
        <p>Ease Factor: -</p>
        <p>Next Review: -</p>
      </section>
      <section>
        <NoteForm id={"cmr3yfuin0000q1erh09oeadx"}/>
      </section>
    </main>
  );
}

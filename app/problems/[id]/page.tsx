import Note from "@/components/notes/Note";
import NoteForm from "@/components/notes/NoteForm";
import ReviewCard from "@/components/reviews/ReviewForm";
import RevisionStats from "@/components/reviews/RevisionStats";
import RevisionHistory from "@/components/reviews/RevisionHistory";
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
      revisionLogs: true,
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
      <Link href="/problems">← Back to Dashboard</Link>

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
        <h2>Review form</h2>
        <ReviewCard id={id} />
      </section>

      <section
        style={{
          marginTop: "30px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h2>Revision History</h2>
        {problem.revisionLogs.length > 0 ? (
          problem.revisionLogs.map((revision) => (
            <RevisionHistory key={revision.id} revision={revision} />
          ))
        ) : (
          <p>No Revisions Yet!</p>
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
        <RevisionStats problem={problem} />
      </section>
      <section>
        <NoteForm id={id} />
      </section>
    </main>
  );
}

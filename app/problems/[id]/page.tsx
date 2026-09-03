import Note from "@/components/notes/Note";
import NoteForm from "@/components/notes/NoteForm";
import ReviewCard from "@/components/reviews/ReviewForm";
import RevisionStats from "@/components/reviews/RevisionStats";
import RevisionHistory from "@/components/reviews/RevisionHistory";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import PlatformLogo from "@/components/problems/PlatformLogo";
import { ArrowLeftIcon, PencilSimpleLineIcon, PlayIcon } from "@phosphor-icons/react/dist/ssr";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProblemPage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    notFound();
  }

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

  if (!problem || problem.userId !== session.user.id) {
    notFound();
  }

  return (
    <main style={{}} className="px-6 py-6">
      {/* top row */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/problems" className="flex items-center gap-3 text-sm">
            <ArrowLeftIcon size={16} /> Back to Problems
          </Link>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 cursor-pointer text-sm border border-gray rounded-md p-2">
            <PencilSimpleLineIcon size={16} />
            Edit problem
          </div>
          <div className="flex items-center gap-2 cursor-pointer text-sm border border-gray rounded-md p-2 bg-[#a6e795] text-black">
            <PlayIcon size={16} />
            Start Review
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {/* Left half */}
        <div>

        </div>

        {/* Right half */}
        <div>

        </div>
      </div>

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

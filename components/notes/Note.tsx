import { Note as PrismaNote } from "@/prisma/generated/client/client";

type NoteProps = {
  note: PrismaNote | null | undefined;
};

export default function Note({ note }: NoteProps) {
  if(!note) return <>No notes yet</>
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <Section
        title="Brute Force Approach"
        content={note.bruteForceApproach}
      />

      <Section
        title="Optimized Approach"
        content={note.optimizedApproach}
      />

      <div
        style={{
          display: "flex",
          gap: "40px",
        }}
      >
        <Section
          title="Time Complexity"
          content={note.timeComplexity}
        />

        <Section
          title="Space Complexity"
          content={note.spaceComplexity}
        />
      </div>

      <Section
        title="Mistakes"
        content={note.mistakes}
      />

      <Section
        title="Key Learning"
        content={note.keyLearning}
      />

      <Section
        title="Intuition"
        content={note.intuition}
      />

      <Section
        title="Interview Explanation"
        content={note.interviewExplanation}
      />
    </div>
  );
}

function Section({
  title,
  content,
}: {
  title: string;
  content: string | null;
}) {
  return (
    <div>
      <h3
        style={{
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "12px",
          minHeight: "50px",
          whiteSpace: "pre-wrap",
        }}
      >
        {content || (
          <span style={{ color: "#888" }}>
            Not provided
          </span>
        )}
      </div>
    </div>
  );
}
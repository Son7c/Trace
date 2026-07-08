"use client";

import { RevisionLog } from "@/prisma/generated/client/client";

type Prop = {
  revision: RevisionLog;
};

export default function RevisionHistory({ revision }: Prop) {
  return (
    <div>
      <span>Date={revision.reviewedAt.toDateString()}</span>
      <br />
      <p>{revision.userFeedback}</p>
    </div>
  );
}

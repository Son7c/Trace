"use client";

import { Note } from "@/prisma/generated/client/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type FormProps = {
  id: string | null;
};

export default function NoteForm({ id }: FormProps) {
  const [brute, setBrute] = useState("");
  const [optimized, setOptimized] = useState("");
  const [tc, setTc] = useState("");
  const [sc, setSc] = useState("");
  const [mistakes, setMistakes] = useState("");
  const [keyLearning, setKeyLearning] = useState("");
  const [intuition, setIntuition] = useState("");
  const [interview, setInterview] = useState("");
  const [hasNote, setHasNote] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    const fetchNote = async () => {
      const response = await fetch(`/api/problems/${id}/note`);

      if (response.status === 404) {
        return;
      }

      if (!response.ok) {
        console.error("Failed to fetch note");
        return;
      }

      const res = await response.json();
      setFormData(res);
      setHasNote(true);
    };
    fetchNote();
  }, [id]);

  const noteData = {
    bruteForceApproach: brute,
    optimizedApproach: optimized,
    timeComplexity: tc,
    spaceComplexity: sc,
    mistakes,
    keyLearning,
    intuition,
    interviewExplanation: interview,
  };

  const setFormData = (note: Note) => {
    setBrute(note?.bruteForceApproach ?? "");
    setOptimized(note?.optimizedApproach ?? "");
    setTc(note?.timeComplexity ?? "");
    setSc(note?.spaceComplexity ?? "");
    setMistakes(note?.mistakes ?? "");
    setKeyLearning(note?.keyLearning ?? "");
    setIntuition(note?.intuition ?? "");
    setInterview(note?.interviewExplanation ?? "");
  };

  const handleEditNote = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/problems/${id}/note`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });
      if (!response.ok) {
        console.error("Failed to update note");
        return;
      }
      const data = await response.json();
      setFormData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const formReset = () => {
    setBrute("");
    setOptimized("");
    setTc("");
    setSc("");
    setMistakes("");
    setKeyLearning("");
    setIntuition("");
    setInterview("");
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/problems/${id}/note`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });
      if (!response.ok) {
        console.error("Failed to update note");
        return;
      }
      formReset();
    } catch (err) {
      console.error(err);
      return;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) {
      console.error("Problem id is missing");
      return;
    }
    if (hasNote) {
      await handleEditNote();
      router.push(`/problems/${id}`);
    } else {
      setIsSaving(true);
      try {
        const response = await fetch(`/api/problems/${id}/note`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noteData),
        });
        if (!response.ok) {
          console.error("Failed to Create note");
          return;
        }
        const data = await response.json();
        setHasNote(true);
        setFormData(data);
      } catch (err) {
        console.error(err);
        return;
      } finally {
        setIsSaving(false);
        router.push(`/problems/${id}`);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Brute Force Approach</label>
          <textarea
            value={brute}
            onChange={(e) => setBrute(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label>Optimized Approach</label>
          <textarea
            value={optimized}
            onChange={(e) => setOptimized(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label>Time Complexity</label>
          <textarea
            value={tc}
            onChange={(e) => setTc(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label>Space Complexity</label>
          <textarea
            value={sc}
            onChange={(e) => setSc(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label>Mistakes</label>
          <textarea
            value={mistakes}
            onChange={(e) => setMistakes(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label>Key Learning</label>
          <textarea
            value={keyLearning}
            onChange={(e) => setKeyLearning(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label>Intuition</label>
          <textarea
            value={intuition}
            onChange={(e) => setIntuition(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label>Interview Explanation</label>
          <textarea
            value={interview}
            onChange={(e) => setInterview(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" disabled={isSaving}>
          {isSaving ? "Saving" : hasNote ? "Update Note" : "Create Note"}
        </button>
        <br />
        <button
          style={{ display: hasNote ? "" : "none" }}
          type="button"
          disabled={isDeleting}
          onClick={handleDelete}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </form>
    </div>
  );
}

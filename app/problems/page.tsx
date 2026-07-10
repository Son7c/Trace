"use client";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, error, isPending } = authClient.useSession();
  const [isSignOut, setSignOut] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");
  const [problems, setProblems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    if (editingId) {
      const response = await fetch(`/api/problems/${editingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          platform,
          difficulty,
          url,
          tags: tagsArray,
        }),
      });
      const data = await response.json();
      setProblems((prev) =>
        prev.map((problem) => (problem.id == editingId ? data : problem)),
      );
    } else {
      const response = await fetch("/api/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          platform,
          difficulty,
          url,
          tags: tagsArray,
        }),
      });
      const data = await response.json();
      setProblems((prev) => [...prev, data]);
    }
    setTitle("");
    setPlatform("");
    setDifficulty("");
    setUrl("");
    setTags("");
    setEditingId(null);
    setVisible(false);
  };

  const handleEdit = (problem: any) => {
    setEditingId(problem.id);

    setTitle(problem.title);
    setPlatform(problem.platform);
    setDifficulty(problem.difficulty);
    setUrl(problem.url);
    setTags((problem.tags ?? []).join(","));

    setVisible(true);
  };
  const handleDelete = async (p: any) => {
    const res = await fetch(`/api/problems/${p.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      setProblems((prev) => prev.filter((problem) => problem.id !== p.id));
    }
  };

  const toggleVisible = () => {
    setVisible(!isVisible);
  };
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  useEffect(() => {
    const fetchProblems = async () => {
      const response = await fetch("/api/problems");
      const data = await response.json();
      setProblems(data);
    };
    fetchProblems();
  }, []);

  return (
    <div>
      <h1>Welcome {session?.user.name}</h1>
      <button type="button" onClick={handleLogout}>
        Log out
      </button>
      {isVisible ? (
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <br />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <br />
          <br />

          <label>
            Platform
            <br />
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option value="">Select Platform</option>
              <option value="LEETCODE">LeetCode</option>
              <option value="GFG">GeeksForGeeks</option>
              <option value="CODEFORCES">Codeforces</option>
            </select>
          </label>

          <br />
          <br />

          <label>
            Difficulty
            <br />
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">Select Difficulty</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </label>

          <br />
          <br />

          <label>
            URL
            <br />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </label>

          <br />
          <br />

          <label>
            Tags (comma separated)
            <br />
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Array, HashMap, Two Pointers"
            />
          </label>

          <br />
          <br />

          <button type="submit">
            {editingId ? "Update Problem" : "Add Problem"}
          </button>
        </form>
      ) : (
        ""
      )}
      <button onClick={toggleVisible} type="button">
        {isVisible ? "Cancel" : "Create Problem"}
      </button>
      <h3>My Problems</h3>
      {problems.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
          onClick={() => router.push(`/problems/${p.id}`)}
        >
          <h3
            style={{
              margin: "0 0 8px 0",
            }}
          >
            {p.title}
          </h3>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                padding: "4px 8px",
                borderRadius: "999px",
                border: "1px solid #ddd",
              }}
            >
              {p.platform}
            </span>

            <span
              style={{
                padding: "4px 8px",
                borderRadius: "999px",
                border: "1px solid #ddd",
              }}
            >
              {p.difficulty}
            </span>
          </div>

          <p style={{ margin: "8px 0" }}>
            <strong>Tags:</strong> {p.tags.join(", ")}
          </p>

          <a href={p.url} target="_blank" rel="noopener noreferrer">
            Solve Problem ↗
          </a>
          <br />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(p);
            }}
          >
            Edit
          </button>
          <br />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(p);
            }}
          >
            {" "}
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

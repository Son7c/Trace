"use client";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function Home() {
  const { data: session, error, isPending } = authClient.useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignOut, setSignOut] = useState(false);
  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const signInGoogle = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
    });
  };
  const signInGithub = async () => {
    const data = await authClient.signIn.social({
        provider: "github"
    })
}

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/dashboard",
      });
    } catch (err) {
      console.log("caught error", err);
    }
  };
  if (isPending) return <div>Loading session...</div>;

  if (session) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Welcome, {session.user.name || session.user.email}</h1>
        <p>You are successfully authenticated.</p>
        <button
          onClick={async () => {
            setSignOut(true);
            await authClient.signOut();
            setSignOut(false);
          }}
        >
          {isSignOut ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <form action="" onSubmit={handleSubmit}>
        <label>
          email <br />
          <input
            type="text"
            placeholder="Enter email"
            onChange={handleEmail}
          ></input>
        </label>
        <br />
        <label>
          name <br />
          <input
            type="text"
            placeholder="Enter name"
            onChange={handleName}
          ></input>
        </label>
        <br />
        <label>
          password <br />
          <input
            type="password"
            placeholder="Enter password"
            minLength={8}
            onChange={handlePassword}
          ></input>
        </label>
        <br />
        <button>Submit</button>
        <br />
        <button onClick={signInGoogle} type="button">Login with google</button>
        <button onClick={signInGithub} type="button">Login with Github</button>
      </form>
    </div>
  );
}

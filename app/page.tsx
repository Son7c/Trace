"use client";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const { data: session, error, isPending } = authClient.useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(false);

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
    await authClient.signIn.social({
      provider: "google",
    });
  };
  const signInGithub = async () => {
    await authClient.signIn.social({
      provider: "github",
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (isLogin) {
        await authClient.signIn.email({
          email,
          password,
          callbackURL: "/",
        });
      } else {
        await authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: "/",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
  if (isPending) return <div>Loading session...</div>;

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div>
      <h3>{isLogin ? "Login" : "Sign Up"}</h3>
      <form action="" onSubmit={handleSubmit}>
        <label>
          email <br />
          <input
            type="email"
            placeholder="Enter email"
            onChange={handleEmail}
          ></input>
        </label>
        <br />
        {!isLogin && (
          <>
            <label>
              name <br />
              <input
                type="text"
                placeholder="Enter name"
                onChange={handleName}
              />
            </label>
          </>
        )}
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
        <button>{isLogin ? "Login" : "Sign Up"}</button>
        <br />
        <button type="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create Account" : "Already have an account?"}
        </button>
        <br />
        <button onClick={signInGoogle} type="button">
          Login with google
        </button>
        <br />
        <button onClick={signInGithub} type="button">
          Login with Github
        </button>
      </form>
    </div>
  );
}

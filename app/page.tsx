"use client";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useState } from "react";
import AuthForm from "@/components/AuthForm";


export default function Home() {
  const { data: session, error, isPending } = authClient.useSession();
  
  if (isPending) return <div>Loading session...</div>;

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div>
      <AuthForm/>
    </div>
  );
}

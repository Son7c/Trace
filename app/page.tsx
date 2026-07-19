"use client";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useState } from "react";
import AuthForm from "@/components/AuthForm";
import NavLanding from "@/components/navLanding";


export default function Home() {
  // const { data: session, error, isPending } = authClient.useSession();
  
  // if (isPending) return <div>Loading session...</div>;

  // if (session) {
  //   redirect("/dashboard");
  // }

  return (
    <div className="bg-[#0A0A0B] min-h-screen w-full">
      <NavLanding />
    </div>
  );
}

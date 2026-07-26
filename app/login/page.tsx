"use client";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[#020507] p-6 md:p-10">
      <div className="w-full max-w-sm bg-[#070a0b] p-6 rounded-lg border border-[#232427] text-white hover:border-[#2F3135]">
        <LoginForm />
      </div>
    </div>
  );
}

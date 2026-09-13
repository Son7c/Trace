export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-32 relative overflow-hidden">
      <main className="max-w-6xl mx-auto px-6 pt-12 space-y-6">
        <div className="h-28 rounded-2xl border border-zinc-800/80 bg-[#0D0D0D] animate-pulse" />
        <div className="h-52 rounded-2xl border border-zinc-800/80 bg-[#0D0D0D] animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 rounded-2xl border border-zinc-800/80 bg-[#0D0D0D] animate-pulse" />
          <div className="h-80 rounded-2xl border border-zinc-800/80 bg-[#0D0D0D] animate-pulse" />
        </div>
      </main>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#07080C] text-zinc-100 font-sans pb-32 relative overflow-x-hidden">
      {/* 1. Header Skeleton */}
      <header className="max-w-7xl mx-auto px-4 sm:px-10 py-4 sm:py-6 flex items-center justify-between gap-3">
        <div className="h-7 w-20 bg-zinc-800/60 rounded-lg animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="h-9 w-32 bg-zinc-800/60 rounded-full animate-pulse" />
          <div className="h-8 w-8 bg-zinc-800/60 rounded-full animate-pulse" />
        </div>
      </header>

      {/* 2. Main Content Skeleton */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6 sm:space-y-8 pb-32">
        {/* Greeting Skeleton */}
        <div className="space-y-2">
          <div className="h-10 sm:h-12 w-64 bg-zinc-800/60 rounded-xl animate-pulse" />
          <div className="h-4 w-48 bg-zinc-800/40 rounded-md animate-pulse" />
        </div>

        {/* 3 Metric Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-800/80 bg-[#0F121A]/70 p-5 flex items-center gap-4 shadow-xl"
            >
              <div className="w-11 h-11 rounded-full bg-zinc-800/80 animate-pulse shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-7 w-16 bg-zinc-800/80 rounded animate-pulse" />
                <div className="h-3 w-20 bg-zinc-800/50 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Today's Focus Skeleton */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0F121A]/70 p-4 sm:p-7 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 bg-zinc-800/70 rounded animate-pulse" />
            <div className="h-8 w-36 bg-zinc-800/60 rounded-full animate-pulse" />
          </div>
          <div className="divide-y divide-zinc-800/40 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-4 flex items-center justify-between gap-4">
                <div className="h-4 w-48 bg-zinc-800/50 rounded animate-pulse" />
                <div className="h-4 w-28 bg-zinc-800/40 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

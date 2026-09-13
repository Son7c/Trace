export default function ReviewLoading() {
  return (
    <div className="min-h-screen bg-[#07090C] text-zinc-100 flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-[#a6e795] border-t-transparent animate-spin" />
      <p className="text-xs text-zinc-500 font-medium">Preparing your review session...</p>
    </div>
  );
}

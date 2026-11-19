export default function CheckBox({
  handleCheck,
  isChecked,
}: {
  handleCheck: () => void;
  isChecked: boolean;
}) {
  return (
    <button
      type="button"
      onClick={handleCheck}
      className={`w-4 h-4 rounded flex items-center justify-center border transition-all cursor-pointer ${
        isChecked
          ? "bg-[#a6e795] border-[#a6e795] text-black"
          : "bg-zinc-900/80 border-zinc-700/80 hover:border-zinc-500"
      }`}
    >
      {isChecked && (
        <svg
          className="w-3 h-3 stroke-[3]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </button>
  );
}

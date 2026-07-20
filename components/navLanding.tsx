"use client";

export default function NavLanding() {
  return (
    <nav className="flex items-center justify-between px-12 py-3">
      <div className="text-white text-3xl font-bold tracking-tight">Trace</div>
      <div>
        <a href="#product" className="text-white text-md">
          Product
        </a>
        <a href="#how-it-works" className="text-white text-md ml-6">
          How it works
        </a>
        <a href="#features" className="text-white text-md ml-6">
          Features
        </a>
        <a href="#pricing" className="text-white text-md ml-6">
          Pricing
        </a>
        <a href="#about" className="text-white text-md ml-6">
          About
        </a>
      </div>

      <div className="text-white text-md">
        <button className="text-white text-md">Log in</button>
        <button className="text-black text-sm ml-5 bg-[#a6e795] px-4 py-2 rounded-lg">
          Start Training
        </button>
      </div>
    </nav>
  );
}

export default function TimelineLine() {
  return (
    <div className="relative h-full w-[57%] mx-auto">
      {/* Main line */}
      <div
        className="
          absolute
          top-1/2
          left-0
          h-[1.5px]
          w-full
          -translate-y-1/2
          bg-[linear-gradient(to_right,transparent,#99e372_10%,#99e372_90%,transparent)]
          drop-shadow-[0_0_4px_rgba(153,227,114,0.8)]
        "
      />
    </div>
  );
}
//#99e372

export default function TimelineLine() {
  return (
    <div className="relative h-8 w-[57%] mx-auto">
      {/* Main line */}
      <div
        className="
          absolute
          top-1/2
          left-0
          h-[1px]
          w-full
          -translate-y-1/2
          bg-[linear-gradient(to_right,transparent,#99e372_10%,#99e372_90%,transparent)]
        "
      />
    </div>
  );
}
//#99e372

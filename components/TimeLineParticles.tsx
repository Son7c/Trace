"use client";
import { useEffect, useState } from "react";

type Particle = {
  left: string;
  offset: number;
  size: number;
  opacity: number;
};

export default function TimelineParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const numParticles = 80;
    const start = 2;
    const end = 99;

    const width = end - start;
    const slot = width / numParticles;

    const particles = Array.from({ length: numParticles }, (_, i) => {
      //horizontal jitter
      const jitter = (Math.random() - 0.5) * slot * 0.8;

      //vertical jitter
      const verticalSpread =
        (Math.random() + Math.random() + Math.random() - 1.5) * 8;

      const rand = Math.random();
      const size = rand > 0.85 ? (rand > 0.95 ? 2.5 : 1.5) : 1;

      return {
        left: `${start + i * slot + slot / 2 + jitter}%`,
        offset: verticalSpread,
        size,
        opacity: 0.15 + Math.random() * 0.7,
      };
    });
    setParticles(particles);
  }, []);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[53%] h-8 z-0 pointer-events-none">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-[#a9ff7a]"
          style={{
            left: p.left,
            top: "50%",
            transform: `translate(-50%, calc(-50% + ${p.offset}px))`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            boxShadow:
              p.size > 1 ? "0 0 5px 1px rgba(169, 255, 122, 0.8)" : "none",
          }}
        />
      ))}
    </div>
  );
}

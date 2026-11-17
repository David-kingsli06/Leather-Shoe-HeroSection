"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FrameCanvas } from "./FrameCanvas";
import { HeroOverlay } from "./HeroOverlay";
import { useReducedMotion } from "@/lib/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !containerRef.current || !stickyRef.current) return;

      // Pin the viewport element firmly via GSAP ScrollTrigger pinning.
      // This ensures 100% reliable pinning across all browsers without CSS position:sticky edge-cases or overflow clipping.
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: stickyRef.current,
        pinSpacing: false, // containerRef already provides the full scroll track height (300vh)
        anticipatePin: 1,
        scrub: 0,
        onUpdate: (self) => {
          setProgress(self.progress);
        },
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      ref={containerRef}
      className={`relative w-full ${reducedMotion ? "h-screen" : "h-[300vh]"} bg-[#1b1714]`}
    >
      <div
        ref={stickyRef}
        className="w-full h-screen overflow-hidden flex items-center justify-center will-change-transform"
      >
        {/* Scrubbed Canvas */}
        <FrameCanvas progress={progress} reducedMotion={reducedMotion} />

        {/* Narrative & Brand Overlay */}
        <HeroOverlay progress={progress} reducedMotion={reducedMotion} />
      </div>
    </section>
  );
};

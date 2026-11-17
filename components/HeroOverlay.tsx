"use client";

import React, { useRef } from "react";

interface HeroOverlayProps {
  progress: number;
  reducedMotion?: boolean;
}

/**
 * Calculates cubic bezier (0.22, 1, 0.36, 1) ease for stage 3 wordmark reveal.
 */
function cubicBezierEaseOut(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  // High-accuracy approximation for cubic-bezier(0.22, 1, 0.36, 1)
  // Standardized curve: rapid initial rise with smooth, elegant deceleration
  return 1 - Math.pow(1 - clamped, 3.2);
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({
  progress,
  reducedMotion = false,
}) => {
  // If reduced motion is active, display static end stage directly
  const p = reducedMotion ? 1.0 : progress;

  // STAGE OPACITY COMPUTATIONS
  // Stage 1: 0 to 0.33 (cross-fade to stage 2 between 0.30 and 0.36)
  let stage1Opacity = 0;
  if (p < 0.30) {
    stage1Opacity = 1;
  } else if (p <= 0.36) {
    stage1Opacity = (0.36 - p) / 0.06;
  }

  // Stage 2: 0.33 to 0.66 (fade in between 0.30 and 0.36, fade out between 0.63 and 0.69)
  let stage2Opacity = 0;
  if (p >= 0.30 && p < 0.36) {
    stage2Opacity = (p - 0.30) / 0.06;
  } else if (p >= 0.36 && p <= 0.63) {
    stage2Opacity = 1;
  } else if (p > 0.63 && p <= 0.69) {
    stage2Opacity = (0.69 - p) / 0.06;
  }

  // Stage 3: Wordmark eases from 0 to 1 with cubic-bezier(0.22, 1, 0.36, 1) between p = 0.72 and p = 0.88
  let stage3Opacity = 0;
  if (p >= 0.88) {
    stage3Opacity = 1;
  } else if (p >= 0.72) {
    const linearT = (p - 0.72) / (0.88 - 0.72);
    stage3Opacity = cubicBezierEaseOut(linearT);
  }

  // Scroll cue: fades out smoothly after p = 0.05
  let scrollCueOpacity = 0;
  if (!reducedMotion && p < 0.05) {
    scrollCueOpacity = (0.05 - p) / 0.05;
  }

  return (
    <div
      className="absolute inset-0 z-10 pointer-events-none select-none overflow-hidden"
      aria-hidden={reducedMotion ? undefined : "true"}
    >
      {/* Subtle left-side legibility gradient ensuring WCAG AA >= 4.5:1 contrast over bright footage */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent pointer-events-none transition-opacity duration-500"
        style={{ opacity: p < 0.7 ? 1 : 0.6 }}
      />

      {/* Top Brand Bar / Header Anchor */}
      <header className="absolute top-0 left-0 right-0 px-[6vw] py-8 flex items-center justify-between z-20">
        <span className="font-serif text-[20px] md:text-[22px] tracking-wide text-[var(--color-offwhite)] font-medium">
          Cuir &amp; Co.
        </span>
        <div className="flex items-center gap-6">
          <span className="text-[13px] tracking-widest uppercase text-[var(--color-stone)] hidden sm:inline-block">
            Edition 01 — Cognac Tan
          </span>
          <span className="text-[12px] tracking-wider px-3 py-1 rounded-full border border-[var(--color-stone)]/30 text-[var(--color-offwhite)]">
            Handmade in Italy
          </span>
        </div>
      </header>

      {/* STAGE 1: Sole level (0 to 0.33) */}
      <div
        className="absolute top-[18%] md:top-1/2 md:-translate-y-1/2 left-[6vw] w-[88vw] md:w-[34vw] max-w-[28ch] transition-opacity duration-150 will-change-transform"
        style={{
          opacity: stage1Opacity,
          pointerEvents: stage1Opacity > 0.8 ? "auto" : "none",
        }}
      >
        <p className="text-[12px] md:text-[13px] uppercase tracking-[0.2em] text-[var(--color-stone)] mb-3">
          Stage 01 &bull; Foundation
        </p>
        <h1 className="font-serif text-[42px] sm:text-[54px] lg:text-[68px] leading-[1.12] text-[var(--color-offwhite)] text-shadow-calm font-normal tracking-tight">
          Built from the ground up.
        </h1>
        <p className="mt-4 md:mt-6 font-sans text-[16px] md:text-[18px] leading-[1.5] text-[var(--color-stone)] text-shadow-calm font-light">
          Premium leather, starting at the sole.
        </p>
      </div>

      {/* STAGE 2: Midsole & Upper grain (0.33 to 0.66) */}
      <div
        className="absolute top-[18%] md:top-1/2 md:-translate-y-1/2 left-[6vw] w-[88vw] md:w-[34vw] max-w-[28ch] transition-opacity duration-150 will-change-transform"
        style={{
          opacity: stage2Opacity,
          pointerEvents: stage2Opacity > 0.8 ? "auto" : "none",
        }}
      >
        <p className="text-[12px] md:text-[13px] uppercase tracking-[0.2em] text-[var(--color-stone)] mb-3">
          Stage 02 &bull; Craftsmanship
        </p>
        <h2 className="font-serif text-[42px] sm:text-[54px] lg:text-[68px] leading-[1.12] text-[var(--color-offwhite)] text-shadow-calm font-normal tracking-tight">
          Every stitch, in view.
        </h2>
        <p className="mt-4 md:mt-6 font-sans text-[16px] md:text-[18px] leading-[1.5] text-[var(--color-stone)] text-shadow-calm font-light">
          Pebbled grain, finished by hand.
        </p>
      </div>

      {/* STAGE 3: Final reveal looking down over laces (0.66 to 1.0) */}
      <div
        className="absolute top-[16%] md:top-[18%] left-1/2 -translate-x-1/2 w-full max-w-4xl text-center px-6 transition-opacity duration-200 will-change-transform"
        style={{
          opacity: stage3Opacity,
          pointerEvents: stage3Opacity > 0.8 ? "auto" : "none",
        }}
      >
        <p className="font-serif text-[64px] md:text-[96px] leading-[1.05] tracking-tight text-[var(--color-offwhite)] text-shadow-calm font-normal">
          Cuir &amp; Co.
        </p>
        <p className="mt-4 md:mt-5 font-sans text-[16px] md:text-[18px] leading-[1.5] tracking-wide text-[var(--color-stone)] text-shadow-calm font-light">
          Made to be worn for years.
        </p>
      </div>

      {/* SCROLL CUE: Placed bottom center, fades out after p = 0.05 */}
      {scrollCueOpacity > 0.01 && (
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-200 pointer-events-none"
          style={{ opacity: scrollCueOpacity }}
        >
          <span className="text-[11px] uppercase tracking-[0.24em] text-[var(--color-stone)] font-medium">
            Scroll
          </span>
          <div className="w-[1px] h-[40px] bg-gradient-to-b from-[var(--color-stone)] to-transparent" />
        </div>
      )}
    </div>
  );
};

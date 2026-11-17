"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  TOTAL_FRAMES,
  getFramePath,
  progressToFrameIndex,
} from "@/lib/frames";

interface FrameCanvasProps {
  progress: number;
  reducedMotion?: boolean;
}

export const FrameCanvas: React.FC<FrameCanvasProps> = ({
  progress,
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES).fill(null)
  );

  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [first10Loaded, setFirst10Loaded] = useState<boolean>(false);
  const [isLowEnd, setIsLowEnd] = useState<boolean>(false);

  // Smooth lerp frame tracking state
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Detect low concurrency devices (< 4 cores)
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      navigator.hardwareConcurrency &&
      navigator.hardwareConcurrency < 4
    ) {
      setIsLowEnd(true);
    }
  }, []);

  // Preload all 240 frames
  useEffect(() => {
    let active = true;
    let localLoaded = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);

      img.onload = () => {
        if (!active) return;
        imagesRef.current[i] = img;
        localLoaded++;
        setLoadedCount(localLoaded);
        if (localLoaded === 10) {
          setFirst10Loaded(true);
        }
      };

      img.onerror = () => {
        if (!active) return;
        localLoaded++;
        setLoadedCount(localLoaded);
        if (localLoaded === 10) {
          setFirst10Loaded(true);
        }
      };
    }

    return () => {
      active = false;
    };
  }, []);

  /**
   * Draw routine with:
   * 1. High smoothing quality without artificial sharpening
   * 2. Object-fit cover logic
   * 3. 106% scale crop (to hide source corner marks without overscaling)
   * 4. DPR cap [1, 2]
   * 5. Responsive focal position (60% 50% on desktop to position shoe right of copy, 50% 60% on mobile)
   */
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Retrieve target image or nearest loaded fallback
    let img = imagesRef.current[frameIdx];
    if (!img || !img.complete) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = imagesRef.current[frameIdx - offset];
        if (prev && prev.complete) {
          img = prev;
          break;
        }
        const next = imagesRef.current[frameIdx + offset];
        if (next && next.complete) {
          img = next;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    const targetWidth = Math.round(displayWidth * dpr);
    const targetHeight = Math.round(displayHeight * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const isDesktop = displayWidth >= 1024;
    // Focal center: 60% horizontal on desktop to place shoe on the right third, centered vertically
    // On mobile (< 768px): center horizontally 50%, position shoe lower 58% so text stays unobstructed in top 35%
    const focalX = isDesktop ? 0.60 : 0.50;
    const focalY = isDesktop ? 0.50 : 0.58;

    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    // Cover math
    const scale = Math.max(displayWidth / imgWidth, displayHeight / imgHeight);
    // Crop at exactly 106% (1.06) centered to remove edge marks
    const cropScale = 1.06;
    const finalWidth = imgWidth * scale * cropScale;
    const finalHeight = imgHeight * scale * cropScale;

    // Calculate position based on focal point
    const dx = displayWidth * focalX - finalWidth * focalX;
    const dy = displayHeight * focalY - finalHeight * focalY;

    ctx.clearRect(0, 0, displayWidth, displayHeight);
    ctx.drawImage(img, dx, dy, finalWidth, finalHeight);
    ctx.restore();
  }, []);

  // Update target frame from progress
  useEffect(() => {
    if (reducedMotion) {
      targetFrameRef.current = TOTAL_FRAMES - 1;
      currentFrameRef.current = TOTAL_FRAMES - 1;
      drawFrame(TOTAL_FRAMES - 1);
      return;
    }

    const targetIdx = progressToFrameIndex(progress, isLowEnd);
    targetFrameRef.current = targetIdx;
  }, [progress, reducedMotion, isLowEnd, drawFrame]);

  // Smooth lerp loop (lerp factor: 0.12 per animation frame)
  useEffect(() => {
    if (reducedMotion) return;

    let isRunning = true;

    const renderLoop = () => {
      const current = currentFrameRef.current;
      const target = targetFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.01) {
        // Emil Design Engineering: 0.12 lerp factor per RAF for smooth, calm, non-bouncy motion
        const next = current + diff * 0.12;
        currentFrameRef.current = next;
        const roundedIdx = Math.round(next);
        drawFrame(roundedIdx);
      } else if (Math.round(current) !== target) {
        currentFrameRef.current = target;
        drawFrame(target);
      }

      if (isRunning) {
        animFrameIdRef.current = requestAnimationFrame(renderLoop);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [reducedMotion, drawFrame]);

  // Initial draw and resize listener
  useEffect(() => {
    const handleResize = () => {
      drawFrame(Math.round(currentFrameRef.current));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  // Trigger draw once first 10 frames are ready
  useEffect(() => {
    if (first10Loaded) {
      drawFrame(Math.round(currentFrameRef.current));
    }
  }, [first10Loaded, drawFrame]);

  const loadProgressRatio = Math.min(1, loadedCount / TOTAL_FRAMES);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1b1714]">
      {/* Loading Hairline in Cognac Tan #8B5A2B */}
      {loadProgressRatio < 1 && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-black/40 z-30 pointer-events-none">
          <div
            className="h-full bg-[var(--color-cognac)] transition-all duration-150 ease-out"
            style={{ width: `${Math.round(loadProgressRatio * 100)}%` }}
          />
        </div>
      )}

      {/* Frame Scrubbing Canvas */}
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Premium cognac leather sneaker from Cuir & Co., rising from the sole to the laces as the light moves across the leather."
        className={`w-full h-full block object-cover transition-opacity duration-300 ${
          first10Loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

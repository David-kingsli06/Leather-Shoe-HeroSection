export const TOTAL_FRAMES = 240;

/**
 * Returns the public path for a given frame index.
 * Frames are named frame_000.webp through frame_239.webp.
 */
export function getFramePath(index: number): string {
  const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));
  const padded = clamped.toString().padStart(3, "0");
  return `/frames/frame_${padded}.webp`;
}

export interface ScrollStage {
  start: number;
  end: number;
  startFrame: number;
  endFrame: number;
}

export const STAGES: Record<1 | 2 | 3, ScrollStage> = {
  1: { start: 0, end: 0.33, startFrame: 0, endFrame: 79 },
  2: { start: 0.33, end: 0.66, startFrame: 79, endFrame: 158 },
  3: { start: 0.66, end: 1.0, startFrame: 158, endFrame: 239 },
};

/**
 * Maps scroll progress [0, 1] to target frame index [0, 239].
 * Supports downsampling for lower hardware concurrency.
 */
export function progressToFrameIndex(
  progress: number,
  isLowEndDevice = false
): number {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  let index = Math.round(clampedProgress * (TOTAL_FRAMES - 1));

  if (isLowEndDevice) {
    // Round to nearest even frame index for lower-concurrency hardware
    index = Math.round(index / 2) * 2;
    if (index >= TOTAL_FRAMES) {
      index = TOTAL_FRAMES - 2;
    }
  }

  return index;
}

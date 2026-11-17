# Prompt Specification: Cuir & Co. Leather Sneaker Hero

The following prompt was used to architect and construct this full-screen scroll-driven hero:

---

```markdown
Build a full-screen, scroll-driven hero for "Cuir & Co.", a premium low-top leather sneaker in cognac tan #8B5A2B. The hero plays a 240-frame image sequence scrubbed by scroll. The shoe starts at sole level, rises straight up past the heel, and ends looking down over the laces, while the text reveals the brand. Keep everything photographic and calm. No cartoon effects, no bouncing, no overshoot.

SKILLS TO APPLY
- Taste: sets the visual direction. Use the palette cognac tan #8B5A2B, warm off-white #F4EDE1, soft stone #D8D2C8, and warm grey #C9C2B6. Text is warm off-white #F4EDE1, never pure white.
- Impeccable Design: governs layout, typography, and spacing. Use a serif display face for the brand wordmark (for example Cormorant Garamond) and a clean sans for body copy (for example Inter). Keep 8 px spacing steps and side margins of at least 6vw.
- Emil Design Engineering: governs motion and interaction. Use eased, damped scrubbing with no snapping, no bounce, and no motion longer than the scroll it belongs to.
- Conflict rule: if Taste and Impeccable disagree, Taste wins on color and mood, Impeccable wins on layout and type. If either conflicts with Emil on motion, Emil wins on timing, and the result must still feel calm.

STACK
- Next.js 15 (App Router), TypeScript (strict), Tailwind CSS v4.
- Frame scrubbing on a single <canvas>, no 3D libraries.
- Choose GSAP ScrollTrigger or Framer Motion for scroll tracking. Pick one, justify the choice in two sentences, and use it consistently. Prefer GSAP ScrollTrigger for its scrub control.
- Smooth the scroll-to-frame mapping with a lerp factor of 0.12 per animation frame so the frames never jump.

CONCEPT
- Pinned hero: a section 300vh tall, containing a sticky 100vh viewport.
- Starting state: the first frame (shoe at sole level, toe pointing left) is drawn and visible before any scroll, with the first headline already readable.
- Scroll progress p runs from 0 to 1 across the pinned section, and p drives everything: the frame index, the text stage, and the wordmark opacity.
- Frame index = round(p * 239), so frame 0 is p = 0 and frame 239 is p = 1.
- Scroll stages, matched to the shoe's camera moves:
  - 0 to 0.33 (frames 0 to 79): sole level. The midsole and welt fill the frame. Headline visible.
  - 0.33 to 0.66 (frames 79 to 158): the camera rises along the side of the upper and the cognac grain comes into focus. Second headline visible.
  - 0.66 to 1 (frames 158 to 239): the camera looks down over the laces and collar. The wordmark is revealed.

FRAME ASSETS
- Frames live in /public/frames/frame_000.webp through frame_239.webp.
- Frames are extracted from a 640x360 source. Scale them up with imageSmoothingQuality = "high" and do not add sharpening.
- Preload all 240 frames before the canvas draws, but render the text immediately. Show a thin progress hairline in cognac #8B5A2B while loading.
- Decode each frame with new Image() and store it in an array. Draw each frame centered and filling the canvas, using object-fit: cover logic.
- Crop each frame by scaling it to 106 percent of the canvas, centered, to hide any small watermark in the corners. Do not scale further than that.
- Cap the canvas backing store at DPR [1, 2].

MOTION
- Stage 1 (0 to 0.33): the scroll mapping is linear, so the camera's rise feels steady.
- Stage 2 (0.33 to 0.66): keep the same linear mapping. The leather sheen moves with the light in the footage, so no code animation is needed.
- Stage 3 (0.66 to 1): the wordmark opacity eases from 0 to 1 with cubic-bezier(0.22, 1, 0.36, 1) between p = 0.72 and p = 0.88.
- Scroll cue: no animation on the canvas. Do not add a second idle motion, since the footage already contains the motion.
- Use transform and opacity only for overlays. Never animate layout properties.

OVERLAY TEXT (exact copy, short, in the brand voice)
- Stage 0 to 0.33: headline "Built from the ground up." Subline: "Premium leather, starting at the sole." Position: left, vertically centered, max width 28ch.
- Stage 0.33 to 0.66: headline "Every stitch, in view." Subline: "Pebbled grain, finished by hand." Position: left, vertically centered, max width 28ch.
- Stage 0.66 to 1: wordmark "Cuir & Co." in the serif face, 64 px on mobile and 96 px on desktop, centered in the frame's open area. Subline below it: "Made to be worn for years." This is the only text in this stage.
- Scroll cue: a small label "Scroll" with a thin 40 px line below it, placed bottom center, fading out after p = 0.05.
- Typography: serif headlines at 48 to 72 px, sans sublines at 16 to 18 px, line height 1.2 for headlines and 1.5 for sublines. Text color #F4EDE1, with a soft text-shadow of 0 2px 24px rgba(46, 46, 51, 0.35) for legibility over bright areas.

LAYOUT
- Desktop (1024 px and up): the shoe sits in the frame's center. Set the canvas object-position to 60% 50% so the shoe moves right. All text sits on the left third (left 6vw, width 34vw) during stages 1 and 2. In stage 3 the wordmark centers over the shoe's upper area. Keep a 24 px minimum gap between text and the shoe.
- Mobile (below 768 px): the text sits in the top 35% of the viewport in stages 1 and 2, and the shoe sits in the lower 60%. In stage 3 the wordmark sits in the top 35%, with the shoe below it. Never let text overlap the shoe.

BEHAVIOR AND ACCESSIBILITY
- Reduced motion: if prefers-reduced-motion is set, skip scroll scrubbing. Show frame 239 as a static image with the wordmark visible, and remove the scroll cue.
- Touch: scrubbing works through native touch scroll. Do not hijack touch events.
- Suspense fallback: render the headline and scroll section first. Show the canvas only after the first 10 frames are decoded, with a 300 ms fade-in.
- Low-end devices: if navigator.hardwareConcurrency is below 4, draw every second frame and round the index to the nearest even number.
- Contrast: all text meets WCAG AA. Check the subline over the brightest areas, and add a dark-to-transparent gradient from the left if needed to reach 4.5:1.
- Canvas: role="img" and aria-label="Premium cognac leather sneaker from Cuir & Co., rising from the sole to the laces as the light moves across the leather." Each text block uses real headings in order (h1 for the first headline, h2 for the second, and the wordmark as a styled p with the brand name).

FILE STRUCTURE
- app/layout.tsx: root layout, fonts, metadata.
- app/page.tsx: renders the Hero.
- components/Hero.tsx: pinned 300vh section and sticky viewport, scroll tracking.
- components/FrameCanvas.tsx: canvas, frame preloading, lerp drawing, cover crop.
- components/HeroOverlay.tsx: stage text, wordmark, and scroll cue.
- lib/frames.ts: frame count, paths, and index mapping.
- lib/useReducedMotion.ts: reduced-motion hook.
- app/globals.css: Tailwind v4 import and brand tokens.
- public/frames/: the 240 WebP frames.
```

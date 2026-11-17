import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[#1b1714]">
      {/* Pinned 300vh Scroll-Driven Hero */}
      <Hero />

      {/* Continuation Section showing craft details */}
      <section className="relative z-20 min-h-screen bg-[#1b1714] text-[var(--color-offwhite)] px-[6vw] py-24 border-t border-[var(--color-stone)]/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          <div className="space-y-4">
            <span className="font-serif text-[18px] text-[var(--color-cognac)] block">
              01 / Full-Grain Tannage
            </span>
            <h3 className="font-serif text-[28px] md:text-[32px] leading-tight font-normal">
              Slow vegetable soak in Tuscany.
            </h3>
            <p className="font-sans text-[15px] leading-relaxed text-[var(--color-warmgrey)] font-light">
              Treated with natural barks and tallow over 45 days. The cognac hue develops an individual, lustrous patina with every step.
            </p>
          </div>

          <div className="space-y-4">
            <span className="font-serif text-[18px] text-[var(--color-cognac)] block">
              02 / Strobel Construction
            </span>
            <h3 className="font-serif text-[28px] md:text-[32px] leading-tight font-normal">
              Weightless, flex-first interior.
            </h3>
            <p className="font-sans text-[15px] leading-relaxed text-[var(--color-warmgrey)] font-light">
              Upper and sock stitched directly to a flexible fabric bottom. No stiff shank, no rigid break-in week required.
            </p>
          </div>

          <div className="space-y-4">
            <span className="font-serif text-[18px] text-[var(--color-cognac)] block">
              03 / Margom Rubber Sole
            </span>
            <h3 className="font-serif text-[28px] md:text-[32px] leading-tight font-normal">
              Reinforced 360&deg; side-wall stitch.
            </h3>
            <p className="font-sans text-[15px] leading-relaxed text-[var(--color-warmgrey)] font-light">
              Cup soles vulcanized in Civitanova Marche. Resoleable architecture designed to outlive seasons of continuous wear.
            </p>
          </div>
        </div>

        <div className="mt-28 max-w-6xl mx-auto pt-12 border-t border-[var(--color-stone)]/10 flex flex-col md:flex-row items-baseline justify-between gap-6">
          <span className="font-serif text-[32px] text-[var(--color-offwhite)]">
            Cuir &amp; Co.
          </span>
          <p className="font-sans text-[13px] text-[var(--color-stone)]/60">
            &copy; 2026 Cuir &amp; Co. Atelier. All rights reserved.
          </p>
        </div>
      </section>
    </main>
  );
}

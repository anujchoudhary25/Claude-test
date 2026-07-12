import Reveal from "./Reveal.jsx";
import { HERO_SERVICES } from "../data.js";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-20"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="mb-6 font-display text-sm font-bold uppercase tracking-[0.25em] text-lime">
            Digital Marketing Agency
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="max-w-4xl font-display text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Digital Growth,
            <br />
            Built for <span className="text-lime">Premium Brands.</span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-8 max-w-2xl text-lg font-medium text-bone/70 sm:text-xl">
            {HERO_SERVICES.join(" · ")}
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10">
            <a
              href="#contact"
              className="inline-flex items-center rounded-full bg-lime px-8 py-4 font-display text-base font-extrabold text-ink transition-transform hover:scale-105"
            >
              Book a Free Audit Call
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

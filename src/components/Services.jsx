import Reveal from "./Reveal.jsx";
import { SERVICES } from "../data.js";

export default function Services() {
  return (
    <section id="what-we-do" className="border-t border-white/10 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="mb-4 font-display text-sm font-bold uppercase tracking-[0.25em] text-lime">
            What We Do
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-2xl font-display text-4xl font-black leading-tight sm:text-5xl">
            Every discipline a premium brand needs.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.title} delay={i * 60}>
                <div className="group h-full rounded-2xl bg-card p-8 transition-colors hover:bg-card-hover">
                  <Icon className="text-lime" size={28} strokeWidth={2} />
                  <h3 className="mt-6 font-display text-xl font-bold">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-bone/70">
                    {service.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={SERVICES.length * 60}>
          <p className="mt-8 text-sm font-medium text-bone/60">
            Plus{" "}
            <span className="font-bold text-lime">Influencer Marketing</span>{" "}
            as an additional capability.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

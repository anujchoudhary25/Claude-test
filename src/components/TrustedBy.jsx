import Reveal from "./Reveal.jsx";
import { CLIENTS } from "../data.js";

export default function TrustedBy() {
  return (
    <section id="trusted-by" className="border-t border-white/10 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="mb-4 font-display text-sm font-bold uppercase tracking-[0.25em] text-lime">
            Trusted By
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-2xl font-display text-4xl font-black leading-tight sm:text-5xl">
            Brands that already grew with us.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CLIENTS.map((client, i) => (
            <Reveal key={client.name} delay={i * 60}>
              <div className="rounded-2xl bg-card p-8 transition-colors hover:bg-card-hover">
                <h3 className="font-display text-2xl font-extrabold">
                  {client.name}
                </h3>
                <p className="mt-3 text-sm font-medium text-bone/60">
                  {client.tag}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

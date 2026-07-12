import { Check } from "lucide-react";
import Reveal from "./Reveal.jsx";
import { PRICING_TIERS } from "../data.js";

export default function Pricing() {
  return (
    <section id="pricing" className="border-t border-white/10 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="mb-4 font-display text-sm font-bold uppercase tracking-[0.25em] text-lime">
            Pricing
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-2xl font-display text-4xl font-black leading-tight sm:text-5xl">
            Plans built for how premium brands grow.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PRICING_TIERS.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 80}>
              <div
                className={`flex h-full flex-col rounded-2xl p-8 ${
                  tier.popular
                    ? "bg-lime text-ink ring-2 ring-lime"
                    : "bg-card text-white"
                }`}
              >
                {tier.popular && (
                  <span className="mb-4 inline-block w-fit rounded-full bg-ink px-3 py-1 font-display text-xs font-bold uppercase tracking-wide text-lime">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-2xl font-extrabold">
                  {tier.name}
                </h3>
                <p className="mt-4">
                  <span className="font-display text-4xl font-black">
                    {tier.price}
                  </span>
                  <span
                    className={`ml-1 text-sm font-semibold ${
                      tier.popular ? "text-ink/70" : "text-bone/60"
                    }`}
                  >
                    {tier.period}
                  </span>
                </p>

                <ul className="mt-8 flex flex-1 flex-col gap-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm">
                      <Check
                        size={18}
                        className={`mt-0.5 shrink-0 ${
                          tier.popular ? "text-ink" : "text-lime"
                        }`}
                      />
                      <span
                        className={
                          tier.popular ? "text-ink/80" : "text-bone/70"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`mt-8 rounded-full px-6 py-3 text-center font-display text-sm font-extrabold transition-transform hover:scale-105 ${
                    tier.popular
                      ? "bg-ink text-lime"
                      : "bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  Get Started
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={240}>
          <p className="mt-8 text-sm text-bone/50">
            Ad spend (Meta/Google) is always billed directly to the client.
            Minimum engagement: 3 months.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

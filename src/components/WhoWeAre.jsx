import Reveal from "./Reveal.jsx";

export default function WhoWeAre() {
  return (
    <section id="who-we-are" className="border-t border-white/10 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="mb-6 font-display text-sm font-bold uppercase tracking-[0.25em] text-lime">
            Who We Are
          </p>
        </Reveal>
        <Reveal delay={80}>
          <p className="max-w-3xl font-display text-3xl font-bold leading-snug sm:text-4xl">
            DigiYouth Media is a digital marketing agency built around one
            idea: brands grow when strategy, storytelling and execution live
            under one roof — so premium clients get{" "}
            <span className="text-lime">one partner</span>, not five vendors.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

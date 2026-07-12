import { useState } from "react";
import { Mail, Phone, AtSign } from "lucide-react";
import Reveal from "./Reveal.jsx";
import { CONTACT_INFO } from "../data.js";

const initialForm = { name: "", email: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    // Swap this block for a real email/CRM integration (e.g. Formspree, Resend, HubSpot) when ready.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setStatus("sent");
    setForm(initialForm);
  }

  return (
    <section id="contact" className="border-t border-white/10 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="mb-4 font-display text-sm font-bold uppercase tracking-[0.25em] text-lime">
            Contact
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-3xl font-display text-4xl font-black leading-tight sm:text-5xl">
            Let&rsquo;s build something{" "}
            <span className="text-lime">premium clients notice.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-5">
          <Reveal delay={140} className="lg:col-span-2">
            <div className="flex h-full flex-col justify-between gap-8 rounded-2xl bg-card p-8">
              <div className="flex flex-col gap-6">
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center gap-4 text-bone/80 transition-colors hover:text-lime"
                >
                  <Mail className="text-lime" size={20} />
                  <span className="text-sm font-medium">
                    {CONTACT_INFO.email}
                  </span>
                </a>
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-4 text-bone/80 transition-colors hover:text-lime"
                >
                  <Phone className="text-lime" size={20} />
                  <span className="text-sm font-medium">
                    {CONTACT_INFO.phone}
                  </span>
                </a>
                <div className="flex items-center gap-4 text-bone/80">
                  <AtSign className="text-lime" size={20} />
                  <span className="text-sm font-medium">
                    {CONTACT_INFO.handle}
                  </span>
                </div>
              </div>
              <p className="text-sm text-bone/50">
                We reply to every audit request within one business day.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200} className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 rounded-2xl bg-card p-8"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-semibold">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-white placeholder:text-bone/40 focus:border-lime focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-semibold">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@brand.com"
                  className="rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-white placeholder:text-bone/40 focus:border-lime focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-semibold">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your brand and goals"
                  className="resize-none rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-white placeholder:text-bone/40 focus:border-lime focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-2 rounded-full bg-lime px-8 py-4 font-display text-sm font-extrabold text-ink transition-transform hover:scale-105 disabled:opacity-60"
              >
                {status === "sending"
                  ? "Sending..."
                  : status === "sent"
                  ? "Message Sent"
                  : "Book a Free Audit Call"}
              </button>

              {status === "sent" && (
                <p className="text-sm font-medium text-lime">
                  Thanks — we&rsquo;ll be in touch within one business day.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

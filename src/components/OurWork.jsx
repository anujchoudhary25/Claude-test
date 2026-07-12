import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal.jsx";
import { OUR_WORK } from "../data.js";
import { loadInstagramEmbedScript } from "../lib/instagramEmbed.js";

function InstagramCard({ url, delay }) {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new MutationObserver(() => {
      if (node.querySelector("iframe")) {
        setLoaded(true);
        observer.disconnect();
      }
    });
    observer.observe(node, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <Reveal delay={delay}>
      <div className="rounded-2xl bg-card p-3 transition-colors hover:bg-card-hover">
        <div className="relative min-h-[460px] overflow-hidden rounded-xl">
          <div ref={containerRef}>
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={url}
              data-instgrm-version="14"
              style={{ margin: 0, width: "100%", background: "#FFFFFF" }}
            />
          </div>

          <div
            className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-card transition-opacity duration-300 ${
              loaded ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-lime" />
            <p className="text-xs font-medium text-bone/40">Loading post…</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function OurWork() {
  useEffect(() => {
    loadInstagramEmbedScript().then(() => {
      window.instgrm?.Embeds?.process();
    });
  }, []);

  return (
    <section id="our-work" className="border-t border-white/10 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="mb-4 font-display text-sm font-bold uppercase tracking-[0.25em] text-lime">
            Our Work
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-2xl font-display text-4xl font-black leading-tight sm:text-5xl">
            Real content and campaigns we&rsquo;ve created for clients.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {OUR_WORK.map((item, i) => (
            <InstagramCard key={item.url} url={item.url} delay={i * 60} />
          ))}
        </div>
      </div>
    </section>
  );
}

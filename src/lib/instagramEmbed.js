export function loadInstagramEmbedScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.instgrm) return Promise.resolve();
  if (window.__instagramEmbedPromise) return window.__instagramEmbedPromise;

  window.__instagramEmbedPromise = new Promise((resolve) => {
    const existing = document.getElementById("instagram-embed-script");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.id = "instagram-embed-script";
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });

  return window.__instagramEmbedPromise;
}

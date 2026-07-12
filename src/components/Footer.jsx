import { Instagram, Linkedin } from "lucide-react";
import Logo from "./Logo.jsx";
import { CONTACT_INFO } from "../data.js";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Logo className="h-10 w-10" />
          <div>
            <p className="font-display text-sm font-extrabold tracking-wide">
              DIGI YOUTH MEDIA
            </p>
            <p className="mt-1 max-w-xs text-sm text-bone/50">
              Digital Growth, Built for Premium Brands.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm text-bone/60">
          <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-lime">
            {CONTACT_INFO.email}
          </a>
          <a
            href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
            className="hover:text-lime"
          >
            {CONTACT_INFO.phone}
          </a>
          <span>{CONTACT_INFO.handle}</span>
        </div>

        <div className="flex gap-4">
          <a
            href="#"
            aria-label="Instagram"
            className="rounded-full bg-card p-3 text-bone/70 transition-colors hover:text-lime"
          >
            <Instagram size={18} />
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            className="rounded-full bg-card p-3 text-bone/70 transition-colors hover:text-lime"
          >
            <Linkedin size={18} />
          </a>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-6xl px-6 text-xs text-bone/30">
        © {new Date().getFullYear()} DigiYouth Media. All rights reserved.
      </p>
    </footer>
  );
}

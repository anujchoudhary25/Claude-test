import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo.jsx";
import { NAV_LINKS } from "../data.js";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-ink/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Logo className="h-9 w-9" />
          <span className="font-display text-sm font-extrabold tracking-wide">
            DIGI YOUTH MEDIA
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-bone/80 transition-colors hover:text-lime"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full bg-lime px-5 py-2.5 text-sm font-bold text-ink transition-transform hover:scale-105"
          >
            Book a Call
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-white md:hidden"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-ink px-6 pb-6 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-bone/80 hover:text-lime"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-lime px-5 py-3 text-center text-sm font-bold text-ink"
            >
              Book a Call
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

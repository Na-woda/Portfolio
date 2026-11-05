import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navItems, profile } from "../data/portfolio";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActive(visible.target.id);
        }
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.1, 0.25, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled
          ? "border-line bg-cream/90 backdrop-blur-md"
          : "border-transparent bg-cream"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <a
          href="#home"
          className="font-serif text-lg tracking-tight text-ink md:text-xl"
        >
          {profile.name}
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`relative text-sm tracking-wide transition-colors ${
                active === item.id ? "text-sage-deep" : "text-muted hover:text-ink"
              }`}
            >
              {item.label}
              {active === item.id ? (
                <span className="absolute -bottom-1 left-0 h-px w-full bg-sage-deep" />
              ) : null}
            </a>
          ))}
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-sage-deep underline decoration-sage underline-offset-4 hover:text-ink"
          >
            LinkedIn
          </a>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-sm p-2 text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-line bg-cream px-5 py-6 md:hidden"
        >
          <nav className="flex flex-col gap-4" aria-label="Mobile">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="text-lg text-ink"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-lg text-sage-deep"
              onClick={() => setOpen(false)}
            >
              LinkedIn
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

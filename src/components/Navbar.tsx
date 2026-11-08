import { Menu, Moon, Sun, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { fadeDown } from "../animations/motion";
import { navItems, profile } from "../data/portfolio";

type Theme = "dark" | "light";

function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: Theme;
  onToggle: () => void;
}) {
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
      className="inline-flex size-10 items-center justify-center border border-line text-muted hover:border-sage-deep hover:text-ink"
    >
      {theme === "dark" ? (
        <Sun size={18} strokeWidth={1.8} aria-hidden />
      ) : (
        <Moon size={18} strokeWidth={1.8} aria-hidden />
      )}
    </button>
  );
}

export function Navbar({
  activeSection,
  theme,
  onThemeToggle,
}: {
  activeSection: string;
  theme: Theme;
  onThemeToggle: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
    <motion.header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled
          ? "border-line bg-cream/95 backdrop-blur-md"
          : "border-transparent bg-cream"
      }`}
      variants={fadeDown}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
        <a
          href="#home"
          className="font-sans text-base font-bold tracking-tight text-ink md:text-lg"
        >
          {profile.name}
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <motion.a
              key={item.id}
              href={item.href}
              aria-current={activeSection === item.id ? "page" : undefined}
              className={`relative text-sm transition-colors ${
                activeSection === item.id ? "text-sage-deep" : "text-muted hover:text-ink"
              }`}
              initial={false}
              animate={activeSection === item.id ? "active" : "rest"}
              whileHover="hover"
            >
              {item.label}
              <motion.span
                variants={{
                  rest: { scaleX: 0 },
                  active: { scaleX: 1 },
                  hover: { scaleX: 1 },
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-1 left-0 h-px w-full origin-left bg-sage-deep"
              />
            </motion.a>
          ))}
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-sage-deep hover:text-ink"
          >
            LinkedIn
          </a>
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center border border-line text-ink"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-line bg-cream px-5 py-6 md:hidden"
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-4" aria-label="Mobile">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                aria-current={activeSection === item.id ? "page" : undefined}
                className={`text-base ${
                  activeSection === item.id ? "text-sage-deep" : "text-ink"
                }`}
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
    </motion.header>
  );
}

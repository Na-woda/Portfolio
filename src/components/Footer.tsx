import { profile, socialLinks } from "../data/portfolio";

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream-2">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between md:px-8">
        <div>
          <p className="font-serif text-xl text-ink">{profile.name}</p>
          <p className="mt-1 text-sm text-muted">
            © 2026 {profile.legalName}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-5 text-sm">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              className="text-muted hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <a href="#home" className="text-sage-deep hover:text-ink">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}

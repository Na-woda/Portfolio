import { education, profile } from "../data/portfolio";

export function About() {
  return (
    <section id="about" className="border-t border-line bg-cream-2">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[0.4fr_1fr] md:px-8 md:py-24">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-sage-deep">
            01 / About
          </p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight text-ink">
            A student who learns by building
          </h2>
        </div>
        <div className="max-w-2xl space-y-5 text-base leading-relaxed text-muted">
          <p>
            I am {profile.legalName}, a software engineering undergraduate at
            The Open University of Sri Lanka. Most of what I know about
            product-shaped software has come from making it: storefronts, admin
            dashboards, scheduled messaging, and a mobile scanner that has to
            work with messy real-world labels.
          </p>
          <p>
            I care about interfaces that stay readable, APIs that are explicit,
            and the unglamorous details—auth, uploads, calendars, OCR parsing—
            that decide whether an idea is usable. I would rather finish a
            careful slice of a system than decorate a prototype that cannot run.
          </p>
          <p>
            I am looking for a software engineering internship where I can work
            with a team, contribute to software people actually use, and keep
            stretching my skills in web and mobile development.
          </p>

          <div className="mt-10 border-t border-line pt-8">
            {education.map((item) => (
              <article key={item.title}>
                <p className="text-xs uppercase tracking-[0.2em] text-sage-deep">
                  Education
                </p>
                <h3 className="mt-2 font-serif text-2xl text-ink">{item.title}</h3>
                <p className="mt-2 text-ink">{item.institution}</p>
                <p className="mt-1 text-sm text-muted">
                  {item.dates} · {item.location}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

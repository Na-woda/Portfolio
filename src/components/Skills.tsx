import { skillGroups } from "../data/portfolio";

export function Skills() {
  return (
    <section id="skills" className="border-t border-line bg-cream-2">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.28em] text-sage-deep">
            03 / Skills
          </p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight text-ink">
            Tools from coursework and projects
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            This list comes from my CV and from the repositories above. Appearance
            here means I have used the technology in study or project work, not a
            ranked proficiency score.
          </p>
        </div>
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.title} className="border-t border-line pt-5">
              <h3 className="font-serif text-2xl text-ink">{group.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

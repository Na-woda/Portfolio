import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "../data/portfolio";

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {project.github ? (
        <a
          href={project.github.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 border border-line bg-card px-4 py-2 text-sm text-ink hover:border-sage-deep"
        >
          {project.github.label}
          <ArrowUpRight size={14} aria-hidden />
        </a>
      ) : null}
      {project.live ? (
        <a
          href={project.live.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 bg-sage-deep px-4 py-2 text-sm text-cream hover:bg-ink"
        >
          {project.live.label}
          <ArrowUpRight size={14} aria-hidden />
        </a>
      ) : null}
    </div>
  );
}

function TechList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
      {items.map((tech, index) => (
        <li key={tech} className="inline-flex items-center gap-3">
          {index > 0 ? (
            <span className="text-sage" aria-hidden>
              /
            </span>
          ) : null}
          <span>{tech}</span>
        </li>
      ))}
    </ul>
  );
}

function ProjectBody({ project }: { project: Project }) {
  return (
    <>
      <p className="text-xs uppercase tracking-[0.24em] text-sage-deep">
        {project.number} / {project.subtitle}
      </p>
      <h3 className="mt-3 font-serif text-3xl tracking-tight text-ink md:text-4xl">
        {project.title}
      </h3>
      <p className="mt-4 text-base leading-relaxed text-muted">{project.summary}</p>
      <p className="mt-4 text-base leading-relaxed text-ink">{project.problem}</p>
      <p className="mt-4 text-base leading-relaxed text-muted">
        {project.contribution}
      </p>
      <ul className="mt-5 space-y-2 text-sm leading-relaxed text-ink">
        {project.features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-sage-deep" aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <TechList items={project.technologies} />
      {project.notes ? (
        <p className="mt-4 text-sm leading-relaxed text-muted">{project.notes}</p>
      ) : null}
      <ProjectLinks project={project} />
    </>
  );
}

export function Projects() {
  const featured = projects.find((project) => project.layout === "featured");
  const rest = projects.filter((project) => project.layout !== "featured");

  return (
    <section id="projects" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.28em] text-sage-deep">
            02 / Projects
          </p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight text-ink">
            Work I can point to
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            These are projects from my coursework and independent practice,
            described from the repositories, local source, and my CV. I have not
            included live demos or GitHub links unless they exist.
          </p>
        </div>

        {featured ? (
          <article className="mt-14 overflow-hidden border border-line bg-card">
            {featured.image ? (
              <figure className="border-b border-line">
                <img
                  src={featured.image.src}
                  alt={featured.image.alt}
                  className="h-[22rem] w-full object-cover object-center sm:h-[28rem]"
                />
              </figure>
            ) : null}
            <div className="grid gap-10 p-6 md:grid-cols-[0.9fr_1.1fr] md:p-10">
              <div className="hidden md:block">
                <p className="font-serif text-7xl leading-none text-sage">
                  {featured.number}
                </p>
              </div>
              <div>
                <ProjectBody project={featured} />
              </div>
            </div>
          </article>
        ) : null}

        <div className="mt-8 space-y-8">
          {rest.map((project, index) => (
            <article
              key={project.id}
              className="grid gap-8 border-t border-line pt-10 md:grid-cols-2 md:gap-14"
            >
              <div className={index % 2 === 1 ? "md:order-2" : undefined}>
                <ProjectBody project={project} />
              </div>
              <div
                className={`overflow-hidden border border-line bg-cream-2 ${
                  index % 2 === 1 ? "md:order-1" : ""
                }`}
              >
                {project.image ? (
                  <img
                    src={project.image.src}
                    alt={project.image.alt}
                    className="h-56 w-full object-cover sm:h-72"
                  />
                ) : null}
                <div className="flex min-h-40 flex-col justify-between p-6 md:p-8">
                  <p className="font-serif text-6xl text-sage">{project.number}</p>
                  <div>
                    <p className="font-serif text-2xl text-ink">{project.title}</p>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                      {project.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

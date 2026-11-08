import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { durations, easing, fadeUp, imageZoom, staggerContainer } from "../animations/motion";
import { projects, type Project } from "../data/portfolio";
import { Reveal } from "./Reveal";

const projectCardVariants: Variants = {
  ...fadeUp,
  rest: { opacity: 1, y: 0 },
  hover: {
    y: -6,
    transition: { duration: durations.fast, ease: easing },
  },
};

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {project.github ? (
        <motion.a
          href={project.github.href}
          data-guide-target={`project-github-${project.id}`}
          data-guide-kind="project-github"
          data-guide-label={project.title}
          target="_blank"
          rel="noreferrer"
          whileHover={{ y: -1 }}
          className="inline-flex items-center gap-1 border border-line bg-card px-4 py-2 text-sm text-ink hover:border-sage-deep"
        >
          {project.github.label}
          <motion.span whileHover={{ x: 3, y: -3 }} aria-hidden="true">
            <ArrowUpRight size={14} />
          </motion.span>
        </motion.a>
      ) : null}
      {project.live ? (
        <motion.a
          href={project.live.href}
          data-guide-target={`project-live-${project.id}`}
          data-guide-kind="project-live"
          data-guide-label={project.title}
          target="_blank"
          rel="noreferrer"
          whileHover={{ y: -1 }}
          className="button-primary inline-flex min-h-10 items-center gap-1 px-4 py-2 text-sm font-medium"
        >
          {project.live.label}
          <motion.span whileHover={{ x: 3, y: -3 }} aria-hidden="true">
            <ArrowUpRight size={14} />
          </motion.span>
        </motion.a>
      ) : null}
    </div>
  );
}

function TechList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {items.map((tech) => (
        <li
          key={tech}
          className="border border-line bg-cream px-2.5 py-1 text-xs text-muted"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}

function ProjectBody({ project }: { project: Project }) {
  return (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sage-deep">
        {project.number} / {project.subtitle}
      </p>
      <h3 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        {project.title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-muted">{project.summary}</p>
      <TechList items={project.technologies} />
      <details className="group mt-5 border-t border-line pt-4">
        <summary className="cursor-pointer list-none text-sm font-medium text-sage-deep marker:hidden focus-visible:outline">
          <span className="group-open:hidden">More about the project +</span>
          <span className="hidden group-open:inline">Less about the project −</span>
        </summary>
        <div className="mt-4 space-y-4">
          <p className="text-sm leading-6 text-ink">{project.problem}</p>
          <p className="text-sm leading-6 text-muted">{project.contribution}</p>
          <ul className="space-y-2 text-sm leading-relaxed text-ink">
            {project.features.map((feature) => (
              <li key={feature} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-sage-deep" aria-hidden />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          {project.notes ? (
            <p className="text-sm leading-relaxed text-muted">{project.notes}</p>
          ) : null}
        </div>
      </details>
      <ProjectLinks project={project} />
    </>
  );
}

export function Projects() {
  const reduceMotion = useReducedMotion();
  const featured = projects.find((project) => project.layout === "featured");
  const rest = projects.filter((project) => project.layout !== "featured");

  return (
    <section id="projects" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
        <Reveal className="max-w-2xl">
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
        </Reveal>

        {featured ? (
          <motion.article
            data-guide-target={`project-card-${featured.id}`}
            data-guide-kind="project-card"
            data-guide-label={featured.title}
            variants={projectCardVariants}
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={reduceMotion ? undefined : "hover"}
            transition={{ duration: durations.fast, ease: easing }}
            className="mt-12 overflow-hidden border border-line bg-card hover:shadow-lg"
          >
            {featured.image ? (
              <figure className="overflow-hidden border-b border-line">
                <motion.img
                  variants={imageZoom}
                  src={featured.image.src}
                  alt={featured.image.alt}
                  loading="lazy"
                  decoding="async"
                  className={`aspect-[16/7] w-full ${
                    featured.image.fit === "contain"
                      ? "object-contain"
                      : "object-cover object-center"
                  }`}
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
          </motion.article>
        ) : null}

        <motion.div
          variants={reduceMotion ? undefined : staggerContainer}
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-8 space-y-6"
        >
          {rest.map((project, index) => (
            <motion.article
              key={project.id}
              data-guide-target={`project-card-${project.id}`}
              data-guide-kind="project-card"
              data-guide-label={project.title}
              variants={projectCardVariants}
              initial={reduceMotion ? false : undefined}
              whileHover={reduceMotion ? undefined : "hover"}
              transition={{ duration: durations.fast, ease: easing }}
              className="grid gap-7 border border-line bg-card p-5 hover:shadow-lg sm:p-7 md:grid-cols-2 md:items-center md:gap-10 md:p-8"
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
                  <motion.img
                    variants={imageZoom}
                    src={project.image.src}
                    alt={project.image.alt}
                    loading="lazy"
                    decoding="async"
                    className={`aspect-[4/3] w-full ${
                      project.image.fit === "contain" ? "object-contain" : "object-cover"
                    }`}
                  />
                ) : null}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

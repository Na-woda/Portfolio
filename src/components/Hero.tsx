import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { profile } from "../data/portfolio";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)] md:px-8 md:py-24 lg:py-28">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-sage-deep">
            {profile.role}
          </p>
          <h1 className="max-w-[12ch] font-serif text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
            I study software engineering at The Open University of Sri Lanka and
            build web and mobile applications with React, Node.js, Express,
            MongoDB, and React Native. I am looking for a software engineering
            internship where I can contribute to reliable, user-focused software.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 bg-sage-deep px-5 py-3 text-sm text-cream transition-colors hover:bg-ink"
            >
              Explore my projects
              <ArrowDownRight size={16} aria-hidden />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border border-line bg-card px-5 py-3 text-sm text-ink transition-colors hover:border-sage-deep"
            >
              Contact me
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-muted hover:text-ink"
            >
              GitHub
              <ArrowUpRight size={14} aria-hidden />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-muted hover:text-ink"
            >
              LinkedIn
              <ArrowUpRight size={14} aria-hidden />
            </a>
            <a
              href={profile.resumeHref}
              className="inline-flex items-center gap-1 text-muted hover:text-ink"
            >
              Download CV
              <ArrowUpRight size={14} aria-hidden />
            </a>
          </div>
        </motion.div>

        <aside className="self-end">
          <img
            src="/LinkedIn%20DP.png"
            alt="Nawoda Lakshani"
            className="aspect-square w-full rounded-full border border-sage object-cover object-[center_32%]"
          />
          <dl className="mt-8 space-y-5 border-l border-sage pl-6 md:pl-8">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-sage-deep">
                Currently
              </dt>
              <dd className="mt-2 text-base leading-relaxed text-ink">
                BSc (Hons) in Software Engineering, 2023 — present
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-sage-deep">
                Based
              </dt>
              <dd className="mt-2 text-base text-ink">{profile.location}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-sage-deep">
                Focus
              </dt>
              <dd className="mt-2 text-base leading-relaxed text-ink">
                Full-stack web and mobile applications
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}

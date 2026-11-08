import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  arrowNudge,
  fadeDown,
  fadeUp,
  heroWord,
  lineDraw,
  scaleIn,
  staggerContainer,
} from "../animations/motion";
import { profile } from "../data/portfolio";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const nameParts = profile.name.split(" ");

  return (
    <section id="home" className="relative scroll-mt-24 overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:py-20 md:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.65fr)] md:items-center md:px-8 md:py-24">
        <motion.div
          variants={reduceMotion ? undefined : staggerContainer}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
        >
          <motion.p
            variants={fadeDown}
            className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep"
          >
            {profile.role}
          </motion.p>
          <motion.h1
            variants={reduceMotion ? undefined : staggerContainer}
            aria-label={profile.name}
            className="max-w-[12ch] font-serif text-5xl leading-[1.08] tracking-[-0.045em] text-ink sm:text-6xl"
          >
            {nameParts.map((part, index) => (
              <span
                key={`${part}-${index}`}
                className={`inline-block overflow-hidden align-bottom ${
                  index < nameParts.length - 1 ? "mr-3" : ""
                }`}
                aria-hidden="true"
              >
                <motion.span variants={heroWord} className="inline-block">
                  {part}
                </motion.span>
              </span>
            ))}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8"
          >
            I study software engineering at The Open University of Sri Lanka and
            build web and mobile applications with React, Node.js, Express,
            MongoDB, and React Native. I am looking for a software engineering
            internship where I can contribute to reliable, user-focused software.
          </motion.p>
          <motion.div
            variants={reduceMotion ? undefined : staggerContainer}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <motion.a
              variants={fadeUp}
              href="#projects"
              data-guide-target="home-explore"
              data-guide-kind="explore"
              whileHover={reduceMotion ? undefined : { y: -2 }}
              className="button-primary inline-flex min-h-12 items-center gap-2 px-5 py-3 text-sm font-medium transition-colors"
            >
              Explore my projects
              <motion.span
                variants={arrowNudge}
                initial="rest"
                whileHover="hover"
                aria-hidden="true"
              >
                <ArrowDownRight size={16} />
              </motion.span>
            </motion.a>
            <motion.a
              variants={fadeUp}
              href="#contact"
              data-guide-target="home-contact"
              data-guide-kind="contact"
              whileHover={reduceMotion ? undefined : { y: -2 }}
              className="inline-flex min-h-12 items-center gap-2 border border-line bg-card px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-sage-deep"
            >
              Contact me
            </motion.a>
          </motion.div>
          <motion.div
            variants={reduceMotion ? undefined : staggerContainer}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm"
          >
            <motion.a
              variants={fadeUp}
              href={profile.github}
              data-guide-target="home-github"
              data-guide-kind="github"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-muted underline decoration-line underline-offset-4 hover:text-sage-deep"
            >
              GitHub
              <motion.span
                variants={arrowNudge}
                initial="rest"
                whileHover="hover"
                aria-hidden="true"
              >
                <ArrowUpRight size={14} />
              </motion.span>
            </motion.a>
            <motion.a
              variants={fadeUp}
              href={profile.linkedin}
              data-guide-target="home-linkedin"
              data-guide-kind="linkedin"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-muted underline decoration-line underline-offset-4 hover:text-sage-deep"
            >
              LinkedIn
              <motion.span
                variants={arrowNudge}
                initial="rest"
                whileHover="hover"
                aria-hidden="true"
              >
                <ArrowUpRight size={14} />
              </motion.span>
            </motion.a>
            <motion.a
              variants={fadeUp}
              href={profile.resumeHref}
              download
              data-guide-target="home-cv"
              data-guide-kind="cv"
              className="inline-flex items-center gap-1 text-muted underline decoration-line underline-offset-4 hover:text-sage-deep"
            >
              Download CV
              <motion.span
                variants={arrowNudge}
                initial="rest"
                whileHover="hover"
                aria-hidden="true"
              >
                <ArrowUpRight size={14} />
              </motion.span>
            </motion.a>
          </motion.div>
        </motion.div>

        <aside className="mx-auto w-full max-w-[260px] md:justify-self-end">
          <div className="overflow-hidden border border-line bg-card p-1.5">
            <motion.img
              src="/LinkedIn%20DP.png"
              alt="Nawoda Lakshani"
              variants={scaleIn}
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
              className="aspect-[4/4.5] w-full object-cover object-[center_32%]"
            />
          </div>
          <dl className="relative mt-7 space-y-4 pl-5">
            <motion.span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-px origin-top bg-sage-deep"
              variants={lineDraw}
              initial={reduceMotion ? false : "hidden"}
              whileInView={reduceMotion ? undefined : "visible"}
              viewport={{ once: true, amount: 0.2 }}
            />
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sage-deep">
                Currently
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-ink">
                BSc (Hons) in Software Engineering, 2023 — present
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sage-deep">
                Based
              </dt>
              <dd className="mt-1.5 text-sm text-ink">{profile.location}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sage-deep">
                Focus
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-ink">
                Full-stack web and mobile applications
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}

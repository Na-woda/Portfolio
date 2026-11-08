import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer } from "../animations/motion";
import { skillGroups } from "../data/portfolio";
import { Reveal } from "./Reveal";

export function Skills() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="skills" className="scroll-mt-24 border-t border-line bg-cream-2">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
        <Reveal className="max-w-2xl">
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
        </Reveal>
        <motion.div
          variants={reduceMotion ? undefined : staggerContainer}
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {skillGroups.map((group) => (
            <motion.div
              key={group.title}
              data-guide-target={`skill-group-${group.title.toLowerCase()}`}
              data-guide-kind="skill-group"
              data-guide-label={group.title}
              variants={fadeUp}
              className="border-t border-line pt-5"
            >
              <h3 className="font-serif text-2xl text-ink">{group.title}</h3>
              <motion.ul
                variants={reduceMotion ? undefined : staggerContainer}
                initial={reduceMotion ? false : "hidden"}
                whileInView={reduceMotion ? undefined : "visible"}
                viewport={{ once: true, amount: 0.2 }}
                className="mt-4 flex flex-wrap gap-2"
              >
                {group.items.map((item) => (
                  <motion.li
                    key={item}
                    variants={fadeUp}
                    className="border border-line bg-card px-3 py-2 text-sm text-muted transition-colors hover:border-sage-deep hover:text-ink"
                  >
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

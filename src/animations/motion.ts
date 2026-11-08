import type { Variants } from "framer-motion";

export const easing = [0.22, 1, 0.36, 1] as const;

export const durations = {
  fast: 0.3,
  standard: 0.5,
  reveal: 0.6,
  slow: 0.8,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.reveal, ease: easing },
  },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.standard, ease: easing },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.08 },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.slow, ease: easing },
  },
};

export const lineDraw: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: durations.slow, ease: easing },
  },
};

export const heroWord: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.standard, ease: easing },
  },
};

export const imageZoom: Variants = {
  hidden: { scale: 1 },
  visible: { scale: 1 },
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: durations.standard, ease: easing } },
};

export const arrowNudge: Variants = {
  rest: { x: 0, y: 0 },
  hover: { x: 3, y: -3, transition: { duration: durations.fast, ease: easing } },
};
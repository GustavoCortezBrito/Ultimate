import type { Variants, Transition } from "framer-motion";

/* ── Shared easing & spring configs ── */
export const smooth: Transition = { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] };
export const snappy: Transition = { type: "spring", stiffness: 300, damping: 24 };
export const springBouncy: Transition = { type: "spring", stiffness: 180, damping: 12 };
export const springGentle: Transition = { type: "spring", stiffness: 100, damping: 18 };

/* ── Fade-up: default entrance for any block ── */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

/* ── Fade-down: for header, top bar ── */
export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

/* ── Stagger container ── */
export const stagger = (staggerMs = 0.08): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: staggerMs } },
});

/* ── Scale-in: for badges, icons ── */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 15 } },
};

/* ── Slide from left / right ── */
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};
export const slideRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

/* ── Floating items (infinite loop) ── */
export const float: Transition = {
  y: {
    duration: 3,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  },
};

/* ── Draw SVG Path (for timeline lines, checkboxes) ── */
export const drawPath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: "spring", duration: 1.5, bounce: 0 },
      opacity: { duration: 0.01 }
    }
  }
};

/* ── Viewport trigger defaults ── */
export const once = { once: true, margin: "-100px" as const };

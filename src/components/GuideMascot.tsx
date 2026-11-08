import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

const GUIDE_IMAGE = "/Waving%20Software%20Engineering%20Student%20Mascot.png";
const targetSelector = "[data-guide-target]";

const messages = {
  home: "Hi! 👋 Scroll down and I'll show you around.",
  about: "Here's a little about me.",
  explore: "Let's explore some of my projects!",
  contactLink: "Want to get in touch? Here's hoe to reach me.",
  cv: "Want to know more about my experience? Take a look at my CV!",
  github: "Want to see how it was built? Visit the GitHub project.",
  linkedin: "Let's connect on LinkedIn.",
  projectCard: (title: string) => `Here's ${title}, one of my projects.`,
  liveDemo: (title: string) => `Want to see ${title} in action? Try the live demo!`,
  projectGithub: (title: string) => `Explore the code behind ${title} on GitHub.`,
  skillGroup: (title: string) => `${title}: tools and technologies I work with.`,
  contactForm: "Say hi! I'd love to hear from you.",
  contactSend: "Ready to connect? Drop me a message!.",
  fallback: "Feel free to explore my portfolio!",
};

type MascotState = "idle" | "walking" | "talking";

function isInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom > 0 &&
    rect.top < window.innerHeight &&
    rect.right > 0 &&
    rect.left < window.innerWidth
  );
}

function getTargetMessage(element: HTMLElement) {
  const kind = element.dataset.guideKind;
  const label = element.dataset.guideLabel ?? "this project";

  switch (kind) {
    case "explore":
      return messages.explore;
    case "contact":
      return messages.contactLink;
    case "about":
      return messages.about;
    case "cv":
      return messages.cv;
    case "github":
    case "project-github":
      return kind === "project-github" ? messages.projectGithub(label) : messages.github;
    case "linkedin":
      return messages.linkedin;
    case "project-card":
      return messages.projectCard(label);
    case "project-live":
      return messages.liveDemo(label);
    case "skill-group":
      return messages.skillGroup(label);
    case "contact-form":
      return messages.contactForm;
    case "contact-send":
      return messages.contactSend;
    default:
      return messages.fallback;
  }
}

function getTargetPriority(element: HTMLElement) {
  const priorities: Record<string, number> = {
    explore: 0,
    about: 0,
    "project-live": 0,
    "project-card": 1,
    "skill-group": 0,
    "contact-form": 0,
    cv: 0,
    "contact-send": 1,
    contact: 1,
    "project-github": 2,
    github: 2,
    linkedin: 3,
  };

  return priorities[element.dataset.guideKind ?? ""] ?? 4;
}

export function GuideMascot({ activeSection }: { activeSection: string }) {
  const reduceMotion = useReducedMotion();
  const entranceControls = useAnimationControls();
  const facing = useMotionValue(1);
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 90, damping: 24, mass: 0.8 });
  const y = useSpring(targetY, { stiffness: 90, damping: 24, mass: 0.8 });
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [landed, setLanded] = useState(false);
  const [currentTargetId, setCurrentTargetId] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  const mascotStateRef = useRef<MascotState>("idle");
  const hoveredRef = useRef(false);
  const activeSectionRef = useRef(activeSection);
  const previousSectionRef = useRef(activeSection);
  const visibleTargetsRef = useRef(new Map<string, HTMLElement>());
  const announcedTargetsRef = useRef(new Set<string>());
  const activeTargetRef = useRef<HTMLElement | null>(null);
  const activeTargetIdRef = useRef<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const scheduleNextRef = useRef<() => void>(() => undefined);
  const autoHideRef = useRef<number | null>(null);
  const movementTimerRef = useRef<number | null>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);
  const scrollIntentRef = useRef(false);
  const sectionTransitionRef = useRef(0);

  const changeState = useCallback((nextState: MascotState) => {
    mascotStateRef.current = nextState;
    setMascotState(nextState);
  }, []);

  const clearTimers = useCallback(() => {
    if (autoHideRef.current !== null) window.clearTimeout(autoHideRef.current);
    if (movementTimerRef.current !== null) window.clearTimeout(movementTimerRef.current);
    autoHideRef.current = null;
    movementTimerRef.current = null;
  }, []);

  const clearHighlight = useCallback(() => {
    activeTargetRef.current?.classList.remove("guide-target-active");
    activeTargetRef.current = null;
    activeTargetIdRef.current = null;
    setCurrentTargetId(null);
    targetX.set(0);
    targetY.set(0);
    facing.set(1);
  }, [facing, targetX, targetY]);

  const cancelGuide = useCallback(() => {
    clearTimers();
    entranceControls.stop();
    sectionTransitionRef.current += 1;
    clearHighlight();
    changeState("idle");
    setCurrentMessage("");
  }, [changeState, clearHighlight, clearTimers, entranceControls]);

  const positionByTarget = useCallback(
    (element: HTMLElement) => {
      if (reduceMotion || !isInViewport(element) || !buttonRef.current) return;

      const rect = element.getBoundingClientRect();
      const mascotWidth = buttonRef.current.offsetWidth;
      const mascotHeight = buttonRef.current.offsetHeight;
      const viewportMargin = window.innerWidth < 768 ? 12 : 20;
      const rightMargin = window.innerWidth < 768 ? 12 : 20;
      const bottomMargin = window.innerWidth < 768 ? 12 : 20;
      const gap = window.innerWidth < 640 ? 6 : 10;
      const viewportWidth = document.documentElement.clientWidth;
      const targetOnRight = rect.left + rect.width / 2 > viewportWidth / 2;
      const leftCandidate = targetOnRight
        ? rect.left - mascotWidth - gap
        : rect.right + gap;
      const alternateCandidate = targetOnRight
        ? rect.right + gap
        : rect.left - mascotWidth - gap;
      const minLeft = viewportMargin;
      const maxLeft = Math.max(minLeft, viewportWidth - mascotWidth - viewportMargin);
      const preferredLeft =
        leftCandidate >= minLeft && leftCandidate <= maxLeft
          ? leftCandidate
          : alternateCandidate;
      const targetLeft = Math.min(maxLeft, Math.max(minLeft, preferredLeft));
      const visibleTop = Math.max(rect.top, 72);
      const visibleBottom = Math.min(rect.bottom, window.innerHeight - 12);
      const desiredTop = (visibleTop + visibleBottom - mascotHeight) / 2;
      const maxTop = Math.max(72, window.innerHeight - mascotHeight - bottomMargin);
      const targetTop = Math.min(maxTop, Math.max(72, desiredTop));
      const baseLeft = viewportWidth - rightMargin - mascotWidth;
      const baseTop = window.innerHeight - bottomMargin - mascotHeight;

      facing.set(targetLeft < rect.left ? 1 : -1);
      targetX.set(targetLeft - baseLeft);
      targetY.set(targetTop - baseTop);
    }, [facing, reduceMotion, targetX, targetY]);

  const finishTargetMove = useCallback(
    (element: HTMLElement, targetId: string, message: string) => {
      if (activeTargetRef.current !== element || !isInViewport(element)) {
        cancelGuide();
        return;
      }

      const showBubble = () => {
        if (activeTargetRef.current !== element) return;
        announcedTargetsRef.current.add(targetId);
        setCurrentTargetId(targetId);
        setCurrentMessage(message);
        changeState("talking");
        autoHideRef.current = window.setTimeout(() => {
          clearTimers();
          clearHighlight();
          setCurrentMessage("");
          changeState("idle");
          if (scrollIntentRef.current) {
            movementTimerRef.current = window.setTimeout(() => scheduleNextRef.current(), 350);
          }
        }, 5000);
      };

      if (reduceMotion) {
        showBubble();
        return;
      }

      void entranceControls.start({
        y: -14,
        transition: { type: "spring", stiffness: 190, damping: 12 },
      });
      movementTimerRef.current = window.setTimeout(() => {
        void entranceControls.start({
          y: 0,
          transition: { type: "spring", stiffness: 190, damping: 14 },
        });
        movementTimerRef.current = window.setTimeout(showBubble, 350);
      }, 180);
    }, [cancelGuide, changeState, clearHighlight, clearTimers, entranceControls, reduceMotion]);

  const startTarget = useCallback(
    (element: HTMLElement) => {
      const targetId = element.dataset.guideTarget;
      if (!targetId || !isInViewport(element)) return;

      clearTimers();
      activeTargetRef.current?.classList.remove("guide-target-active");
      activeTargetRef.current = element;
      activeTargetIdRef.current = targetId;
      element.classList.add("guide-target-active");
      setCurrentTargetId(targetId);
      setCurrentMessage(getTargetMessage(element));
      positionByTarget(element);
      scrollIntentRef.current = false;

      if (reduceMotion) {
        finishTargetMove(element, targetId, getTargetMessage(element));
        return;
      }

      changeState("walking");
      movementTimerRef.current = window.setTimeout(
        () => finishTargetMove(element, targetId, getTargetMessage(element)),
        750,
      );
    }, [changeState, clearTimers, finishTargetMove, positionByTarget, reduceMotion],
  );

  const scheduleNextTarget = useCallback(() => {
    if (
      !landed ||
      hoveredRef.current ||
      mascotStateRef.current !== "idle" ||
      !scrollIntentRef.current
    ) {
      return;
    }

    const sectionId = activeSectionRef.current;
    const nextTarget = [...visibleTargetsRef.current.values()]
      .filter((element) => {
        const targetId = element.dataset.guideTarget;
        return (
          targetId &&
          element.closest("section")?.id === sectionId &&
          !announcedTargetsRef.current.has(targetId) &&
          isInViewport(element)
        );
      })
      .sort((first, second) => getTargetPriority(first) - getTargetPriority(second))[0];

    if (nextTarget) startTarget(nextTarget);
  }, [landed, startTarget]);

  useEffect(() => {
    scheduleNextRef.current = scheduleNextTarget;
  }, [scheduleNextTarget]);

  useEffect(() => {
    let cancelled = false;
    let landingTimer = 0;
    const entranceTimer = window.setTimeout(() => {
      void entranceControls.start({
          opacity: 1,
          y: 0,
          transition: reduceMotion
            ? { duration: 0.45, ease: "easeOut" }
            : { type: "spring", stiffness: 120, damping: 14 },
        });
      landingTimer = window.setTimeout(() => {
        if (cancelled) return;
        setLanded(true);
        if (activeSectionRef.current !== "home" || scrollIntentRef.current) {
          changeState("idle");
          movementTimerRef.current = window.setTimeout(
            () => scheduleNextRef.current(),
            0,
          );
          return;
        }

          setCurrentMessage(messages.home);
          changeState("talking");
          autoHideRef.current = window.setTimeout(() => {
            autoHideRef.current = null;
            setCurrentMessage("");
            changeState("idle");
            if (scrollIntentRef.current) {
              movementTimerRef.current = window.setTimeout(
                () => scheduleNextRef.current(),
                350,
              );
            }
          }, 5000);
      }, reduceMotion ? 450 : 850);
    }, 1200);

    return () => {
      cancelled = true;
      window.clearTimeout(entranceTimer);
      window.clearTimeout(landingTimer);
      clearTimers();
      entranceControls.stop();
    };
  }, [changeState, clearTimers, entranceControls, reduceMotion]);

  useEffect(() => {
    activeSectionRef.current = activeSection;
    if (previousSectionRef.current === activeSection) return undefined;
    previousSectionRef.current = activeSection;
    scrollIntentRef.current = true;
    const transitionTimer = window.setTimeout(() => {
      cancelGuide();
      scrollIntentRef.current = true;
      scheduleNextRef.current();
    }, 0);

    return () => window.clearTimeout(transitionTimer);
  }, [activeSection, cancelGuide]);

  useEffect(() => {
    const observed = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement;
          const targetId = element.dataset.guideTarget;
          if (!targetId) continue;
          if (entry.isIntersecting) {
            visibleTargetsRef.current.set(targetId, element);
          } else {
            visibleTargetsRef.current.delete(targetId);
            if (activeTargetRef.current === element && !isInViewport(element)) {
              cancelGuide();
            }
          }
        }
        scheduleNextRef.current();
      },
      { rootMargin: "0px", threshold: 0.01 },
    );
    const resizeObserver = new ResizeObserver(() => {
      const activeTarget = activeTargetRef.current;
      if (activeTarget && isInViewport(activeTarget)) positionByTarget(activeTarget);
    });
    const scanTargets = () => {
      document.querySelectorAll<HTMLElement>(targetSelector).forEach((element) => {
        if (observed.has(element)) return;
        observed.add(element);
        observer.observe(element);
        resizeObserver.observe(element);
      });
    };
    const mutationObserver = new MutationObserver(scanTargets);
    scanTargets();
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [cancelGuide, positionByTarget]);

  useEffect(() => {
    const updateCurrentTarget = () => {
      const target = activeTargetRef.current;
      if (target) {
        if (isInViewport(target)) {
          positionByTarget(target);
        } else {
          cancelGuide();
        }
      }
      scheduleNextRef.current();
    };
    const onScroll = () => {
      const currentY = window.scrollY;
      if (Math.abs(currentY - lastScrollYRef.current) > 4) {
        scrollIntentRef.current = true;
        lastScrollYRef.current = currentY;
      }
      if (
        mascotStateRef.current === "talking" &&
        activeTargetIdRef.current === null
      ) {
        clearTimers();
        setCurrentMessage("");
        changeState("idle");
      }
      if (scrollFrameRef.current !== null) return;
      scrollFrameRef.current = window.requestAnimationFrame(() => {
        scrollFrameRef.current = null;
        updateCurrentTarget();
      });
    };
    const onResize = () => {
      const target = activeTargetRef.current;
      if (target && isInViewport(target)) positionByTarget(target);
      scheduleNextRef.current();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, [cancelGuide, changeState, clearTimers, positionByTarget]);

  const handlePointerEnter = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "touch") return;
    hoveredRef.current = true;
    if (mascotStateRef.current === "walking") {
      clearTimers();
      finishTargetMove(
        activeTargetRef.current as HTMLElement,
        activeTargetIdRef.current ?? "",
        currentMessage,
      );
    }
  };

  const handlePointerLeave = () => {
    hoveredRef.current = false;
    scheduleNextRef.current();
  };

  const handleClick = () => {
    if (mascotStateRef.current === "talking") {
      if (autoHideRef.current !== null) window.clearTimeout(autoHideRef.current);
      autoHideRef.current = window.setTimeout(() => {
        clearHighlight();
        setCurrentMessage("");
        changeState("idle");
      }, 5000);
      return;
    }
    if (activeTargetRef.current) {
      finishTargetMove(
        activeTargetRef.current,
        activeTargetIdRef.current ?? "",
        currentMessage,
      );
      return;
    }
    scrollIntentRef.current = true;
    scheduleNextRef.current();
  };

  const walking = mascotState === "walking";
  const bubbleVisible = mascotState === "talking" && Boolean(currentMessage);

  return (
    <motion.div
      className="pointer-events-none fixed bottom-3 right-3 z-40 flex flex-col items-end md:bottom-5 md:right-5"
      style={{ x, y }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {bubbleVisible ? (
          <motion.div
            key={currentTargetId ?? `intro-${activeSection}`}
            role="status"
            aria-live="polite"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.35, ease: "easeOut" }}
            className="pointer-events-none relative mb-2 w-40 origin-bottom-right border border-line bg-card px-2.5 py-2 text-[11px] leading-relaxed text-ink shadow-md sm:w-52 sm:px-3 sm:text-xs md:mb-3 md:w-60 md:px-4 md:py-3 md:text-sm"
          >
            {currentMessage}
            <span
              aria-hidden="true"
              className="absolute -bottom-1.5 right-4 size-3 rotate-45 border-b border-r border-line bg-card"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-0 right-[17px] h-2 w-3 bg-card"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        ref={buttonRef}
        type="button"
        aria-label="Portfolio guide mascot"
        aria-expanded={bubbleVisible}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -120 }}
        animate={entranceControls}
        className="pointer-events-auto block aspect-[2/3] h-[78px] w-auto cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep md:h-[132px]"
      >
        {imageFailed ? (
          <span
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center rounded-full border border-sage bg-cream text-3xl shadow-sm"
          >
            👩🏻‍💻
          </span>
        ) : (
          <motion.img
            src={GUIDE_IMAGE}
            alt="Portfolio guide mascot"
            onError={() => setImageFailed(true)}
            style={{ scaleX: facing }}
            animate={
              reduceMotion
                ? { y: 0, rotate: 0 }
                : walking
                  ? { y: [0, -4, 0], rotate: [-3, 3, -3] }
                  : { y: [0, -2, 0], rotate: [-2, 2, -2] }
            }
            transition={
              walking
                ? {
                    y: { duration: 0.35, repeat: 3, ease: "easeInOut" },
                    rotate: { duration: 1.2, ease: "easeInOut" },
                  }
                : {
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  }
            }
            className="h-full w-full object-contain"
          />
        )}
      </motion.button>
    </motion.div>
  );
}
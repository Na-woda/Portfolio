import { useEffect, useState } from "react";

export function useScrollSpy(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!sections.length) return undefined;

    let observer: IntersectionObserver | undefined;
    const observeSections = () => {
      observer?.disconnect();
      // Vertical root-margin percentages resolve against width, so use viewport-height pixels.
      const topMargin = Math.round(window.innerHeight * 0.4);
      const bottomMargin = Math.round(window.innerHeight * 0.5);
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

          if (visible?.target.id) setActiveSection(visible.target.id);
        },
        {
          rootMargin: `-${topMargin}px 0px -${bottomMargin}px 0px`,
          threshold: 0,
        },
      );

      sections.forEach((section) => observer?.observe(section));
    };

    observeSections();
    window.addEventListener("resize", observeSections);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", observeSections);
    };
  }, [sectionIds]);

  return activeSection;
}
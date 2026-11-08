import { MotionConfig } from "framer-motion";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { GuideMascot } from "./components/GuideMascot";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { Projects } from "./components/Projects";
import { ScrollProgress } from "./components/ScrollProgress";
import { Skills } from "./components/Skills";
import { navItems } from "./data/portfolio";
import { useScrollSpy } from "./hooks/useScrollSpy";
import { useEffect, useState } from "react";

const sectionIds = navItems.map((item) => item.id);

type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function App() {
  const activeSection = useScrollSpy(sectionIds);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-svh bg-cream text-ink">
        <ScrollProgress />
        <a href="#home" className="skip-link">
          Skip to content
        </a>
        <Navbar
          activeSection={activeSection}
          theme={theme}
          onThemeToggle={() =>
            setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))
          }
        />
        <main>
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Contact />
        </main>
        <GuideMascot activeSection={activeSection} />
        <Footer />
      </div>
    </MotionConfig>
  );
}

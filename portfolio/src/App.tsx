import { useEffect, useState } from "react";
import UnityEmbed from "./UnityEmbed";
import ProjectsPanel from "./ProjectsPanel";
import ExperiencePanel from "./ExperiencePanel";
import AboutPanel from "./AboutPanel";
import Fallback2D from "./Fallback2D";
import "./App.css";

export default function App() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [experienceOpen, setExperienceOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!event.data) return;

      if (event.data.type === "UNITY_NAV") {
        const section = event.data.section?.toLowerCase?.() ?? "";
        console.log("🔥 Unity triggered:", section);

        if (section === "projects") {
          setProjectsOpen(true);
        } else if (section === "experience") {
          setExperienceOpen(true);
        } else if (section === "about" || section === "about me" || section === "aboutme") {
          setAboutOpen(true);
        } else if (section === "github") {
          window.open("https://github.com/akashkothari2007", "_blank", "noopener,noreferrer");
        } else if (section === "resume") {
          window.open("/Akash_Kothari_Resume-3.pdf", "_blank", "noopener,noreferrer");
        } else if (section === "linkedin") {
          window.open("https://linkedin.com/in/akashkothari07", "_blank", "noopener,noreferrer");
        }
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (!projectsOpen && !experienceOpen && !aboutOpen) {
      const iframe = document.querySelector(".unity-iframe") as HTMLIFrameElement | null;
      if (iframe) {
        requestAnimationFrame(() => {
          try {
            const canvas = iframe.contentDocument?.querySelector("#unity-canvas") as HTMLElement | null;
            (canvas ?? iframe).focus();
          } catch {
            iframe.focus();
          }
        });
      }
    }
  }, [projectsOpen, experienceOpen, aboutOpen]);

  const openProjects = () => {
    setProjectsOpen(true);
  };

  const openExperience = () => {
    setExperienceOpen(true);
  };

  const openAbout = () => {
    setAboutOpen(true);
  };

  const scrollToFallback = () => {
    setProjectsOpen(false);
    setExperienceOpen(false);
    setAboutOpen(false);
    const el = document.getElementById("fallback-2d");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isMobile) {
    return (
      <div className="app">
        <Fallback2D isMobile />
      </div>
    );
  }

  return (
    <div className="app">
      <section className="hero">
        <UnityEmbed />
        <ProjectsPanel isOpen={projectsOpen} onClose={() => setProjectsOpen(false)} />
        <ExperiencePanel isOpen={experienceOpen} onClose={() => setExperienceOpen(false)} />
        <AboutPanel isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
        <div className="hero-hint">
          Click around the room to explore projects, experience, and more.
        </div>
        <header className="header">
          <span className="header-name">Akash Kothari</span>
          <nav className="header-nav">
            <button className="header-btn" onClick={openProjects}>
              Projects
            </button>
            <button className="header-btn" onClick={openExperience}>
              Experience
            </button>
            <button className="header-btn" onClick={openAbout}>
              About
            </button>
            <div className="header-divider" />
            <a
              href="/Akash_Kothari_Resume-6.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="header-btn header-btn-accent"
            >
              Resume ↗
            </a>
            <button className="header-btn" onClick={scrollToFallback}>
              View 2D ↓
            </button>
          </nav>
        </header>
      </section>

      <Fallback2D />
    </div>
  );
}


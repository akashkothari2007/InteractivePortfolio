import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import UnityEmbed from "./UnityEmbed";
import ProjectsPanel from "./ProjectsPanel";
import ExperiencePanel from "./ExperiencePanel";
import AboutPanel from "./AboutPanel";
import Fallback2D from "./Fallback2D";
import "./App.css";

export default function App() {
  //check if the device is mobile
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  //check if the projects panel is open
  const [projectsOpen, setProjectsOpen] = useState(false);
  //check if the experience panel is open
  const [experienceOpen, setExperienceOpen] = useState(false);
  //check if the about panel is open
  const [aboutOpen, setAboutOpen] = useState(false);

  //Resize function set up.Based on device
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  //handle messages from unity
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
          window.open("/Akash_Kothari_Resume.pdf", "_blank", "noopener,noreferrer");
        } else if (section === "linkedin") {
          window.open("https://linkedin.com/in/akashkothari07", "_blank", "noopener,noreferrer");
        }
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  //reset focus to unity canvas when panels are closed
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

  //state functions
  const openProjects = () => {
    setProjectsOpen(true);
  };

  const openExperience = () => {
    setExperienceOpen(true);
  };

  const openAbout = () => {
    setAboutOpen(true);
  };
// when u press view 2d
  const scrollToFallback = () => {
    setProjectsOpen(false);
    setExperienceOpen(false);
    setAboutOpen(false);
    const el = document.getElementById("fallback-2d");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };
// plain boring fallback 2d for mobile :()
  if (isMobile) {
    return (
      <div className="app">
        <Fallback2D isMobile />
        <Analytics />
      </div>
    );
  }

  return (
    <div className="app">
      <Analytics />
      <section className="hero">
        {/* Unity Embed */}
        <UnityEmbed />
        {/* Projects Panel */}
        <ProjectsPanel isOpen={projectsOpen} onClose={() => setProjectsOpen(false)} />
        {/* Experience Panel */}
        <ExperiencePanel isOpen={experienceOpen} onClose={() => setExperienceOpen(false)} />
        {/* About Panel */}
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
              href="/Akash_Kothari_Resume.pdf"
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

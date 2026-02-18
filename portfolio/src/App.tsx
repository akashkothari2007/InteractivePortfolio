import { useEffect, useState } from "react";
import UnityEmbed from "./UnityEmbed";
import ProjectsPanel from "./ProjectsPanel";
import "./App.css";

export default function App() {
  const [projectsOpen, setProjectsOpen] = useState(false);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!event.data) return;

      if (event.data.type === "UNITY_NAV") {
        const section = event.data.section?.toLowerCase?.() ?? "";
        console.log("🔥 Unity triggered:", section);

        if (section === "projects") {
          setProjectsOpen(true);
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
    if (!projectsOpen) {
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
  }, [projectsOpen]);

  return (
    <div className="app">
      <UnityEmbed />
      <ProjectsPanel isOpen={projectsOpen} onClose={() => setProjectsOpen(false)} />
      <header className="header">
        <span className="header-name">Akash Kothari</span>
        <nav className="header-nav">
          <button className="header-btn">Projects</button>
          <button className="header-btn">Experience</button>
          <button className="header-btn">Contact</button>
        </nav>
      </header>
    </div>
  );
}
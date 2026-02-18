import { useRef, useEffect, useState } from "react";

function playBlip(type: "open" | "close" | "select" = "open") {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const freq = type === "open" ? 720 : type === "close" ? 520 : 620;
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
  } catch {
    /* noop */
  }
}

interface Project {
  id: string;
  name: string;
  description: string;
  image?: string;
  demoUrl?: string;
  githubUrl?: string;
}

interface ProjectsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  originX?: number;
  originY?: number;
}

const PROJECTS: Project[] = [
  {
    id: "alpha",
    name: "Project Alpha",
    description: "Coming soon",
    image: undefined,
    demoUrl: undefined,
    githubUrl: undefined,
  },
  {
    id: "beta",
    name: "Project Beta",
    description: "Coming soon",
    image: undefined,
    demoUrl: undefined,
    githubUrl: undefined,
  },
];

export default function ProjectsPanel({
  isOpen,
  onClose,
}: ProjectsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedProject(null);
      playBlip("open");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedProject) setSelectedProject(null);
        else onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, selectedProject]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="projects-overlay"
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          if (selectedProject) {
            setSelectedProject(null);
            playBlip("close");
          } else {
            playBlip("close");
            onClose();
          }
        }
      }}
    >
      <div
        ref={panelRef}
        className="projects-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="projects-close"
          onClick={() => {
            if (selectedProject) {
              setSelectedProject(null);
              playBlip("close");
            } else {
              playBlip("close");
              onClose();
            }
          }}
          aria-label={selectedProject ? "Back" : "Close"}
        >
          {selectedProject ? "←" : "×"}
        </button>

        {selectedProject ? (
          <div className="project-detail">
            <h2 className="project-detail-title">{selectedProject.name}</h2>
            <p className="project-detail-desc">{selectedProject.description}</p>

            <div className="project-detail-image">
              {selectedProject.image ? (
                <img src={selectedProject.image} alt={selectedProject.name} />
              ) : (
                <div className="project-detail-image-placeholder">
                  <span>Add image to project</span>
                </div>
              )}
            </div>

            <div className="project-detail-links">
              {selectedProject.demoUrl && (
                <a
                  href={selectedProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  View Demo →
                </a>
              )}
              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  GitHub →
                </a>
              )}
              {!selectedProject.demoUrl && !selectedProject.githubUrl && (
                <span className="project-links-placeholder">
                  Add demo & github URLs in ProjectsPanel.tsx
                </span>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="projects-header">PROJECTS — C:\</div>
            <div className="projects-separator" />
            <div className="projects-prompt">C:\&gt;_</div>

            <div className="projects-list">
              {PROJECTS.map((project) => (
                <div
                  key={project.id}
                  className="project-card"
                  onClick={() => {
                    playBlip("select");
                    setSelectedProject(project);
                  }}
                >
                  <div className="project-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <div className="project-info">
                    <span className="project-name">{project.name}</span>
                    <span className="project-desc">{project.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

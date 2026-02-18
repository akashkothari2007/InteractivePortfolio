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

export interface Project {
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

export const PROJECTS: Project[] = [
  {
    id: "mathora",
    name: "Mathora — AI‑Driven Interactive Math Visualizer",
    description:
      "Built an AI‑powered math visualization engine that plots functions, animates transformations, and walks through problem‑solving steps in real time using React Three Fiber, Three.js, and LLM‑driven timelines.",
    image: "/mathora.png",
    demoUrl: "https://youtube.com",
    githubUrl: "https://github.com/akashkothari2007/Mathora",
  },
  {
    id: "nba-predictor",
    name: "Yuno Ball - NBA Picks and Odds Predictor to make Educated Bets",
    description:
      "Scraped 9000 games of NBA data and trained multiple models such as XGBoost and Random Forest to predict game outcomes and scores, and compare with polymarket odds, all combined in a React environment with graded bets, parlay builder and a chatbot to understand reasons behind bets",
    image: "/nba.png",
    demoUrl: "https://youtu.be/U0FEb5V6Gc4",
    githubUrl: "https://github.com/akashkothari2007/NBA-Picks-and-Odds-Predictor",
  },
  {
    id: "lockin-ai",
    name: "LockIn AI — Distraction & Habit Detection App",
    description:
      "Prototype productivity app that uses YOLO + OpenCV to detect on‑screen distractions and provide real‑time feedback, with a Python backend and Next.js UI for session tracking and analytics.",
    image: "/lockin.png",
    demoUrl: "https://youtu.be/M90tyuMJuCk",
    githubUrl: "https://github.com/Daynel-Kem/LockInAI",
  },
  {
    id: "myroom",
    name: "Interactive 3D Personal Portfolio",
    description:
      "Used Unity to create an interactive 3D personal portfolio exported as webGL and embedded in React.js with panel overlays and animations and 2D fallbacks in case of load fails",
    image: "/room.png",
    githubUrl: "https://github.com/akashkothari2007/InteractivePortfolio",
  },
  {
    id: "finger-pointer",
    name: "Finger Pointer — Gyroscope‑Based Mouse",
    description:
      "Wearable finger‑mounted pointing device built with an ESP32, MPU6050 IMU, and custom firmware to control the mouse cursor and clicks via gestures, designed for alternative input accessibility.",
    image: "/fingerpointer.png",
    githubUrl: "https://github.com/akashkothari2007/FingerPointer",
  },
  {
    id: "gyro-robot",
    name: "Gyroscope Balancing Robot",
    description:
      "Self‑balancing robot using Arduino and robotics control to keep upright based on gyroscope feedback, with logged experiments and tuning for stability.",
    image: "/finalrobot.png",
    demoUrl: "https://www.youtube.com/shorts/jFM6bGMcFYE",
    githubUrl: "https://github.com/akashkothari2007/GyroscopeRobot",
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
      
            </div>
            <div className="project-detail-image">
              {selectedProject.image ? (
                <img src={selectedProject.image} alt={selectedProject.name} />
              ) : (
                <div className="project-detail-image-placeholder">
                  <span>Add image to project</span>
                </div>
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

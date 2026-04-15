import { useRef, useEffect, useState } from "react";
import ProjectImage from "./ProjectImage";

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
  images?: string[];
  demoUrl?: string;
  githubUrl?: string;
  techStack?: string;
}

interface ProjectsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  originX?: number;
  originY?: number;
}

export const PROJECTS: Project[] = [
  {
    id: "focusos",
    name: "FocusOS — Personal Productivity OS",
    description:
      "Full-stack productivity OS with an Azure OpenAI job-analysis pipeline that scores resume-job match, extracts ATS keywords, and generates tailored LaTeX resumes. Designed a multi-step background task pipeline with non-blocking AI calls, retry logic, and real-time status polling — deployed with Docker and PostgreSQL. Tracks session and habit metrics across 15+ days of continuous daily use via a normalized multi-table schema and React dashboard.",
    image: "/focusos.png",
    githubUrl: "https://github.com/akashkothari2007/FocusOS",
    techStack: "Python · FastAPI · PostgreSQL · Docker · React · TypeScript · Azure OpenAI · Microsoft Graph · OAuth 2.0 · Background Task Pipeline",
  },
  {
    id: "mercury-mortgages",
    name: "Mercury Mortgages — AI Expense Management System",
    description:
      "Full-stack expense management system for a local business processing 100+ receipts/week across 5 corporate cards, automating receipt matching and exportable expense reports — eliminating a manual role. Engineered a dual-ingestion pipeline (manual upload + email parsing via Microsoft Graph webhooks) with async background processing, threaded PDF conversion, and Azure OpenAI vision for field extraction. Built a rules engine mapping extracted vendor and location data to GL codes and sub-companies, with role-based access control and admin-gated expense report approvals and snapshots.",
    image: "/mercury.png",
    githubUrl: "https://github.com/akashkothari2007/KothariGroupReceiptSoftware",
    techStack: "FastAPI · PostgreSQL · React · Microsoft Graph · Azure OpenAI Vision · Webhooks · Async Background Jobs · RBAC · Rules Engine",
  },
  {
    id: "mathora",
    name: "Mathora — AI‑Driven Interactive Math Visualizer",
    description:
      "Built an AI‑powered math visualization engine that plots functions, animates transformations, and walks through problem‑solving steps in real time using React Three Fiber, Three.js, and LLM‑driven timelines.",
    image: "/mathora.png",
    demoUrl: "https://www.youtube.com/watch?v=CGYAKo7KKuw",
    githubUrl: "https://github.com/akashkothari2007/Mathora",
    techStack: "React · React Three Fiber · Three.js · TypeScript · LLM APIs · Custom Animation Timeline System · Node.js",
  },
  {
    id: "nba-predictor",
    name: "Yuno Ball - NBA Picks and Odds Predictor to make Educated Bets",
    description:
      "Scraped 9000 games of NBA data and trained multiple models such as XGBoost and Random Forest to predict game outcomes and scores, and compare with polymarket odds, all combined in a React environment with graded bets, parlay builder and a chatbot to understand reasons behind bets",
    image: "/nba.png",
    demoUrl: "https://youtu.be/U0FEb5V6Gc4",
    githubUrl: "https://github.com/akashkothari2007/NBA-Picks-and-Odds-Predictor",
    techStack: "Python · XGBoost · Random Forest · Pandas · Feature Engineering · Flask API · React · Data Scraping · Model Evaluation",
  },
  {
    id: "lockin-ai",
    name: "LockIn AI — Distraction & Habit Detection App",
    description:
      "Prototype productivity app that uses YOLO + OpenCV to detect on‑screen distractions and provide real‑time feedback, with a Python backend and Next.js UI for session tracking and analytics.",
    image: "/lockin.png",
    demoUrl: "https://youtu.be/M90tyuMJuCk",
    githubUrl: "https://github.com/Daynel-Kem/LockInAI",
    techStack: "Python · YOLO · OpenCV · FastAPI / Flask · Next.js · Real-Time Detection Pipeline · Session Analytics",
  },
  {
    id: "myroom",
    name: "Interactive 3D Personal Portfolio",
    description:
      "Used Unity to create an interactive 3D personal portfolio exported as webGL and embedded in React.js with panel overlays and animations and 2D fallbacks in case of load fails",
    image: "/room.png",
    githubUrl: "https://github.com/akashkothari2007/InteractivePortfolio",
    techStack: "Unity · WebGL · C# · React · TypeScript · WASM · Panel Animation Architecture · Progressive Fallback Design",
  },
  {
    id: "finger-pointer",
    name: "Finger Pointer — Gyroscope‑Based Mouse",
    description:
      "Wearable finger‑mounted pointing device built with an ESP32, MPU6050 IMU, and custom firmware to control the mouse cursor and clicks via gestures, designed for alternative input accessibility.",
    image: "/fingerpointer.png",
    githubUrl: "https://github.com/akashkothari2007/FingerPointer",
    techStack: "ESP32 · MPU6050 IMU · C/C++ · Embedded Firmware · Sensor Fusion · Serial Communication",
  },
  {
    id: "gyro-robot",
    name: "Gyroscope Balancing Robot",
    description:
      "Self‑balancing robot using Arduino and robotics control to keep upright based on gyroscope feedback, with logged experiments and tuning for stability.",
    image: "/finalrobot.png",
    demoUrl: "https://www.youtube.com/shorts/jFM6bGMcFYE",
    githubUrl: "https://github.com/akashkothari2007/GyroscopeRobot",
    techStack: "Arduino · MPU6050 · PID Control · Motor Drivers · Embedded C++ · Sensor Feedback Loops",
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
        onClick={(e) => e.stopPropagation()} // prevent clicks from bubbling up to the overlay
      >
        <div className="panel-titlebar">
          <div className="panel-traffic-lights">
            <button
              className="traffic-light traffic-light--close"
              onClick={() => { playBlip("close"); onClose(); }}
              aria-label="Close"
            />
            {selectedProject && (
              <button
                className="traffic-light traffic-light--minimize"
                onClick={() => { setSelectedProject(null); playBlip("close"); }}
                aria-label="Back to projects"
              />
            )}
          </div>
          <span className="panel-titlebar-title">
            {selectedProject ? `~/projects/${selectedProject.id}` : "~/projects"}
          </span>
        </div>

        {selectedProject ? (
          <div className="project-detail">
            <h2 className="project-detail-title">{selectedProject.name}</h2>
            <p className="project-detail-desc">{selectedProject.description}</p>

            {selectedProject.techStack && (
              <div className="project-detail-tech">
                <div className="tech-tags">
                  {selectedProject.techStack.split(" · ").map((t) => (
                    <span key={t} className="tech-tag">{t}</span>
                  ))}
                </div>
              </div>
            )}

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
            {((selectedProject.images && selectedProject.images.length > 1) ||
              Boolean(selectedProject.image)) && (
              <div className="project-detail-image">
                {selectedProject.images && selectedProject.images.length > 1 ? (
                  <div className="project-detail-images-row">
                    {selectedProject.images.map((src, i) => (
                      <ProjectImage key={i} src={src} alt={`${selectedProject.name} screenshot ${i + 1}`} />
                    ))}
                  </div>
                ) : (
                  <ProjectImage src={selectedProject.image!} alt={selectedProject.name} />
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="projects-list">
              {PROJECTS.map((project, i) => (
                <div
                  key={project.id}
                  className="project-card"
                  onClick={() => {
                    playBlip("select");
                    setSelectedProject(project);
                  }}
                >
                  <span className="project-index">{String(i + 1).padStart(2, "0")}</span>
                  <div className="project-info">
                    <span className="project-name">{project.name}</span>
                    <span className="project-desc">{project.description}</span>
                    {project.techStack && (() => {
                      const tags = project.techStack.split(" · ");
                      return (
                        <div className="tech-tags project-card-tech">
                          {tags.slice(0, 4).map((t) => (
                            <span key={t} className="tech-tag">{t}</span>
                          ))}
                          {tags.length > 4 && (
                            <span className="tech-tag-more">+{tags.length - 4}</span>
                          )}
                        </div>
                      );
                    })()}
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

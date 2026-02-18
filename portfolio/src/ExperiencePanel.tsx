import { useEffect, useState, useRef } from "react";

type BlipType = "open" | "close" | "select";

function playBlip(type: BlipType = "open") {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const freq =
      type === "open" ? 780 : type === "close" ? 540 : 660;

    osc.frequency.value = freq;
    osc.type = "sine";

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch {
    // ignore audio errors (e.g. autoplay restrictions)
  }
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  period: string;
  summary: string;
  tech?: string;
}

interface ExperiencePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EXPERIENCES: Experience[] = [
  {
    id: "exp1",
    company: "RamSoft",
    title: "AI/ML Powered Software Engineering Intern",
    period: "Jan 2026 – Present",
    summary:
      "Developing AI‑driven automation features for a healthcare workflow platform using open source and fine tuned models, backend services, and internal APIs. Contributing to a large enterprise C# codebase with auth, request validation, and robust unit tests. Working with Azure and using Kubernetes for deployments and management.",
    tech: "C# • Azure • Kubernetes • Microservices • Hugging Face • PyTorch",
  },
  {
    id: "exp2",
    company: "Tripleview Technologies",
    title: "Cloud Software Engineering Intern",
    period: "Jun 2025 – Sep 2025",
    summary:
      "Built cloud services to process Microsoft Teams call recordings end‑to‑end using Azure and Microsoft Graph, reducing manual work for support teams by over 10 hours a week. Implemented webhooks, polling logic, and AI‑powered summarization integrated into customer tooling.",
    tech: "C# • Azure • Microsoft Graph • Webhooks",
  },
  {
    id: "exp3",
    company: "Midbike Electrium Mobility (University of Waterloo)",
    title: "Embedded Firmware Developer",
    period: "Sep 2025 – Dec 2025",
    summary:
      "Designed and programmed motor‑control firmware for an e‑bike mid‑drive system, integrating sensors, safety logic, and real‑time feedback on a student design team.",
    tech: "Embedded C • Motor control • VESC",
  },
  {
    id: "exp4",
    company: "Mathnasium – The Math Learning Center",
    title: "Lead Instructor",
    period: "Sep 2023 – Sep 2025",
    summary:
      "Led instruction for students in grades 1–12, tutoring math concepts and mentoring new instructors in teaching methods.",
    tech: "Teaching • Communication • Mentorship",
  },
];

export default function ExperiencePanel({
  isOpen,
  onClose,
}: ExperiencePanelProps) {
  const [selected, setSelected] = useState<Experience | null>(EXPERIENCES[0]);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelected(EXPERIENCES[0]);
      playBlip("open");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selected && selected.id !== EXPERIENCES[0].id) {
          setSelected(EXPERIENCES[0]);
          playBlip("close");
        } else {
          playBlip("close");
          onClose();
        }
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
  }, [isOpen, onClose, selected]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="experience-overlay"
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          playBlip("close");
          onClose();
        }
      }}
    >
      <div
        className="experience-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="experience-close"
          onClick={() => {
            playBlip("close");
            onClose();
          }}
          aria-label="Close experience panel"
        >
          ×
        </button>

        <div className="experience-header">EXPERIENCE — main</div>
        <div className="experience-separator" />

        <div className="experience-layout">
          <div className="experience-timeline">
            <div className="experience-rail" />
            {EXPERIENCES.map((exp, index) => (
              <button
                key={exp.id}
                className={
                  "experience-node" +
                  (selected?.id === exp.id ? " is-active" : "")
                }
                onClick={() => {
                  setSelected(exp);
                  playBlip("select");
                }}
              >
                <div className="experience-node-inner">
                  <div className="experience-node-dot" />
                  <div className="experience-node-branch" />
                  <div className="experience-node-label">
                    <span className="experience-node-title">{exp.title}</span>
                    <span className="experience-node-company">
                      {exp.company}
                    </span>
                    <span className="experience-node-period">
                      {exp.period}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="experience-detail">
            <h2 className="experience-detail-title">{selected?.title}</h2>
            <p className="experience-detail-company">{selected?.company}</p>
            <p className="experience-detail-period">{selected?.period}</p>
            <p className="experience-detail-summary">{selected?.summary}</p>
            {selected?.tech && (
              <p className="experience-detail-tech">{selected.tech}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


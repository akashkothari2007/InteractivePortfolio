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
  current?: boolean;
}

interface ExperiencePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EXPERIENCES: Experience[] = [
  {
    id: "exp1",
    company: "RamSoft",
    title: "Software Engineering Intern · AI/ML",
    period: "Jan 2026 – Present",
    current: true,
    summary:
      "Built a MedASR transcription pipeline with chunked streaming and PyTorch word‑confidence scoring, cutting word error rate by 80% across 200 clinical audio samples. Designed a CosmosDB → SQL Server schema migration for a scheduling epic, producing normalized AppointmentV2 and Reservation tables with wall‑clock storage and full recurrence support. Stood up an internal MCP server for Azure SQL with MFA token auth, enabling natural‑language database queries for non‑technical teams. Cleaned up 50+ stale feature flags across the enterprise C# monorepo and unblocked CI/CD pipelines by repairing broken integration tests.",
    tech: "C# • Azure • Docker • Kubernetes • SQL Server • CosmosDB • PyTorch • MCP • CI/CD",
  },
  {
    id: "exp2",
    company: "Tripleview Technologies",
    title: "Cloud Software Engineering Intern",
    period: "Jun 2025 – Sep 2025",
    summary:
      "Automated Microsoft Teams call recording retrieval using Azure, Microsoft Graph, and C#, eliminating 10+ hours a week of manual work for customer support teams. Built an AI summarization pipeline with webhook triggers and polling logic that processes 8+ transcripts per hour into structured Zendesk tickets, reducing team miscommunication. Owned the full dev lifecycle end‑to‑end, shipping production Azure tooling now expanded across internal teams.",
    tech: "C# • Azure • Microsoft Graph • Webhooks • Zendesk • AI Summarization",
  },
  {
    id: "exp3",
    company: "Midbike Electrium Mobility (University of Waterloo)",
    title: "Embedded Firmware Developer",
    period: "Sep 2025 – Dec 2025",
    summary:
      "Designed and programmed motor‑control firmware for an e‑bike mid‑drive system on a student design team, integrating sensor input, safety interlocks, and real‑time feedback loops on a VESC‑based controller.",
    tech: "Embedded C • Motor control • VESC",
  },
  {
    id: "exp4",
    company: "Mathnasium – The Math Learning Center",
    title: "Lead Instructor",
    period: "Sep 2023 – Sep 2025",
    summary:
      "Led math instruction for 20+ students across grades 1–12, designing individualized learning plans and mentoring new instructors on teaching methodology and classroom management.",
    tech: "Teaching • Communication • Mentorship",
  },
];

export default function ExperiencePanel({
  isOpen,
  onClose,
}: ExperiencePanelProps) {
  const [selected, setSelected] = useState<Experience | null>(EXPERIENCES[0]);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  //if it opens (becomes true), default
  useEffect(() => {
    if (isOpen) {
      setSelected(EXPERIENCES[0]);
      playBlip("open");
    }
  }, [isOpen]);

  //handle escape key, if selected is not the first experience, set it to the first experience, otherwise close the panel
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
        <div className="panel-titlebar">
          <div className="panel-traffic-lights">
            <button
              className="traffic-light traffic-light--close"
              onClick={() => { playBlip("close"); onClose(); }}
              aria-label="Close"
            />
          </div>
          <span className="panel-titlebar-title">git log --oneline</span>
        </div>

        <div className="experience-layout">
          <div className="experience-timeline">
            <div className="experience-rail" />
            {EXPERIENCES.map((exp) => (
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
            <p className="experience-detail-company">{selected?.company}</p>
            <h2 className="experience-detail-title">{selected?.title}</h2>
            <p className="experience-detail-period">
              {selected?.period}
              {selected?.current && (
                <span className="exp-current-badge">
                  <span className="exp-current-dot" />
                  currently here
                </span>
              )}
            </p>
            <p className="experience-detail-summary">{selected?.summary}</p>
            {selected?.tech && (
              <div className="experience-detail-tech">
                <div className="tech-tags">
                  {selected.tech.split(" • ").map((t) => (
                    <span key={t} className="tech-tag">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


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
    id: "exp0",
    company: "Shopify",
    title: "Software Engineering Intern",
    period: "Sep 2026 – Dec 2026",
    summary:
      "Incoming software engineering intern at Shopify.",
  },
  {
    id: "exp1",
    company: "QuiikMart",
    title: "Full-Stack Software Engineering Intern",
    period: "May 2026 – Present",
    current: true,
    summary:
      "Built a recommendation engine with a nightly sweeper that rolls purchase totals into a baseline popularity store, layered with per-user signals and Redis caching for guest sessions. Built a bulk CSV product-upload system processing up to 1,000 products per upload with server-side validation, flexible column aliasing, category matching, and a two-step validate-then-import flow. Wrote 80+ unit and integration tests, validated features in staging environments, and shipped bug fixes across a NestJS/TypeScript and PostgreSQL codebase.",
    tech: "NestJS • TypeScript • PostgreSQL • Redis • REST APIs • Testing",
  },
  {
    id: "exp2",
    company: "RamSoft",
    title: "ML Software Engineering Intern",
    period: "Jan 2026 – Apr 2026",
    summary:
      "Built a real-time clinical transcription pipeline running MedASR (medical dictation) and WhisperFlow (voice commands) in parallel, fusing both streams via timestamp alignment and fuzzy word matching. Engineered chunked streaming, PyTorch word-confidence scoring, and a replay simulator for evaluation, cutting error rate by 80% across 200 clinical audio samples; deployed to Kubernetes via Azure Container Registry. Designed a Cosmos DB → SQL Server schema migration for a scheduling epic, with normalized appointment and reservation tables, wall-clock time storage, and full recurrence support. Built an internal MCP server for Azure SQL with MFA token auth, enabling natural-language database queries.",
    tech: "C# • Python • PyTorch • Azure • Docker • Kubernetes • SQL Server • CosmosDB • MCP",
  },
  {
    id: "exp3",
    company: "Midbike Electrium Mobility (University of Waterloo)",
    title: "Embedded Firmware Developer",
    period: "Sep 2025 – Dec 2025",
    summary:
      "Designed and programmed motor-control firmware for an e-bike mid-drive system on a student design team, integrating sensor input, safety interlocks, and real-time feedback loops on a VESC-based controller.",
    tech: "Embedded C • Motor Control • VESC",
  },
  {
    id: "exp4",
    company: "Tripleview Technologies",
    title: "Cloud Software Engineering Intern",
    period: "Jun 2025 – Sep 2025",
    summary:
      "Automated Teams call-recording retrieval with Azure, Microsoft Graph, and C#, removing 10+ hours/week of manual work for customer support teams. Built an AI summarization pipeline with webhook triggers and polling logic that turned 8+ transcripts/hour into structured Zendesk tickets, shipped to production and adopted across internal teams.",
    tech: "C# • Azure • Microsoft Graph • Webhooks • Zendesk • AI Summarization",
  },
  {
    id: "exp5",
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


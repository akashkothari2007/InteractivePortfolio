import { useEffect, useRef } from "react";

type BlipType = "open" | "close";

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

    const freq = type === "open" ? 760 : 540;
    osc.frequency.value = freq;
    osc.type = "sine";

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch {
    // ignore audio errors
  }
}

interface AboutPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutPanel({ isOpen, onClose }: AboutPanelProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      playBlip("open");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        playBlip("close");
        onClose();
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="about-overlay"
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          playBlip("close");
          onClose();
        }
      }}
    >
      <div className="about-panel" onClick={(e) => e.stopPropagation()}>
        <button
          className="about-close"
          onClick={() => {
            playBlip("close");
            onClose();
          }}
          aria-label="Close about panel"
        >
          ×
        </button>

        <div className="about-header">ABOUT ME — C:\</div>
        <div className="about-separator" />

        <div className="about-layout">
          <div className="about-guitar">
            <img
              src="/guitar.png"
              alt="Guitar illustration"
              className="about-guitar-img"
            />
          </div>

          <div className="about-content">
            <p className="about-line">
              Computer Engineering @ University of Waterloo.
            </p>
            <p className="about-line">
              I love building interactive systems that feel alive, from Unity
              worlds to AI‑driven tools.
            </p>
            <p className="about-line">
              On good days you&apos;ll find me coding, playing guitar, or
              combining the two into small experiments like this portfolio.
            </p>

            <div className="about-links">
              <a
                href="https://github.com/akashkothari2007"
                target="_blank"
                rel="noopener noreferrer"
                className="about-link"
              >
                GitHub →
              </a>
              <a
                href="https://linkedin.com/in/akashkothari07"
                target="_blank"
                rel="noopener noreferrer"
                className="about-link"
              >
                LinkedIn →
              </a>
              <a
                href="/Akash_Kothari_Resume-3.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="about-link"
              >
                Resume →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


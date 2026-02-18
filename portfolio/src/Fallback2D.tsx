import { useState, useEffect, useRef, type CSSProperties } from "react";
import { PROJECTS, type Project } from "./ProjectsPanel";
import { EXPERIENCES, type Experience } from "./ExperiencePanel";

export default function Fallback2D() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(
    PROJECTS[0] ?? null,
  );
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(
    EXPERIENCES[0] ?? null,
  );
  const [booted, setBooted] = useState(false);
  const [typedAbout, setTypedAbout] = useState("ABOUT ME");
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setBooted(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!booted) return;

    const full = "ABOUT ME";
    let index = 0;
    setTypedAbout("");

    const interval = window.setInterval(() => {
      index += 1;
      setTypedAbout(full.slice(0, index));
      if (index >= full.length) {
        window.clearInterval(interval);
      }
    }, 60); // ~16 chars/sec

    return () => window.clearInterval(interval);
  }, [booted]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const node = sectionRef.current;
    if (!node) return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        const rect = node.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const sectionCenter = rect.top + rect.height / 2;
        const viewCenter = vh / 2;
        let progress = (sectionCenter - viewCenter) / vh; // approx [-1, 1]
        if (progress > 1) progress = 1;
        if (progress < -1) progress = -1;
        node.style.setProperty("--fallback-parallax", progress.toString());
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`fallback-2d${booted ? " is-booted" : ""}`}
      id="fallback-2d"
    >
      {booted && <div className="fallback-scanline" aria-hidden="true" />}
      <div className="fallback-inner">

        <div className="fallback-left">
          <div
            className="fallback-block fade-item"
            style={{ "--fade-delay": "0ms" } as CSSProperties}
          >
            <h2 className="fallback-heading">
              {booted ? typedAbout : "ABOUT ME"}
            </h2>
            <p className="fallback-text">
              Computer Engineering @ University of Waterloo, interested in AI‑powered
              systems, interactive visuals, and tools that feel fun to use.
            </p>
            <p className="fallback-text">
              I like shipping small, tight projects, whether that&apos;s a
              Unity scene, an ML pipeline, or firmware for a weird hardware idea.
            </p>

            <div className="fallback-contact">
              <a
                href="https://github.com/akashkothari2007"
                target="_blank"
                rel="noopener noreferrer"
                className="fallback-contact-link"
              >
                GitHub →
              </a>
              <a
                href="https://linkedin.com/in/akashkothari07"
                target="_blank"
                rel="noopener noreferrer"
                className="fallback-contact-link"
              >
                LinkedIn →
              </a>
              <a
                href="/Akash_Kothari_Resume-3.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="fallback-contact-link"
              >
                Resume →
              </a>
            </div>
          </div>

          <div className="fallback-block">
            <h2 className="fallback-heading">EXPERIENCE</h2>
            <div className="fallback-experience-list">
              {EXPERIENCES.map((exp) => (
                <button
                  key={exp.id}
                  className={
                    "fallback-experience-item fade-item" +
                    (selectedExperience?.id === exp.id ? " is-active" : "")
                  }
                  style={
                    {
                      "--fade-delay": `${80 + EXPERIENCES.indexOf(exp) * 90}ms`,
                    } as CSSProperties
                  }
                  onClick={() => setSelectedExperience(exp)}
                >
                  <span className="fallback-experience-title">{exp.title}</span>
                  <span className="fallback-experience-company">
                    {exp.company}
                  </span>
                  <span className="fallback-experience-period">
                    {exp.period}
                  </span>
                </button>
              ))}
            </div>

            {selectedExperience && (
              <div className="fallback-experience-detail">
                <p className="fallback-text">{selectedExperience.summary}</p>
                {selectedExperience.tech && (
                  <p className="fallback-meta">{selectedExperience.tech}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="fallback-right">
          <h2 className="fallback-heading">PROJECTS</h2>
          <div
            className="fallback-projects fade-item"
            style={{ "--fade-delay": "120ms" } as CSSProperties}
          >
            <div className="fallback-project-list">
              {PROJECTS.map((project) => (
                <button
                  key={project.id}
                  className={
                    "fallback-project-item fade-item" +
                    (selectedProject?.id === project.id ? " is-active" : "")
                  }
                  style={
                    {
                      "--fade-delay": `${160 + PROJECTS.indexOf(project) * 90}ms`,
                    } as CSSProperties
                  }
                  onClick={() => setSelectedProject(project)}
                >
                  <span className="fallback-project-name">{project.name}</span>
                </button>
              ))}
            </div>

            {selectedProject && (
              <div className="fallback-project-detail">
                <h3 className="fallback-project-title">{selectedProject.name}</h3>
                <p className="fallback-text">{selectedProject.description}</p>

                <div className="fallback-project-image">
                  {selectedProject.image ? (
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.name}
                    />
                  ) : (
                    <div className="fallback-project-image-placeholder">
                      <span>Add project image</span>
                    </div>
                  )}
                </div>

                <div className="fallback-project-links">
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
              </div>
            )}
          </div>

          <div className="fallback-block fade-item" style={{ "--fade-delay": "600ms" } as CSSProperties}>
            <h2 className="fallback-heading">TECHNICAL SKILLS</h2>
            <div className="fallback-skills">
              <div className="fallback-skills-category">
                <span className="fallback-skills-label">Languages:</span>
                <span className="fallback-skills-list">Python, C/C++, Java, C#, JavaScript (ES6+), SQL, TypeScript</span>
              </div>
              <div className="fallback-skills-category">
                <span className="fallback-skills-label">Frameworks & Platforms:</span>
                <span className="fallback-skills-list">Flask, React, Next.js, Electron, Node.js, Azure, Microsoft Graph API, Unity, WebGL</span>
              </div>
              <div className="fallback-skills-category">
                <span className="fallback-skills-label">Machine Learning:</span>
                <span className="fallback-skills-list">Scikit-learn, PyTorch, XGBoost, Pandas, Data Preprocessing, Model Tuning, Computer Vision, YOLO, OpenCV</span>
              </div>
              <div className="fallback-skills-category">
                <span className="fallback-skills-label">Developer Tools:</span>
                <span className="fallback-skills-list">Git, VS Code, Postman, Kubernetes, Jira, Confluence</span>
              </div>
              <div className="fallback-skills-category">
                <span className="fallback-skills-label">Hardware & Electronics:</span>
                <span className="fallback-skills-list">Arduino, Raspberry Pi, ESP32, IMUs, PID Control Systems</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


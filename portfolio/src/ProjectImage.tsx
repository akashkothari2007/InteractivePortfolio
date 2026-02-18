import { useState, useEffect } from "react";

interface ProjectImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

export default function ProjectImage({
  src,
  alt,
  className = "",
  imgClassName = "",
}: ProjectImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  return (
    <div className={`project-image-wrapper ${className}`.trim()}>
      {!isLoaded && <div className="project-image-shimmer" aria-hidden="true" />}
      <img
        src={src}
        alt={alt}
        className={`project-image ${imgClassName}`.trim()}
        style={{ opacity: isLoaded ? 1 : 0 }}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

import { useState, useEffect, useRef } from "react";

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
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setIsLoaded(false);
    // If image is already cached, complete fires before React's onLoad handler
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  return (
    <div className={`project-image-wrapper ${className}`.trim()}>
      {!isLoaded && <div className="project-image-shimmer" aria-hidden="true" />}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`project-image ${imgClassName}`.trim()}
        style={{ opacity: isLoaded ? 1 : 0 }}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

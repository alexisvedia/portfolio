import React, { useEffect, useRef } from 'react';

interface LandingVideoProps {
  src: string;
  poster: string;
  label: string;
  /** Loop for ambient clips; false for clips that build up and must rest on their last frame. */
  loop?: boolean;
  preload?: 'auto' | 'metadata';
  className?: string;
  'data-a'?: string;
}

/**
 * Muted inline video that only plays while visible. With reduced motion it never plays,
 * so the poster (last frame for build-up clips) is what the visitor sees.
 */
const LandingVideo: React.FC<LandingVideoProps> = ({
  src,
  poster,
  label,
  loop = false,
  preload = 'metadata',
  className,
  'data-a': dataA,
}) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // React does not reflect `muted` as an attribute; iOS needs the property set before play().
    video.muted = true;
    video.defaultMuted = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!loop && video.ended) return;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [loop]);

  return (
    <video
      ref={ref}
      className={className}
      data-a={dataA}
      src={src}
      poster={poster}
      muted
      playsInline
      loop={loop}
      preload={preload}
      aria-label={label}
      role="img"
    />
  );
};

export default LandingVideo;

'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollObserverProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}

export default function ScrollObserver({ 
  children, 
  className = '', 
  threshold = 0.1 
}: ScrollObserverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
        // CRITICAL: pointer-events always enabled so buttons work on first click
        pointerEvents: 'auto',
      }}
    >
      {children}
    </div>
  );
}

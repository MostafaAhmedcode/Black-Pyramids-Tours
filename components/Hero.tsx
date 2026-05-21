'use client';

import { useEffect, useState } from 'react';

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#1a1a1a',
      }}
    >
      {/* ── Background Image ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1800&q=85&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 50%',
          backgroundRepeat: 'no-repeat',
          opacity: 0.65, // slightly dimmed image to maximize text readability
        }}
      />

      {/* ── Premium High-Contrast Charcoal Overlays ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(26, 26, 26, 0.7) 0%, rgba(26, 26, 26, 0.5) 40%, rgba(26, 26, 26, 0.85) 80%, #1a1a1a 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'linear-gradient(to right, rgba(26, 26, 26, 0.6) 0%, transparent 50%, rgba(26, 26, 26, 0.6) 100%)',
        }}
      />

      {/* ── Decorative Gold Horizontals ── */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.15), transparent)',
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '22%',
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.12), transparent)',
          zIndex: 2,
        }}
      />

      {/* ── Main Content Container ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '120px 20px 80px',
          maxWidth: 960,
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Eyebrow */}
        <div
          className={`anim-fade-up ${loaded ? '' : 'opacity-0'}`}
          style={{ marginBottom: 20, opacity: loaded ? 1 : 0, transition: 'all 0.8s ease' }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: 'clamp(0.6rem, 2vw, 0.75rem)',
              fontWeight: 600,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            <span style={{ width: 24, height: 1, background: 'var(--gold)', display: 'inline-block' }} />
            Black Pyramids Tours · Est. 2005
            <span style={{ width: 24, height: 1, background: 'var(--gold)', display: 'inline-block' }} />
          </span>
        </div>

        {/* Heading */}
        <h1
          className={`font-heading anim-fade-up delay-200 ${loaded ? '' : 'opacity-0'}`}
          style={{
            fontSize: 'clamp(2.4rem, 7vw, 5rem)',
            fontWeight: 400,
            color: '#fff',
            lineHeight: 1.1,
            marginBottom: 4,
            opacity: loaded ? 1 : 0,
            textShadow: '0 4px 12px rgba(0,0,0,0.9)',
          }}
        >
          Discover Ancient
        </h1>
        <h1
          className={`font-heading gradient-text anim-fade-up delay-300 ${loaded ? '' : 'opacity-0'}`}
          style={{
            fontSize: 'clamp(2.4rem, 7vw, 5rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: 20,
            opacity: loaded ? 1 : 0,
            textShadow: '0 4px 12px rgba(0,0,0,0.9)',
          }}
        >
          Egypt
        </h1>

        {/* Ornament */}
        <div
          className={`anim-fade-up delay-400 ${loaded ? '' : 'opacity-0'}`}
          style={{ opacity: loaded ? 1 : 0, marginBottom: 24 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div style={{ width: 50, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
            <span style={{ color: 'var(--gold)', fontSize: 8, textShadow: '0 0 4px var(--gold)' }}>◆</span>
            <div style={{ width: 50, height: 1, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
          </div>
        </div>

        {/* Subtitle / Description */}
        <p
          className={`font-sub anim-fade-up delay-400 ${loaded ? '' : 'opacity-0'}`}
          style={{
            fontSize: 'clamp(0.95rem, 2.5vw, 1.25rem)',
            fontStyle: 'italic',
            color: 'var(--sand)',
            maxWidth: 680,
            margin: '0 auto 36px',
            lineHeight: 1.7,
            opacity: loaded ? 1 : 0,
            textShadow: '0 2px 8px rgba(0,0,0,0.95)', // robust shadow for perfect contrast
            fontWeight: 300,
          }}
        >
          Your trusted travel partner since 2005 — hotel reservations, private tours, luxury transportation across all of Egypt. Our entire team speaks English fluently.
        </p>

        {/* 4 Premium Trust Badges */}
        <div
          className={`anim-fade-up delay-500 ${loaded ? '' : 'opacity-0'}`}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 44,
            opacity: loaded ? 1 : 0,
          }}
        >
          {[
            { icon: '▲', text: 'Steps from Pyramids' },
            { icon: '🚗', text: 'Private Luxury Cars' },
            { icon: '👥', text: 'Full English Team' },
            { icon: '🍽️', text: 'Lunch Included' },
          ].map((f) => (
            <div
              key={f.text}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(26, 26, 26, 0.85)',
                border: '1px solid rgba(201, 168, 76, 0.35)',
                padding: '10px 18px',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--gold)' }}>{f.icon}</span>
              <span
                style={{
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--sand)',
                }}
              >
                {f.text}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div
          className={`anim-fade-up delay-600 ${loaded ? '' : 'opacity-0'}`}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 16,
            opacity: loaded ? 1 : 0,
          }}
        >
          <a
            href="#tours"
            className="btn-primary"
            style={{ textDecoration: 'none' }}
          >
            Explore Tours
          </a>
          <a
            href="#hotels"
            className="btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            Book Hotels
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="anim-scroll"
        style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          opacity: 0.6,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}

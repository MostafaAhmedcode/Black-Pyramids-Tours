'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationLinks = [
  { label: 'Home', href: '/' },
  { label: 'Tours', href: '/tours' },
  { label: 'Hotels', href: '/hotels' },
  { label: 'Transportation', href: '/transfer' },
  { label: 'Egypt Blog', href: '/blog' },
  { label: 'Team', href: '/team' },
  { label: 'About Us', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Destinations', href: '/destinations' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav className="site-nav-shell site-nav-shell--solid">
      <div className="site-nav-inner">
        <div className="site-nav-bar">
          <Link href="/" className="site-brand">
            <svg width="38" height="38" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 10 L15 85 L50 85 Z" fill="url(#pyramid-gold-left-nav)" />
              <path d="M50 10 L85 85 L50 85 Z" fill="url(#pyramid-gold-right-nav)" />
              <path d="M50 10 L50 85" stroke="#DFCA7D" strokeWidth="1.5" />
              <defs>
                <linearGradient id="pyramid-gold-left-nav" x1="50" y1="10" x2="15" y2="85" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#DFCA7D" />
                  <stop offset="100%" stopColor="#9B7D2F" />
                </linearGradient>
                <linearGradient id="pyramid-gold-right-nav" x1="50" y1="10" x2="85" y2="85" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#9B7D2F" />
                  <stop offset="100%" stopColor="#5E4716" />
                </linearGradient>
              </defs>
            </svg>

            <div className="site-brand-copy">
              <span className="font-heading site-brand-title">
                Black Pyramids
              </span>
              <span className="site-brand-subtitle">
                Tours <span className="site-brand-meta">· Est. 2005</span>
              </span>
            </div>
          </Link>

          <div className="site-nav-links hidden-mobile">
            {navigationLinks.map((l) => {
              const isActive = pathname === l.href;
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className={`site-nav-link${isActive ? ' is-active' : ''}`}
                >
                  {l.label}
                </Link>
              );
            })}

            <a
              href="https://wa.me/201211385550?text=Hello%20Black%20Pyramids%20Tours%2C%20I%20would%20like%20to%20plan%20a%20luxury%20trip%20to%20Egypt%21"
              target="_blank"
              rel="noopener noreferrer"
              className="site-nav-cta"
            >
              Book Now
            </a>
          </div>

          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="site-menu-toggle show-mobile"
          >
            <span className={`site-menu-line${open ? ' is-open-top' : ''}`} />
            <span className={`site-menu-line${open ? ' is-hidden' : ''}`} />
            <span className={`site-menu-line${open ? ' is-open-bottom' : ''}`} />
          </button>
        </div>

        <div className={`site-mobile-panel show-mobile${open ? ' is-open' : ''}`}>
          <div className="site-mobile-panel-inner">
            {navigationLinks.map((l) => {
              const isActive = pathname === l.href;
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`site-mobile-link${isActive ? ' is-active' : ''}`}
                >
                  {l.label}
                </Link>
              );
            })}

            <a
              href="https://wa.me/201211385550?text=Hello%20Black%20Pyramids%20Tours%2C%20I%20would%20like%20to%20plan%20a%20luxury%20trip%20to%20Egypt%21"
              target="_blank"
              rel="noopener noreferrer"
              className="site-mobile-cta"
              onClick={() => setOpen(false)}
            >
              Book Now
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .site-nav-shell {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          transition: none;
          background: rgba(8, 8, 8, 0.88);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(201, 168, 76, 0.18);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.34);
        }
        .site-nav-shell--solid {
          background: rgba(8, 8, 8, 0.88);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom-color: rgba(201, 168, 76, 0.18);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.34);
        }
        .site-nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .site-nav-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 80px;
          gap: 20px;
        }
        .site-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .site-brand-copy {
          display: flex;
          flex-direction: column;
          line-height: 1.08;
        }
        .site-brand-title {
          font-size: 1.08rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #fff;
          text-transform: uppercase;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
        }
        .site-brand-subtitle {
          font-family: var(--font-inter), Inter, sans-serif;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.28em;
          color: var(--gold);
          text-transform: uppercase;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
        }
        .site-brand-meta {
          opacity: 0.7;
          font-size: 0.55rem;
          letter-spacing: normal;
        }
        .site-nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .site-nav-link {
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--sand-2);
          border-bottom: 2px solid transparent;
          text-decoration: none;
          padding: 8px 14px 6px;
          transition: color 0.25s ease, border-color 0.25s ease;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
        }
        .site-nav-link:hover,
        .site-nav-link.is-active {
          color: var(--gold);
        }
        .site-nav-link.is-active {
          border-bottom-color: var(--gold);
        }
        .site-nav-cta,
        .site-mobile-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-family: var(--font-playfair), 'Playfair Display', serif;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--charcoal-dark);
          background: linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-light));
          border: 1px solid rgba(223, 202, 125, 0.5);
          box-shadow: 0 10px 24px rgba(201, 168, 76, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.18);
          transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .site-nav-cta {
          min-height: 46px;
          padding: 0 24px;
          margin-left: 16px;
          font-size: 0.72rem;
          line-height: 1;
        }
        .site-mobile-cta {
          width: 100%;
          min-height: 48px;
          margin-top: 20px;
          font-size: 0.72rem;
          line-height: 1;
        }
        .site-nav-cta:hover,
        .site-mobile-cta:hover {
          transform: translateY(-2px);
          filter: brightness(1.03);
          box-shadow: 0 14px 30px rgba(201, 168, 76, 0.36), 0 0 24px rgba(201, 168, 76, 0.18);
        }
        .site-menu-toggle {
          background: rgba(10, 10, 10, 0.62);
          border: 1px solid rgba(201, 168, 76, 0.2);
          cursor: pointer;
          padding: 10px;
          border-radius: 999px;
          display: none;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
        }
        .site-menu-line {
          display: block;
          width: 24px;
          height: 1.5px;
          background: var(--sand);
          transition: all 0.3s ease;
        }
        .site-menu-line.is-open-top {
          background: var(--gold);
          transform: rotate(45deg) translate(4.5px, 4.5px);
        }
        .site-menu-line.is-hidden {
          opacity: 0;
        }
        .site-menu-line.is-open-bottom {
          background: var(--gold);
          transform: rotate(-45deg) translate(4.5px, -4.5px);
        }
        .site-mobile-panel {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition: max-height 0.35s ease, opacity 0.25s ease, padding 0.25s ease;
        }
        .site-mobile-panel.is-open {
          max-height: 760px;
          opacity: 1;
          padding-bottom: 18px;
        }
        .site-mobile-panel-inner {
          padding: 14px;
          border: 1px solid rgba(201, 168, 76, 0.16);
          background:
            linear-gradient(180deg, rgba(20, 17, 14, 0.96), rgba(10, 10, 10, 0.96));
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.38);
        }
        .site-mobile-link {
          display: block;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--sand-2);
          border-left: 3px solid transparent;
          text-decoration: none;
          padding: 13px 10px;
          border-bottom: 1px solid rgba(201, 168, 76, 0.1);
          transition: all 0.2s ease;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
        }
        .site-mobile-link:hover,
        .site-mobile-link.is-active {
          color: var(--gold);
          border-left-color: var(--gold);
          padding-left: 18px;
        }
        @media (min-width: 992px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile   { display: none !important; }
        }
        @media (max-width: 991px) {
          .site-nav-shell {
            background: rgba(8, 8, 8, 0.9);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            border-bottom-color: rgba(201, 168, 76, 0.18);
            box-shadow: 0 14px 40px rgba(0, 0, 0, 0.32);
          }
          .site-nav-inner { padding: 0 16px; }
          .site-nav-bar { min-height: 72px; }
          .site-brand svg {
            width: 34px;
            height: 34px;
          }
          .site-brand-title {
            font-size: 0.9rem;
            letter-spacing: 0.11em;
          }
          .site-brand-subtitle {
            font-size: 0.52rem;
            letter-spacing: 0.22em;
          }
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
          .site-menu-toggle.show-mobile { display: flex !important; }
        }
        @media (max-width: 560px) {
          .site-brand-title { font-size: 0.78rem; }
          .site-brand-subtitle { font-size: 0.48rem; }
          .site-mobile-panel-inner { padding: 12px; }
          .site-mobile-cta {
            min-height: 46px;
            font-size: 0.68rem;
          }
        }
      `}</style>
    </nav>
  );
}

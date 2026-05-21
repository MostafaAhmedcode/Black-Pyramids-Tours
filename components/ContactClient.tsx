'use client';

import Link from 'next/link';

const F = 'var(--font-inter), Inter, system-ui, sans-serif';

const contactCards = [
  {
    icon: '💬',
    title: 'WhatsApp (Fastest)',
    desc: 'Message us on WhatsApp for instant replies. Available 24/7.',
    value: '+20 101 815 7153',
    href: 'https://wa.me/201211385550',
    cta: 'Open WhatsApp',
    highlight: true,
  },
  {
    icon: '📧',
    title: 'Email',
    desc: "Send us an email and we'll reply within a few hours.",
    value: 'info@venuspyramids.com',
    href: 'mailto:info@venuspyramids.com',
    cta: 'Send Email',
    highlight: false,
  },
  {
    icon: '📱',
    title: 'Phone',
    desc: 'Call us directly. English-speaking staff available.',
    value: '+20 101 815 7153',
    href: 'tel:+201211385550',
    cta: 'Call Now',
    highlight: false,
  },
  {
    icon: '📍',
    title: 'Visit Us',
    desc: 'El Fokahaa Street, Nazlet El Batran, Giza — 5 min from the Pyramids.',
    value: 'Giza, Egypt',
    href: 'https://maps.google.com/?q=Nazlet+El+Batran+Giza+Egypt',
    cta: 'Get Directions',
    highlight: false,
  },
];

const quickLinks = [
  { label: '🏺 Book a Tour', msg: 'Hi, I would like to book a tour' },
  { label: '🛏️ Book a Room', msg: 'Hi, I would like to book a hotel room' },
  { label: '🚗 Airport Transfer', msg: 'Hi, I would like to book an airport transfer' },
  { label: '🌅 Rooftop Table', msg: 'Hi, I would like to reserve a rooftop table' },
  { label: '💆 Spa & Massage', msg: 'Hi, I would like to book a spa session' },
  { label: '❓ General Inquiry', msg: 'Hi, I have a question about your services' },
];

export default function ContactClient() {
  return (
    <>
      {/* Hero */}
      <section
        style={{
          position: 'relative',
          paddingTop: 140,
          paddingBottom: 80,
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(201,168,76,0.07) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 860,
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          <div
            style={{
              fontFamily: F,
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: 16,
            }}
          >
            We Reply Within Minutes
          </div>
          <h1
            className="font-heading"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 600,
              color: '#fff',
              marginBottom: 20,
              lineHeight: 1.1,
            }}
          >
            Contact Us
          </h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 60,
                height: 1,
                background: 'linear-gradient(90deg, transparent, var(--gold))',
              }}
            />
            <span style={{ color: 'var(--gold)', fontSize: 8 }}>◆</span>
            <div
              style={{
                width: 60,
                height: 1,
                background: 'linear-gradient(90deg, var(--gold), transparent)',
              }}
            />
          </div>
          <p
            style={{
              fontFamily: F,
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--sand-2)',
              lineHeight: 1.8,
              maxWidth: 600,
              margin: '0 auto',
            }}
          >
            Have a question about tours, rooms, or transfers? Our team is available 24/7 and
            replies within minutes on WhatsApp.
          </p>
        </div>
      </section>

      {/* Contact cards + quick links + location */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Contact method cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24,
            marginBottom: 64,
          }}
        >
          {contactCards.map((c) => (
            <div
              key={c.title}
              style={{
                background: c.highlight
                  ? 'linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 100%)'
                  : 'rgba(255,255,255,0.03)',
                border: c.highlight
                  ? '1px solid rgba(201,168,76,0.4)'
                  : '1px solid rgba(201,168,76,0.15)',
                padding: '32px 28px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{c.icon}</div>
              <h2
                className="font-heading"
                style={{
                  fontSize: '1.2rem',
                  color: c.highlight ? 'var(--gold)' : '#fff',
                  marginBottom: 10,
                }}
              >
                {c.title}
              </h2>
              <p
                style={{
                  fontFamily: F,
                  fontSize: '0.88rem',
                  color: 'var(--sand-3)',
                  lineHeight: 1.7,
                  marginBottom: 16,
                }}
              >
                {c.desc}
              </p>
              <div
                style={{
                  fontFamily: F,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--sand)',
                  marginBottom: 20,
                }}
              >
                {c.value}
              </div>
              <a
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={c.highlight ? 'btn-primary' : 'btn-secondary'}
                style={{ textDecoration: 'none', display: 'inline-block' }}
              >
                {c.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Quick booking links */}
        <div
          style={{
            background: 'rgba(201,168,76,0.04)',
            border: '1px solid rgba(201,168,76,0.15)',
            padding: '48px',
            marginBottom: 48,
          }}
        >
          <h2
            className="font-heading"
            style={{ fontSize: '2rem', color: '#fff', marginBottom: 12, textAlign: 'center' }}
          >
            Quick Booking Links
          </h2>
          <p
            style={{
              fontFamily: F,
              fontSize: '0.95rem',
              color: 'var(--sand-3)',
              textAlign: 'center',
              marginBottom: 32,
            }}
          >
            Click any link below to send us a pre-filled WhatsApp message
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 12,
            }}
          >
            {quickLinks.map((item) => (
              <a
                key={item.label}
                href={`https://wa.me/201211385550?text=${encodeURIComponent(item.msg)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: F,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--sand-2)',
                  textDecoration: 'none',
                  padding: '14px 20px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(201,168,76,0.18)',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  display: 'block',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)';
                  e.currentTarget.style.color = 'var(--gold)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)';
                  e.currentTarget.style.color = 'var(--sand-2)';
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Location + hours */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(201,168,76,0.15)',
              padding: '28px 24px',
            }}
          >
            <div
              style={{
                fontFamily: F,
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: 16,
              }}
            >
              📍 Our Location
            </div>
            {[
              { label: 'Address', value: 'El Fokahaa St, Nazlet El Batran, Giza' },
              { label: 'From Pyramids', value: '5-minute drive (2.1 miles)' },
              { label: 'From Cairo Airport', value: '~17 miles (35–50 minutes)' },
              { label: 'Nearest Metro', value: 'Giza Station (then taxi)' },
            ].map((d) => (
              <div
                key={d.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(201,168,76,0.08)',
                  gap: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: F,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--sand-3)',
                    flexShrink: 0,
                  }}
                >
                  {d.label}
                </span>
                <span
                  style={{
                    fontFamily: F,
                    fontSize: '0.85rem',
                    color: 'var(--sand-2)',
                    textAlign: 'right',
                  }}
                >
                  {d.value}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(201,168,76,0.15)',
              padding: '28px 24px',
            }}
          >
            <div
              style={{
                fontFamily: F,
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: 16,
              }}
            >
              🕐 Hours
            </div>
            {[
              { label: 'Reception', value: '24 hours / 7 days' },
              { label: 'Tour Desk', value: '7:00 AM – 10:00 PM' },
              { label: 'Rooftop Restaurant', value: '7:00 AM – 11:00 PM' },
              { label: 'Spa & Massage', value: '9:00 AM – 9:00 PM' },
              { label: 'WhatsApp Support', value: '24/7 — instant replies' },
            ].map((d) => (
              <div
                key={d.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(201,168,76,0.08)',
                  gap: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: F,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--sand-3)',
                    flexShrink: 0,
                  }}
                >
                  {d.label}
                </span>
                <span
                  style={{
                    fontFamily: F,
                    fontSize: '0.85rem',
                    color: 'var(--sand-2)',
                    textAlign: 'right',
                  }}
                >
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

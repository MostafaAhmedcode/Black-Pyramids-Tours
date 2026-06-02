'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TourCard from './TourCard';
import Link from 'next/link';
import { tours as staticTours } from '@/data/tours';

const DESTINATIONS = ['All', 'Cairo & Giza', 'Luxor', 'Aswan', 'Alexandria', 'Sinai', 'Hurghada', 'Fayoum', 'White Desert', 'El Minya', 'Siwa Oasis', 'Red Sea'] as const;
const TOUR_TYPES = ['All', 'Half Day', 'Full Day', 'Multi-Day'] as const;
const F = 'var(--font-inter), Inter, system-ui, sans-serif';

function ToursInner() {
  const [dest, setDest] = useState('All');
  const [type, setType] = useState('All');
  const [tours, setTours] = useState(staticTours);
  const searchParams = useSearchParams();

  useEffect(() => {
    const d = searchParams.get('destination');
    if (d) setDest(d);
  }, [searchParams]);

  useEffect(() => {
    fetch('/api/save-data?type=tours').then(r => r.json()).then(json => {
      if (json.success && json.data.length > 0) {
        setTours(prev => prev.map(t => {
          const o = json.data.find((x: any) => x.id === t.id);
          return o ? { ...t, ...o } : t;
        }));
      }
    }).catch(() => {});
  }, []);

  const filtered = tours.filter(t =>
    (dest === 'All' || t.destination === dest) &&
    (type === 'All' || t.tourType === type)
  );

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', paddingTop: 140, paddingBottom: 80, textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1600&h=700&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center 60%', opacity: 0.18 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,12,26,0.5) 0%, rgba(7,12,26,0.9) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>Private Day Tours · From $35</div>
          <h1 className="font-heading" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 600, color: '#fff', marginBottom: 20, lineHeight: 1.1 }}>
            Egypt Tours from Giza
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
            <span style={{ color: 'var(--gold)', fontSize: 8 }}>◆</span>
            <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
          </div>
          <p style={{ fontFamily: F, fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--sand-2)', lineHeight: 1.8, marginBottom: 32, maxWidth: 680, margin: '0 auto 32px' }}>
            Every tour departs directly from our hotel in a private air-conditioned luxury car. Our English-speaking guides and drivers are licensed professionals with decades of experience across Egypt.
          </p>
          {/* SEO-rich feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 40 }}>
            {['🚗 Private Luxury Car', '🗣️ English-Speaking Guide', '🍽️ Lunch Included', '🎫 All Entrance Tickets', '⭐ 4.9 Star Rated'].map(f => (
              <span key={f} style={{ fontFamily: F, fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)', color: 'var(--sand-2)', padding: '7px 14px' }}>{f}</span>
            ))}
          </div>
          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
            {[{ val: `${tours.length}+`, label: 'Tours Available' }, { val: '10', label: 'Destinations' }, { val: '$35', label: 'Starting From' }, { val: '4.9★', label: 'Average Rating' }].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div className="font-heading" style={{ fontSize: '2rem', color: 'var(--gold)', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontFamily: F, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--sand-3)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 96px' }}>
        {/* Filter bar */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.2)', padding: '28px 32px', marginBottom: 48 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28 }}>
            <div>
              <div style={{ fontFamily: F, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>📍 Destination</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {DESTINATIONS.map(d => <button key={d} onClick={() => setDest(d)} className={`filter-pill${dest === d ? ' active' : ''}`}>{d}</button>)}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: F, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>🕐 Duration</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {TOUR_TYPES.map(t => <button key={t} onClick={() => setType(t)} className={`filter-pill${type === t ? ' active' : ''}`}>{t}</button>)}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontFamily: F, fontSize: '0.85rem', color: 'var(--sand-2)' }}>
              Showing <strong style={{ color: 'var(--gold)' }}>{filtered.length}</strong> of {tours.length} tours
            </span>
            {(dest !== 'All' || type !== 'All') && (
              <button onClick={() => { setDest('All'); setType('All'); }} style={{ fontFamily: F, fontSize: '0.75rem', fontWeight: 600, color: 'var(--sand-3)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear filters ×</button>
            )}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {filtered.map((tour, i) => <TourCard key={tour.id} tour={tour} index={i} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p style={{ fontFamily: F, fontSize: '1.1rem', color: 'var(--sand-2)', marginBottom: 20 }}>No tours match your selection.</p>
            <button onClick={() => { setDest('All'); setType('All'); }} className="btn-secondary">Show All Tours</button>
          </div>
        )}

        {/* SEO text block */}
        <div style={{ marginTop: 80, padding: '48px', background: 'rgba(201,168,76,0.03)', border: '1px solid rgba(201,168,76,0.12)' }}>
          <h2 className="font-heading" style={{ fontSize: '1.6rem', color: 'var(--gold)', marginBottom: 20 }}>Private Egypt Tours — Everything You Need to Know</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            {[
              { title: 'Why Choose a Private Tour?', body: 'Unlike group tours, our private tours give you complete flexibility. Start when you want, spend as long as you like at each site, and get personalised attention from your guide. No waiting for other tourists, no rushed schedules.' },
              { title: 'What\'s Included in Every Tour?', body: 'Every tour includes hotel pickup and drop-off in a private air-conditioned luxury car, an English-speaking licensed guide, all entrance tickets, bottled water, and lunch at a quality local restaurant.' },
              { title: 'How to Book?', body: 'Simply click "Book via WhatsApp" on any tour page and send us a message. We\'ll confirm your booking within minutes. Payment is made directly to the driver on the day of the tour — no advance payment required.' },
            ].map(item => (
              <div key={item.title}>
                <h3 style={{ fontFamily: F, fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: 10 }}>{item.title}</h3>
                <p style={{ fontFamily: F, fontSize: '0.88rem', color: 'var(--sand-3)', lineHeight: 1.8 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function ToursPageClient() {
  return <Suspense><ToursInner /></Suspense>;
}

'use client';

import { useState, useEffect } from 'react';
import RoomCard from './RoomCard';
import { rooms as staticRooms } from '@/data/rooms';

const F = 'var(--font-inter), Inter, system-ui, sans-serif';

export default function HotelsPageClient() {
  const [rooms, setRooms] = useState(staticRooms);

  useEffect(() => {
    fetch('/api/save-data?type=rooms').then(r => r.json()).then(json => {
      if (json.success && json.data.length > 0) {
        setRooms(prev => prev.map(r => {
          const o = json.data.find((x: any) => x.id === r.id);
          return o ? { ...r, ...o } : r;
        }));
      }
    }).catch(() => {});
  }, []);

  const amenities = [
    { icon: '🍳', text: 'Free Breakfast Daily (7 AM–12 PM)' },
    { icon: '📶', text: 'Free High-Speed WiFi' },
    { icon: '🅿️', text: 'Free Private Parking' },
    { icon: '🌅', text: 'Rooftop Restaurant & Bar' },
    { icon: '💆', text: 'Spa, Massages & Facials' },
    { icon: '🛁', text: 'Hot Tub / Jacuzzi Rooms' },
    { icon: '🚗', text: 'Airport Transfer ($22)' },
    { icon: '🐾', text: 'Pets Welcome' },
    { icon: '🏪', text: 'Mini Market On-Site' },
    { icon: '💱', text: 'Currency Exchange' },
    { icon: '🧳', text: 'Luggage Storage' },
    { icon: '🔒', text: '24-Hour Security' },
    { icon: '🌿', text: 'Allergy-Free Rooms Available' },
    { icon: '💈', text: 'Barber & Beauty Shop' },
    { icon: '🗺️', text: 'Tour Desk & Concierge' },
    { icon: '🛗', text: 'Elevator Access' },
  ];

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', paddingTop: 140, paddingBottom: 80, textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&h=700&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.18 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,12,26,0.5) 0%, rgba(7,12,26,0.95) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>Steps from the Giza Pyramids</div>
          <h1 className="font-heading" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 600, color: '#fff', marginBottom: 20, lineHeight: 1.1 }}>
            Luxury Hotel in Giza
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
            <span style={{ color: 'var(--gold)', fontSize: 8 }}>◆</span>
            <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
          </div>
          <p style={{ fontFamily: F, fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--sand-2)', lineHeight: 1.8, marginBottom: 32, maxWidth: 680, margin: '0 auto 32px' }}>
            Located on El Fokahaa Street, Nazlet El Batran — just a 5-minute drive from the Great Pyramids of Giza and the Sphinx. Wake up to pyramid views, enjoy free breakfast, and explore Egypt from our doorstep.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
            {[{ val: '16', label: 'Luxury Rooms' }, { val: '$30', label: 'From Per Night' }, { val: '4.9★', label: 'Guest Rating' }, { val: '5 min', label: 'To Pyramids' }].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div className="font-heading" style={{ fontSize: '2rem', color: 'var(--gold)', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontFamily: F, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--sand-3)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotel info + amenities */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, marginBottom: 64 }}>
          <div>
            <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>About our accommodations</div>
            <h2 className="font-heading" style={{ fontSize: '2rem', color: '#fff', marginBottom: 20, lineHeight: 1.2 }}>Handpicked Luxury Stays</h2>
            <p style={{ fontFamily: F, fontSize: '0.95rem', color: 'var(--sand-2)', lineHeight: 1.85, marginBottom: 16 }}>
              Black Pyramids Tours travel agency coordinates luxury stays with the most prestigious handpicked partner hotels in Giza and across Egypt. From cozy boutique rooms to legendary 5★ presidential suites overlooking the ancient pyramids, we curate and book the perfect sanctuary for your bespoke itinerary.
            </p>
            <p style={{ fontFamily: F, fontSize: '0.95rem', color: 'var(--sand-2)', lineHeight: 1.85, marginBottom: 24 }}>
              Every room features air conditioning, LCD satellite TV, rainfall shower, designer toiletries, electric kettle, and free tea and coffee. Our complimentary continental breakfast is served daily from 7:00 AM to noon.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { icon: '📍', label: 'Address', value: 'El Fokahaa St, Nazlet El Batran, Giza' },
                { icon: '📱', label: 'WhatsApp', value: '+20 101 815 7153' },
                { icon: '🕐', label: 'Check-in', value: '12:00 PM – 12:00 AM' },
                { icon: '🕙', label: 'Check-out', value: 'Until 10:00 AM' },
                { icon: '✈️', label: 'From Airport', value: '~17 miles (35–50 min)' },
                { icon: '🔺', label: 'From Pyramids', value: '5-min drive · 2.1 mi' },
              ].map(f => (
                <div key={f.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.12)', padding: '12px 14px' }}>
                  <div style={{ fontFamily: F, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>{f.icon} {f.label}</div>
                  <div style={{ fontFamily: F, fontSize: '0.82rem', color: 'var(--sand-2)' }}>{f.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Hotel Facilities</div>
            <h2 className="font-heading" style={{ fontSize: '2rem', color: '#fff', marginBottom: 20, lineHeight: 1.2 }}>Everything You Need</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {amenities.map(a => (
                <div key={a.text} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.1)', padding: '10px 12px' }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{a.icon}</span>
                  <span style={{ fontFamily: F, fontSize: '0.8rem', color: 'var(--sand-2)' }}>{a.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rooms */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Accommodation</div>
          <h2 className="font-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', marginBottom: 16 }}>Our Rooms</h2>
          <p style={{ fontFamily: F, fontSize: '1rem', color: 'var(--sand-2)', maxWidth: 600, margin: '0 auto' }}>
            16 rooms from economy singles to presidential suites — all steps from the Giza Pyramids.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, marginBottom: 64 }}>
          {rooms.map((room, i) => <RoomCard key={room.id} room={room} index={i} />)}
        </div>

        {/* Book CTA */}
        <div style={{ textAlign: 'center', padding: '48px', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)' }}>
          <h2 className="font-heading" style={{ fontSize: '2rem', color: '#fff', marginBottom: 16 }}>Ready to Book Your Room?</h2>
          <p style={{ fontFamily: F, fontSize: '1rem', color: 'var(--sand-2)', marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
            Contact us on WhatsApp for instant booking confirmation. No advance payment required.
          </p>
          <a href="https://wa.me/201211385550?text=Hi%2C%20I%20would%20like%20to%20book%20a%20room" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>
            📱 Book via WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}

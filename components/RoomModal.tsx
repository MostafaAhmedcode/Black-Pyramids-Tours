'use client';

import { useEffect, useState } from 'react';
import { Room } from '@/data/rooms';
import ImageCarousel from './ImageCarousel';
import BookingWizard from './BookingWizard';

const F = 'var(--font-inter), Inter, system-ui, sans-serif';

export default function RoomModal({ room, onClose }: { room: Room; onClose: () => void }) {
  const [showWizard, setShowWizard] = useState(false);
  const allImages = room.images && room.images.length > 0 ? room.images : [room.image];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', fn); };
  }, [onClose]);

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true" aria-label={room.name}
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(4,7,18,0.94)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
    >
      <div className="anim-modal-pop" style={{ width: '100%', maxWidth: 720, maxHeight: '92vh', overflowY: 'auto', background: 'linear-gradient(160deg, #0d1428 0%, #0a0f1e 100%)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 2, boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}>

        {/* Gallery */}
        <div style={{ position: 'relative' }}>
          <ImageCarousel images={allImages} alt={room.name} height={260} brightness={0.75} showDots showArrows />

          {/* Close */}
          <button onClick={onClose} aria-label="Close"
            style={{ position: 'absolute', top: 14, right: 14, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', zIndex: 20 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#fff'; }}
          >×</button>

          {/* Title overlay */}
          <div style={{ position: 'absolute', bottom: 28, left: 24, right: 60, zIndex: 10, pointerEvents: 'none' }}>
            <div style={{ fontFamily: F, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>📍 {room.view}</div>
            <h2 className="font-heading" style={{ fontSize: 'clamp(1.1rem, 3vw, 1.6rem)', color: '#fff', lineHeight: 1.2 }}>{room.name}</h2>
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div style={{ display: 'flex', gap: 6, padding: '10px 16px', background: 'rgba(7,12,26,0.9)', overflowX: 'auto' }}>
              {allImages.map((img, i) => (
                <img key={i} src={img} alt={`thumb ${i + 1}`}
                  style={{ width: 60, height: 42, objectFit: 'cover', border: '1px solid rgba(201,168,76,0.3)', flexShrink: 0, cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '24px 28px 32px' }}>
          {showWizard ? (
            <BookingWizard
              itemType="room"
              item={room}
              onCancel={() => setShowWizard(false)}
            />
          ) : (
            <>
              {/* Meta */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {[
                  { icon: '📐', text: room.size },
                  { icon: '👥', text: `${room.capacity} ${room.capacity === 1 ? 'Guest' : 'Guests'}` },
                  { icon: '⭐', text: `${room.rating}/5 Rating` },
                  { icon: '✅', text: 'Available Now' },
                  { icon: '🖼️', text: `${allImages.length} Photo${allImages.length > 1 ? 's' : ''}` },
                ].map(m => (
                  <span key={m.text} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.18)', padding: '6px 12px', fontFamily: F, fontSize: '0.72rem', color: 'var(--sand-2)' }}>
                    <span>{m.icon}</span>{m.text}
                  </span>
                ))}
              </div>

              <p className="font-sub" style={{ fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--sand-2)', lineHeight: 1.75, marginBottom: 20 }}>{room.description}</p>

              <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', marginBottom: 20 }} />

              {/* Highlights */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: F, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Room Highlights</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
                  {room.highlights.map(h => (
                    <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'var(--gold)', fontSize: '0.5rem', flexShrink: 0 }}>◆</span>
                      <span style={{ fontFamily: F, fontSize: '0.85rem', color: 'var(--sand)' }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', marginBottom: 20 }} />

              {/* Amenities */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: F, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Room Amenities</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                  {room.amenities.map(a => (
                    <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'var(--gold)', fontSize: '0.7rem', flexShrink: 0 }}>✓</span>
                      <span style={{ fontFamily: F, fontSize: '0.85rem', color: 'var(--sand-2)' }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', marginBottom: 20 }} />

              {/* Hotel inclusions */}
              <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', padding: '14px 16px', marginBottom: 20 }}>
                <div style={{ fontFamily: F, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10 }}>Included With Every Room</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 6 }}>
                  {['🍳 Free Continental Breakfast (7am–12pm)', '🅿️ Free Parking On-Site', '✈️ Airport Transfer ($22 one way)', '🌅 Rooftop Restaurant Access', '💆 Spa & Massage Services', '🔄 Express Check-in / Check-out', '🧳 Luggage Storage', '💱 Currency Exchange'].map(inc => (
                    <div key={inc} style={{ fontFamily: F, fontSize: '0.82rem', color: 'var(--sand-2)' }}>{inc}</div>
                  ))}
                </div>
              </div>

              {/* Check-in */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                {[{ label: 'Check-in', value: '12:00 PM – 12:00 AM' }, { label: 'Check-out', value: 'Until 10:00 AM' }].map(c => (
                  <div key={c.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.15)', padding: '12px 14px' }}>
                    <div style={{ fontFamily: F, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>{c.label}</div>
                    <div style={{ fontFamily: F, fontSize: '0.88rem', color: 'var(--sand)' }}>{c.value}</div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ fontFamily: F, fontSize: '0.6rem', color: 'var(--sand-3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>From</div>
                  <div className="font-heading" style={{ fontSize: '2.2rem', color: 'var(--gold)', lineHeight: 1 }}>${room.price}</div>
                  <div style={{ fontFamily: F, fontSize: '0.65rem', color: 'var(--sand-3)' }}>per night · breakfast included</div>
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button onClick={() => setShowWizard(true)} className="btn-primary" style={{ border: 'none', cursor: 'pointer' }}>Book Room Online</button>
                  <a href={`https://wa.me/201211385550?text=Hi%2C%20I%20would%20like%20to%20book%20the%20${encodeURIComponent(room.name)}`} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration: 'none' }}>WhatsApp Inquiry</a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

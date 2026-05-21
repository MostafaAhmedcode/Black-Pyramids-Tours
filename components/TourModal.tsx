'use client';

import { useEffect, useState } from 'react';
import { Tour } from '@/data/tours';
import ImageCarousel from './ImageCarousel';
import BookingWizard from './BookingWizard';

const F = 'var(--font-inter), Inter, sans-serif';

export default function TourModal({ tour, onClose }: { tour: Tour; onClose: () => void }) {
  const [showWizard, setShowWizard] = useState(false);
  const allImages = tour.images && tour.images.length > 0 ? tour.images : [tour.image];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', fn); };
  }, [onClose]);

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true" aria-label={tour.title}
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(4,7,18,0.94)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
    >
      <div className="anim-modal-pop" style={{ width: '100%', maxWidth: 720, maxHeight: '92vh', overflowY: 'auto', background: 'linear-gradient(160deg, #0d1428 0%, #0a0f1e 100%)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 2, boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}>

        {/* Gallery */}
        <div style={{ position: 'relative' }}>
          <ImageCarousel images={allImages} alt={tour.title} height={240} brightness={0.75} showDots showArrows />

          {/* Close */}
          <button onClick={onClose} aria-label="Close"
            style={{ position: 'absolute', top: 14, right: 14, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', zIndex: 20 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#fff'; }}
          >×</button>

          {/* Title overlay */}
          <div style={{ position: 'absolute', bottom: allImages.length > 1 ? 36 : 20, left: 24, right: 60, zIndex: 10, pointerEvents: 'none' }}>
            <div style={{ fontFamily: F, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>{tour.destination}</div>
            <h2 className="font-heading" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.7rem)', color: '#fff', lineHeight: 1.2 }}>{tour.title}</h2>
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
              itemType="tour"
              item={tour}
              onCancel={() => setShowWizard(false)}
            />
          ) : (
            <>
              {/* Meta */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {[
                  { icon: '🕐', text: tour.duration },
                  { icon: '📅', text: tour.tourType },
                  { icon: '⭐', text: `${tour.rating} (${tour.reviews} reviews)` },
                  { icon: '⏰', text: `Pickup: ${tour.pickupTime}` },
                  { icon: '🖼️', text: `${allImages.length} Photo${allImages.length > 1 ? 's' : ''}` },
                ].map(m => (
                  <span key={m.text} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.18)', padding: '6px 12px', fontFamily: F, fontSize: '0.72rem', color: 'var(--sand-2)' }}>
                    <span>{m.icon}</span>{m.text}
                  </span>
                ))}
              </div>

              <p className="font-sub" style={{ fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--sand-2)', lineHeight: 1.75, marginBottom: 20 }}>{tour.description}</p>

              <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', marginBottom: 20 }} />

              {/* Highlights */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: F, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Tour Highlights</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                  {tour.highlights.map(h => (
                    <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'var(--gold)', fontSize: '0.5rem', flexShrink: 0 }}>◆</span>
                      <span style={{ fontFamily: F, fontSize: '0.85rem', color: 'var(--sand)' }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', marginBottom: 20 }} />

              {/* Itinerary */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: F, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>Daily Itinerary</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {tour.itinerary.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: 12 }}>
                      <div style={{ flexShrink: 0, width: 52, textAlign: 'right' }}>
                        <span style={{ fontFamily: F, fontSize: '0.68rem', fontWeight: 700, color: 'var(--gold)' }}>{step.time}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', marginTop: 2, flexShrink: 0 }} />
                        {i < tour.itinerary.length - 1 && <div style={{ width: 1, flex: 1, background: 'rgba(201,168,76,0.2)', marginTop: 4 }} />}
                      </div>
                      <p style={{ fontFamily: F, fontSize: '0.85rem', color: 'var(--sand-2)', lineHeight: 1.55 }}>{step.activity}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', marginBottom: 20 }} />

              {/* Includes */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: F, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>What&apos;s Included</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
                  {tour.includes.map(inc => (
                    <div key={inc} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{ color: 'var(--gold)', fontSize: '0.7rem', marginTop: 2, flexShrink: 0 }}>✓</span>
                      <span style={{ fontFamily: F, fontSize: '0.85rem', color: 'var(--sand-2)' }}>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Excludes */}
              {tour.excludes && tour.excludes.length > 0 && (
                <>
                  <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)', marginBottom: 20 }} />
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontFamily: F, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--sand-3)', marginBottom: 12 }}>Not Included</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
                      {tour.excludes.map(ex => (
                        <div key={ex} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                          <span style={{ color: 'var(--sand-3)', fontSize: '0.7rem', marginTop: 2, flexShrink: 0 }}>✕</span>
                          <span style={{ fontFamily: F, fontSize: '0.85rem', color: 'var(--sand-3)' }}>{ex}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', marginBottom: 20 }} />

              {/* Price tiers */}
              {tour.priceTiers && tour.priceTiers.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: F, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Pricing Options (Private Tour)</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {tour.priceTiers.map(tier => (
                      <div key={tier.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.15)', padding: '10px 14px' }}>
                        <span style={{ fontFamily: F, fontSize: '0.88rem', color: 'var(--sand-2)' }}>{tier.label}</span>
                        <div style={{ display: 'flex', gap: 16 }}>
                          <span style={{ fontFamily: F, fontSize: '0.82rem', color: 'var(--sand-3)' }}>1 person: <strong style={{ color: 'var(--gold)' }}>${tier.price1}</strong></span>
                          <span style={{ fontFamily: F, fontSize: '0.82rem', color: 'var(--sand-3)' }}>2 persons: <strong style={{ color: 'var(--gold)' }}>${tier.price2}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontFamily: F, fontSize: '0.78rem', color: 'var(--sand-3)', marginTop: 8, fontStyle: 'italic' }}>For groups larger than 2, contact us for pricing.</p>
                </div>
              )}

              <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', marginBottom: 20 }} />

              {/* Meeting point */}
              <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', padding: '14px 16px', marginBottom: 24 }}>
                <div style={{ fontFamily: F, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>Meeting Point</div>
                <p style={{ fontFamily: F, fontSize: '0.88rem', color: 'var(--sand-2)' }}>📍 {tour.meetingPoint}</p>
                {tour.note && <p style={{ fontFamily: F, fontSize: '0.82rem', color: 'var(--gold)', marginTop: 8, fontStyle: 'italic' }}>ℹ️ {tour.note}</p>}
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ fontFamily: F, fontSize: '0.6rem', color: 'var(--sand-3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>From</div>
                  <div className="font-heading" style={{ fontSize: '2.2rem', color: 'var(--gold)', lineHeight: 1 }}>${tour.basePrice}</div>
                  <div style={{ fontFamily: F, fontSize: '0.65rem', color: 'var(--sand-3)' }}>per person</div>
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button onClick={() => setShowWizard(true)} className="btn-primary" style={{ border: 'none', cursor: 'pointer' }}>Book Tour Online</button>
                  <a href={`https://wa.me/201211385550?text=Hi%2C%20I%20would%20like%20to%20book%20the%20${encodeURIComponent(tour.title)}`} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration: 'none' }}>WhatsApp Inquiry</a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tour } from '@/data/tours';
import { egyptDestinationsBlogs } from '@/data/egyptDestinationsBlogs';

const F = 'var(--font-inter), Inter, system-ui, sans-serif';

function GallerySection({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  return (
    <div style={{ margin: '48px 0' }}>
      <div style={{ position: 'relative', borderRadius: 4, overflow: 'hidden', aspectRatio: '16/9', marginBottom: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.6)', border: '1px solid rgba(201,168,76,0.2)' }}>
        <img
          src={images[active]}
          alt={`${title} - photo ${active + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.4s' }}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActive(a => (a - 1 + images.length) % images.length)}
              aria-label="Previous image"
              style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(201,168,76,0.4)', color: 'var(--gold)', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >‹</button>
            <button
              onClick={() => setActive(a => (a + 1) % images.length)}
              aria-label="Next image"
              style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(201,168,76,0.4)', color: 'var(--gold)', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >›</button>
            <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
              {images.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} aria-label={`Go to image ${i + 1}`} style={{ width: i === active ? 24 : 8, height: 8, borderRadius: 4, background: i === active ? 'var(--gold)' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
              ))}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {images.map((img, i) => (
            <button key={i} onClick={() => setActive(i)} aria-label={`View image ${i + 1}`} style={{ flexShrink: 0, width: 80, height: 56, borderRadius: 2, overflow: 'hidden', border: i === active ? '2px solid var(--gold)' : '2px solid transparent', cursor: 'pointer', padding: 0, background: 'none', transition: 'border-color 0.2s' }}>
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PricingTable({ priceTiers }: { priceTiers: Tour['priceTiers'] }) {
  return (
    <div style={{ border: '1px solid rgba(201,168,76,0.2)', borderRadius: 4, overflow: 'hidden', marginBottom: 24 }}>
      <div style={{ background: 'rgba(201,168,76,0.08)', padding: '12px 20px', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, fontFamily: F, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--sand-3)' }}>
          <span>Package</span><span style={{ textAlign: 'center' }}>1 Person</span><span style={{ textAlign: 'center' }}>2+ Persons</span>
        </div>
      </div>
      {priceTiers.map((tier, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '14px 20px', borderBottom: i < priceTiers.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
          <span style={{ fontFamily: F, fontSize: '0.9rem', color: 'var(--sand)' }}>{tier.label}</span>
          <span style={{ fontFamily: F, fontSize: '1rem', fontWeight: 700, color: 'var(--gold)', textAlign: 'center' }}>${tier.price1}</span>
          <span style={{ fontFamily: F, fontSize: '1rem', fontWeight: 700, color: 'var(--gold)', textAlign: 'center' }}>${Number.isInteger(tier.price2 / 2) ? tier.price2 / 2 : (tier.price2 / 2).toFixed(2)}/person</span>
        </div>
      ))}
    </div>
  );
}

export default function TourPageClient({ tour }: { tour: Tour }) {
  const allImages = tour.images && tour.images.length > 0 ? tour.images : [tour.image];
  const blog = egyptDestinationsBlogs.find(
    (b) => b.relatedTourIds?.includes(tour.id)
  ) || egyptDestinationsBlogs.find(
    (b) => b.destination === tour.destination
  );
  const [guestCount, setGuestCount] = useState(1);
  const [preferredDate, setPreferredDate] = useState('');
  const [selectedPackageIdx, setSelectedPackageIdx] = useState(0);

  const selectedPackage = tour.priceTiers && tour.priceTiers.length > 0 ? tour.priceTiers[selectedPackageIdx] : { label: 'Standard', price1: tour.basePrice, price2: tour.basePrice };
  const getPerPersonPrice = (price1: number, price2: number, guests: number) => {
    if (guests <= 1) return price1;
    return price2 / 2;
  };

  const formatPrice = (price: number) => {
    return Number.isInteger(price) ? price.toString() : price.toFixed(2);
  };

  const perPersonPrice = getPerPersonPrice(selectedPackage.price1, selectedPackage.price2, guestCount);
  const totalTourPrice = perPersonPrice * guestCount;

  const handleGuestInputChange = (value: string) => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      setGuestCount(1);
      return;
    }
    setGuestCount(Math.max(1, parsed));
  };

  const waLink = `https://wa.me/201211385550?text=${encodeURIComponent(`Hi, I would like to book the ${tour.title} tour (${selectedPackage.label}) for ${guestCount} guest${guestCount > 1 ? 's' : ''}${preferredDate ? ` on ${preferredDate}` : ''}. Estimated total: $${formatPrice(totalTourPrice)}. Please share availability and final confirmation.`)}`;

  return (
    <>
      {/* ── Cinematic Hero ── */}
      <section style={{ position: 'relative', height: '85vh', minHeight: 520, display: 'flex', alignItems: 'flex-end', paddingBottom: 80, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${allImages[0]})`, backgroundSize: 'cover', backgroundPosition: 'center', animation: 'zoomIn 20s infinite alternate' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--navy) 0%, rgba(7,12,26,0.55) 45%, rgba(7,12,26,0.15) 100%)' }} />
        <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%', padding: '0 24px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
            <span style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', background: 'var(--gold)', color: 'var(--navy)', padding: '6px 14px', borderRadius: 2 }}>{tour.tourType}</span>
            <span style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '6px 14px', borderRadius: 2, backdropFilter: 'blur(4px)' }}>{tour.destination}</span>
            <span style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 14px', borderRadius: 2, backdropFilter: 'blur(4px)' }}>🕐 {tour.duration}</span>
          </div>
          <h1 className="font-heading" style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', fontWeight: 600, color: '#fff', marginBottom: 20, lineHeight: 1.1, textShadow: '0 4px 24px rgba(0,0,0,0.6)' }}>{tour.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: F, fontSize: '1rem', color: 'var(--gold)' }}>⭐ {tour.rating} <span style={{ color: 'var(--sand-2)', fontSize: '0.85rem' }}>({tour.reviews} reviews)</span></span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
            <span style={{ fontFamily: F, fontSize: '0.9rem', color: 'var(--sand-2)' }}>📍 {tour.location}</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
            <span style={{ fontFamily: F, fontSize: '0.9rem', color: 'var(--sand-2)' }}>🚐 Pickup {tour.pickupTime}</span>
          </div>
        </div>
      </section>

      {/* ── Quick Stats Bar ── */}
      <div style={{ background: 'rgba(201,168,76,0.06)', borderTop: '1px solid rgba(201,168,76,0.15)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 24px', display: 'flex', gap: 0, flexWrap: 'wrap', justifyContent: 'space-around' }}>
          {[
            { icon: '⏱', label: 'Duration', value: tour.duration },
            { icon: '🗓', label: 'Tour Type', value: tour.tourType },
            { icon: '🌍', label: 'Destination', value: tour.destination },
            { icon: '💰', label: 'From', value: `$${tour.basePrice} / person` },
            { icon: '⭐', label: 'Rating', value: `${tour.rating} (${tour.reviews})` },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '8px 16px' }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{stat.icon}</div>
              <div style={{ fontFamily: F, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--sand-3)', marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontFamily: F, fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Overview + Highlights ── */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 24px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
          <div>
            <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>About This Tour</div>
            <h2 className="font-heading" style={{ fontSize: '2rem', color: '#fff', marginBottom: 20, lineHeight: 1.2 }}>Overview</h2>
            <p style={{ fontFamily: F, fontSize: '1.05rem', color: 'var(--sand-2)', lineHeight: 1.85 }}>{tour.description}</p>
            {tour.note && (
              <div style={{ marginTop: 20, padding: '16px 20px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 2 }}>
                <span style={{ fontFamily: F, fontSize: '0.85rem', color: 'var(--sand-2)', fontStyle: 'italic' }}>📌 {tour.note}</span>
              </div>
            )}
          </div>
          <div>
            <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>What You'll See</div>
            <h2 className="font-heading" style={{ fontSize: '2rem', color: '#fff', marginBottom: 20, lineHeight: 1.2 }}>Highlights</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {tour.highlights.map((h, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ color: 'var(--gold)', marginTop: 2, flexShrink: 0 }}>✦</span>
                  <span style={{ fontFamily: F, fontSize: '0.95rem', color: 'var(--sand)', lineHeight: 1.6 }}>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Photo Gallery ── */}
      {allImages.length > 0 && (
        <section style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 24px 0' }}>
          <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Visual Journey</div>
          <h2 className="font-heading" style={{ fontSize: '2rem', color: '#fff', marginBottom: 32, lineHeight: 1.2 }}>Photo Gallery</h2>
          <GallerySection images={allImages} title={tour.title} />
        </section>
      )}

      {/* ── Read Full Guide CTA ── */}
      {blog && (
        <section style={{ padding: '60px 24px', background: 'linear-gradient(180deg, var(--navy) 0%, #060b18 100%)' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
              📖 In-Depth Travel Guide
            </div>
            <h2 className="font-heading" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#fff', marginBottom: 16, lineHeight: 1.2 }}>
              Want to Learn Everything About This Trip?
            </h2>
            <p style={{ fontFamily: F, fontSize: '1rem', color: 'var(--sand-2)', lineHeight: 1.8, marginBottom: 28, maxWidth: 600, margin: '0 auto 28px' }}>
              Read our comprehensive blog post with insider tips, historical context, travel advice, and everything you need to know about this incredible Egypt experience.
            </p>
            <Link
              href={`/blog/${blog.slug}`}
              className="btn-primary"
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              Read Full Travel Guide →
            </Link>
          </div>
        </section>
      )}

      {/* ── Itinerary ── */}
      <section style={{ padding: '80px 24px', background: '#070c1a' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Step by Step</div>
            <h2 className="font-heading" style={{ fontSize: '2rem', color: '#fff', lineHeight: 1.2 }}>Itinerary Breakdown</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, paddingLeft: 20, borderLeft: '2px solid rgba(201,168,76,0.2)', maxWidth: 700, margin: '0 auto' }}>
            {tour.itinerary.map((it, i) => (
              <div key={i} style={{ position: 'relative', paddingBottom: i < tour.itinerary.length - 1 ? 32 : 0 }}>
                <div style={{ position: 'absolute', left: -29, top: 4, width: 16, height: 16, borderRadius: '50%', background: 'var(--navy)', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)' }} />
                </div>
                <div style={{ fontFamily: F, fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold)', marginBottom: 4, letterSpacing: '0.1em' }}>{it.time}</div>
                <div style={{ fontFamily: F, fontSize: '1rem', color: 'var(--sand)', lineHeight: 1.6 }}>{it.activity}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Inclusions + Pricing + Booking ── */}
      <section style={{ padding: '80px 24px', background: 'var(--navy)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
          {/* Includes / Excludes */}
          <div>
            <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>What's Covered</div>
            <h2 className="font-heading" style={{ fontSize: '2rem', color: '#fff', marginBottom: 28, lineHeight: 1.2 }}>Inclusions</h2>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--sand-3)', marginBottom: 14 }}>Included ✓</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tour.includes.map((inc, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <span style={{ color: '#4ade80', flexShrink: 0, marginTop: 2 }}>✓</span>
                    <span style={{ fontFamily: F, fontSize: '0.9rem', color: 'var(--sand-2)', lineHeight: 1.5 }}>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--sand-3)', marginBottom: 14 }}>Not Included ✗</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tour.excludes.map((exc, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <span style={{ color: '#f87171', flexShrink: 0, marginTop: 2 }}>✗</span>
                    <span style={{ fontFamily: F, fontSize: '0.9rem', color: 'var(--sand-2)', lineHeight: 1.5 }}>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ marginTop: 24, padding: '16px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 2 }}>
              <div style={{ fontFamily: F, fontSize: '0.75rem', color: 'var(--sand-3)', marginBottom: 4 }}>📍 Meeting Point</div>
              <div style={{ fontFamily: F, fontSize: '0.9rem', color: 'var(--sand)' }}>{tour.meetingPoint}</div>
            </div>
          </div>

          {/* Pricing + Booking */}
          <div style={{ background: 'rgba(12,17,34,0.8)', border: '1px solid rgba(201,168,76,0.2)', padding: 32, borderRadius: 4, backdropFilter: 'blur(12px)' }}>
            <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Transparent Pricing</div>
            <h2 className="font-heading" style={{ fontSize: '2rem', color: '#fff', marginBottom: 24, lineHeight: 1.2 }}>Pricing</h2>
            <PricingTable priceTiers={tour.priceTiers} />

            <div style={{ textAlign: 'center', padding: '20px 0 24px' }}>
              <div style={{ fontFamily: F, fontSize: '0.75rem', color: 'var(--sand-3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 6 }}>Starting From</div>
              <div className="font-heading" style={{ fontSize: '3.5rem', color: 'var(--gold)', lineHeight: 1 }}>${tour.basePrice}</div>
              <div style={{ fontFamily: F, fontSize: '0.85rem', color: 'var(--sand-2)', marginTop: 6 }}>per person</div>
            </div>
            <div style={{ display: 'grid', gap: 14, marginBottom: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: F, fontSize: '0.8rem', color: 'var(--sand-2)' }}>
                  Number of Guests
                  <div className="guest-stepper">
                    <button
                      type="button"
                      onClick={() => setGuestCount((prev) => Math.max(1, prev - 1))}
                      className="guest-stepper-btn"
                      aria-label="Decrease guests"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      inputMode="numeric"
                      value={guestCount}
                      onChange={(e) => handleGuestInputChange(e.target.value)}
                      className="booking-input booking-input--number"
                      aria-label="Number of guests"
                    />
                    <button
                      type="button"
                      onClick={() => setGuestCount((prev) => prev + 1)}
                      className="guest-stepper-btn"
                      aria-label="Increase guests"
                    >
                      +
                    </button>
                  </div>
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: F, fontSize: '0.8rem', color: 'var(--sand-2)' }}>
                  Preferred Date
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="booking-input booking-input--date"
                  />
                </label>
              </div>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: F, fontSize: '0.8rem', color: 'var(--sand-2)' }}>
                Tour Package
                <select
                  value={selectedPackageIdx}
                  onChange={(e) => setSelectedPackageIdx(Number(e.target.value))}
                  className="booking-select"
                >
                  {tour.priceTiers.map((tier, idx) => (
                    <option key={idx} value={idx}>
                      {tier.label} — 1p: ${tier.price1}, 2+: ${Number.isInteger(tier.price2 / 2) ? tier.price2 / 2 : (tier.price2 / 2).toFixed(2)}/person
                    </option>
                  ))}
                </select>
              </label>

              <div style={{ padding: '16px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 2 }}>
                <div style={{ fontFamily: F, fontSize: '0.75rem', color: 'var(--sand-3)', marginBottom: 6 }}>Estimated Group Total</div>
                <div style={{ fontFamily: F, fontSize: '2rem', color: 'var(--gold)', fontWeight: 700 }}>${formatPrice(totalTourPrice)}</div>
                <div style={{ fontFamily: F, fontSize: '0.82rem', color: 'var(--sand-2)' }}>
                  ${formatPrice(perPersonPrice)} per person · {guestCount} guest{guestCount > 1 ? 's' : ''}{preferredDate ? ` · ${preferredDate}` : ''}
                </div>
              </div>
            </div>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', background: 'var(--gold)', color: 'var(--navy)', fontFamily: F, fontSize: '1rem', fontWeight: 700, padding: '18px 24px', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.15em', borderRadius: 2, marginBottom: 12, transition: 'all 0.3s' }}
            >
              <span>📱</span> Book via WhatsApp
            </a>
            <a
              href={`mailto:info@venuspyramids.com?subject=Booking: ${encodeURIComponent(tour.title)}`}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', background: 'transparent', color: 'var(--gold)', fontFamily: F, fontSize: '0.9rem', fontWeight: 600, padding: '14px 24px', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.12em', borderRadius: 2, border: '1px solid rgba(201,168,76,0.4)', transition: 'all 0.3s' }}
            >
              <span>✉️</span> Book via Email
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer Nav ── */}
      <div style={{ padding: '48px 24px', textAlign: 'center', background: '#040710', display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/#tours" style={{ fontFamily: F, fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--sand-3)', textDecoration: 'none', border: '1px solid rgba(201,168,76,0.3)', padding: '12px 24px', borderRadius: 2, transition: 'all 0.3s' }}>
          ← All Tours
        </Link>
        <Link href="/destinations" style={{ fontFamily: F, fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--sand-3)', textDecoration: 'none', border: '1px solid rgba(201,168,76,0.3)', padding: '12px 24px', borderRadius: 2, transition: 'all 0.3s' }}>
          🗺 Destinations
        </Link>
      </div>

      <style>{`
        @keyframes zoomIn {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        .booking-input,
        .booking-select {
          width: 100%;
          padding: 12px 14px;
          border-radius: 2px;
          border: 1px solid rgba(201,168,76,0.4);
          background: #07101f;
          color: #fff;
          font-family: ${F};
          min-height: 48px;
        }
        .booking-select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          padding-right: 38px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C9A84C' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          cursor: pointer;
        }
        .booking-select option {
          background-color: #07101f !important;
          color: #F5E6C8 !important;
        }
        .booking-select option:checked {
          background-color: #1a2240 !important;
          color: #DFCA7D !important;
        }
        .booking-select:hover {
          border-color: rgba(201,168,76,0.65);
        }
        .booking-input:focus,
        .booking-select:focus {
          outline: none;
          border-color: var(--gold-light);
          box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
        }
        .booking-input--date {
          color-scheme: dark;
        }
        .booking-input--date::-webkit-calendar-picker-indicator {
          filter: invert(88%) sepia(19%) saturate(556%) hue-rotate(356deg) brightness(97%) contrast(92%);
          cursor: pointer;
          opacity: 1;
        }
        .booking-input--date::-webkit-datetime-edit,
        .booking-input--date::-webkit-datetime-edit-text,
        .booking-input--date::-webkit-datetime-edit-month-field,
        .booking-input--date::-webkit-datetime-edit-day-field,
        .booking-input--date::-webkit-datetime-edit-year-field {
          color: #fff;
        }
        .guest-stepper {
          display: grid;
          grid-template-columns: 48px 1fr 48px;
          align-items: stretch;
          border: 1px solid rgba(201,168,76,0.4);
          background: #07101f;
          border-radius: 2px;
          overflow: hidden;
        }
        .guest-stepper:focus-within {
          border-color: var(--gold-light);
          box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
        }
        .guest-stepper-btn {
          border: none;
          background: rgba(201,168,76,0.08);
          color: var(--gold);
          font-size: 1.3rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.25s ease, color 0.25s ease;
        }
        .guest-stepper-btn:hover {
          background: rgba(201,168,76,0.16);
          color: var(--gold-light);
        }
        .booking-input--number {
          border: none;
          border-left: 1px solid rgba(201,168,76,0.18);
          border-right: 1px solid rgba(201,168,76,0.18);
          border-radius: 0;
          text-align: center;
          padding: 12px 8px;
          box-shadow: none;
          -moz-appearance: textfield;
        }
        .booking-input--number:focus {
          box-shadow: none;
        }
        .booking-input--number::-webkit-outer-spin-button,
        .booking-input--number::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </>
  );
}

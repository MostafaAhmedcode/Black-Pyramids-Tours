'use client';

import { Hotel } from '@/data/agencyData';

interface HotelCardProps {
  hotel: Hotel;
  onSelectRoom: (hotel: Hotel) => void;
}

export default function HotelCard({ hotel, onSelectRoom }: HotelCardProps) {
  // Render golden stars
  const renderStars = (starsCount: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        style={{
          color: i < starsCount ? 'var(--gold)' : 'rgba(201, 168, 76, 0.2)',
          fontSize: '0.9rem',
          marginRight: '2px'
        }}
      >
        ★
      </span>
    ));
  };

  // Maps amenities to text and icons
  const getAmenityDetails = (amenity: string) => {
    switch (amenity) {
      case 'WiFi':
        return { icon: '📶', label: 'Free WiFi' };
      case 'Pool':
        return { icon: '🏊', label: 'Luxury Pool' };
      case 'Breakfast':
        return { icon: '🍳', label: 'Breakfast' };
      case 'AC':
        return { icon: '❄️', label: 'A/C' };
      default:
        return { icon: '✓', label: amenity };
    }
  };

  return (
    <div
      className="card shimmer-wrap"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        background: 'linear-gradient(160deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 100%)',
        border: '1px solid rgba(201,168,76,0.18)',
        transition: 'all 0.4s ease',
      }}
    >
      {/* ── Image & Badges ── */}
      <div style={{ position: 'relative', width: '100%', height: 240, overflow: 'hidden' }}>
        <img
          src={hotel.image}
          alt={hotel.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
        
        {/* Dark image overlay */}
        <div
          className="img-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Location Badge */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            background: 'rgba(26, 26, 26, 0.85)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(201,168,76,0.3)',
            padding: '4px 10px',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--sand)',
          }}
        >
          📍 {hotel.location}
        </div>

        {/* Base Price Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            background: 'var(--burgundy)',
            padding: '6px 12px',
            border: '1px solid rgba(201,168,76,0.25)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <span style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--sand-2)' }}>From</span>
          <div style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1.1 }}>
            ${hotel.basePrice}
            <span style={{ fontSize: '0.68rem', fontWeight: 400, color: 'var(--sand-2)' }}>/nt</span>
          </div>
        </div>
      </div>

      {/* ── Content Body ── */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        
        {/* Stars and Rating */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          {renderStars(hotel.stars)}
          <span
            style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: '0.65rem',
              color: 'var(--sand-3)',
              marginLeft: '8px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {hotel.stars}★ Rated
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-heading"
          style={{
            fontSize: '1.45rem',
            fontWeight: 500,
            color: '#fff',
            marginBottom: 12,
            lineHeight: 1.2,
          }}
        >
          {hotel.name}
        </h3>

        {/* Short Description */}
        <p
          style={{
            fontSize: '0.92rem',
            color: 'var(--sand-2)',
            lineHeight: 1.6,
            marginBottom: 16,
            flexGrow: 1,
          }}
        >
          {hotel.description.length > 130 ? `${hotel.description.slice(0, 127)}...` : hotel.description}
        </p>

        {/* View Description */}
        <div
          style={{
            fontSize: '0.82rem',
            fontStyle: 'italic',
            color: 'var(--gold-light)',
            marginBottom: 20,
            paddingLeft: '12px',
            borderLeft: '2px solid var(--gold)',
          }}
        >
          👁 {hotel.viewDescription}
        </div>

        {/* Amenities Icons Row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          {hotel.amenities.map((am) => {
            const details = getAmenityDetails(am);
            return (
              <div
                key={am}
                title={details.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(201,168,76,0.12)',
                  padding: '4px 8px',
                  borderRadius: 2,
                  fontSize: '0.75rem',
                  color: 'var(--sand-2)',
                }}
              >
                <span>{details.icon}</span>
                <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0.02em' }}>
                  {details.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => onSelectRoom(hotel)}
            className="btn-primary"
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '0.68rem',
              textAlign: 'center',
            }}
          >
            Select Room
          </button>
          <a
            href={`https://wa.me/201211385550?text=Hi%2C%20I%20want%20to%20book%20a%20luxury%20stay%20at%20${encodeURIComponent(hotel.name)}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{
              padding: '12px 16px',
              fontSize: '0.68rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
            }}
          >
            Inquire
          </a>
        </div>
      </div>
    </div>
  );
}

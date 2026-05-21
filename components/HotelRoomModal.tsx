'use client';

import { useState } from 'react';
import { Hotel, RoomType } from '@/data/agencyData';

interface HotelRoomModalProps {
  hotel: Hotel | null;
  onClose: () => void;
  onSelectRoomType?: (roomType: RoomType) => void;
}

export default function HotelRoomModal({ hotel, onClose, onSelectRoomType }: HotelRoomModalProps) {
  const [selectedTab, setSelectedTab] = useState<'Standard' | 'Deluxe' | 'Suite'>('Standard');

  if (!hotel) return null;

  const rooms = hotel.rooms;
  const currentRoom = rooms[selectedTab];

  // WhatsApp pre-filled booking link helper
  const getWhatsAppLink = (room: RoomType) => {
    const text = `Hello Black Pyramids Tours! I am interested in booking the *${room.name}* room at *${hotel.name}* in *${hotel.location}*.\n\n- Room Type: ${room.name}\n- Price: $${room.price}/night\n- View: ${room.view}\n- Capacity: ${room.capacity} Guests\n\nPlease let me know the availability!`;
    return `https://wa.me/201211385550?text=${encodeURIComponent(text)}`;
  };

  return (
    <div
      className="modal-bg anim-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* ── Modal Container ── */}
      <div
        className="anim-modal-pop"
        style={{
          width: '100%',
          maxWidth: 780,
          background: 'linear-gradient(160deg, #222 0%, #161616 100%)',
          border: '1px solid var(--gold)',
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.8), 0 0 50px rgba(201, 168, 76, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          maxHeight: '90vh',
        }}
      >
        {/* Top Header Decor Line */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, var(--gold-dark), var(--gold), var(--gold-light))' }} />

        {/* ── Close Button ── */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(201,168,76,0.2)',
            color: 'var(--sand)',
            fontSize: '1.25rem',
            width: 38,
            height: 38,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.25s',
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--gold)';
            e.currentTarget.style.background = 'var(--burgundy)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          }}
        >
          ✕
        </button>

        {/* ── Header Title ── */}
        <div style={{ padding: '32px 32px 16px', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
          <span
            style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: '0.68rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              display: 'block',
              marginBottom: 4,
            }}
          >
            Hotel Suites & Rooms
          </span>
          <h2
            className="font-heading"
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
              color: '#fff',
              lineHeight: 1.2,
            }}
          >
            {hotel.name}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--sand-3)', margin: '4px 0 0' }}>
            📍 {hotel.location} · {hotel.stars}★ Luxury Sanctuary
          </p>
        </div>

        {/* ── Tabs (Room Types Selector) ── */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(0,0,0,0.2)',
            borderBottom: '1px solid rgba(201,168,76,0.08)',
          }}
        >
          {(['Standard', 'Deluxe', 'Suite'] as const).map((type) => {
            const isActive = selectedTab === type;
            const price = rooms[type].price;
            return (
              <button
                key={type}
                onClick={() => setSelectedTab(type)}
                style={{
                  flex: 1,
                  padding: '16px 8px',
                  background: isActive ? 'rgba(201,168,76,0.06)' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                  color: isActive ? '#fff' : 'var(--sand-3)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-playfair), serif',
                  fontSize: 'clamp(0.85rem, 2.2vw, 1.1rem)',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                }}
              >
                {type}
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                    fontSize: '0.68rem',
                    color: isActive ? 'var(--gold)' : 'var(--sand-3)',
                    marginTop: 2,
                    fontWeight: 500,
                  }}
                >
                  ${price}/nt
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Room Information Panel ── */}
        <div style={{ padding: '32px', overflowY: 'auto', flexGrow: 1 }} className="modal-scroll">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
            
            {/* Description & Overview */}
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  fontSize: '0.62rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--sand-3)',
                  display: 'block',
                  marginBottom: 8,
                }}
              >
                Room Description
              </span>
              <p style={{ fontSize: '0.98rem', color: 'var(--sand-2)', lineHeight: 1.6, margin: 0 }}>
                {currentRoom.description}
              </p>
            </div>

            {/* Spec Table */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 12,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(201,168,76,0.12)',
                padding: '16px',
              }}
            >
              {[
                { label: 'Room Size', val: currentRoom.size },
                { label: 'View Type', val: currentRoom.view },
                { label: 'Max Guests', val: `${currentRoom.capacity} Adults` },
                { label: 'Direct Rates', val: `$${currentRoom.price} USD / night` },
              ].map((spec) => (
                <div key={spec.label} style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-inter), sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)' }}>
                    {spec.label}
                  </span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#fff', marginTop: 3 }}>
                    {spec.val}
                  </span>
                </div>
              ))}
            </div>

            {/* Highlights Checklist */}
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  fontSize: '0.62rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--sand-3)',
                  display: 'block',
                  marginBottom: 12,
                }}
              >
                Suite Exclusives & Highlights
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {currentRoom.highlights.map((high) => (
                  <div
                    key={high}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: 'rgba(201, 168, 76, 0.05)',
                      border: '1px solid rgba(201,168,76,0.22)',
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      color: 'var(--sand)',
                    }}
                  >
                    <span style={{ color: 'var(--gold)' }}>✦</span>
                    <span>{high}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Footer CTAs ── */}
        <div
          style={{
            padding: '24px 32px 32px',
            borderTop: '1px solid rgba(201,168,76,0.12)',
            background: 'rgba(0,0,0,0.15)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--sand-3)', display: 'block' }}>
              Selected Option Summary
            </span>
            <span className="font-heading" style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 600 }}>
              {selectedTab} Room · <span style={{ color: 'var(--gold)' }}>${currentRoom.price}</span>
            </span>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => {
                if (onSelectRoomType) {
                  onSelectRoomType(currentRoom);
                }
              }}
              className="btn-secondary"
              style={{ padding: '12px 24px', fontSize: '0.72rem' }}
            >
              Add to Trip
            </button>
            <a
              href={getWhatsAppLink(currentRoom)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-burgundy"
              style={{
                textDecoration: 'none',
                padding: '12px 24px',
                fontSize: '0.72rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Book via WhatsApp
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .modal-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .modal-scroll::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }
        .modal-scroll::-webkit-scrollbar-thumb {
          background: var(--gold-dark);
        }
      `}</style>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { AgencyTour } from '@/data/agencyData';
import { Tour } from '@/data/tours';
import Link from 'next/link';

interface TourCardProps {
  tour: AgencyTour | Tour;
  index?: number;
}

export default function TourCard({ tour, index }: TourCardProps) {
  const [hovered, setHovered] = useState(false);

  // Normalize Tour / AgencyTour properties
  const id = tour.id;
  const title = tour.title;
  const duration = tour.duration;
  const description = tour.description;
  const image = tour.image;
  const rating = tour.rating;

  // Type checks and safe fallbacks
  const difficulty = 'difficulty' in tour ? tour.difficulty : 'Medium';
  const price = 'price' in tour ? tour.price : tour.basePrice;
  const included = 'included' in tour ? tour.included : tour.includes;
  const reviewsCount = 'reviewsCount' in tour ? tour.reviewsCount : tour.reviews;

  // Difficulty badge styling
  const getDifficultyColor = (diff: "Easy" | "Medium" | "Hard") => {
    switch (diff) {
      case 'Easy':
        return '#2E7D32'; // refined green
      case 'Medium':
        return 'var(--gold)'; // gold
      case 'Hard':
        return 'var(--burgundy-hover)'; // burgundy
      default:
        return 'var(--gold)';
    }
  };

  const getWhatsAppLink = () => {
    const text = `Hello Black Pyramids Tours! I want to book the luxury *${title}* tour.\n\n- Tour: ${title}\n- Duration: ${duration}\n- Price: $${price}/person\n- Inclusions: ${included.join(', ')}`;
    return `https://wa.me/201211385550?text=${encodeURIComponent(text)}`;
  };

  return (
    <div
      className="card shimmer-wrap"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'linear-gradient(160deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 100%)',
        border: hovered ? '1px solid rgba(201,168,76,0.55)' : '1px solid rgba(201,168,76,0.18)',
        boxShadow: hovered ? '0 24px 64px rgba(0,0,0,0.55), 0 0 40px rgba(201,168,76,0.08)' : '0 4px 20px rgba(0,0,0,0.3)',
        transition: 'border-color 0.35s ease, box-shadow 0.35s ease',
        position: 'relative',
      }}
    >
      {/* ── Image & Badges ── */}
      <Link
        href={`/tour/${id}`}
        target="_blank"
        style={{ display: 'block', position: 'relative', width: '100%', height: 220, overflow: 'hidden' }}
      >
        <img
          src={image}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
          }}
        />

        {/* Dark overlay */}
        <div
          className="img-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Difficulty Badge */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            background: 'rgba(26, 26, 26, 0.85)',
            border: `1px solid ${getDifficultyColor(difficulty)}`,
            padding: '4px 10px',
            fontSize: '0.62rem',
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#fff',
            backdropFilter: 'blur(6px)',
            zIndex: 2,
          }}
        >
          {difficulty}
        </div>

        {/* Duration Badge */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(26, 26, 26, 0.85)',
            border: '1px solid rgba(201,168,76,0.3)',
            padding: '4px 10px',
            fontSize: '0.62rem',
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--sand)',
            backdropFilter: 'blur(6px)',
            zIndex: 2,
          }}
        >
          🕒 {duration}
        </div>
      </Link>

      {/* ── Content Body ── */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        
        {/* Rating Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span style={{ color: 'var(--gold)', fontSize: '0.85rem' }}>★</span>
          <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-inter), sans-serif' }}>
            {rating.toFixed(2)}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--sand-3)', fontFamily: 'var(--font-inter), sans-serif' }}>
            ({reviewsCount} reviews)
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-heading"
          style={{
            fontSize: '1.25rem',
            fontWeight: 500,
            color: hovered ? 'var(--gold)' : '#fff',
            marginBottom: 12,
            lineHeight: 1.35,
            transition: 'color 0.3s',
          }}
        >
          <Link
            href={`/tour/${id}`}
            target="_blank"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {title}
          </Link>
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--sand-2)',
            lineHeight: 1.65,
            marginBottom: 16,
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </p>

        {/* Inclusions Row */}
        <div
          style={{
            borderTop: '1px solid rgba(201,168,76,0.12)',
            paddingTop: 16,
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {included.map((inc) => (
            <div key={inc} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--gold)', fontSize: '0.75rem' }}>✓</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--sand-2)' }}>
                {inc}
              </span>
            </div>
          ))}
        </div>

        {/* Price & CTA Section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            borderTop: '1px solid rgba(201,168,76,0.08)',
            paddingTop: 16,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-inter), sans-serif', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--sand-3)', display: 'block' }}>
              From
            </span>
            <span className="font-heading" style={{ fontSize: '1.6rem', color: 'var(--gold)', fontWeight: 600, lineHeight: 1.1 }}>
              ${price}
            </span>
            <span style={{ fontSize: '0.62rem', color: 'var(--sand-3)', display: 'block', marginTop: 1 }}>
              per person
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link
              href={`/tour/${id}`}
              target="_blank"
              className="btn-secondary"
              style={{
                fontSize: '0.68rem',
                padding: '10px 14px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Open The Trip
            </Link>

            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-burgundy"
              style={{
                fontSize: '0.68rem',
                padding: '10px 14px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Book Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

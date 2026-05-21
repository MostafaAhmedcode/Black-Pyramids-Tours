'use client';

import { useMemo, useState } from 'react';
import { egyptianHotels } from '@/data/hotelsData';

const CITIES = ['All Cities', 'Cairo', 'Giza', 'Sharm El Sheikh', 'Hurghada', 'Luxor', 'Aswan', 'Alexandria', 'Marsa Alam', 'Dahab', 'El Gouna'];
const RATINGS = [
  { value: 5, label: '5-Star', icon: '⭐' },
  { value: 4, label: '4-Star', icon: '⭐' },
  { value: 3, label: '3-Star', icon: '⭐' },
];
const PRICE_RANGES = [
  { min: 0, max: 200, label: 'Budget ($0-$200)' },
  { min: 200, max: 400, label: 'Mid-Range ($200-$400)' },
  { min: 400, max: 1000, label: 'Luxury ($400+)' },
];
const F = 'var(--font-inter), Inter, system-ui, sans-serif';

export default function HotelsPageClientV2() {
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<{ min: number; max: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHotels = useMemo(() => {
    return egyptianHotels.filter(hotel => {
      const cityMatch = selectedCity === 'All Cities' || hotel.city === selectedCity;
      const ratingMatch = selectedRating === null || hotel.rating === selectedRating;
      const priceMatch = 
        selectedPrice === null || 
        (hotel.price >= selectedPrice.min && hotel.price <= selectedPrice.max);
      const searchMatch = 
        searchQuery === '' ||
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.description.toLowerCase().includes(searchQuery.toLowerCase());

      return cityMatch && ratingMatch && priceMatch && searchMatch;
    });
  }, [selectedCity, selectedRating, selectedPrice, searchQuery]);

  const hasFilters =
    selectedCity !== 'All Cities' ||
    selectedRating !== null ||
    selectedPrice !== null ||
    searchQuery.trim() !== '';

  const resetFilters = () => {
    setSelectedCity('All Cities');
    setSelectedRating(null);
    setSelectedPrice(null);
    setSearchQuery('');
  };

  return (
    <div className="hotels-page-shell">
      <style>{`
        .hotels-page-shell {
          min-height: 100vh;
          background:
            radial-gradient(circle at top, rgba(201, 168, 76, 0.08), transparent 34%),
            linear-gradient(180deg, #070707 0%, #11100d 38%, #080808 100%);
          color: #fff;
          padding-top: 80px;
        }
        .hotels-hero {
          position: relative;
          overflow: hidden;
          padding: 72px 20px 56px;
        }
        .hotels-hero__image,
        .hotels-hero__overlay {
          position: absolute;
          inset: 0;
        }
        .hotels-hero__image {
          background-position: center;
          background-size: cover;
          opacity: 0.22;
          transform: scale(1.05);
        }
        .hotels-hero__overlay {
          background:
            linear-gradient(180deg, rgba(7, 7, 7, 0.38), rgba(7, 7, 7, 0.92)),
            radial-gradient(circle at center, rgba(223, 202, 125, 0.08), transparent 40%);
        }
        .hotels-hero__content,
        .hotels-intro,
        .hotels-filters-section,
        .hotels-results,
        .hotels-cta {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
        }
        .hotels-hero__content {
          text-align: center;
        }
        .hotels-kicker {
          font-family: ${F};
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 16px;
        }
        .hotels-hero h1 {
          margin: 0 0 18px;
          font-size: clamp(2.7rem, 5vw, 5rem);
          color: #fff;
          line-height: 0.98;
        }
        .hotels-hero p {
          max-width: 820px;
          margin: 0 auto;
          font-family: ${F};
          font-size: clamp(1rem, 1.8vw, 1.14rem);
          line-height: 1.9;
          color: var(--sand-2);
        }
        .hotels-hero__stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-top: 36px;
        }
        .hotels-stat-card {
          padding: 18px 16px;
          border: 1px solid rgba(201, 168, 76, 0.14);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 18px 36px rgba(0, 0, 0, 0.18);
        }
        .hotels-stat-value {
          font-family: var(--font-playfair), serif;
          font-size: 1.9rem;
          color: var(--gold);
          line-height: 1;
        }
        .hotels-stat-label {
          margin-top: 8px;
          font-family: ${F};
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--sand-3);
        }
        .hotels-intro {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
          gap: 24px;
          padding: 0 20px 36px;
        }
        .hotels-panel {
          background: linear-gradient(160deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
          border: 1px solid rgba(201, 168, 76, 0.15);
          padding: 28px;
          box-shadow: 0 26px 60px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .hotels-panel h2 {
          margin: 0 0 14px;
          color: #fff;
          font-size: clamp(1.7rem, 3vw, 2.5rem);
          line-height: 1.1;
        }
        .hotels-panel p {
          margin: 0 0 14px;
          color: var(--sand-2);
          font-family: ${F};
          line-height: 1.85;
          font-size: 0.95rem;
        }
        .hotels-signature-list,
        .hotels-service-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 20px;
        }
        .hotels-signature-item,
        .hotels-service-item {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(201, 168, 76, 0.12);
          color: var(--sand-2);
          font-family: ${F};
          font-size: 0.86rem;
        }
        .hotels-service-list {
          grid-template-columns: 1fr;
        }
        .hotels-filters-section {
          padding: 0 20px 18px;
        }
        .hotels-filters-card {
          background: linear-gradient(160deg, rgba(18, 16, 13, 0.92), rgba(10, 10, 10, 0.92));
          border: 1px solid rgba(201, 168, 76, 0.18);
          padding: 26px;
          box-shadow: 0 26px 70px rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
        }
        .hotels-filters-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
        }
        .hotels-filters-title {
          margin: 0;
          color: #fff;
          font-size: 1.35rem;
        }
        .hotels-results-pill {
          font-family: ${F};
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--gold);
        }
        .hotels-search-row {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 22px;
        }
        .hotels-search {
          width: 100%;
          min-width: 0;
          border-radius: 999px;
          border: 1px solid rgba(201, 168, 76, 0.18);
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          padding: 15px 18px;
          font-family: ${F};
          font-size: 0.95rem;
          outline: none;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
        }
        .hotels-search::placeholder {
          color: rgba(245, 230, 200, 0.58);
        }
        .hotels-search:focus {
          border-color: rgba(201, 168, 76, 0.42);
          box-shadow: 0 0 0 4px rgba(201, 168, 76, 0.08);
        }
        .hotels-filter-grid {
          display: grid;
          gap: 16px;
        }
        .hotels-filter-group {
          display: grid;
          gap: 10px;
        }
        .hotels-filter-label {
          font-family: ${F};
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--sand-3);
        }
        .hotels-chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .hotels-chip {
          padding: 10px 15px;
          border-radius: 999px;
          border: 1px solid rgba(201, 168, 76, 0.22);
          background: rgba(255, 255, 255, 0.03);
          color: var(--sand-2);
          font-family: ${F};
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .hotels-chip:hover,
        .hotels-chip.is-active {
          border-color: rgba(201, 168, 76, 0.5);
          color: var(--gold-light);
          background: rgba(201, 168, 76, 0.12);
          box-shadow: 0 8px 24px rgba(201, 168, 76, 0.12);
        }
        .hotels-filter-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 22px;
          flex-wrap: wrap;
        }
        .hotels-filter-summary {
          color: var(--sand-2);
          font-family: ${F};
          font-size: 0.88rem;
        }
        .hotels-results {
          padding: 10px 20px 52px;
        }
        .hotels-results-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
        }
        .hotels-results-header h2 {
          margin: 0 0 8px;
          color: #fff;
          font-size: clamp(1.8rem, 3vw, 2.8rem);
        }
        .hotels-results-header p {
          margin: 0;
          color: var(--sand-2);
          font-family: ${F};
        }
        .hotels-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }
        .hotel-card {
          display: flex;
          flex-direction: column;
          min-width: 0;
          height: 100%;
          background: linear-gradient(160deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.018));
          border: 1px solid rgba(201, 168, 76, 0.16);
          box-shadow: 0 26px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .hotel-card:hover {
          transform: translateY(-8px);
          border-color: rgba(201, 168, 76, 0.34);
          box-shadow: 0 36px 84px rgba(0, 0, 0, 0.38), 0 0 34px rgba(201, 168, 76, 0.1);
        }
        .hotel-card-media {
          position: relative;
          height: 250px;
          overflow: hidden;
        }
        .hotel-card-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .hotel-card:hover .hotel-card-media img {
          transform: scale(1.07);
        }
        .hotel-card-media::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.7)),
            radial-gradient(circle at top, rgba(223, 202, 125, 0.12), transparent 35%);
        }
        .hotel-badge {
          position: absolute;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 999px;
          font-family: ${F};
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }
        .hotel-badge--price {
          top: 14px;
          right: 14px;
          background: rgba(201, 168, 76, 0.92);
          color: #14110d;
        }
        .hotel-badge--rating {
          left: 14px;
          bottom: 14px;
          background: rgba(10, 10, 10, 0.72);
          color: var(--gold-light);
          border: 1px solid rgba(201, 168, 76, 0.24);
        }
        .hotel-card-body {
          display: flex;
          flex-direction: column;
          gap: 14px;
          flex: 1;
          padding: 22px;
        }
        .hotel-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          color: var(--sand-3);
          font-family: ${F};
          font-size: 0.74rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .hotel-card-title {
          margin: 0;
          color: #fff;
          font-size: 1.6rem;
          line-height: 1.15;
        }
        .hotel-card-description {
          margin: 0;
          color: var(--sand-2);
          font-family: ${F};
          line-height: 1.78;
          font-size: 0.92rem;
        }
        .hotel-card-amenities {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .hotel-amenity-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
          padding: 8px 11px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(201, 168, 76, 0.1);
          color: var(--sand-2);
          font-family: ${F};
          font-size: 0.74rem;
        }
        .hotel-card-info-strip {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }
        .hotel-card-info-item {
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(201, 168, 76, 0.1);
        }
        .hotel-card-info-item span {
          display: block;
        }
        .hotel-card-info-label {
          color: var(--gold);
          font-family: ${F};
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .hotel-card-info-value {
          color: var(--sand-2);
          font-family: ${F};
          font-size: 0.84rem;
        }
        .hotel-card-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .hotel-feature-pill {
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(201, 168, 76, 0.08);
          color: var(--gold-light);
          border: 1px solid rgba(201, 168, 76, 0.14);
          font-family: ${F};
          font-size: 0.74rem;
        }
        .hotel-card-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: auto;
          padding-top: 6px;
        }
        .hotel-card-actions .btn-primary,
        .hotel-card-actions .btn-secondary {
          text-decoration: none;
          text-align: center;
          flex: 1 1 180px;
          min-width: 0;
        }
        .hotels-empty-state {
          padding: 48px 24px;
          text-align: center;
          background: linear-gradient(160deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
          border: 1px solid rgba(201, 168, 76, 0.14);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.24);
        }
        .hotels-empty-state h3 {
          margin: 0 0 12px;
          font-size: 2rem;
          color: #fff;
        }
        .hotels-empty-state p {
          margin: 0 0 22px;
          color: var(--sand-2);
          font-family: ${F};
        }
        .hotels-cta {
          padding: 0 20px 72px;
        }
        .hotels-cta-card {
          position: relative;
          overflow: hidden;
          padding: 38px;
          border: 1px solid rgba(201, 168, 76, 0.2);
          background:
            radial-gradient(circle at top right, rgba(201, 168, 76, 0.14), transparent 35%),
            linear-gradient(145deg, rgba(17, 14, 11, 0.96), rgba(7, 7, 7, 0.96));
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.3);
        }
        .hotels-cta-card h2 {
          margin: 0 0 12px;
          font-size: clamp(2rem, 3vw, 3rem);
          color: #fff;
        }
        .hotels-cta-card p {
          margin: 0 0 24px;
          max-width: 760px;
          color: var(--sand-2);
          font-family: ${F};
          line-height: 1.85;
        }
        .hotels-cta-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }
        .hotels-cta-actions a {
          text-decoration: none;
        }
        @media (max-width: 1100px) {
          .hotels-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .hotels-hero__stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .hotels-intro {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .hotels-page-shell {
            padding-top: 72px;
          }
          .hotels-hero {
            padding: 56px 16px 42px;
          }
          .hotels-intro,
          .hotels-filters-section,
          .hotels-results,
          .hotels-cta {
            padding-left: 16px;
            padding-right: 16px;
          }
          .hotels-panel,
          .hotels-filters-card,
          .hotels-cta-card {
            padding: 22px;
          }
          .hotels-grid,
          .hotels-hero__stats,
          .hotels-signature-list {
            grid-template-columns: 1fr;
          }
          .hotels-results-header,
          .hotels-filters-top,
          .hotels-search-row,
          .hotels-filter-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .hotel-card-info-strip {
            grid-template-columns: 1fr;
          }
          .hotel-card-actions .btn-primary,
          .hotel-card-actions .btn-secondary {
            flex-basis: 100%;
          }
        }
        @media (max-width: 480px) {
          .hotels-kicker,
          .hotels-results-pill,
          .hotels-filter-label,
          .hotel-card-meta {
            letter-spacing: 0.12em;
          }
          .hotels-chip {
            width: 100%;
          }
        }
      `}</style>

      <section className="hotels-hero">
        <div
          className="hotels-hero__image"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1542314503-37143078c4c1?w=1600&h=1000&fit=crop&q=80)',
          }}
        />
        <div className="hotels-hero__overlay" />
        <div className="hotels-hero__content">
          <div className="hotels-kicker">Luxury Stays Across Egypt</div>
          <h1 className="font-heading">Handpicked Hotels For Every Egyptian Journey</h1>
          <p>
            Discover premium stays curated for unforgettable Egypt itineraries, from Nile-front icons in Cairo to
            Red Sea resorts, palace hotels in Luxor, and exclusive retreats with timeless service.
          </p>
          <div className="hotels-hero__stats">
            {[
              { value: `${egyptianHotels.length}+`, label: 'Luxury properties' },
              { value: `${new Set(egyptianHotels.map((hotel) => hotel.city)).size}`, label: 'Destinations covered' },
              { value: '$180+', label: 'Nightly rates' },
              { value: '4-5★', label: 'Curated collection' },
            ].map((stat) => (
              <div key={stat.label} className="hotels-stat-card">
                <div className="hotels-stat-value">{stat.value}</div>
                <div className="hotels-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hotels-intro">
        <div className="hotels-panel">
          <div className="hotels-kicker">Curated Experience</div>
          <h2 className="font-heading">Luxury hospitality aligned with the Black Pyramids style</h2>
          <p>
            Every hotel in this collection is selected to complement a premium Egypt journey, with standout design,
            service quality, location value, and atmosphere that suits bespoke cultural, leisure, and family travel.
          </p>
          <p>
            Use the filters below to narrow your stay by city, rating, or budget, then connect directly with our team
            for tailored recommendations and WhatsApp booking support.
          </p>
          <div className="hotels-signature-list">
            {[
              'Pyramid-view and Nile-view stays',
              'Beach resorts and spa escapes',
              'Historic palace and boutique hotels',
              'Private planning with live support',
            ].map((item) => (
              <div key={item} className="hotels-signature-item">
                <span>◆</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hotels-panel">
          <div className="hotels-kicker">Included Value</div>
          <h2 className="font-heading">Premium support beyond the booking</h2>
          <div className="hotels-service-list">
            {[
              'Fast WhatsApp assistance for room selection and rates',
              'Cross-city matching for Cairo, Giza, Luxor, Aswan, and coastal escapes',
              'Luxury transportation coordination with your hotel stay',
              'Expert advice for families, honeymooners, and custom itineraries',
            ].map((item) => (
              <div key={item} className="hotels-service-item">
                <span>✦</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hotels-filters-section">
        <div className="hotels-filters-card">
          <div className="hotels-filters-top">
            <div>
              <div className="hotels-kicker" style={{ marginBottom: 8 }}>Refine Collection</div>
              <h2 className="font-heading hotels-filters-title">Find the right luxury stay</h2>
            </div>
            <div className="hotels-results-pill">
              {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} available
            </div>
          </div>

          <div className="hotels-search-row">
            <input
              type="text"
              className="hotels-search"
              placeholder="Search by hotel name, city, or travel style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="hotels-filter-grid">
            <div className="hotels-filter-group">
              <span className="hotels-filter-label">Destination</span>
              <div className="hotels-chip-row">
                {CITIES.map(city => (
                  <button
                    key={city}
                    type="button"
                    className={`hotels-chip${selectedCity === city ? ' is-active' : ''}`}
                    onClick={() => setSelectedCity(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div className="hotels-filter-group">
              <span className="hotels-filter-label">Star Rating</span>
              <div className="hotels-chip-row">
                <button
                  type="button"
                  className={`hotels-chip${selectedRating === null ? ' is-active' : ''}`}
                  onClick={() => setSelectedRating(null)}
                >
                  All Ratings
                </button>
                {RATINGS.map(rating => (
                  <button
                    key={rating.value}
                    type="button"
                    className={`hotels-chip${selectedRating === rating.value ? ' is-active' : ''}`}
                    onClick={() => setSelectedRating(rating.value)}
                  >
                    {rating.label} {rating.icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="hotels-filter-group">
              <span className="hotels-filter-label">Price Range</span>
              <div className="hotels-chip-row">
                <button
                  type="button"
                  className={`hotels-chip${selectedPrice === null ? ' is-active' : ''}`}
                  onClick={() => setSelectedPrice(null)}
                >
                  All Prices
                </button>
                {PRICE_RANGES.map((range) => (
                  <button
                    key={range.label}
                    type="button"
                    className={`hotels-chip${selectedPrice?.min === range.min ? ' is-active' : ''}`}
                    onClick={() => setSelectedPrice(range)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="hotels-filter-actions">
            <div className="hotels-filter-summary">
              {hasFilters ? 'Filters are applied to refine your shortlist.' : 'Showing the full premium collection.'}
            </div>
            {hasFilters && (
              <button type="button" className="btn-secondary" onClick={resetFilters}>
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="hotels-results">
        <div className="hotels-results-header">
          <div>
            <div className="hotels-kicker" style={{ marginBottom: 8 }}>Luxury Portfolio</div>
            <h2 className="font-heading">Premium hotels across Egypt</h2>
            <p>Elegant stays selected for comfort, service, and location quality.</p>
          </div>
          <div className="hotels-results-pill">
            {filteredHotels.length} match{filteredHotels.length !== 1 ? 'es' : ''}
          </div>
        </div>

        {filteredHotels.length > 0 ? (
          <div className="hotels-grid">
            {filteredHotels.map((hotel) => (
              <article key={hotel.id} className="hotel-card">
                <div className="hotel-card-media">
                  <img src={hotel.image} alt={hotel.name} />
                  <div className="hotel-badge hotel-badge--price">
                    From ${hotel.price}/night
                  </div>
                  <div className="hotel-badge hotel-badge--rating">
                    {'★'.repeat(hotel.rating)} {hotel.rating}.0
                  </div>
                </div>

                <div className="hotel-card-body">
                  <div className="hotel-card-meta">
                    <span>{hotel.city}</span>
                    <span>{hotel.reviewCount.toLocaleString()} reviews</span>
                  </div>

                  <h3 className="font-heading hotel-card-title">{hotel.name}</h3>

                  <p className="hotel-card-description">{hotel.description}</p>

                  <div className="hotel-card-amenities">
                    {hotel.amenities.slice(0, 4).map((amenity) => (
                      <span key={amenity.name} className="hotel-amenity-chip">
                        <span>{amenity.icon}</span>
                        <span>{amenity.name}</span>
                      </span>
                    ))}
                  </div>

                  <div className="hotel-card-info-strip">
                    <div className="hotel-card-info-item">
                      <span className="hotel-card-info-label">Location</span>
                      <span className="hotel-card-info-value">{hotel.location}</span>
                    </div>
                    <div className="hotel-card-info-item">
                      <span className="hotel-card-info-label">Stay Window</span>
                      <span className="hotel-card-info-value">{hotel.checkIn} check-in · {hotel.checkOut} check-out</span>
                    </div>
                  </div>

                  <div className="hotel-card-features">
                    {hotel.features.slice(0, 3).map((feature) => (
                      <span key={feature} className="hotel-feature-pill">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="hotel-card-actions">
                    <a
                      href={`https://wa.me/201211385550?text=Hi%2C%20I%20would%20like%20to%20reserve%20${encodeURIComponent(hotel.name)}%20in%20${encodeURIComponent(hotel.city)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      Reserve via WhatsApp
                    </a>
                    <a href="/contact" className="btn-secondary">
                      Tailor My Stay
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="hotels-empty-state">
            <h3 className="font-heading">No hotels match that combination yet</h3>
            <p>Adjust the city, rating, or budget filters to reopen the full curated collection.</p>
            <button type="button" className="btn-primary" onClick={resetFilters}>
              Show All Hotels
            </button>
          </div>
        )}
      </section>

      <section className="hotels-cta">
        <div className="hotels-cta-card">
          <div className="hotels-kicker" style={{ marginBottom: 10 }}>Need Expert Guidance?</div>
          <h2 className="font-heading">Let our team match the right hotel to your itinerary</h2>
          <p>
            Share your dates, destination preferences, and travel style, and we will recommend the strongest hotel
            options for your Egypt experience with coordinated tours and transfers if needed.
          </p>
          <div className="hotels-cta-actions">
            <a
              href="https://wa.me/201211385550?text=Hi!%20I%20need%20help%20choosing%20a%20hotel%20in%20Egypt."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Chat on WhatsApp
            </a>
            <a href="/contact" className="btn-secondary">
              Request Custom Planning
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

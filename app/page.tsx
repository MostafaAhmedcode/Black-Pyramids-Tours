'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TourCard from '../components/TourCard';
import HotelCard from '../components/HotelCard';
import HotelRoomModal from '../components/HotelRoomModal';
import ScrollObserver from '../components/ScrollObserver';
import {
  featuredHotels,
  featuredTours,
  topDestinations,
  guestTestimonials,
  Hotel,
  RoomType,
  AgencyTour
} from '../data/agencyData';

const F = 'var(--font-inter), Inter, system-ui, sans-serif';

interface SelectedTripItem {
  id: string; // unique item id
  name: string;
  type: 'Hotel' | 'Tour';
  details: string;
  price: number;
}

function SectionHeading({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 56 }}>
      <div
        className="section-label"
        style={{
          fontFamily: 'var(--font-inter), Inter, sans-serif',
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          marginBottom: 16
        }}
      >
        {label}
      </div>
      <h2
        className="font-heading"
        style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
          fontWeight: 400,
          color: '#fff',
          marginBottom: 16,
          lineHeight: 1.15
        }}
      >
        {title}
      </h2>
      
      {/* Decorative Golden Ornament Divider */}
      <div className="gold-divider">
        <span>◆</span>
      </div>

      {subtitle && (
        <p
          className="font-sub"
          style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            fontStyle: 'italic',
            color: 'var(--sand-2)',
            maxWidth: 640,
            margin: '20px auto 0',
            lineHeight: 1.75
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a', color: 'var(--gold)' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '3rem', animation: 'pulse-gold 2s infinite' }}>▲</span>
          <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.2rem', marginTop: 12 }}>Loading Gateway...</p>
        </div>
      </div>
    }>
      <HomeInner />
    </Suspense>
  );
}

function HomeInner() {
  const [selectedStars, setSelectedStars] = useState<'All' | 3 | 4 | 5>('All');
  const [selectedHotelForModal, setSelectedHotelForModal] = useState<Hotel | null>(null);
  
  // Trip Builder state
  const [tripCart, setTripCart] = useState<SelectedTripItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const searchParams = useSearchParams();

  // Scroll handler from destination links if needed
  useEffect(() => {
    const d = searchParams.get('destination');
    if (d) {
      const section = document.getElementById('tours');
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth' });
        }, 400);
      }
    }
  }, [searchParams]);

  // Toast notifier helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Add Item to Trip Cart
  const handleAddHotelRoomToTrip = (room: RoomType) => {
    if (!selectedHotelForModal) return;
    const newItem: SelectedTripItem = {
      id: `hotel-${selectedHotelForModal.id}-${room.name}-${Date.now()}`,
      name: selectedHotelForModal.name,
      type: 'Hotel',
      details: `${room.name} Room (${room.view})`,
      price: room.price
    };
    setTripCart(prev => [...prev, newItem]);
    setSelectedHotelForModal(null);
    showToast(`Added ${room.name} Room at ${selectedHotelForModal.name} to your Custom Package!`);
  };

  const handleRemoveTripItem = (itemId: string) => {
    setTripCart(prev => prev.filter(item => item.id !== itemId));
  };

  // Generate complete WhatsApp booking message from selected basket
  const getWhatsAppCartLink = () => {
    if (tripCart.length === 0) return '#';
    let text = `Hello Black Pyramids Tours! I have customized a luxury Egypt trip package on your website.\n\nHere are my selected reservations:\n\n`;
    
    tripCart.forEach((item, index) => {
      text += `${index + 1}. *[${item.type}]* ${item.name} — ${item.details} ($${item.price})\n`;
    });

    const totalCost = tripCart.reduce((sum, item) => sum + item.price, 0);
    text += `\n*Estimated Package Total:* $${totalCost} USD\n\nPlease let me know the availability and how to proceed with final reservations!`;
    return `https://wa.me/201211385550?text=${encodeURIComponent(text)}`;
  };

  // Star filtering logic
  const filteredHotels = featuredHotels.filter(hotel => {
    if (selectedStars === 'All') return true;
    return hotel.stars === selectedStars;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--charcoal)', position: 'relative' }}>
      
      {/* ── Navbar & Hero ── */}
      <Navbar />
      <Hero />

      {/* ── 1. SERVICES SECTION (4 cards) ── */}
      <section id="services" style={{ padding: '112px 24px 80px', background: 'linear-gradient(180deg, var(--charcoal) 0%, #202020 100%)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <ScrollObserver>
            <SectionHeading
              label="Exclusive Travel Services"
              title="Tailored Luxury Egypt Gateways"
              subtitle="Est. 2005. We coordinate all aspect of your journey with meticulous attention to detail and five-star standards."
            />
          </ScrollObserver>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              {
                icon: '🔑',
                title: 'Hotel Reservations',
                desc: 'Handpicked 5-star sanctuaries, Nile view suites, historic palaces, and exclusive Red Sea beach beachfronts at special agency rates.'
              },
              {
                icon: '🔺',
                title: 'Private Guided Tours',
                desc: 'Expert bilingual Egyptologists guiding you in private modern luxury vehicles through Cairo, Luxor, Aswan, Giza, and Alexandria.'
              },
              {
                icon: '🚗',
                title: 'Luxury Transportation',
                desc: 'Chauffeur-driven premium cars, secure airport transfers with English-speaking VIP drivers, and transfers across all domestic regions.'
              },
              {
                icon: '🗺️',
                title: 'Full Trip Planning',
                desc: 'Bespoke custom itineraries, dining reservations, flights, domestic cruises, and round-the-clock concierge help since 2005.'
              }
            ].map((srv, i) => (
              <ScrollObserver key={i} className={`delay-${(i + 1) * 100}`}>
                <div
                  className="card shimmer-wrap"
                  style={{
                    padding: '40px 32px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    background: 'linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                    border: '1px solid rgba(201,168,76,0.15)',
                    transition: 'all 0.35s ease'
                  }}
                >
                  <div className="icon-box" style={{ marginBottom: 24, fontSize: '1.6rem' }}>
                    {srv.icon}
                  </div>
                  <h3
                    className="font-heading"
                    style={{
                      fontSize: '1.35rem',
                      color: '#fff',
                      marginBottom: 12,
                      fontWeight: 500
                    }}
                  >
                    {srv.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.92rem',
                      color: 'var(--sand-2)',
                      lineHeight: 1.7,
                      margin: 0
                    }}
                  >
                    {srv.desc}
                  </p>
                </div>
              </ScrollObserver>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. TOURS SECTION (6 cards) ── */}
      <section id="tours" style={{ padding: '112px 24px 80px', background: '#1e1e1e' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <ScrollObserver>
            <SectionHeading
              label="Signature Guided Journeys"
              title="Curated Private Tours"
              subtitle="All transfers are private and chauffeured. Licensed English-speaking guides and authentic local lunch experiences are fully integrated."
            />
          </ScrollObserver>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
            {featuredTours.map((tour, index) => (
              <ScrollObserver key={tour.id} className={`delay-${((index % 3) + 1) * 100}`}>
                <TourCard tour={tour} />
              </ScrollObserver>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. HOTELS SECTION (6 hotels + Star rating filter) ── */}
      <section id="hotels" style={{ padding: '112px 24px 80px', background: 'linear-gradient(180deg, #1e1e1e 0%, var(--charcoal) 100%)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <ScrollObserver>
            <SectionHeading
              label="Luxury Sanctuaries"
              title="Handpicked 5-Star Hotels"
              subtitle="Agoda & Booking award winners. Discover legendary palaces and beach sanctuaries across historic Egyptian settings."
            />
          </ScrollObserver>

          {/* Star Filter Navigation */}
          <ScrollObserver>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 12,
                marginBottom: 48,
                flexWrap: 'wrap'
              }}
            >
              {[
                { val: 'All', label: 'Show All' },
                { val: 5, label: '5★ Luxury' },
                { val: 4, label: '4★ Superior' },
                { val: 3, label: '3★ Boutique' }
              ].map((pill) => {
                const isActive = selectedStars === pill.val;
                return (
                  <button
                    key={pill.label}
                    onClick={() => setSelectedStars(pill.val as any)}
                    className={`filter-pill ${isActive ? 'active' : ''}`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </ScrollObserver>

          {/* Hotels Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel, index) => (
                <ScrollObserver key={hotel.id} className={`delay-${((index % 3) + 1) * 100}`}>
                  <HotelCard
                    hotel={hotel}
                    onSelectRoom={(h) => setSelectedHotelForModal(h)}
                  />
                </ScrollObserver>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px' }}>
                <p className="font-sub" style={{ fontSize: '1.3rem', fontStyle: 'italic', color: 'var(--sand-3)' }}>
                  We currently offer selected 4★ and 5★ luxury properties. No 3★ boutique properties are featured in our current luxury catalogue.
                </p>
                <button
                  onClick={() => setSelectedStars('All')}
                  className="btn-secondary"
                  style={{ marginTop: 20 }}
                >
                  Show All Hotels
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 4. DESTINATIONS SECTION (8 locations + Zoom hovers) ── */}
      <section id="destinations" style={{ padding: '112px 24px 80px', background: '#1c1c1c' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <ScrollObserver>
            <SectionHeading
              label="Inspiring Travel Blocks"
              title="Explore Iconic Destinations"
              subtitle="From the buzzing historic streets of Cairo to the mystical sand dunes of Siwa, discover the majestic locations we guide you through."
            />
          </ScrollObserver>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 20
            }}
          >
            {topDestinations.map((dest, idx) => (
              <ScrollObserver key={dest.id} className={`delay-${((idx % 4) + 1) * 100}`}>
                <div
                  className="shimmer-wrap"
                  style={{
                    position: 'relative',
                    height: 320,
                    overflow: 'hidden',
                    border: '1px solid rgba(201,168,76,0.18)',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1) rotate(1deg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1) rotate(0)';
                    }}
                  />
                  
                  {/* Subtle dark gradient overlay */}
                  <div
                    className="img-overlay"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Text Details overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: 24,
                      zIndex: 3
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: '1.4rem' }}>{dest.emoji}</span>
                      <h4
                        className="font-heading"
                        style={{
                          fontSize: '1.6rem',
                          color: '#fff',
                          margin: 0,
                          fontWeight: 500
                        }}
                      >
                        {dest.name}
                      </h4>
                    </div>
                    <p
                      style={{
                        fontFamily: 'var(--font-inter), Inter, sans-serif',
                        fontSize: '0.75rem',
                        color: 'var(--sand-2)',
                        margin: 0,
                        letterSpacing: '0.02em',
                        lineHeight: 1.4
                      }}
                    >
                      {dest.tagline}
                    </p>
                  </div>
                </div>
              </ScrollObserver>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. WHY CHOOSE US (Stats & Promises) ── */}
      <section id="why-us" style={{ padding: '112px 24px 80px', background: 'linear-gradient(180deg, #1c1c1c 0%, var(--charcoal) 100%)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <ScrollObserver>
            <SectionHeading
              label="Our Elite Standards"
              title="The Gateway Distinction"
              subtitle="Since 2005, we have provided an unbeatable travel experience focusing on comfort, safety, and luxury details."
            />
          </ScrollObserver>

          {/* Stats Bar */}
          <ScrollObserver>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 24,
                marginBottom: 64,
                borderTop: '1px solid rgba(201, 168, 76, 0.15)',
                borderBottom: '1px solid rgba(201, 168, 76, 0.15)',
                padding: '40px 0',
                background: 'rgba(255,255,255,0.01)'
              }}
            >
              {[
                { val: '20+', label: 'Years Experience' },
                { val: '15,000+', label: 'Distinguished Guests' },
                { val: '50+', label: 'Certified Elite Guides' },
                { val: '4.9★', label: 'Average Guest Rating' }
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: 'center', padding: '0 16px' }}>
                  <div
                    className="font-heading gradient-text"
                    style={{
                      fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                      fontWeight: 700,
                      lineHeight: 1,
                      marginBottom: 8
                    }}
                  >
                    {stat.val}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-inter), Inter, sans-serif',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--sand-2)'
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </ScrollObserver>

          {/* Key Advantages Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
            {[
              {
                icon: '🔺',
                title: 'Breathtaking Proximity',
                desc: 'Experience hotels with direct, majestic views of the Giza Pyramids and key monuments from private terraces.'
              },
              {
                icon: '🚗',
                title: 'Exclusive Chauffeur VIP Fleet',
                desc: 'Chauffeured inside luxurious, high-end private air-conditioned cars with experienced, secure drivers.'
              },
              {
                icon: '🗣️',
                title: 'Fluent English Personnel',
                desc: 'Every single representative, guide, driver, and coordinator speaks flawless English to guarantee seamless communication.'
              }
            ].map((adv, idx) => (
              <ScrollObserver key={idx} className={`delay-${(idx + 1) * 100}`}>
                <div
                  className="card"
                  style={{
                    padding: '36px',
                    textAlign: 'center',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(201,168,76,0.18)',
                    transition: 'all 0.35s ease'
                  }}
                >
                  <div
                    style={{
                      fontSize: '2.5rem',
                      marginBottom: 16,
                      display: 'inline-block'
                    }}
                  >
                    {adv.icon}
                  </div>
                  <h3
                    className="font-heading"
                    style={{
                      fontSize: '1.25rem',
                      color: 'var(--gold)',
                      marginBottom: 12
                    }}
                  >
                    {adv.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--sand-2)',
                      lineHeight: 1.7,
                      margin: 0
                    }}
                  >
                    {adv.desc}
                  </p>
                </div>
              </ScrollObserver>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. TESTIMONIALS SECTION (3 guests) ── */}
      <section id="testimonials" style={{ padding: '112px 24px 80px', background: '#1c1c1c' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <ScrollObserver>
            <SectionHeading
              label="Voices of Excellence"
              title="What Our Distinguished Guests Say"
              subtitle="Real guest reviews from around the globe, outlining our commitment to elite pharaonic hospitality."
            />
          </ScrollObserver>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
            {guestTestimonials.map((test, index) => (
              <ScrollObserver key={test.id} className={`delay-${(index + 1) * 100}`}>
                <div
                  className="card"
                  style={{
                    padding: '40px 32px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(201,168,76,0.15)'
                  }}
                >
                  {/* Stars rating */}
                  <div style={{ marginBottom: 16 }}>
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <span key={i} style={{ color: 'var(--gold)', fontSize: '0.95rem', marginRight: 2 }}>★</span>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p
                    style={{
                      fontSize: '0.98rem',
                      fontStyle: 'italic',
                      color: 'var(--sand)',
                      lineHeight: 1.7,
                      marginBottom: 28,
                      flexGrow: 1
                    }}
                  >
                    "{test.text}"
                  </p>

                  {/* Guest Profile Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderTop: '1px solid rgba(201,168,76,0.1)', paddingTop: 20 }}>
                    <img
                      src={test.avatar}
                      alt={test.name}
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1.5px solid var(--gold)'
                      }}
                    />
                    <div>
                      <h4
                        className="font-heading"
                        style={{
                          fontSize: '1.1rem',
                          color: '#fff',
                          margin: 0,
                          fontWeight: 500
                        }}
                      >
                        {test.name}
                      </h4>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-inter), sans-serif',
                          color: 'var(--sand-3)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          marginTop: 2
                        }}
                      >
                        {test.flag} {test.country}
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollObserver>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. NEWSLETTER & OFFERS BANNER ── */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, rgba(92,26,26,0.2) 0%, rgba(26,26,26,0.85) 100%)', borderTop: '1px solid rgba(201,168,76,0.2)', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <ScrollObserver>
            <span style={{ fontSize: '2.5rem', marginBottom: 12, display: 'inline-block' }}>🎁</span>
            <h3 className="font-heading" style={{ fontSize: '1.8rem', color: 'var(--gold)', marginBottom: 8, fontWeight: 500 }}>
              Plan a Custom Expedition
            </h3>
            <p className="font-sub" style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--sand)', marginBottom: 28, lineHeight: 1.6 }}>
              "Est. 2005 — Book any 3 signature luxury guided tours and obtain the 4th tour completely complimentary!"
            </p>
            <a
              href="https://wa.me/201211385550?text=Hello%20Black%20Pyramids%20Tours%2C%20I%20would%20like%20to%20claim%20the%20Book%203%20Get%201%20Free%20tour%20promotion%21"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-burgundy"
              style={{ textDecoration: 'none' }}
            >
              Claim Special Offer
            </a>
          </ScrollObserver>
        </div>
      </section>

      {/* ── 8. EGYPT BLOG SECTION ── */}
      {/* (Integrating an elegant preview section to fit design system) */}
      <section id="blog" style={{ padding: '112px 24px 80px', background: 'var(--charcoal)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <ScrollObserver>
            <SectionHeading
              label="Egypt Travel Insights"
              title="The Pharaonic Gateway Blog"
              subtitle="Practical luxury travel tips, historical deep-dives, and guides written by our native Egyptologist scholars."
            />
          </ScrollObserver>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
            {[
              {
                title: "Deciphering the Giza Pyramids Complex",
                date: "May 18, 2026",
                desc: "An in-depth scholarly guide detailing standard historical controversies, opening schedules, and premium viewpoints.",
                img: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=600&q=80&fit=crop"
              },
              {
                title: "Luxor Temple Illuminated by Night",
                date: "May 12, 2026",
                desc: "Why visiting the historic colossal statues of Ancient Thebes after sunset yields the most atmospheric, luxury views.",
                img: "https://images.unsplash.com/photo-1557821552-17105176677c?w=600&q=80&fit=crop"
              },
              {
                title: "A Golden Sailing Guide to Nubian Aswan",
                date: "April 29, 2026",
                desc: "Chartering private classical felucca sailboats around historic Elephantine island granite cliffs and cataract regions.",
                img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80&fit=crop"
              }
            ].map((post, index) => (
              <ScrollObserver key={index} className={`delay-${(index + 1) * 100}`}>
                <div
                  className="card shimmer-wrap"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    background: 'rgba(255,255,255,0.015)',
                    border: '1px solid rgba(201,168,76,0.12)'
                  }}
                >
                  <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                    <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-inter), sans-serif', color: 'var(--gold)', letterSpacing: '0.05em' }}>
                      {post.date}
                    </span>
                    <h4 className="font-heading" style={{ fontSize: '1.2rem', color: '#fff', margin: '8px 0 12px', fontWeight: 500, lineHeight: 1.3 }}>
                      {post.title}
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--sand-2)', lineHeight: 1.6, margin: '0 0 20px', flexGrow: 1 }}>
                      {post.desc}
                    </p>
                    <a
                      href="/blog"
                      style={{
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-inter), Inter, sans-serif',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--gold)',
                        letterSpacing: '0.1em',
                        textDecoration: 'none',
                        marginTop: 'auto',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      Read Article <span>→</span>
                    </a>
                  </div>
                </div>
              </ScrollObserver>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. PRE-FOOTER CALL TO ACTION ── */}
      <section id="contact" style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden', background: '#121212', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />
        <ScrollObserver>
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <span style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 16 }}>
              Embark on Luxury
            </span>
            <h2 className="font-heading" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 400, color: '#fff', marginBottom: 16, lineHeight: 1.2 }}>
              Ready to Explore Ancient Egypt?
            </h2>
            
            <div className="gold-divider" style={{ margin: '20px 0 24px' }}>
              <span>◆</span>
            </div>

            <p className="font-sub" style={{ fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--sand-2)', marginBottom: 40, lineHeight: 1.75 }}>
              Book exclusive accommodations, design custom private daily tours, and secure professional transport. Our English-speaking specialists will orchestrate the perfect Egyptian getaway.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
              <a href="https://wa.me/201211385550?text=Hello%20Black%20Pyramids%20Tours%2C%20I%20would%20like%20to%20plan%20a%20luxury%20egypt%20trip%21" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>
                Chat via WhatsApp
              </a>
              <a href="#tours" className="btn-secondary" style={{ textDecoration: 'none' }}>
                Browse Tours
              </a>
              <a href="mailto:info@blackpyramidsgateway.com" className="btn-secondary" style={{ textDecoration: 'none' }}>
                Email Planning Team
              </a>
            </div>
          </div>
        </ScrollObserver>
      </section>

      {/* ── 10. ELITE FOOTER ── */}
      <footer style={{ background: '#0e0e0e', borderTop: '1px solid rgba(201,168,76,0.18)', padding: '80px 24px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 48, marginBottom: 64 }}>
            
            {/* Column 1: Brand Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 10 L15 85 L50 85 Z" fill="url(#pyramid-gold-left-footer)" />
                  <path d="M50 10 L85 85 L50 85 Z" fill="url(#pyramid-gold-right-footer)" />
                  <path d="M50 10 L50 85" stroke="#DFCA7D" strokeWidth="1.5" />
                  <defs>
                    <linearGradient id="pyramid-gold-left-footer" x1="50" y1="10" x2="15" y2="85" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#DFCA7D" />
                      <stop offset="100%" stopColor="#9B7D2F" />
                    </linearGradient>
                    <linearGradient id="pyramid-gold-right-footer" x1="50" y1="10" x2="85" y2="85" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#9B7D2F" />
                      <stop offset="100%" stopColor="#5E4716" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                  <span className="font-heading" style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.12em', color: '#fff', textTransform: 'uppercase' }}>
                    Black Pyramids
                  </span>
                  <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.24em', color: 'var(--gold)', textTransform: 'uppercase' }}>
                    Gateway
                  </span>
                </div>
              </div>
              
              <p style={{ fontSize: '0.88rem', color: 'var(--sand-3)', lineHeight: 1.8, margin: 0 }}>
                Your award-winning gate to Egypt's ancient wonders. Handpicked 5-star hotel reservations, private guided tours, and premium chauffeured luxury transport since 2005.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 style={{ fontFamily: F, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 24 }}>
                Elite Services
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Signature Tours', href: '#tours' },
                  { label: 'Luxury Hotels', href: '#hotels' },
                  { label: 'VIP Transportation', href: '#services' },
                  { label: 'Top Destinations', href: '#destinations' },
                  { label: 'Concierge Team', href: '/team' },
                  { label: 'Travel Blog', href: '#blog' }
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--sand-2)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--sand-2)')}
                  >
                    <span style={{ color: 'var(--gold)', fontSize: '0.5rem' }}>◆</span> {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 3: Contact Info */}
            <div>
              <h4 style={{ fontFamily: F, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 24 }}>
                Contact & Address
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { icon: '✉️', val: 'info@blackpyramidsgateway.com', href: 'mailto:info@blackpyramidsgateway.com' },
                  { icon: '📞', val: '+20 101 815 7153', href: 'tel:+201211385550' },
                  { icon: '💬', val: 'WhatsApp Chat Support', href: 'https://wa.me/201211385550' },
                  { icon: '📍', val: 'Nazlet El Batran, Pyramids Giza', href: '#' }
                ].map((c, i) => (
                  <a
                    key={i}
                    href={c.href}
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--sand-2)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--sand-2)')}
                  >
                    <span style={{ fontSize: '0.9rem' }}>{c.icon}</span> {c.val}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h4 style={{ fontFamily: F, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 24 }}>
                Newsletter Sign Up
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--sand-3)', lineHeight: 1.6, marginBottom: 16 }}>
                Subscribe to receive private offers, curated travel itineraries, and pharaonic history blogs directly in your inbox.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast("Thank you for subscribing to our luxury Egypt updates!");
                  (e.target as HTMLFormElement).reset();
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your luxury email"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(201, 168, 76, 0.25)',
                    color: 'var(--sand)',
                    padding: '10px 14px',
                    fontFamily: F,
                    fontSize: '0.82rem',
                    outline: 'none',
                    borderRadius: 2
                  }}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    padding: '10px',
                    fontSize: '0.68rem',
                    letterSpacing: '0.1em'
                  }}
                >
                  Subscribe
                </button>
              </form>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div
            style={{
              borderTop: '1px solid rgba(201, 168, 76, 0.12)',
              paddingTop: 32,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16
            }}
          >
            <p style={{ fontSize: '0.82rem', color: 'var(--sand-3)', margin: 0 }}>
              © 2026 Black Pyramids Tours · Est. 2005. All rights reserved.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 16, height: 1, background: 'var(--gold)', display: 'inline-block' }} />
              <span style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                Your Gateway to Ancient Egypt
              </span>
              <span style={{ width: 16, height: 1, background: 'var(--gold)', display: 'inline-block' }} />
            </div>
          </div>

        </div>
      </footer>

      {/* ── Dynamic Selected Hotel Room Modal ── */}
      <HotelRoomModal
        hotel={selectedHotelForModal}
        onClose={() => setSelectedHotelForModal(null)}
        onSelectRoomType={handleAddHotelRoomToTrip}
      />

      {/* ── Interactive Floating Trip Planner Drawer (Bottom-Left) ── */}
      {tripCart.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 30,
            left: 30,
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}
        >
          {/* Collapsed Suitcase Badge Button */}
          {!isCartOpen && (
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'var(--gold)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                border: '2px solid var(--sand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s ease',
                animation: 'float 3s ease-in-out infinite'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              aria-label="Open Custom Trip Planner"
            >
              <span style={{ fontSize: '1.5rem' }}>💼</span>
              
              {/* Counter Badge */}
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: 'var(--burgundy)',
                  border: '1.5px solid var(--sand)',
                  color: 'white',
                  borderRadius: '50%',
                  width: 22,
                  height: 22,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {tripCart.length}
              </span>
            </button>
          )}

          {/* Expanded Luxury Trip Planner Drawer */}
          {isCartOpen && (
            <div
              className="anim-modal-pop"
              style={{
                width: 320,
                background: 'linear-gradient(160deg, #222 0%, #161616 100%)',
                border: '1.5px solid var(--gold)',
                boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(201,168,76,0.15)', paddingBottom: 10, marginBottom: 12 }}>
                <span className="font-heading" style={{ fontSize: '1.05rem', color: '#fff', fontWeight: 600 }}>
                  💼 Trip Package Builder
                </span>
                <button
                  onClick={() => setIsCartOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--sand-3)',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Basket list */}
              <div style={{ maxHeight: 180, overflowY: 'auto', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tripCart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(201,168,76,0.08)',
                      padding: '8px 10px',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '82%' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold)' }}>
                        {item.name}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--sand-2)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {item.details}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--sand-3)', marginTop: 1 }}>
                        Rate: ${item.price}
                      </span>
                    </div>
                    
                    {/* Delete Item button */}
                    <button
                      onClick={() => handleRemoveTripItem(item.id)}
                      title="Remove reservation item"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--burgundy-hover)',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        padding: 4
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div style={{ borderTop: '1px solid rgba(201,168,76,0.15)', paddingTop: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--sand-3)' }}>
                    Est. Package Total
                  </span>
                  <span className="font-heading" style={{ fontSize: '1.2rem', color: 'var(--gold)', fontWeight: 600 }}>
                    ${tripCart.reduce((sum, item) => sum + item.price, 0)}
                  </span>
                </div>
              </div>

              {/* Action buttons inside drawer */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setTripCart([])}
                  style={{
                    background: 'none',
                    border: '1px solid var(--burgundy)',
                    color: 'var(--sand)',
                    padding: '8px 10px',
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-inter), sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Clear All
                </button>
                <a
                  href={getWhatsAppCartLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-burgundy"
                  style={{
                    textDecoration: 'none',
                    padding: '8px 10px',
                    fontSize: '0.65rem',
                    textAlign: 'center',
                    flex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  Book Package
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Toast Notification pop-ups ── */}
      {toastMessage && (
        <div
          className="anim-modal-pop"
          style={{
            position: 'fixed',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            background: 'var(--burgundy)',
            border: '1.5px solid var(--gold)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            padding: '12px 24px',
            color: 'var(--sand)',
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontSize: '0.85rem',
            fontWeight: 500,
            textAlign: 'center',
            minWidth: 280,
            borderRadius: 2
          }}
        >
          {toastMessage}
        </div>
      )}

    </div>
  );
}

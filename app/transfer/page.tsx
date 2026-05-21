import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Airport & City Transportation | Black Pyramids Tours Giza',
  description: 'Reliable and comfortable airport transfers, train station pickups, and city-to-city transportation in Egypt. Private cars with drivers starting from $40.',
};

const F = 'var(--font-inter), Inter, system-ui, sans-serif';

const transfers = [
  {
    id: 'cairo-airport',
    title: 'Cairo International Airport (CAI)',
    desc: 'Premium meet & greet service at the arrivals hall. Private air-conditioned luxury car direct to our hotel or any location in Giza/Cairo.',
    price: 'From $25',
    icon: '✈️'
  },
  {
    id: 'sphinx-airport',
    title: 'Sphinx International Airport (SPX)',
    desc: 'Quick and seamless direct transfer from Sphinx Airport to the Pyramids area and hotels in Giza.',
    price: 'From $25',
    icon: '✈️'
  },
  {
    id: 'giza-pyramids-local',
    title: 'Local Giza, Pyramids & Old Cairo',
    desc: 'Any local one-way transfer inside Giza, the Pyramids area, and historic Old Cairo in our modern air-conditioned vehicles.',
    price: '$20 Only',
    icon: '📍'
  },
  {
    id: 'cairo-station',
    title: 'Cairo Railway Station (Ramses)',
    desc: 'Seamless direct pickup or drop-off from Ramses Train Station (Cairo Station) or Giza Station with luggage assistance.',
    price: '$20 Only',
    icon: '🚆'
  },
  {
    id: 'private-car-driver',
    title: 'Private Car & Professional Driver (Full Day)',
    desc: 'Hire a private air-conditioned high-class car and dedicated driver for your custom sightseeing itinerary in Egypt.',
    price: 'From $40',
    icon: '🚗'
  }
];

export default function TransferPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', color: '#fff' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ position: 'relative', paddingTop: 140, paddingBottom: 80, textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1549695663-e380e227d8db?w=1600&h=700&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,12,26,0.4) 0%, rgba(7,12,26,0.95) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--sand-2)', marginBottom: 16 }}>Safe & Reliable Transportation</div>
          <h1 className="font-heading" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 600, color: '#fff', marginBottom: 20, lineHeight: 1.1 }}>
            Egypt Private Transportation
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
            <span style={{ color: 'var(--gold)', fontSize: 8 }}>◆</span>
            <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
          </div>
          <p style={{ fontFamily: F, fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--sand-2)', lineHeight: 1.8, maxWidth: 680, margin: '0 auto 32px' }}>
            Start your Egyptian adventure stress-free. We offer 24/7 comfortable, air-conditioned transfers with professional drivers and luxury vehicles to and from any location in Cairo and Giza.
          </p>
          <a href="https://wa.me/201211385550?text=Hi%2C%20I%20would%20like%20to%20book%20a%20private%20transportation" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>
            Book a Ride Now
          </a>
        </div>
      </section>

      {/* Services */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>
        
        {/* Luxury Banner: Cars in all of Egypt with Good Driver & High-class/Luxury Cars */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.12) 0%, rgba(7, 12, 26, 0.9) 100%)', 
          border: '1px solid var(--gold)', 
          padding: '40px 32px', 
          borderRadius: '4px', 
          marginBottom: 64, 
          position: 'relative', 
          overflow: 'hidden' 
        }}>
          <div style={{ position: 'absolute', right: -30, bottom: -30, fontSize: '10rem', opacity: 0.04, pointerEvents: 'none' }}>🚐</div>
          <div style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
            <span style={{ fontFamily: F, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 8 }}>💎 Premium Nationwide Fleet</span>
            <h2 className="font-heading" style={{ fontSize: '1.8rem', color: '#fff', marginBottom: 16 }}>High-Class Luxury Cars Across All of Egypt</h2>
            <p style={{ fontFamily: F, fontSize: '1rem', color: 'var(--sand-2)', lineHeight: 1.7, margin: 0 }}>
              We are proud to provide high-class luxury private sedans, comfortable SUV cruisers, and spacious tourist microbuses (such as the premium Toyota HiAce) in <strong>all regions of Egypt</strong>. 
              Every vehicle in our fleet is fully air-conditioned, meticulously maintained, and driven by <strong>expert, friendly English-speaking professional drivers</strong> who understand Egypt's roads perfectly. 
              Whether you are travelling in Cairo, Giza, Alexandria, Luxor, Aswan, Hurghada, or Sharm El Sheikh, we guarantee the ultimate comfort and safety.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Our Services & Rates</div>
          <h2 className="font-heading" style={{ fontSize: '2.5rem', color: '#fff' }}>Choose Your Destination</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {transfers.map(t => (
            <div key={t.id} style={{ 
              background: 'rgba(255,255,255,0.02)', 
              border: '1px solid rgba(201,168,76,0.12)', 
              padding: '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.3s, border-color 0.3s',
              borderRadius: 4
            }} className="transfer-card">
              <div>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{t.icon}</div>
                <h3 className="font-heading" style={{ fontSize: '1.35rem', color: '#fff', marginBottom: 12 }}>{t.title}</h3>
                <p style={{ fontFamily: F, fontSize: '0.92rem', color: 'var(--sand-2)', lineHeight: 1.6, marginBottom: 24, minHeight: '80px' }}>{t.desc}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, marginTop: 'auto' }}>
                <div style={{ fontFamily: F, fontSize: '1.25rem', fontWeight: 700, color: 'var(--gold)' }}>{t.price}</div>
                <a 
                  href={`https://wa.me/201211385550?text=${encodeURIComponent("Hi! I would like to book a private " + t.title + " ride for " + t.price + ".")}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary" 
                  style={{ 
                    textDecoration: 'none',
                    fontSize: '0.75rem',
                    padding: '8px 16px',
                    letterSpacing: '0.08em',
                    fontWeight: 700
                  }}
                >
                  Book Now
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '48px', marginTop: 80, background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)' }}>
          <h2 className="font-heading" style={{ fontSize: '2rem', color: '#fff', marginBottom: 16 }}>Need a Custom Long-Distance Route?</h2>
          <p style={{ fontFamily: F, fontSize: '1rem', color: 'var(--sand-2)', marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
            Traveling between cities? We offer customized long-distance luxury transportation between Cairo, Alexandria, Luxor, Aswan, Hurghada, Dahab, and Sharm El Sheikh.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://wa.me/201211385550?text=Hi%2C%20I%20would%20like%20to%20request%20a%20custom%20private%20transportation" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>📱 Contact on WhatsApp</a>
          </div>
        </div>
      </section>
    </div>
  );
}

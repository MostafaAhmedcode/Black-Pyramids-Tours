import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Rooftop Restaurant with Pyramid Views | Black Pyramids Tours Giza',
  description: 'Dine with panoramic views of all 3 Giza Pyramids at our rooftop restaurant. Egyptian & international cuisine, fresh juices, open 7 AM–11 PM daily. Reserve a table.',
  keywords: 'rooftop restaurant Giza pyramids, restaurant with pyramid view Cairo, dining near pyramids Egypt, rooftop bar Giza, pyramid view restaurant',
  openGraph: {
    title: 'Rooftop Restaurant with Pyramid Views | Black Pyramids Tours',
    description: 'Panoramic views of all 3 Giza Pyramids. Egyptian & international cuisine. Open daily 7 AM–11 PM.',
    images: [{ url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=630&fit=crop', width: 1200, height: 630 }],
  },
};

const F = 'var(--font-inter), Inter, system-ui, sans-serif';

const menu = [
  { cat: 'Breakfast', items: ['Egyptian Ful & Falafel', 'Continental Breakfast', 'Fresh Omelettes', 'Pastries & Bread', 'Fresh Fruit Platter'] },
  { cat: 'Main Dishes', items: ['Grilled Kofta & Kebab', 'Chicken Tagine', 'Grilled Sea Bass', 'Pasta & Pizza', 'Vegetarian Moussaka'] },
  { cat: 'Egyptian Classics', items: ['Koshary', 'Mahshi (Stuffed Vegetables)', 'Molokhia with Rice', 'Hawawshi', 'Om Ali Dessert'] },
  { cat: 'Drinks & Juices', items: ['Fresh Mango Juice', 'Sugarcane Juice', 'Karkade (Hibiscus)', 'Egyptian Coffee', 'Mint Tea'] },
];

export default function RooftopPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', color: '#fff' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ position: 'relative', paddingTop: 140, paddingBottom: 80, textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&h=700&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,12,26,0.4) 0%, rgba(7,12,26,0.95) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>Open Daily · 7:00 AM – 11:00 PM</div>
          <h1 className="font-heading" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 600, color: '#fff', marginBottom: 20, lineHeight: 1.1 }}>
            Rooftop Restaurant<br />with Pyramid Views
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
            <span style={{ color: 'var(--gold)', fontSize: 8 }}>◆</span>
            <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
          </div>
          <p style={{ fontFamily: F, fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--sand-2)', lineHeight: 1.8, maxWidth: 680, margin: '0 auto 32px' }}>
            Perched on the top floor of our hotel, our rooftop restaurant offers one of the most extraordinary dining experiences in Egypt — panoramic views of all three Giza Pyramids and the ancient skyline of Old Cairo.
          </p>
          <a href="https://wa.me/201211385550?text=Hi%2C%20I%20would%20like%20to%20reserve%20a%20rooftop%20table" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>
            Reserve a Table
          </a>
        </div>
      </section>

      {/* The View */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, marginBottom: 80 }}>
          <div>
            <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>The Experience</div>
            <h2 className="font-heading" style={{ fontSize: '2rem', color: '#fff', marginBottom: 20 }}>Dine Above the Ancient World</h2>
            <p style={{ fontFamily: F, fontSize: '0.95rem', color: 'var(--sand-2)', lineHeight: 1.85, marginBottom: 16 }}>
              Whether you want a relaxed breakfast as the sun rises over the pyramids, a leisurely lunch with the desert breeze, or a magical dinner under the stars with the illuminated pyramids glowing on the horizon — our rooftop is the perfect setting.
            </p>
            <p style={{ fontFamily: F, fontSize: '0.95rem', color: 'var(--sand-2)', lineHeight: 1.85, marginBottom: 24 }}>
              Our kitchen serves everything from authentic Egyptian classics to international dishes, fresh-squeezed juices, smoothies, and a full selection of hot drinks. All ingredients are sourced fresh daily from local markets.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '🔺', text: 'Panoramic view of all 3 Giza Pyramids' },
                { icon: '🕌', text: 'Old Cairo skyline & ancient minarets' },
                { icon: '🌅', text: 'Stunning sunrise & sunset scenery' },
                { icon: '🌙', text: 'Magical night views of illuminated pyramids' },
                { icon: '🕐', text: 'Open daily 7:00 AM — 11:00 PM' },
                { icon: '📱', text: 'Reserve via WhatsApp: +20 101 815 7153' },
              ].map(v => (
                <div key={v.text} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.1)' }}>
                  <span style={{ fontSize: '1.1rem' }}>{v.icon}</span>
                  <span style={{ fontFamily: F, fontSize: '0.9rem', color: 'var(--sand-2)' }}>{v.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Menu */}
          <div>
            <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Our Menu</div>
            <h2 className="font-heading" style={{ fontSize: '2rem', color: '#fff', marginBottom: 20 }}>What We Serve</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {menu.map(cat => (
                <div key={cat.cat} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.12)', padding: '20px 24px' }}>
                  <div style={{ fontFamily: F, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>{cat.cat}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {cat.items.map(item => (
                      <span key={item} style={{ fontFamily: F, fontSize: '0.82rem', color: 'var(--sand-2)', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.12)', padding: '4px 10px' }}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '48px', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)' }}>
          <h2 className="font-heading" style={{ fontSize: '2rem', color: '#fff', marginBottom: 16 }}>Reserve Your Table</h2>
          <p style={{ fontFamily: F, fontSize: '1rem', color: 'var(--sand-2)', marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
            Tables fill up fast at sunset. Message us on WhatsApp to reserve your spot with the best pyramid view.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://wa.me/201211385550?text=Hi%2C%20I%20would%20like%20to%20reserve%20a%20rooftop%20table" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>📱 Reserve via WhatsApp</a>
            <Link href="/hotels" className="btn-secondary" style={{ textDecoration: 'none' }}>View Hotel Rooms</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

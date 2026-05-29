'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tour } from '@/data/tours';
import { egyptDestinationsBlogs } from '@/data/egyptDestinationsBlogs';

const F = 'var(--font-inter), Inter, system-ui, sans-serif';

// Destination-specific fallback blog content (used only if no tour-specific blog exists)
const destinationBlogs: Record<string, { intro: string; history: string; tips: string[]; bestTime: string }> = {
  'Cairo & Giza': {
    intro: 'Cairo is one of the world\'s great megacities — a place where ancient monuments rise above a modern metropolis of 20 million souls. The Giza Plateau, just west of the city, holds the last surviving Wonder of the Ancient World: the Great Pyramids, built over 4,500 years ago with a precision that still baffles engineers today.',
    history: 'The pyramids were constructed during the Fourth Dynasty of the Old Kingdom, between roughly 2580 and 2510 BCE. Pharaoh Khufu (Cheops) commissioned the Great Pyramid — the largest — as his eternal tomb. His son Khafre built the second pyramid and the iconic Great Sphinx, a limestone guardian with the body of a lion and the face of a king. Memphis, the ancient capital, and Saqqara, the oldest stone complex on Earth, complete the picture of Egypt\'s earliest civilization.',
    tips: [
      'Start early — the plateau opens at 8 AM and crowds build fast after 10 AM',
      'Bring cash in Egyptian pounds for camel rides, souvenir vendors, and tips',
      'The Sound & Light Show at the Sphinx runs nightly — a magical evening option',
      'Wear comfortable shoes; the terrain is sandy and uneven',
      'Haggling is expected and part of the culture — enjoy it',
    ],
    bestTime: 'October to April — mild temperatures between 15–25°C. Avoid July–August when midday heat exceeds 40°C.',
  },
  'Luxor': {
    intro: 'Luxor is the world\'s greatest open-air museum. Built on the ruins of ancient Thebes, the capital of Egypt\'s New Kingdom, it holds more ancient monuments per square kilometre than anywhere else on Earth. The Nile divides the city into the East Bank (temples of the living) and the West Bank (tombs of the dead).',
    history: 'For over 500 years, from 1550 to 1070 BCE, Thebes was the most powerful city in the world. Pharaohs like Ramses II, Tutankhamun, and Hatshepsut built their temples and tombs here. The Valley of the Kings alone contains 63 royal tombs, including the legendary tomb of Tutankhamun discovered by Howard Carter in 1922 with its treasures intact after 3,300 years.',
    tips: [
      'The Valley of the Kings ticket covers 3 tombs — choose wisely; Tutankhamun costs extra',
      'Hire a local guide for the West Bank — context transforms the experience',
      'Karnak Temple is best visited at sunrise before tour groups arrive',
      'A felucca (traditional sailboat) ride at sunset is unmissable',
      'The Luxor Museum is small but world-class — don\'t skip it',
    ],
    bestTime: 'November to February — cool and dry, perfect for exploring. Summer temperatures regularly hit 45°C.',
  },
  'Aswan': {
    intro: 'Aswan is Egypt\'s southernmost city and its most serene. Where Cairo buzzes and Luxor dazzles, Aswan simply breathes. The Nile here is at its most beautiful — wide, clear, and dotted with granite islands. Nubian culture, distinct from Arab Egypt, gives the city its own music, cuisine, and colour.',
    history: 'Ancient Aswan — called Swenet — was Egypt\'s gateway to sub-Saharan Africa, a trading post for gold, ivory, and slaves. The granite quarried here built the obelisks and statues of pharaohs across Egypt. The Unfinished Obelisk, still lying in its quarry, would have been the largest ever cut at 42 metres. The High Dam, completed in 1970, created Lake Nasser and required the relocation of the Abu Simbel temples — one of history\'s greatest engineering feats.',
    tips: [
      'Abu Simbel is 280 km south — fly or take the early morning convoy',
      'The Philae Temple on Agilkia Island is reached by motorboat — stunning at sunset',
      'Visit a Nubian village for authentic hospitality and colourful architecture',
      'The Botanical Garden on Kitchener\'s Island is a peaceful escape',
      'Aswan\'s spice market is the best in Egypt for saffron, hibiscus, and karkade tea',
    ],
    bestTime: 'October to March — warm days and cool nights. Aswan is Egypt\'s hottest city; summer is brutal.',
  },
  'Alexandria': {
    intro: 'Alexandria was once the intellectual capital of the ancient world — home to the Great Library, the Lighthouse (one of the Seven Wonders), and the philosopher Hypatia. Founded by Alexander the Great in 331 BCE, it blends Greek, Roman, Jewish, and Arab heritage into a Mediterranean city unlike any other in Egypt.',
    history: 'At its peak under the Ptolemaic dynasty, Alexandria\'s Great Library held 700,000 scrolls — the sum of human knowledge. Cleopatra VII, the last pharaoh, ruled from here. The city\'s ancient monuments now lie largely underwater in the Eastern Harbour, slowly being excavated by marine archaeologists. The modern Bibliotheca Alexandrina, opened in 2002, honours the ancient library\'s legacy.',
    tips: [
      'The Catacombs of Kom el-Shoqafa are the finest Greco-Roman underground tombs in Egypt',
      'Qaitbay Citadel stands on the exact site of the ancient Lighthouse',
      'The Corniche seafront walk is best at dusk with fresh seafood from street vendors',
      'Montaza Palace gardens are a lovely escape from the city centre',
      'Alexandria\'s coffee culture is distinct — try a traditional ahwa (coffeehouse)',
    ],
    bestTime: 'April to June and September to November — Mediterranean climate, warm but not scorching.',
  },
  'Sinai': {
    intro: 'The Sinai Peninsula is where Africa meets Asia, where the Red Sea splits into two gulfs, and where Moses is said to have received the Ten Commandments. It\'s a land of dramatic contrasts: turquoise coral reefs below, jagged granite mountains above, and Bedouin culture threading through it all.',
    history: 'Mount Sinai (Jebel Musa) has been a pilgrimage site for Jews, Christians, and Muslims for millennia. St. Catherine\'s Monastery at its base, founded in 565 CE, is the world\'s oldest continuously operating Christian monastery and holds the world\'s second-largest collection of ancient manuscripts after the Vatican. The Sinai was also the site of three Arab-Israeli wars and was returned to Egypt in 1982.',
    tips: [
      'Climb Mount Sinai at night to reach the summit for sunrise — a life-changing experience',
      'St. Catherine\'s Monastery is only open mornings; arrive early',
      'Dahab\'s Blue Hole is world-famous for diving but respect its depth — it\'s claimed many lives',
      'Bedouin guides are essential for desert treks — they know every water source',
      'Sharm el-Sheikh\'s Ras Mohammed National Park has Egypt\'s finest coral reefs',
    ],
    bestTime: 'March to May and September to November — comfortable for hiking and diving.',
  },
  'Hurghada': {
    intro: 'Hurghada transformed from a small fishing village in the 1980s into Egypt\'s premier Red Sea resort. The coral reefs here are among the most biodiverse in the world, and the year-round sunshine makes it a reliable escape from European winters. Beyond the beach, desert safaris and Bedouin camps offer a different kind of adventure.',
    history: 'The Red Sea has been a trade route since antiquity — ancient Egyptians sailed it to the land of Punt for incense and gold. Hurghada\'s modern history began with oil exploration in the 1910s, but tourism only took off after the 1973 peace with Israel opened the region. Today it receives over 4 million visitors annually.',
    tips: [
      'Snorkelling at Giftun Island is better than most paid dive sites elsewhere in the world',
      'Book a liveaboard for 3–7 days to reach the remote Brothers Islands and Daedalus Reef',
      'The old town (El Dahar) has authentic Egyptian restaurants away from the resort strip',
      'Quad biking and camel rides into the Eastern Desert are excellent at sunset',
      'Avoid the beach in July–August — water temperature exceeds 32°C and jellyfish appear',
    ],
    bestTime: 'October to April — warm water, clear visibility, and manageable air temperatures.',
  },
  'Fayoum': {
    intro: 'Fayoum is Egypt\'s hidden gem — a lush oasis depression 100 km southwest of Cairo, fed by a branch of the Nile. It\'s home to Lake Qarun (ancient Lake Moeris), the Wadi El-Rayan waterfalls, and some of the world\'s most important fossil sites. It\'s the Egypt that most tourists never see.',
    history: 'The ancient Egyptians called it Ta-She — "the land of the lake." The Faiyum Portraits, painted on wooden panels in the 1st–3rd centuries CE, are the world\'s oldest surviving realistic portraits and can be seen in museums worldwide. The area was heavily developed by the Ptolemies, who drained much of the ancient lake for farmland.',
    tips: [
      'Wadi El-Rayan\'s waterfalls are Egypt\'s only natural waterfalls — visit at dawn',
      'Wadi El-Hitan (Valley of the Whales) is a UNESCO site with 40-million-year-old whale fossils',
      'Lake Qarun is excellent for birdwatching — over 200 species recorded',
      'The pottery village of Tunis produces some of Egypt\'s finest ceramics',
      'Fayoum is a day trip from Cairo but staying overnight reveals a completely different pace',
    ],
    bestTime: 'October to April — spring wildflowers in March are spectacular.',
  },
  'White Desert': {
    intro: 'The White Desert (Sahara el-Beyda) is one of the most surreal landscapes on Earth. Chalk-white rock formations sculpted by millennia of wind erosion rise from the golden sand like giant mushrooms, icebergs, and abstract sculptures. Camping here under a sky blazing with stars is a transformative experience.',
    history: 'The White Desert sits within the Farafra Depression, one of Egypt\'s five major oases. The chalk formations are the remnants of a seabed from 80 million years ago when the Sahara was covered by a shallow sea. The area was declared a national park in 2002. Nearby Bahariya Oasis was the site of a remarkable 1999 discovery: the Valley of the Golden Mummies, with over 250 Greco-Roman mummies.',
    tips: [
      'Camping overnight is the only way to truly experience the White Desert — book a guided camp',
      'The Black Desert and Crystal Mountain are on the route from Bahariya — don\'t skip them',
      'Bring warm layers — desert nights drop to near freezing even in October',
      'A 4WD vehicle is essential; the terrain is not accessible by regular car',
      'The best light for photography is the golden hour just after sunrise',
    ],
    bestTime: 'October to March — cool nights make camping comfortable. Summer is dangerously hot.',
  },
  'El Minya': {
    intro: 'El Minya is Middle Egypt\'s cultural heart and one of the country\'s most undervisited regions. It sits on the Nile between Cairo and Luxor, surrounded by some of Egypt\'s most important ancient sites — many of which see only a handful of tourists per day. This is Egypt as it was before mass tourism.',
    history: 'The region was the capital of ancient Egypt during the Amarna Period (1353–1336 BCE), when the "heretic pharaoh" Akhenaten abandoned the old gods and built a new city, Akhetaten (modern Amarna), dedicated to the sun disc Aten. The tombs of Beni Hassan, carved into limestone cliffs, contain some of the finest Middle Kingdom paintings in existence, depicting daily life with extraordinary detail.',
    tips: [
      'Amarna (Tell el-Amarna) requires a ferry across the Nile — hire a local guide',
      'Beni Hassan tombs are best in morning light when the paintings are most vivid',
      'Tuna el-Gebel has a fascinating animal necropolis with mummified ibises and baboons',
      'El Minya is best visited as part of a Nile cruise or multi-day road trip',
      'Security escorts are sometimes required — your tour operator will arrange this',
    ],
    bestTime: 'November to February — mild temperatures ideal for site exploration.',
  },
  'Red Sea': {
    intro: 'The Egyptian Red Sea coast stretches over 1,900 km from Suez to the Sudanese border, offering world-class diving, pristine beaches, and a string of resort towns. The coral reefs here are among the most biodiverse on the planet, with over 1,000 species of fish and 200 species of coral.',
    history: 'The Red Sea has been a vital trade route for 5,000 years. Ancient Egyptians built ports here to trade with Punt and Arabia. The Suez Canal, opened in 1869, transformed it into one of the world\'s busiest shipping lanes. The reefs were largely unknown to Western divers until Hans Hass and Jacques Cousteau explored them in the 1950s, revealing an underwater world of extraordinary richness.',
    tips: [
      'Marsa Alam is less developed than Hurghada and has better reef access from shore',
      'Dugongs (sea cows) can be spotted at Marsa Abu Dabbab — a rare and magical encounter',
      'The SS Thistlegorm wreck near Sharm is one of the world\'s top 10 dive sites',
      'Kite surfing at Ras Sudr and Safaga is world-class — consistent winds year-round',
      'Night dives reveal a completely different reef ecosystem — book one if you\'re certified',
    ],
    bestTime: 'Year-round, but October to May is ideal. Water visibility peaks in winter at 30+ metres.',
  },
};

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

'use client';

import { useState } from 'react';

const FAQ_DATA = [
  {
    category: 'Booking & Reservations',
    items: [
      {
        q: 'How do I book a tour or hotel with Black Pyramids Tours?',
        a: 'You can book directly through our website using WhatsApp, email, or phone. Simply fill out your details, choose your preferences, and our team will confirm your reservation. We offer flexible payment options and 24/7 support.',
      },
      {
        q: 'What is your cancellation policy?',
        a: 'We offer flexible cancellation up to 48 hours before your tour/hotel check-in for a full refund. Cancellations within 48 hours may incur a fee. Custom packages may have different terms. Contact us for specific details.',
      },
      {
        q: 'Can I customize my tour itinerary?',
        a: 'Absolutely! We specialize in custom itineraries tailored to your interests, budget, and schedule. Contact our team to discuss your preferences, and we\'ll create the perfect Egyptian adventure for you.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept bank transfers, credit cards, PayPal, and cash payments. A deposit is usually required to confirm your booking, with the balance due before or upon arrival in Egypt.',
      },
    ],
  },
  {
    category: 'Hotels & Accommodations',
    items: [
      {
        q: 'Which hotels do you partner with?',
        a: 'We partner with over 100 premium hotels across Egypt - from luxury 5-star resorts to comfortable 3-star properties. We have properties in Cairo, Giza, Alexandria, Hurghada, Sharm El Sheikh, Luxor, Aswan, and more.',
      },
      {
        q: 'Are hotel rooms available year-round?',
        a: 'Yes, we maintain year-round availability. However, peak seasons (December-February and summer) book up quickly. We recommend booking 2-3 months in advance for the best selection.',
      },
      {
        q: 'Do hotels include breakfast?',
        a: 'Most of our partner hotels include breakfast. Some budget options may not include it, but it\'s available at a discounted rate. Breakfast details are specified in each hotel\'s package information.',
      },
      {
        q: 'Can I get airport transfers included?',
        a: 'Yes! We offer airport transfers as an add-on to most hotel bookings. Our professional drivers will meet you at Cairo International Airport with a nameplate and provide safe transportation to your hotel.',
      },
    ],
  },
  {
    category: 'Tours & Experiences',
    items: [
      {
        q: 'What types of tours do you offer?',
        a: 'We offer historical tours (pyramids, temples, tombs), Nile cruises, desert safaris, adventure activities, cultural experiences, honeymoon packages, and custom itineraries. Each tour includes expert guides and transportation.',
      },
      {
        q: 'Are your guides licensed and English-speaking?',
        a: 'Yes! All our guides are officially licensed Egyptologists and speak fluent English (plus other languages). They\'re passionate about sharing Egypt\'s history and culture with travelers.',
      },
      {
        q: 'What should I bring on tours?',
        a: 'Bring sunscreen, hat, comfortable walking shoes, water bottle, camera, light clothing, and sunglasses. For desert safaris, bring warmer clothes for evening temperatures. We provide detailed packing lists with each tour.',
      },
      {
        q: 'Are tours suitable for families with children?',
        a: 'Yes! We offer family-friendly tours and can adjust activities based on children\'s ages and interests. Kids often enjoy camel rides, boat trips, and interactive archaeological sites. Contact us for age-appropriate recommendations.',
      },
    ],
  },
  {
    category: 'Egypt Travel Tips',
    items: [
      {
        q: 'What\'s the best time to visit Egypt?',
        a: 'October to April offers pleasant weather (70-80°F). Summer (May-September) is hot (95-110°F). Ramadan (dates vary yearly) affects dining hours and business. Most tourists visit during the cooler months.',
      },
      {
        q: 'Do I need a visa to visit Egypt?',
        a: 'Most nationalities need a visa. You can obtain one on arrival at Cairo Airport (US$25), apply in advance at an embassy, or arrange it through us. We can provide guidance based on your nationality.',
      },
      {
        q: 'Is Egypt safe for tourists?',
        a: 'Yes, Egypt is generally safe for tourists. Millions visit annually without issues. Stick to tourist areas, avoid large gatherings, and follow local advice. Our team provides safety briefings with each tour.',
      },
      {
        q: 'What currency is used in Egypt?',
        a: 'The Egyptian Pound (EGP). USD and EUR are accepted in tourist areas. ATMs are widely available in cities. Exchange rates vary; get cash at banks or ATMs for better rates than exchanging at hotels.',
      },
    ],
  },
  {
    category: 'Communication & Support',
    items: [
      {
        q: 'How can I contact Black Pyramids Tours?',
        a: 'Contact us via WhatsApp (+201211385550), email (info@blackpyramidstours.com), or phone. We\'re available 24/7 to answer questions and assist with bookings.',
      },
      {
        q: 'What languages do you speak?',
        a: 'Our team is fluent in English, Arabic, French, German, Italian, and Spanish. We can arrange guides in multiple languages for group tours.',
      },
      {
        q: 'Do you offer live chat support?',
        a: 'Yes! Our live chat feature is available on the website during business hours and via WhatsApp 24/7. We typically respond within minutes.',
      },
      {
        q: 'Can I get travel insurance recommendations?',
        a: 'Yes, we can recommend reputable travel insurance providers that cover Egypt travel. Travel insurance is highly recommended and covers medical emergencies, trip cancellations, and lost luggage.',
      },
    ],
  },
  {
    category: 'Special Requests',
    items: [
      {
        q: 'Do you arrange honeymoon packages?',
        a: 'Absolutely! We specialize in romantic honeymoon packages including luxury hotels, private tours, Nile dinner cruises, desert safaris, and romantic experiences. Contact us to discuss your perfect honeymoon.',
      },
      {
        q: 'Can you arrange group tours?',
        a: 'Yes! We handle groups of all sizes with special pricing and dedicated guides. Group tours are fully customizable. Contact us with your group size and interests for a quote.',
      },
      {
        q: 'Do you offer luxury Nile cruises?',
        a: 'Yes! We partner with upscale cruise companies offering 3-night, 4-night, and 7-night Nile cruises with meals, guided tours, entertainment, and luxury cabins.',
      },
      {
        q: 'Can you arrange photography tours?',
        a: 'Yes! We offer specialized photography tours with expert guides who know the best locations, times, and techniques for capturing Egypt\'s beauty. Perfect for amateurs and professionals.',
      },
    ],
  },
];

export default function FAQPage() {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', paddingTop: '60px' }}>
      <style>{`
        .faq-hero {
          background: linear-gradient(135deg, #1a1410 0%, #2d2118 100%);
          padding: 80px 20px;
          text-align: center;
          border-bottom: 2px solid #d4af37;
        }
        .faq-hero h1 {
          font-size: 3.5rem;
          color: #d4af37;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        .faq-hero p {
          font-size: 1.2rem;
          color: #ccc;
          margin-top: 20px;
        }
        .faq-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 60px 20px;
        }
        .faq-category {
          margin-bottom: 50px;
        }
        .category-title {
          font-size: 2rem;
          color: #d4af37;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 2px solid #333;
        }
        .faq-item {
          margin-bottom: 20px;
          background: linear-gradient(135deg, #1a1410 0%, #2d2118 100%);
          border-left: 4px solid #d4af37;
          border-radius: 8px;
          overflow: hidden;
        }
        .faq-question {
          padding: 20px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }
        .faq-question:hover {
          background: rgba(212, 175, 55, 0.1);
          padding-left: 25px;
        }
        .faq-q-text {
          font-weight: 600;
          color: #d4af37;
          font-size: 1.05rem;
        }
        .faq-toggle {
          font-size: 1.5rem;
          color: #d4af37;
          transition: transform 0.3s ease;
        }
        .faq-toggle.active {
          transform: rotate(45deg);
        }
        .faq-answer {
          padding: 0 20px 20px;
          color: #ccc;
          line-height: 1.8;
          max-height: 0;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .faq-answer.active {
          max-height: 1000px;
          padding: 20px;
        }
        .cta-box {
          background: linear-gradient(135deg, #1a1410 0%, #2d2118 100%);
          border: 2px solid #d4af37;
          padding: 40px;
          border-radius: 12px;
          text-align: center;
          margin-top: 60px;
        }
        .cta-box h2 {
          color: #d4af37;
          margin-bottom: 15px;
        }
        .cta-box p {
          color: #ccc;
          margin-bottom: 20px;
        }
        .cta-btn {
          display: inline-block;
          padding: 14px 32px;
          background: #d4af37;
          color: #0a0a0a;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          font-size: 1rem;
        }
        .cta-btn:hover {
          background: #e8c547;
          transform: scale(1.05);
        }
        @media (max-width: 768px) {
          .faq-hero h1 {
            font-size: 2.5rem;
          }
          .category-title {
            font-size: 1.5rem;
          }
          .faq-q-text {
            font-size: 0.95rem;
          }
        }
      `}</style>

      {/* Hero */}
      <div className="faq-hero">
        <h1>❓ Frequently Asked Questions</h1>
        <p>Find answers to common questions about Egypt travel, bookings, and our services</p>
      </div>

      {/* FAQ Content */}
      <div className="faq-container">
        {FAQ_DATA.map((category, catIdx) => (
          <div key={catIdx} className="faq-category">
            <h2 className="category-title">{category.category}</h2>
            {category.items.map((item, itemIdx) => {
              const key = `${catIdx}-${itemIdx}`;
              const isExpanded = expandedItems[key];
              return (
                <div key={key} className="faq-item">
                  <div className="faq-question" onClick={() => toggleItem(key)}>
                    <div className="faq-q-text">{item.q}</div>
                    <div className={`faq-toggle ${isExpanded ? 'active' : ''}`}>+</div>
                  </div>
                  <div className={`faq-answer ${isExpanded ? 'active' : ''}`}>
                    {item.a}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* CTA */}
        <div className="cta-box">
          <h2>Still Have Questions?</h2>
          <p>Our expert team is available 24/7 to help you plan your perfect Egyptian adventure</p>
          <a
            href="https://wa.me/201211385550?text=Hi%20Black%20Pyramids%20Tours%21%20I%20have%20a%20question%20about%20my%20Egypt%20trip."
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn"
          >
            💬 Message on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

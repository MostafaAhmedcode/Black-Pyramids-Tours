'use client';

export default function AboutUsPage() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      <style>{`
        .about-hero {
          background: linear-gradient(135deg, #1a1410 0%, #2d2118 100%);
          padding: 80px 20px;
          text-align: center;
          border-bottom: 2px solid #d4af37;
        }
        .about-hero h1 {
          font-size: 3.5rem;
          color: #d4af37;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        .about-hero p {
          font-size: 1.3rem;
          color: #ccc;
          margin-top: 20px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }
        .about-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 20px;
          border-bottom: 1px solid #333;
        }
        .section-title {
          font-size: 2.5rem;
          color: #d4af37;
          margin-bottom: 30px;
          text-align: center;
        }
        .section-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
        }
        .content-text {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #ccc;
        }
        .content-text h3 {
          color: #d4af37;
          margin-top: 20px;
          margin-bottom: 10px;
          font-size: 1.3rem;
        }
        .content-text p {
          margin: 15px 0;
        }
        .image-placeholder {
          background: linear-gradient(135deg, #2d2118 0%, #1a1410 100%);
          height: 400px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          border: 2px solid #d4af37;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 30px;
          margin: 40px 0;
        }
        .stat-card {
          background: linear-gradient(135deg, #1a1410 0%, #2d2118 100%);
          padding: 30px;
          border-radius: 12px;
          border: 2px solid #d4af37;
          text-align: center;
        }
        .stat-number {
          font-size: 2.5rem;
          color: #d4af37;
          font-weight: 700;
        }
        .stat-label {
          color: #ccc;
          margin-top: 10px;
          font-size: 1.1rem;
        }
        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          margin: 40px 0;
        }
        .value-card {
          background: linear-gradient(135deg, #1a1410 0%, #2d2118 100%);
          padding: 30px;
          border-radius: 12px;
          border-left: 4px solid #d4af37;
        }
        .value-icon {
          font-size: 2.5rem;
          margin-bottom: 15px;
        }
        .value-title {
          color: #d4af37;
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .value-desc {
          color: #999;
          line-height: 1.6;
        }
        .cta-section {
          background: linear-gradient(135deg, #1a1410 0%, #2d2118 100%);
          padding: 60px 20px;
          text-align: center;
          border-top: 2px solid #d4af37;
        }
        .cta-btn {
          display: inline-block;
          padding: 16px 40px;
          background: #d4af37;
          color: #0a0a0a;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
        }
        .cta-btn:hover {
          background: #e8c547;
          transform: scale(1.05);
        }
        @media (max-width: 768px) {
          .about-hero h1 {
            font-size: 2.5rem;
          }
          .section-content {
            grid-template-columns: 1fr;
          }
          .section-title {
            font-size: 2rem;
          }
        }
      `}</style>

      {/* Hero */}
      <div className="about-hero">
        <h1>About Black Pyramids Tours</h1>
        <p>Your Premier Gateway to Egypt's Most Extraordinary Experiences Since 2005</p>
      </div>

      {/* Mission Section */}
      <div className="about-section">
        <div className="section-content">
          <div className="content-text">
            <h3>Our Mission</h3>
            <p>
              At Black Pyramids Tours, we believe that travel to Egypt should be more than just sightseeing. 
              It's about connecting with an ancient civilization, experiencing authentic culture, and creating 
              memories that last a lifetime.
            </p>
            <p>
              Since 2005, we've been crafting bespoke Egyptian journeys for travelers worldwide. Our commitment 
              is to deliver world-class service, expert guidance, and unforgettable experiences across Egypt's 
              most iconic and hidden destinations.
            </p>
          </div>
          <div className="image-placeholder">🔺 Egypt</div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="about-section">
        <h2 className="section-title">Our Impact</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">19+</div>
            <div className="stat-label">Years of Excellence</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Happy Travelers</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">100+</div>
            <div className="stat-label">Partner Hotels</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">4.9★</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="about-section">
        <h2 className="section-title">What We Offer</h2>
        <div className="section-content">
          <div className="image-placeholder">🏨</div>
          <div className="content-text">
            <h3>Comprehensive Travel Solutions</h3>
            <p>
              <strong>✓ Luxury Hotel Reservations:</strong> Access to 5-star hotels across Cairo, Giza, Red Sea, 
              Luxor, Aswan, Alexandria, and more.
            </p>
            <p>
              <strong>✓ Private Guided Tours:</strong> Expert Egyptologist guides, historical tours, adventure 
              activities, Nile cruises, and desert safaris.
            </p>
            <p>
              <strong>✓ Premium Transportation:</strong> Private drivers, airport transfers, and reliable 
              transportation throughout Egypt.
            </p>
            <p>
              <strong>✓ Custom Itineraries:</strong> Personalized travel plans tailored to your interests and budget.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="about-section">
        <h2 className="section-title">Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🎯</div>
            <div className="value-title">Excellence</div>
            <div className="value-desc">We maintain the highest standards in service, expertise, and attention to detail.</div>
          </div>
          <div className="value-card">
            <div className="value-icon">💎</div>
            <div className="value-title">Authenticity</div>
            <div className="value-desc">We provide genuine Egyptian experiences, not tourist traps or manufactured attractions.</div>
          </div>
          <div className="value-card">
            <div className="value-icon">🤝</div>
            <div className="value-title">Trust</div>
            <div className="value-desc">Over 19 years of reliable service has built lasting relationships with our clients.</div>
          </div>
          <div className="value-card">
            <div className="value-icon">🌍</div>
            <div className="value-title">Responsibility</div>
            <div className="value-desc">We respect Egyptian culture and support local communities through sustainable tourism.</div>
          </div>
          <div className="value-card">
            <div className="value-icon">🚀</div>
            <div className="value-title">Innovation</div>
            <div className="value-desc">We continuously improve our services with modern technology and creative solutions.</div>
          </div>
          <div className="value-card">
            <div className="value-icon">💬</div>
            <div className="value-title">Communication</div>
            <div className="value-desc">Fluent English-speaking team available 24/7 for seamless communication and support.</div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="about-section">
        <h2 className="section-title">Our Team</h2>
        <div className="content-text" style={{ textAlign: 'center' }}>
          <p>
            Our team consists of licensed Egyptologist guides, experienced travel consultants, professional drivers, 
            and hospitality specialists. All members are fluent English speakers with deep knowledge of Egyptian 
            history, culture, and tourism.
          </p>
          <p>
            We're passionate about sharing Egypt's wonders and ensuring every traveler has an extraordinary experience.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="about-section">
        <h2 className="section-title">Why Choose Black Pyramids Tours?</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">⭐</div>
            <div className="value-title">19 Years of Excellence</div>
            <div className="value-desc">Established reputation for quality and reliability</div>
          </div>
          <div className="value-card">
            <div className="value-icon">👥</div>
            <div className="value-title">Expert Team</div>
            <div className="value-desc">Licensed guides and English-speaking professionals</div>
          </div>
          <div className="value-card">
            <div className="value-icon">🏨</div>
            <div className="value-title">Premium Hotels</div>
            <div className="value-desc">Partnerships with 5-star luxury accommodations</div>
          </div>
          <div className="value-card">
            <div className="value-icon">🎯</div>
            <div className="value-title">Custom Packages</div>
            <div className="value-desc">Tailored itineraries for every traveler</div>
          </div>
          <div className="value-card">
            <div className="value-icon">📱</div>
            <div className="value-title">24/7 Support</div>
            <div className="value-desc">Available via WhatsApp, email, and phone</div>
          </div>
          <div className="value-card">
            <div className="value-icon">💰</div>
            <div className="value-title">Best Value</div>
            <div className="value-desc">Competitive prices without compromising quality</div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="cta-section">
        <h2 style={{ color: '#d4af37', marginBottom: '30px' }}>Ready to Explore Egypt?</h2>
        <p style={{ color: '#ccc', marginBottom: '30px', fontSize: '1.1rem' }}>
          Contact our team today to start planning your Egyptian adventure
        </p>
        <a
          href="https://wa.me/201211385550?text=Hi%20Black%20Pyramids%20Tours%21%20I%27d%20like%20to%20plan%20my%20Egypt%20vacation."
          target="_blank"
          rel="noopener noreferrer"
          className="cta-btn"
        >
          💬 Chat on WhatsApp
        </a>
        <p style={{ color: '#999', marginTop: '30px' }}>
          Based in Giza, Egypt | Serving worldwide travelers since 2005
        </p>
      </div>
    </div>
  );
}

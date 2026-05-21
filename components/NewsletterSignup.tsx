'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setEmail('');
      setLoading(false);
      setTimeout(() => setSubmitted(false), 3000);
    }, 1000);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1410 0%, #2d2118 100%)',
      padding: '60px 20px',
      textAlign: 'center',
      borderTop: '2px solid #d4af37',
      borderBottom: '2px solid #d4af37',
      margin: '60px 0',
    }}>
      <style>{`
        .newsletter-container {
          max-width: 600px;
          margin: 0 auto;
        }
        .newsletter-title {
          font-size: 2.5rem;
          color: #d4af37;
          margin-bottom: 15px;
          font-weight: 700;
        }
        .newsletter-subtitle {
          font-size: 1.1rem;
          color: #ccc;
          margin-bottom: 30px;
        }
        .newsletter-form {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .newsletter-input {
          flex: 1;
          min-width: 200px;
          padding: 12px 16px;
          background: #2a1f18;
          border: 2px solid #d4af37;
          border-radius: 6px;
          color: #fff;
          font-size: 1rem;
          font-family: inherit;
        }
        .newsletter-input::placeholder {
          color: #888;
        }
        .newsletter-btn {
          padding: 12px 30px;
          background: #d4af37;
          color: #0a0a0a;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }
        .newsletter-btn:hover {
          background: #e8c547;
          transform: scale(1.05);
        }
        .newsletter-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .success-message {
          color: #4caf50;
          font-weight: 600;
          animation: slideDown 0.3s ease;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 768px) {
          .newsletter-form {
            flex-direction: column;
          }
          .newsletter-input {
            width: 100%;
          }
        }
      `}</style>

      <div className="newsletter-container">
        <h3 className="newsletter-title">✉️ Get Travel Tips & Exclusive Offers</h3>
        <p className="newsletter-subtitle">
          Subscribe to our newsletter for Egypt travel guides, special deals, and insider tips
        </p>

        {submitted ? (
          <p className="success-message">✓ Thanks for subscribing! Check your email for confirmation.</p>
        ) : (
          <form onSubmit={handleSubmit} className="newsletter-form">
            <input
              type="email"
              className="newsletter-input"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="newsletter-btn"
              disabled={loading}
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}

        <p style={{ color: '#999', fontSize: '0.9rem' }}>
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}

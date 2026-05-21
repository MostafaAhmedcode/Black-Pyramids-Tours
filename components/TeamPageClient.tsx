'use client';

import { useState, useEffect } from 'react';
import StaffCard from './StaffCard';
import Link from 'next/link';
import { staff as staticStaff, StaffMember } from '@/data/staff';

const F = 'var(--font-inter), Inter, system-ui, sans-serif';

export default function TeamPageClient() {
  const [teamMembers, setTeamMembers] = useState<StaffMember[]>(staticStaff);

  // Load admin overrides — same logic as the home page
  useEffect(() => {
    fetch('/api/save-data?type=staff')
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data.length > 0) {
          setTeamMembers(prev => prev.map(m => {
            const override = json.data.find((o: StaffMember) => o.id === m.id);
            return override ? { ...m, ...override } : m;
          }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', paddingTop: 140, paddingBottom: 80, textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1600&h=700&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center 60%', opacity: 0.12 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,12,26,0.5) 0%, rgba(7,12,26,0.95) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>All Fluent English Speakers</div>
          <h1 className="font-heading" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 600, color: '#fff', marginBottom: 20, lineHeight: 1.1 }}>
            The People Behind<br />Black Pyramids Tours
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
            <span style={{ color: 'var(--gold)', fontSize: 8 }}>◆</span>
            <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
          </div>
          <p style={{ fontFamily: F, fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--sand-2)', lineHeight: 1.8, maxWidth: 680, margin: '0 auto' }}>
            Our entire team — hotel staff, licensed Egyptologist guides, and professional drivers — all speak fluent English and are dedicated to making your Egypt experience truly unforgettable.
          </p>
        </div>
      </section>

      {/* Team grid — uses live overrides from admin */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24, marginBottom: 80 }}>
          {teamMembers.map((member, i) => (
            <StaffCard key={member.id} member={member} index={i} />
          ))}
        </div>

        {/* Why our team */}
        <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)', padding: '48px', marginBottom: 48 }}>
          <h2 className="font-heading" style={{ fontSize: '2rem', color: '#fff', marginBottom: 32, textAlign: 'center' }}>Why Our Team Makes the Difference</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28 }}>
            {[
              { icon: '🗣️', title: 'Fluent English', body: 'Every single member of our team — from reception to your tour guide — speaks fluent English. No language barriers, no misunderstandings.' },
              { icon: '🎓', title: 'Licensed Egyptologists', body: 'Our guides hold official Egyptian Ministry of Tourism licenses and many have university degrees in Egyptology. They bring history to life.' },
              { icon: '🚗', title: 'Professional Drivers', body: 'Our drivers have years of experience navigating Egypt safely. They know every route, every shortcut, and every local secret.' },
              { icon: '❤️', title: 'Genuine Hospitality', body: 'We are not a faceless agency. We are a family-run team that genuinely cares about your experience. Your satisfaction is personal to us.' },
            ].map(item => (
              <div key={item.title} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{item.icon}</div>
                <h3 className="font-heading" style={{ fontSize: '1.1rem', color: 'var(--gold)', marginBottom: 10 }}>{item.title}</h3>
                <p style={{ fontFamily: F, fontSize: '0.88rem', color: 'var(--sand-3)', lineHeight: 1.75 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <h2 className="font-heading" style={{ fontSize: '2rem', color: '#fff', marginBottom: 16 }}>Ready to Meet the Team?</h2>
          <p style={{ fontFamily: F, fontSize: '1rem', color: 'var(--sand-2)', marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
            Book a tour or room and our team will be ready to welcome you to Egypt.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/tours" className="btn-primary" style={{ textDecoration: 'none' }}>Browse Tours</Link>
            <a href="https://wa.me/201211385550" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration: 'none' }}>Contact on WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}

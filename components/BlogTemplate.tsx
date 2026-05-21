'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BlogDestination, egyptDestinationsBlogs } from '@/data/egyptDestinationsBlogs';
import { tours, Tour } from '@/data/tours';

interface BlogTemplateProps {
  blog: BlogDestination;
}

const F_EN = 'var(--font-inter), Inter, system-ui, -apple-system, sans-serif';
const F_AR = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export default function BlogTemplate({ blog }: BlogTemplateProps) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Filter tours related to this destination
  const relatedTours = tours.filter((t) => t.destination === blog.destination).slice(0, 3);

  const isRtl = lang === 'ar';
  const F = isRtl ? F_AR : F_EN;

  // Calculate reading time dynamically
  const textToMeasure = (blog.introEn || '') + ' ' + (blog.historyEn || '') + ' ' + (blog.cultureEn || '') + ' ' + (blog.transportEn || '');
  const wordCount = textToMeasure.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(5, Math.ceil(wordCount / 220));

  // Toggle FAQ accordion
  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Structured Data (JSON-LD)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': isRtl ? blog.titleAr : blog.titleEn,
    'description': isRtl ? blog.metaDescriptionAr : blog.metaDescriptionEn,
    'image': blog.heroImage,
    'datePublished': '2026-05-20T12:00:00+03:00',
    'dateModified': '2026-05-20T16:00:00+03:00',
    'author': {
      '@type': 'Organization',
      'name': 'Black Pyramids Tours',
      'url': 'https://blackpyramidsgateway.com',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Black Pyramids Tours',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://blackpyramidsgateway.com/favicon.jfif',
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://blackpyramidsgateway.com/blog/${blog.slug}`,
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': (isRtl ? blog.faqAr : blog.faqEn).map((faq) => ({
      '@type': 'Question',
      'name': faq.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.a,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': isRtl ? 'الرئيسية' : 'Home',
        'item': 'https://blackpyramidsgateway.com/',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': isRtl ? 'المدونة' : 'Blog',
        'item': 'https://blackpyramidsgateway.com/blog',
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': isRtl ? blog.nameAr : blog.nameEn,
        'item': `https://blackpyramidsgateway.com/blog/${blog.slug}`,
      },
    ],
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} style={{ fontFamily: F, background: 'var(--navy)', color: '#fff', minHeight: '100vh', transition: 'all 0.4s ease' }}>
      
      {/* Dynamic SEO Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Floating Language Toggler */}
      <div style={{ position: 'fixed', bottom: 30, right: isRtl ? 'auto' : 30, left: isRtl ? 30 : 'auto', zIndex: 1000 }}>
        <button
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          style={{
            background: 'var(--gold)',
            color: 'var(--navy)',
            border: '2px solid var(--navy)',
            borderRadius: '50px',
            padding: '12px 24px',
            fontWeight: 700,
            fontSize: '0.85rem',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(201,168,76,0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08) translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
          }}
        >
          🌐 {lang === 'en' ? 'العربية' : 'English'}
        </button>
      </div>

      {/* Hero Header Section */}
      <section style={{ position: 'relative', height: '80vh', minHeight: 550, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img
            src={blog.heroImage}
            alt={isRtl ? blog.titleAr : blog.titleEn}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55) contrast(1.05)' }}
            className="ken-burns"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--navy) 0%, rgba(4,7,16,0.7) 40%, rgba(4,7,16,0.3) 100%)' }} />
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '0 24px 60px', position: 'relative', zIndex: 1 }}>
          <Link
            href="/blog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              textDecoration: 'none',
              marginBottom: 24,
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = isRtl ? 'translateX(5px)' : 'translateX(-5px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
          >
            {isRtl ? '← العودة للمدونة' : '← Back to All Blogs'}
          </Link>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', background: 'var(--gold)', color: 'var(--navy)', padding: '6px 14px', borderRadius: 2 }}>
              📍 {isRtl ? blog.nameAr : blog.nameEn}
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '6px 14px', borderRadius: 2 }}>
              ⚡ {isRtl ? 'دليل فاخر' : 'Luxury Guide'}
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '6px 14px', borderRadius: 2 }}>
              ⏱️ {readTime} {isRtl ? 'دقائق قراءة' : 'Min Read'}
            </span>
          </div>
          <h1 className="font-heading" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4rem)', fontWeight: 600, color: '#fff', marginBottom: 20, lineHeight: 1.15, textShadow: '0 3px 15px rgba(0,0,0,0.6)' }}>
            {isRtl ? blog.titleAr : blog.titleEn}
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--sand-2)', maxWidth: 850, lineHeight: 1.7, fontStyle: 'italic' }}>
            &ldquo;{isRtl ? blog.subtitleAr : blog.subtitleEn}&rdquo;
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--sand-3)', marginBottom: 24, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: 'var(--sand-2)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--sand-2)'}>
            {isRtl ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <Link href="/blog" style={{ color: 'var(--sand-2)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--sand-2)'}>
            {isRtl ? 'مدونة مصر' : 'Egypt Blog'}
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--gold)', fontWeight: 500 }}>
            {isRtl ? blog.nameAr : blog.nameEn}
          </span>
        </div>

        {/* Social Sharing Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 20, marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--sand-2)', fontWeight: 600 }}>
              ⏱️ {isRtl ? `قراءة في ${readTime} دقائق` : `${readTime} Min Read`}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
            <span style={{ fontSize: '0.88rem', color: 'var(--sand-2)' }}>
              {isRtl ? 'تحديث: مايو ٢٠٢٦' : 'Updated: May 2026'}
            </span>
          </div>
          
          {/* Share Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--sand-3)', fontWeight: 600 }}>
              {isRtl ? 'شارك الدليل:' : 'Share:'}
            </span>
            
            {/* Facebook */}
            <button
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sand-2)', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--sand-2)'; e.currentTarget.style.transform = 'scale(1)'; }}
              title="Share on Facebook"
            >
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
            </button>

            {/* Twitter / X */}
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(isRtl ? blog.titleAr : blog.titleEn)}`, '_blank')}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sand-2)', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--sand-2)'; e.currentTarget.style.transform = 'scale(1)'; }}
              title="Share on X"
            >
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent((isRtl ? blog.titleAr : blog.titleEn) + ' - ' + window.location.href)}`, '_blank')}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sand-2)', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--sand-2)'; e.currentTarget.style.transform = 'scale(1)'; }}
              title="Share on WhatsApp"
            >
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.284 1.488 4.966 1.49 5.485 0 9.948-4.467 9.951-9.957.001-2.66-1.026-5.159-2.89-7.026C16.81 1.8 14.307.775 11.64.774 6.158.774 1.7 5.237 1.697 10.72c-.001 1.792.482 3.42 1.39 4.992l-.994 3.633 3.738-.98a9.882 9.882 0 0 0 4.816 1.258h-.001zm10.75-8.08c-.287-.144-1.702-.84-1.965-.936-.263-.096-.454-.144-.646.144-.192.288-.744.936-.912 1.129-.167.192-.335.216-.622.072-.287-.144-1.21-.447-2.306-1.424-.853-.76-1.428-1.7-1.595-1.988-.168-.288-.018-.444.125-.587.13-.13.288-.336.432-.504.144-.168.192-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.646-1.56-.885-2.136-.233-.56-.47-.484-.645-.492-.167-.008-.36-.01-.55-.01s-.504.072-.768.36c-.264.288-1.008.984-1.008 2.4s.984 2.784 1.122 2.976c.138.192 1.936 2.952 4.69 4.144.655.283 1.167.452 1.567.579.66.21 1.26.18 1.732.11.527-.078 1.702-.696 1.942-1.368.24-.672.24-1.248.168-1.368-.072-.12-.264-.192-.55-.336z"/>
              </svg>
            </button>
            
            {/* Copy Link */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert(isRtl ? 'تم نسخ الرابط!' : 'Link copied to clipboard!');
              }}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sand-2)', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--sand-2)'; e.currentTarget.style.transform = 'scale(1)'; }}
              title="Copy Page Link"
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
              </svg>
            </button>
          </div>
        </div>

        <div style={{ gap: 48 }} className="blog-detail-grid">
          
          {/* Main Article Body */}
          <div style={{ order: 1 }}>
            
            {/* Introduction */}
            <div id="introduction" style={{ marginBottom: 48 }}>
              <p dangerouslySetInnerHTML={{ __html: isRtl ? blog.introAr : blog.introEn }} style={{ fontSize: '1.18rem', color: '#fff', lineHeight: 2, marginBottom: 28, fontWeight: 500, borderLeft: isRtl ? 'none' : '4px solid var(--gold)', borderRight: isRtl ? '4px solid var(--gold)' : 'none', paddingLeft: isRtl ? 0 : 24, paddingRight: isRtl ? 24 : 0 }} />
            </div>

            {/* Ancient History */}
            <div id="history" style={{ marginBottom: 48, paddingTop: 20 }}>
              <h2 className="font-heading" style={{ fontSize: '1.9rem', color: 'var(--gold)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span>🏺</span> {isRtl ? 'التاريخ القديم والنشأة' : 'Ancient History & Roots'}
              </h2>
              <div style={{ width: 100, height: 2, background: 'var(--gold)', marginBottom: 24 }} />
              <p dangerouslySetInnerHTML={{ __html: isRtl ? blog.historyAr : blog.historyEn }} style={{ fontSize: '1.05rem', color: 'var(--sand-2)', lineHeight: 1.9, marginBottom: 20 }} />
            </div>

            {/* Cultural Tapestry */}
            <div id="culture" style={{ marginBottom: 48, paddingTop: 20 }}>
              <h2 className="font-heading" style={{ fontSize: '1.9rem', color: 'var(--gold)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span>🎭</span> {isRtl ? 'النبض الثقافي والتقاليد' : 'Cultural Tapestry & Traditions'}
              </h2>
              <div style={{ width: 100, height: 2, background: 'var(--gold)', marginBottom: 24 }} />
              <p dangerouslySetInnerHTML={{ __html: isRtl ? blog.cultureAr : blog.cultureEn }} style={{ fontSize: '1.05rem', color: 'var(--sand-2)', lineHeight: 1.9, marginBottom: 20 }} />
            </div>

            {/* Image Gallery */}
            <div id="gallery" style={{ marginBottom: 56, paddingTop: 20 }}>
              <h2 className="font-heading" style={{ fontSize: '1.9rem', color: 'var(--gold)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span>📸</span> {isRtl ? 'معرض الصور الفاخر' : 'Luxury Media Gallery'}
              </h2>
              <div style={{ width: 100, height: 2, background: 'var(--gold)', marginBottom: 24 }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="gallery-grid">
                {blog.gallery.map((img, i) => (
                  <div key={i} style={{ aspectRatio: '4/3', overflow: 'hidden', border: '1px solid rgba(201,168,76,0.2)', position: 'relative' }} className={i === 0 ? 'span-two' : ''}>
                    <img
                      src={img}
                      alt={`${blog.nameEn} Gallery ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Must-Do Activities */}
            <div id="activities" style={{ marginBottom: 48, paddingTop: 20 }}>
              <h2 className="font-heading" style={{ fontSize: '1.9rem', color: 'var(--gold)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span>🎡</span> {isRtl ? 'أنشطة لا بد منها' : 'Must-Experience Activities'}
              </h2>
              <div style={{ width: 100, height: 2, background: 'var(--gold)', marginBottom: 24 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {(isRtl ? blog.activitiesAr : blog.activitiesEn).map((act, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(201,168,76,0.15)',
                      padding: '28px',
                      borderRadius: 4,
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--gold)';
                      e.currentTarget.style.background = 'rgba(201,168,76,0.04)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <h3 className="font-heading" style={{ fontSize: '1.3rem', color: 'var(--gold)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '0.85rem' }}>◆</span> {act.title}
                    </h3>
                    <p style={{ fontSize: '0.98rem', color: 'var(--sand-2)', lineHeight: 1.75, margin: 0 }}>
                      {act.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Food Recommendations */}
            <div id="food" style={{ marginBottom: 48, paddingTop: 20 }}>
              <h2 className="font-heading" style={{ fontSize: '1.9rem', color: 'var(--gold)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span>🍽️</span> {isRtl ? 'المطبخ المحلي والمأكولات' : 'Gastronomic Delights & Cuisine'}
              </h2>
              <div style={{ width: 100, height: 2, background: 'var(--gold)', marginBottom: 24 }} />
              <p style={{ fontSize: '1.05rem', color: 'var(--sand-2)', lineHeight: 1.8, marginBottom: 24 }}>
                {isRtl ? 'تشتهر مصر بمطبخها الغني بنكهاته وتوابله الشهية التي توارثها الأجيال. إليك أبرز المأكولات التي يجب عليك تجربتها عند زيارة هذه المنطقة:' : 'Egyptian cuisine is an aromatic, flavor-packed journey of comfort foods passed down for generations. Here are the top culinary masterpieces you must try in this destination:'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                {(isRtl ? blog.foodAr : blog.foodEn).map((fd, i) => (
                  <div key={i} style={{ background: 'rgba(201,168,76,0.03)', border: '1px solid rgba(201,168,76,0.12)', padding: '24px', borderRadius: 2 }}>
                    <h4 className="font-heading" style={{ fontSize: '1.2rem', color: 'var(--gold)', marginBottom: 10 }}>🥘 {fd.name}</h4>
                    <p style={{ fontSize: '0.92rem', color: 'var(--sand-2)', lineHeight: 1.6, margin: 0 }}>{fd.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Where to Stay Hotels */}
            <div id="hotels" style={{ marginBottom: 48, paddingTop: 20 }}>
              <h2 className="font-heading" style={{ fontSize: '1.9rem', color: 'var(--gold)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span>🏨</span> {isRtl ? 'أين تقيم: فنادق موصى بها' : 'Where to Stay: Hotels & Resorts'}
              </h2>
              <div style={{ width: 100, height: 2, background: 'var(--gold)', marginBottom: 24 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {(isRtl ? blog.hotelsAr : blog.hotelsEn).map((ht, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: 4 }}>
                    <div style={{ flex: 1, minWidth: 260 }}>
                      <h4 className="font-heading" style={{ fontSize: '1.25rem', color: '#fff', marginBottom: 8 }}>{ht.name}</h4>
                      <p style={{ fontSize: '0.92rem', color: 'var(--sand-2)', lineHeight: 1.6, margin: 0 }}>{ht.desc}</p>
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: ht.tier === 'Luxury' ? 'var(--gold)' : ht.tier === 'Mid-Range' ? '#38bdf8' : '#4ade80', background: 'rgba(255,255,255,0.04)', padding: '6px 14px', borderRadius: 30, border: '1px solid currentColor' }}>
                      ⭐ {ht.tier}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Internal CTA Linking box */}
            <div style={{ margin: '64px 0', background: 'linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.02) 100%)', border: '1px solid var(--gold)', padding: '36px', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: -20, bottom: -20, fontSize: '8rem', opacity: 0.05, transform: 'rotate(-15deg)' }}>🏺</div>
              <p style={{ fontSize: '1.1rem', color: 'var(--sand)', lineHeight: 1.7, marginBottom: 24, maxWidth: 700 }}>
                {isRtl ? blog.ctaAr.text : blog.ctaEn.text}
              </p>
              <Link
                href={blog.ctaEn.url}
                className="btn-primary"
                style={{ textDecoration: 'none', display: 'inline-block', fontWeight: 700 }}
              >
                ✨ {isRtl ? blog.ctaAr.linkText : blog.ctaEn.linkText}
              </Link>
            </div>

            {/* Suggested Itinerary Timeline */}
            {blog.itineraryEn && (
              <div id="itinerary" style={{ marginBottom: 56, paddingTop: 20 }}>
                <h2 className="font-heading" style={{ fontSize: '1.9rem', color: 'var(--gold)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span>📅</span> {isRtl ? 'برنامج الرحلة المقترح يوماً بيوم' : 'Suggested Day-by-Day Itinerary'}
                </h2>
                <div style={{ width: 100, height: 2, background: 'var(--gold)', marginBottom: 32 }} />
                
                <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', paddingLeft: isRtl ? 0 : 20, paddingRight: isRtl ? 20 : 0 }}>
                  {/* Timeline line */}
                  <div style={{ position: 'absolute', top: 8, bottom: 8, left: isRtl ? 'auto' : 8, right: isRtl ? 8 : 'auto', width: 2, background: 'rgba(201,168,76,0.2)' }} />
                  
                  {(isRtl ? blog.itineraryAr : blog.itineraryEn)?.map((it, idx) => (
                    <div key={idx} style={{ position: 'relative', marginBottom: 28, paddingLeft: isRtl ? 0 : 24, paddingRight: isRtl ? 24 : 0 }}>
                      {/* Timeline dot */}
                      <div style={{
                        position: 'absolute',
                        left: isRtl ? 'auto' : -21,
                        right: isRtl ? -21 : 'auto',
                        top: 4,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: 'var(--gold)',
                        border: '3px solid var(--navy)',
                        boxShadow: '0 0 0 3px rgba(201,168,76,0.15)'
                      }} />
                      
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '24px', borderRadius: 4, transition: 'all 0.3s' }} className="timeline-card">
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--navy)', background: 'var(--gold)', padding: '4px 10px', borderRadius: 2, textTransform: 'uppercase', display: 'inline-block', marginBottom: 10 }}>
                          {it.day}
                        </span>
                        <h3 className="font-heading" style={{ fontSize: '1.25rem', color: '#fff', marginBottom: 12 }}>
                          {it.title}
                        </h3>
                        <p style={{ fontSize: '0.98rem', color: 'var(--sand-2)', lineHeight: 1.7, margin: 0 }}>
                          {it.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transportation */}
            <div id="transportation" style={{ marginBottom: 48, paddingTop: 20 }}>
              <h2 className="font-heading" style={{ fontSize: '1.9rem', color: 'var(--gold)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span>🚊</span> {isRtl ? 'وسائل النقل وكيفية التنقل' : 'Transportation & Navigating'}
              </h2>
              <div style={{ width: 100, height: 2, background: 'var(--gold)', marginBottom: 24 }} />
              <p dangerouslySetInnerHTML={{ __html: isRtl ? blog.transportAr : blog.transportEn }} style={{ fontSize: '1.02rem', color: 'var(--sand-2)', lineHeight: 1.8 }} />
            </div>

            {/* Travel Tips */}
            <div id="tips" style={{ marginBottom: 48, paddingTop: 20 }}>
              <h2 className="font-heading" style={{ fontSize: '1.9rem', color: 'var(--gold)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span>✈️</span> {isRtl ? 'نصائح سفر هامة وإرشادات' : 'Practical Travel Tips & Advice'}
              </h2>
              <div style={{ width: 100, height: 2, background: 'var(--gold)', marginBottom: 24 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(isRtl ? blog.tipsAr : blog.tipsEn).map((tip, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, background: 'rgba(255,255,255,0.02)', padding: '16px 20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: 'var(--gold)', fontSize: '1.1rem', marginTop: -2 }}>✦</span>
                    <span style={{ fontSize: '0.98rem', color: 'var(--sand-2)', lineHeight: 1.65 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Premium Cards: Hidden Gems & Safety Advice */}
            {(blog.hiddenGemsEn || blog.safetyEn) && (
              <div id="secrets-safety" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, margin: '56px 0', paddingTop: 20 }}>
                {/* Hidden Gems Card */}
                {blog.hiddenGemsEn && (
                  <div style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.05) 0%, rgba(4,7,16,0.2) 100%)', border: '1px solid rgba(201,168,76,0.3)', padding: '32px', borderRadius: 4, position: 'relative', overflow: 'hidden' }} className="timeline-card">
                    <h3 className="font-heading" style={{ fontSize: '1.35rem', color: 'var(--gold)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                      💎 {isRtl ? 'الجواهر الخفية وأسرار الرحلة' : 'Off-the-Beaten Path & Secrets'}
                    </h3>
                    <ul style={{ paddingLeft: isRtl ? 0 : 20, paddingRight: isRtl ? 20 : 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {(isRtl ? blog.hiddenGemsAr : blog.hiddenGemsEn)?.map((gem, index) => (
                        <li key={index} style={{ fontSize: '0.98rem', color: 'var(--sand-2)', lineHeight: 1.6 }}>
                          {gem}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Safety Advice Card */}
                {blog.safetyEn && (
                  <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.02) 0%, rgba(4,7,16,0.2) 100%)', border: '1px solid rgba(239,68,68,0.25)', padding: '32px', borderRadius: 4, position: 'relative', overflow: 'hidden' }} className="timeline-card">
                    <h3 className="font-heading" style={{ fontSize: '1.35rem', color: '#fca5a5', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                      🛡️ {isRtl ? 'إرشادات السلامة والتقاليد' : 'Safety & Local Etiquette'}
                    </h3>
                    <ul style={{ paddingLeft: isRtl ? 0 : 20, paddingRight: isRtl ? 20 : 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {(isRtl ? blog.safetyAr : blog.safetyEn)?.map((safe, index) => (
                        <li key={index} style={{ fontSize: '0.98rem', color: 'var(--sand-2)', lineHeight: 1.6 }}>
                          {safe}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Frequently Asked Questions */}
            <div id="faq" style={{ marginBottom: 48, paddingTop: 20 }}>
              <h2 className="font-heading" style={{ fontSize: '1.9rem', color: 'var(--gold)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span>❓</span> {isRtl ? 'الأسئلة الشائعة للزوار' : 'Frequently Asked Questions'}
              </h2>
              <div style={{ width: 100, height: 2, background: 'var(--gold)', marginBottom: 24 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {(isRtl ? blog.faqAr : blog.faqEn).map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div
                      key={i}
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid',
                        borderColor: isOpen ? 'var(--gold)' : 'rgba(255,255,255,0.08)',
                        borderRadius: 4,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <button
                        onClick={() => toggleFaq(i)}
                        style={{
                          width: '100%',
                          textAlign: isRtl ? 'right' : 'left',
                          background: 'none',
                          border: 'none',
                          color: isOpen ? 'var(--gold)' : '#fff',
                          fontFamily: F,
                          fontSize: '1.05rem',
                          fontWeight: 600,
                          padding: '20px 24px',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 16,
                        }}
                      >
                        <span>{faq.q}</span>
                        <span style={{ color: 'var(--gold)', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                          ▼
                        </span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 24px 20px', fontSize: '0.98rem', color: 'var(--sand-2)', lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}>
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Sidebar Navigation & Destination Info */}
          <div style={{ order: isRtl ? 2 : 2 }} className="blog-sidebar-col">
            
            {/* Quick Directory Table of Contents */}
            <div style={{ position: 'sticky', top: 120, display: 'flex', flexDirection: 'column', gap: 32 }}>
              
              {/* Directory */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.2)', padding: '28px' }}>
                <h3 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--gold)', marginBottom: 20, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  🧭 {isRtl ? 'دليل القراءة السريع' : 'Article Directory'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <a href="#introduction" style={{ color: 'var(--sand-2)', textDecoration: 'none', fontSize: '0.92rem', transition: 'color 0.2s' }} className="toc-link">
                    ✨ {isRtl ? 'المقدمة' : 'Introduction'}
                  </a>
                  <a href="#history" style={{ color: 'var(--sand-2)', textDecoration: 'none', fontSize: '0.92rem', transition: 'color 0.2s' }} className="toc-link">
                    🏺 {isRtl ? 'التاريخ القديم' : 'Ancient History'}
                  </a>
                  <a href="#culture" style={{ color: 'var(--sand-2)', textDecoration: 'none', fontSize: '0.92rem', transition: 'color 0.2s' }} className="toc-link">
                    🎭 {isRtl ? 'النبض الثقافي' : 'Cultural Tapestry'}
                  </a>
                  <a href="#gallery" style={{ color: 'var(--sand-2)', textDecoration: 'none', fontSize: '0.92rem', transition: 'color 0.2s' }} className="toc-link">
                    📸 {isRtl ? 'معرض الصور' : 'Media Gallery'}
                  </a>
                  <a href="#activities" style={{ color: 'var(--sand-2)', textDecoration: 'none', fontSize: '0.92rem', transition: 'color 0.2s' }} className="toc-link">
                    🎡 {isRtl ? 'الأنشطة الموصى بها' : 'Activities'}
                  </a>
                  <a href="#food" style={{ color: 'var(--sand-2)', textDecoration: 'none', fontSize: '0.92rem', transition: 'color 0.2s' }} className="toc-link">
                    🍽️ {isRtl ? 'المأكولات المحلية' : 'Local Gastronomy'}
                  </a>
                  <a href="#hotels" style={{ color: 'var(--sand-2)', textDecoration: 'none', fontSize: '0.92rem', transition: 'color 0.2s' }} className="toc-link">
                    🏨 {isRtl ? 'فنادق ومنتجعات' : 'Where to Stay'}
                  </a>
                  {blog.itineraryEn && (
                    <a href="#itinerary" style={{ color: 'var(--sand-2)', textDecoration: 'none', fontSize: '0.92rem', transition: 'color 0.2s' }} className="toc-link">
                      📅 {isRtl ? 'برنامج الرحلة' : 'Suggested Itinerary'}
                    </a>
                  )}
                  <a href="#transportation" style={{ color: 'var(--sand-2)', textDecoration: 'none', fontSize: '0.92rem', transition: 'color 0.2s' }} className="toc-link">
                    🚊 {isRtl ? 'وسائل النقل' : 'Transportation'}
                  </a>
                  <a href="#tips" style={{ color: 'var(--sand-2)', textDecoration: 'none', fontSize: '0.92rem', transition: 'color 0.2s' }} className="toc-link">
                    ✈️ {isRtl ? 'نصائح وإرشادات' : 'Travel Tips'}
                  </a>
                  {(blog.hiddenGemsEn || blog.safetyEn) && (
                    <a href="#secrets-safety" style={{ color: 'var(--sand-2)', textDecoration: 'none', fontSize: '0.92rem', transition: 'color 0.2s' }} className="toc-link">
                      💎 {isRtl ? 'الأسرار والسلامة' : 'Secrets & Safety'}
                    </a>
                  )}
                  <a href="#faq" style={{ color: 'var(--sand-2)', textDecoration: 'none', fontSize: '0.92rem', transition: 'color 0.2s' }} className="toc-link">
                    ❓ {isRtl ? 'الأسئلة الشائعة' : 'FAQ Section'}
                  </a>
                </div>
              </div>

              {/* Best Time to Visit Summary Card */}
              <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.25)', padding: '28px' }}>
                <h4 className="font-heading" style={{ fontSize: '1.15rem', color: 'var(--gold)', marginBottom: 12 }}>
                  🌤️ {isRtl ? 'أفضل وقت للزيارة' : 'Best Time to Visit'}
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--sand-2)', lineHeight: 1.6, margin: 0 }}>
                  {isRtl ? blog.bestTimeAr : blog.bestTimeEn}
                </p>
              </div>

              {/* Nearby Attractions */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', padding: '28px' }}>
                <h4 className="font-heading" style={{ fontSize: '1.15rem', color: 'var(--gold)', marginBottom: 16 }}>
                  🗺️ {isRtl ? 'معالم قريبة للاستكشاف' : 'Nearby Attractions'}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {(isRtl ? blog.nearByAr : blog.nearByEn).map((near, i) => (
                    <div key={i} style={{ borderBottom: i < blog.nearByEn.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: i < blog.nearByEn.length - 1 ? 16 : 0 }}>
                      <Link
                        href={`/blog/${near.slug || blog.slug}`}
                        style={{ textDecoration: 'none', color: '#fff', fontSize: '0.98rem', fontWeight: 600, display: 'block', marginBottom: 4 }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#fff'; }}
                      >
                        {near.name} →
                      </Link>
                      <p style={{ fontSize: '0.85rem', color: 'var(--sand-2)', margin: 0, lineHeight: 1.5 }}>
                        {near.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Related Tours Section at the End */}
      <section style={{ background: 'linear-gradient(180deg, rgba(4,7,16,0) 0%, rgba(4,7,16,0.9) 100%)', padding: '96px 24px', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="font-heading" style={{ fontSize: '2.2rem', color: '#fff', marginBottom: 16 }}>
              ✨ {isRtl ? `رحلات مقترحة إلى ${blog.nameAr}` : `Featured ${blog.nameEn} Trips & Packages`}
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--sand-2)', maxWidth: 600, margin: '0 auto' }}>
              {isRtl ? 'احجز رحلة خاصة مع مرشدين وخدمات شاملة واستمتع بعطلة لا تُنسى في مصر.' : 'Book dynamic private tours led by our expert agency guides with premium transport and full service.'}
            </p>
          </div>

          {relatedTours.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
              {relatedTours.map((tour) => (
                <div
                  key={tour.id}
                  style={{
                    background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: 4,
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gold)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
                    <img src={tour.image} alt={tour.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: 12, right: isRtl ? 'auto' : 12, left: isRtl ? 12 : 'auto', background: 'var(--gold)', color: 'var(--navy)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 2 }}>
                      ${tour.basePrice}
                    </div>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
                      ⏱ {tour.duration} | ⭐ {tour.rating}
                    </div>
                    <h3 className="font-heading" style={{ fontSize: '1.25rem', color: '#fff', marginBottom: 12, lineHeight: 1.3 }}>
                      {tour.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--sand-2)', lineHeight: 1.6, marginBottom: 20, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {tour.description}
                    </p>
                    <a
                      href={`https://wa.me/201211385550?text=Hi%2C%20I%20would%20like%20to%20book%20the%20${encodeURIComponent(tour.title)}%20tour`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ textDecoration: 'none', display: 'block', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}
                    >
                      {isRtl ? 'احجز الآن عبر الواتساب' : 'BOOK TOUR NOW'}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ color: 'var(--sand-3)' }}>{isRtl ? 'لا توجد رحلات مقترحة حالياً.' : 'No featured tours available for this destination.'}</p>
            </div>
          )}

        </div>
      </section>

      {/* Recommended Guides Section */}
      <section style={{ padding: '80px 24px 96px', background: 'rgba(4,7,16,0.35)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="font-heading" style={{ fontSize: '2.2rem', color: '#fff', marginBottom: 16 }}>
              🗺️ {isRtl ? 'اكتشف المزيد من سحر مصر' : 'Continue Your Egyptian Journey'}
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--sand-2)', maxWidth: 600, margin: '0 auto' }}>
              {isRtl ? 'تصفح المزيد من أدلة السفر الفاخرة المنسقة خصيصاً للمسافرين المميزين.' : 'Explore more premium, expert travel guides curated for luxury and cultural discovery.'}
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
            {egyptDestinationsBlogs
              .filter((b) => b.slug !== blog.slug)
              .slice(0, 3)
              .map((item) => (
                <Link
                  href={`/blog/${item.slug}`}
                  key={item.slug}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div
                    style={{
                      background: 'linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.005) 100%)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 4,
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--gold)';
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
                      <img
                        src={item.heroImage}
                        alt={isRtl ? item.titleAr : item.titleEn}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                          📍 {isRtl ? item.nameAr : item.nameEn}
                        </span>
                        <h3 className="font-heading" style={{ fontSize: '1.2rem', color: '#fff', marginBottom: 12, lineHeight: 1.35 }}>
                          {isRtl ? item.titleAr : item.titleEn}
                        </h3>
                        <p style={{ fontSize: '0.88rem', color: 'var(--sand-2)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
                          {isRtl ? item.metaDescriptionAr : item.metaDescriptionEn}
                        </p>
                      </div>
                      <div style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', marginTop: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {isRtl ? 'اقرأ الدليل الكامل' : 'READ FULL GUIDE'} <span>→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Global CSS animations */}
      <style jsx global>{`
        .timeline-card:hover {
          background: rgba(201,168,76,0.04) !important;
          border-color: var(--gold) !important;
          transform: translateY(-2px);
        }
        .ken-burns {
          animation: kb-zoom 45s ease infinite alternate;
        }
        @keyframes kb-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .toc-link:hover {
          color: var(--gold) !important;
          padding-left: ${isRtl ? '0' : '4px'};
          padding-right: ${isRtl ? '4px' : '0'};
        }
        @media (min-width: 992px) {
          .blog-detail-grid {
            grid-template-columns: 3fr 1fr;
          }
          .blog-sidebar-col {
            order: 2 !important;
          }
        }
        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: 1fr !important;
          }
          .span-two {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
}

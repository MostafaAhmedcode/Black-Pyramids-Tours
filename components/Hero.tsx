'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { topDestinations, featuredTours, featuredHotels } from '../data/agencyData';
import type { AgencyTour, Hotel } from '../data/agencyData';

const destTourMap: Record<string, number> = {
  Cairo: 1, Luxor: 2, Aswan: 6, Hurghada: 4,
  Alexandria: 5, Siwa: 4, Dahab: 4, 'Sharm El Sheikh': 4,
};
const destHotelMap: Record<string, number> = {
  Cairo: 1, Luxor: 5, Aswan: 4, Hurghada: 6,
  Alexandria: 3, Siwa: 2, Dahab: 2, 'Sharm El Sheikh': 6,
};

type Phase = 0|1|2|3|4|5|6;
type View  = 'hero'|'destination'|'reserve';
interface SearchState { from: string; to: string; activity: string; duration: string; }
interface ReserveForm {
  name: string; email: string; phone: string;
  date: string; guests: string; notes: string;
  fromCountry: string; fromCity: string;
}

const ACTIVITIES = ['All Activities','Guided Tour','Nile Cruise','Desert Safari','Diving','Cultural Tour','Honeymoon'];
const DURATIONS  = ['1 - 1 Days','1 - 3 Days','3 - 5 Days','5 - 7 Days','1 Week+'];

export default function Hero() {
  const [phase,       setPhase]       = useState<Phase>(0);
  const [destIdx,     setDestIdx]     = useState(0);
  const [view,        setView]        = useState<View>('hero');
  const [activeDest,  setActiveDest]  = useState(topDestinations[0]);
  const [activeTour,  setActiveTour]  = useState<AgencyTour>(featuredTours[0]);
  const [reserveTour, setReserveTour] = useState<AgencyTour|null>(null);
  const [submitted,   setSubmitted]   = useState(false);
  const [search, setSearch] = useState<SearchState>({ from:'', to:'', activity:'All Activities', duration:'1 - 1 Days' });
  const [form, setForm] = useState<ReserveForm>({
    name:'', email:'', phone:'', date:'', guests:'2', notes:'', fromCountry:'', fromCity:'',
  });
  const autoRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const topRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = [
      setTimeout(()=>setPhase(1),  80),
      setTimeout(()=>setPhase(2), 500),
      setTimeout(()=>setPhase(3),1050),
      setTimeout(()=>setPhase(4),1650),
      setTimeout(()=>setPhase(5),2200),
      setTimeout(()=>setPhase(6),2700),
    ];
    return ()=>t.forEach(clearTimeout);
  }, []);

  const startAuto = useCallback(()=>{
    autoRef.current = setInterval(()=>setDestIdx(i=>(i+1)%topDestinations.length), 3800);
  },[]);
  useEffect(()=>{ startAuto(); return ()=>{ if(autoRef.current) clearInterval(autoRef.current); }; },[startAuto]);

  const pickDest = (i: number) => {
    if(autoRef.current) clearInterval(autoRef.current);
    const dest = topDestinations[i];
    const primaryTour = featuredTours.find(t=>t.id===destTourMap[dest.name]) ?? featuredTours[0];
    setDestIdx(i);
    setActiveDest(dest);
    setActiveTour(primaryTour);
    setView('destination');
    setSubmitted(false);
    startAuto();
    setTimeout(()=>topRef.current?.scrollIntoView({behavior:'smooth',block:'start'}),80);
  };

  const switchTour = (tour: AgencyTour) => setActiveTour(tour);

  const openReserve = (tour: AgencyTour) => {
    setReserveTour(tour); setView('reserve'); setSubmitted(false);
    setForm(f=>({...f,name:'',email:'',phone:'',date:'',notes:'',
      fromCountry: search.from, fromCity:''}));
  };

  const backToHero = ()=>{ setView('hero'); setSubmitted(false); };
  const backToDest = ()=>{ setView('destination'); setSubmitted(false); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = [
      `Hello Black Pyramids Tours! 🏛️`,``,
      `📌 Tour: ${reserveTour?.title}`,
      `📍 Destination: ${activeDest.name}`,``,
      `🌍 From: ${form.fromCity ? form.fromCity+', ' : ''}${form.fromCountry}`,
      `📅 Date: ${form.date}  👥 Guests: ${form.guests}`,``,
      `👤 ${form.name}  📧 ${form.email}  📱 ${form.phone}`,``,
      `💬 ${form.notes||'No special requests'}`,``,
      `Please confirm availability. Thank you!`,
    ].join('\n');
    window.open(`https://wa.me/201211385550?text=${encodeURIComponent(msg)}`,'_blank');
    setSubmitted(true);
  };

  const destHotel = featuredHotels.find(h=>h.id===(destHotelMap[activeDest.name]??1))!;

  return (
    <section id="home" ref={topRef} className="hero-section">

      {/* BG */}
      <div className="hero-bg" style={{
        opacity:phase>=1?(view!=='hero'?0.12:0.42):0,
        filter:view!=='hero'?'blur(3px)':'none',
      }}/>
      <div className="hero-overlay-grad"/>
      <div className="hero-glow-radial" style={{opacity:phase>=4?1:0}}/>

      {/* Stars */}
      <div className="hero-stars" aria-hidden="true">
        {[{t:'7%',l:'9%',s:1.5},{t:'12%',l:'28%',s:1.0},{t:'5%',l:'52%',s:1.6},
          {t:'16%',l:'71%',s:1.1},{t:'8%',l:'87%',s:0.9},{t:'21%',l:'4%',s:1.2},
          {t:'3%',l:'64%',s:1.4},{t:'25%',l:'42%',s:0.8}].map((st,i)=>(
          <div key={i} style={{position:'absolute',top:st.t,left:st.l,width:st.s,height:st.s,borderRadius:'50%',
            background:'rgba(223,202,125,0.75)',boxShadow:`0 0 ${st.s*3}px rgba(223,202,125,0.5)`,
            opacity:phase>=1?0.8:0,transition:`opacity ${1+i*0.12}s ease ${i*0.08}s`}}/>
        ))}
      </div>

      {/* ── HERO VIEW ── */}
      <div className="hero-view" style={{
        opacity:view==='hero'?1:0,
        pointerEvents:view==='hero'?'auto':'none',
      }}>
        {/* Pyramids */}
        <div className="pyramid-scene">
          <PyramidSVG wBase={185} hBase={240} risen={phase>=2} delay={0}    glow={0.45}/>
          <PyramidSVG wBase={270} hBase={350} risen={phase>=3} delay={0.13} glow={1} centre/>
          <PyramidSVG wBase={185} hBase={240} risen={phase>=2} delay={0.06} glow={0.45}/>
        </div>

        {/* Sand horizon */}
        <div className="sand-horizon" style={{opacity:phase>=2?1:0}}/>

        {/* Brand */}
        <div className="hero-brand" style={{
          opacity:phase>=4?1:0,
          transform:phase>=4?'translateY(0) scale(1)':'translateY(28px) scale(0.9)',
        }}>
          <div className="hero-ornament" style={{opacity:phase>=4?1:0}}>
            <div className="hero-ornament-line"/>
            <span className="hero-ornament-diamonds">◆◆◆</span>
            <div className="hero-ornament-line"/>
          </div>

          <div className="hero-eyebrow" style={{opacity:phase>=4?1:0}}>
            Luxury Egypt Travel · Est. 2005
          </div>

          <div className="hero-title-main">Black Pyramids</div>
          <div className="hero-title-sub">Tours</div>

          <div className="hero-tagline" style={{opacity:phase>=5?1:0}}>
            Hotel Reservations · Private Tours · Luxury Transportation
          </div>

          <div className="hero-ctas" style={{
            opacity:phase>=5?1:0,
            transform:phase>=5?'translateY(0)':'translateY(12px)',
          }}>
            <a href="#tours" className="btn-primary hero-cta-btn">Explore Tours</a>
            <a href="#hotels" className="btn-secondary hero-cta-btn">Book Hotels</a>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hero-search-wrap" style={{
          opacity:phase>=6?1:0,
          transform:phase>=6?'translateY(0)':'translateY(10px)',
        }}>
          <div className="hero-search-bar">
            <div className="hero-search-fields">
              <SearchCell icon="✈️" label="From">
                <input value={search.from} onChange={e=>setSearch(s=>({...s,from:e.target.value}))}
                  placeholder="Country" style={searchInputStyle}/>
              </SearchCell>
              <div className="search-divider"/>
              <SearchCell icon="📍" label="Destination">
                <input value={search.to} onChange={e=>setSearch(s=>({...s,to:e.target.value}))}
                  placeholder="Cairo, Luxor…" style={searchInputStyle}/>
              </SearchCell>
              <div className="search-divider"/>
              <SearchCell icon="🔺" label="Activity">
                <select value={search.activity} onChange={e=>setSearch(s=>({...s,activity:e.target.value}))} style={searchSelectStyle}>
                  {ACTIVITIES.map(a=><option key={a} value={a}>{a}</option>)}
                </select>
              </SearchCell>
              <div className="search-divider"/>
              <SearchCell icon="⏱" label="Duration">
                <select value={search.duration} onChange={e=>setSearch(s=>({...s,duration:e.target.value}))} style={searchSelectStyle}>
                  {DURATIONS.map(d=><option key={d} value={d}>{d}</option>)}
                </select>
              </SearchCell>
            </div>
            <button
              className="hero-search-btn"
              onClick={()=>{
                const idx = topDestinations.findIndex(d=>d.name.toLowerCase().includes(search.to.toLowerCase()));
                if(idx>=0) pickDest(idx);
                else if(topDestinations.length>0) pickDest(0);
              }}
            >Search</button>
          </div>
        </div>
      </div>

      {/* ── DESTINATION PANEL ── */}
      <div className="panel-overlay" style={{
        zIndex:20,
        opacity:view==='destination'?1:0,
        transform:view==='destination'?'translateY(0)':'translateY(60px)',
        pointerEvents:view==='destination'?'auto':'none',
      }}>
        <div className="panel-overlay-bg"/>
        <div className="panel-content">
          <button onClick={backToHero} style={backBtnStyle}>← Back to Home</button>

          <div className="dest-header">
            <span className="dest-emoji">{activeDest.emoji}</span>
            <div>
              <div className="dest-label">Destination</div>
              <h2 className="font-heading dest-name">{activeDest.name}</h2>
            </div>
          </div>
          <p className="dest-tagline">{activeDest.tagline}</p>

          {/* Tour tabs */}
          <div style={{marginBottom:28}}>
            <div className="section-micro-label">Browse All Tours</div>
            <div className="tour-tabs">
              {featuredTours.map(t=>{
                const isActive = t.id === activeTour.id;
                return (
                  <button key={t.id} onClick={()=>switchTour(t)} className={`tour-tab${isActive?' tour-tab--active':''}`}>
                    {t.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tour detail */}
          <div className="tour-detail-grid">
            <div className="tour-detail-img">
              <img src={activeTour.image} alt={activeTour.title} style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0}}/>
              <div className="tour-price-badge">from ${activeTour.price}</div>
            </div>
            <div className="tour-detail-body">
              <div className="tour-meta">{activeTour.duration} · {activeTour.difficulty}</div>
              <h3 className="font-heading tour-detail-title">{activeTour.title}</h3>
              <p className="tour-detail-desc">{activeTour.description}</p>
              <div className="tour-includes">
                {activeTour.included.map(inc=>(
                  <span key={inc} className="tour-include-tag">✓ {inc}</span>
                ))}
              </div>
              <div className="tour-detail-footer">
                <div className="tour-rating">★ {activeTour.rating} <span>({activeTour.reviewsCount} reviews)</span></div>
                <button onClick={()=>openReserve(activeTour)} className="btn-primary tour-reserve-btn">
                  Reserve This Tour →
                </button>
              </div>
            </div>
          </div>

          {destHotel && (
            <>
              <div className="section-micro-label" style={{marginBottom:10}}>Recommended Hotel</div>
              <HotelPanelCard hotel={destHotel}/>
            </>
          )}
        </div>
      </div>

      {/* ── RESERVATION PANEL ── */}
      <div className="panel-overlay" style={{
        zIndex:30,
        opacity:view==='reserve'?1:0,
        transform:view==='reserve'?'translateY(0)':'translateY(60px)',
        pointerEvents:view==='reserve'?'auto':'none',
        background:'rgba(10,10,10,0.98)',
      }}>
        <div className="panel-content panel-content--narrow">
          <button onClick={backToDest} style={backBtnStyle}>← Back to {activeDest.name}</button>

          <div className="reserve-tour-banner">
            <div className="reserve-tour-img">
              <img src={reserveTour?.image} alt={reserveTour?.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            </div>
            <div className="reserve-tour-info">
              <div className="section-micro-label">{activeDest.emoji} {activeDest.name} · {reserveTour?.duration}</div>
              <div className="font-heading reserve-tour-title">{reserveTour?.title}</div>
              <div className="reserve-tour-price">from ${reserveTour?.price} <span>/ person · ★ {reserveTour?.rating}</span></div>
            </div>
          </div>

          <div className="section-micro-label" style={{textAlign:'center',marginBottom:18}}>Reserve Your Experience</div>

          {submitted ? (
            <SuccessCard tour={reserveTour} dest={activeDest.name} onBack={backToDest}/>
          ) : (
            <form onSubmit={handleSubmit} className="reserve-form">
              <div className="reserve-world-banner">
                <span>🌍</span>
                <span><strong>Book from anywhere in the world.</strong> We handle airport transfers, flights advice &amp; full Egypt support from your country.</span>
              </div>

              <div className="form-row-2">
                <Field label="Your Country *" type="text" value={form.fromCountry} onChange={v=>setForm(f=>({...f,fromCountry:v}))} placeholder="e.g. United States" required/>
                <Field label="City / Airport *" type="text" value={form.fromCity} onChange={v=>setForm(f=>({...f,fromCity:v}))} placeholder="e.g. New York (JFK)" required/>
              </div>
              <div className="form-divider"/>
              <div className="form-row-2">
                <Field label="Full Name *" type="text" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="Your full name" required/>
                <Field label="Email *" type="email" value={form.email} onChange={v=>setForm(f=>({...f,email:v}))} placeholder="your@email.com" required/>
              </div>
              <div className="form-row-2">
                <Field label="Phone / WhatsApp *" type="tel" value={form.phone} onChange={v=>setForm(f=>({...f,phone:v}))} placeholder="+1 000 000 0000" required/>
                <Field label="Preferred Date *" type="date" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))} required/>
              </div>
              <div style={{marginBottom:14}}>
                <label style={labelStyle}>Guests</label>
                <select value={form.guests} onChange={e=>setForm(f=>({...f,guests:e.target.value}))} style={{...inputStyle,cursor:'pointer'}}>
                  {['1','2','3','4','5','6','7','8+'].map(n=>(<option key={n} value={n}>{n} {parseInt(n)===1?'Guest':'Guests'}</option>))}
                </select>
              </div>
              <div style={{marginBottom:22}}>
                <label style={labelStyle}>Special Requests</label>
                <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={3}
                  placeholder="Dietary needs, accessibility, special occasions..."
                  style={{...inputStyle,resize:'vertical',minHeight:72}}/>
              </div>
              <div className="reserve-info-box">
                <span>ℹ️</span>
                <span>Opens WhatsApp with your details pre-filled. Our team responds within 2 hours.</span>
              </div>
              <button type="submit" className="btn-primary" style={{width:'100%',cursor:'pointer',fontSize:'0.72rem'}}>
                Confirm via WhatsApp →
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── DESTINATION STRIP ── */}
      <div className="dest-strip" style={{
        transform:phase>=6?'translateY(0)':'translateY(100%)',
      }}>
        <div className="dest-strip-progress">
          <div style={{height:'100%',background:'linear-gradient(90deg,var(--gold-dark),var(--gold-light))',width:`${((destIdx+1)/topDestinations.length)*100}%`,transition:'width 0.5s ease'}}/>
        </div>
        <div className="dest-strip-bar">
          <div className="dest-strip-inner">
            <span className="dest-strip-label">Destinations</span>
            <div className="dest-strip-scroll">
              {topDestinations.map((d,i)=>{
                const active=i===destIdx;
                return (
                  <button key={d.id} onClick={()=>pickDest(i)} className={`dest-btn${active?' dest-btn--active':''}`}>
                    <span className="dest-btn-emoji">{d.emoji}</span>
                    <span className="dest-btn-name">{d.name}</span>
                  </button>
                );
              })}
            </div>
            <a href="/destinations" className="dest-strip-all">All →</a>
          </div>
        </div>
      </div>

      {/* Scroll caret */}
      <div className="anim-scroll hero-scroll-caret" style={{display:view==='hero'?'block':'none'}}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>

      <style>{`
        /* ── SECTION ── */
        .hero-section {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background: #0a0a0a;
          display: flex;
          flex-direction: column;
        }

        /* ── BG layers ── */
        .hero-bg {
          position: absolute; inset: 0; z-index: 0;
          background-image: url('https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1800&q=80&fit=crop');
          background-size: cover; background-position: center 38%;
          transition: opacity 1.8s ease, filter 0.8s ease;
        }
        .hero-overlay-grad {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(to bottom,rgba(10,10,10,0.62) 0%,rgba(10,10,10,0.18) 38%,rgba(10,10,10,0.65) 72%,#0a0a0a 100%);
        }
        .hero-glow-radial {
          position: absolute; inset: 0; z-index: 1;
          background: radial-gradient(ellipse 65% 36% at 50% 84%,rgba(201,168,76,0.13) 0%,transparent 70%);
          transition: opacity 1.4s ease;
        }
        .hero-stars { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

        /* ── HERO VIEW ── */
        .hero-view {
          position: relative; z-index: 10; flex: 1;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          min-height: 100vh;
          padding: 100px 16px 120px;
          transition: opacity 0.45s ease;
        }

        /* ── PYRAMIDS ── */
        .pyramid-scene {
          position: absolute;
          bottom: 14%;
          left: 50%; transform: translateX(-50%);
          width: min(860px, 96vw);
          display: flex; align-items: flex-end;
          justify-content: center;
          gap: min(26px, 2.5vw);
          pointer-events: none; z-index: 2;
        }

        /* ── Sand horizon ── */
        .sand-horizon {
          position: absolute; bottom: 12%; left: 0; right: 0; height: 1px; z-index: 3;
          background: linear-gradient(90deg,transparent,rgba(201,168,76,0.55) 20%,rgba(201,168,76,0.85) 50%,rgba(201,168,76,0.55) 80%,transparent);
          transition: opacity 0.8s ease 0.3s;
        }

        /* ── BRAND ── */
        .hero-brand {
          position: relative; z-index: 5;
          text-align: center; user-select: none;
          margin-bottom: calc(14% + 20px);
          transition: all 1s cubic-bezier(0.22,1,0.36,1);
        }
        .hero-ornament {
          display: flex; align-items: center; justify-content: center;
          gap: 14px; margin-bottom: 10px;
          transition: opacity 0.8s ease 0.2s;
        }
        .hero-ornament-line { width: 44px; height: 1px; background: linear-gradient(90deg,transparent,rgba(201,168,76,0.5)); }
        .hero-ornament-line:last-child { background: linear-gradient(90deg,rgba(201,168,76,0.5),transparent); }
        .hero-ornament-diamonds { color: rgba(201,168,76,0.6); font-size: 7px; letter-spacing: 3px; }
        .hero-eyebrow {
          font-family: var(--font-inter),Inter,sans-serif;
          font-size: clamp(0.44rem,0.9vw,0.58rem);
          font-weight: 700; letter-spacing: 0.45em; text-transform: uppercase;
          color: rgba(201,168,76,0.6); margin-bottom: 8px;
          transition: opacity 0.7s ease 0.3s;
        }
        .hero-title-main {
          font-family: var(--font-playfair),"Playfair Display",Georgia,serif;
          font-size: clamp(2rem, 7vw, 4.8rem);
          font-weight: 400; letter-spacing: 0.07em; text-transform: uppercase; line-height: 0.94;
          background: linear-gradient(140deg,#8B6914 0%,#DFCA7D 38%,#C9A84C 55%,#9B7D2F 80%,#E8D48A 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          filter: drop-shadow(0 2px 16px rgba(201,168,76,0.42));
          animation: brand-shimmer 4.5s ease-in-out infinite;
        }
        .hero-title-sub {
          font-family: var(--font-playfair),"Playfair Display",Georgia,serif;
          font-size: clamp(2rem, 7vw, 4.8rem);
          font-weight: 400; letter-spacing: 0.07em; text-transform: uppercase; line-height: 1.0;
          color: #fff; text-shadow: 0 2px 36px rgba(0,0,0,1),0 0 70px rgba(0,0,0,0.95);
          margin-bottom: 10px;
        }
        .hero-tagline {
          font-family: var(--font-cormorant),"Cormorant Garamond",serif;
          font-size: clamp(0.72rem,1.5vw,1rem); font-style: italic;
          color: rgba(245,230,200,0.6); letter-spacing: 0.04em; margin-bottom: 20px;
          transition: opacity 0.8s ease 0.1s;
          padding: 0 8px;
        }
        .hero-ctas {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-bottom: 16px;
          transition: all 0.7s cubic-bezier(0.22,1,0.36,1) 0.22s;
        }
        .hero-cta-btn { text-decoration: none; padding: 12px 28px !important; font-size: 0.72rem !important; }

        /* ── SEARCH BAR ── */
        .hero-search-wrap {
          position: absolute;
          bottom: calc(12% + 8px);
          left: 50%; transform: translateX(-50%);
          width: min(960px, 94vw);
          z-index: 10;
          transition: all 0.7s cubic-bezier(0.22,1,0.36,1);
        }
        .hero-search-bar {
          background: rgba(8,8,8,0.92);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(201,168,76,0.35);
          box-shadow: 0 8px 40px rgba(0,0,0,0.6);
          display: flex; align-items: stretch; flex-wrap: wrap;
        }
        .hero-search-fields {
          display: flex; align-items: stretch; flex: 1; flex-wrap: wrap; min-width: 0;
        }
        .search-divider {
          width: 1px; background: rgba(201,168,76,0.22); flex-shrink: 0; margin: 8px 0;
        }
        .hero-search-btn {
          background: linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold-light));
          border: none; cursor: pointer; padding: 0 28px;
          font-family: var(--font-inter),Inter,sans-serif;
          font-size: 0.65rem; font-weight: 800;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #0a0a0a; flex-shrink: 0;
          transition: filter 0.2s ease; min-width: 90px; min-height: 52px;
        }
        .hero-search-btn:hover { filter: brightness(1.08); }

        /* ── PANELS ── */
        .panel-overlay {
          position: absolute; inset: 0;
          transition: all 0.55s cubic-bezier(0.22,1,0.36,1);
          overflow-y: auto;
        }
        .panel-overlay-bg {
          position: absolute; inset: 0;
          background: rgba(10,10,10,0.92); z-index: 0;
        }
        .panel-content {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto;
          padding: 96px 16px 80px;
        }
        .panel-content--narrow { max-width: 700px; padding: 96px 16px 60px; }

        /* ── DESTINATION HEADER ── */
        .dest-header { display: flex; align-items: flex-end; gap: 16px; margin-bottom: 6px; flex-wrap: wrap; }
        .dest-emoji { font-size: clamp(1.8rem,5vw,3rem); }
        .dest-label {
          font-family: var(--font-inter),Inter,sans-serif;
          font-size: 0.58rem; font-weight: 700; letter-spacing: 0.3em;
          text-transform: uppercase; color: var(--gold);
        }
        .dest-name {
          font-size: clamp(1.6rem,4.5vw,2.8rem) !important;
          font-weight: 400; color: #fff; line-height: 1.1; margin: 0;
        }
        .dest-tagline {
          font-family: var(--font-cormorant),"Cormorant Garamond",serif;
          font-size: clamp(0.9rem,1.6vw,1.1rem); font-style: italic;
          color: var(--sand-2); margin-bottom: 28px; line-height: 1.6;
        }
        .section-micro-label {
          font-family: var(--font-inter),Inter,sans-serif;
          font-size: 0.56rem; font-weight: 700; letter-spacing: 0.26em;
          text-transform: uppercase; color: var(--gold); margin-bottom: 10px;
        }

        /* ── TOUR TABS ── */
        .tour-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
        .tour-tab {
          font-family: var(--font-inter),Inter,sans-serif;
          font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 7px 14px; cursor: pointer;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(201,168,76,0.22);
          color: var(--sand-3);
          transition: all 0.2s ease; white-space: nowrap;
        }
        .tour-tab--active {
          background: var(--gold); border-color: var(--gold); color: #0a0a0a;
        }

        /* ── TOUR DETAIL GRID ── */
        .tour-detail-grid {
          display: grid;
          grid-template-columns: min(300px, 42%) 1fr;
          border: 1px solid rgba(201,168,76,0.22);
          overflow: hidden; margin-bottom: 36px;
        }
        .tour-detail-img {
          overflow: hidden; position: relative; min-height: 220px;
        }
        .tour-price-badge {
          position: absolute; top: 12px; left: 12px;
          background: rgba(201,168,76,0.92); color: #0a0a0a;
          font-family: var(--font-inter),Inter,sans-serif;
          font-size: 0.68rem; font-weight: 800; padding: 4px 10px;
        }
        .tour-detail-body { padding: 24px 20px; background: rgba(255,255,255,0.025); }
        .tour-meta {
          font-family: var(--font-inter),Inter,sans-serif;
          font-size: 0.58rem; font-weight: 700; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--gold); margin-bottom: 6px;
        }
        .tour-detail-title {
          font-size: clamp(1.1rem,2.5vw,1.8rem) !important;
          font-weight: 500; color: #fff; margin-bottom: 10px; line-height: 1.2;
        }
        .tour-detail-desc {
          font-family: var(--font-inter),Inter,sans-serif;
          font-size: 0.82rem; color: var(--sand-3); line-height: 1.65; margin-bottom: 14px;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .tour-includes { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
        .tour-include-tag {
          font-family: var(--font-inter),Inter,sans-serif;
          font-size: 0.6rem; font-weight: 600; color: var(--sand-3);
          background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.18); padding: 4px 10px;
        }
        .tour-detail-footer {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
        }
        .tour-rating {
          font-family: var(--font-inter),Inter,sans-serif; font-size: 0.72rem; color: var(--gold);
        }
        .tour-rating span { color: var(--sand-3); }
        .tour-reserve-btn { padding: 10px 18px !important; font-size: 0.66rem !important; cursor: pointer; }

        /* ── HOTEL PANEL ── */
        .hotel-panel-grid {
          display: grid; grid-template-columns: min(220px,36%) 1fr;
          border: 1px solid rgba(201,168,76,0.2); background: rgba(255,255,255,0.025);
          margin-bottom: 40px; overflow: hidden;
        }
        .hotel-panel-img { overflow: hidden; }
        .hotel-panel-body {
          padding: 20px 18px; display: flex; flex-direction: column; justify-content: space-between;
        }

        /* ── RESERVE FORM ── */
        .reserve-tour-banner {
          display: flex; gap: 0; align-items: stretch;
          border: 1px solid rgba(201,168,76,0.22); overflow: hidden; margin-bottom: 28px;
        }
        .reserve-tour-img { width: 100px; flex-shrink: 0; }
        .reserve-tour-info { padding: 14px 16px; flex: 1; min-width: 0; }
        .reserve-tour-title { font-size: 1.1rem; font-weight: 500; color: #fff; margin-bottom: 4px; white-space: normal; }
        .reserve-tour-price {
          font-family: var(--font-inter),Inter,sans-serif;
          font-size: 0.72rem; color: var(--gold); font-weight: 700;
        }
        .reserve-tour-price span { color: var(--sand-3); font-weight: 400; }
        .reserve-form {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(201,168,76,0.18); padding: 24px 20px;
        }
        .reserve-world-banner {
          background: rgba(201,168,76,0.07); border: 1px solid rgba(201,168,76,0.2);
          padding: 12px 14px; margin-bottom: 20px; display: flex; align-items: flex-start; gap: 10px;
          font-family: var(--font-inter),Inter,sans-serif; font-size: 0.66rem; color: var(--sand-2); line-height: 1.5;
        }
        .reserve-world-banner strong { color: var(--gold); }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; margin-bottom: 14px; }
        .form-divider { height: 1px; background: rgba(201,168,76,0.12); margin-bottom: 16px; }
        .reserve-info-box {
          background: rgba(201,168,76,0.05); border: 1px solid rgba(201,168,76,0.13);
          padding: 11px 14px; margin-bottom: 20px;
          display: flex; gap: 8px; align-items: flex-start;
          font-family: var(--font-inter),Inter,sans-serif; font-size: 0.66rem; color: var(--sand-3); line-height: 1.6;
        }

        /* ── DESTINATION STRIP ── */
        .dest-strip {
          position: absolute; bottom: 0; left: 0; right: 0; z-index: 40;
          transition: transform 0.75s cubic-bezier(0.22,1,0.36,1);
        }
        .dest-strip-progress {
          height: 2px; background: rgba(201,168,76,0.1); overflow: hidden;
        }
        .dest-strip-bar {
          background: rgba(8,8,8,0.92);
          backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
          border-top: 1px solid rgba(201,168,76,0.18);
        }
        .dest-strip-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 12px;
          display: flex; align-items: center; height: 52px;
          overflow: hidden;
        }
        .dest-strip-label {
          font-family: var(--font-inter),Inter,sans-serif;
          font-size: 0.55rem; font-weight: 700; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--gold);
          white-space: nowrap; padding-right: 12px; flex-shrink: 0;
          border-right: 1px solid rgba(201,168,76,0.18); line-height: 52px;
        }
        .dest-strip-scroll {
          display: flex; align-items: center;
          overflow-x: auto; flex: 1;
          scrollbar-width: none; -ms-overflow-style: none;
        }
        .dest-strip-scroll::-webkit-scrollbar { display: none; }
        .dest-btn {
          background: none; border: none; cursor: pointer;
          padding: 0 10px; height: 52px;
          display: flex; align-items: center; gap: 5px; flex-shrink: 0;
          border-bottom: 2px solid transparent;
          color: var(--sand-3); transition: color 0.22s ease, border-color 0.22s ease;
        }
        .dest-btn--active { border-bottom-color: var(--gold); color: var(--gold); }
        .dest-btn-emoji { font-size: 0.9rem; }
        .dest-btn-name {
          font-family: var(--font-inter),Inter,sans-serif;
          font-size: 0.58rem; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; white-space: nowrap;
        }
        .dest-strip-all {
          margin-left: 8px; flex-shrink: 0;
          font-family: var(--font-inter),Inter,sans-serif;
          font-size: 0.55rem; font-weight: 700; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--gold); text-decoration: none;
          padding: 0 0 0 12px; border-left: 1px solid rgba(201,168,76,0.18);
          line-height: 52px; white-space: nowrap;
        }

        /* ── SCROLL CARET ── */
        .hero-scroll-caret {
          position: absolute; bottom: 62px; left: 50%; transform: translateX(-50%);
          z-index: 10; opacity: 0.38;
        }

        /* ── KEYFRAMES ── */
        @keyframes pyr-glow {
          0%,100%{ filter:drop-shadow(0 0 8px rgba(201,168,76,0.3)); }
          50%    { filter:drop-shadow(0 0 32px rgba(201,168,76,0.75)) drop-shadow(0 -6px 24px rgba(201,168,76,0.2)); }
        }
        @keyframes cap-flash {
          0%  { opacity:0; transform:scale(0); }
          60% { opacity:1; transform:scale(1.4); }
          100%{ opacity:1; transform:scale(1); }
        }
        @keyframes brand-shimmer {
          0%,100%{ filter:drop-shadow(0 2px 16px rgba(201,168,76,0.42)); }
          50%    { filter:drop-shadow(0 2px 34px rgba(223,202,125,0.7)) drop-shadow(0 0 60px rgba(201,168,76,0.22)); }
        }

        /* ════════════════════════════════════
           TABLET  (max 768px)
        ════════════════════════════════════ */
        @media (max-width: 768px) {
          .hero-view { padding: 90px 16px 140px; }

          .pyramid-scene {
            bottom: 16%;
            gap: min(14px, 2vw);
          }
          .sand-horizon { bottom: 14%; }

          .hero-brand { margin-bottom: calc(16% + 16px); }

          /* Search bar: stack into 2×2 grid on tablet */
          .hero-search-wrap {
            bottom: calc(14% + 4px);
            width: calc(100vw - 24px);
          }
          .hero-search-fields {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
          .search-divider { display: none; }
          .hero-search-btn {
            width: 100%; border-top: 1px solid rgba(201,168,76,0.2); min-height: 48px;
          }

          /* Destination strip: smaller text, tighter padding */
          .dest-btn-name { font-size: 0.52rem; letter-spacing: 0.06em; }
          .dest-btn { padding: 0 8px; }
          .dest-strip-label { display: none; }

          /* Tour detail: stack vertically */
          .tour-detail-grid { grid-template-columns: 1fr; }
          .tour-detail-img { min-height: 180px; }

          /* Hotel panel: stack vertically */
          .hotel-panel-grid { grid-template-columns: 1fr; }
          .hotel-panel-img img { height: 160px; object-fit: cover; width: 100%; }

          .panel-content { padding: 80px 14px 60px; }
          .panel-content--narrow { padding: 80px 14px 40px; }
        }

        /* ════════════════════════════════════
           MOBILE  (max 480px — iPhone XS = 375px)
        ════════════════════════════════════ */
        @media (max-width: 480px) {
          .hero-view { padding: 80px 12px 160px; }

          /* Pyramids: scale down significantly */
          .pyramid-scene {
            bottom: 18%;
            gap: 8px;
          }
          .sand-horizon { bottom: 16%; }
          .hero-brand { margin-bottom: calc(18% + 12px); }

          .hero-title-main, .hero-title-sub {
            font-size: clamp(1.7rem, 10vw, 2.4rem) !important;
          }
          .hero-tagline { font-size: 0.7rem; letter-spacing: 0.01em; }
          .hero-ctas { gap: 8px; }
          .hero-cta-btn { padding: 10px 18px !important; font-size: 0.66rem !important; }

          /* Search bar: full single column on mobile */
          .hero-search-wrap {
            bottom: 60px;
            width: calc(100vw - 20px);
          }
          .hero-search-fields {
            grid-template-columns: 1fr;
          }
          .hero-search-btn { min-height: 46px; font-size: 0.62rem; }

          /* Destination strip: emoji only, no text */
          .dest-btn-name { display: none; }
          .dest-btn { padding: 0 7px; gap: 0; }
          .dest-btn-emoji { font-size: 1.1rem; }
          .dest-strip-all { padding-left: 8px; font-size: 0.5rem; }
          .dest-strip-inner { padding: 0 8px; height: 48px; }
          .dest-btn { height: 48px; }

          /* Panels */
          .panel-content { padding: 70px 12px 50px; }
          .panel-content--narrow { padding: 70px 12px 40px; }

          /* Form: single column on mobile */
          .form-row-2 { grid-template-columns: 1fr; gap: 10px; }

          /* Reserve banner */
          .reserve-tour-img { width: 80px; }
          .reserve-tour-title { font-size: 0.95rem; }

          /* Tour detail */
          .tour-detail-body { padding: 16px 14px; }
          .tour-detail-title { font-size: 1.1rem !important; }
          .tour-detail-footer { flex-direction: column; align-items: flex-start; }
          .tour-reserve-btn { width: 100% !important; text-align: center; justify-content: center; }

          /* Hotel panel */
          .hotel-panel-body { padding: 14px; }
        }
      `}</style>
    </section>
  );
}

/* ── PYRAMID SVG — responsive wrapper ── */
function PyramidSVG({wBase,hBase,risen,delay,glow,centre}:{wBase:number;hBase:number;risen:boolean;delay:number;glow:number;centre?:boolean}) {
  // Scale down on mobile using CSS custom property via inline style on wrapper
  const id=`pyr-${wBase}`, cx=wBase/2, bY=hBase;
  return (
    <div className="pyramid-svg-wrap" style={{
      '--pyr-w': `${wBase}px`,
      '--pyr-h': `${hBase}px`,
      transformOrigin:'bottom center',
      transform:risen?'scaleY(1)':'scaleY(0)',
      opacity:risen?1:0,
      transition:`transform 0.9s cubic-bezier(0.34,1.1,0.64,1) ${delay}s,opacity 0.55s ease ${delay}s`,
      filter:risen?(centre?`drop-shadow(0 0 ${18*glow}px rgba(201,168,76,0.55)) drop-shadow(0 -6px 22px rgba(201,168,76,0.18))`:`drop-shadow(0 0 ${10*glow}px rgba(201,168,76,0.28))`):'none',
      animation:risen&&centre?'pyr-glow 3.8s ease-in-out infinite':'none',
    } as React.CSSProperties}>
      <svg
        width={wBase} height={hBase}
        viewBox={`0 0 ${wBase} ${hBase}`}
        fill="none"
        style={{display:'block',overflow:'visible',width:'var(--pyr-display-w,100%)',height:'auto'}}
      >
        <defs>
          <linearGradient id={`${id}-L`} x1={cx} y1={0} x2={0} y2={bY} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E8D48A" stopOpacity="0.95"/><stop offset="55%" stopColor="#C9A84C" stopOpacity="0.88"/><stop offset="100%" stopColor="#8B6914" stopOpacity="0.72"/>
          </linearGradient>
          <linearGradient id={`${id}-R`} x1={cx} y1={0} x2={wBase} y2={bY} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.78"/><stop offset="45%" stopColor="#7A5C1A" stopOpacity="0.68"/><stop offset="100%" stopColor="#3A2C0A" stopOpacity="0.82"/>
          </linearGradient>
          <radialGradient id={`${id}-cap`} cx="50%" cy="0%" r="35%">
            <stop offset="0%" stopColor="#FFFCF0" stopOpacity="1"/><stop offset="100%" stopColor="#E8D48A" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <ellipse cx={cx} cy={bY+5} rx={wBase*0.44} ry={7} fill="rgba(0,0,0,0.38)"/>
        <polygon points={`${cx},0 0,${bY} ${cx},${bY}`} fill={`url(#${id}-L)`}/>
        <polygon points={`${cx},0 ${cx},${bY} ${wBase},${bY}`} fill={`url(#${id}-R)`}/>
        <line x1={cx} y1={0} x2={0}    y2={bY} stroke="rgba(232,212,138,0.38)" strokeWidth="0.6"/>
        <line x1={cx} y1={0} x2={wBase} y2={bY} stroke="rgba(201,168,76,0.22)"  strokeWidth="0.6"/>
        <line x1={cx} y1={0} x2={cx}   y2={bY} stroke="rgba(232,212,138,0.48)" strokeWidth="0.7"/>
        <line x1={0}  y1={bY} x2={wBase} y2={bY} stroke="rgba(201,168,76,0.48)" strokeWidth="0.9"/>
        {Array.from({length:7}).map((_,i)=>{const t=(i+1)/8,y=t*bY,lx=cx-(cx*t),rx=cx+(cx*t);return <line key={i} x1={lx} y1={y} x2={rx} y2={y} stroke="rgba(201,168,76,0.1)" strokeWidth="0.5"/>;  })}
        {centre&&<circle cx={cx} cy={3} r={wBase*0.058} fill={`url(#${id}-cap)`} style={{animation:risen?`cap-flash 0.7s cubic-bezier(0.34,1.56,0.64,1) ${delay+0.55}s both`:'none'}}/>}
      </svg>
      <style>{`
        .pyramid-svg-wrap { display: inline-block; }
        .pyramid-svg-wrap svg { width: var(--pyr-w); height: auto; }
        @media (max-width: 480px) {
          .pyramid-svg-wrap svg { width: calc(var(--pyr-w) * 0.52); }
        }
        @media (min-width: 481px) and (max-width: 768px) {
          .pyramid-svg-wrap svg { width: calc(var(--pyr-w) * 0.72); }
        }
      `}</style>
    </div>
  );
}

/* ── HOTEL PANEL CARD ── */
function HotelPanelCard({hotel}:{hotel:Hotel}) {
  return (
    <div className="hotel-panel-grid">
      <div className="hotel-panel-img">
        <img src={hotel.image} alt={hotel.name} style={{width:'100%',height:'100%',objectFit:'cover',minHeight:160,display:'block'}}/>
      </div>
      <div className="hotel-panel-body">
        <div>
          <div style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.56rem',fontWeight:700,letterSpacing:'0.25em',textTransform:'uppercase',color:'var(--gold)',marginBottom:5}}>{'★'.repeat(hotel.stars)} · {hotel.location}</div>
          <h3 className="font-heading" style={{fontSize:'1.2rem',fontWeight:500,color:'#fff',marginBottom:7}}>{hotel.name}</h3>
          <p style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.78rem',color:'var(--sand-3)',lineHeight:1.6,marginBottom:10}}>{hotel.description.slice(0,120)}…</p>
          <div style={{fontFamily:'var(--font-cormorant),"Cormorant Garamond",serif',fontSize:'0.86rem',fontStyle:'italic',color:'var(--sand-2)',marginBottom:14}}>"{hotel.viewDescription}"</div>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
          <div>
            <span style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.6rem',color:'var(--sand-3)'}}>from </span>
            <span style={{fontFamily:'var(--font-playfair),"Playfair Display",serif',fontSize:'1.4rem',fontWeight:700,color:'var(--gold)'}}>${hotel.basePrice}</span>
            <span style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.6rem',color:'var(--sand-3)'}}>/night</span>
          </div>
          <a href="/hotels" className="btn-secondary" style={{textDecoration:'none',padding:'8px 18px',fontSize:'0.62rem'}}>View Rooms →</a>
        </div>
      </div>
    </div>
  );
}

/* ── SUCCESS ── */
function SuccessCard({tour,dest,onBack}:{tour:AgencyTour|null;dest:string;onBack:()=>void}) {
  return (
    <div style={{textAlign:'center',padding:'44px 20px',background:'rgba(255,255,255,0.025)',border:'1px solid rgba(201,168,76,0.25)'}}>
      <div style={{fontSize:'2.8rem',marginBottom:14}}>✅</div>
      <h3 className="font-heading" style={{fontSize:'1.5rem',color:'var(--gold)',fontWeight:500,marginBottom:7}}>Request Sent!</h3>
      <p style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.85rem',color:'var(--sand-2)',lineHeight:1.7,marginBottom:24}}>
        Your reservation for <strong style={{color:'#fff'}}>{tour?.title}</strong> in <strong style={{color:'#fff'}}>{dest}</strong> was sent via WhatsApp. Our team confirms within 2 hours.
      </p>
      <button onClick={onBack} className="btn-secondary" style={{cursor:'pointer',fontSize:'0.68rem'}}>← Explore More Tours</button>
    </div>
  );
}

/* ── FIELD ── */
function Field({label,type,value,onChange,placeholder,required}:{label:string;type:string;value:string;onChange:(v:string)=>void;placeholder?:string;required?:boolean}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} required={required} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={inputStyle}/>
    </div>
  );
}

/* ── SEARCH CELL ── */
function SearchCell({icon,label,children}:{icon:string;label:string;children:React.ReactNode}) {
  return (
    <div style={{flex:1,minWidth:0,padding:'10px 14px',display:'flex',flexDirection:'column',justifyContent:'center',gap:4}}>
      <div style={{display:'flex',alignItems:'center',gap:5}}>
        <span style={{fontSize:'0.72rem'}}>{icon}</span>
        <span style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.52rem',fontWeight:700,letterSpacing:'0.22em',textTransform:'uppercase',color:'rgba(201,168,76,0.85)'}}>{label}</span>
      </div>
      {children}
    </div>
  );
}

const searchInputStyle: React.CSSProperties = {
  background:'transparent', border:'none', outline:'none',
  color:'#F5E6C8', fontFamily:'var(--font-inter),Inter,sans-serif',
  fontSize:'0.82rem', width:'100%', padding:0,
};
const searchSelectStyle: React.CSSProperties = {
  background:'#0d0b06', border:'none', outline:'none',
  color:'#F5E6C8', fontFamily:'var(--font-inter),Inter,sans-serif',
  fontSize:'0.82rem', width:'100%', padding:'2px 28px 2px 0', cursor:'pointer',
  backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23C9A84C' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
  backgroundRepeat:'no-repeat', backgroundPosition:'right 4px center',
  WebkitAppearance:'none', MozAppearance:'none', appearance:'none' as const,
};
const labelStyle: React.CSSProperties = {
  display:'block', fontFamily:'var(--font-inter),Inter,sans-serif',
  fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.18em',
  textTransform:'uppercase', color:'#D4C4A0', marginBottom:6,
};
const inputStyle: React.CSSProperties = {
  width:'100%', background:'rgba(18,14,8,0.82)',
  border:'1px solid rgba(201,168,76,0.28)', color:'#F5E6C8',
  padding:'10px 13px', fontFamily:'var(--font-inter),Inter,sans-serif',
  fontSize:'0.83rem', outline:'none', transition:'border-color 0.25s ease',
};
const backBtnStyle: React.CSSProperties = {
  background:'none', border:'none', cursor:'pointer',
  fontFamily:'var(--font-inter),Inter,sans-serif',
  fontSize:'0.63rem', fontWeight:700, letterSpacing:'0.15em',
  textTransform:'uppercase', color:'var(--sand-3)',
  marginBottom:26, display:'flex', alignItems:'center', gap:6, padding:0,
};

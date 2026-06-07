'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { topDestinations, featuredTours, featuredHotels } from '../data/agencyData';
import type { AgencyTour, Hotel } from '../data/agencyData';

/* each destination maps to a primary tour id */
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
  /* active tour shown in destination panel — starts with that dest's primary tour */
  const [activeTour,  setActiveTour]  = useState<AgencyTour>(featuredTours[0]);
  const [reserveTour, setReserveTour] = useState<AgencyTour|null>(null);
  const [submitted,   setSubmitted]   = useState(false);
  const [search, setSearch] = useState<SearchState>({ from:'', to:'', activity:'All Activities', duration:'1 - 1 Days' });
  const [form, setForm] = useState<ReserveForm>({
    name:'', email:'', phone:'', date:'', guests:'2', notes:'', fromCountry:'', fromCity:'',
  });
  const autoRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const topRef  = useRef<HTMLDivElement>(null);

  /* ── animation phases ── */
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
    <section id="home" ref={topRef} style={{
      position:'relative', minHeight:'100vh', overflow:'hidden',
      background:'#0a0a0a', display:'flex', flexDirection:'column',
    }}>

      {/* ── BG PHOTO ── */}
      <div style={{
        position:'absolute', inset:0, zIndex:0,
        backgroundImage:"url('https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1800&q=80&fit=crop')",
        backgroundSize:'cover', backgroundPosition:'center 38%',
        opacity:phase>=1?(view!=='hero'?0.12:0.42):0,
        transition:'opacity 1.8s ease',
        filter:view!=='hero'?'blur(3px)':'none',
      }}/>
      <div style={{position:'absolute',inset:0,zIndex:1,background:'linear-gradient(to bottom,rgba(10,10,10,0.62) 0%,rgba(10,10,10,0.18) 38%,rgba(10,10,10,0.65) 72%,#0a0a0a 100%)'}}/>
      <div style={{position:'absolute',inset:0,zIndex:1,background:'radial-gradient(ellipse 65% 36% at 50% 84%,rgba(201,168,76,0.13) 0%,transparent 70%)',opacity:phase>=4?1:0,transition:'opacity 1.4s ease'}}/>

      {/* ── STARS ── */}
      <div style={{position:'absolute',inset:0,zIndex:1,pointerEvents:'none'}}>
        {[{t:'7%',l:'9%',s:1.5},{t:'12%',l:'28%',s:1.0},{t:'5%',l:'52%',s:1.6},
          {t:'16%',l:'71%',s:1.1},{t:'8%',l:'87%',s:0.9},{t:'21%',l:'4%',s:1.2},
          {t:'3%',l:'64%',s:1.4},{t:'25%',l:'42%',s:0.8}].map((st,i)=>(
          <div key={i} style={{position:'absolute',top:st.t,left:st.l,width:st.s,height:st.s,borderRadius:'50%',
            background:'rgba(223,202,125,0.75)',boxShadow:`0 0 ${st.s*3}px rgba(223,202,125,0.5)`,
            opacity:phase>=1?0.8:0,transition:`opacity ${1+i*0.12}s ease ${i*0.08}s`}}/>
        ))}
      </div>

      {/* ══════════════════════════════════════
          HERO VIEW
      ══════════════════════════════════════ */}
      <div style={{
        position:'relative', zIndex:10, flex:1,
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        minHeight:'100vh', paddingBottom:56,
        opacity:view==='hero'?1:0,
        pointerEvents:view==='hero'?'auto':'none',
        transition:'opacity 0.45s ease',
      }}>

        {/* Pyramid scene — lower position */}
        <div style={{
          position:'absolute', bottom:'14%', left:'50%', transform:'translateX(-50%)',
          width:'min(860px,96vw)', display:'flex', alignItems:'flex-end',
          justifyContent:'center', gap:'min(26px,2.5vw)',
          pointerEvents:'none', zIndex:2,
        }}>
          <PyramidSVG w={185} h={240} risen={phase>=2} delay={0}    glow={0.45}/>
          <PyramidSVG w={270} h={350} risen={phase>=3} delay={0.13} glow={1} centre/>
          <PyramidSVG w={185} h={240} risen={phase>=2} delay={0.06} glow={0.45}/>
        </div>

        {/* sand horizon */}
        <div style={{position:'absolute',bottom:'12%',left:0,right:0,height:1,zIndex:3,
          background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.55) 20%,rgba(201,168,76,0.85) 50%,rgba(201,168,76,0.55) 80%,transparent)',
          opacity:phase>=2?1:0,transition:'opacity 0.8s ease 0.3s'}}/>

        {/* ── BRAND GRAPHIC — positioned lower, smaller ── */}
        <div style={{
          position:'relative', zIndex:5, textAlign:'center', userSelect:'none',
          /* push it DOWN toward the pyramid bases */
          marginBottom:'calc(14% + 20px)',
          opacity:phase>=4?1:0,
          transform:phase>=4?'translateY(0) scale(1)':'translateY(28px) scale(0.9)',
          transition:'all 1s cubic-bezier(0.22,1,0.36,1)',
        }}>
          {/* ornament rule */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:14,marginBottom:10,opacity:phase>=4?1:0,transition:'opacity 0.8s ease 0.2s'}}>
            <div style={{width:44,height:1,background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.5))'}}/>
            <span style={{color:'rgba(201,168,76,0.6)',fontSize:7,letterSpacing:3}}>◆◆◆</span>
            <div style={{width:44,height:1,background:'linear-gradient(90deg,rgba(201,168,76,0.5),transparent)'}}/>
          </div>

          {/* eyebrow */}
          <div style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'clamp(0.44rem,0.9vw,0.58rem)',fontWeight:700,letterSpacing:'0.45em',textTransform:'uppercase',color:'rgba(201,168,76,0.6)',marginBottom:8,opacity:phase>=4?1:0,transition:'opacity 0.7s ease 0.3s'}}>
            Luxury Egypt Travel · Est. 2005
          </div>

          {/* BLACK PYRAMIDS — smaller than before */}
          <div style={{
            fontFamily:'var(--font-playfair),"Playfair Display",Georgia,serif',
            fontSize:'clamp(1.9rem,6.5vw,4.8rem)', fontWeight:400,
            letterSpacing:'0.07em', textTransform:'uppercase', lineHeight:0.94,
            background:'linear-gradient(140deg,#8B6914 0%,#DFCA7D 38%,#C9A84C 55%,#9B7D2F 80%,#E8D48A 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            filter:'drop-shadow(0 2px 16px rgba(201,168,76,0.42))',
            animation:phase>=4?'brand-shimmer 4.5s ease-in-out infinite':'none',
          }}>Black Pyramids</div>

          {/* TOURS */}
          <div style={{
            fontFamily:'var(--font-playfair),"Playfair Display",Georgia,serif',
            fontSize:'clamp(1.9rem,6.5vw,4.8rem)', fontWeight:400,
            letterSpacing:'0.07em', textTransform:'uppercase', lineHeight:1.0,
            color:'#fff', textShadow:'0 2px 36px rgba(0,0,0,1),0 0 70px rgba(0,0,0,0.95)',
            marginBottom:10,
          }}>Tours</div>

          {/* tagline */}
          <div style={{fontFamily:'var(--font-cormorant),"Cormorant Garamond",serif',fontSize:'clamp(0.78rem,1.5vw,1rem)',fontStyle:'italic',color:'rgba(245,230,200,0.6)',letterSpacing:'0.04em',marginBottom:20,opacity:phase>=5?1:0,transition:'opacity 0.8s ease 0.1s'}}>
            Hotel Reservations · Private Tours · Luxury Transportation
          </div>

          {/* CTA */}
          <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:12,marginBottom:16,opacity:phase>=5?1:0,transform:phase>=5?'translateY(0)':'translateY(12px)',transition:'all 0.7s cubic-bezier(0.22,1,0.36,1) 0.22s'}}>
            <a href="#tours" className="btn-primary" style={{textDecoration:'none',padding:'12px 28px',fontSize:'0.72rem'}}>Explore Tours</a>
            <a href="#hotels" className="btn-secondary" style={{textDecoration:'none',padding:'11px 28px',fontSize:'0.72rem'}}>Book Hotels</a>
          </div>
        </div>

        {/* ── SEARCH BAR ── */}
        <div style={{
          position:'absolute', bottom:'calc(12% + 8px)', left:'50%', transform:'translateX(-50%)',
          width:'min(960px,94vw)', zIndex:10,
          opacity:phase>=6?1:0,
          translateY:phase>=6?0:10,
          transition:'all 0.7s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <div style={{
            background:'rgba(8,8,8,0.88)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
            border:'1px solid rgba(201,168,76,0.28)', display:'flex', alignItems:'stretch',
            flexWrap:'wrap',
          }}>
            {/* FROM country */}
            <SearchCell icon="✈️" label="From" flex={1.3}>
              <input value={search.from} onChange={e=>setSearch(s=>({...s,from:e.target.value}))}
                placeholder="Country of departure" style={searchInputStyle}/>
            </SearchCell>
            <div style={dividerStyle}/>
            {/* TO destination */}
            <SearchCell icon="📍" label="Destination" flex={1.3}>
              <input value={search.to} onChange={e=>setSearch(s=>({...s,to:e.target.value}))}
                placeholder="e.g. Cairo, Luxor, Aswan" style={searchInputStyle}/>
            </SearchCell>
            <div style={dividerStyle}/>
            {/* Activity */}
            <SearchCell icon="🔺" label="Activity" flex={1.1}>
              <select value={search.activity} onChange={e=>setSearch(s=>({...s,activity:e.target.value}))} style={searchInputStyle}>
                {ACTIVITIES.map(a=><option key={a} value={a}>{a}</option>)}
              </select>
            </SearchCell>
            <div style={dividerStyle}/>
            {/* Duration */}
            <SearchCell icon="⏱" label="Duration" flex={1.0}>
              <select value={search.duration} onChange={e=>setSearch(s=>({...s,duration:e.target.value}))} style={searchInputStyle}>
                {DURATIONS.map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </SearchCell>
            {/* Search btn */}
            <button
              onClick={()=>{
                const idx = topDestinations.findIndex(d=>d.name.toLowerCase().includes(search.to.toLowerCase()));
                if(idx>=0) pickDest(idx);
                else if(topDestinations.length>0) pickDest(0);
              }}
              style={{
                background:'linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold-light))',
                border:'none', cursor:'pointer', padding:'0 28px',
                fontFamily:'var(--font-inter),Inter,sans-serif',
                fontSize:'0.65rem', fontWeight:800,
                letterSpacing:'0.18em', textTransform:'uppercase',
                color:'#0a0a0a', flexShrink:0,
                transition:'filter 0.2s ease',
                minWidth:90,
              }}
              onMouseEnter={e=>(e.currentTarget.style.filter='brightness(1.08)')}
              onMouseLeave={e=>(e.currentTarget.style.filter='none')}
            >Search</button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          DESTINATION PANEL
          Shows the specific tour for that destination.
          Tour tabs at top let user switch to any other tour.
      ══════════════════════════════════════ */}
      <div style={{
        position:'absolute', inset:0, zIndex:20,
        opacity:view==='destination'?1:0,
        transform:view==='destination'?'translateY(0)':'translateY(60px)',
        pointerEvents:view==='destination'?'auto':'none',
        transition:'all 0.55s cubic-bezier(0.22,1,0.36,1)',
        overflowY:'auto',
      }}>
        <div style={{position:'absolute',inset:0,background:'rgba(10,10,10,0.92)',zIndex:0}}/>
        <div style={{position:'relative',zIndex:1,maxWidth:1100,margin:'0 auto',padding:'96px 24px 80px'}}>

          {/* back */}
          <button onClick={backToHero} style={backBtnStyle}>← Back to Home</button>

          {/* destination header */}
          <div style={{display:'flex',alignItems:'flex-end',gap:16,marginBottom:6}}>
            <span style={{fontSize:'clamp(1.8rem,5vw,3rem)'}}>{activeDest.emoji}</span>
            <div>
              <div style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.3em',textTransform:'uppercase',color:'var(--gold)'}}>Destination</div>
              <h2 className="font-heading" style={{fontSize:'clamp(1.6rem,4.5vw,2.8rem)',fontWeight:400,color:'#fff',lineHeight:1.1,margin:0}}>{activeDest.name}</h2>
            </div>
          </div>
          <p style={{fontFamily:'var(--font-cormorant),"Cormorant Garamond",serif',fontSize:'clamp(0.9rem,1.6vw,1.1rem)',fontStyle:'italic',color:'var(--sand-2)',marginBottom:28,lineHeight:1.6}}>{activeDest.tagline}</p>

          {/* ── ALL-TOURS TAB BAR — switch between any tour ── */}
          <div style={{marginBottom:28}}>
            <div style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.56rem',fontWeight:700,letterSpacing:'0.26em',textTransform:'uppercase',color:'var(--gold)',marginBottom:10}}>Browse All Tours</div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {featuredTours.map(t=>{
                const isActive = t.id === activeTour.id;
                return (
                  <button key={t.id} onClick={()=>switchTour(t)} style={{
                    fontFamily:'var(--font-inter),Inter,sans-serif',
                    fontSize:'0.6rem', fontWeight:700,
                    letterSpacing:'0.1em', textTransform:'uppercase',
                    padding:'7px 14px', cursor:'pointer',
                    background: isActive ? 'var(--gold)' : 'rgba(255,255,255,0.04)',
                    border: isActive ? '1px solid var(--gold)' : '1px solid rgba(201,168,76,0.22)',
                    color: isActive ? '#0a0a0a' : 'var(--sand-3)',
                    transition:'all 0.2s ease',
                    whiteSpace:'nowrap',
                  }}>
                    {t.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── ACTIVE TOUR DETAIL ── */}
          <div style={{display:'grid',gridTemplateColumns:'min(340px,45%) 1fr',gap:0,border:'1px solid rgba(201,168,76,0.22)',overflow:'hidden',marginBottom:36}}>
            {/* image */}
            <div style={{overflow:'hidden',position:'relative',minHeight:260}}>
              <img src={activeTour.image} alt={activeTour.title} style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0}}/>
              <div style={{position:'absolute',top:12,left:12,background:'rgba(201,168,76,0.92)',color:'#0a0a0a',fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.68rem',fontWeight:800,padding:'4px 10px'}}>from ${activeTour.price}</div>
            </div>
            {/* detail */}
            <div style={{padding:'28px 28px 24px',background:'rgba(255,255,255,0.025)'}}>
              <div style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.22em',textTransform:'uppercase',color:'var(--gold)',marginBottom:6}}>{activeTour.duration} · {activeTour.difficulty}</div>
              <h3 className="font-heading" style={{fontSize:'clamp(1.3rem,2.5vw,1.8rem)',fontWeight:500,color:'#fff',marginBottom:10,lineHeight:1.2}}>{activeTour.title}</h3>
              <p style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.82rem',color:'var(--sand-3)',lineHeight:1.65,marginBottom:16}}>{activeTour.description}</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:20}}>
                {activeTour.included.map(inc=>(
                  <span key={inc} style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.6rem',fontWeight:600,color:'var(--sand-3)',background:'rgba(201,168,76,0.08)',border:'1px solid rgba(201,168,76,0.18)',padding:'4px 10px'}}>✓ {inc}</span>
                ))}
              </div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
                <div style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.72rem',color:'var(--gold)'}}>
                  ★ {activeTour.rating} <span style={{color:'var(--sand-3)'}}>({activeTour.reviewsCount} reviews)</span>
                </div>
                <button onClick={()=>openReserve(activeTour)} className="btn-primary" style={{padding:'11px 24px',fontSize:'0.68rem',cursor:'pointer'}}>
                  Reserve This Tour →
                </button>
              </div>
            </div>
          </div>

          {/* ── RECOMMENDED HOTEL ── */}
          {destHotel && (
            <>
              <div style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.26em',textTransform:'uppercase',color:'var(--gold)',marginBottom:10}}>Recommended Hotel</div>
              <HotelPanelCard hotel={destHotel}/>
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
          RESERVATION PANEL
      ══════════════════════════════════════ */}
      <div style={{
        position:'absolute', inset:0, zIndex:30,
        opacity:view==='reserve'?1:0,
        transform:view==='reserve'?'translateY(0)':'translateY(60px)',
        pointerEvents:view==='reserve'?'auto':'none',
        transition:'all 0.5s cubic-bezier(0.22,1,0.36,1)',
        overflowY:'auto', background:'rgba(10,10,10,0.98)',
      }}>
        <div style={{maxWidth:700,margin:'0 auto',padding:'96px 24px 60px'}}>
          <button onClick={backToDest} style={backBtnStyle}>← Back to {activeDest.name}</button>

          {/* tour summary banner */}
          <div style={{display:'flex',gap:0,alignItems:'stretch',border:'1px solid rgba(201,168,76,0.22)',overflow:'hidden',marginBottom:28}}>
            <div style={{width:110,flexShrink:0}}>
              <img src={reserveTour?.image} alt={reserveTour?.title} style={{width:'100%',height:'100%',objectFit:'cover',minHeight:85}}/>
            </div>
            <div style={{padding:'14px 18px',flex:1}}>
              <div style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.56rem',fontWeight:700,letterSpacing:'0.24em',textTransform:'uppercase',color:'var(--gold)',marginBottom:4}}>{activeDest.emoji} {activeDest.name} · {reserveTour?.duration}</div>
              <div className="font-heading" style={{fontSize:'1.15rem',fontWeight:500,color:'#fff',marginBottom:3}}>{reserveTour?.title}</div>
              <div style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.72rem',color:'var(--gold)',fontWeight:700}}>
                from ${reserveTour?.price} <span style={{color:'var(--sand-3)',fontWeight:400}}>/ person  ·  ★ {reserveTour?.rating}</span>
              </div>
            </div>
          </div>

          <div style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.3em',textTransform:'uppercase',color:'var(--gold)',marginBottom:18,textAlign:'center'}}>
            Reserve Your Experience
          </div>

          {submitted ? (
            <SuccessCard tour={reserveTour} dest={activeDest.name} onBack={backToDest}/>
          ) : (
            <form onSubmit={handleSubmit} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(201,168,76,0.18)',padding:'28px 26px'}}>

              {/* world banner */}
              <div style={{background:'rgba(201,168,76,0.07)',border:'1px solid rgba(201,168,76,0.2)',padding:'12px 14px',marginBottom:20,display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontSize:'1rem'}}>🌍</span>
                <span style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.66rem',color:'var(--sand-2)',lineHeight:1.5}}>
                  <strong style={{color:'var(--gold)'}}>Book from anywhere in the world.</strong>{' '}We handle airport transfers, flights advice & full Egypt support from your country.
                </span>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13,marginBottom:14}}>
                <Field label="Your Country *" type="text" value={form.fromCountry} onChange={v=>setForm(f=>({...f,fromCountry:v}))} placeholder="e.g. United States" required/>
                <Field label="City / Airport *" type="text" value={form.fromCity} onChange={v=>setForm(f=>({...f,fromCity:v}))} placeholder="e.g. New York (JFK)" required/>
              </div>
              <div style={{height:1,background:'rgba(201,168,76,0.12)',marginBottom:16}}/>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13,marginBottom:14}}>
                <Field label="Full Name *" type="text" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="Your full name" required/>
                <Field label="Email *" type="email" value={form.email} onChange={v=>setForm(f=>({...f,email:v}))} placeholder="your@email.com" required/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13,marginBottom:14}}>
                <Field label="Phone / WhatsApp *" type="tel" value={form.phone} onChange={v=>setForm(f=>({...f,phone:v}))} placeholder="+1 000 000 0000" required/>
                <Field label="Preferred Date *" type="date" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))} required/>
              </div>
              <div style={{marginBottom:14}}>
                <label style={labelStyle}>Guests</label>
                <select value={form.guests} onChange={e=>setForm(f=>({...f,guests:e.target.value}))} style={inputStyle}>
                  {['1','2','3','4','5','6','7','8+'].map(n=>(<option key={n} value={n}>{n} {parseInt(n)===1?'Guest':'Guests'}</option>))}
                </select>
              </div>
              <div style={{marginBottom:22}}>
                <label style={labelStyle}>Special Requests</label>
                <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={3}
                  placeholder="Dietary needs, accessibility, special occasions..."
                  style={{...inputStyle,resize:'vertical',minHeight:72}}/>
              </div>
              <div style={{background:'rgba(201,168,76,0.05)',border:'1px solid rgba(201,168,76,0.13)',padding:'11px 14px',marginBottom:20,display:'flex',gap:8,alignItems:'flex-start'}}>
                <span style={{color:'var(--gold)',fontSize:'0.82rem',flexShrink:0}}>ℹ️</span>
                <span style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.66rem',color:'var(--sand-3)',lineHeight:1.6}}>
                  Opens WhatsApp with your details pre-filled. Our team responds within 2 hours.
                </span>
              </div>
              <button type="submit" className="btn-primary" style={{width:'100%',textAlign:'center',cursor:'pointer',fontSize:'0.72rem'}}>
                Confirm via WhatsApp →
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
          DESTINATION STRIP
      ══════════════════════════════════════ */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, zIndex:40,
        transform:phase>=6?'translateY(0)':'translateY(100%)',
        transition:'transform 0.75s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <div style={{height:2,background:'rgba(201,168,76,0.1)',overflow:'hidden'}}>
          <div style={{height:'100%',background:'linear-gradient(90deg,var(--gold-dark),var(--gold-light))',width:`${((destIdx+1)/topDestinations.length)*100}%`,transition:'width 0.5s ease'}}/>
        </div>
        <div style={{background:'rgba(8,8,8,0.92)',backdropFilter:'blur(22px)',WebkitBackdropFilter:'blur(22px)',borderTop:'1px solid rgba(201,168,76,0.18)'}}>
          <div style={{maxWidth:1280,margin:'0 auto',padding:'0 16px',display:'flex',alignItems:'center',overflowX:'auto',scrollbarWidth:'none'}}>
            <span style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.22em',textTransform:'uppercase',color:'var(--gold)',whiteSpace:'nowrap',paddingRight:14,flexShrink:0,borderRight:'1px solid rgba(201,168,76,0.18)',lineHeight:'50px'}}>Destinations</span>
            {topDestinations.map((d,i)=>{
              const active=i===destIdx;
              return (
                <button key={d.id} onClick={()=>pickDest(i)} style={{
                  background:'none',border:'none',cursor:'pointer',padding:'0 13px',height:50,
                  display:'flex',alignItems:'center',gap:6,flexShrink:0,
                  borderBottom:active?'2px solid var(--gold)':'2px solid transparent',
                  color:active?'var(--gold)':'var(--sand-3)',transition:'all 0.22s ease',
                }}>
                  <span style={{fontSize:'0.84rem'}}>{d.emoji}</span>
                  <span style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.11em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{d.name}</span>
                </button>
              );
            })}
            <a href="/destinations" style={{marginLeft:'auto',flexShrink:0,fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',textDecoration:'none',padding:'0 0 0 14px',borderLeft:'1px solid rgba(201,168,76,0.18)',lineHeight:'50px',whiteSpace:'nowrap'}}>All →</a>
          </div>
        </div>
      </div>

      {/* scroll caret */}
      <div className="anim-scroll" style={{position:'absolute',bottom:62,left:'50%',transform:'translateX(-50%)',zIndex:10,opacity:0.38,display:view==='hero'?'block':'none'}}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>

      <style>{`
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
        div::-webkit-scrollbar{ display:none; }
      `}</style>
    </section>
  );
}

/* ── PYRAMID SVG ── */
function PyramidSVG({w,h,risen,delay,glow,centre}:{w:number;h:number;risen:boolean;delay:number;glow:number;centre?:boolean}) {
  const id=`pyr-${w}`,cx=w/2,bY=h;
  return (
    <div style={{transformOrigin:'bottom center',transform:risen?'scaleY(1)':'scaleY(0)',opacity:risen?1:0,
      transition:`transform 0.9s cubic-bezier(0.34,1.1,0.64,1) ${delay}s,opacity 0.55s ease ${delay}s`,
      filter:risen?(centre?`drop-shadow(0 0 ${18*glow}px rgba(201,168,76,0.55)) drop-shadow(0 -6px 22px rgba(201,168,76,0.18))`:`drop-shadow(0 0 ${10*glow}px rgba(201,168,76,0.28))`):'none',
      animation:risen&&centre?'pyr-glow 3.8s ease-in-out infinite':'none'}}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" style={{display:'block',overflow:'visible'}}>
        <defs>
          <linearGradient id={`${id}-L`} x1={cx} y1={0} x2={0} y2={bY} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E8D48A" stopOpacity="0.95"/><stop offset="55%" stopColor="#C9A84C" stopOpacity="0.88"/><stop offset="100%" stopColor="#8B6914" stopOpacity="0.72"/>
          </linearGradient>
          <linearGradient id={`${id}-R`} x1={cx} y1={0} x2={w} y2={bY} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.78"/><stop offset="45%" stopColor="#7A5C1A" stopOpacity="0.68"/><stop offset="100%" stopColor="#3A2C0A" stopOpacity="0.82"/>
          </linearGradient>
          <radialGradient id={`${id}-cap`} cx="50%" cy="0%" r="35%">
            <stop offset="0%" stopColor="#FFFCF0" stopOpacity="1"/><stop offset="100%" stopColor="#E8D48A" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <ellipse cx={cx} cy={bY+5} rx={w*0.44} ry={7} fill="rgba(0,0,0,0.38)"/>
        <polygon points={`${cx},0 0,${bY} ${cx},${bY}`} fill={`url(#${id}-L)`}/>
        <polygon points={`${cx},0 ${cx},${bY} ${w},${bY}`} fill={`url(#${id}-R)`}/>
        <line x1={cx} y1={0} x2={0}  y2={bY} stroke="rgba(232,212,138,0.38)" strokeWidth="0.6"/>
        <line x1={cx} y1={0} x2={w}  y2={bY} stroke="rgba(201,168,76,0.22)"  strokeWidth="0.6"/>
        <line x1={cx} y1={0} x2={cx} y2={bY} stroke="rgba(232,212,138,0.48)" strokeWidth="0.7"/>
        <line x1={0}  y1={bY} x2={w} y2={bY} stroke="rgba(201,168,76,0.48)"  strokeWidth="0.9"/>
        {Array.from({length:7}).map((_,i)=>{const t=(i+1)/8,y=t*bY,lx=cx-(cx*t),rx=cx+(cx*t);return <line key={i} x1={lx} y1={y} x2={rx} y2={y} stroke="rgba(201,168,76,0.1)" strokeWidth="0.5"/>;  })}
        {centre&&<circle cx={cx} cy={3} r={w*0.058} fill={`url(#${id}-cap)`} style={{animation:risen?`cap-flash 0.7s cubic-bezier(0.34,1.56,0.64,1) ${delay+0.55}s both`:'none'}}/>}
      </svg>
    </div>
  );
}

/* ── HOTEL PANEL CARD ── */
function HotelPanelCard({hotel}:{hotel:Hotel}) {
  return (
    <div style={{display:'grid',gridTemplateColumns:'min(240px,36%) 1fr',border:'1px solid rgba(201,168,76,0.2)',background:'rgba(255,255,255,0.025)',marginBottom:40,overflow:'hidden'}}>
      <div style={{overflow:'hidden'}}><img src={hotel.image} alt={hotel.name} style={{width:'100%',height:'100%',objectFit:'cover',minHeight:180}}/></div>
      <div style={{padding:'22px 24px 20px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
        <div>
          <div style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.56rem',fontWeight:700,letterSpacing:'0.25em',textTransform:'uppercase',color:'var(--gold)',marginBottom:5}}>{'★'.repeat(hotel.stars)} · {hotel.location}</div>
          <h3 className="font-heading" style={{fontSize:'1.3rem',fontWeight:500,color:'#fff',marginBottom:7}}>{hotel.name}</h3>
          <p style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.78rem',color:'var(--sand-3)',lineHeight:1.6,marginBottom:10}}>{hotel.description.slice(0,130)}…</p>
          <div style={{fontFamily:'var(--font-cormorant),"Cormorant Garamond",serif',fontSize:'0.86rem',fontStyle:'italic',color:'var(--sand-2)',marginBottom:14}}>"{hotel.viewDescription}"</div>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
          <div><span style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.6rem',color:'var(--sand-3)'}}>from </span><span style={{fontFamily:'var(--font-playfair),"Playfair Display",serif',fontSize:'1.4rem',fontWeight:700,color:'var(--gold)'}}>${hotel.basePrice}</span><span style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.6rem',color:'var(--sand-3)'}}>/night</span></div>
          <a href="/hotels" className="btn-secondary" style={{textDecoration:'none',padding:'8px 18px',fontSize:'0.62rem'}}>View Rooms →</a>
        </div>
      </div>
    </div>
  );
}

/* ── SUCCESS ── */
function SuccessCard({tour,dest,onBack}:{tour:AgencyTour|null;dest:string;onBack:()=>void}) {
  return (
    <div style={{textAlign:'center',padding:'44px 28px',background:'rgba(255,255,255,0.025)',border:'1px solid rgba(201,168,76,0.25)'}}>
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
function SearchCell({icon,label,flex,children}:{icon:string;label:string;flex:number;children:React.ReactNode}) {
  return (
    <div style={{flex,minWidth:0,padding:'10px 14px',display:'flex',flexDirection:'column',justifyContent:'center',gap:3}}>
      <div style={{display:'flex',alignItems:'center',gap:5}}>
        <span style={{fontSize:'0.72rem'}}>{icon}</span>
        <span style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.54rem',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--gold)'}}>{label}</span>
      </div>
      {children}
    </div>
  );
}

const searchInputStyle: React.CSSProperties = {
  background:'none', border:'none', outline:'none',
  color:'var(--sand)', fontFamily:'var(--font-inter),Inter,sans-serif',
  fontSize:'0.82rem', width:'100%', padding:0,
};
const dividerStyle: React.CSSProperties = {
  width:1, background:'rgba(201,168,76,0.18)', flexShrink:0, margin:'8px 0',
};
const labelStyle: React.CSSProperties = {
  display:'block',fontFamily:'var(--font-inter),Inter,sans-serif',
  fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.18em',
  textTransform:'uppercase',color:'var(--sand-3)',marginBottom:6,
};
const inputStyle: React.CSSProperties = {
  width:'100%',background:'rgba(255,255,255,0.04)',
  border:'1px solid rgba(201,168,76,0.22)',color:'var(--sand)',
  padding:'10px 13px',fontFamily:'var(--font-inter),Inter,sans-serif',
  fontSize:'0.83rem',outline:'none',
};
const backBtnStyle: React.CSSProperties = {
  background:'none',border:'none',cursor:'pointer',
  fontFamily:'var(--font-inter),Inter,sans-serif',
  fontSize:'0.63rem',fontWeight:700,letterSpacing:'0.15em',
  textTransform:'uppercase',color:'var(--sand-3)',
  marginBottom:26,display:'flex',alignItems:'center',gap:6,
  padding:0,
};

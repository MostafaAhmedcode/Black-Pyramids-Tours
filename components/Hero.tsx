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
const F = 'var(--font-inter),Inter,system-ui,sans-serif';

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
    setDestIdx(i); setActiveDest(dest); setActiveTour(primaryTour);
    setView('destination'); setSubmitted(false); startAuto();
    setTimeout(()=>topRef.current?.scrollIntoView({behavior:'smooth',block:'start'}),80);
  };

  const openReserve = (tour: AgencyTour) => {
    setReserveTour(tour); setView('reserve'); setSubmitted(false);
    setForm(f=>({...f,name:'',email:'',phone:'',date:'',notes:'',fromCountry:search.from,fromCity:''}));
  };

  const backToHero = ()=>{ setView('hero'); setSubmitted(false); };
  const backToDest = ()=>{ setView('destination'); setSubmitted(false); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = [
      `Hello Black Pyramids Tours! 🏛️`,``,
      `📌 Tour: ${reserveTour?.title}`,
      `📍 Destination: ${activeDest.name}`,``,
      `🌍 From: ${form.fromCity?form.fromCity+', ':''}${form.fromCountry}`,
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
      position:'relative', minHeight:'100svh', overflow:'hidden',
      background:'#0a0a0a', display:'flex', flexDirection:'column',
    }}>

      {/* ── BG layers ── */}
      <div style={{
        position:'absolute',inset:0,zIndex:0,
        backgroundImage:"url('https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1800&q=80&fit=crop')",
        backgroundSize:'cover',backgroundPosition:'center 38%',
        opacity:phase>=1?(view!=='hero'?0.12:0.42):0,
        transition:'opacity 1.8s ease',
        filter:view!=='hero'?'blur(3px)':'none',
      }}/>
      <div style={{position:'absolute',inset:0,zIndex:1,background:'linear-gradient(to bottom,rgba(10,10,10,0.62) 0%,rgba(10,10,10,0.18) 38%,rgba(10,10,10,0.65) 72%,#0a0a0a 100%)'}}/>
      <div style={{position:'absolute',inset:0,zIndex:1,background:'radial-gradient(ellipse 65% 36% at 50% 84%,rgba(201,168,76,0.13) 0%,transparent 70%)',opacity:phase>=4?1:0,transition:'opacity 1.4s ease'}}/>

      {/* ── Stars ── */}
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
          HERO VIEW — flex column, no absolute positioning for content
      ══════════════════════════════════════ */}
      <div style={{
        position:'relative',zIndex:10,flex:1,
        display:view==='hero'?'flex':'none',
        flexDirection:'column',
        alignItems:'center',
        minHeight:'100svh',
        paddingTop:88, // below navbar
      }}>

        {/* ── Brand text (top portion) ── */}
        <div style={{
          textAlign:'center',userSelect:'none',
          padding:'0 16px',
          zIndex:5,
          opacity:phase>=4?1:0,
          transform:phase>=4?'translateY(0)':'translateY(20px)',
          transition:'all 0.9s cubic-bezier(0.22,1,0.36,1)',
          flexShrink:0,
        }}>          {/* ornament */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:14,marginBottom:8,opacity:phase>=4?1:0,transition:'opacity 0.8s ease 0.2s'}}>
            <div style={{width:40,height:1,background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.5))'}}/>
            <span style={{color:'rgba(201,168,76,0.6)',fontSize:7,letterSpacing:3}}>◆◆◆</span>
            <div style={{width:40,height:1,background:'linear-gradient(90deg,rgba(201,168,76,0.5),transparent)'}}/>
          </div>

          <div style={{fontFamily:F,fontSize:'clamp(0.42rem,1.8vw,0.56rem)',fontWeight:700,letterSpacing:'0.4em',textTransform:'uppercase',color:'rgba(201,168,76,0.6)',marginBottom:6}}>
            Luxury Egypt Travel · Est. 2005
          </div>

          <div style={{
            fontFamily:'var(--font-playfair),"Playfair Display",Georgia,serif',
            fontSize:'clamp(2rem,8vw,4.8rem)',fontWeight:400,
            letterSpacing:'0.07em',textTransform:'uppercase',lineHeight:0.94,
            background:'linear-gradient(140deg,#8B6914 0%,#DFCA7D 38%,#C9A84C 55%,#9B7D2F 80%,#E8D48A 100%)',
            WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
            filter:'drop-shadow(0 2px 16px rgba(201,168,76,0.42))',
            animation:phase>=4?'brand-shimmer 4.5s ease-in-out infinite':'none',
          }}>Black Pyramids</div>

          <div style={{
            fontFamily:'var(--font-playfair),"Playfair Display",Georgia,serif',
            fontSize:'clamp(2rem,8vw,4.8rem)',fontWeight:400,
            letterSpacing:'0.07em',textTransform:'uppercase',lineHeight:1.0,
            color:'#fff',textShadow:'0 2px 36px rgba(0,0,0,1)',marginBottom:8,
          }}>Tours</div>

          <div style={{fontFamily:'var(--font-cormorant),"Cormorant Garamond",serif',fontSize:'clamp(0.7rem,2vw,1rem)',fontStyle:'italic',color:'rgba(245,230,200,0.65)',letterSpacing:'0.03em',marginBottom:16,opacity:phase>=5?1:0,transition:'opacity 0.8s ease 0.1s'}}>
            Hotel Reservations · Private Tours · Luxury Transportation
          </div>

          <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:10,marginBottom:0,opacity:phase>=5?1:0,transform:phase>=5?'translateY(0)':'translateY(12px)',transition:'all 0.7s cubic-bezier(0.22,1,0.36,1) 0.22s'}}>
            <a href="#tours" className="btn-primary" style={{textDecoration:'none',padding:'11px 24px',fontSize:'0.7rem'}}>Explore Tours</a>
            <a href="#hotels" className="btn-secondary" style={{textDecoration:'none',padding:'10px 24px',fontSize:'0.7rem'}}>Book Hotels</a>
          </div>
        </div>

        {/* ── Pyramids (middle — fills remaining space) ── */}
        <div style={{
          position:'relative',zIndex:2,
          width:'100%',
          display:'flex',alignItems:'flex-end',justifyContent:'center',
          gap:'clamp(6px,2vw,26px)',
          pointerEvents:'none',
          flex:1,
          minHeight:160,
          maxHeight:400,
        }}>
          {/* sand horizon line */}
          <div style={{
            position:'absolute',bottom:0,left:0,right:0,height:1,
            background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.55) 20%,rgba(201,168,76,0.85) 50%,rgba(201,168,76,0.55) 80%,transparent)',
            opacity:phase>=2?1:0,transition:'opacity 0.8s ease 0.3s',
          }}/>
          <PyramidSVG wBase={185} hBase={240} risen={phase>=2} delay={0}    glow={0.45}/>
          <PyramidSVG wBase={270} hBase={350} risen={phase>=3} delay={0.13} glow={1} centre/>
          <PyramidSVG wBase={185} hBase={240} risen={phase>=2} delay={0.06} glow={0.45}/>
        </div>

        {/* ── Search bar (below pyramids, in flow) ── */}
        <div style={{
          width:'100%',zIndex:10,
          opacity:phase>=6?1:0,
          transform:phase>=6?'translateY(0)':'translateY(8px)',
          transition:'all 0.7s cubic-bezier(0.22,1,0.36,1)',
          flexShrink:0,
        }}>
          <SearchBar search={search} setSearch={setSearch} onSearch={()=>{
            const idx=topDestinations.findIndex(d=>d.name.toLowerCase().includes(search.to.toLowerCase()));
            pickDest(idx>=0?idx:0);
          }}/>
        </div>
      </div>

      {/* ══════════════════════════════════════
          DESTINATION PANEL
      ══════════════════════════════════════ */}
      <div style={{
        position:'absolute',inset:0,zIndex:20,
        opacity:view==='destination'?1:0,
        transform:view==='destination'?'translateY(0)':'translateY(50px)',
        pointerEvents:view==='destination'?'auto':'none',
        transition:'all 0.5s cubic-bezier(0.22,1,0.36,1)',
        overflowY:'auto',
      }}>
        <div style={{position:'absolute',inset:0,background:'rgba(10,10,10,0.93)',zIndex:0}}/>
        <div style={{position:'relative',zIndex:1,maxWidth:1100,margin:'0 auto',padding:'84px 16px 80px'}}>
          <button onClick={backToHero} style={backBtnStyle}>← Back to Home</button>

          <div style={{display:'flex',alignItems:'flex-end',gap:12,marginBottom:6,flexWrap:'wrap'}}>
            <span style={{fontSize:'clamp(1.6rem,5vw,2.8rem)'}}>{activeDest.emoji}</span>
            <div>
              <div style={{fontFamily:F,fontSize:'0.56rem',fontWeight:700,letterSpacing:'0.3em',textTransform:'uppercase',color:'var(--gold)'}}>Destination</div>
              <h2 className="font-heading" style={{fontSize:'clamp(1.4rem,4.5vw,2.8rem)',fontWeight:400,color:'#fff',lineHeight:1.1,margin:0}}>{activeDest.name}</h2>
            </div>
          </div>
          <p style={{fontFamily:'var(--font-cormorant),"Cormorant Garamond",serif',fontSize:'clamp(0.9rem,1.6vw,1.1rem)',fontStyle:'italic',color:'var(--sand-2)',marginBottom:24,lineHeight:1.6}}>{activeDest.tagline}</p>

          {/* Tour tabs */}
          <div style={{marginBottom:24}}>
            <div style={{fontFamily:F,fontSize:'0.54rem',fontWeight:700,letterSpacing:'0.26em',textTransform:'uppercase',color:'var(--gold)',marginBottom:10}}>Browse All Tours</div>
            <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
              {featuredTours.map(t=>{
                const isActive=t.id===activeTour.id;
                return (
                  <button key={t.id} onClick={()=>setActiveTour(t)} style={{
                    fontFamily:F,fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',
                    padding:'6px 12px',cursor:'pointer',whiteSpace:'nowrap',
                    background:isActive?'var(--gold)':'rgba(255,255,255,0.04)',
                    border:isActive?'1px solid var(--gold)':'1px solid rgba(201,168,76,0.22)',
                    color:isActive?'#0a0a0a':'var(--sand-3)',transition:'all 0.2s ease',
                  }}>{t.title}</button>
                );
              })}
            </div>
          </div>

          {/* Tour detail — responsive grid */}
          <div className="dest-tour-grid">
            <div style={{overflow:'hidden',position:'relative',minHeight:200}}>
              <img src={activeTour.image} alt={activeTour.title} style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0}}/>
              <div style={{position:'absolute',top:10,left:10,background:'rgba(201,168,76,0.92)',color:'#0a0a0a',fontFamily:F,fontSize:'0.65rem',fontWeight:800,padding:'3px 9px'}}>from ${activeTour.price}</div>
            </div>
            <div style={{padding:'20px 18px',background:'rgba(255,255,255,0.025)'}}>
              <div style={{fontFamily:F,fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.22em',textTransform:'uppercase',color:'var(--gold)',marginBottom:5}}>{activeTour.duration} · {activeTour.difficulty}</div>
              <h3 className="font-heading" style={{fontSize:'clamp(1.1rem,2.5vw,1.7rem)',fontWeight:500,color:'#fff',marginBottom:8,lineHeight:1.2}}>{activeTour.title}</h3>
              <p style={{fontFamily:F,fontSize:'0.82rem',color:'var(--sand-3)',lineHeight:1.65,marginBottom:14}}>{activeTour.description}</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:16}}>
                {activeTour.included.map(inc=>(
                  <span key={inc} style={{fontFamily:F,fontSize:'0.58rem',fontWeight:600,color:'var(--sand-3)',background:'rgba(201,168,76,0.08)',border:'1px solid rgba(201,168,76,0.18)',padding:'3px 9px'}}>✓ {inc}</span>
                ))}
              </div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
                <div style={{fontFamily:F,fontSize:'0.72rem',color:'var(--gold)'}}>★ {activeTour.rating} <span style={{color:'var(--sand-3)'}}>({activeTour.reviewsCount} reviews)</span></div>
                <button onClick={()=>openReserve(activeTour)} className="btn-primary" style={{padding:'10px 20px',fontSize:'0.65rem',cursor:'pointer'}}>Reserve This Tour →</button>
              </div>
            </div>
          </div>

          {destHotel && (
            <>
              <div style={{fontFamily:F,fontSize:'0.54rem',fontWeight:700,letterSpacing:'0.26em',textTransform:'uppercase',color:'var(--gold)',marginBottom:10}}>Recommended Hotel</div>
              <HotelPanelCard hotel={destHotel}/>
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
          RESERVATION PANEL
      ══════════════════════════════════════ */}
      <div style={{
        position:'absolute',inset:0,zIndex:30,
        opacity:view==='reserve'?1:0,
        transform:view==='reserve'?'translateY(0)':'translateY(50px)',
        pointerEvents:view==='reserve'?'auto':'none',
        transition:'all 0.5s cubic-bezier(0.22,1,0.36,1)',
        overflowY:'auto',background:'rgba(10,10,10,0.98)',
      }}>
        <div style={{maxWidth:680,margin:'0 auto',padding:'84px 16px 60px'}}>
          <button onClick={backToDest} style={backBtnStyle}>← Back to {activeDest.name}</button>

          <div style={{display:'flex',gap:0,alignItems:'stretch',border:'1px solid rgba(201,168,76,0.22)',overflow:'hidden',marginBottom:24}}>
            <div style={{width:90,flexShrink:0}}>
              <img src={reserveTour?.image} alt={reserveTour?.title} style={{width:'100%',height:'100%',objectFit:'cover',minHeight:80,display:'block'}}/>
            </div>
            <div style={{padding:'12px 14px',flex:1,minWidth:0}}>
              <div style={{fontFamily:F,fontSize:'0.54rem',fontWeight:700,letterSpacing:'0.22em',textTransform:'uppercase',color:'var(--gold)',marginBottom:3}}>{activeDest.emoji} {activeDest.name} · {reserveTour?.duration}</div>
              <div className="font-heading" style={{fontSize:'1rem',fontWeight:500,color:'#fff',marginBottom:2,whiteSpace:'normal'}}>{reserveTour?.title}</div>
              <div style={{fontFamily:F,fontSize:'0.7rem',color:'var(--gold)',fontWeight:700}}>from ${reserveTour?.price} <span style={{color:'var(--sand-3)',fontWeight:400}}>/ person · ★ {reserveTour?.rating}</span></div>
            </div>
          </div>

          <div style={{fontFamily:F,fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.28em',textTransform:'uppercase',color:'var(--gold)',marginBottom:16,textAlign:'center'}}>Reserve Your Experience</div>

          {submitted ? (
            <SuccessCard tour={reserveTour} dest={activeDest.name} onBack={backToDest}/>
          ) : (
            <form onSubmit={handleSubmit} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(201,168,76,0.18)',padding:'20px 16px'}}>
              <div style={{background:'rgba(201,168,76,0.07)',border:'1px solid rgba(201,168,76,0.2)',padding:'10px 12px',marginBottom:18,display:'flex',alignItems:'flex-start',gap:8}}>
                <span style={{fontSize:'1rem',flexShrink:0}}>🌍</span>
                <span style={{fontFamily:F,fontSize:'0.65rem',color:'var(--sand-2)',lineHeight:1.5}}><strong style={{color:'var(--gold)'}}>Book from anywhere in the world.</strong> We handle airport transfers, flights &amp; full Egypt support.</span>
              </div>

              <div className="form-grid-2">
                <Field label="Your Country *" type="text" value={form.fromCountry} onChange={v=>setForm(f=>({...f,fromCountry:v}))} placeholder="e.g. United States" required/>
                <Field label="City / Airport *" type="text" value={form.fromCity} onChange={v=>setForm(f=>({...f,fromCity:v}))} placeholder="e.g. New York (JFK)" required/>
              </div>
              <div style={{height:1,background:'rgba(201,168,76,0.12)',marginBottom:14}}/>
              <div className="form-grid-2">
                <Field label="Full Name *" type="text" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="Your full name" required/>
                <Field label="Email *" type="email" value={form.email} onChange={v=>setForm(f=>({...f,email:v}))} placeholder="your@email.com" required/>
              </div>
              <div className="form-grid-2">
                <Field label="Phone / WhatsApp *" type="tel" value={form.phone} onChange={v=>setForm(f=>({...f,phone:v}))} placeholder="+1 000 000 0000" required/>
                <Field label="Preferred Date *" type="date" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))} required/>
              </div>
              <div style={{marginBottom:12}}>
                <label style={labelStyle}>Guests</label>
                <select value={form.guests} onChange={e=>setForm(f=>({...f,guests:e.target.value}))} style={{...inputStyle,cursor:'pointer'}}>
                  {['1','2','3','4','5','6','7','8+'].map(n=>(<option key={n} value={n}>{n} {parseInt(n)===1?'Guest':'Guests'}</option>))}
                </select>
              </div>
              <div style={{marginBottom:18}}>
                <label style={labelStyle}>Special Requests</label>
                <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={3}
                  placeholder="Dietary needs, accessibility, special occasions…"
                  style={{...inputStyle,resize:'vertical',minHeight:68}}/>
              </div>
              <div style={{background:'rgba(201,168,76,0.05)',border:'1px solid rgba(201,168,76,0.13)',padding:'10px 12px',marginBottom:18,display:'flex',gap:7,alignItems:'flex-start',fontFamily:F,fontSize:'0.64rem',color:'var(--sand-3)',lineHeight:1.6}}>
                <span style={{flexShrink:0}}>ℹ️</span><span>Opens WhatsApp with your details pre-filled. Our team responds within 2 hours.</span>
              </div>
              <button type="submit" className="btn-primary" style={{width:'100%',cursor:'pointer',fontSize:'0.7rem',justifyContent:'center'}}>
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
        position:'absolute',bottom:0,left:0,right:0,zIndex:40,
        transform:phase>=6?'translateY(0)':'translateY(100%)',
        transition:'transform 0.75s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <div style={{height:2,background:'rgba(201,168,76,0.1)',overflow:'hidden'}}>
          <div style={{height:'100%',background:'linear-gradient(90deg,var(--gold-dark),var(--gold-light))',width:`${((destIdx+1)/topDestinations.length)*100}%`,transition:'width 0.5s ease'}}/>
        </div>
        <div style={{background:'rgba(8,8,8,0.94)',backdropFilter:'blur(22px)',WebkitBackdropFilter:'blur(22px)',borderTop:'1px solid rgba(201,168,76,0.18)'}}>
          <div className="dest-strip-inner">
            <span className="dest-strip-label">Destinations</span>
            <div className="dest-strip-scroll">
              {topDestinations.map((d,i)=>{
                const active=i===destIdx;
                return (
                  <button key={d.id} onClick={()=>pickDest(i)} className={active?'dest-btn dest-btn--active':'dest-btn'}>
                    <span className="dest-btn-emoji">{d.emoji}</span>
                    <span className="dest-btn-name">{d.name}</span>
                  </button>
                );
              })}
            </div>
            <a href="/destinations" className="dest-all-link">All →</a>
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
        /* ── Keyframes ── */
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

        /* ── Destination strip ── */
        .dest-strip-inner {
          max-width:1280px; margin:0 auto; padding:0 12px;
          display:flex; align-items:center; height:50px; gap:0;
        }
        .dest-strip-label {
          font-family:${F}; font-size:0.54rem; font-weight:700;
          letter-spacing:0.22em; text-transform:uppercase; color:var(--gold);
          white-space:nowrap; padding-right:12px; flex-shrink:0;
          border-right:1px solid rgba(201,168,76,0.18); line-height:50px;
        }
        .dest-strip-scroll {
          display:flex; align-items:center; overflow-x:auto; flex:1;
          scrollbar-width:none; -ms-overflow-style:none;
        }
        .dest-strip-scroll::-webkit-scrollbar { display:none; }
        .dest-btn {
          background:none; border:none; cursor:pointer;
          padding:0 10px; height:50px;
          display:flex; align-items:center; gap:5px; flex-shrink:0;
          border-bottom:2px solid transparent;
          color:var(--sand-3); transition:color 0.2s ease,border-color 0.2s ease;
        }
        .dest-btn--active { border-bottom-color:var(--gold); color:var(--gold); }
        .dest-btn-emoji { font-size:0.88rem; }
        .dest-btn-name {
          font-family:${F}; font-size:0.58rem; font-weight:600;
          letter-spacing:0.1em; text-transform:uppercase; white-space:nowrap;
        }
        .dest-all-link {
          margin-left:8px; flex-shrink:0; font-family:${F};
          font-size:0.54rem; font-weight:700; letter-spacing:0.18em;
          text-transform:uppercase; color:var(--gold); text-decoration:none;
          padding:0 0 0 12px; border-left:1px solid rgba(201,168,76,0.18);
          line-height:50px; white-space:nowrap;
        }

        /* ── Tour detail grid ── */
        .dest-tour-grid {
          display:grid; grid-template-columns:minmax(0,2fr) minmax(0,3fr);
          border:1px solid rgba(201,168,76,0.22); overflow:hidden; margin-bottom:32px;
        }

        /* ── Hotel panel grid ── */
        .hotel-panel-grid {
          display:grid; grid-template-columns:minmax(0,1fr) minmax(0,2fr);
          border:1px solid rgba(201,168,76,0.2); background:rgba(255,255,255,0.025);
          margin-bottom:36px; overflow:hidden;
        }

        /* ── Form grid ── */
        .form-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px; }

        /* ════════════════════════
           TABLET ≤ 768px
        ════════════════════════ */
        @media (max-width:768px) {
          .dest-tour-grid { grid-template-columns:1fr; }
          .hotel-panel-grid { grid-template-columns:1fr; }
          .dest-btn-name { font-size:0.52rem; letter-spacing:0.06em; }
          .dest-btn { padding:0 8px; }
        }

        /* ════════════════════════
           MOBILE ≤ 480px
        ════════════════════════ */
        @media (max-width:480px) {
          .dest-strip-label { display:none; }
          .dest-btn-name { display:none; }
          .dest-btn { padding:0 8px; gap:0; }
          .dest-btn-emoji { font-size:1.1rem; }
          .dest-strip-inner { padding:0 8px; height:46px; }
          .dest-btn { height:46px; }
          .dest-all-link { font-size:0.5rem; padding-left:8px; }
          .form-grid-2 { grid-template-columns:1fr; }
          .dest-tour-grid { grid-template-columns:1fr; }
          .hotel-panel-grid { grid-template-columns:1fr; }
        }
      `}</style>
    </section>
  );
}

/* ── SEARCH BAR component — handles its own responsive layout ── */
function SearchBar({search,setSearch,onSearch}:{
  search:{from:string;to:string;activity:string;duration:string};
  setSearch:(fn:(s:any)=>any)=>void;
  onSearch:()=>void;
}) {
  return (
    <div className="search-bar-wrap">
      <div className="search-bar-inner">
        {/* 4 fields in a responsive grid */}
        <div className="search-fields">
          <div className="search-cell">
            <span className="search-cell-label">✈️ From</span>
            <input value={search.from} onChange={e=>setSearch((s:any)=>({...s,from:e.target.value}))}
              placeholder="Country of departure" style={searchInputStyle}/>
          </div>
          <div className="search-cell">
            <span className="search-cell-label">📍 Destination</span>
            <input value={search.to} onChange={e=>setSearch((s:any)=>({...s,to:e.target.value}))}
              placeholder="Cairo, Luxor, Aswan…" style={searchInputStyle}/>
          </div>
          <div className="search-cell">
            <span className="search-cell-label">🔺 Activity</span>
            <select value={search.activity} onChange={e=>setSearch((s:any)=>({...s,activity:e.target.value}))} style={searchSelectStyle}>
              {ACTIVITIES.map(a=><option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="search-cell">
            <span className="search-cell-label">⏱ Duration</span>
            <select value={search.duration} onChange={e=>setSearch((s:any)=>({...s,duration:e.target.value}))} style={searchSelectStyle}>
              {DURATIONS.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <button className="search-btn" onClick={onSearch}>Search</button>
      </div>
      <style>{`
        .search-bar-wrap {
          width: 100%;
          background: rgba(8,8,8,0.96);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(201,168,76,0.35);
          border-bottom: 1px solid rgba(201,168,76,0.15);
        }
        .search-bar-inner {
          max-width: 1080px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }
        .search-fields {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          width: 100%;
        }
        .search-cell {
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          border-right: 1px solid rgba(201,168,76,0.15);
          min-width: 0;
        }
        .search-cell:last-child { border-right: none; }
        .search-cell-label {
          font-family: var(--font-inter),Inter,sans-serif;
          font-size: 0.5rem; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(201,168,76,0.85);
          white-space: nowrap;
        }
        .search-btn {
          width: 100%;
          background: linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold-light));
          border: none; cursor: pointer;
          min-height: 48px;
          font-family: var(--font-inter),Inter,sans-serif;
          font-size: 0.68rem; font-weight: 800;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #0a0a0a;
          transition: filter 0.2s ease;
          border-top: 1px solid rgba(201,168,76,0.2);
        }
        .search-btn:hover { filter: brightness(1.08); }
        .search-btn:active { filter: brightness(0.96); }

        /* ── Tablet: 2×2 grid ── */
        @media (max-width: 700px) {
          .search-fields { grid-template-columns: repeat(2, 1fr); }
          .search-cell { border-bottom: 1px solid rgba(201,168,76,0.1); }
          .search-cell:nth-child(odd) { border-right: 1px solid rgba(201,168,76,0.15); }
          .search-cell:nth-child(even) { border-right: none; }
          .search-cell:nth-child(3),
          .search-cell:nth-child(4) { border-bottom: none; }
        }

        /* ── Phone: single column ── */
        @media (max-width: 420px) {
          .search-fields { grid-template-columns: 1fr; }
          .search-cell { border-right: none !important; border-bottom: 1px solid rgba(201,168,76,0.1); }
          .search-cell:last-child { border-bottom: none; }
          .search-cell { padding: 10px 12px; }
        }
      `}</style>
    </div>
  );
}

/* ── PYRAMID SVG ── */
function PyramidSVG({wBase,hBase,risen,delay,glow,centre}:{wBase:number;hBase:number;risen:boolean;delay:number;glow:number;centre?:boolean}) {
  const id=`pyr-${wBase}`,cx=wBase/2,bY=hBase;
  return (
    <div style={{
      transformOrigin:'bottom center',
      transform:risen?'scaleY(1)':'scaleY(0)',
      opacity:risen?1:0,
      transition:`transform 0.9s cubic-bezier(0.34,1.1,0.64,1) ${delay}s,opacity 0.55s ease ${delay}s`,
      filter:risen?(centre?`drop-shadow(0 0 ${18*glow}px rgba(201,168,76,0.55)) drop-shadow(0 -6px 22px rgba(201,168,76,0.18))`:`drop-shadow(0 0 ${10*glow}px rgba(201,168,76,0.28))`):'none',
      animation:risen&&centre?'pyr-glow 3.8s ease-in-out infinite':'none',
      lineHeight:0,
    }}>
      <svg
        viewBox={`0 0 ${wBase} ${hBase}`}
        fill="none"
        style={{display:'block',overflow:'visible',width:`clamp(${Math.round(wBase*0.45)}px,${(wBase/390*100).toFixed(1)}vw,${wBase}px)`,height:'auto'}}
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
        <line x1={cx} y1={0} x2={0}     y2={bY} stroke="rgba(232,212,138,0.38)" strokeWidth="0.6"/>
        <line x1={cx} y1={0} x2={wBase} y2={bY} stroke="rgba(201,168,76,0.22)"  strokeWidth="0.6"/>
        <line x1={cx} y1={0} x2={cx}    y2={bY} stroke="rgba(232,212,138,0.48)" strokeWidth="0.7"/>
        <line x1={0}  y1={bY} x2={wBase} y2={bY} stroke="rgba(201,168,76,0.48)" strokeWidth="0.9"/>
        {Array.from({length:7}).map((_,i)=>{const t=(i+1)/8,y=t*bY,lx=cx-(cx*t),rx=cx+(cx*t);return <line key={i} x1={lx} y1={y} x2={rx} y2={y} stroke="rgba(201,168,76,0.1)" strokeWidth="0.5"/>;  })}
        {centre&&<circle cx={cx} cy={3} r={wBase*0.058} fill={`url(#${id}-cap)`} style={{animation:risen?`cap-flash 0.7s cubic-bezier(0.34,1.56,0.64,1) ${delay+0.55}s both`:'none'}}/>}
      </svg>
    </div>
  );
}

/* ── HOTEL PANEL CARD ── */
function HotelPanelCard({hotel}:{hotel:Hotel}) {
  return (
    <div className="hotel-panel-grid">
      <div style={{overflow:'hidden',minHeight:150}}>
        <img src={hotel.image} alt={hotel.name} style={{width:'100%',height:'100%',objectFit:'cover',minHeight:150,display:'block'}}/>
      </div>
      <div style={{padding:'18px 16px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
        <div>
          <div style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.54rem',fontWeight:700,letterSpacing:'0.25em',textTransform:'uppercase',color:'var(--gold)',marginBottom:4}}>{'★'.repeat(hotel.stars)} · {hotel.location}</div>
          <h3 className="font-heading" style={{fontSize:'1.15rem',fontWeight:500,color:'#fff',marginBottom:6}}>{hotel.name}</h3>
          <p style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.76rem',color:'var(--sand-3)',lineHeight:1.6,marginBottom:8}}>{hotel.description.slice(0,110)}…</p>
          <div style={{fontFamily:'var(--font-cormorant),"Cormorant Garamond",serif',fontSize:'0.84rem',fontStyle:'italic',color:'var(--sand-2)',marginBottom:12}}>"{hotel.viewDescription}"</div>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
          <div><span style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.58rem',color:'var(--sand-3)'}}>from </span><span style={{fontFamily:'var(--font-playfair),"Playfair Display",serif',fontSize:'1.3rem',fontWeight:700,color:'var(--gold)'}}>${hotel.basePrice}</span><span style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.58rem',color:'var(--sand-3)'}}>/night</span></div>
          <a href="/hotels" className="btn-secondary" style={{textDecoration:'none',padding:'7px 16px',fontSize:'0.6rem'}}>View Rooms →</a>
        </div>
      </div>
    </div>
  );
}

/* ── SUCCESS ── */
function SuccessCard({tour,dest,onBack}:{tour:AgencyTour|null;dest:string;onBack:()=>void}) {
  return (
    <div style={{textAlign:'center',padding:'36px 20px',background:'rgba(255,255,255,0.025)',border:'1px solid rgba(201,168,76,0.25)'}}>
      <div style={{fontSize:'2.8rem',marginBottom:12}}>✅</div>
      <h3 className="font-heading" style={{fontSize:'1.4rem',color:'var(--gold)',fontWeight:500,marginBottom:6}}>Request Sent!</h3>
      <p style={{fontFamily:'var(--font-inter),Inter,sans-serif',fontSize:'0.84rem',color:'var(--sand-2)',lineHeight:1.7,marginBottom:22}}>
        Your reservation for <strong style={{color:'#fff'}}>{tour?.title}</strong> in <strong style={{color:'#fff'}}>{dest}</strong> was sent via WhatsApp. Our team confirms within 2 hours.
      </p>
      <button onClick={onBack} className="btn-secondary" style={{cursor:'pointer',fontSize:'0.66rem'}}>← Explore More Tours</button>
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

const searchInputStyle: React.CSSProperties = {
  background:'transparent',border:'none',outline:'none',
  color:'#F5E6C8',fontFamily:'var(--font-inter),Inter,sans-serif',
  fontSize:'0.82rem',width:'100%',padding:0,
};
const searchSelectStyle: React.CSSProperties = {
  background:'#0d0b06',border:'none',outline:'none',
  color:'#F5E6C8',fontFamily:'var(--font-inter),Inter,sans-serif',
  fontSize:'0.82rem',width:'100%',padding:'2px 26px 2px 0',cursor:'pointer',
  backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23C9A84C' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
  backgroundRepeat:'no-repeat',backgroundPosition:'right 2px center',
  WebkitAppearance:'none',MozAppearance:'none',appearance:'none' as const,
};
const labelStyle: React.CSSProperties = {
  display:'block',fontFamily:'var(--font-inter),Inter,sans-serif',
  fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.18em',
  textTransform:'uppercase',color:'#D4C4A0',marginBottom:5,
};
const inputStyle: React.CSSProperties = {
  width:'100%',background:'rgba(18,14,8,0.82)',
  border:'1px solid rgba(201,168,76,0.28)',color:'#F5E6C8',
  padding:'10px 12px',fontFamily:'var(--font-inter),Inter,sans-serif',
  fontSize:'0.82rem',outline:'none',transition:'border-color 0.25s ease',
};
const backBtnStyle: React.CSSProperties = {
  background:'none',border:'none',cursor:'pointer',
  fontFamily:'var(--font-inter),Inter,sans-serif',
  fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.15em',
  textTransform:'uppercase',color:'var(--sand-3)',
  marginBottom:22,display:'flex',alignItems:'center',gap:6,padding:0,
};

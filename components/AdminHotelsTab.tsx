'use client';

import { useState, useEffect } from 'react';
import { egyptianHotels, Hotel, HotelRoom } from '@/data/hotelsData';

const F = 'var(--font-inter), Inter, system-ui, sans-serif';
const inputStyle = { width: '100%', background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(201,168,76,0.3)', color: '#fff', padding: '9px 12px', fontFamily: F, fontSize: '0.88rem', boxSizing: 'border-box' as const, outline: 'none' };
const labelStyle = { fontFamily: F, fontSize: '0.65rem', fontWeight: 600 as const, color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, display: 'block' as const, marginBottom: 5 };

const CITIES = ['All Cities', 'Cairo', 'Giza', 'Sharm El Sheikh', 'Hurghada', 'Luxor', 'Aswan', 'Alexandria', 'Marsa Alam', 'Dahab', 'El Gouna'];

export default function AdminHotelsTab({ getToken }: { getToken: () => string }) {
  const [hotels, setHotels] = useState<Hotel[]>(egyptianHotels);
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Hotel>>({});
  const [msg, setMsg] = useState('');
  const [msgOk, setMsgOk] = useState(true);

  // Load dynamic overrides
  useEffect(() => {
    fetch('/api/save-data?type=hotels')
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data.length > 0) {
          setHotels(prev => prev.map(h => {
            const o = json.data.find((x: any) => x.id === h.id);
            return o ? { ...h, ...o } : h;
          }));
        }
      })
      .catch(() => {});
  }, []);

  function showMsg(text: string, ok = true) {
    setMsg(text);
    setMsgOk(ok);
    setTimeout(() => setMsg(''), 4000);
  }

  function startEdit(hotel: Hotel) {
    setEditingId(hotel.id);
    setEditForm({
      name: hotel.name,
      location: hotel.location,
      city: hotel.city,
      rating: hotel.rating,
      price: hotel.price,
      description: hotel.description,
      image: hotel.image,
      checkIn: hotel.checkIn,
      checkOut: hotel.checkOut,
      rooms: hotel.rooms.map(r => ({ ...r })),
      features: [...hotel.features],
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
  }

  async function saveEdit(id: string) {
    const original = hotels.find(h => h.id === id)!;
    const updated = { ...original, ...editForm } as Hotel;

    try {
      const res = await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'hotels', item: updated }),
      });
      const json = await res.json();
      if (!json.success) {
        showMsg('❌ Save failed: ' + json.message, false);
        return;
      }
    } catch {
      showMsg('❌ Could not reach save API', false);
      return;
    }

    setHotels(prev => prev.map(h => h.id === id ? updated : h));
    setEditingId(null);
    showMsg('✅ Hotel pricing and content changes are now live across the website!');
  }

  function updateRoomField(idx: number, field: keyof HotelRoom, val: any) {
    setEditForm(f => {
      const rooms = [...(f.rooms || [])];
      rooms[idx] = { ...rooms[idx], [field]: val };
      return { ...f, rooms };
    });
  }

  const filteredHotels = hotels.filter(hotel => {
    const matchesCity = selectedCity === 'All Cities' || hotel.city === selectedCity;
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const editing = editingId !== null ? hotels.find(h => h.id === editingId) : null;

  return (
    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
      <style>{`
        .admin-input:focus { border-color: var(--gold) !important; }
        .tab-filter-select {
          background: #0a0f1e;
          border: 1px solid rgba(201,168,76,0.3);
          color: #fff;
          padding: 8px 12px;
          font-family: ${F};
          font-size: 0.85rem;
          outline: none;
          cursor: pointer;
        }
      `}</style>

      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>Manage Curated Hotels</div>
          <div style={{ fontFamily: F, fontSize: '0.85rem', color: 'var(--sand-3)' }}>{hotels.length} luxury properties — edit details, check-in, stars, and room prices</div>
        </div>
        
        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            className="admin-input"
            style={{ ...inputStyle, width: 200, padding: '7px 12px' }}
            placeholder="Search hotel name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <select
            className="tab-filter-select"
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
          >
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {msg && <div style={{ marginBottom: 16, padding: '10px 16px', background: msgOk ? 'rgba(6,214,160,0.08)' : 'rgba(220,50,50,0.08)', border: `1px solid ${msgOk ? 'rgba(6,214,160,0.3)' : 'rgba(220,50,50,0.3)'}`, fontFamily: F, fontSize: '0.85rem', color: msgOk ? '#06d6a0' : '#ff8080' }}>{msg}</div>}

      {/* Editor Panel */}
      {editingId !== null && editing && (
        <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.3)', padding: '28px 24px', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontFamily: F, fontSize: '0.9rem', fontWeight: 600, color: 'var(--gold)' }}>Editing Content: {editing.name}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => saveEdit(editingId)} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.75rem' }}>💾 Save Changes</button>
              <button onClick={cancelEdit} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.75rem' }}>Cancel</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Hotel Name</label>
              <input className="admin-input" style={inputStyle} value={editForm.name || ''} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>City Location</label>
              <select className="admin-input" style={{ ...inputStyle, cursor: 'pointer' }} value={editForm.city || ''} onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))}>
                {CITIES.filter(c => c !== 'All Cities').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Exact Address</label>
              <input className="admin-input" style={inputStyle} value={editForm.location || ''} onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Star Rating (3–5)</label>
              <input className="admin-input" style={inputStyle} type="number" min="3" max="5" value={editForm.rating || ''} onChange={e => setEditForm(f => ({ ...f, rating: Number(e.target.value) }))} />
            </div>
            <div>
              <label style={labelStyle}>Base Price ($/night)</label>
              <input className="admin-input" style={inputStyle} type="number" value={editForm.price || ''} onChange={e => setEditForm(f => ({ ...f, price: Number(e.target.value) }))} />
            </div>
            <div>
              <label style={labelStyle}>Image URL</label>
              <input className="admin-input" style={inputStyle} value={editForm.image || ''} onChange={e => setEditForm(f => ({ ...f, image: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Check-In Time</label>
              <input className="admin-input" style={inputStyle} value={editForm.checkIn || ''} onChange={e => setEditForm(f => ({ ...f, checkIn: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Check-Out Time</label>
              <input className="admin-input" style={inputStyle} value={editForm.checkOut || ''} onChange={e => setEditForm(f => ({ ...f, checkOut: e.target.value }))} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Overview Description</label>
            <textarea className="admin-input" style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={editForm.description || ''} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          {/* Rooms Editor */}
          <div style={{ borderTop: '1px solid rgba(201,168,76,0.15)', paddingTop: 20 }}>
            <label style={{ ...labelStyle, fontSize: '0.75rem', marginBottom: 12 }}>Room Options &amp; Nightly Pricing</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(editForm.rooms || []).map((room, idx) => (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(201,168,76,0.1)', padding: 14, display: 'grid', gridTemplateColumns: '150px 100px 100px 1fr', gap: 12, alignItems: 'center' }}>
                  <div style={{ fontFamily: F, fontSize: '0.88rem', fontWeight: 600, color: 'var(--gold)' }}>{room.type}</div>
                  <div>
                    <label style={{ ...labelStyle, fontSize: '0.55rem' }}>Price ($)</label>
                    <input className="admin-input" style={inputStyle} type="number" value={room.price} onChange={e => updateRoomField(idx, 'price', Number(e.target.value))} />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontSize: '0.55rem' }}>Capacity</label>
                    <input className="admin-input" style={inputStyle} type="number" value={room.capacity} onChange={e => updateRoomField(idx, 'capacity', Number(e.target.value))} />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontSize: '0.55rem' }}>Amenities (comma separated)</label>
                    <input className="admin-input" style={inputStyle} value={room.amenities.join(', ')} onChange={e => updateRoomField(idx, 'amenities', e.target.value.split(',').map(s => s.trim()))} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {filteredHotels.map(hotel => (
          <div key={hotel.id} style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', border: editingId === hotel.id ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(201,168,76,0.18)', overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: 130, overflow: 'hidden', background: '#0a0f1e' }}>
              <img src={hotel.image} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542314503-37143078c4c1?w=300&h=130&fit=crop'; }} />
              <div style={{ position: 'absolute', top: 8, left: 8, background: 'var(--gold)', color: 'var(--navy)', fontFamily: F, fontSize: '0.62rem', fontWeight: 700, padding: '3px 8px' }}>{hotel.city}</div>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontFamily: F, fontSize: '0.88rem', fontWeight: 600, color: 'var(--sand)', marginBottom: 4, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hotel.name}</div>
              <div style={{ fontFamily: F, fontSize: '0.72rem', color: 'var(--sand-3)', marginBottom: 12 }}>
                📍 {hotel.location} · <span style={{ color: 'var(--gold)', fontWeight: 600 }}>from ${hotel.price}/night</span>
              </div>
              <button
                onClick={() => editingId === hotel.id ? cancelEdit() : startEdit(hotel)}
                className={editingId === hotel.id ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%', padding: '8px 0', fontSize: '0.72rem' }}
              >
                {editingId === hotel.id ? '✕ Close Editor' : '✏️ Edit Hotel Details'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

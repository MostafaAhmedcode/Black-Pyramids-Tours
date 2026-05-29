'use client';

import { useState, useEffect } from 'react';

const F = 'var(--font-inter), Inter, system-ui, sans-serif';
const inputStyle = { background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(201,168,76,0.3)', color: '#fff', padding: '9px 12px', fontFamily: F, fontSize: '0.88rem', outline: 'none' };
const labelStyle = { fontFamily: F, fontSize: '0.65rem', fontWeight: 600 as const, color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, display: 'block' as const, marginBottom: 5 };

interface DateBlockItem {
  id: string; // Stored as the date string itself (e.g., '2026-06-05')
  date: string;
}

export default function AdminCalendarTab({ getToken }: { getToken: () => string }) {
  const [blockedDates, setBlockedDates] = useState<DateBlockItem[]>([]);
  const [newBlockDate, setNewBlockDate] = useState('');
  const [msg, setMsg] = useState('');
  const [msgOk, setMsgOk] = useState(true);

  // Load saved date blocks on mount
  useEffect(() => {
    fetch('/api/save-data?type=blocked_dates')
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data.length > 0) {
          setBlockedDates(json.data);
        }
      })
      .catch(() => {});
  }, []);

  function showMsg(text: string, ok = true) {
    setMsg(text);
    setMsgOk(ok);
    setTimeout(() => setMsg(''), 4000);
  }

  async function handleAddBlock(e: React.FormEvent) {
    e.preventDefault();
    if (!newBlockDate) return;

    if (blockedDates.some(b => b.date === newBlockDate)) {
      showMsg('⚠️ That date is already blocked.', false);
      return;
    }

    const newItem: DateBlockItem = { id: newBlockDate, date: newBlockDate };
    const updatedList = [...blockedDates, newItem];

    try {
      const res = await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'blocked_dates', item: newItem }),
      });
      const json = await res.json();
      if (!json.success) {
        showMsg('❌ Failed to save date block: ' + json.message, false);
        return;
      }
    } catch {
      showMsg('❌ Could not reach save API', false);
      return;
    }

    setBlockedDates(updatedList);
    setNewBlockDate('');
    showMsg(`✅ Date ${newBlockDate} has been blocked successfully!`);
  }

  // To delete, we overwrite the whole file. But our POST saves one item at a time.
  // Wait, how do we delete one item? Let's check api/save-data route in Next.js.
  // The Next.js api/save-data POST handler:
  // if idx >= 0 list[idx] = item; else list.push(item);
  // It only supports upserting.
  // Wait, let's see if we can delete. If we pass the whole list, the save-data api expects `{type, item}`.
  // If we want to delete, we can easily extend app/api/save-data/route.ts to support DELETE, or we can use a trick where we pass the updated list as a special call, or we can support a DELETE request in save-data route!
  // Let's modify app/api/save-data/route.ts to support the DELETE method! It's super simple and extremely professional.
  // But wait, can we also delete by passing a special POST? Yes, but supporting a DELETE method is cleaner. We will do both or update the save-data api to support DELETE!
  // Let's look at how we can implement deletion. If we POST the updated list, it finding list.findIndex by item.id and replaces it. It doesn't clear.
  // So let's write a DELETE method in `app/api/save-data/route.ts`!

  async function handleRemoveBlock(dateStr: string) {
    try {
      const res = await fetch(`/api/save-data?type=blocked_dates&id=${dateStr}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setBlockedDates(prev => prev.filter(b => b.date !== dateStr));
        showMsg(`✅ Date ${dateStr} has been unblocked.`);
      } else {
        showMsg('❌ Failed to unblock date: ' + json.message, false);
      }
    } catch {
      showMsg('❌ Could not reach save API', false);
    }
  }

  return (
    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
      <style>{`
        .block-input:focus { border-color: var(--gold) !important; }
        .block-btn {
          font-family: ${F};
          font-weight: 600;
          font-size: 0.8rem;
          padding: 10px 20px;
          background: var(--gold);
          color: var(--navy);
          border: none;
          cursor: pointer;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: all 0.2s;
        }
        .block-btn:hover { background: #e8c547; transform: scale(1.02); }
      `}</style>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>Reservation Calendar Date Blocks</div>
        <div style={{ fontFamily: F, fontSize: '0.85rem', color: 'var(--sand-3)' }}>Manually block dates across the booking forms. Guests will see blocked dates as unavailable.</div>
      </div>

      {msg && <div style={{ marginBottom: 16, padding: '10px 16px', background: msgOk ? 'rgba(6,214,160,0.08)' : 'rgba(220,50,50,0.08)', border: `1px solid ${msgOk ? 'rgba(6,214,160,0.3)' : 'rgba(220,50,50,0.3)'}`, fontFamily: F, fontSize: '0.85rem', color: msgOk ? '#06d6a0' : '#ff8080' }}>{msg}</div>}

      {/* Block Date Form */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.15)', padding: 24, marginBottom: 32, maxWidth: 450 }}>
        <form onSubmit={handleAddBlock} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={labelStyle}>Select Date to Block</label>
            <input
              type="date"
              className="block-input"
              style={{ ...inputStyle, width: '100%' }}
              required
              value={newBlockDate}
              onChange={e => setNewBlockDate(e.target.value)}
            />
          </div>
          <button type="submit" className="block-btn">🚫 Block Selected Date</button>
        </form>
      </div>

      {/* Blocked Dates List */}
      <div>
        <label style={{ ...labelStyle, fontSize: '0.75rem', marginBottom: 16 }}>Currently Blocked Dates ({blockedDates.length})</label>
        
        {blockedDates.length === 0 ? (
          <div style={{ padding: '40px 20px', border: '1px dashed rgba(201,168,76,0.15)', textAlign: 'center', color: 'var(--sand-3)', fontFamily: F }}>
            🔓 No dates are currently manually blocked. The calendar is wide open!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {blockedDates.map(item => (
              <div key={item.date} style={{ background: 'rgba(220,50,50,0.06)', border: '1px solid rgba(220,50,50,0.3)', padding: '12px 16px', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#ff8080', fontWeight: 600 }}>{item.date}</span>
                <button
                  onClick={() => handleRemoveBlock(item.date)}
                  title="Remove Block (Unblock Date)"
                  style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700, padding: '2px 8px' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { initialTransfers, TransferItem } from '@/data/transfersData';

const F = 'var(--font-inter), Inter, system-ui, sans-serif';
const inputStyle = { width: '100%', background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(201,168,76,0.3)', color: '#fff', padding: '9px 12px', fontFamily: F, fontSize: '0.88rem', boxSizing: 'border-box' as const, outline: 'none' };
const labelStyle = { fontFamily: F, fontSize: '0.65rem', fontWeight: 600 as const, color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, display: 'block' as const, marginBottom: 5 };

export default function AdminTransfersTab({ getToken }: { getToken: () => string }) {
  const [transfers, setTransfers] = useState<TransferItem[]>(initialTransfers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TransferItem>>({});
  const [msg, setMsg] = useState('');
  const [msgOk, setMsgOk] = useState(true);

  // Load saved dynamic overrides
  useEffect(() => {
    fetch('/api/save-data?type=transfers')
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data.length > 0) {
          setTransfers(prev => prev.map(t => {
            const o = json.data.find((x: any) => x.id === t.id);
            return o ? { ...t, ...o } : t;
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

  function startEdit(item: TransferItem) {
    setEditingId(item.id);
    setEditForm({
      title: item.title,
      desc: item.desc,
      price: item.price,
      icon: item.icon,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
  }

  async function saveEdit(id: string) {
    const original = transfers.find(t => t.id === id)!;
    const updated = { ...original, ...editForm } as TransferItem;

    try {
      const res = await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'transfers', item: updated }),
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

    setTransfers(prev => prev.map(t => t.id === id ? updated : t));
    setEditingId(null);
    showMsg('✅ Transfer rates and details updated successfully!');
  }

  const editing = editingId !== null ? transfers.find(t => t.id === editingId) : null;

  return (
    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
      <style>{`
        .admin-input:focus { border-color: var(--gold) !important; }
      `}</style>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>Manage Fleet &amp; Transfers</div>
        <div style={{ fontFamily: F, fontSize: '0.85rem', color: 'var(--sand-3)' }}>{transfers.length} transport services listed — edit base fare rates and route descriptions</div>
      </div>

      {msg && <div style={{ marginBottom: 16, padding: '10px 16px', background: msgOk ? 'rgba(6,214,160,0.08)' : 'rgba(220,50,50,0.08)', border: `1px solid ${msgOk ? 'rgba(6,214,160,0.3)' : 'rgba(220,50,50,0.3)'}`, fontFamily: F, fontSize: '0.85rem', color: msgOk ? '#06d6a0' : '#ff8080' }}>{msg}</div>}

      {/* Editor form */}
      {editingId !== null && editing && (
        <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.3)', padding: '28px 24px', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontFamily: F, fontSize: '0.9rem', fontWeight: 600, color: 'var(--gold)' }}>Editing Transfer Route: {editing.title}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => saveEdit(editingId)} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.75rem' }}>💾 Save Route</button>
              <button onClick={cancelEdit} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.75rem' }}>Cancel</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Transfer Route / Title</label>
              <input className="admin-input" style={inputStyle} value={editForm.title || ''} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Base Price ($)</label>
              <input className="admin-input" style={inputStyle} type="number" value={editForm.price || ''} onChange={e => setEditForm(f => ({ ...f, price: Number(e.target.value) }))} />
            </div>
            <div>
              <label style={labelStyle}>Graphic Icon</label>
              <input className="admin-input" style={inputStyle} value={editForm.icon || ''} onChange={e => setEditForm(f => ({ ...f, icon: e.target.value }))} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Route Description</label>
            <textarea className="admin-input" style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} value={editForm.desc || ''} onChange={e => setEditForm(f => ({ ...f, desc: e.target.value }))} />
          </div>
        </div>
      )}

      {/* Grid listing */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {transfers.map(item => (
          <div key={item.id} style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', border: editingId === item.id ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(201,168,76,0.18)', padding: '24px 20px', borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '2.2rem', marginBottom: 14 }}>{item.icon}</div>
              <div style={{ fontFamily: F, fontSize: '0.92rem', fontWeight: 600, color: '#fff', marginBottom: 6 }}>{item.title}</div>
              <p style={{ fontFamily: F, fontSize: '0.8rem', color: 'var(--sand-3)', lineHeight: 1.5, marginBottom: 18 }}>{item.desc}</p>
            </div>
            <div>
              <div style={{ fontFamily: F, fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold)', marginBottom: 12 }}>${item.price} base fare</div>
              <button
                onClick={() => editingId === item.id ? cancelEdit() : startEdit(item)}
                className={editingId === item.id ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%', padding: '8px 0', fontSize: '0.72rem' }}
              >
                {editingId === item.id ? '✕ Close Editor' : '✏️ Edit Transfer Pricing'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

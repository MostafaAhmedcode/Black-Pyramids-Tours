'use client';

import { useState, useEffect } from 'react';
import { initialContent, SiteContent } from '@/data/contentData';

const F = 'var(--font-inter), Inter, system-ui, sans-serif';
const inputStyle = { width: '100%', background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(201,168,76,0.3)', color: '#fff', padding: '9px 12px', fontFamily: F, fontSize: '0.88rem', boxSizing: 'border-box' as const, outline: 'none' };
const labelStyle = { fontFamily: F, fontSize: '0.65rem', fontWeight: 600 as const, color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, display: 'block' as const, marginBottom: 5 };

export default function AdminContentTab({ getToken }: { getToken: () => string }) {
  const [content, setContent] = useState<SiteContent[]>(initialContent);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormValue, setEditFormValue] = useState('');
  const [msg, setMsg] = useState('');
  const [msgOk, setMsgOk] = useState(true);

  // Load saved dynamic overrides
  useEffect(() => {
    fetch('/api/save-data?type=content')
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data.length > 0) {
          setContent(prev => prev.map(c => {
            const o = json.data.find((x: any) => x.id === c.id);
            return o ? { ...c, ...o } : c;
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

  function startEdit(item: SiteContent) {
    setEditingId(item.id);
    setEditFormValue(item.value);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditFormValue('');
  }

  async function saveEdit(id: string) {
    const original = content.find(c => c.id === id)!;
    const updated = { ...original, value: editFormValue } as SiteContent;

    try {
      const res = await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'content', item: updated }),
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

    setContent(prev => prev.map(c => c.id === id ? updated : c));
    setEditingId(null);
    showMsg('✅ Website text and content details updated globally in real-time!');
  }

  // Group items by section
  const sections = Array.from(new Set(content.map(c => c.section)));

  const editing = editingId !== null ? content.find(c => c.id === editingId) : null;

  return (
    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
      <style>{`
        .admin-input:focus { border-color: var(--gold) !important; }
      `}</style>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>Website Text &amp; Copy (A to Z Coverage)</div>
        <div style={{ fontFamily: F, fontSize: '0.85rem', color: 'var(--sand-3)' }}>Modify core headings, descriptions, promotions, and contact information across the platform.</div>
      </div>

      {msg && <div style={{ marginBottom: 16, padding: '10px 16px', background: msgOk ? 'rgba(6,214,160,0.08)' : 'rgba(220,50,50,0.08)', border: `1px solid ${msgOk ? 'rgba(6,214,160,0.3)' : 'rgba(220,50,50,0.3)'}`, fontFamily: F, fontSize: '0.85rem', color: msgOk ? '#06d6a0' : '#ff8080' }}>{msg}</div>}

      {/* Editor Panel */}
      {editingId !== null && editing && (
        <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.3)', padding: '28px 24px', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontFamily: F, fontSize: '0.9rem', fontWeight: 600, color: 'var(--gold)' }}>Editing: {editing.label} ({editing.section})</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => saveEdit(editingId)} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.75rem' }}>💾 Save Text</button>
              <button onClick={cancelEdit} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.75rem' }}>Cancel</button>
            </div>
          </div>
          <div>
            <textarea
              className="admin-input"
              style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
              value={editFormValue}
              onChange={e => setEditFormValue(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Section-based listing */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {sections.map(sect => (
          <div key={sect} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(201,168,76,0.12)', padding: 24, borderRadius: 4 }}>
            <h3 style={{ fontFamily: 'var(--font-cinzel), Cinzel, Georgia, serif', fontSize: '1.15rem', color: 'var(--gold)', marginBottom: 20, borderBottom: '1px solid rgba(201,168,76,0.15)', paddingBottom: 10 }}>{sect} Copy</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {content.filter(c => c.section === sect).map(item => (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 100px', gap: 16, alignItems: 'start', paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontFamily: F, fontSize: '0.75rem', fontWeight: 600, color: 'var(--sand-2)' }}>{item.label}</div>
                  <div style={{ fontFamily: F, fontSize: '0.88rem', color: '#fff', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{item.value}</div>
                  <button
                    onClick={() => startEdit(item)}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.72rem', letterSpacing: '0.05em' }}
                  >
                    ✏️ Edit Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const F = 'var(--font-inter), Inter, system-ui, sans-serif';

export default function AdminBookingsTab({ getToken }: { getToken: () => string }) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/bookings`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const json = await res.json();
      if (json.success) setBookings(json.data.bookings || []);
    } catch (e) {
      console.error('Failed to load bookings');
    }
    setLoading(false);
  }

  async function updateStatus(id: number, status: string) {
    try {
      const res = await fetch(`${API}/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status })
      });
      const json = await res.json();
      if (json.success) {
        setMsg(`✅ Booking #${id} updated to ${status}`);
        loadBookings();
      } else {
        setMsg(`❌ Failed: ${json.message}`);
      }
    } catch (e) {
      setMsg('❌ Network error updating booking.');
    }
  }

  async function deleteBooking(id: number) {
    if (!confirm(`Are you sure you want to delete Booking #${id}?`)) return;
    try {
      const res = await fetch(`${API}/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const json = await res.json();
      if (json.success) {
        setMsg(`🗑️ Booking #${id} deleted.`);
        loadBookings();
      } else {
        setMsg(`❌ Failed: ${json.message}`);
      }
    } catch (e) {
      setMsg('❌ Network error deleting booking.');
    }
  }

  return (
    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontFamily: F, fontSize: '0.9rem', fontWeight: 600, color: 'var(--gold)' }}>Manage Bookings</div>
        <button onClick={loadBookings} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.7rem' }}>↻ Refresh</button>
      </div>

      {loading ? <div style={{ color: 'var(--sand-2)' }}>Loading bookings...</div> : null}
      
      {msg && <div style={{ marginBottom: 16, padding: 12, background: 'rgba(255,255,255,0.05)', color: msg.includes('✅') ? '#06d6a0' : '#ff8080', border: '1px solid rgba(255,255,255,0.1)' }}>{msg}</div>}

      {bookings.length === 0 && !loading && (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--sand-3)', border: '1px dashed rgba(201,168,76,0.3)' }}>
          No bookings found.
        </div>
      )}

      <div style={{ display: 'grid', gap: 16 }}>
        {bookings.map(b => (
          <div key={b.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.15)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              
              {/* Customer Info */}
              <div style={{ flex: 1, minWidth: 250 }}>
                <div style={{ fontFamily: F, color: '#fff', fontSize: '1.1rem', fontWeight: 600, marginBottom: 8 }}>
                  #{b.id} — {b.customer_name}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: F, fontSize: '0.8rem', color: 'var(--sand-2)' }}>
                  <div>📧 {b.customer_email}</div>
                  <div>📞 {b.customer_phone || 'N/A'}</div>
                  <div style={{ marginTop: 8 }}>Type: <strong style={{color: 'var(--gold)', textTransform: 'uppercase'}}>{b.item_type}</strong> (Item ID: {b.item_id})</div>
                  <div>Dates: {b.check_in_date} {b.check_out_date !== 'N/A (Tour)' ? `→ ${b.check_out_date}` : ''}</div>
                  <div>Placed: {b.created_at}</div>
                </div>
              </div>

              {/* Status and Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                <div style={{
                  padding: '6px 16px',
                  background: b.status === 'pending' ? 'rgba(255,209,102,0.1)' : b.status === 'confirmed' ? 'rgba(6,214,160,0.1)' : 'rgba(220,50,50,0.1)',
                  color: b.status === 'pending' ? '#ffd166' : b.status === 'confirmed' ? '#06d6a0' : '#ff8080',
                  border: `1px solid ${b.status === 'pending' ? '#ffd166' : b.status === 'confirmed' ? '#06d6a0' : '#ff8080'}`,
                  fontFamily: F, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em'
                }}>
                  Status: {b.status}
                  <br/>
                  Total: ${b.total_price}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {b.status !== 'confirmed' && (
                    <button onClick={() => updateStatus(b.id, 'confirmed')} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.7rem' }}>Confirm</button>
                  )}
                  {b.status !== 'cancelled' && (
                    <button onClick={() => updateStatus(b.id, 'cancelled')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.7rem' }}>Cancel</button>
                  )}
                  <button onClick={() => deleteBooking(b.id)} style={{ padding: '6px 12px', fontSize: '0.7rem', background: 'transparent', border: '1px solid #ff6b6b', color: '#ff6b6b', cursor: 'pointer' }}>Delete</button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Booking {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  item_type: 'room' | 'tour';
  item_id: number;
  item_name: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  created_at: string;
}

export default function GuestDashboardPage() {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [email, setEmail] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Invoice state
  const [selectedReceiptHtml, setSelectedReceiptHtml] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [fetchingReceipt, setFetchingReceipt] = useState(false);
  const [receiptError, setReceiptError] = useState('');

  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem('vpi_guest_email');
    if (!savedEmail) {
      router.push('/user/login');
      return;
    }
    setEmail(savedEmail);
    fetchBookings(savedEmail);
  }, [router]);

  const fetchBookings = async (lookupEmail: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API}/api/bookings/customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: lookupEmail }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setBookings(data.data.bookings || []);
      } else {
        setError(data.message || 'Failed to fetch bookings.');
      }
    } catch (err) {
      setError('Could not connect to the booking server. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vpi_guest_email');
    router.push('/user/login');
  };

  const handleViewReceipt = async (bookingId: number) => {
    setFetchingReceipt(true);
    setReceiptError('');
    setSelectedBookingId(bookingId);
    setSelectedReceiptHtml(null);

    try {
      const response = await fetch(`${API}/api/bookings/receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: bookingId }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSelectedReceiptHtml(data.data.html);
      } else {
        setReceiptError(data.message || 'Receipt invoice file not found.');
      }
    } catch (err) {
      setReceiptError('Failed to fetch the receipt from the server.');
    } finally {
      setFetchingReceipt(false);
    }
  };

  const closeReceiptModal = () => {
    setSelectedReceiptHtml(null);
    setSelectedBookingId(null);
    setReceiptError('');
  };

  const getStatusStyle = (status: Booking['status']) => {
    switch (status) {
      case 'paid':
        return {
          bg: 'rgba(20, 184, 166, 0.12)', // Turquoise
          border: '1px solid rgba(20, 184, 166, 0.4)',
          color: '#14b8a6'
        };
      case 'confirmed':
        return {
          bg: 'rgba(34, 197, 94, 0.12)', // Green
          border: '1px solid rgba(34, 197, 94, 0.4)',
          color: '#22c55e'
        };
      case 'pending':
        return {
          bg: 'rgba(201, 168, 76, 0.12)', // Gold
          border: '1px solid rgba(201, 168, 76, 0.4)',
          color: '#c9a84c'
        };
      case 'cancelled':
        return {
          bg: 'rgba(239, 68, 68, 0.12)', // Crimson
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#ef4444'
        };
      default:
        return {
          bg: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#fff'
        };
    }
  };

  const formatRefId = (id: number) => {
    return `VPI-2026-00${String(id).padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch {
      return dateStr;
    }
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top, #0f1833 0%, #040710 100%)',
      color: '#fff',
      fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
      padding: '40px 24px 80px',
      position: 'relative'
    }}>
      {/* Decorative Orbs */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: '10%',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'rgba(201, 168, 76, 0.03)',
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Header bar */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(201, 168, 76, 0.2)',
          paddingBottom: 24,
          marginBottom: 40,
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{
                fontFamily: 'Georgia, serif',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: 'var(--gold, #c9a84c)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>Venus Pyramids Inn</span>
            </Link>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 300,
              color: '#fff',
              marginTop: 4,
              letterSpacing: '0.02em'
            }}>Guest Dashboard</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right', display: 'none', '@media (min-width: 640px)': { display: 'block' } } as any}>
              <div style={{ fontSize: '0.72rem', color: 'var(--sand-3, #a29e96)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Logged in as</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--sand-2, #dcd7cd)', fontWeight: 500 }}>{email}</div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 18px',
                background: 'transparent',
                border: '1px solid rgba(201, 168, 76, 0.3)',
                borderRadius: 2,
                color: 'var(--gold, #c9a84c)',
                fontSize: '0.78rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(201, 168, 76, 0.1)';
                e.currentTarget.style.borderColor = 'var(--gold, #c9a84c)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.3)';
              }}
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Info panel */}
        <div style={{
          background: 'rgba(201, 168, 76, 0.05)',
          border: '1px solid rgba(201, 168, 76, 0.15)',
          borderRadius: 2,
          padding: '20px 24px',
          marginBottom: 32,
          fontSize: '0.9rem',
          color: 'var(--sand-2, #dcd7cd)',
          lineHeight: 1.6,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            📍 <strong>Lookup Session</strong> active for <span style={{ color: '#fff' }}>{email}</span>. Any new bookings made via this email will show up here instantly.
          </div>
          <button
            onClick={() => fetchBookings(email || '')}
            style={{
              padding: '6px 14px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 2,
              color: '#fff',
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            🔄 Refresh List
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{
              width: 40,
              height: 40,
              border: '3px solid rgba(201, 168, 76, 0.2)',
              borderTopColor: 'var(--gold, #c9a84c)',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }} />
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
            <p style={{ color: 'var(--sand-3, #a29e96)' }}>Querying hotel database for reservations...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            padding: '20px',
            borderRadius: 2,
            color: '#ef4444',
            marginBottom: 32,
            textAlign: 'center'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Main List */}
        {!loading && !error && (
          <>
            {bookings.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '80px 40px',
                background: 'rgba(13, 20, 40, 0.4)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 4
              }}>
                <div style={{ fontSize: '3rem', marginBottom: 20 }}>🏜️</div>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: 8, fontWeight: 400 }}>No Reservations Found</h3>
                <p style={{
                  color: 'var(--sand-3, #a29e96)',
                  maxWidth: 480,
                  margin: '0 auto 28px',
                  fontSize: '0.88rem',
                  lineHeight: 1.6
                }}>We couldn't find any rooms or tours registered under <strong>{email}</strong>. Ready to book your magical adventure near the Great Pyramids of Giza?</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <Link href="/#rooms" style={{
                    padding: '12px 24px',
                    background: 'var(--gold, #c9a84c)',
                    color: '#040710',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    textDecoration: 'none',
                    borderRadius: 2,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#dfb858'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#c9a84c'; }}
                  >
                    View Luxury Rooms
                  </Link>
                  <Link href="/#tours" style={{
                    padding: '12px 24px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(201, 168, 76, 0.3)',
                    color: 'var(--gold, #c9a84c)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    textDecoration: 'none',
                    borderRadius: 2,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  >
                    Explore Egypt Tours
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <h2 style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '1.25rem',
                  color: 'var(--gold, #c9a84c)',
                  fontWeight: 400,
                  letterSpacing: '0.05em',
                  marginBottom: 8
                }}>Your Reservation Timeline</h2>
                
                {bookings.map((booking) => {
                  const statusDetails = getStatusStyle(booking.status);
                  return (
                    <div
                      key={booking.id}
                      style={{
                        background: 'linear-gradient(170deg, rgba(13, 20, 40, 0.75) 0%, rgba(7, 10, 22, 0.85) 100%)',
                        border: '1px solid rgba(201, 168, 76, 0.2)',
                        borderRadius: 3,
                        padding: '24px 28px',
                        position: 'relative',
                        boxShadow: '0 10px 30px -5px rgba(0,0,0,0.5)',
                        transition: 'border-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.4)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.2)'}
                    >
                      {/* Top Bar inside Card */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: 12,
                        marginBottom: 16
                      }}>
                        <div>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--gold, #c9a84c)',
                            background: 'rgba(201, 168, 76, 0.08)',
                            padding: '4px 8px',
                            borderRadius: 1
                          }}>
                            {booking.item_type === 'room' ? '🏨 Hotel Room' : '🧭 Guided Tour'}
                          </span>
                          <span style={{
                            marginLeft: 12,
                            fontSize: '0.78rem',
                            color: 'var(--sand-3, #a29e96)',
                            fontFamily: 'monospace'
                          }}>
                            Ref: {formatRefId(booking.id)}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 12px',
                          borderRadius: 2,
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          background: statusDetails.bg,
                          border: statusDetails.border,
                          color: statusDetails.color
                        }}>
                          {booking.status}
                        </span>
                      </div>

                      {/* Main Info */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        '@media (min-width: 768px)': { gridTemplateColumns: '2fr 1fr' }
                      } as any}>
                        <div>
                          <h3 style={{
                            fontSize: '1.2rem',
                            fontWeight: 500,
                            color: '#fff',
                            marginBottom: 12
                          }}>{booking.item_name}</h3>

                          {/* Timeline details */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: 16,
                            marginBottom: 8
                          }}>
                            <div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--sand-3, #a29e96)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                {booking.item_type === 'room' ? 'Check-In' : 'Tour Date'}
                              </div>
                              <div style={{ fontSize: '0.88rem', color: 'var(--sand-2, #dcd7cd)', marginTop: 2, fontWeight: 500 }}>
                                {formatDate(booking.check_in_date)}
                              </div>
                            </div>

                            {booking.item_type === 'room' && (
                              <div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--sand-3, #a29e96)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Check-Out</div>
                                <div style={{ fontSize: '0.88rem', color: 'var(--sand-2, #dcd7cd)', marginTop: 2, fontWeight: 500 }}>
                                  {formatDate(booking.check_out_date)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Price and Action */}
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          borderTop: '1px solid rgba(255,255,255,0.05)',
                          paddingTop: 16,
                          marginTop: 16,
                          '@media (min-width: 768px)': {
                            borderTop: 'none',
                            borderLeft: '1px solid rgba(255,255,255,0.05)',
                            paddingTop: 0,
                            marginTop: 0,
                            paddingLeft: 24,
                            alignItems: 'flex-end'
                          }
                        } as any}>
                          <div style={{ textAlign: 'left', '@media (min-width: 768px)': { textAlign: 'right' } } as any}>
                            <div style={{ fontSize: '0.65rem', color: 'var(--sand-3, #a29e96)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Amount</div>
                            <div style={{ fontSize: '1.5rem', color: 'var(--gold, #c9a84c)', fontWeight: 600, marginTop: 2 }}>
                              ${booking.total_price}
                            </div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--sand-3, #a29e96)' }}>tax & fees included</div>
                          </div>

                          <button
                            onClick={() => handleViewReceipt(booking.id)}
                            style={{
                              marginTop: 14,
                              padding: '8px 14px',
                              background: 'transparent',
                              border: '1px solid rgba(201, 168, 76, 0.3)',
                              borderRadius: 2,
                              color: 'var(--sand-2, #dcd7cd)',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = 'var(--gold, #c9a84c)';
                              e.currentTarget.style.color = 'var(--gold, #c9a84c)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.3)';
                              e.currentTarget.style.color = 'var(--sand-2, #dcd7cd)';
                            }}
                          >
                            📄 View Receipt
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Sandboxed HTML Invoice Preview Modal */}
      {(selectedBookingId !== null) && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(4, 7, 18, 0.9)',
          zIndex: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}>
          <div style={{
            width: '100%',
            maxWidth: 760,
            background: '#0d1428',
            border: '1px solid rgba(201, 168, 76, 0.4)',
            borderRadius: 4,
            boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '18px 24px',
              borderBottom: '1px solid rgba(201, 168, 76, 0.2)'
            }}>
              <div>
                <h3 style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '1.1rem',
                  color: 'var(--gold, #c9a84c)',
                  margin: 0
                }}>Booking Receipt</h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--sand-3, #a29e96)' }}>
                  Reference: {formatRefId(selectedBookingId)}
                </span>
              </div>
              <button
                onClick={closeReceiptModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
              >
                ×
              </button>
            </div>

            {/* Modal Body / Iframe Area */}
            <div style={{ flex: 1, padding: 24, overflowY: 'auto', background: '#0a0f1e' }}>
              {fetchingReceipt && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
                  <div style={{
                    width: 30,
                    height: 30,
                    border: '2px solid rgba(201, 168, 76, 0.2)',
                    borderTopColor: 'var(--gold, #c9a84c)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: 16
                  }} />
                  <p style={{ fontSize: '0.82rem', color: 'var(--sand-3, #a29e96)' }}>Retrieving transaction details...</p>
                </div>
              )}

              {receiptError && (
                <div style={{
                  padding: 24,
                  background: 'rgba(239, 68, 68, 0.06)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  fontSize: '0.85rem',
                  borderRadius: 2,
                  textAlign: 'center',
                  minHeight: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '2rem', marginBottom: 8 }}>⚠️</span>
                  {receiptError}
                  <p style={{ fontSize: '0.78rem', color: 'var(--sand-3, #a29e96)', marginTop: 12, maxWidth: 360 }}>This receipt is still being generated or is unavailable. Please check again in a few minutes or contact support.</p>
                </div>
              )}

              {selectedReceiptHtml && (
                <div style={{ width: '100%', height: 480, background: '#fff', borderRadius: 2, overflow: 'hidden' }}>
                  <iframe
                    title={`Receipt ${selectedBookingId}`}
                    srcDoc={selectedReceiptHtml}
                    sandbox="allow-same-origin"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      background: '#fff'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid rgba(201, 168, 76, 0.2)',
              display: 'flex',
              justifyContent: 'flex-end',
              background: '#0d1428'
            }}>
              <button
                onClick={closeReceiptModal}
                style={{
                  padding: '8px 18px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 2,
                  color: '#fff',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

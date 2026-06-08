'use client';

import { useState, useEffect } from 'react';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface PricingTier {
  label: string;
  price1: number;
  price2: number;
}

interface RoomItem {
  id: number;
  name: string;
  price: number;
  capacity: number;
}

interface TourItem {
  id: number;
  title: string;
  basePrice: number;
  priceTiers?: PricingTier[];
}

interface BookingWizardProps {
  itemType: 'room' | 'tour';
  item: RoomItem | TourItem;
  onCancel: () => void;
}

const F = 'var(--font-inter), Inter, system-ui, sans-serif';

export default function BookingWizard({ itemType, item, onCancel }: BookingWizardProps) {
  const [step, setStep] = useState(1); // 1: Details, 2: Payment Sandbox, 3: Success

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  // Date Fields
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  
  // Tour specific Fields
  const [tourPeople, setTourPeople] = useState(1); // 1 or 2
  const [selectedTierIdx, setSelectedTierIdx] = useState(0);

  // States
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState<{ status: 'idle' | 'available' | 'unavailable' | 'error'; text: string }>({ status: 'idle', text: '' });
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [nightsCount, setNightsCount] = useState(1);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [bookingRef, setBookingRef] = useState('');
  const [localReceiptPath, setLocalReceiptPath] = useState('');

  // Payment sandbox fields
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Calculate pricing based on selections
  useEffect(() => {
    if (itemType === 'room') {
      const room = item as RoomItem;
      if (checkInDate && checkOutDate) {
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
          setNightsCount(diffDays);
          setCalculatedPrice(room.price * diffDays);
        } else {
          setNightsCount(1);
          setCalculatedPrice(room.price);
        }
      } else {
        setCalculatedPrice(room.price);
      }
    } else {
      const tour = item as TourItem;
      if (tour.priceTiers && tour.priceTiers.length > 0) {
        const tier = tour.priceTiers[selectedTierIdx];
        let price = tier.price1;
        if (tourPeople === 2) {
          price = tier.price2;
        } else if (tourPeople > 2) {
          price = tier.price2 + (tourPeople - 2) * 10;
        }
        setCalculatedPrice(price);
      } else {
        setCalculatedPrice(tour.basePrice * tourPeople);
      }
    }
  }, [itemType, item, checkInDate, checkOutDate, tourPeople, selectedTierIdx]);

  // Check Availability
  const handleCheckAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !checkInDate) {
      setAvailabilityMessage({ status: 'error', text: 'Please fill in all contact and reservation details.' });
      return;
    }

    if (itemType === 'room' && !checkOutDate) {
      setAvailabilityMessage({ status: 'error', text: 'Please specify checkout date.' });
      return;
    }

    setIsChecking(true);
    setAvailabilityMessage({ status: 'idle', text: '' });

    try {
      const resp = await fetch(`${API}/api/bookings/check-availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_type: itemType,
          item_id: item.id,
          check_in_date: checkInDate,
          check_out_date: itemType === 'room' ? checkOutDate : checkInDate
        })
      });

      const res = await resp.json();
      if (resp.ok && res.success && res.data.available) {
        setAvailabilityMessage({ status: 'available', text: '🟢 This item is fully available! Proceed to payment.' });
      } else {
        setAvailabilityMessage({
          status: 'unavailable',
          text: '🔴 Sorry, this item is occupied or double-booked for these dates. Please choose another date.'
        });
      }
    } catch (err) {
      setAvailabilityMessage({ status: 'error', text: 'Failed to verify availability. Please try again.' });
    } finally {
      setIsChecking(false);
    }
  };

  // Submit and go to Payment Sandbox
  const handleProceedToPayment = () => {
    setStep(2);
  };

  // Process Mock Checkout
  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');

    // Validations
    if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
      setPaymentError('All credit card fields are required.');
      return;
    }

    const cleanCard = cardNumber.replace(/\s+/g, '');
    if (cleanCard.length < 15 || cleanCard.length > 16 || isNaN(Number(cleanCard))) {
      setPaymentError('Invalid Card Number. Please enter a valid 15 or 16-digit number.');
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      setPaymentError('Invalid Expiration Date. Format must be MM/YY.');
      return;
    }

    if (cardCvv.length < 3 || cardCvv.length > 4 || isNaN(Number(cardCvv))) {
      setPaymentError('Invalid CVV. Must be 3 or 4 digits.');
      return;
    }

    setIsPaying(true);

    try {
      // 1. Create a paid/confirmed booking in backend
      const bookingResp = await fetch(`${API}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          item_type: itemType,
          item_id: item.id,
          check_in_date: checkInDate,
          check_out_date: itemType === 'room' ? checkOutDate : checkInDate + ' (Tour)',
          total_price: calculatedPrice,
          status: 'paid' // Set directly to paid status
        })
      });

      const res = await bookingResp.json();
      if (bookingResp.ok && res.success) {
        setBookingId(res.data.id);
        const ref = `BPG-2026-${res.data.id.toString().padStart(4, '0')}X`;
        setBookingRef(ref);
        setLocalReceiptPath(`backend/uploads/emails/booking_${res.data.id}_paid.html`);
        setStep(3);
      } else {
        setPaymentError(res.message || 'Failed to authorize transaction. Please check availability.');
      }
    } catch (err) {
      setPaymentError('Failed to establish database transaction. Please check if Python server is online.');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px dashed rgba(201, 168, 76, 0.3)', padding: '24px', borderRadius: 2, marginTop: 24 }}>
      
      {/* Wizard Steps Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, borderBottom: '1px solid rgba(201, 168, 76, 0.15)', paddingBottom: 16 }}>
        {['1. Reservation Details', '2. Secure Checkout Sandbox', '3. Receipt Confirmed'].map((s, idx) => {
          const isActive = idx + 1 === step;
          const isDone = idx + 1 < step;
          return (
            <span
              key={s}
              style={{
                fontFamily: F,
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: isActive ? 'var(--gold)' : isDone ? '#06d6a0' : 'var(--sand-3)',
                textShadow: isActive ? '0 0 10px rgba(201,168,76,0.3)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {isDone ? '✓' : isActive ? '◆' : '○'} {s}
            </span>
          );
        })}
      </div>

      {/* STEP 1: Details and Occupancy Check */}
      {step === 1 && (
        <form onSubmit={handleCheckAvailability}>
          <div style={{ fontFamily: F, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
            📋 Contact Information
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontFamily: F, fontSize: '0.75rem', color: 'var(--sand-2)', marginBottom: 6 }}>Full Name</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. John Doe"
                style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.3)', color: '#fff', outline: 'none', fontFamily: F, fontSize: '0.88rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: F, fontSize: '0.75rem', color: 'var(--sand-2)', marginBottom: 6 }}>Email Address</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="e.g. john@example.com"
                style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.3)', color: '#fff', outline: 'none', fontFamily: F, fontSize: '0.88rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: F, fontSize: '0.75rem', color: 'var(--sand-2)', marginBottom: 6 }}>WhatsApp / Phone</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. +1 555 123 4567"
                style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.3)', color: '#fff', outline: 'none', fontFamily: F, fontSize: '0.88rem' }}
              />
            </div>
          </div>

          <div style={{ fontFamily: F, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
            📅 Reservation Specifics
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
            {itemType === 'room' ? (
              <>
                <div>
                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontFamily: F, fontSize: '0.75rem', color: 'var(--sand-2)', marginBottom: 6 }}>
                      <span style={{ color: 'var(--gold)', marginRight: 4, fontSize: '1.2rem' }}>📅</span>Check-In Date
                    </label>
                    <input
                      type="date"
                      required
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.3)', color: '#fff', outline: 'none', fontFamily: F, fontSize: '0.88rem' }}
                    />
                  </div>
                </div>
                <div>
                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontFamily: F, fontSize: '0.75rem', color: 'var(--sand-2)', marginBottom: 6 }}>
                      <span style={{ color: 'var(--gold)', marginRight: 4 }}>📅</span>Check-Out Date
                    </label>
                    <input
                      type="date"
                      required
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.3)', color: '#fff', outline: 'none', fontFamily: F, fontSize: '0.88rem' }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                    <label style={{ display: 'block', fontFamily: F, fontSize: '0.75rem', color: 'var(--sand-2)', marginBottom: 6 }}><span style={{ color: 'var(--gold)', marginRight: 4, fontSize: '1.2rem' }}>📅</span>Excursion Date</label>
                  <input
                    type="date"
                    required
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.3)', color: '#fff', outline: 'none', fontFamily: F, fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <div>
                    <label style={{ display: 'block', fontFamily: F, fontSize: '0.75rem', color: 'var(--sand-2)', marginBottom: 6 }}>Number of People</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button type="button" onClick={() => setTourPeople(prev => Math.max(1, prev - 1))}
                        style={{ padding: '4px 8px', background: 'var(--gold)', border: '1px solid rgba(201,168,76,0.5)', color: 'var(--navy)', cursor: 'pointer' }}>－</button>
                      <input type="number" min={1} value={tourPeople}
                        onChange={(e) => setTourPeople(Math.max(1, Number(e.target.value) || 1))}
                        style={{ width: '60px', textAlign: 'center', padding: '6px', background: '#0a0f1e', border: '1px solid rgba(201,168,76,0.3)', color: '#fff', fontFamily: F, fontSize: '0.88rem' }}/>
                      <button type="button" onClick={() => setTourPeople(prev => prev + 1)}
                        style={{ padding: '4px 8px', background: 'var(--gold)', border: '1px solid rgba(201,168,76,0.5)', color: 'var(--navy)', cursor: 'pointer' }}>＋</button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Tour Pricing Tiers Dropdown */}
          {itemType === 'tour' && (item as TourItem).priceTiers && (item as TourItem).priceTiers!.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontFamily: F, fontSize: '0.75rem', color: 'var(--sand-2)', marginBottom: 6 }}>Select Tour Option</label>
              <select
                value={selectedTierIdx}
                onChange={(e) => setSelectedTierIdx(Number(e.target.value))}
                style={{ width: '100%', padding: '10px 12px', background: '#0a0f1e', border: '1px solid rgba(201,168,76,0.3)', color: '#fff', outline: 'none', fontFamily: F, fontSize: '0.88rem' }}
              >
                {(item as TourItem).priceTiers!.map((t, idx) => (
                  <option key={idx} value={idx}>
                    {t.label} (1p: ${t.price1} | 2p: ${t.price2})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Live Pricing Breakdown */}
          <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(201, 168, 76, 0.1)', padding: '16px', marginBottom: 20, textAlign: 'center' }}>
            <div style={{ fontFamily: F, fontSize: '0.65rem', color: 'var(--sand-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Estimated Booking Value
            </div>
            <div className="font-heading" style={{ fontSize: '2.5rem', color: 'var(--gold)', fontWeight: 700, margin: '8px 0' }}>
              ${calculatedPrice}
            </div>
            <div style={{ fontFamily: F, fontSize: '0.75rem', color: 'var(--sand-2)', fontStyle: 'italic' }}>
              {itemType === 'room'
                ? `Calculated for ${nightsCount} night${nightsCount > 1 ? 's' : ''} ($${(item as RoomItem).price}/night)`
                : `Guided day excursion for ${tourPeople} guest${tourPeople > 1 ? 's' : ''} — Total $${calculatedPrice}`
              }
            </div>
          </div>

          {/* Occupancy verification results */}
          {availabilityMessage.text && (
            <div
              style={{
                background:
                  availabilityMessage.status === 'available'
                    ? 'rgba(6, 214, 160, 0.1)'
                    : availabilityMessage.status === 'unavailable'
                    ? 'rgba(239, 71, 111, 0.1)'
                    : 'rgba(255, 209, 102, 0.1)',
                border:
                  availabilityMessage.status === 'available'
                    ? '1px solid #06d6a0'
                    : availabilityMessage.status === 'unavailable'
                    ? '1px solid #ef476f'
                    : '1px solid #ffd166',
                color:
                  availabilityMessage.status === 'available'
                    ? '#06d6a0'
                    : availabilityMessage.status === 'unavailable'
                    ? '#ef476f'
                    : '#ffd166',
                padding: '12px 16px',
                marginBottom: 20,
                fontFamily: F,
                fontSize: '0.85rem',
                textAlign: 'center',
              }}
            >
              {availabilityMessage.text}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                fontFamily: F,
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.25)',
                color: 'var(--sand-2)',
                padding: '10px 20px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            {availabilityMessage.status === 'available' ? (
              <button
                type="button"
                onClick={handleProceedToPayment}
                style={{
                  fontFamily: F,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  background: '#06d6a0',
                  border: 'none',
                  color: 'var(--navy)',
                  padding: '10px 24px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(6, 214, 160, 0.3)'
                }}
              >
                Proceed to Payment 👉
              </button>
            ) : (
              <button
                type="submit"
                disabled={isChecking}
                style={{
                  fontFamily: F,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  background: 'var(--gold)',
                  border: 'none',
                  color: 'var(--navy)',
                  padding: '10px 24px',
                  cursor: 'pointer',
                  opacity: isChecking ? 0.6 : 1,
                }}
              >
                {isChecking ? 'Verifying SQLite availability...' : 'Check Availability'}
              </button>
            )}
          </div>
        </form>
      )}

      {/* STEP 2: Secure Payment Sandbox */}
      {step === 2 && (
        <form onSubmit={handleProcessPayment}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontFamily: F, fontSize: '0.8rem', fontWeight: 600, color: 'var(--sand-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🔒 Simulated Stripe Sandbox
            </div>
            <p style={{ fontFamily: F, fontSize: '0.78rem', color: 'var(--sand-3)', margin: '4px 0 0' }}>
              Test booking authorization. No real charges are made. Enter any valid mock card.
            </p>
          </div>

          {/* Visa Gold Card Mock */}
          <div
            style={{
              width: '100%',
              maxWidth: 360,
              height: 210,
              margin: '0 auto 24px',
              background: 'linear-gradient(135deg, #0f1c3f 0%, #060b17 100%)',
              border: '1px solid var(--gold)',
              borderRadius: 12,
              padding: 24,
              boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: F, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                BLACK PYRAMIDS TOURS
              </span>
              <span style={{ fontSize: '1.5rem' }}>💳</span>
            </div>
            
            {/* Card chip */}
            <div style={{ width: 44, height: 32, background: 'linear-gradient(45deg, #e0b034, #fce085)', borderRadius: 4, opacity: 0.8 }} />

            <div>
              {/* Card number display */}
              <div style={{ fontFamily: 'monospace', fontSize: '1.25rem', color: '#fff', letterSpacing: '0.12em', margin: '12px 0 6px' }}>
                {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 7, color: 'var(--sand-3)', textTransform: 'uppercase' }}>Cardholder</div>
                  <div style={{ fontFamily: F, fontSize: '0.72rem', color: 'var(--sand-2)', fontWeight: 600 }}>
                    {cardName ? cardName.toUpperCase() : 'VALUED GUEST'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 7, color: 'var(--sand-3)', textTransform: 'uppercase' }}>Expires</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--sand-2)' }}>
                    {cardExpiry ? cardExpiry : 'MM/YY'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontFamily: F, fontSize: '0.75rem', color: 'var(--sand-2)', marginBottom: 6 }}>Cardholder Name</label>
              <input
                type="text"
                required
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="JOHN DOE"
                style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.3)', color: '#fff', outline: 'none', fontFamily: F, fontSize: '0.88rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: F, fontSize: '0.75rem', color: 'var(--sand-2)', marginBottom: 6 }}>Card Number</label>
              <input
                type="text"
                required
                maxLength={19}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="4000 1234 5678 9010"
                style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.3)', color: '#fff', outline: 'none', fontFamily: F, fontSize: '0.88rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: F, fontSize: '0.75rem', color: 'var(--sand-2)', marginBottom: 6 }}>Expiry Date</label>
              <input
                type="text"
                required
                maxLength={5}
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="MM/YY"
                style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.3)', color: '#fff', outline: 'none', fontFamily: F, fontSize: '0.88rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: F, fontSize: '0.75rem', color: 'var(--sand-2)', marginBottom: 6 }}>Security Code (CVV)</label>
              <input
                type="text"
                required
                maxLength={4}
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                placeholder="123"
                style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.3)', color: '#fff', outline: 'none', fontFamily: F, fontSize: '0.88rem' }}
              />
            </div>
          </div>

          {/* Payment Error */}
          {paymentError && (
            <div style={{ background: 'rgba(239, 71, 111, 0.1)', border: '1px solid #ef476f', color: '#ef476f', padding: '12px 16px', marginBottom: 20, fontFamily: F, fontSize: '0.85rem', textAlign: 'center' }}>
              ⚠️ {paymentError}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{
                fontFamily: F,
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.25)',
                color: 'var(--sand-2)',
                padding: '10px 20px',
                cursor: 'pointer',
              }}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isPaying}
              style={{
                fontFamily: F,
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                background: 'linear-gradient(90deg, #ffd166, var(--gold))',
                border: 'none',
                color: 'var(--navy)',
                padding: '10px 24px',
                cursor: 'pointer',
                opacity: isPaying ? 0.6 : 1,
                boxShadow: '0 4px 15px rgba(201, 168, 76, 0.3)'
              }}
            >
              {isPaying ? 'Authorizing Mock payment...' : `Pay $${calculatedPrice} Securely`}
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Success Confirmation */}
      {step === 3 && (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎉</div>
          
          <h3 className="font-heading" style={{ fontSize: '1.6rem', color: '#06d6a0', marginBottom: 10 }}>
            Booking Confirmed &amp; Invoice Generated!
          </h3>
          
          <p style={{ fontFamily: F, fontSize: '0.92rem', color: 'var(--sand-2)', maxWidth: 500, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Thank you, <strong style={{ color: '#fff' }}>{customerName}</strong>! Your reservation is safely secured in our SQLite database. An email invoice receipt has been compiled.
          </p>

          {/* Reference panel */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.25)', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 440, margin: '0 auto 28px', textAlign: 'left' }}>
            <div>
              <div style={{ fontFamily: F, fontSize: '0.62rem', color: 'var(--sand-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Booking Reference</div>
              <div style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#fff', fontWeight: 700, marginTop: 4 }}>
                {bookingRef}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: F, fontSize: '0.62rem', color: 'var(--sand-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email Output Saved</div>
              <div style={{ fontFamily: F, fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 600, marginTop: 4, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {localReceiptPath.split('/').pop()}
              </div>
            </div>
          </div>

          <blockquote style={{ fontSize: '0.8rem', color: 'var(--sand-3)', background: 'rgba(201,168,76,0.06)', borderLeft: '3px solid var(--gold)', padding: '10px 14px', maxWidth: 440, margin: '0 auto 28px', textAlign: 'left', lineHeight: 1.5 }}>
            💡 <strong>Email Simulator:</strong> Since this is a local environment, we have saved the beautiful HTML invoice receipt directly to your server: <code style={{ color: '#fff', fontSize: '0.78rem' }}>backend/uploads/emails/booking_{bookingId}_paid.html</code>. Feel free to open it in your browser!
          </blockquote>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/201211385550?text=Hi%2C%20I%20have%20booking%20reference%20${bookingRef}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: F,
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                background: '#06d6a0',
                border: 'none',
                color: 'var(--navy)',
                padding: '12px 24px',
                cursor: 'pointer',
                textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(6, 214, 160, 0.3)'
              }}
            >
              💬 Message Agency on WhatsApp
            </a>
            <button
              onClick={onCancel}
              style={{
                fontFamily: F,
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(201,168,76,0.2)',
                color: 'var(--sand-2)',
                padding: '12px 24px',
                cursor: 'pointer',
              }}
            >
              Close Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

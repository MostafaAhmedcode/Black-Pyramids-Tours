'use client';

/**
 * Admin Login Page — /admin/login
 * ================================
 * Connects to the Python socket backend at localhost:8000.
 *
 * Flow:
 *  1. Page load   → GET /admin/csrf-token   (fetch a CSRF token)
 *  2. Form submit → POST /admin/login        (send credentials + CSRF)
 *  3. On success  → store session_id in localStorage, redirect to /admin/dashboard
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ─── tiny helpers ────────────────────────────────────────────
const F = 'var(--font-inter), Inter, system-ui, sans-serif';
const CIN = 'var(--font-cinzel), Cinzel, Georgia, serif';

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [csrfLoading, setCsrfLoading] = useState(true);

  const userRef = useRef<HTMLInputElement>(null);

  // ── On mount: check if already logged in ─────────────────
  useEffect(() => {
    const existing = localStorage.getItem('admin_session');
    if (existing) {
      router.replace('/admin/dashboard');
      return;
    }
    fetchCsrfToken();
    userRef.current?.focus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Step 1: Fetch a CSRF token from the backend ───────────
  async function fetchCsrfToken() {
    setCsrfLoading(true);
    try {
      const res = await fetch(`${API}/admin/csrf-token`);
      const json = await res.json();
      if (json.success && json.data?.csrf_token) {
        setCsrfToken(json.data.csrf_token);
      } else {
        setError('Could not reach the server. Is the backend running?');
      }
    } catch {
      setError(`Cannot connect to backend (${API}). Start the backend server or set NEXT_PUBLIC_API_URL.`);
    } finally {
      setCsrfLoading(false);
    }
  }

  // ── Step 2: Submit login form ─────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      triggerShake('Please fill in both fields.');
      return;
    }
    if (!csrfToken) {
      triggerShake('CSRF token missing. Refreshing…');
      fetchCsrfToken();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
          csrf_token: csrfToken,
        }),
      });

      const json = await res.json();

      if (json.success && json.data?.session_id) {
        // Store session token securely in localStorage
        localStorage.setItem('admin_session', json.data.session_id);
        localStorage.setItem('admin_username', json.data.username || 'admin');

        // Soft redirect to dashboard
        router.push('/admin/dashboard');
      } else {
        // Fetch a fresh CSRF token (the old one was consumed or rejected)
        fetchCsrfToken();
        triggerShake(json.message || 'Login failed. Please try again.');
      }
    } catch {
      fetchCsrfToken();
      triggerShake('Network error. Cannot reach the backend.');
    } finally {
      setLoading(false);
    }
  }

  function triggerShake(msg: string) {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 600);
  }

  return (
    <>
      <style>{`
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-10px); }
          40%       { transform: translateX( 10px); }
          60%       { transform: translateX(-6px);  }
          80%       { transform: translateX(  6px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0); }
          50%      { box-shadow: 0 0 40px 4px rgba(201,168,76,0.18); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(201,168,76,0.25);
          color: var(--sand);
          font-family: ${F};
          font-size: 0.95rem;
          padding: 14px 16px;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          box-sizing: border-box;
        }
        .input-field:focus {
          border-color: var(--gold);
          background: rgba(201,168,76,0.06);
          box-shadow: 0 0 0 3px rgba(201,168,76,0.1);
        }
        .input-field::placeholder { color: rgba(200,191,168,0.4); }
        .login-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #9a7228, #c9a84c, #e8c96a);
          border: none;
          color: var(--navy);
          font-family: ${F};
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.35s ease;
          position: relative;
          overflow: hidden;
        }
        .login-btn:hover:not(:disabled) {
          box-shadow: 0 8px 32px rgba(201,168,76,0.45);
          transform: translateY(-2px);
        }
        .login-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--sand-3);
          cursor: pointer;
          padding: 4px;
          font-size: 1.1rem;
          transition: color 0.2s;
          line-height: 1;
        }
        .eye-btn:hover { color: var(--gold); }
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(7,12,26,0.3);
          border-top-color: var(--navy);
          border-radius: 50%;
          display: inline-block;
          animation: spinSlow 0.75s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'var(--navy)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Background ambient glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(201,168,76,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Decorative pyramid silhouette */}
        <div style={{
          position: 'absolute', bottom: -20, left: '50%',
          transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '300px solid transparent',
          borderRight: '300px solid transparent',
          borderBottom: '220px solid rgba(201,168,76,0.03)',
          pointerEvents: 'none',
        }} />

        {/* ── Login Card ── */}
        <div style={{
          width: '100%',
          maxWidth: 440,
          animation: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both',
        }}>

          {/* Header icon */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              width: 72, height: 72,
              background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.04))',
              border: '1px solid rgba(201,168,76,0.35)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '2rem',
              animation: 'float 4s ease-in-out infinite',
            }}>
              🔺
            </div>
            <div style={{ fontFamily: CIN, fontSize: '1.65rem', fontWeight: 600, color: '#fff', marginBottom: 8, letterSpacing: '0.04em' }}>
              Admin Portal
            </div>
            <div style={{ fontFamily: F, fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)' }}>
              Venus Pyramids Inn
            </div>
          </div>

          {/* Card body */}
          <div style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(201,168,76,0.22)',
            padding: '40px 36px',
            animation: error ? 'shakeX 0.55s ease both' : 'none',
          }}>

            {/* Golden top bar */}
            <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', marginBottom: 32, marginTop: -40, marginLeft: -36, marginRight: -36 }} />

            {/* CSRF loading notice */}
            {csrfLoading && (
              <div style={{ textAlign: 'center', padding: '8px 0 16px', fontFamily: F, fontSize: '0.82rem', color: 'var(--sand-3)' }}>
                <span className="spinner" style={{width:14,height:14,display:'inline-block'}} /> Connecting to server…
              </div>
            )}

            {/* Error banner */}
            {error && !csrfLoading && (
              <div style={{
                background: 'rgba(220,50,50,0.1)',
                border: '1px solid rgba(220,50,50,0.35)',
                padding: '12px 16px',
                marginBottom: 20,
                fontFamily: F,
                fontSize: '0.85rem',
                color: '#ff8080',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
              }}>
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* Username */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 8 }}>
                  Username
                </label>
                <input
                  ref={userRef}
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  placeholder="admin"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="input-field"
                  disabled={loading || csrfLoading}
                  maxLength={64}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 28, position: 'relative' }}>
                <label style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 8 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="admin-password"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-field"
                    style={{ paddingRight: 48 }}
                    disabled={loading || csrfLoading}
                    maxLength={128}
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPass(v => !v)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="admin-login-btn"
                type="submit"
                className="login-btn"
                disabled={loading || csrfLoading || !csrfToken}
              >
                {loading ? (
                  <><span className="spinner" />Verifying…</>
                ) : (
                  'Sign In'
                )}
              </button>

            </form>

            {/* Bottom divider + hint */}
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(201,168,76,0.12)', textAlign: 'center' }}>
              <p style={{ fontFamily: F, fontSize: '0.78rem', color: 'var(--sand-3)' }}>
                🔒 Secured with bcrypt · CSRF protection · Rate limiting
              </p>
            </div>
          </div>

          {/* Back to site link */}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <a
              href="/"
              style={{ fontFamily: F, fontSize: '0.78rem', color: 'var(--sand-3)', textDecoration: 'none', letterSpacing: '0.08em', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--sand-3)')}
            >
              ← Return to Venus Pyramids Inn
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

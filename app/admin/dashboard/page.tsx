'use client';

/**
 * Admin Dashboard Page — /admin/dashboard
 * =========================================
 * Protected route — redirects to /admin/login if no session token.
 *
 * Features:
 *  - Welcome message with username
 *  - Live stats (visits, login attempts, files, sessions)
 *  - File upload panel (jpg, png, pdf — 5 MB max)
 *  - Uploaded files list with metadata
 *  - Server log viewer (last 100 events)
 *  - Logout button
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminRoomsTab from '../../../components/AdminRoomsTab';
import AdminToursTab from '../../../components/AdminToursTab';
import AdminBookingsTab from '../../../components/AdminBookingsTab';
import AdminStaffTab from '../../../components/AdminStaffTab';
import AdminHotelsTab from '../../../components/AdminHotelsTab';
import AdminTransfersTab from '../../../components/AdminTransfersTab';
import AdminContentTab from '../../../components/AdminContentTab';
import AdminCalendarTab from '../../../components/AdminCalendarTab';

const API = 'http://localhost:8000';
const F = 'var(--font-inter), Inter, system-ui, sans-serif';
const CIN = 'var(--font-cinzel), Cinzel, Georgia, serif';

// ─── Types ────────────────────────────────────────────────────
interface DashboardData {
  username: string;
  login_attempts_total: number;
  active_sessions: number;
  files_uploaded: number;
  visit_count: number;
  session_created: string;
  server_time: string;
}
interface FileEntry {
  filename: string;
  size_bytes: number;
  uploaded_at: string;
}
interface LogEntry {
  timestamp: string;
  level: string;
  event: string;
  ip: string;
  detail: string;
}

// ─── Active tab type ────────────────────────────────────────
type Tab = 'overview' | 'rooms' | 'tours' | 'bookings' | 'staff' | 'upload' | 'files' | 'logs' | 'hotels' | 'transfers' | 'content' | 'calendar';

export default function AdminDashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [uploadOk, setUploadOk] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // ── Auth helper: get the stored session token ─────────────
  function getToken(): string {
    return localStorage.getItem('admin_session') || '';
  }

  // ── Authenticated fetch wrapper ───────────────────────────
  const authFetch = useCallback(async (url: string, opts: RequestInit = {}) => {
    const token = getToken();
    return fetch(url, {
      ...opts,
      headers: {
        ...(opts.headers || {}),
        'Authorization': `Bearer ${token}`,
      },
    });
  }, []);

  // ── On mount: verify session, then load dashboard ─────────
  useEffect(() => {
    const token = localStorage.getItem('admin_session');
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    loadDashboard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setError('');
    try {
      const res = await authFetch(`${API}/admin/dashboard`);
      const json = await res.json();

      if (res.status === 401) {
        // Session expired or invalid
        localStorage.removeItem('admin_session');
        localStorage.removeItem('admin_username');
        router.replace('/admin/login');
        return;
      }

      if (json.success) {
        setDashData(json.data);
      } else {
        setError(json.message || 'Failed to load dashboard.');
      }
    } catch {
      setError('Cannot reach the backend. Is the Python server running?');
    } finally {
      setLoading(false);
    }
  }

  // ── Load files list ───────────────────────────────────────
  async function loadFiles() {
    try {
      const res = await authFetch(`${API}/files`);
      const json = await res.json();
      if (json.success) setFiles(json.data?.files || []);
    } catch {
      setFiles([]);
    }
  }

  // ── Load logs ─────────────────────────────────────────────
  async function loadLogs() {
    try {
      const res = await authFetch(`${API}/logs`);
      const json = await res.json();
      if (json.success) setLogs(json.data?.logs || []);
    } catch {
      setLogs([]);
    }
  }

  // ── Switch tabs + lazy-load data ─────────────────────────
  async function switchTab(tab: Tab) {
    setActiveTab(tab);
    if (tab === 'files') loadFiles();
    if (tab === 'logs') loadLogs();
    if (tab === 'overview') loadDashboard();
  }

  // ── Logout ────────────────────────────────────────────────
  async function handleLogout() {
    try {
      await authFetch(`${API}/admin/logout`, { method: 'POST' });
    } catch { /* ignore */ }
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_username');
    router.replace('/admin/login');
  }

  // ── File upload ───────────────────────────────────────────
  async function handleUpload() {
    if (!uploadFile) {
      setUploadMsg('Please select a file first.');
      setUploadOk(false);
      return;
    }

    setUploading(true);
    setUploadMsg('');

    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const token = getToken();
      const res = await fetch(`${API}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const json = await res.json();

      if (json.success) {
        setUploadOk(true);
        setUploadMsg(`✅ "${json.data?.original_name}" uploaded successfully (${formatBytes(json.data?.size_bytes)}).`);
        setUploadFile(null);
        // Refresh dashboard counts
        loadDashboard();
      } else {
        setUploadOk(false);
        setUploadMsg(`❌ ${json.message}`);
      }
    } catch {
      setUploadOk(false);
      setUploadMsg('❌ Upload failed. Check your connection.');
    } finally {
      setUploading(false);
    }
  }

  // ── Formatters ────────────────────────────────────────────
  function formatBytes(bytes: number = 0): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function logLevelColor(level: string): string {
    switch (level.toLowerCase()) {
      case 'error': return '#ff6b6b';
      case 'warn':  return '#ffd166';
      default:      return 'var(--sand-2)';
    }
  }

  function logLevelBg(level: string): string {
    switch (level.toLowerCase()) {
      case 'error': return 'rgba(220,50,50,0.08)';
      case 'warn':  return 'rgba(255,209,102,0.07)';
      default:      return 'transparent';
    }
  }

  // ── Loading screen ─────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 20, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</div>
          <p style={{ fontFamily: F, color: 'var(--sand-3)', fontSize: '0.9rem', letterSpacing: '0.1em' }}>Loading dashboard…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 500, textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontFamily: CIN, color: '#fff', marginBottom: 12 }}>Connection Error</h2>
          <p style={{ fontFamily: F, color: 'var(--sand-2)', marginBottom: 24, lineHeight: 1.7 }}>{error}</p>
          <button onClick={loadDashboard} className="btn-primary" style={{ marginRight: 12 }}>Retry</button>
          <button onClick={handleLogout} className="btn-secondary">Logout</button>
        </div>
      </div>
    );
  }

  const username = dashData?.username || localStorage.getItem('admin_username') || 'Admin';

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .dash-tab {
          font-family: ${F};
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 10px 20px;
          background: transparent;
          border: 1px solid rgba(201,168,76,0.2);
          color: var(--sand-3);
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
        }
        .dash-tab:hover { color: var(--gold); border-color: rgba(201,168,76,0.5); background: rgba(201,168,76,0.06); }
        .dash-tab.active { background: var(--gold); border-color: var(--gold); color: var(--navy); }
        .stat-card {
          background: linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(201,168,76,0.18);
          padding: 24px;
          animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
          transition: border-color 0.3s, transform 0.3s;
        }
        .stat-card:hover { border-color: rgba(201,168,76,0.45); transform: translateY(-4px); }
        .drop-zone {
          border: 2px dashed rgba(201,168,76,0.3);
          padding: 48px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s ease;
          background: rgba(255,255,255,0.02);
        }
        .drop-zone.over, .drop-zone:hover {
          border-color: var(--gold);
          background: rgba(201,168,76,0.06);
        }
        .log-row {
          display: grid;
          grid-template-columns: 180px 50px 160px 120px 1fr;
          gap: 12px;
          padding: 10px 14px;
          border-bottom: 1px solid rgba(201,168,76,0.06);
          font-family: ${F};
          font-size: 0.78rem;
          align-items: start;
          transition: background 0.15s;
        }
        .log-row:hover { background: rgba(255,255,255,0.025); }
        @media (max-width: 800px) {
          .log-row { grid-template-columns: 1fr; gap: 2px; }
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .stat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>

        {/* ── Top Nav ─────────────────────────────────────── */}
        <nav style={{
          background: 'rgba(7,12,26,0.97)',
          borderBottom: '1px solid rgba(201,168,76,0.18)',
          padding: '0 24px',
          position: 'sticky', top: 0, zIndex: 100,
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.4rem' }}>🔺</span>
              <div>
                <div style={{ fontFamily: CIN, fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Admin Dashboard</div>
                <div style={{ fontFamily: F, fontSize: '0.62rem', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Venus Pyramids Inn</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontFamily: F, fontSize: '0.8rem', color: 'var(--sand-3)' }}>
                👤 {username}
              </div>
              <a href="/" style={{ fontFamily: F, fontSize: '0.7rem', color: 'var(--sand-3)', textDecoration: 'none', letterSpacing: '0.1em', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--sand-3)')}>
                ← Site
              </a>
              <button
                id="logout-btn"
                onClick={handleLogout}
                style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '8px 18px', background: 'rgba(220,50,50,0.12)', border: '1px solid rgba(220,50,50,0.35)', color: '#ff8080', cursor: 'pointer', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,50,50,0.22)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,50,50,0.12)'; }}
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>

          {/* ── Welcome Banner ──────────────────────────── */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.03) 100%)',
            border: '1px solid rgba(201,168,76,0.3)',
            padding: '28px 32px',
            marginBottom: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
            animation: 'fadeUp 0.5s ease both',
          }}>
            <div>
              <div style={{ fontFamily: F, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>Admin Panel</div>
              <h1 style={{ fontFamily: CIN, fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#fff', marginBottom: 4, fontWeight: 600 }}>
                Welcome, {username} 👋
              </h1>
              <p style={{ fontFamily: F, fontSize: '0.85rem', color: 'var(--sand-3)' }}>
                Session started: {dashData?.session_created} · Server: {dashData?.server_time}
              </p>
            </div>
            <button onClick={loadDashboard} style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '10px 20px', background: 'transparent', border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)', cursor: 'pointer', transition: 'all 0.25s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              ↻ Refresh
            </button>
          </div>

          {/* ── Tabs ────────────────────────────────────── */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
            {(['overview', 'rooms', 'tours', 'bookings', 'staff', 'hotels', 'transfers', 'content', 'calendar', 'upload', 'files', 'logs'] as Tab[]).map(tab => (
              <button
                key={tab}
                id={`tab-${tab}`}
                onClick={() => switchTab(tab)}
                className={`dash-tab${activeTab === tab ? ' active' : ''}`}
              >
                {tab === 'overview' && '📊 Overview'}
                {tab === 'rooms'    && '🛏️ Rooms'}
                {tab === 'tours'    && '🏺 Tours'}
                {tab === 'bookings' && '📅 Bookings'}
                {tab === 'staff'    && '👥 Team'}
                {tab === 'hotels'   && '🏨 Hotels'}
                {tab === 'transfers' && '🚐 Transfers'}
                {tab === 'content'  && '✏️ Content'}
                {tab === 'calendar' && '📆 Calendar'}
                {tab === 'upload'   && '📤 Upload'}
                {tab === 'files'    && '📁 Files'}
                {tab === 'logs'     && '📋 Logs'}
              </button>
            ))}
          </div>

          {/* ══════════════════════════════════════════════
              TAB: OVERVIEW
          ══════════════════════════════════════════════ */}
          {activeTab === 'overview' && dashData && (
            <div>
              {/* Stat cards */}
              <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
                {[
                  { icon: '👁️', label: 'Total Visits', value: dashData.visit_count, delay: '0ms', color: '#7ec8e3' },
                  { icon: '🔐', label: 'Login Attempts', value: dashData.login_attempts_total, delay: '80ms', color: '#ffd166' },
                  { icon: '📁', label: 'Files Uploaded', value: dashData.files_uploaded, delay: '160ms', color: '#06d6a0' },
                  { icon: '🟢', label: 'Active Sessions', value: dashData.active_sessions, delay: '240ms', color: '#c9a84c' },
                ].map(s => (
                  <div key={s.label} className="stat-card" style={{ animationDelay: s.delay }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>{s.icon}</div>
                    <div style={{ fontFamily: F, fontSize: '2rem', fontWeight: 700, color: s.color, marginBottom: 4 }}>
                      {s.value}
                    </div>
                    <div style={{ fontFamily: F, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--sand-3)' }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Security info */}
              <div style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid rgba(201,168,76,0.15)', padding: '28px 24px' }}>
                <div style={{ fontFamily: F, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 18 }}>🛡️ Security Status</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  {[
                    { label: 'Password storage', value: 'bcrypt (cost=12)', ok: true },
                    { label: 'Session tokens', value: '256-bit random hex', ok: true },
                    { label: 'CSRF protection', value: 'Single-use tokens', ok: true },
                    { label: 'Rate limiting', value: 'Max 5 attempts / 15 min', ok: true },
                    { label: 'Input sanitization', value: 'HTML-escaped + trimmed', ok: true },
                    { label: 'File upload guard', value: 'Extension + magic bytes', ok: true },
                  ].map(s => (
                    <div key={s.label} style={{ display: 'flex', alignItems: 'start', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(201,168,76,0.06)' }}>
                      <span style={{ color: s.ok ? '#06d6a0' : '#ff6b6b', fontSize: '0.9rem', flexShrink: 0 }}>{s.ok ? '✓' : '✗'}</span>
                      <div>
                        <div style={{ fontFamily: F, fontSize: '0.78rem', color: 'var(--sand-2)', fontWeight: 500 }}>{s.label}</div>
                        <div style={{ fontFamily: F, fontSize: '0.72rem', color: 'var(--sand-3)' }}>{s.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════
              TAB: ROOMS
          ══════════════════════════════════════════════ */}
          {activeTab === 'rooms' && (
            <AdminRoomsTab getToken={getToken} />
          )}

          {/* ══════════════════════════════════════════════
              TAB: TOURS
          ══════════════════════════════════════════════ */}
          {activeTab === 'tours' && (
            <AdminToursTab getToken={getToken} />
          )}

          {/* ══════════════════════════════════════════════
              TAB: BOOKINGS
          ══════════════════════════════════════════════ */}
          {activeTab === 'bookings' && (
            <AdminBookingsTab getToken={getToken} />
          )}

          {/* ══════════════════════════════════════════════
              TAB: STAFF / TEAM
          ══════════════════════════════════════════════ */}
          {activeTab === 'staff' && (
            <AdminStaffTab getToken={getToken} />
          )}

          {activeTab === 'hotels' && (
            <AdminHotelsTab getToken={getToken} />
          )}

          {activeTab === 'transfers' && (
            <AdminTransfersTab getToken={getToken} />
          )}

          {activeTab === 'content' && (
            <AdminContentTab getToken={getToken} />
          )}

          {activeTab === 'calendar' && (
            <AdminCalendarTab getToken={getToken} />
          )}

          {/* ══════════════════════════════════════════════
              TAB: UPLOAD
          ══════════════════════════════════════════════ */}
          {activeTab === 'upload' && (
            <div style={{ maxWidth: 600 }}>
              <div style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(201,168,76,0.2)', padding: '36px', animation: 'fadeUp 0.4s ease both' }}>
                <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}>Upload File</div>

                {/* Drop zone */}
                <label
                  className={`drop-zone${dragOver ? ' over' : ''}`}
                  style={{ display: 'block', cursor: 'pointer' }}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setDragOver(false);
                    const f = e.dataTransfer.files[0];
                    if (f) { setUploadFile(f); setUploadMsg(''); }
                  }}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const f = e.target.files?.[0] || null;
                      setUploadFile(f);
                      setUploadMsg('');
                    }}
                  />
                  <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>
                    {uploadFile ? '📄' : '🗂️'}
                  </div>
                  {uploadFile ? (
                    <div>
                      <div style={{ fontFamily: F, fontSize: '0.9rem', color: 'var(--sand)', fontWeight: 500, marginBottom: 4 }}>{uploadFile.name}</div>
                      <div style={{ fontFamily: F, fontSize: '0.78rem', color: 'var(--sand-3)' }}>{formatBytes(uploadFile.size)}</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontFamily: F, fontSize: '0.9rem', color: 'var(--sand-2)', marginBottom: 6 }}>Drop a file here or click to browse</div>
                      <div style={{ fontFamily: F, fontSize: '0.72rem', color: 'var(--sand-3)' }}>Allowed: JPG · PNG · PDF · Max 5 MB</div>
                    </div>
                  )}
                </label>

                {uploadMsg && (
                  <div style={{
                    marginTop: 16, padding: '12px 16px',
                    background: uploadOk ? 'rgba(6,214,160,0.08)' : 'rgba(220,50,50,0.08)',
                    border: `1px solid ${uploadOk ? 'rgba(6,214,160,0.3)' : 'rgba(220,50,50,0.3)'}`,
                    fontFamily: F, fontSize: '0.85rem',
                    color: uploadOk ? '#06d6a0' : '#ff8080',
                  }}>
                    {uploadMsg}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  <button
                    id="upload-btn"
                    onClick={handleUpload}
                    disabled={!uploadFile || uploading}
                    className="btn-primary"
                    style={{ flex: 1 }}
                  >
                    {uploading ? '⏳ Uploading…' : '📤 Upload File'}
                  </button>
                  {uploadFile && (
                    <button onClick={() => { setUploadFile(null); setUploadMsg(''); }} className="btn-secondary" style={{ padding: '14px 20px' }}>Clear</button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════
              TAB: FILES
          ══════════════════════════════════════════════ */}
          {activeTab === 'files' && (
            <div style={{ animation: 'fadeUp 0.4s ease both' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                  {files.length} File{files.length !== 1 ? 's' : ''} stored
                </div>
                <button onClick={loadFiles} style={{ fontFamily: F, fontSize: '0.68rem', fontWeight: 600, color: 'var(--sand-3)', background: 'none', border: '1px solid rgba(201,168,76,0.2)', padding: '6px 14px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--sand-3)')}>
                  ↻ Refresh
                </button>
              </div>

              {files.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 0', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.12)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📂</div>
                  <p style={{ fontFamily: F, fontSize: '0.9rem', color: 'var(--sand-3)' }}>No files uploaded yet.</p>
                </div>
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.15)', overflow: 'hidden' }}>
                  {/* Header */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 180px', gap: 12, padding: '10px 16px', background: 'rgba(201,168,76,0.06)', borderBottom: '1px solid rgba(201,168,76,0.18)' }}>
                    {['Filename', 'Size', 'Uploaded'].map(h => (
                      <div key={h} style={{ fontFamily: F, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)' }}>{h}</div>
                    ))}
                  </div>
                  {files.map((f, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 180px', gap: 12, padding: '12px 16px', borderBottom: '1px solid rgba(201,168,76,0.06)', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--sand-2)', wordBreak: 'break-all' }}>{f.filename}</div>
                      <div style={{ fontFamily: F, fontSize: '0.82rem', color: 'var(--sand-3)' }}>{formatBytes(f.size_bytes)}</div>
                      <div style={{ fontFamily: F, fontSize: '0.78rem', color: 'var(--sand-3)' }}>{f.uploaded_at}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════
              TAB: LOGS
          ══════════════════════════════════════════════ */}
          {activeTab === 'logs' && (
            <div style={{ animation: 'fadeUp 0.4s ease both' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontFamily: F, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                  Last {logs.length} events
                </div>
                <button onClick={loadLogs} style={{ fontFamily: F, fontSize: '0.68rem', fontWeight: 600, color: 'var(--sand-3)', background: 'none', border: '1px solid rgba(201,168,76,0.2)', padding: '6px 14px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--sand-3)')}>
                  ↻ Refresh
                </button>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.15)', overflow: 'hidden' }}>
                {/* Header */}
                <div className="log-row" style={{ background: 'rgba(201,168,76,0.06)', borderBottom: '1px solid rgba(201,168,76,0.18)', color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.62rem' }}>
                  <span>Timestamp</span>
                  <span>Level</span>
                  <span>Event</span>
                  <span>IP</span>
                  <span>Detail</span>
                </div>

                {logs.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', fontFamily: F, fontSize: '0.9rem', color: 'var(--sand-3)' }}>No logs yet.</div>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="log-row" style={{ background: logLevelBg(log.level) }}>
                      <span style={{ color: 'var(--sand-3)', fontFamily: 'monospace' }}>{log.timestamp}</span>
                      <span style={{ color: logLevelColor(log.level), fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>{log.level}</span>
                      <span style={{ color: 'var(--sand)', fontWeight: 500 }}>{log.event}</span>
                      <span style={{ color: 'var(--sand-3)', fontFamily: 'monospace' }}>{log.ip}</span>
                      <span style={{ color: 'var(--sand-2)' }}>{log.detail}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

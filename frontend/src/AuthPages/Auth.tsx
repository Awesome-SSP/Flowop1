import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import img from '../assets/image.png';

type User = {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
};

type Role = {
  id: string;
  name: string;
  description?: string | null;
};

const API = 'http://localhost:5000';

function decodeJwt(token: string): any | null {
  try {
    const parts = (token || '').split('.');
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = payload.length % 4;
    const padded = pad ? payload + '='.repeat(4 - pad) : payload;
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('token');
  const setToken = (t: string) => localStorage.setItem('token', t);
  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('selectedRole');
    setUser(null);
    setRoles([]);
    setSelectedRoleId(null);
  };

  // explicit logout handler that redirects to the login page
  function handleLogout() {
    // clear auth state + storage
    clearAuth();
    // reset form state and errors so login screen is fresh
    setEmail('');
    setPassword('');
    setError(null);
    // navigate to login route and replace history entry
    navigate('/login', { replace: true });
  }

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    (async () => {
      setLoading(true);
      try {
        const payload = decodeJwt(token);
        if (payload) {
          setUser({
            id: payload.id,
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
          });
        }
        await loadRoles(token);
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadRoles(token: string) {
    try {
      const r = await fetch(`${API}/api/auth/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.status === 401) {
        clearAuth();
        return;
      }
      if (!r.ok) {
        setRoles([]);
        return;
      }
      const data = await r.json();
      const list: Role[] = Array.isArray(data) ? data : (data.roles ?? []);
      setRoles(list);
      if (list.length >= 1) setSelectedRoleId(list[0].id);
    } catch {
      setRoles([]);
    }
  }

  async function handleLogin(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) {
        setError(body.error || 'Login failed');
        return;
      }
      const token = body.token;
      if (!token) {
        setError('No token returned');
        return;
      }
      setToken(token);
      const u: User = body.user ?? decodeJwt(token) ?? { email };
      setUser(u);
      await loadRoles(token);
    } catch (err: any) {
      setError(err?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  async function handleProceed() {
    setError(null);
    if (!selectedRoleId) {
      setError('Select a role to continue');
      return;
    }
    const selected = roles.find((r) => r.id === selectedRoleId);
    if (!selected) {
      setError('Selected role not found');
      return;
    }

    const token = getToken();
    if (!token) {
      setError('Missing session token');
      return;
    }

    try {
      const res = await fetch(`${API}/api/auth/validate-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: selected.name }), // adjust payload if your backend expects { roleId }
      });

      const ct = res.headers.get('content-type') || '';
      const body = ct.includes('application/json') ? await res.json().catch(() => ({})) : await res.text().catch(() => '');

      if (!res.ok) {
        // surface useful message
        const msg = (body && (body.error || body.message)) || (typeof body === 'string' ? body : `Request failed: ${res.status}`);
        if (res.status === 401) clearAuth();
        console.error('validate-role error', res.status, body);
        setError(msg);
        return;
      }

      // expect { hasRole: true }
      if (!body || body.hasRole !== true) {
        setError(body?.hasRole === false ? 'You do not have the selected role' : 'Unexpected server response');
        return;
      }

      localStorage.setItem('selectedRole', JSON.stringify(selected));
      navigate('/dashboard');
    } catch (err: any) {
      console.error('validate-role request failed', err);
      setError(err?.message || 'Network error');
    }
  }

  // Styles: full-bleed image, left pane 40% with simple bluish tint and high text contrast
  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundImage: `url(${img})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  };

  const leftStyle: React.CSSProperties = {
    flex: '0 0 40%',
    minWidth: 360,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px 40px',
    boxSizing: 'border-box',
    // subtle bluish panel that is merged (no card)
    background: 'linear-gradient(90deg, rgba(8,40,80,0.78), rgba(25,90,150,0.58))',
    color: '#ffffff',
  };

  const contentStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 420,
  };

  const headingStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
    color: '#ffffff',
  };

  const subStyle: React.CSSProperties = {
    marginTop: 6,
    marginBottom: 20,
    color: 'rgba(255,255,255,0.88)',
    fontSize: 14,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 6,
    color: 'rgba(255,255,255,0.92)',
    fontSize: 13,
    fontWeight: 600,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: 'none',
    boxSizing: 'border-box',
    fontSize: 14,
    outline: 'none',
    background: 'rgba(255,255,255,0.95)',
    color: '#04293a',
  };

  const btnPrimary: React.CSSProperties = {
    padding: '12px 14px',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(90deg,#1e88e5,#0b54a9)',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: 15,
  };

  // small variant for inline actions (e.g. Continue after role select)
  const btnPrimarySmall: React.CSSProperties = {
    ...btnPrimary,
    width: 'auto',
    padding: '10px 16px',
    minWidth: 120,
  };

  const btnRow: React.CSSProperties = {
    display: 'flex',
    gap: 12,
    marginTop: 12,
  };

  const ghostBtn: React.CSSProperties = {
    flex: 1,
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'transparent',
    color: 'rgba(255,255,255,0.95)',
    cursor: 'pointer',
    fontWeight: 600,
  };

  // smaller logout button variant
  const logoutBtn: React.CSSProperties = {
    padding: '8px 10px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'transparent',
    color: 'rgba(255,255,255,0.95)',
    cursor: 'pointer',
    fontWeight: 600,
    width: 'auto',
    minWidth: 88,
  };

  const rightStyle: React.CSSProperties = {
    flex: '1 1 60%',
    minHeight: '100vh',
    // keep the right side purely background image — no overlay
  };

  return (
    <div style={pageStyle}>
      <aside style={leftStyle} aria-label="Sign in panel">
        <div style={contentStyle}>
          {!user ? (
            <>
              <div>
                <h1 style={headingStyle}>Flowop</h1>
                <div style={subStyle}>Sign in to your workspace</div>
              </div>

              <form onSubmit={handleLogin} style={{ display: 'grid', gap: 12 }}>
                <div>
                  <label style={labelStyle} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    style={inputStyle}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label style={labelStyle} htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    style={inputStyle}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>

                {error && <div style={{ color: '#ffd2d2', fontWeight: 600 }}>{error}</div>}

                <div style={btnRow}>
                  <button type="submit" style={btnPrimarySmall} disabled={loading}>
                    {loading ? 'Signing in…' : 'Sign in'}
                  </button>
                </div>

                <div style={{ marginTop: 8, color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>
                  Tip: seeded users use password <strong style={{ color: '#fff' }}>Password123!</strong>
                </div>
              </form>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 20,
                  }}
                >
                  {(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                </div>
                <div>
                  <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>
                    {user.firstName ?? user.email}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>Choose your active role</div>
                </div>
              </div>

              <div style={{ marginTop: 8 }}>
                <label style={labelStyle}>Role</label>
                <select
                  value={selectedRoleId ?? ''}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  style={{ ...inputStyle, padding: '10px 12px', appearance: 'none', background: '#fff' }}
                >
                  <option value="" disabled>
                    -- Select role --
                  </option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                      {r.description ? ` — ${r.description}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {error && <div style={{ color: '#ffd2d2', fontWeight: 600, marginTop: 8 }}>{error}</div>}

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button onClick={handleProceed} style={btnPrimarySmall}>
                  Continue
                </button>
                <button onClick={handleLogout} style={logoutBtn}>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

      <div style={rightStyle} aria-hidden />
    </div>
  );
}
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

  function handleLogout() {
    clearAuth();
    setEmail('');
    setPassword('');
    setError(null);
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
        body: JSON.stringify({ role: selected.name }),
      });

      const ct = res.headers.get('content-type') || '';
      const body = ct.includes('application/json') ? await res.json().catch(() => ({})) : await res.text().catch(() => '');

      if (!res.ok) {
        const msg = (body && (body.error || body.message)) || (typeof body === 'string' ? body : `Request failed: ${res.status}`);
        if (res.status === 401) clearAuth();
        console.error('validate-role error', res.status, body);
        setError(msg);
        return;
      }

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
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const leftStyle: React.CSSProperties = {
    flex: '0 0 35%',
    minWidth: 400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.92)',
    borderRight: '1px solid rgba(226,232,240,0.5)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  };

  const contentStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 420,
  };

  const brandStyle: React.CSSProperties = {
    textAlign: 'center' as const,
    marginBottom: '48px',
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '36px',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '12px',
    letterSpacing: '-0.02em',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const headingStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '28px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '8px',
  };

  const subStyle: React.CSSProperties = {
    color: '#64748b',
    fontSize: '16px',
    fontWeight: 400,
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  };

  const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  };

  const labelStyle: React.CSSProperties = {
    color: '#374151',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.5px',
  };

  const inputStyle: React.CSSProperties = {
    padding: '16px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    fontSize: '16px',
    outline: 'none',
    background: 'white',
    color: '#1e293b',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  };

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: '#1e88e5',
    boxShadow: '0 0 0 3px rgba(30, 136, 229, 0.1)',
  };

  const btnPrimaryStyle: React.CSSProperties = {
    padding: '16px 24px',
    borderRadius: '8px',
    border: 'none',
    background: '#1e88e5',
    color: 'white',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(30, 136, 229, 0.2)',
  };

  const btnSecondaryStyle: React.CSSProperties = {
    padding: '14px 24px',
    borderRadius: '8px',
    border: '2px solid #d1d5db',
    background: 'transparent',
    color: '#6b7280',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const errorStyle: React.CSSProperties = {
    color: '#ef4444',
    fontSize: '14px',
    fontWeight: 500,
    padding: '12px 16px',
    background: '#fef2f2',
    borderRadius: '8px',
    border: '1px solid #fecaca',
  };

  const tipStyle: React.CSSProperties = {
    textAlign: 'center' as const,
    color: '#64748b',
    fontSize: '14px',
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  };

  const userCardStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: 'white',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  };

  const avatarStyle: React.CSSProperties = {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    background: '#1e88e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '24px',
    fontWeight: 700,
  };

  const buttonsRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  };

  const rightStyle: React.CSSProperties = {
    flex: '1 1 65%',
    minHeight: '100vh',
    position: 'relative' as const,
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(30, 136, 229, 0.1) 0%, rgba(21, 101, 192, 0.05) 100%)',
  };

  return (
    <div style={pageStyle}>
      <aside style={leftStyle}>
        <div style={contentStyle}>
          {!user ? (
            <>
              <div style={brandStyle}>
                <div style={logoStyle}>Flowops</div>
                <h1 style={headingStyle}>Welcome Back</h1>
                <p style={subStyle}>Sign in to access your workspace</p>
              </div>

              <form onSubmit={handleLogin} style={formStyle}>
                <div style={fieldStyle}>
                  <label style={labelStyle} htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    style={inputStyle}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle} htmlFor="password">Password</label>
                  <input
                    id="password"
                    style={inputStyle}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>

                {error && <div style={errorStyle}>{error}</div>}

                <button 
                  type="submit" 
                  style={btnPrimaryStyle} 
                  disabled={loading}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#1565c0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#1e88e5';
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <div style={tipStyle}>
                  💡 <strong>Demo Tip:</strong> Use password <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>Password123!</code>
                </div>
              </form>
            </>
          ) : (
            <>
              <div style={brandStyle}>
                <div style={logoStyle}>Flowops</div>
                <h1 style={headingStyle}>Choose Your Role</h1>
                <p style={subStyle}>Select your workspace role to continue</p>
              </div>

              <div style={userCardStyle}>
                <div style={avatarStyle}>
                  {(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email}
                  </div>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>
                    {user.email}
                  </div>
                </div>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Select Role</label>
                <select
                  value={selectedRoleId ?? ''}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="" disabled>Choose your role...</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}{r.description ? ` — ${r.description}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {error && <div style={errorStyle}>{error}</div>}

              <div style={buttonsRowStyle}>
                <button 
                  onClick={handleProceed} 
                  style={{ ...btnPrimaryStyle, flex: 1 }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#1565c0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#1e88e5';
                  }}
                >
                  Continue
                </button>
                <button 
                  onClick={handleLogout} 
                  style={btnSecondaryStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#374151';
                    e.currentTarget.style.borderColor = '#9ca3af';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#6b7280';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                >
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

      <div style={rightStyle}>
        <div style={overlayStyle} />
      </div>
    </div>
  );
}
import React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';

import { AppDispatch } from '../redux/store';
import { logged } from '../redux/actions/UserAction';
import { getWishList } from '../redux/actions/WishesActions';
import { fetchingAddresses } from '../redux/actions/AddressAction';
import { fetchingPayments } from '../redux/actions/PaymentAction';
import { isDecodedUser } from '../utils/type-guards';
import { apiWithoutAuth } from '../utils/api';
import { getTokenFromLocalStorage } from '../utils/token';

interface LoginProps {
  /** Called after a successful login or signup — use to close the parent overlay */
  onSuccess?: () => void;
}

type Tab = 'signin' | 'signup';

const EMPTY_REGISTER = {
  username: '',
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  password: '',
};

// ── Inline toast helpers (intentional: handleToast utility lacks typed API) ──
const toastError   = (msg: string) => toast.error(msg,  { position: 'top-center', duration: 2500 });
const toastSuccess = (msg: string) => toast.success(msg, { position: 'top-center', duration: 2000, style: { background: '#111', color: '#fff' } });

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [tab,             setTab]             = React.useState<Tab>('signin');
  const [username,        setUsername]        = React.useState('');
  const [password,        setPassword]        = React.useState('');
  const [showPassword,    setShowPassword]    = React.useState(false);
  const [newUser,         setNewUser]         = React.useState(EMPTY_REGISTER);
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading,         setLoading]         = React.useState(false);

  // ── Shared post-auth bootstrap ──────────────────────────────
  const bootstrapSession = () => {
    // getTokenFromLocalStorage decodes the JWT and saves decodedUser to localStorage
    getTokenFromLocalStorage();
    const raw = localStorage.getItem('decodedUser');
    if (!raw) return;
    const parsed: unknown = JSON.parse(raw);
    if (!isDecodedUser(parsed)) return;
    dispatch(logged(parsed));
    dispatch(getWishList(parsed.user_id));
    dispatch(fetchingAddresses(parsed.user_id));
    dispatch(fetchingPayments(parsed.user_id));
    onSuccess?.();
  };

  // ── Sign in ─────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!username.trim() || !password) { toastError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const res = await apiWithoutAuth.post('/users/signin', { username, password });
      localStorage.setItem('token', res.data);
      bootstrapSession();
      toastSuccess(`Welcome back, ${username.charAt(0).toUpperCase() + username.slice(1)}!`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: string } })?.response?.data;
      toastError(msg || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  // ── Sign up ─────────────────────────────────────────────────
  const handleRegister = async () => {
    const { username: u, firstname, lastname, email, phone, password: p } = newUser;
    if (!u || !firstname || !lastname || !email || !phone || !p) {
      toastError('Please fill in all fields'); return;
    }
    if (p !== confirmPassword) { toastError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const res = await apiWithoutAuth.post('/users/signup', newUser);
      localStorage.setItem('token', res.data);
      bootstrapSession();
      toastSuccess('Account created — welcome!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: string } })?.response?.data;
      toastError(msg || 'Registration failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') tab === 'signin' ? handleLogin() : handleRegister();
  };

  return (
    <div style={{ padding: 'var(--space-6) var(--space-8)', maxWidth: 420, margin: '0 auto' }} onKeyDown={handleKeyDown}>

      {/* Tabs */}
      <div className="stride-tabs" style={{ marginBottom: 'var(--space-6)' }}>
        <button
          className={`stride-tab${tab === 'signin' ? ' is-active' : ''}`}
          onClick={() => setTab('signin')}
        >
          Sign in
        </button>
        <button
          className={`stride-tab${tab === 'signup' ? ' is-active' : ''}`}
          onClick={() => setTab('signup')}
        >
          Create account
        </button>
      </div>

      {/* ── Sign in form ─────────────────────────────────────── */}
      {tab === 'signin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="stride-field">
            <label htmlFor="login-username">Username</label>
            <input
              id="login-username"
              className="stride-input"
              placeholder="Enter your username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="stride-field">
            <label htmlFor="login-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                className="stride-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((s) => !s)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-fg-muted)' }}
              >
                <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>
          <button
            className="stride-btn stride-btn--primary"
            style={{ width: '100%', marginTop: 'var(--space-2)' }}
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      )}

      {/* ── Sign up form ─────────────────────────────────────── */}
      {tab === 'signup' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <div className="stride-field">
              <label htmlFor="reg-firstname">First name</label>
              <input
                id="reg-firstname"
                className="stride-input"
                placeholder="First name"
                value={newUser.firstname}
                onChange={(e) => setNewUser({ ...newUser, firstname: e.target.value })}
              />
            </div>
            <div className="stride-field">
              <label htmlFor="reg-lastname">Last name</label>
              <input
                id="reg-lastname"
                className="stride-input"
                placeholder="Last name"
                value={newUser.lastname}
                onChange={(e) => setNewUser({ ...newUser, lastname: e.target.value })}
              />
            </div>
          </div>
          <div className="stride-field">
            <label htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              className="stride-input"
              placeholder="Choose a username"
              autoComplete="username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />
          </div>
          <div className="stride-field">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              className="stride-input"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </div>
          <div className="stride-field">
            <label htmlFor="reg-phone">Phone</label>
            <input
              id="reg-phone"
              className="stride-input"
              type="tel"
              placeholder="+1 555 000 0000"
              autoComplete="tel"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            />
          </div>
          <div className="stride-field">
            <label htmlFor="reg-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
                className="stride-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((s) => !s)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-fg-muted)' }}
              >
                <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>
          <div className="stride-field">
            <label htmlFor="reg-confirm">Confirm password</label>
            <input
              id="reg-confirm"
              className="stride-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            className="stride-btn stride-btn--primary"
            style={{ width: '100%', marginTop: 'var(--space-2)' }}
            disabled={loading}
            onClick={handleRegister}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </div>
      )}

      {/* Footer note */}
      <p style={{ marginTop: 'var(--space-5)', fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)', textAlign: 'center' }}>
        Google sign-in is not available yet.
      </p>
    </div>
  );
};

export default Login;

import React, { useEffect, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { AppDispatch, RootState } from '../../redux/store';
import { UserAddress, UserFromDB, UserPayment } from '../../interfaces/user/UserType';
import ProfileAndAddress from './ProfileAndAddress';
import ProfilePayment from './ProfilePayment';
import { deletingAddress, fetchingAddresses } from '../../redux/actions/AddressAction';
import { deletingPayment, fetchingPayments } from '../../redux/actions/PaymentAction';
import { api } from '../../utils/api';

type Section = 'info' | 'addresses' | 'payments';

const toastDel = (msg: string) =>
  toast(msg, { icon: '🗑', position: 'top-center', duration: 1800 });
const toastErr = (msg: string) =>
  toast.error(msg, { position: 'top-center', duration: 2200 });

const Profile: React.FC = () => {
  const dispatch      = useDispatch<AppDispatch>();
  const location      = useLocation();

  const { user, userFromToken } = useSelector((s: RootState) => s.userLogged);
  const { payments }            = useSelector((s: RootState) => s.payments);
  const { addresses }           = useSelector((s: RootState) => s.addresses);

  const decodedUserId: string =
    (JSON.parse(localStorage.getItem('decodedUser') || '{}') as { user_id?: string }).user_id ?? '';

  const [section,            setSection]           = React.useState<Section>('info');
  const [userEdited,         setUserEdited]         = React.useState<UserFromDB>();
  const [selectedAddress,    setSelectedAddress]    = React.useState<UserAddress>();
  const [selectedPayment,    setSelectedPayment]    = React.useState<UserPayment>();
  const [editAddress,        setEditAddress]        = React.useState(false);
  const [editPayment,        setEditPayment]        = React.useState(false);
  const [loading,            setLoading]            = React.useState(false);

  // Fetch user profile data
  useLayoutEffect(() => {
    if (!decodedUserId) return;
    api.get<UserFromDB>(`/users/${decodedUserId}`).then((r) => setUserEdited(r.data));
  }, [decodedUserId]);

  // Sync addresses + payments
  useEffect(() => {
    if (!decodedUserId) return;
    dispatch(fetchingAddresses(decodedUserId));
    dispatch(fetchingPayments(decodedUserId));
  }, [dispatch, decodedUserId]);

  // Detect incoming section from URL hash (e.g. /profile#payments)
  useEffect(() => {
    const hash = location.hash.replace('#', '') as Section;
    if (['info', 'addresses', 'payments'].includes(hash)) setSection(hash);
  }, [location.hash]);

  // ── Derived ─────────────────────────────────────────────────
  const initials =
    userEdited?.firstname?.[0]?.toUpperCase() ??
    userFromToken?.username?.[0]?.toUpperCase() ??
    user?.given_name?.[0]?.toUpperCase() ??
    '?';

  const displayName =
    userEdited ? `${userEdited.firstname} ${userEdited.lastname}` :
    userFromToken?.username ?? user?.given_name ?? 'Account';

  // ── Handlers ────────────────────────────────────────────────
  const handleDeleteAddress = (id: string) => {
    setLoading(true);
    try {
      dispatch(deletingAddress(id));
      toastDel('Address removed');
      setSelectedAddress(undefined);
      setEditAddress(false);
    } catch { toastErr('Failed to delete address'); }
    finally { setLoading(false); }
  };

  const handleDeletePayment = (id: string) => {
    setLoading(true);
    try {
      dispatch(deletingPayment(id));
      toastDel('Payment method removed');
      setSelectedPayment(undefined);
      setEditPayment(false);
    } catch { toastErr('Failed to delete payment'); }
    finally { setLoading(false); }
  };

  const navLink = (s: Section, icon: string, label: string) => (
    <a
      href={`#${s}`}
      className={section === s ? 'is-active' : ''}
      onClick={(e) => { e.preventDefault(); setSection(s); }}
    >
      <i className={`fa ${icon}`} />
      {label}
    </a>
  );

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="stride-container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-16)' }}>
      {loading && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.2)', zIndex: 50, display: 'grid', placeItems: 'center' }}>
          <div className="stride-sk" style={{ width: 48, height: 48, borderRadius: '50%' }} />
        </div>
      )}

      <div className="stride-profile">
        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside className="stride-profile-nav">
          <div className="stride-profile-nav__head">
            <div className="stride-profile-nav__avatar-lg">
              {user?.picture
                ? <img src={user.picture} alt={displayName} />
                : initials
              }
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>{displayName}</div>
              {userEdited?.email && (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)', marginTop: 2 }}>
                  {userEdited.email}
                </div>
              )}
            </div>
          </div>

          {navLink('info',      'fa-user',       'Personal info')}
          {navLink('addresses', 'fa-map-marker', 'Addresses')}
          {navLink('payments',  'fa-credit-card','Payments')}

          <hr className="stride-divider" style={{ margin: 'var(--space-3) 0' }} />
          <Link to="/history" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '11px 14px', fontSize: 'var(--text-sm)', color: 'var(--color-fg-secondary)', borderRadius: 'var(--radius-sm)', textDecoration: 'none' }}>
            <i className="fa fa-history" style={{ width: 18, textAlign: 'center', color: 'var(--color-fg-muted)' }} />
            Order history
          </Link>
        </aside>

        {/* ── Main content ────────────────────────────────────── */}
        <div style={{ minWidth: 0 }}>

          {/* ── Personal info ─────────────────────────────────── */}
          {section === 'info' && (
            <div>
              <div className="stride-section-head" style={{ marginBottom: 'var(--space-6)' }}>
                <div>
                  <span className="stride-eyebrow">Profile</span>
                  <h2>Personal info</h2>
                </div>
                {!editAddress && (
                  <button
                    className="stride-btn stride-btn--secondary"
                    onClick={() => setEditAddress((e) => !e)}
                  >
                    <i className="fa fa-pencil" style={{ marginRight: 6 }} />
                    Edit profile
                  </button>
                )}
              </div>

              {editAddress && userEdited ? (
                <div className="stride-card stride-card__pad" style={{ marginBottom: 'var(--space-6)' }}>
                  <ProfileAndAddress
                    address={selectedAddress}
                    userId={userEdited.id}
                    userEdited={userEdited}
                    setUserEdited={setUserEdited}
                    setEdit={setEditAddress}
                    setLoading={setLoading}
                    addresses={addresses}
                    setSelectedAddress={setSelectedAddress}
                  />
                </div>
              ) : (
                <div className="stride-card">
                  <div className="stride-card__pad" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                    {[
                      { icon: 'fa-user',     label: 'Username',   value: userEdited?.username },
                      { icon: 'fa-envelope', label: 'Email',      value: userEdited?.email },
                      { icon: 'fa-phone',    label: 'Phone',      value: userEdited?.phone },
                      { icon: 'fa-lock',     label: 'Password',   value: '••••••••' },
                    ].map(({ icon, label, value }) => (
                      <div key={label}>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>
                          <i className={`fa ${icon}`} style={{ marginRight: 6 }} />{label}
                        </p>
                        <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                          {value || <span style={{ color: 'var(--color-fg-placeholder)' }}>—</span>}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Addresses ────────────────────────────────────── */}
          {section === 'addresses' && (
            <div>
              <div className="stride-section-head" style={{ marginBottom: 'var(--space-6)' }}>
                <div>
                  <span className="stride-eyebrow">Shipping</span>
                  <h2>Addresses</h2>
                </div>
                <button
                  className="stride-btn stride-btn--secondary"
                  onClick={() => { setSelectedAddress(undefined); setEditAddress(true); }}
                >
                  <i className="fa fa-plus" style={{ marginRight: 6 }} />Add address
                </button>
              </div>

              {/* Add / edit form */}
              {editAddress && userEdited && (
                <div className="stride-card stride-card__pad" style={{ marginBottom: 'var(--space-6)' }}>
                  <ProfileAndAddress
                    address={selectedAddress}
                    userId={userEdited.id}
                    userEdited={userEdited}
                    setUserEdited={setUserEdited}
                    setEdit={setEditAddress}
                    setLoading={setLoading}
                    addresses={addresses}
                    setSelectedAddress={setSelectedAddress}
                  />
                </div>
              )}

              {/* Address cards */}
              {addresses.length === 0 && !editAddress ? (
                <div className="stride-empty">
                  <i className="fa fa-map-marker" />
                  <h3>No addresses saved</h3>
                  <button className="stride-btn stride-btn--secondary" onClick={() => setEditAddress(true)}>
                    Add your first address
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {addresses.map((addr: UserAddress) => {
                    const isSelected = selectedAddress?.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        className="stride-card"
                        style={{ cursor: 'pointer', outline: isSelected ? '2px solid var(--color-action)' : 'none' }}
                        onClick={() => setSelectedAddress(isSelected ? undefined : addr)}
                      >
                        <div className="stride-card__pad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ fontSize: 'var(--text-sm)' }}>
                            <p style={{ fontWeight: 600 }}>{addr.address}</p>
                            <p style={{ color: 'var(--color-fg-secondary)', marginTop: 2 }}>
                              {addr.city}, {addr.postalCode}, {addr.country}
                            </p>
                          </div>
                          {isSelected && (
                            <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
                              <button
                                className="stride-btn stride-btn--ghost"
                                style={{ padding: '6px 12px', fontSize: 'var(--text-xs)' }}
                                onClick={(e) => { e.stopPropagation(); setEditAddress(true); }}
                              >
                                <i className="fa fa-pencil" />
                              </button>
                              <button
                                className="stride-btn stride-btn--ghost"
                                style={{ padding: '6px 12px', fontSize: 'var(--text-xs)', color: 'var(--color-error)' }}
                                onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr.id!); }}
                              >
                                <i className="fa fa-trash" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Payments ─────────────────────────────────────── */}
          {section === 'payments' && (
            <div>
              <div className="stride-section-head" style={{ marginBottom: 'var(--space-6)' }}>
                <div>
                  <span className="stride-eyebrow">Billing</span>
                  <h2>Payment methods</h2>
                </div>
                <button
                  className="stride-btn stride-btn--secondary"
                  onClick={() => { setSelectedPayment(undefined); setEditPayment(true); }}
                >
                  <i className="fa fa-plus" style={{ marginRight: 6 }} />Add card
                </button>
              </div>

              {/* Add / edit form */}
              {editPayment && userEdited && (
                <div className="stride-card stride-card__pad" style={{ marginBottom: 'var(--space-6)' }}>
                  <ProfilePayment
                    userId={userEdited.id}
                    openPaymentToEdit={editPayment}
                    setOpenPaymentToEdit={setEditPayment}
                    selectedPayment={selectedPayment}
                    setSelectedPayment={setSelectedPayment}
                  />
                </div>
              )}

              {payments.length === 0 && !editPayment ? (
                <div className="stride-empty">
                  <i className="fa fa-credit-card" />
                  <h3>No payment methods</h3>
                  <button className="stride-btn stride-btn--secondary" onClick={() => setEditPayment(true)}>
                    Add a card
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {payments.map((pay: UserPayment) => {
                    const isSelected = selectedPayment?.id === pay.id;
                    const masked = pay.cardNumber
                      ? `•••• •••• •••• ${pay.cardNumber.slice(-4)}`
                      : '••••';
                    return (
                      <div
                        key={pay.id}
                        className="stride-card"
                        style={{ cursor: 'pointer', outline: isSelected ? '2px solid var(--color-action)' : 'none' }}
                        onClick={() => setSelectedPayment(isSelected ? undefined : pay)}
                      >
                        <div className="stride-card__pad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                            <i className="fa fa-credit-card" style={{ fontSize: 20, color: 'var(--color-fg-muted)' }} />
                            <div style={{ fontSize: 'var(--text-sm)' }}>
                              <p style={{ fontWeight: 600 }}>{pay.cardHolderName}</p>
                              <p style={{ color: 'var(--color-fg-secondary)', marginTop: 2 }}>
                                {pay.provider} · {masked} · exp {pay.expirationDate}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
                              <button
                                className="stride-btn stride-btn--ghost"
                                style={{ padding: '6px 12px', fontSize: 'var(--text-xs)' }}
                                onClick={(e) => { e.stopPropagation(); setEditPayment(true); }}
                              >
                                <i className="fa fa-pencil" />
                              </button>
                              <button
                                className="stride-btn stride-btn--ghost"
                                style={{ padding: '6px 12px', fontSize: 'var(--text-xs)', color: 'var(--color-error)' }}
                                onClick={(e) => { e.stopPropagation(); handleDeletePayment(pay.id!); }}
                              >
                                <i className="fa fa-trash" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

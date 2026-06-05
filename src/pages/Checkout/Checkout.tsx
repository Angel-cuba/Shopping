import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../redux/store';
import { clearCart } from '../../redux/actions/CartActions';
import { api } from '../../utils/api';
import { toastError, toastSuccess, toastInfo } from '../../utils/toasts';
import CartLineItem from '../../components/Cart/CartLineItem';
import Address from './address/Address';
import Payment from './payments/Payment';

type OrderItem  = { productId: string; quantity: number };
type DetailItem = { id: string };

// ── Step indicator ────────────────────────────────────────────
const STEPS = ['Address', 'Payment', 'Shipping', 'Confirm'];

const StepBar: React.FC<{ current: number }> = ({ current }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
    {STEPS.map((label, i) => {
      const done    = i < current;
      const active  = i === current;
      return (
        <React.Fragment key={label}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: i < STEPS.length - 1 ? 'none' : 1 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              display: 'grid', placeItems: 'center',
              fontSize: 'var(--text-xs)', fontWeight: 700,
              background: done || active ? 'var(--color-action)' : 'var(--color-border)',
              color:       done || active ? '#fff'               : 'var(--color-fg-muted)',
              transition: 'all .2s',
            }}>
              {done ? <i className="fa fa-check" /> : i + 1}
            </div>
            <span style={{ fontSize: 'var(--text-xs)', marginTop: 4, fontWeight: active ? 700 : 400, color: active ? 'var(--color-fg-primary)' : 'var(--color-fg-muted)' }}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ flex: 1, height: 2, background: done ? 'var(--color-action)' : 'var(--color-border)', margin: '0 var(--space-2)', marginBottom: 'var(--space-5)', transition: 'background .2s' }} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ── Section card ──────────────────────────────────────────────
const SectionCard: React.FC<{
  step: number;
  icon: string;
  title: string;
  value?: string;
  done: boolean;
  onEdit: () => void;
  open: boolean;
  children?: React.ReactNode;
}> = ({ icon, title, value, done, onEdit, open, children }) => (
  <div className="stride-card stride-card__pad" style={{ marginBottom: 'var(--space-4)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 'var(--radius-sm)',
          background: done ? 'var(--color-success-bg)' : 'var(--color-action-subtle)',
          color:       done ? 'var(--color-success)'   : 'var(--color-action)',
          display: 'grid', placeItems: 'center',
        }}>
          <i className={`fa ${done ? 'fa-check' : icon}`} />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-fg-primary)' }}>{title}</div>
          {value && !open && (
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)', marginTop: 2 }}>{value}</div>
          )}
        </div>
      </div>
      <button className="stride-btn stride-btn--ghost" style={{ fontSize: 'var(--text-xs)', padding: '4px 12px' }} onClick={onEdit}>
        {open ? 'Cancel' : done ? 'Change' : 'Select'}
      </button>
    </div>
    {open && <div style={{ marginTop: 'var(--space-3)' }}>{children}</div>}
  </div>
);

// ── Main component ────────────────────────────────────────────
const Checkout: React.FC = () => {
  const dispatch   = useDispatch<AppDispatch>();
  const navigate   = useNavigate();

  const { userFromToken } = useSelector((s: RootState) => s.userLogged);
  const { itemInCart }    = useSelector((s: RootState) => s.cart);
  const { addresses }     = useSelector((s: RootState) => s.addresses);
  const { payments }      = useSelector((s: RootState) => s.payments);

  // ── State ──
  const [address,       setAddress]       = useState('');
  const [payment,       setPayment]       = useState('');
  const [doorDelivery,  setDoorDelivery]  = useState(true);
  const [openAddress,   setOpenAddress]   = useState(false);
  const [openPayments,  setOpenPayments]  = useState(false);
  const [allowToPay,    setAllowToPay]    = useState(false);
  const [notEnoughStock, setNotEnoughStock] = useState<string[]>([]);
  const [checking,      setChecking]      = useState(false);
  const [loading,       setLoading]       = useState(false);

  // ── Derived ──
  const totalToPay = (itemInCart ?? []).reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = doorDelivery ? 2.99 : 0;
  const grandTotal  = totalToPay + shippingFee;

  // Current step: 0=address, 1=payment, 2=shipping, 3=confirm
  const currentStep = !address ? 0 : !payment ? 1 : 2;

  useEffect(() => {
    setAllowToPay(notEnoughStock.length === 0 && notEnoughStock !== undefined);
  }, [notEnoughStock]);

  // ── Handlers ──
  const handleOpenAddress = () => {
    if (!userFromToken) return toastError('Please log in first');
    if (addresses.length === 0) {
      toastError('Add an address in your profile first');
      return;
    }
    setOpenPayments(false);
    setOpenAddress(prev => !prev);
  };

  const handleOpenPayments = () => {
    if (!userFromToken) return toastError('Please log in first');
    if (payments.length === 0) {
      toastError('Add a payment method in your profile first');
      return;
    }
    setOpenAddress(false);
    setOpenPayments(prev => !prev);
  };

  const handleCheckStock = async () => {
    if (!itemInCart?.length)    return toastError('Your cart is empty');
    if (!address || !payment)   return toastError('Select address and payment first');

    setChecking(true);
    setNotEnoughStock([]);
    const outOfStock: string[] = [];

    try {
      for (const item of itemInCart) {
        const id  = item.id.slice(0, 36);
        const res = await api.get(`/products/${id}`);
        const p   = res.data;
        if (p.inStock === 0) {
          outOfStock.push(p.id);
          toastError(`${p.name} is out of stock`);
        } else if (p.inStock < item.quantity) {
          outOfStock.push(p.id);
          toastError(`${p.name}: only ${p.inStock} left`);
        } else {
          toastSuccess(`${p.name} ✓`);
        }
      }
    } catch {
      toastError('Stock check failed, please try again');
    }

    setNotEnoughStock(outOfStock);
    setAllowToPay(outOfStock.length === 0);
    setChecking(false);
  };

  const handlePlaceOrder = async () => {
    if (!address || !payment)  return toastError('Select address and payment first');
    if (!allowToPay)           return toastError('Check stock availability first');
    if (!itemInCart?.length)   return toastError('Your cart is empty');

    setLoading(true);
    try {
      // 1. Decrement stock
      for (const item of itemInCart) {
        await api.put('/products/update/stock', { id: item.id.slice(0, 36), quantity: item.quantity });
      }

      // 2. Create order details
      const orderDetailsPayload = itemInCart.map(item => ({
        productId: item.id.slice(0, 36),
        variant:   item.variant,
        image:     item.image,
        size:      item.sizes,
        price:     item.price,
        quantity:  item.quantity,
        user:      { id: userFromToken?.user_id },
      }));
      const detailsRes = await api.post('/order-details/create-order-details', orderDetailsPayload);

      if (detailsRes.status === 200) {
        // 3. Create order
        const orderPayload = {
          user:            { id: userFromToken?.user_id },
          orderDetails:    detailsRes.data.map((d: DetailItem) => d.id),
          paymentType:     payment,
          shippingAddress: address,
          shippingMethod:  doorDelivery ? 'DOOR' : 'PICKUP',
          shippingFee:     shippingFee,
          total:           grandTotal,
        };
        await api.post('/orders', orderPayload);
        dispatch(clearCart());
        toastSuccess('Order placed! We\'ll confirm shortly.');
        navigate('/history');
      }
    } catch {
      toastError('Something went wrong placing your order');
    } finally {
      setLoading(false);
    }
  };

  // ── Empty cart ──
  if (!itemInCart?.length && !loading) {
    return (
      <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center', padding: 'var(--space-6)' }}>
        <div className="stride-empty">
          <i className="fa fa-shopping-cart" />
          <h3>Your cart is empty</h3>
          <p>Add some shoes first.</p>
        </div>
        <Link to="/home" className="stride-btn" style={{ display: 'inline-block', marginTop: 'var(--space-5)', textDecoration: 'none' }}>
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
      {/* ── Page header ── */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <span className="stride-eyebrow">Store</span>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Checkout</h2>
      </div>

      <StepBar current={currentStep} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-6)', alignItems: 'start' }}>

        {/* ── Left: steps ── */}
        <div>
          {/* Step 1: Address */}
          <SectionCard
            step={0}
            icon="fa-map-marker"
            title="Delivery address"
            value={address}
            done={!!address}
            open={openAddress}
            onEdit={handleOpenAddress}
          >
            <Address addresses={addresses} setOpenAddress={setOpenAddress} setAddress={setAddress} />
            {addresses.length === 0 && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)', marginTop: 'var(--space-2)' }}>
                No addresses saved.{' '}
                <Link to="/profile" style={{ color: 'var(--color-action)' }}>Add one in your profile →</Link>
              </p>
            )}
          </SectionCard>

          {/* Step 2: Payment */}
          <SectionCard
            step={1}
            icon="fa-credit-card"
            title="Payment method"
            value={payment}
            done={!!payment}
            open={openPayments}
            onEdit={handleOpenPayments}
          >
            <Payment payments={payments} setOpenPayments={setOpenPayments} setPayment={setPayment} />
            {payments.length === 0 && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)', marginTop: 'var(--space-2)' }}>
                No payment methods saved.{' '}
                <Link to="/profile" style={{ color: 'var(--color-action)' }}>Add one in your profile →</Link>
              </p>
            )}
          </SectionCard>

          {/* Step 3: Shipping method */}
          <div className="stride-card stride-card__pad" style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--color-action-subtle)', color: 'var(--color-action)', display: 'grid', placeItems: 'center' }}>
                <i className="fa fa-truck" />
              </div>
              <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-fg-primary)' }}>Shipping method</span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              {[
                { key: true,  icon: 'fa-home',       label: 'Home delivery', sub: '+$2.99' },
                { key: false, icon: 'fa-building',   label: 'Store pickup',  sub: 'Free'   },
              ].map(opt => (
                <button
                  key={String(opt.key)}
                  onClick={() => setDoorDelivery(opt.key)}
                  style={{
                    flex: 1,
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    border: doorDelivery === opt.key ? '2px solid var(--color-action)' : '2px solid var(--color-border)',
                    background: doorDelivery === opt.key ? 'var(--color-action-subtle)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all .15s',
                  }}
                >
                  <i className={`fa ${opt.icon}`} style={{ color: doorDelivery === opt.key ? 'var(--color-action)' : 'var(--color-fg-muted)', marginBottom: 6, display: 'block', fontSize: 18 }} />
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-fg-primary)' }}>{opt.label}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: doorDelivery === opt.key ? 'var(--color-action)' : 'var(--color-fg-muted)', marginTop: 2 }}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: order summary ── */}
        <div>
          <div className="stride-card stride-card__pad" style={{ marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
              Order summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              {(itemInCart ?? []).map(item => (
                <CartLineItem
                  key={item.id}
                  item={item}
                  notEnoughStock={notEnoughStock}
                />
              ))}
            </div>

            {/* Totals */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)' }}>
                <span>Subtotal</span>
                <span>${totalToPay.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)' }}>
                <span>Shipping</span>
                <span>{doorDelivery ? '$2.99' : 'Free'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-fg-primary)', marginTop: 'var(--space-2)' }}>
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Stock check + Place order */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {!allowToPay && (
              <button
                className="stride-btn stride-btn--ghost"
                style={{ width: '100%' }}
                disabled={checking || !address || !payment}
                onClick={handleCheckStock}
              >
                {checking
                  ? <><i className="fa fa-spinner fa-spin" style={{ marginRight: 6 }} />Checking…</>
                  : <><i className="fa fa-search" style={{ marginRight: 6 }} />Check stock availability</>}
              </button>
            )}

            {allowToPay && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--color-success)', marginBottom: 'var(--space-1)' }}>
                <i className="fa fa-check-circle" />
                All items in stock
              </div>
            )}

            <button
              className="stride-btn"
              style={{ width: '100%', padding: 'var(--space-4)', fontSize: 'var(--text-base)', fontWeight: 700 }}
              disabled={!address || !payment || !allowToPay || loading}
              onClick={handlePlaceOrder}
            >
              {loading
                ? <><i className="fa fa-spinner fa-spin" style={{ marginRight: 6 }} />Placing order…</>
                : 'Place order'}
            </button>

            {(!address || !payment) && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)', textAlign: 'center' }}>
                {!address ? 'Select a delivery address to continue' : 'Select a payment method to continue'}
              </p>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'grid', placeItems: 'center', zIndex: 9999 }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-8)', textAlign: 'center', minWidth: 240 }}>
            <i className="fa fa-spinner fa-spin" style={{ fontSize: 32, color: 'var(--color-action)', marginBottom: 'var(--space-4)', display: 'block' }} />
            <p style={{ fontWeight: 600 }}>Placing your order…</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;

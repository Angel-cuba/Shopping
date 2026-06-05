import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../utils/api';
import {
  History,
  orderDetailsItem,
} from '../../../interfaces/profile/order/orderType';
import { VariantsColors } from '../../../interfaces/products/ProductType';

// ── Status badge ──────────────────────────────────────────────
type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING:   'Pending',
  CONFIRMED: 'Confirmed',
  SHIPPED:   'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

const STATUS_CLASS: Record<OrderStatus, string> = {
  PENDING:   'stride-badge--soft',
  CONFIRMED: 'stride-badge--soft',
  SHIPPED:   'stride-badge',
  DELIVERED: 'stride-badge--green',
  CANCELLED: 'stride-badge--sale',
};

const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  const s = (status ?? 'PENDING') as OrderStatus;
  const label = STATUS_LABEL[s] ?? s;
  const cls   = STATUS_CLASS[s] ?? 'stride-badge--soft';
  return <span className={`stride-badge ${cls}`}>{label}</span>;
};

// ── Date formatter ────────────────────────────────────────────
const formatDate = (iso: string): string => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  });
};

// ── Order detail items ────────────────────────────────────────
const OrderItemsList: React.FC<{ orderDetailIds: string[] }> = ({ orderDetailIds }) => {
  const [items, setItems] = useState<orderDetailsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const res = await api.get<orderDetailsItem[]>('/order-details/all-order-details', {
          params: { orderDetailsIds: orderDetailIds.join(',') },
        });
        if (!cancelled) setItems(res.data);
      } catch {
        /* silent — parent shows the order header even if details fail */
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [orderDetailIds]);

  if (loading) {
    return (
      <div style={{ display: 'flex', gap: 'var(--space-2)', padding: 'var(--space-3) 0' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="stride-sk" style={{ width: 52, height: 52, borderRadius: 'var(--radius-sm)' }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', paddingTop: 'var(--space-4)' }}>
      {items.map((item) => (
        <Link
          key={item.id}
          to={`/product/${item.productId}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
          title={`View product — ${item.size} · $${item.price}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', width: 80 }}>
            <div style={{ width: 72, height: 72, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-default)', flexShrink: 0 }}>
              <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              {item.variant && VariantsColors[item.variant] && (
                <span
                  style={{
                    display: 'inline-block',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: VariantsColors[item.variant],
                    border: '1px solid var(--color-border-default)',
                  }}
                  title={item.variant}
                />
              )}
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)' }}>
                US {item.size}
              </span>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                ${item.price}
              </span>
              {item.quantity > 1 && (
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)' }}>
                  ×{item.quantity}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────
const UserHistory: React.FC = () => {
  const [history, setHistory]  = useState<History[]>([]);
  const [loading, setLoading]  = useState(true);

  const decodedUserId: string =
    (JSON.parse(localStorage.getItem('decodedUser') || '{}') as { user_id?: string }).user_id ?? '';

  useEffect(() => {
    if (!decodedUserId) { setLoading(false); return; }
    api
      .get<History[]>(`/orders/${decodedUserId}`)
      .then((r) => setHistory(r.data))
      .catch(() => {/* keep empty list */})
      .finally(() => setLoading(false));
  }, [decodedUserId]);

  return (
    <div className="stride-container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-16)' }}>
      <div className="stride-section-head">
        <div>
          <span className="stride-eyebrow">Account</span>
          <h2>Order history</h2>
        </div>
        <Link to="/profile" className="stride-btn stride-btn--secondary">
          <i className="fa fa-user" style={{ marginRight: 6 }} />Profile
        </Link>
      </div>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="stride-card">
              <div className="stride-card__pad" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div className="stride-sk" style={{ height: 14, width: '30%' }} />
                <div className="stride-sk" style={{ height: 12, width: '50%' }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  {[0, 1, 2].map((j) => (
                    <div key={j} className="stride-sk" style={{ width: 72, height: 72, borderRadius: 'var(--radius-sm)' }} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && history.length === 0 && (
        <div className="stride-empty">
          <i className="fa fa-box-open" style={{ fontSize: 40, color: 'var(--color-fg-placeholder)' }} />
          <h3>No orders yet</h3>
          <p style={{ color: 'var(--color-fg-secondary)', fontSize: 'var(--text-sm)' }}>
            When you complete a purchase it will appear here.
          </p>
          <Link to="/home" className="stride-btn stride-btn--secondary">Browse products</Link>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {history.map((order) => (
            <div key={order.id} className="stride-card">
              <div className="stride-card__pad">
                {/* Order header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-1)' }}>
                      <StatusBadge status={(order as History & { status?: string }).status} />
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)' }}>
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-secondary)' }}>
                        <i className="fa fa-credit-card" style={{ marginRight: 6, color: 'var(--color-fg-muted)' }} />
                        {order.paymentType}
                      </span>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-secondary)' }}>
                        <i className={`fa ${order.shippingMethod === 'DOOR' ? 'fa-home' : 'fa-store'}`} style={{ marginRight: 6, color: 'var(--color-fg-muted)' }} />
                        {order.shippingMethod === 'DOOR' ? 'Home delivery' : 'Store pickup'}
                      </span>
                      {order.shippingAddress && (
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-secondary)' }}>
                          <i className="fa fa-map-marker" style={{ marginRight: 6, color: 'var(--color-fg-muted)' }} />
                          {order.shippingAddress}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)', marginBottom: 2 }}>Order total</p>
                    <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>${order.total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Divider */}
                <hr className="stride-divider" style={{ margin: 'var(--space-4) 0' }} />

                {/* Items */}
                <OrderItemsList orderDetailIds={order.orderDetails} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserHistory;

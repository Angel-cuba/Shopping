import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '../../redux/store';
import { clearCart } from '../../redux/actions/CartActions';
import CartLineItem from './CartLineItem';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

// ── Free shipping threshold ───────────────────────────────────
const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 4.99;

// ── Main drawer ───────────────────────────────────────────────
const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const dispatch   = useDispatch<AppDispatch>();
  const cartItems  = useSelector((s: RootState) => s.cart.itemInCart) ?? [];

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const subtotal  = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shipping  = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total     = subtotal + shipping;
  const itemCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <>
      {/* Overlay */}
      <div
        className="stride-overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className="stride-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="stride-drawer__head">
          <h3>
            Cart
            {itemCount > 0 && (
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 400, color: 'var(--color-fg-secondary)', marginLeft: 8 }}>
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </h3>
          <button
            className="stride-navbar__iconbtn"
            onClick={onClose}
            aria-label="Close cart"
          >
            <i className="fa fa-times" />
          </button>
        </div>

        {/* Body */}
        <div className="stride-drawer__body">
          {cartItems.length === 0 ? (
            <div className="stride-empty">
              <i className="fa fa-shopping-bag" />
              <h3>Your cart is empty</h3>
              <p style={{ color: 'var(--color-fg-secondary)', fontSize: 'var(--text-sm)' }}>
                Add something from the catalog to get started.
              </p>
              <button className="stride-btn stride-btn--secondary" onClick={onClose}>
                Continue shopping
              </button>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <CartLineItem key={item.id} item={item} />
              ))}

              {/* Clear cart */}
              <button
                style={{
                  marginTop: 'var(--space-4)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-fg-muted)',
                  textDecoration: 'underline',
                }}
                onClick={() => dispatch(clearCart())}
              >
                Clear cart
              </button>
            </>
          )}
        </div>

        {/* Footer (only when cart has items) */}
        {cartItems.length > 0 && (
          <div className="stride-drawer__foot">
            {/* Totals */}
            <div className="stride-totals">
              <div className="row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="row">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span style={{ color: 'var(--color-success)' }}>Free</span>
                  ) : (
                    `$${SHIPPING_COST.toFixed(2)}`
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <div className="row">
                  <span style={{ color: 'var(--color-fg-muted)', fontSize: 'var(--text-xs)' }}>
                    Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping
                  </span>
                </div>
              )}
              <div className="row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* CTAs */}
            <Link
              to="/checkout"
              className="stride-btn stride-btn--primary"
              style={{ textAlign: 'center', display: 'block', paddingBlock: 'var(--space-3)' }}
              onClick={onClose}
            >
              Checkout
            </Link>
            <button
              className="stride-btn stride-btn--ghost"
              style={{ width: '100%' }}
              onClick={onClose}
            >
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;

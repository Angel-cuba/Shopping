import React from 'react';
import { Link } from 'react-router-dom';

const cols = [
  { h: 'Shop',       items: [{ label: 'New arrivals', to: '/home' }, { label: 'Summer', to: '/home' }, { label: 'Winter', to: '/home' }, { label: 'Sale', to: '/home' }] },
  { h: 'My account', items: [{ label: 'Profile', to: '/profile' }, { label: 'Order history', to: '/history' }, { label: 'Wishlist', to: '/wishlist' }, { label: 'Returns', to: '/shipping' }] },
  { h: 'Help',       items: [{ label: 'Shipping', to: '/shipping' }, { label: 'Size guide', to: '/size-guide' }, { label: 'Contact', to: '/contact' }, { label: 'FAQ', to: '/faq' }] },
];

const Footer: React.FC = () => (
  <footer
    style={{
      borderTop: '1px solid var(--color-border-default)',
      marginTop: 'var(--space-16)',
      paddingBlock: 'var(--space-12)',
    }}
  >
    {/* Main grid */}
    <div
      className="stride-container"
      style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr repeat(3,1fr)',
        gap: 'var(--space-8)',
      }}
    >
      {/* Brand col */}
      <div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 'var(--weight-extrabold)' as React.CSSProperties['fontWeight'],
            letterSpacing: '-.03em',
            color: 'var(--color-fg-primary)',
          }}
        >
          STRIDE
        </div>
        <p
          style={{
            maxWidth: 260,
            fontSize: 14,
            color: 'var(--color-fg-muted)',
            marginTop: 'var(--space-3)',
          }}
        >
          Footwear engineered to move you differently. Designed in Casablanca.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
          {(['instagram', 'twitter', 'facebook'] as const).map((s) => (
            <button
              key={s}
              className="stride-iconbtn"
              style={{ border: '1px solid var(--color-border-default)' }}
              aria-label={s}
            >
              <i className={`fa fa-${s}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Link cols */}
      {cols.map((col) => (
        <div key={col.h}>
          <h4
            style={{
              font: 'var(--type-label)' as React.CSSProperties['font'],
              textTransform: 'uppercase',
              letterSpacing: '.07em',
              color: 'var(--color-fg-muted)',
              marginBottom: 14,
            }}
          >
            {col.h}
          </h4>
          <div className="s-stack s-gap-3">
            {col.items.map((it) => (
              <Link
                key={it.label}
                to={it.to}
                style={{ fontSize: 14, color: 'var(--color-fg-muted)', textDecoration: 'none' }}
              >
                {it.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Bottom bar */}
    <div
      className="stride-container s-flex s-justify-between s-wrap s-gap-3"
      style={{
        marginTop: 'var(--space-10)',
        paddingTop: 'var(--space-6)',
        borderTop: '1px solid var(--color-border-default)',
        fontSize: 13,
        color: 'var(--color-fg-muted)',
      }}
    >
      <span>STRIDE Store © 2026</span>
      <span style={{ display: 'flex', gap: 'var(--space-4)' }}>
        <Link to="/privacy"  style={{ color: 'var(--color-fg-muted)', textDecoration: 'none' }}>Privacy</Link>
        <Link to="/terms"    style={{ color: 'var(--color-fg-muted)', textDecoration: 'none' }}>Terms</Link>
        <Link to="/contact"  style={{ color: 'var(--color-fg-muted)', textDecoration: 'none' }}>Contact</Link>
      </span>
    </div>
  </footer>
);

export default Footer;

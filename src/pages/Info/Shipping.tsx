import React from 'react';
import { Link } from 'react-router-dom';

const Row: React.FC<{ label: string; value: string; note?: string }> = ({ label, value, note }) => (
  <tr>
    <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--color-border-default)' }}>{label}</td>
    <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-fg-secondary)', borderBottom: '1px solid var(--color-border-default)' }}>{value}</td>
    {note && <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)', borderBottom: '1px solid var(--color-border-default)' }}>{note}</td>}
  </tr>
);

const Shipping: React.FC = () => (
  <div className="stride-container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-16)', maxWidth: 760 }}>
    <span className="stride-eyebrow">Info</span>
    <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, margin: 'var(--space-2) 0 var(--space-8)' }}>
      Shipping & Returns
    </h1>

    {/* Shipping */}
    <section style={{ marginBottom: 'var(--space-10)' }}>
      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Shipping</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--color-border-default)', borderRadius: 8 }}>
          <thead>
            <tr style={{ background: 'var(--color-surface-raised)' }}>
              <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--color-fg-muted)' }}>Method</th>
              <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--color-fg-muted)' }}>Delivery time</th>
              <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--color-fg-muted)' }}>Cost</th>
            </tr>
          </thead>
          <tbody>
            <Row label="Standard"  value="3–5 business days" note="Free on orders over $50" />
            <Row label="Express"   value="1–2 business days" note="$9.99" />
            <Row label="International" value="7–14 business days" note="From $14.99" />
          </tbody>
        </table>
      </div>
      <ul style={{ marginTop: 'var(--space-4)', paddingLeft: 20, color: 'var(--color-fg-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.8 }}>
        <li>Orders placed before 2 pm CET on business days ship the same day.</li>
        <li>You'll receive a tracking email as soon as your order leaves our warehouse.</li>
        <li>We ship Monday to Friday, excluding public holidays.</li>
      </ul>
    </section>

    {/* Returns */}
    <section style={{ marginBottom: 'var(--space-10)' }}>
      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Returns</h2>
      <p style={{ color: 'var(--color-fg-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
        We offer <strong>free returns within 30 days</strong> of delivery. Items must be unworn, unwashed,
        and returned in their original packaging.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {[
          { n: '1', t: 'Start your return', b: 'Go to Order History in your account and click "Return" next to the order.' },
          { n: '2', t: 'Pack your items',   b: 'Place the items back in the original box with the packing slip.' },
          { n: '3', t: 'Drop off',          b: 'Use the prepaid label we email you to drop the parcel at any carrier location.' },
          { n: '4', t: 'Refund processed',  b: 'Refunds are issued within 3–5 business days of receiving your return.' },
        ].map((step) => (
          <div key={step.n} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
            <span style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--color-fg-primary)', color: 'var(--app-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 'var(--text-xs)', fontWeight: 800, flexShrink: 0,
            }}>{step.n}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{step.t}</div>
              <div style={{ color: 'var(--color-fg-secondary)', fontSize: 'var(--text-sm)' }}>{step.b}</div>
            </div>
          </div>
        ))}
      </div>
    </section>

    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)' }}>
      Questions?{' '}
      <Link to="/contact" style={{ color: 'var(--color-fg-primary)', fontWeight: 600 }}>Contact our support team</Link>.
    </p>
  </div>
);

export default Shipping;

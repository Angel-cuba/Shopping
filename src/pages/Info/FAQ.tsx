import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: 'What sizes do you offer?',
    a: 'We carry EU sizes 35–47 across all categories. Use our Size Guide to find your perfect fit.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Standard delivery takes 3–5 business days. Express (1–2 business days) is available at checkout. Free standard shipping on all orders over $50.',
  },
  {
    q: 'Can I return or exchange my order?',
    a: 'Yes — free returns within 30 days of delivery for unworn items in original packaging. Start a return from your Order History page.',
  },
  {
    q: 'How do I track my order?',
    a: 'Once your order ships you\'ll receive an email with a tracking link. You can also check your Order History from the account menu.',
  },
  {
    q: 'Are my payment details secure?',
    a: 'All transactions are encrypted with TLS and processed by Stripe. STRIDE never stores your raw card data.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: 'Orders can be cancelled within 1 hour of placement. After that the item may already be packed. Contact support as soon as possible.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'We currently ship to Europe, North America, and MENA. International orders typically take 7–14 business days.',
  },
  {
    q: 'How do I use the wishlist?',
    a: 'Log in and click the heart icon on any product to save it. Access your saved items from the wishlist icon in the navbar.',
  },
];

const Item: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: '1px solid var(--color-border-default)',
        paddingBlock: 'var(--space-4)',
      }}
    >
      <button
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'left',
          fontWeight: 600,
          fontSize: 'var(--text-base)',
          color: 'var(--color-fg-primary)',
          padding: 0,
        }}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {q}
        <i className={`fa fa-chevron-${open ? 'up' : 'down'}`} style={{ fontSize: 12, color: 'var(--color-fg-muted)', flexShrink: 0, marginLeft: 'var(--space-4)' }} />
      </button>
      {open && (
        <p style={{ marginTop: 'var(--space-3)', color: 'var(--color-fg-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
          {a}
        </p>
      )}
    </div>
  );
};

const FAQ: React.FC = () => (
  <div className="stride-container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-16)', maxWidth: 720 }}>
    <span className="stride-eyebrow">Help</span>
    <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, margin: 'var(--space-2) 0 var(--space-2)' }}>
      Frequently Asked Questions
    </h1>
    <p style={{ color: 'var(--color-fg-secondary)', marginBottom: 'var(--space-10)' }}>
      Can't find what you're looking for?{' '}
      <Link to="/contact" style={{ color: 'var(--color-fg-primary)', fontWeight: 600 }}>Contact us</Link>.
    </p>

    <div>
      {FAQS.map((item) => (
        <Item key={item.q} q={item.q} a={item.a} />
      ))}
    </div>
  </div>
);

export default FAQ;

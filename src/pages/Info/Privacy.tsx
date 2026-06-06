import React from 'react';
import { Link } from 'react-router-dom';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section style={{ marginBottom: 'var(--space-8)' }}>
    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>{title}</h3>
    <div style={{ color: 'var(--color-fg-secondary)', lineHeight: 1.7, fontSize: 'var(--text-sm)' }}>{children}</div>
  </section>
);

const Privacy: React.FC = () => (
  <div className="stride-container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-16)', maxWidth: 760 }}>
    <span className="stride-eyebrow">Legal</span>
    <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, margin: 'var(--space-2) 0 var(--space-8)' }}>Privacy Policy</h1>
    <p style={{ color: 'var(--color-fg-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-8)' }}>
      Last updated: January 2026
    </p>

    <Section title="1. Information We Collect">
      We collect information you provide directly, such as your name, email address, shipping address,
      and payment details when you create an account or place an order. We also automatically collect
      browsing data, device identifiers, and usage analytics to improve our services.
    </Section>

    <Section title="2. How We Use Your Information">
      <p>Your data is used to:</p>
      <ul style={{ paddingLeft: 20, marginTop: 'var(--space-2)' }}>
        <li>Process and fulfil your orders</li>
        <li>Send order confirmations and shipping updates</li>
        <li>Provide customer support</li>
        <li>Personalise your shopping experience</li>
        <li>Send promotional emails (you may opt out at any time)</li>
      </ul>
    </Section>

    <Section title="3. Data Sharing">
      We do not sell your personal information. We share data only with trusted service providers
      (payment processors, shipping carriers) strictly necessary to fulfil your order, and when
      required by law.
    </Section>

    <Section title="4. Cookies">
      STRIDE uses cookies to keep you logged in, remember your cart, and analyse site traffic.
      You can disable cookies in your browser settings, though some features may not work correctly.
    </Section>

    <Section title="5. Data Retention">
      We retain your account information for as long as your account is active. Order records are
      kept for 7 years for legal and accounting purposes. You may request deletion of your account
      at any time by contacting us.
    </Section>

    <Section title="6. Your Rights">
      Depending on your location you may have the right to access, correct, or delete your personal
      data. To exercise these rights, please contact us at{' '}
      <a href="mailto:privacy@stride.store" style={{ color: 'var(--color-fg-primary)' }}>
        privacy@stride.store
      </a>.
    </Section>

    <Section title="7. Contact">
      Questions about this policy? Reach us at{' '}
      <Link to="/contact" style={{ color: 'var(--color-fg-primary)' }}>our contact page</Link> or
      email{' '}
      <a href="mailto:privacy@stride.store" style={{ color: 'var(--color-fg-primary)' }}>
        privacy@stride.store
      </a>.
    </Section>
  </div>
);

export default Privacy;

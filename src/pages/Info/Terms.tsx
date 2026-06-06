import React from 'react';
import { Link } from 'react-router-dom';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section style={{ marginBottom: 'var(--space-8)' }}>
    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>{title}</h3>
    <div style={{ color: 'var(--color-fg-secondary)', lineHeight: 1.7, fontSize: 'var(--text-sm)' }}>{children}</div>
  </section>
);

const Terms: React.FC = () => (
  <div className="stride-container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-16)', maxWidth: 760 }}>
    <span className="stride-eyebrow">Legal</span>
    <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, margin: 'var(--space-2) 0 var(--space-8)' }}>Terms of Service</h1>
    <p style={{ color: 'var(--color-fg-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-8)' }}>
      Last updated: January 2026
    </p>

    <Section title="1. Acceptance of Terms">
      By accessing or using STRIDE Store you agree to be bound by these Terms of Service. If you
      do not agree to all terms, please do not use the site.
    </Section>

    <Section title="2. Eligibility">
      You must be at least 18 years old to create an account and make purchases. By using the
      site you represent that you meet this requirement.
    </Section>

    <Section title="3. Orders & Pricing">
      All prices are displayed in USD and are subject to change without notice. We reserve the
      right to refuse or cancel any order at our sole discretion, including orders placed for
      products listed at incorrect prices.
    </Section>

    <Section title="4. Intellectual Property">
      All content on this site — including logos, product images, text, and design — is the
      property of STRIDE Store and may not be reproduced without written permission.
    </Section>

    <Section title="5. Returns & Refunds">
      We offer free returns within 30 days of delivery for unworn items in original packaging.
      See our <Link to="/shipping" style={{ color: 'var(--color-fg-primary)' }}>Shipping & Returns</Link>{' '}
      page for full details.
    </Section>

    <Section title="6. Limitation of Liability">
      STRIDE Store shall not be liable for indirect, incidental, or consequential damages arising
      from your use of the site or products purchased. Our total liability shall not exceed the
      amount paid for the order in question.
    </Section>

    <Section title="7. Governing Law">
      These terms are governed by the laws of the jurisdiction in which STRIDE Store operates.
      Any disputes shall be resolved through binding arbitration.
    </Section>

    <Section title="8. Changes to Terms">
      We may update these terms at any time. Continued use of the site after changes are posted
      constitutes your acceptance of the new terms.
    </Section>

    <Section title="9. Contact">
      Questions about these terms? Visit our{' '}
      <Link to="/contact" style={{ color: 'var(--color-fg-primary)' }}>contact page</Link>.
    </Section>
  </div>
);

export default Terms;

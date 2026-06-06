import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="stride-container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-16)' }}>
      <span className="stride-eyebrow">Support</span>
      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, margin: 'var(--space-2) 0 var(--space-2)' }}>Contact Us</h1>
      <p style={{ color: 'var(--color-fg-secondary)', marginBottom: 'var(--space-10)', maxWidth: 560 }}>
        Have a question about your order, a return, or anything else? We typically reply within 24 hours.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'var(--space-12)' }}>

        {/* Contact form */}
        <div>
          {submitted ? (
            <div className="stride-empty" style={{ textAlign: 'left', padding: 0 }}>
              <i className="fa fa-check-circle" style={{ fontSize: 40, color: 'var(--color-success)', marginBottom: 'var(--space-4)' }} />
              <h3>Message sent!</h3>
              <p style={{ color: 'var(--color-fg-secondary)', fontSize: 'var(--text-sm)' }}>
                Thanks {form.name} — we'll get back to you at {form.email} within 24 hours.
              </p>
              <button
                className="stride-btn stride-btn--outline stride-btn--sm"
                style={{ marginTop: 'var(--space-4)' }}
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                  Name
                </label>
                <input
                  className="stride-input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                  Email
                </label>
                <input
                  className="stride-input"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                  Subject
                </label>
                <select
                  className="stride-input"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  style={{ width: '100%' }}
                >
                  <option value="">Select a topic…</option>
                  <option>Order status</option>
                  <option>Return / Exchange</option>
                  <option>Shipping issue</option>
                  <option>Product question</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                  Message
                </label>
                <textarea
                  className="stride-input"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                  rows={5}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>
              <button type="submit" className="stride-btn stride-btn--primary" style={{ height: 48 }}>
                Send message
              </button>
            </form>
          )}
        </div>

        {/* Info sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {[
            { icon: 'fa-envelope-o', title: 'Email us', body: 'support@stride.store', sub: 'We reply within 24 hours' },
            { icon: 'fa-clock-o',   title: 'Support hours', body: 'Mon – Fri, 9 am – 6 pm CET', sub: 'Excluding public holidays' },
            { icon: 'fa-map-marker', title: 'Headquarters', body: 'STRIDE Store, Casablanca', sub: 'Morocco' },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                display: 'flex',
                gap: 'var(--space-4)',
                padding: 'var(--space-4)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 8,
              }}
            >
              <i className={`fa ${item.icon}`} style={{ fontSize: 20, color: 'var(--color-fg-muted)', marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{item.title}</div>
                <div style={{ color: 'var(--color-fg-secondary)', fontSize: 'var(--text-sm)' }}>{item.body}</div>
                <div style={{ color: 'var(--color-fg-muted)', fontSize: 'var(--text-xs)' }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;

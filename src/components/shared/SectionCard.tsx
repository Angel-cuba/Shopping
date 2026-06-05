import React from 'react';

type Props = {
  icon: string;
  title: string;
  value?: string;
  done: boolean;
  open: boolean;
  onEdit: () => void;
  children?: React.ReactNode;
};

/**
 * Expandable section card used in multi-step flows (Checkout, etc).
 * Shows an icon, title, and optional value summary; expands inline to show children.
 */
const SectionCard: React.FC<Props> = ({ icon, title, value, done, open, onEdit, children }) => (
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
          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-fg-primary)' }}>
            {title}
          </div>
          {value && !open && (
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)', marginTop: 2 }}>
              {value}
            </div>
          )}
        </div>
      </div>
      <button
        className="stride-btn stride-btn--ghost"
        style={{ fontSize: 'var(--text-xs)', padding: '4px 12px' }}
        onClick={onEdit}
      >
        {open ? 'Cancel' : done ? 'Change' : 'Select'}
      </button>
    </div>
    {open && <div style={{ marginTop: 'var(--space-3)' }}>{children}</div>}
  </div>
);

export default SectionCard;

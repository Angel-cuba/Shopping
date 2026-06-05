import React from 'react';
import { PaymentType } from '../../../interfaces/profile/payment/paymentType';

type Props = {
  payments: PaymentType[];
  setOpenPayments: (open: boolean) => void;
  setPayment: (payment: PaymentType) => void;
};

const Payment: React.FC<Props> = ({ payments, setOpenPayments, setPayment }) => {
  const pick = (p: PaymentType) => {
    setPayment(p);
    setOpenPayments(false);
  };

  return (
    <div className="stride-card" style={{ marginTop: 'var(--space-3)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
        <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Select payment method</span>
        <button
          onClick={() => setOpenPayments(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-fg-muted)', fontSize: 18, lineHeight: 1 }}
        >
          <i className="fa fa-times" />
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {payments.map(p => (
          <button
            key={p.id}
            onClick={() => pick(p)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: '1px solid var(--color-border)',
              padding: 'var(--space-3) var(--space-4)',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              transition: 'background .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-action-subtle)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <i className="fa fa-credit-card" style={{ color: 'var(--color-action)', fontSize: 16 }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-fg-primary)' }}>
                {p.provider}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)', marginTop: 1 }}>
                •••• {p.cardNumber?.slice(-4)} · {p.cardHolderName}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Payment;

import React from 'react';
import { AddressType } from '../../../interfaces/profile/address/AddressType';

type Props = {
  addresses: AddressType[];
  setOpenAddress: (open: boolean) => void;
  setAddress: (address: string) => void;
};

const Address: React.FC<Props> = ({ addresses, setOpenAddress, setAddress }) => {
  const pick = (addr: AddressType) => {
    setAddress(`${addr.address}, ${addr.city}, ${addr.country}`);
    setOpenAddress(false);
  };

  return (
    <div className="stride-card" style={{ marginTop: 'var(--space-3)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
        <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Select address</span>
        <button
          onClick={() => setOpenAddress(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-fg-muted)', fontSize: 18, lineHeight: 1 }}
        >
          <i className="fa fa-times" />
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {addresses.map(addr => (
          <button
            key={addr.id}
            onClick={() => pick(addr)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: '1px solid var(--color-border)',
              padding: 'var(--space-3) var(--space-4)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'background .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-action-subtle)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-fg-primary)' }}>
              {addr.address}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)', marginTop: 2 }}>
              {addr.city}, {addr.country} · {addr.postalCode}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Address;

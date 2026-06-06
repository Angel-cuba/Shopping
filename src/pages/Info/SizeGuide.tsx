import React, { useState } from 'react';

type Gender = 'men' | 'women';

const MENS_SIZES = [
  { eu: '40', us: '7',    uk: '6',    cm: '25.5' },
  { eu: '41', us: '8',    uk: '7',    cm: '26.5' },
  { eu: '42', us: '8.5',  uk: '7.5',  cm: '27'   },
  { eu: '43', us: '9.5',  uk: '8.5',  cm: '27.5' },
  { eu: '44', us: '10',   uk: '9',    cm: '28'   },
  { eu: '44.5', us: '10.5', uk: '9.5', cm: '28.5' },
  { eu: '45', us: '11',   uk: '10',   cm: '29'   },
  { eu: '46', us: '12',   uk: '11',   cm: '29.5' },
  { eu: '47', us: '13',   uk: '12',   cm: '30'   },
];

const WOMENS_SIZES = [
  { eu: '35',   us: '5',    uk: '2.5',  cm: '22'   },
  { eu: '35.5', us: '5.5',  uk: '3',    cm: '22.5' },
  { eu: '36',   us: '6',    uk: '3.5',  cm: '23'   },
  { eu: '37',   us: '6.5',  uk: '4',    cm: '23.5' },
  { eu: '37.5', us: '7',    uk: '4.5',  cm: '24'   },
  { eu: '38',   us: '7.5',  uk: '5',    cm: '24.5' },
  { eu: '39',   us: '8',    uk: '5.5',  cm: '25'   },
  { eu: '40',   us: '9',    uk: '6.5',  cm: '25.5' },
  { eu: '41',   us: '10',   uk: '7.5',  cm: '26'   },
];

const TH: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--color-fg-muted)' }}>
    {children}
  </th>
);

const TD: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-fg-secondary)', borderBottom: '1px solid var(--color-border-default)' }}>
    {children}
  </td>
);

const SizeGuide: React.FC = () => {
  const [gender, setGender] = useState<Gender>('men');
  const rows = gender === 'men' ? MENS_SIZES : WOMENS_SIZES;

  return (
    <div className="stride-container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-16)', maxWidth: 700 }}>
      <span className="stride-eyebrow">Info</span>
      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, margin: 'var(--space-2) 0 var(--space-4)' }}>Size Guide</h1>
      <p style={{ color: 'var(--color-fg-secondary)', marginBottom: 'var(--space-6)', maxWidth: 520 }}>
        All STRIDE shoes are measured in EU sizing. Use this table to find your equivalent US, UK, or cm measurement.
        For the best fit, measure your foot length and round up half a size.
      </p>

      {/* Gender toggle */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
        {(['men', 'women'] as const).map((g) => (
          <button
            key={g}
            className={`stride-btn stride-btn--sm${gender === g ? ' stride-btn--primary' : ' stride-btn--outline'}`}
            onClick={() => setGender(g)}
            style={{ textTransform: 'capitalize', letterSpacing: '.04em' }}
          >
            {g === 'men' ? "Men's" : "Women's"}
          </button>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--color-border-default)', borderRadius: 8 }}>
          <thead style={{ background: 'var(--color-surface-raised)' }}>
            <tr>
              <TH>EU</TH>
              <TH>US</TH>
              <TH>UK</TH>
              <TH>cm</TH>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.eu}>
                <TD><strong>{r.eu}</strong></TD>
                <TD>{r.us}</TD>
                <TD>{r.uk}</TD>
                <TD>{r.cm}</TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Measure tip */}
      <div
        style={{
          marginTop: 'var(--space-8)',
          padding: 'var(--space-5)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 8,
          display: 'flex',
          gap: 'var(--space-4)',
        }}
      >
        <i className="fa fa-info-circle" style={{ color: 'var(--color-fg-muted)', fontSize: 18, marginTop: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>How to measure your foot</div>
          <ol style={{ paddingLeft: 16, color: 'var(--color-fg-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.8 }}>
            <li>Place your foot on a sheet of paper and trace its outline.</li>
            <li>Measure from the back of your heel to the tip of your longest toe.</li>
            <li>Match that measurement (in cm) to the table above.</li>
            <li>When between sizes, go up half a size.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;

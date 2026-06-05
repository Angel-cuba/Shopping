import React from 'react';

/**
 * STRIDE skeleton for the Product Detail Page.
 * Mirrors the .stride-pdp grid (1.35fr 1fr) with shimmer placeholders.
 */
const PdpSkeleton: React.FC = () => (
  <div className="stride-pdp" role="status" aria-label="Loading product">
    {/* Gallery column */}
    <div className="stride-pdp__gallery">
      <div className="stride-pdp__main">
        <div className="stride-sk" style={{ width: '100%', aspectRatio: '1/1' }} />
      </div>
      <div className="stride-pdp__thumbs">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="stride-sk" style={{ aspectRatio: '1/1', borderRadius: 'var(--radius-sm)' }} />
        ))}
      </div>
    </div>

    {/* Info column */}
    <div className="stride-pdp__info" aria-hidden="true">
      {/* Eyebrow */}
      <div className="stride-sk" style={{ height: 12, width: '30%', marginBottom: 12 }} />
      {/* Name */}
      <div className="stride-sk" style={{ height: 32, width: '85%', marginBottom: 8 }} />
      <div className="stride-sk" style={{ height: 32, width: '60%', marginBottom: 16 }} />
      {/* Price */}
      <div className="stride-sk" style={{ height: 28, width: '25%', marginBottom: 24 }} />
      {/* Colour label */}
      <div className="stride-sk" style={{ height: 12, width: '20%', marginBottom: 12 }} />
      {/* Swatches */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="stride-sk" style={{ width: 34, height: 34, borderRadius: '50%' }} />
        ))}
      </div>
      {/* Size label */}
      <div className="stride-sk" style={{ height: 12, width: '25%', marginBottom: 12 }} />
      {/* Size grid */}
      <div className="stride-size-grid" style={{ marginBottom: 28 }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} className="stride-sk stride-size-chip" />
        ))}
      </div>
      {/* CTAs */}
      <div className="stride-sk" style={{ height: 52, borderRadius: 'var(--radius-md)', marginBottom: 12 }} />
      <div className="stride-sk" style={{ height: 52, borderRadius: 'var(--radius-md)' }} />
    </div>
  </div>
);

export default PdpSkeleton;

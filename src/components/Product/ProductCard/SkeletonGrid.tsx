import React from 'react';

/**
 * STRIDE skeleton loading grid — shimmer animation per design prototype.
 * Replaces the Lottie-based LoadingProducts.
 */
const SkeletonGrid: React.FC<{ n?: number }> = ({ n = 8 }) => (
  <div className="stride-product-grid" role="status" aria-label="Loading products">
    {Array.from({ length: n }).map((_, i) => (
      <div key={i} className="pcard" aria-hidden="true">
        {/* Square image placeholder */}
        <div
          className="stride-sk"
          style={{ aspectRatio: '1/1', borderRadius: 'var(--radius-lg)' }}
        />
        {/* Text lines */}
        <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="stride-sk" style={{ height: 12, width: '40%' }} />
          <div className="stride-sk" style={{ height: 16, width: '70%' }} />
          <div className="stride-sk" style={{ height: 14, width: '30%' }} />
        </div>
      </div>
    ))}
  </div>
);

export default SkeletonGrid;

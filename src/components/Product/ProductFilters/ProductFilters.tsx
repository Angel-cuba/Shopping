import React from 'react';
import { COLLECTIONS, Sizes, Variants, resolveColor } from '../../../interfaces/products/ProductType';

export interface FilterState {
  category: string;
  size: string;
  variant: string;
  search: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClear: () => void;
  availableSizes?: string[];
  availableVariants?: string[];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters, onFilterChange, onClear, availableSizes, availableVariants,
}) => {
  const activeCount = [filters.category, filters.size, filters.variant, filters.search].filter(Boolean).length;
  const sizesToShow    = availableSizes    ?? Sizes;
  const variantsToShow = (availableVariants ?? Variants).slice(0, 12);

  return (
    <aside className="stride-filters" aria-label="Product filters">
      {/* Header */}
      <div className="s-flex s-justify-between s-items-center">
        <h4 style={{ font: 'var(--type-h3)' as React.CSSProperties['font'] }}>Filters</h4>
        {activeCount > 0 && (
          <button className="stride-btn stride-btn--ghost stride-btn--sm" onClick={onClear}>
            Clear all
          </button>
        )}
      </div>

      {/* Collection */}
      <div className="stride-filter-group">
        <h4>Collection</h4>
        {COLLECTIONS.map((collection) => (
          <label key={collection.value} className="stride-check">
            <input
              type="checkbox"
              checked={filters.category === collection.value}
              onChange={() => onFilterChange('category', filters.category === collection.value ? '' : collection.value)}
              aria-label={`Filter by ${collection.label}`}
            />
            {collection.label}
          </label>
        ))}
      </div>

      {/* Color */}
      <div className="stride-filter-group">
        <h4>Color</h4>
        <div className="stride-swatch-row">
          {variantsToShow.map((v) => (
            <button
              key={v}
              className={`stride-swatch${filters.variant === v ? ' is-active' : ''}`}
              style={{ background: resolveColor(v) }}
              title={v}
              aria-label={`Filter by color ${v}`}
              aria-pressed={filters.variant === v}
              onClick={() => onFilterChange('variant', filters.variant === v ? '' : v)}
            />
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="stride-filter-group">
        <h4>Size</h4>
        <div className="stride-size-grid">
          {sizesToShow.map((s) => (
            <button
              key={s}
              className={`stride-size-chip${filters.size === s ? ' is-active' : ''}`}
              style={{ height: 38, fontSize: 13 }}
              aria-label={`Size ${s}`}
              aria-pressed={filters.size === s}
              onClick={() => onFilterChange('size', filters.size === s ? '' : s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ProductFilters;

import React from 'react';
import { Sizes, Variants, VariantsColors } from '../../../interfaces/products/ProductType';

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
}

const SEASONS = ['Summer', 'Autumn', 'Winter', 'Spring'];

const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, onFilterChange, onClear }) => {
  const activeCount = [filters.category, filters.size, filters.variant, filters.search].filter(Boolean).length;

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

      {/* Season */}
      <div className="stride-filter-group">
        <h4>Season</h4>
        {SEASONS.map((s) => (
          <label key={s} className="stride-check">
            <input
              type="checkbox"
              checked={filters.category === s}
              onChange={() => onFilterChange('category', filters.category === s ? '' : s)}
              aria-label={`Filter by ${s}`}
            />
            {s}
          </label>
        ))}
      </div>

      {/* Color */}
      <div className="stride-filter-group">
        <h4>Color</h4>
        <div className="stride-swatch-row">
          {Variants.map((v) => (
            <button
              key={v}
              className={`stride-swatch${filters.variant === v ? ' is-active' : ''}`}
              style={{ background: VariantsColors[v] }}
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
        <h4>Size (US)</h4>
        <div className="stride-size-grid">
          {Sizes.map((s) => (
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

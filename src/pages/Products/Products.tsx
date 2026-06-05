import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AddBoxSharp, CancelOutlined } from '@mui/icons-material';
import { Product } from '../../interfaces/products/ProductType';
import ProductCard from '../../components/Product/ProductCard/ProductCard';
import SkeletonGrid from '../../components/Product/ProductCard/SkeletonGrid';
import ProductNotFound from './ProductNotFound';
import CreateAndEdit from '../../components/Admin/CreateAndEdit/CreateAndEdit';
import ProductFilters, { FilterState } from '../../components/Product/ProductFilters/ProductFilters';
import { RootState } from '../../redux/store';
import LoadingResponse from '../../components/Loading/LoadingResponse';
import './Products.scss';

const EMPTY_FILTERS: FilterState = { category: '', size: '', variant: '', search: '' };

interface ProductsProps {
  products: Product[];
  /** Category set externally (e.g. clicking a SeasonCard) — syncs into the internal filter */
  externalCategory?: string;
}

const Products = ({ products, externalCategory }: ProductsProps) => {
  const [filters, setFilters]               = React.useState<FilterState>(EMPTY_FILTERS);
  const [openCreateAndEdit, setOpenCreateAndEdit] = React.useState(false);

  const { id }   = useParams();
  const location = useLocation();
  const { loading, success } = useSelector((state: RootState) => state.products);

  // Sync external category override (e.g. from SeasonCards click)
  React.useEffect(() => {
    if (externalCategory !== undefined) {
      setFilters((prev) => ({ ...prev, category: externalCategory }));
    }
  }, [externalCategory]);

  const handleFilterChange = React.useCallback((key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleClear = React.useCallback(() => setFilters(EMPTY_FILTERS), []);

  const filtered = React.useMemo(() => {
    return products.filter((p: Product) => {
      const nameOk    = !filters.search   || p.name.toLowerCase().includes(filters.search.toLowerCase());
      const sizeOk    = !filters.size     || p.sizes.includes(filters.size as Product['sizes'][number]);
      const catOk     = !filters.category || p.categories.toLowerCase() === filters.category.toLowerCase();
      const variantOk = !filters.variant  || p.variants.includes(filters.variant as Product['variants'][number]);
      return nameOk && sizeOk && catOk && variantOk;
    });
  }, [products, filters]);

  const hasFilters = Object.values(filters).some(Boolean);
  const activeCount = Object.values(filters).filter(Boolean).length;

  if (loading) return <SkeletonGrid n={8} />;

  const isAdmin = location.pathname.includes('admin');

  return (
    <>
      {/* Admin: add product button */}
      {isAdmin && (
        <div className="products__create">
          <div
            className={!openCreateAndEdit ? 'products__button-open' : 'products__button-close'}
            onClick={() => setOpenCreateAndEdit((v) => !v)}
          >
            {!openCreateAndEdit
              ? <AddBoxSharp fontSize="large" />
              : <CancelOutlined fontSize="large" style={{ color: '#ff0000' }} />
            }
            <p className="products__button-text">{openCreateAndEdit ? '' : 'Add product'}</p>
          </div>
          {openCreateAndEdit && (
            <CreateAndEdit productId={id} setOpenCreateAndEdit={setOpenCreateAndEdit} />
          )}
        </div>
      )}

      {products.length === 0 ? (
        <p style={{ color: 'var(--color-fg-muted)', textAlign: 'center', padding: '48px 0' }}>
          No products found.
        </p>
      ) : (
        <div className="stride-catalog">
          {/* Sidebar filters */}
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClear={handleClear}
          />

          {/* Main content */}
          <div>
            {/* Admin loading overlay */}
            {success && (
              <div className="products__admin-loading">
                <LoadingResponse />
              </div>
            )}

            {/* Toolbar */}
            <div className="stride-catalog-toolbar">
              <div className="stride-search">
                <i className="fa fa-search" aria-hidden="true" />
                <input
                  className="stride-input"
                  placeholder="Search by name…"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  aria-label="Search products"
                />
              </div>

              {/* Active filter pills */}
              {activeCount > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  {filters.category && (
                    <span
                      className="stride-badge stride-badge--active"
                      onClick={() => handleFilterChange('category', '')}
                      style={{ cursor: 'pointer' }}
                    >
                      {filters.category}&nbsp;<i className="fa fa-times" aria-hidden="true" />
                    </span>
                  )}
                  {filters.variant && (
                    <span
                      className="stride-badge stride-badge--active"
                      onClick={() => handleFilterChange('variant', '')}
                      style={{ cursor: 'pointer' }}
                    >
                      {filters.variant}&nbsp;<i className="fa fa-times" aria-hidden="true" />
                    </span>
                  )}
                  {filters.size && (
                    <span
                      className="stride-badge stride-badge--active"
                      onClick={() => handleFilterChange('size', '')}
                      style={{ cursor: 'pointer' }}
                    >
                      US {filters.size}&nbsp;<i className="fa fa-times" aria-hidden="true" />
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Product grid */}
            <div className="products__content stride-product-grid">
              {hasFilters ? (
                filtered.length === 0 ? (
                  <ProductNotFound
                    valueNotFound={filters.search || filters.size || filters.category || filters.variant}
                  />
                ) : (
                  filtered.map((p: Product) => <ProductCard key={p.id} product={p} />)
                )
              ) : (
                products.map((p: Product) => <ProductCard key={p.id} product={p} />)
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Products;

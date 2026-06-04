import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AddBoxSharp, CancelOutlined } from '@mui/icons-material';
import { Product, Sizes, Variants } from '../../interfaces/products/ProductType';
import ProductCard from '../../components/Product/ProductCard/ProductCard';
import SkeletonGrid from '../../components/Product/ProductCard/SkeletonGrid';
import ProductNotFound from './ProductNotFound';
import CreateAndEdit from '../../components/Admin/CreateAndEdit/CreateAndEdit';
import { RootState } from '../../redux/store';
import LoadingResponse from '../../components/Loading/LoadingResponse';
import { Input } from '../../components/Input/Input';
import './Products.scss';

const Products = ({ products }: { products: Product[] }) => {
  const [size, setSize]             = React.useState('');
  const [variant, setVariant]       = React.useState('');
  const [category, setCategory]     = React.useState('');
  const [singleFilter, setSingleFilter] = React.useState('');
  const [openFilters, setOpenFilters]   = React.useState(false);
  const [openCreateAndEdit, setOpenCreateAndEdit] = React.useState(false);
  const [openSizes, setOpenSizes]   = React.useState(false);

  const { id }       = useParams();
  const location     = useLocation();
  const { loading, success } = useSelector((state: RootState) => state.products);

  // ── Single AND-logic filter replaces 90 lines of broken OR/cascade branching ──
  const filtered = React.useMemo(() => {
    return products.filter((p: Product) => {
      const nameOk    = !singleFilter || p.name.toLowerCase().includes(singleFilter.toLowerCase());
      const sizeOk    = !size         || p.sizes.includes(size as Product['sizes'][number]);
      const catOk     = !category     || p.categories.toLowerCase() === category.toLowerCase();
      const variantOk = !variant      || p.variants.includes(variant as Product['variants'][number]);
      return nameOk && sizeOk && catOk && variantOk;
    });
  }, [products, singleFilter, size, category, variant]);

  const hasFilters = !!(singleFilter || size || category || variant);

  const filtersToDefaultValue = () => { setSize(''); setCategory(''); setVariant(''); setSingleFilter(''); };
  const seasons: string[] = ['Summer', 'Winter', 'Autumn', 'Spring'];

  if (loading) return <SkeletonGrid n={8} />;

  return (
    <>
      {/* Admin: add product button */}
      {location.pathname.includes('admin') && (
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
        <div className="products">
          {/* Admin operation loading overlay */}
          {success && (
            <div className="products__admin-loading">
              <LoadingResponse />
            </div>
          )}

          {/* Filter toggle */}
          <div className="products__controlPanel" onClick={() => setOpenFilters((v) => !v)}>
            <p
              className="products__controlPanel--button"
              onClick={openFilters ? filtersToDefaultValue : undefined}
            >
              {openFilters ? 'Hide filters' : 'Open filters'}
            </p>
          </div>

          {/* Filter panel */}
          <div className="products__panel">
            {/* Multi-filter panel */}
            <div className={openFilters ? 'products__panel--visible' : 'products__panel--hidden'}>
              {/* Size selector */}
              <div className="products__panel--visible__size">
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="products__panel--visible__size__item"
                  style={{ border: '1px solid var(--color-border-strong)', minWidth: '140px' }}
                  onMouseEnter={() => setOpenSizes(true)}
                  onMouseLeave={() => setOpenSizes(false)}
                >
                  <option value="" disabled style={{ textAlign: 'center' }}>
                    {!openSizes ? 'Select size' : 'Selecting'}
                  </option>
                  {Sizes.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Season (category) pills */}
              <div className="products__panel--visible__seasson">
                {seasons.map((s) => (
                  <p
                    key={s}
                    className="products__panel--visible__seasson__item"
                    onClick={() => setCategory((c) => (c === s ? '' : s))}
                    style={{
                      backgroundColor: category === s ? 'var(--color-tab-active)' : '',
                      color:           category === s ? 'var(--color-fg-inverted)' : '',
                      border: '1.4px solid var(--color-border-default)',
                    }}
                  >
                    {s}
                  </p>
                ))}
              </div>

              {/* Variant (color) pills */}
              <div className="products__panel--visible__variant">
                {Variants.map((v) => (
                  <p
                    key={v}
                    className="products__panel--visible__variant__item"
                    onClick={() => setVariant((cur) => (cur === v ? '' : v))}
                    style={{
                      backgroundColor: variant === v ? 'var(--color-tab-active)' : '',
                      color:           variant === v ? 'var(--color-fg-inverted)' : '',
                      border: '1.4px solid var(--color-border-default)',
                    }}
                  >
                    {v}
                  </p>
                ))}
              </div>
            </div>

            {/* Single text search (when filters hidden) */}
            <div className={!openFilters ? 'products__panel--single' : 'products__panel--hidden'}>
              <Input
                name=""
                value={singleFilter}
                placeholder="Search by name"
                type="text"
                onChange={(e) => setSingleFilter(e.target.value)}
                style={{
                  border: '1px solid var(--color-border-strong)',
                  color: 'var(--color-fg-primary)',
                  width: '170px',
                  height: '40px',
                  fontSize: '18px',
                  borderRadius: '5px',
                  padding: '5px',
                  boxShadow: '0 0 3px 0 var(--color-border-strong)',
                  fontWeight: 'bold',
                  background: 'var(--color-bg-surface)',
                }}
              />
            </div>
          </div>

          {/* Product grid */}
          <div className="products__content stride-product-grid">
            {hasFilters ? (
              filtered.length === 0 ? (
                <ProductNotFound valueNotFound={singleFilter || size || category || variant} />
              ) : (
                filtered.map((p: Product) => <ProductCard key={p.id} product={p} />)
              )
            ) : (
              products.map((p: Product) => <ProductCard key={p.id} product={p} />)
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Products;

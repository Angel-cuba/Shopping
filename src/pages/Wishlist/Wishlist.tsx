import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { removingFromWishList } from '../../redux/actions/WishesActions';
import { fetchProducts } from '../../redux/actions/ProductActions';
import { Product, resolveColor, resolveImageUrl, onImgError } from '../../interfaces/products/ProductType';
import { toast } from 'react-hot-toast';

const Wishlist: React.FC = () => {
  const dispatch        = useDispatch<AppDispatch>();
  const navigate        = useNavigate();
  const wishlist        = useSelector((s: RootState) => s.wishes.itemInWishlist) ?? [];
  const allProducts     = useSelector((s: RootState) => s.products.products) as Product[];
  const userFromToken   = useSelector((s: RootState) => s.userLogged.userFromToken);

  // Fetch products if user navigated directly to /wishlist without visiting Home first
  useEffect(() => {
    if (allProducts.length === 0) dispatch(fetchProducts());
  }, [dispatch, allProducts.length]);

  const wishlisted = allProducts.filter((p) => wishlist.includes(p.id));

  const handleRemove = (productId: string, name: string) => {
    if (!userFromToken) return;
    dispatch(removingFromWishList(productId, userFromToken.user_id));
    toast(`${name} removed from wishlist`, {
      position: 'top-center',
      duration: 1800,
      style: { background: '#333', color: '#ddd' },
      icon: '♡',
    });
  };

  return (
    <div className="stride-container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-16)' }}>

      {/* Header */}
      <div className="stride-section-head">
        <div>
          <span className="stride-eyebrow">Account</span>
          <h2>Wishlist {wishlisted.length > 0 && <span style={{ color: 'var(--color-fg-muted)', fontWeight: 400, fontSize: 'var(--text-xl)' }}>({wishlisted.length})</span>}</h2>
        </div>
        <Link to="/home" className="stride-btn stride-btn--outline">
          Continue shopping
        </Link>
      </div>

      {/* Empty state */}
      {wishlisted.length === 0 && (
        <div className="stride-empty">
          <i className="fa fa-heart-o" style={{ fontSize: 48, color: 'var(--color-fg-placeholder)' }} />
          <h3>Your wishlist is empty</h3>
          <p style={{ color: 'var(--color-fg-secondary)', fontSize: 'var(--text-sm)', maxWidth: 320, textAlign: 'center' }}>
            Save products you love by clicking the heart icon on any product.
          </p>
          <button
            className="stride-btn stride-btn--primary"
            onClick={() => navigate('/home')}
          >
            Explore products
          </button>
        </div>
      )}

      {/* Product grid */}
      {wishlisted.length > 0 && (
        <div className="stride-product-grid">
          {wishlisted.map((product) => {
            const out = product.inStock === 0;
            return (
              <article key={product.id} className={`pcard${out ? ' is-out' : ''}`}>

                {/* Media */}
                <div className="pcard__media">
                  {/* Remove button */}
                  <button
                    className="pcard__wish is-active"
                    title="Remove from wishlist"
                    style={{ opacity: 1, transform: 'none' }}
                    onClick={() => handleRemove(product.id, product.name)}
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <i className="fa fa-heart" style={{ color: 'var(--color-error)' }} />
                  </button>

                  <Link
                    to={`/product/${product.id}`}
                    style={{ display: 'block', width: '100%', height: '100%' }}
                  >
                    <img
                      src={resolveImageUrl(product.image, product.name, product.categories)}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={onImgError(product.name, product.categories)}
                    />
                  </Link>

                  {/* Stock badge */}
                  {out && (
                    <div className="pcard__badges">
                      <span className="stride-badge stride-badge--out">Sold out</span>
                    </div>
                  )}
                </div>

                {/* Body */}
                <Link to={`/product/${product.id}`} className="pcard__body" style={{ textDecoration: 'none' }}>
                  {/* Color swatches */}
                  <div className="pcard__swatches">
                    {product.variants.slice(0, 4).map((v) => (
                      <span
                        key={v}
                        className="dot"
                        style={{ background: resolveColor(v) }}
                        title={v}
                      />
                    ))}
                  </div>
                  <span className="pcard__name">{product.name}</span>
                  <span className="pcard__cat">{product.categories} collection</span>
                  <span className="pcard__price">${product.price.toFixed(2)}</span>
                </Link>

                {/* Quick-move to cart */}
                {!out && (
                  <div style={{ padding: 'var(--space-3) 0 0' }}>
                    <Link
                      to={`/product/${product.id}`}
                      className="stride-btn stride-btn--primary stride-btn--block stride-btn--sm stride-btn--uc"
                    >
                      Select size
                    </Link>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

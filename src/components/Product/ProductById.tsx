import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { AppDispatch, RootState } from '../../redux/store';
import { Product, Sizes, VariantsColors } from '../../interfaces/products/ProductType';
import { CartProduct } from '../../interfaces/cart/CartType';
import { addToCart } from '../../redux/actions/CartActions';
import { addingToWishList, createWishList, removingFromWishList } from '../../redux/actions/WishesActions';
import { apiWithoutAuth } from '../../utils/api';
import ProductCard from './ProductCard/ProductCard';
import PdpSkeleton from './PdpSkeleton';
// Note: ProductById.scss (legacy .productId__* BEM classes) has been removed.
// All styles come from the STRIDE design-system classes in src/styles/stride.scss.

// ── Toast helpers ─────────────────────────────────────────────────────────────
// Intentional deviation: the legacy handleToast() in src/utils/notifications.ts
// is a string-dispatch table with hardcoded messages and no typed API.  Rather
// than force PDP-specific messages through magic strings, we call react-hot-toast
// directly here.  The shared utility will be refactored to a typed helper
// (showToast(type, message, options?)) at which point these can be merged back.

const toastAdded = (name: string) =>
  toast.success(`${name} added to cart`, {
    position: 'top-center',
    duration: 2000,
    style: { background: '#111', color: '#fff', fontWeight: 600 },
    icon: '🛒',
  });

const toastWishAdded = () =>
  toast.success('Added to wishlist', {
    position: 'top-center',
    duration: 1800,
    style: { background: '#111', color: '#fff', fontWeight: 600 },
    icon: '♥',
  });

const toastWishRemoved = () =>
  toast('Removed from wishlist', {
    position: 'top-center',
    duration: 1800,
    style: { background: '#333', color: '#ddd' },
    icon: '♡',
  });

const toastPickSize = () =>
  toast.error('Please select a size first', {
    position: 'top-center',
    duration: 1800,
  });

// ── Component ─────────────────────────────────────────────────────────────────

const ProductById: React.FC = () => {
  const { id }   = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { products }            = useSelector((s: RootState) => s.products);
  const userFromToken           = useSelector((s: RootState) => s.userLogged.userFromToken);
  const wishlist: string[]      = useSelector((s: RootState) => s.wishes.itemInWishlist) ?? [];

  const [product,  setProduct]  = useState<Product | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [size,     setSize]     = useState<string>('');
  const [variant,  setVariant]  = useState<string>('');
  const [thumb,    setThumb]    = useState(0); // selected gallery thumb index

  // Fetch product by id
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setSize('');
    setVariant('');
    apiWithoutAuth
      .get<Product>(`/products/${id}`)
      .then((r) => setProduct(r.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Derived state ───────────────────────────────────────────────────────────

  const isWished = product ? wishlist?.includes(product.id) : false;

  // "You may also like" — same first variant, excluding current product, cap at 4
  const related: Product[] = product
    ? products
        .filter((p: Product) => p.variants[0] === product.variants[0] && p.id !== product.id)
        .slice(0, 4)
    : [];

  // Gallery — product has one image; repeat it to fill all 4 thumbs
  const galleryImages = product ? [product.image, product.image, product.image, product.image] : [];

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleAddToCart = () => {
    if (!product) return;
    if (!size) { toastPickSize(); return; }

    const item: CartProduct = {
      id:          product.id,
      name:        product.name,
      description: product.description,
      price:       product.price,
      image:       product.image,
      categories:  product.categories,
      sizes:       size,
      variant:     variant || undefined,
      quantity:    1,
      stock:       product.inStock,
    };
    dispatch(addToCart(item));
    toastAdded(product.name);
  };

  const handleWishlist = () => {
    if (!product || !userFromToken) return;
    if (isWished) {
      dispatch(removingFromWishList(product.id, userFromToken.user_id));
      toastWishRemoved();
    } else {
      // wishlist.length === 0 means the user has no list yet — must create one first.
      // addingToWishList assumes data[0] exists and will crash on an empty response.
      if (wishlist.length === 0) {
        dispatch(createWishList(product.id, userFromToken.user_id));
      } else {
        dispatch(addingToWishList(product.id, userFromToken.user_id));
      }
      toastWishAdded();
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) return <div className="stride-container" style={{ paddingTop: 'var(--space-10)' }}><PdpSkeleton /></div>;

  if (!product) {
    return (
      <div className="stride-container" style={{ paddingTop: 'var(--space-16)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)' }}>Product not found</h2>
        <Link to="/" className="stride-btn stride-btn--secondary" style={{ marginTop: 'var(--space-6)', display: 'inline-block' }}>
          Back to catalog
        </Link>
      </div>
    );
  }

  const availableSizes = new Set(product.sizes);

  return (
    <div className="stride-container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-16)' }}>

      {/* ── PDP grid ─────────────────────────────────────────────── */}
      <div className="stride-pdp">

        {/* Gallery */}
        <div className="stride-pdp__gallery">
          <div className="stride-pdp__main">
            <img src={galleryImages[thumb]} alt={product.name} />
          </div>
          <div className="stride-pdp__thumbs">
            {galleryImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${product.name} view ${i + 1}`}
                className={thumb === i ? 'is-active' : ''}
                style={{ outline: thumb === i ? '2px solid var(--color-fg-primary)' : 'none' }}
                onClick={() => setThumb(i)}
              />
            ))}
          </div>
        </div>

        {/* Info panel */}
        <div className="stride-pdp__info">
          {/* Eyebrow */}
          <span className="stride-eyebrow">{product.categories}</span>

          {/* Name */}
          <h1>{product.name}</h1>

          {/* Price */}
          <p className="stride-pdp__price">${product.price.toFixed(2)}</p>

          {/* Description */}
          <p style={{ color: 'var(--color-fg-secondary)', marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>
            {product.description}
          </p>

          {/* Colour selector */}
          {product.variants.length > 0 && (
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <div className="stride-pdp__label-row">
                <span className="lbl">Colour</span>
                {variant && (
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-secondary)' }}>
                    {variant}
                  </span>
                )}
              </div>
              <div className="stride-swatch-row">
                {product.variants.map((v) => (
                  <button
                    key={v}
                    className={`stride-swatch stride-swatch--lg${variant === v ? ' is-active' : ''}`}
                    style={{ background: VariantsColors[v] ?? v }}
                    aria-label={v}
                    aria-pressed={variant === v}
                    title={v}
                    onClick={() => setVariant(variant === v ? '' : v)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <div className="stride-pdp__label-row">
              <span className="lbl">Size (US)</span>
              <span
                className="link"
                style={{ cursor: 'pointer' }}
                onClick={() => {/* size guide modal future */}}
              >
                Size guide
              </span>
            </div>
            <div className="stride-size-grid">
              {Sizes.map((s) => {
                const available = availableSizes.has(s as Product['sizes'][number]);
                return (
                  <button
                    key={s}
                    className={`stride-size-chip${size === s ? ' is-active' : ''}`}
                    disabled={!available}
                    aria-label={`US ${s}${!available ? ', unavailable' : ''}`}
                    aria-pressed={size === s}
                    onClick={() => available && setSize(size === s ? '' : s)}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Spec rows */}
          <div style={{ marginBottom: 'var(--space-6)', borderTop: '1px solid var(--color-border-default)' }}>
            <div className="stride-pdp__spec-row">
              <i className="fa fa-truck" aria-hidden="true" />
              <span>Free standard delivery on orders over $50</span>
            </div>
            <div className="stride-pdp__spec-row">
              <i className="fa fa-undo" aria-hidden="true" />
              <span>Free returns within 30 days</span>
            </div>
            <div className="stride-pdp__spec-row">
              <i className="fa fa-map-marker" aria-hidden="true" />
              <span>Available for in-store pickup</span>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <button
              className="stride-btn stride-btn--primary"
              style={{ width: '100%', height: 52, fontSize: 'var(--text-base)', letterSpacing: '.06em' }}
              onClick={handleAddToCart}
            >
              {size ? 'Add to cart' : 'Select a size'}
            </button>

            {userFromToken && (
              <button
                className="stride-btn stride-btn--secondary"
                style={{ width: '100%', height: 52, fontSize: 'var(--text-base)' }}
                onClick={handleWishlist}
                aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <i
                  className={isWished ? 'fa fa-heart' : 'fa fa-heart-o'}
                  aria-hidden="true"
                  style={{ marginRight: 8 }}
                />
                {isWished ? 'Wishlisted' : 'Add to wishlist'}
              </button>
            )}
          </div>

          {/* Stock badge */}
          {product.inStock < 5 && product.inStock > 0 && (
            <p style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-warning)' }}>
              Only {product.inStock} left in stock
            </p>
          )}
          {product.inStock === 0 && (
            <p style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-error)' }}>
              Out of stock
            </p>
          )}
        </div>
      </div>

      {/* ── You may also like ────────────────────────────────────── */}
      {related.length > 0 && (
        <section style={{ marginTop: 'var(--space-16)' }}>
          <div className="stride-section-head">
            <div>
              <span className="stride-eyebrow">Recommendations</span>
              <h2>You may also like</h2>
            </div>
          </div>
          <div className="stride-product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── Sticky mobile add bar ────────────────────────────────── */}
      <div className="stride-sticky-add">
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <p style={{ margin: 0, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.name}
          </p>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-fg-secondary)' }}>
            ${product.price.toFixed(2)}{size ? ` · US ${size}` : ''}
          </p>
        </div>
        <button
          className="stride-btn stride-btn--primary"
          style={{ flexShrink: 0, height: 46, paddingInline: 'var(--space-6)' }}
          onClick={handleAddToCart}
        >
          {size ? 'Add to cart' : 'Pick a size'}
        </button>
      </div>
    </div>
  );
};

export default ProductById;

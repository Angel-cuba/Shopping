import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import { addToCart } from '../../../redux/actions/CartActions';
import { addToWishList } from '../../../redux/actions/WishesActions';
import { Product, VariantsColors } from '../../../interfaces/products/ProductType';
import { CartProduct } from '../../../interfaces/cart/CartType';
import { isAdmin } from '../../../utils/authentication';
import { notifySuccess } from '../../../utils/notify';
import CreateAndEdit from '../../Admin/CreateAndEdit/CreateAndEdit';
import { deleteProductFromStock } from '../../../redux/actions/ProductActions';

// ── Stock badge helper (from design prototype data.jsx) ────────────────────────
function stockBadge(n: number): { cls: string; text: string } | null {
  if (n === 0)  return { cls: 'out',  text: 'Sold out' };
  if (n < 5)   return { cls: 'low',  text: `Only ${n} left` };
  if (n < 11)  return { cls: 'low',  text: 'Last units' };
  return null;
}

// ── Color swatch dots ──────────────────────────────────────────────────────────
function SwatchDots({ variants, max = 4 }: { variants: string[]; max?: number }) {
  const shown = variants.slice(0, max);
  return (
    <div className="pcard__swatches">
      {shown.map((v) => (
        <span
          key={v}
          className="dot"
          style={{ background: VariantsColors[v] ?? '#ccc' }}
          title={v}
        />
      ))}
      {variants.length > max && (
        <span className="pcard__cat" style={{ alignSelf: 'center', fontSize: 12 }}>
          +{variants.length - max}
        </span>
      )}
    </div>
  );
}

// ── ProductCard ────────────────────────────────────────────────────────────────
interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product: p }) => {
  const dispatch   = useDispatch<AppDispatch>();
  const location   = useLocation();
  const [editing, setEditing] = React.useState(false);

  const adminUser = React.useMemo(() => isAdmin(), []);
  const inAdminArea = location.pathname.includes('admin');

  const out    = p.inStock === 0;
  const badge  = stockBadge(p.inStock);

  // Quick-add: use first available size + first variant
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const item: CartProduct = {
      id:          p.id,
      name:        p.name,
      description: p.description,
      price:       p.price,
      image:       p.image,
      categories:  p.categories,
      sizes:       p.sizes[0] ?? '',
      variant:     p.variants[0] ?? '',
      quantity:    1,
      stock:       p.inStock,
    };
    dispatch(addToCart(item));
    notifySuccess(`${p.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToWishList(p.id));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(deleteProductFromStock(p.id));
    notifySuccess('Product deleted');
  };

  return (
    <>
      <article className={`pcard${out ? ' is-out' : ''}`}>

        {/* ── Media (square image) ─────────────────────────────── */}
        <div className="pcard__media">

          {/* Badges */}
          <div className="pcard__badges">
            {/* Admin edit/delete */}
            {adminUser && inAdminArea && (
              <>
                <button
                  className="stride-btn stride-btn--sm"
                  style={{ background: 'rgba(255,255,255,0.9)', color: '#111', border: 'none', padding: '4px 8px' }}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditing((v) => !v); }}
                  title="Edit product"
                >
                  <i className="fa fa-pencil" />
                </button>
                <button
                  className="stride-btn stride-btn--sm stride-btn--danger"
                  style={{ padding: '4px 8px' }}
                  onClick={handleDelete}
                  title="Delete product"
                >
                  <i className="fa fa-trash" />
                </button>
              </>
            )}
            {/* Product tag badges */}
            {!adminUser && (
              <>
                {badge && (
                  <span className={`stride-badge stride-badge--${badge.cls}`}>{badge.text}</span>
                )}
              </>
            )}
          </div>

          {/* Wishlist button (hover reveal) */}
          {!adminUser && (
            <button
              className="pcard__wish"
              title="Add to wishlist"
              onClick={handleWishlist}
            >
              <i className="fa fa-heart-o" />
            </button>
          )}

          {/* Product image — NO rotation! */}
          <Link
            to={`/product/${p.id}`}
            style={{ display: 'block', width: '100%', height: '100%' }}
          >
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'var(--color-bg-muted)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--color-fg-placeholder)',
                  fontSize: 13,
                }}
              >
                {p.name}
              </div>
            )}
          </Link>

          {/* Quick add (hover reveal) */}
          {!out && !adminUser && (
            <div className="pcard__quick">
              <button
                className="stride-btn stride-btn--primary stride-btn--block stride-btn--sm stride-btn--uc"
                onClick={handleQuickAdd}
              >
                Add to cart
              </button>
            </div>
          )}
        </div>

        {/* ── Body ─────────────────────────────────────────────── */}
        <Link to={`/product/${p.id}`} className="pcard__body" style={{ textDecoration: 'none' }}>
          <SwatchDots variants={p.variants} />
          <span className="pcard__name">{p.name}</span>
          <span className="pcard__cat">{p.categories} collection</span>
          <span className="pcard__price">£{p.price.toFixed(2)}</span>
        </Link>

      </article>

      {/* Inline edit form (admin only) */}
      {editing && (
        <CreateAndEdit
          productId={p.id}
          setOpenCreateAndEdit={setEditing}
        />
      )}
    </>
  );
};

export default ProductCard;

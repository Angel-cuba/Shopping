import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '../../redux/store';
import { CartProduct } from '../../interfaces/cart/CartType';
import { VariantsColors } from '../../interfaces/products/ProductType';
import { addToCart, removeFromCart } from '../../redux/actions/CartActions';

interface CartLineItemProps {
  item: CartProduct;
  /** IDs of items that exceed available stock — shows a warning label */
  notEnoughStock?: string[];
}

const CartLineItem: React.FC<CartLineItemProps> = ({ item, notEnoughStock }) => {
  const dispatch    = useDispatch<AppDispatch>();
  const atStockLimit = item.quantity >= item.stock;
  const lineTotal    = (item.price * item.quantity).toFixed(2);
  const stockWarning = notEnoughStock?.includes(item.id);

  return (
    <div className="cart-line">
      {/* Thumbnail */}
      <div className="cart-line__img">
        <Link to={`/product/${item.id}`} tabIndex={-1} aria-hidden="true">
          <img src={item.image} alt={item.name} />
        </Link>
      </div>

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0 }}>
        {/* Name + remove */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <Link
            to={`/product/${item.id}`}
            style={{ fontWeight: 600, fontSize: 'var(--text-sm)', lineHeight: 1.3, color: 'inherit' }}
          >
            {item.name}
          </Link>
          <button
            aria-label={`Remove ${item.name}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-fg-muted)', flexShrink: 0, padding: 0 }}
            onClick={() => dispatch(removeFromCart({ ...item, quantity: item.quantity }))}
          >
            <i className="fa fa-times" />
          </button>
        </div>

        {/* Meta — size + colour swatch */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
          {item.sizes && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)' }}>
              US {item.sizes}
            </span>
          )}
          {item.variant && VariantsColors[item.variant] && (
            <span
              style={{
                display: 'inline-block',
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: VariantsColors[item.variant],
                border: '1px solid var(--color-border-default)',
                flexShrink: 0,
              }}
              title={item.variant}
            />
          )}
          {stockWarning && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)', fontWeight: 600 }}>
              Not enough stock
            </span>
          )}
          {atStockLimit && !stockWarning && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-warning)' }}>
              Max stock
            </span>
          )}
        </div>

        {/* Qty stepper + line price */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-1)' }}>
          <div className="stride-qty" role="group" aria-label="Quantity">
            <button
              aria-label="Decrease quantity"
              onClick={() => dispatch(removeFromCart(item))}
            >
              <i className="fa fa-minus" style={{ fontSize: 10 }} />
            </button>
            <span aria-live="polite">{item.quantity}</span>
            <button
              aria-label="Increase quantity"
              disabled={atStockLimit}
              onClick={() => dispatch(addToCart(item))}
              style={{ opacity: atStockLimit ? 0.4 : 1 }}
            >
              <i className="fa fa-plus" style={{ fontSize: 10 }} />
            </button>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>${lineTotal}</span>
            {item.quantity > 1 && (
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)' }}>
                ${item.price.toFixed(2)} each
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartLineItem;

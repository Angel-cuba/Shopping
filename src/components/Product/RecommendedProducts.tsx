import React from 'react';
import { Link } from 'react-router-dom';
import { Product, resolveImageUrl, onImgError } from '../../interfaces/products/ProductType';

const RecommendedProducts = ({ product }: { product: Product }) => {
  return (
    <div className="productId__recommended__items__content">
      <div className="productId__recommended__items__content--image">
        <Link to={`/product/${product.id}`}>
          <img
            src={resolveImageUrl(product.image, product.name, product.categories)}
            alt={product.name}
            onError={onImgError(product.name, product.categories)}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '5px',
            }}
          />
        </Link>
        <p className="productId__recommended__items__content--price">£{product.price}</p>
      </div>
    </div>
  );
};

export default RecommendedProducts;

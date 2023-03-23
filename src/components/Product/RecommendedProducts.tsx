import React from 'react'
import { Link } from 'react-router-dom'
import { Product } from '../../interfaces/ProductType'

const RecommendedProducts = ({ product }: { product: Product }) => {
  return (
    <div className="productId__recommended__items__content">
      <div className="productId__recommended__items__content--image">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '5px'
            }}
          />
        </Link>
        <p className="productId__recommended__items__content--image--price">£{product.price}</p>
      </div>
    </div>
  )
}

export default RecommendedProducts

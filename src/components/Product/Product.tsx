import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Product } from '../../interfaces/products/ProductType'
import { CartIcon } from '../Cart/Cart'

const ProductItem = ({ product }: { product: Product }) => {
  const location = useLocation()
  const { pathname } = location

  return (
    <div key={product.id} className="products__content__item">
      {pathname !== `/product/${product.id}` && (
        <div className="products__content__item--details">
          <Link to={`/product/${product.id}`}>
            <MoreVertIcon />
            Details
          </Link>
        </div>
      )}
      <div className="products__content__item--add">
        <div className="products__content__item--name--icon">
          <CartIcon product={product} />
        </div>
      </div>
      <div className="products__content__item--image">
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '5px',
            objectFit: 'cover',
            transform: 'rotate(-20deg)'
          }}
        />
      </div>
      <div className="products__content__item--info">
        <h3 className="products__content__item--info--name">{product.name.slice(0, 12)}</h3>
        <p className="products__content__item--info--description">
          {product.description.slice(0, 20)}...
        </p>
        <p className="products__content__item--info--price">£{product.price}</p>
      </div>
    </div>
  )
}

export default ProductItem

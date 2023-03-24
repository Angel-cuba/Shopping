import React from 'react'
import { Link } from 'react-router-dom'
import { Product } from '../../interfaces/products/ProductType'
import { CartIcon } from '../Cart/Cart'

const ProductItem = ({ product }: { product: Product }) => {
  const [itemAddedCart, setAddedCart] = React.useState<boolean>(false)

  const handleAddToCart = () => {
    setAddedCart(!itemAddedCart)
  }

  return (
    <div key={product.id} className="products__content__item">
      <div className="products__content__item--name">
        <h3>{product.name.slice(0, 12)}</h3>
        <div className="products__content__item--name--icon" onClick={handleAddToCart}>
          <CartIcon itemAddedToCart={itemAddedCart} />
        </div>
      </div>
      <div className="products__content__item--image">
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '90%',
            height: '200px',
            borderRadius: '5px'
          }}
        />
        <p className="products__content__item--image--price">£{product.price}</p>
      </div>
      <div className="products__content__item--buttons">
        <div className="products__content__item--buttons--buy">Buy</div>
        <div className="products__content__item--buttons--details">
          <Link to={`/product/${product.id}`}>Details</Link>
        </div>
      </div>
    </div>
  )
}

export default ProductItem

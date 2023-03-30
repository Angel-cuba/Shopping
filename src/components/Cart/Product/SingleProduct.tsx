import React from 'react'
import AddBoxIcon from '@mui/icons-material/AddBox'
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import { addToCart, removeFromCart } from '../../../redux/actions/CartActions'
import { CartProduct } from '../../../interfaces/cart/CartType'
import './SingleProduct.scss'
import { Link } from 'react-router-dom'

const SingleProduct = ({ item }: { item: CartProduct }) => {
  const dispatch = useDispatch<AppDispatch>()

  const addItemToCart = () => {
    dispatch(addToCart(item))
  }
  const removeItemFromCart = () => {
    dispatch(removeFromCart(item))
  }

  return (
    <div className="cart-product" key={item.id}>
      <div className="cart-product__image">
        <Link to={`/checkout/product/${item.id}`}>
          <img
            src={item.image}
            alt={item.name}
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'cover'
            }}
          />
        </Link>
      </div>

      <div className="cart-product__buttons">
        <div className="cart-product__buttons__plus-minus">
          <AddBoxIcon style={{ fontSize: '2rem', color: '#146D00' }} onClick={addItemToCart} />
          <p className="cart-product__buttons__plus-minus--quantity">{item.quantity}</p>
          <IndeterminateCheckBoxIcon
            style={{ fontSize: '2rem', color: '#9D0000' }}
            onClick={removeItemFromCart}
          />
        </div>
        <div className="cart-product__buttons--data">
          <p className="">{item.name}</p>
          <p
            style={{
              width: '25px',
              height: '25px',
              backgroundColor: `${item.variant}`,
              position: 'absolute',
              top: '3px',
              left: '2%',
              borderRadius: '25px'
            }}></p>
        </div>
        <p className="cart-product__buttons--price">
          ${item.quantity ? (item?.quantity * item?.price).toFixed(2) : item?.price}
        </p>
      </div>
    </div>
  )
}

export default SingleProduct

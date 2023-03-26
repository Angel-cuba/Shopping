import React from 'react'
import AddBoxIcon from '@mui/icons-material/AddBox'
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { addToCart, removeFromCart } from '../../redux/actions/CartActions'
import { CartProduct } from '../../interfaces/cart/CartType'

const SingleProduct = ({ item }: { item: CartProduct }) => {
  const dispatch = useDispatch<AppDispatch>()

  const addItemToCart = () => {
    dispatch(addToCart(item))
  }
  const removeItemFromCart = () => {
    dispatch(removeFromCart(item))
  }

  return (
    <div className="navbar-cart__cart--product" key={item.id}>
      <div className="navbar-cart__cart--product--image">
        <img
          src={item.image}
          alt={item.name}
          style={{
            width: '80px',
            height: '80px',
            objectFit: 'cover'
          }}
        />
      </div>

      <div className="navbar-cart__cart--product--buttons">
        <div className="navbar-cart__cart--product--buttons--plus-minus">
          <AddBoxIcon style={{ fontSize: '2rem', color: '#146D00' }} onClick={addItemToCart} />
          <p className="navbar-cart__cart--product--buttons--plus-minus--quantity">
            {item.quantity}
          </p>
          <IndeterminateCheckBoxIcon
            style={{ fontSize: '2rem', color: '#9D0000' }}
            onClick={removeItemFromCart}
          />
        </div>
        <div className="navbar-cart__cart--product--data">
          <p className="">{item.name}</p>
        </div>
        <p className="navbar-cart__cart--product--buttons--price">
          ${item.quantity ? (item?.quantity * item?.price).toFixed(2) : item?.price}
        </p>
      </div>
    </div>
  )
}

export default SingleProduct

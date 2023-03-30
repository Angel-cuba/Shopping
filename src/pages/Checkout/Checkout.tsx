import React from 'react'
import { useSelector } from 'react-redux'
import SingleProduct from '../../components/Cart/Product/SingleProduct'
import { RootState } from '../../redux/store'
import './Checkout.scss'

const Checkout = () => {
  const { itemInCart } = useSelector((state: RootState) => state.cart)

  return (
    <div className="checkout-view">
      <div className="checkout-view__cart">
        {itemInCart?.map((item) => (
          <SingleProduct item={item} key={item.id} />
        ))}
      </div>
      <div className="checkout-view__payment-method">payment method</div>
    </div>
  )
}

export default Checkout

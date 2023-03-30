import React from 'react'
import { useSelector } from 'react-redux'
import SingleProduct from '../../components/Cart/Product/SingleProduct'
import { Input } from '../../components/Input/Input'
import { RootState } from '../../redux/store'
import './Checkout.scss'

const Checkout = () => {
  const [cardNumber, setCardNumber] = React.useState<string>('')
  const { itemInCart } = useSelector((state: RootState) => state.cart)

  const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(e.target.value)
  }

  return (
    <div className="checkout-view">
      <div className="checkout-view__cart">
        {itemInCart?.map((item) => (
          <SingleProduct item={item} key={item.id} />
        ))}
      </div>
      <div className="checkout-view__payment-method">
        <h1 className="checkout-view__payment-method--label">Select a payment method</h1>
        <div className="checkout-view__payment-method__card-number">
          <Input
            name="Card number"
            placeholder="Write.."
            onChange={handleCardNumber}
            value={cardNumber}
          />
          <p>cvc</p>
          <input type="text" />
        </div>
        <div className="checkout-view__payment-method__cards">
          <div className="checkout-view__payment-method__cards--card">
            <img
              src="https://res.cloudinary.com/dqaerysgb/image/upload/v1680200432/shoes/descarga_1_uln1vl.png"
              alt="visa"
              style={{
                width: '60%',
                height: '40%',
                objectFit: 'cover'
              }}
            />
          </div>
          <div className="checkout-view__payment-method__cards--card">
            <img
              src="https://res.cloudinary.com/dqaerysgb/image/upload/v1680200437/shoes/images_9_1_klgpe6.png"
              alt="visa"
              style={{
                width: '70%',
                height: '40%',
                objectFit: 'cover'
              }}
            />
          </div>
          <div className="checkout-view__payment-method__cards--card">
            <img
              src="https://res.cloudinary.com/dqaerysgb/image/upload/v1680200452/shoes/images_10_hrrpnz.png"
              alt="visa"
              style={{
                width: '60%',
                height: '30%',
                objectFit: 'fill'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

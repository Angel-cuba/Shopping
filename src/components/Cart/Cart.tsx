import React from 'react'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

export const NavbarIcon = () => {
  const [openCart, setOpenCart] = React.useState(false)

  const emptyCart = 0
  const { itemInCart } = useSelector((state: RootState) => state.cart)
  console.log('🚀 ~ file: Cart.tsx:11 ~ NavbarIcon ~ cart:', itemInCart)

  const showCartItems = () => {
    setOpenCart(!openCart)
  }
  return (
    <div className="navbar-cart">
      <div className="navbar-cart__icon" onClick={showCartItems}>
        <AddShoppingCartIcon
          style={{
            fontSize: '2rem'
          }}
        />
      </div>
      <div className="navbar-cart__amount">{!itemInCart ? emptyCart : itemInCart.length}</div>
      <div className={openCart ? 'navbar-cart__cart' : 'navbar-cart__cart--show'}></div>
    </div>
  )
}

export const CartIcon = ({ itemAddedToCart }: { itemAddedToCart: boolean }) => {
  return (
    <div className="icon">
      <div className="icon__cart">
        <div className="icon__cart--icon">
          {itemAddedToCart ? (
            <FavoriteIcon
              style={{
                color: 'red'
              }}
            />
          ) : (
            <FavoriteBorderIcon />
          )}
        </div>
      </div>
    </div>
  )
}

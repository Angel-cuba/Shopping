import React from 'react'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart'

export const NavbarIcon = () => {
  const [itemsInCart, setItemsInCart] = React.useState(0)
  return (
    <div className="navbar-cart">
      <div className="navbar-cart__icon">
        <AddShoppingCartIcon
          style={{
            fontSize: '2rem'
          }}
        />
      </div>
      <div className="navbar-cart__amount">{itemsInCart}</div>
    </div>
  )
}

export const CartIcon = ({ itemAddedToCart }: { itemAddedToCart: boolean }) => {
  return (
    <div className="icon">
      <div className="icon__cart">
        <div className="icon__cart--icon">
          {itemAddedToCart ? (
            <RemoveShoppingCartIcon
              style={{
                color: 'red'
              }}
            />
          ) : (
            <AddShoppingCartIcon />
          )}
        </div>
      </div>
    </div>
  )
}

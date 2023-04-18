import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Favorite, ProductionQuantityLimits, ShoppingCart } from '@mui/icons-material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import SingleProduct from './Product/SingleProduct';
import { ProductInWishList } from './Wishes/ProductInWishList';
import { Product } from '../../interfaces/products/ProductType';
import { addToWishList, removeFromWishList } from '../../redux/actions/WishesActions';

export const NavbarIcon = () => {
  const [openCart, setOpenCart] = React.useState(false);
  const location = useLocation();

  const emptyCart = 0;
  const { itemInCart } = useSelector((state: RootState) => state.cart);

  const showCartItems = () => {
    setOpenCart(!openCart);
  };
  const closeCart = () => {
    setOpenCart(false);
  };

  const toPay = () => {
    let total = 0;
    itemInCart?.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total.toFixed(2);
  };

  return (
    <div className="navbar-cart">
      <div className={openCart ? 'navbar-cart__total' : 'navbar-cart__total--hidden'}>
        <p className="navbar-cart__total--text">Total to pay:</p>
        <p className="navbar-cart__total--price">$ {toPay()}</p>
        {location.pathname !== '/checkout' && (
          <Link to="/checkout" className="navbar-cart__total--link" onClick={closeCart}>
            <AccountBalanceIcon style={{ fontSize: '2rem' }} />
          </Link>
        )}
      </div>
      <div className="navbar-cart__icon" onClick={showCartItems}>
        {itemInCart?.length ? (
          <ShoppingCart
            style={{
              fontSize: '2rem',
              color: '#5a5a5a',
            }}
          />
        ) : (
          <ProductionQuantityLimits style={{ fontSize: '2rem', color: '#323232' }} />
        )}
      </div>
      <div
        className={
          !itemInCart
            ? 'navbar-cart__amount'
            : itemInCart && itemInCart?.length > 9
            ? 'navbar-cart__amount--over'
            : 'navbar-cart__amount'
        }
      >
        {!itemInCart ? emptyCart : itemInCart.length}
      </div>
      <div className={openCart ? 'navbar-cart__cart' : 'navbar-cart__cart--hidden'}>
        {itemInCart?.map((item) => (
          <SingleProduct item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

type CartIconProps = {
  product: Product;
  handleLike: () => void;
  handleTrash: () => void;
};

export const CartIcon = ({ product, handleLike, handleTrash }: CartIconProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { itemInWishlist } = useSelector((state: RootState) => state.wishes);
  const addItemToCart = () => {
    dispatch(addToWishList(product));
    handleLike();
  };
  const removeItemFromCart = () => {
    dispatch(removeFromWishList(product));
    handleTrash();
  };

  const itemAddedToCart = itemInWishlist?.find((item) => item.id === product.id);

  return (
    <div className="products__content__item--add--icon__view">
      {itemAddedToCart ? (
        <FavoriteIcon
          style={{
            fontSize: '2.1rem',
            color: 'red',
          }}
          onClick={removeItemFromCart}
        />
      ) : (
        <FavoriteBorderIcon
          style={{
            fontSize: '2.1rem',
          }}
          onClick={addItemToCart}
        />
      )}
    </div>
  );
};

export const WishListIcon = () => {
  const [openWishList, setOpenWishList] = React.useState(false);
  const { itemInWishlist } = useSelector((state: RootState) => state.wishes);

  const showWishList = () => {
    setOpenWishList(!openWishList);
  };
  return (
    <div className="navbar-wishes">
      {!itemInWishlist?.length ? (
        <FavoriteBorderIcon
          style={{ fontSize: '2.1rem', color: '#323232' }}
          onClick={showWishList}
        />
      ) : (
        <Favorite style={{ fontSize: '2.1rem', color: '#5a5a5a' }} onClick={showWishList} />
      )}
      <div className="navbar-wishes__amount">{!itemInWishlist ? 0 : itemInWishlist.length}</div>
      <div className={openWishList ? 'navbar-wishes__cart' : 'navbar-wishes__cart--hidden'}>
        {itemInWishlist?.length ? (
          <ProductInWishList setOpenWishList={setOpenWishList} />
        ) : (
          <div className="navbar-wishes__cart__empty-wishlist">
            <p className="navbar-wishes__cart__empty-wishlist__text">Your wishlist is empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '../../../redux/store';
import { addToCart, removeFromCart } from '../../../redux/actions/CartActions';
import { CartProduct } from '../../../interfaces/cart/CartType';
import { Link } from 'react-router-dom';
import './SingleProduct.scss';


type SingleProductProps = {
  item: CartProduct;
  notEnoughStock?: string[];
};

type Item = {
  id: string;
};
const SingleProduct = ({ item, notEnoughStock }: SingleProductProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const addItemToCart = () => {
    dispatch(addToCart(item));
  };
  const removeItemFromCart = () => {
    dispatch(removeFromCart(item));
  };

  const handleExistingStock = (notEnoughStock: string[] | undefined, item: Item): boolean => {
  if (notEnoughStock && notEnoughStock.includes(item.id)) {
    return true;
  }
  return false;
};

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
              objectFit: 'cover',
            }}
          />
        </Link>
      </div>
        {
          handleExistingStock(notEnoughStock, item) && <p className="cart-product__stock">Not enough stock</p>
        }
      <div className="cart-product__buttons">
        <div className="cart-product__buttons__plus-minus">
          <AddBoxIcon style={{ fontSize: '2rem'}} onClick={addItemToCart}className="cart-product__buttons__plus-minus--add" />
          <p className="cart-product__buttons__plus-minus--quantity">{item.quantity}</p>
          <IndeterminateCheckBoxIcon
            style={{ fontSize: '2rem'}}
            onClick={removeItemFromCart}
            className="cart-product__buttons__plus-minus--remove"
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
              top: '-20px',
              left: '0px',
              borderTopLeftRadius: '10px',
              borderBottomRightRadius: '10px',
              boxShadow:`0px 0px 3px 0px ${item.variant}`
            }}
          />
        </div>
        <p className="cart-product__buttons--price-by-quantity">
          $ {item.quantity ? (item?.quantity * item?.price).toFixed(2) : item?.price}
        </p>
       {
          item.quantity && item?.quantity > 1 && <p className="cart-product__buttons--price">$ {item.price}</p>
       }
      </div>
    </div>
  );
};

export default SingleProduct;

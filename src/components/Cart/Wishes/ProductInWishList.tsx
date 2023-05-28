import React from 'react';
import { AddShoppingCart } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';

import { Product } from '../../../interfaces/products/ProductType';
import { AppDispatch, RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { removingFromWishList } from '../../../redux/actions/WishesActions';
import { GlobalTheme } from '../../../context/ThemeProvider';
import { darkTheme, lightTheme } from '../../../styles/styles';
import './ProductInWishList.scss';

type Props = {
  setOpenWishList: (open: boolean) => void;
};
export const ProductInWishList = ({ setOpenWishList }: Props) => {
  const { itemInWishlist } = useSelector((state: RootState) => state.wishes);
  const { products } = useSelector((state: RootState) => state.products);
  const { userFromToken } = useSelector((state: RootState) => state.userLogged);
  const { theme } = GlobalTheme();

  const productsInWishlist = products?.filter((product: Product) => {
    return itemInWishlist?.some((itemId: string) => itemId === product.id);
  });

  const dispatch = useDispatch<AppDispatch>();

  const firstItem = productsInWishlist?.[0];
  const [openInformation, setOpenInformation] = React.useState<Product>(firstItem);

  const closeWishList = () => {
    setOpenWishList(false);
  };

  const removeFromList = (productId: string) => {
    dispatch(removingFromWishList(productId, userFromToken.user_id));
  };

  return (
    <>
      {itemInWishlist?.length ? (
        <div
          className="view"
          onMouseLeave={closeWishList}
          style={{
            backgroundColor: theme === 'dark' ? darkTheme.bg : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
            boxShadow: `0 0 10px ${
              theme === 'dark' ? darkTheme.shadowMedium : lightTheme.shadowMedium
            }`,
          }}
        >
          <div className="view__products">
            {productsInWishlist?.map((item: Product) => (
              <div
                key={item.id}
                onMouseEnter={() => setOpenInformation(item)}
                className="view__products__item"
              >
                <div className="view__products__item--image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="view__products__item--buttons">
                  <Link to={`/product/${item.id}`} onClick={closeWishList}>
                    <button className="view__products__item--buttons__buy">
                      <AddShoppingCart />
                    </button>
                  </Link>
                  <button
                    className="view__products__item--buttons__remove"
                    onClick={() => removeFromList(item.id)}
                  >
                    Remove
                    <HeartBrokenIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="view__content">
            <h1>Information</h1>
            {openInformation && (
              <div className="view__content__information">
                <p className="view__content__information--description">
                  {openInformation.description}
                </p>
                <div className="view__content__information__small-info">
                  <p className="view__content__information__small-info--name">
                    {openInformation.name}
                  </p>
                  <p className="view__content__information__small-info--categories">
                    {openInformation.categories}
                  </p>
                  <p className="view__content__information__small-info--price">
                    {openInformation.price}
                  </p>
                </div>
                <div className="view__content__information__small-info--variants">
                  {openInformation?.variants?.map((variantValue) => {
                    return (
                      <span
                        key={variantValue}
                        className="view__content__information__small-info--variants__item"
                      >
                        {variantValue}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="view-empty" onMouseOver={closeWishList}>
          <h3>
            Your wishlist is empty. <br /> Add some products to your wishlist.
          </h3>
        </div>
      )}
    </>
  );
};

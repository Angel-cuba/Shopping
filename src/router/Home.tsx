import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/actions/ProductActions';
import { AppDispatch, RootState } from '../redux/store';
import Products from '../pages/Products/Products';
import { logged } from '../redux/actions/UserAction';
import { getWishList } from '../redux/actions/WishesActions';
import { decodedUser } from '../interfaces/user/UserType';

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state);
  const user = localStorage.getItem('decodedUser')

  useEffect(() => {
    dispatch(fetchProducts());
    if(user) {
      const { user_id } = JSON.parse(user) as decodedUser;
      dispatch(logged(JSON.parse(user)))
      dispatch(getWishList(user_id));
    }
  }, [dispatch, user]);

  return <Products {...products} />;
};

export default Home;

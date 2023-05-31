import React, { useEffect, useLayoutEffect } from 'react';

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
  const user = localStorage.getItem('decodedUser');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, user]);

//TODO: Cambiar estos fetch aqui, pasarlo a cada uno de sus componentes.......
  useLayoutEffect(() => {
    if (user) {
      dispatch(logged(JSON.parse(user)));
      const { user_id } = JSON.parse(user) as decodedUser;
      dispatch(getWishList(user_id));
    }
  }, [dispatch, user]);

  return <Products {...products} />;
};

export default Home;

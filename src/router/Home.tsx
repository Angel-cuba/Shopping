import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/actions/ProductActions';
import { AppDispatch, RootState } from '../redux/store';
import Products from '../pages/Products/Products';
import { logged } from '../redux/actions/UserAction';

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state);
  const user = localStorage.getItem('decodedUser')

  useEffect(() => {
    dispatch(fetchProducts());
    if(user) {
      dispatch(logged(JSON.parse(user)))
    }
  }, [dispatch, user]);

  return <Products {...products} />;
};

export default Home;

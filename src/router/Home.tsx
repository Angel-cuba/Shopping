import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/actions/ProductActions';
import { AppDispatch, RootState } from '../redux/store';
import Products from '../pages/Products/Products';

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state);
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return <Products {...products} />;
};

export default Home;

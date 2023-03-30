import React, { useEffect } from 'react'

import Products from '../Pages/Products/Products'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../redux/actions/ProductActions'
import { AppDispatch, RootState } from '../redux/store'

const Home = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { products } = useSelector((state: RootState) => state)
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  return (
    <div>
      <Products {...products} />
    </div>
  )
}

export default Home

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Products from '../pages/Products/Products'
import { fetchProducts } from '../redux/actions/ProductActions'
import { AppDispatch, RootState } from '../redux/store'

const Home = () => {
  const dispatch = useDispatch<AppDispatch>()
  const items = useSelector((state: RootState) => state.items)
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  return (
    <div>
      <Products productsData={items.products} />
    </div>
  )
}

export default Home

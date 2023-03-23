import React from 'react'
import { Product } from '../../interfaces/ProductType'

const ProductItem = ({ product }: { product: Product }) => {
  console.log('🚀 ~ file: Product.tsx:5 ~ ProductItem ~ product:', product)
  return (
    <div key={product.id}>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  )
}

export default ProductItem

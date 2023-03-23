import React from 'react'
import { Input } from '../../components/Input/Input'
import ProductItem from '../../components/Product/Product'
import { Product } from '../../interfaces/ProductType'
import './Products.scss'

const Products = ({ productsData }: { productsData: Product[] }) => {
  const [size, setSize] = React.useState('')
  const [variant, setVariant] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [openFilters, setOpenFilters] = React.useState(false)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(event.target.value)
  }
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value)
  }
  const handleVariantChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVariant(event.target.value)
  }
  const filterByVariant = () => {
    const filtered = productsData.filter((product: Product) => {
      return product.variant.toLocaleLowerCase().includes(variant.toLowerCase())
      // ||
      // product.categories.toLocaleLowerCase().includes(category.toLowerCase())
    })
    return filtered
  }
  const filterByCategory = () => {
    const filtered = productsData.filter((product: Product) => {
      return product.categories.toLocaleLowerCase().includes(category.toLowerCase())
    })
    return filtered
  }
  const filterBySizes = () => {
    const filtered = productsData.filter((product: Product) => {
      return product.sizes.toLocaleLowerCase().includes(size.toLowerCase())
    })
    return filtered
  }
  const filters = [filterByVariant(), filterByCategory(), filterBySizes()]

  const handleOpenFilters = () => {
    setOpenFilters(!openFilters)
  }

  return (
    <div className="products">
      <div className="products__controlPanel" onClick={handleOpenFilters}>
        Filters
      </div>
      <div className={openFilters ? 'products__panel' : 'products__panel--hidden'}>
        <Input
          name="Size"
          value={size}
          placeholder=""
          type="text"
          onChange={handleChange}
          style={styles}
        />
        <Input
          name="Category"
          value={category}
          placeholder=""
          type="text"
          onChange={handleCategoryChange}
          style={styles}
        />
        <Input
          name="Variant"
          value={variant}
          placeholder=""
          type="text"
          onChange={handleVariantChange}
          style={styles}
        />
      </div>

      {filters.map((filter) => {
        return filter.map((product: Product) => {
          return <ProductItem key={product.id} product={product} />
        })
      })}
    </div>
  )
}

export default Products

const styles = {
  width: '100px',
  height: '40px',
  fontSize: '18px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  padding: '5px'
}

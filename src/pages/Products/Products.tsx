import React from 'react'
import { Input } from '../../components/Input/Input'
import ProductItem from '../../components/Product/Product'
import { Product } from '../../interfaces/products/ProductType'
import './Products.scss'

const Products = ({ products }: { products: Product[] }) => {
  const [size, setSize] = React.useState('')
  const [variant, setVariant] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [singleFilter, setSingleFilter] = React.useState('')
  const [openFilters, setOpenFilters] = React.useState(false)

  const handleChangeSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(event.target.value)
  }
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value)
  }
  const handleVariantChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVariant(event.target.value)
  }
  const handleChangeSingleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSingleFilter(event.target.value)
  }
  const filterByVariant = () => {
    const filtered = products.filter((product: Product) => {
      return product.variant.toLocaleLowerCase().includes(variant.toLowerCase())
    })
    return filtered
  }
  const filterByCategory = () => {
    const filtered = products.filter((product: Product) => {
      return product.categories.toLocaleLowerCase().includes(category.toLowerCase())
    })
    return filtered
  }
  const filterBySizes = () => {
    const filtered = products.filter((product: Product) => {
      return product.sizes.toLocaleLowerCase().includes(size.toLowerCase())
    })
    return filtered
  }
  const filterByName = () => {
    const filtered = products.filter((product: Product) => {
      return product.name.toLocaleLowerCase().includes(singleFilter.toLowerCase())
    })
    return filtered
  }

  const handleOpenFilters = () => {
    setOpenFilters(!openFilters)
  }

  const filterByAll = () => {
    const filtered = products.filter((product: Product) => {
      return (
        product.sizes.toLocaleLowerCase().includes(size.toLowerCase()) ||
        product.categories.toLocaleLowerCase().includes(category.toLowerCase()) ||
        product.variant.toLocaleLowerCase().includes(variant.toLowerCase())
      )
    })
    return filtered
  }

  const showAllFitered = () => {
    if (size && category && variant) {
      return filterByAll().map((product: Product) => {
        return <ProductItem key={product.id} product={product} />
      })
    } else if (size && category) {
      return filterBySizes().map((product: Product) => {
        return <ProductItem key={product.id} product={product} />
      })
    } else if (size && variant) {
      return filterBySizes().map((product: Product) => {
        return <ProductItem key={product.id} product={product} />
      })
    } else if (category && variant) {
      return filterByCategory().map((product: Product) => {
        return <ProductItem key={product.id} product={product} />
      })
    } else if (size) {
      return filterBySizes().map((product: Product) => {
        return <ProductItem key={product.id} product={product} />
      })
    } else if (category) {
      return filterByCategory().map((product: Product) => {
        return <ProductItem key={product.id} product={product} />
      })
    } else if (variant) {
      return filterByVariant().map((product: Product) => {
        return <ProductItem key={product.id} product={product} />
      })
    }
  }
  const filtersToDefaultValue = () => {
    setSize('')
    setCategory('')
    setVariant('')
  }
  return (
    <div className="products">
      <div className="products__controlPanel" onClick={handleOpenFilters}>
        {openFilters ? <p onClick={filtersToDefaultValue}>Hide filters</p> : 'Show filters'}
      </div>
      <div className="products__panel">
        <div className={openFilters ? 'products__panel--visible' : 'products__panel--hidden'}>
          <Input
            name="Size"
            value={size}
            placeholder=""
            type="text"
            onChange={handleChangeSize}
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
        <div className={!openFilters ? 'products__panel--single' : 'products__panel--hidden'}>
          <Input
            name="Search by name"
            value={singleFilter}
            placeholder=""
            type="text"
            onChange={handleChangeSingleFilter}
            style={styles}
          />
        </div>
      </div>
      <div className="products__content">
        {!singleFilter && !size && !category && !variant
          ? products.map((product: Product) => {
              return <ProductItem key={product.id} product={product} />
            })
          : null}
        {singleFilter.length > 0
          ? filterByName().map((product: Product) => {
              return <ProductItem key={product.id} product={product} />
            })
          : null}
        {showAllFitered()}
      </div>
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

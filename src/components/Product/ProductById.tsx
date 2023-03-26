import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import StarsIcon from '@mui/icons-material/Stars'
import { RootState } from '../../redux/store'
import { Product, Sizes, Variants, VariantsColors } from '../../interfaces/products/ProductType'
import ProductItem from './Product'
import RecommendedProducts from './RecommendedProducts'
import './ProductById.scss'

const ProductById = () => {
  const params = useParams()
  const { id } = params
  const { products } = useSelector((state: RootState) => state.products)
  const product = products.find((product: Product) => {
    return product.id.toString() === id
  })
  const [recommended, setRecommended] = React.useState<Product[]>([])
  const [size, setSize] = React.useState<string>('')
  const [variant, setVariant] = React.useState<string>(product?.variant)
  const [openSizesBox, setOpenSizesBox] = React.useState<boolean>(false)
  const [openVariantsBox, setOpenVariantsBox] = React.useState<boolean>(false)

  React.useEffect(() => {
    setRecommended(recommendedProducts)
  }, [])

  const recommendedProducts = products.filter(
    (p: Product) => p.variant === product?.variant && p.id !== product?.id
  )

  const SizeBlocks = Sizes.map((item) => (
    <div
      key={item}
      style={{
        backgroundColor: item === size ? '#5D8A68' : '#f0f0f0',
        borderRadius: '5px',
        marginRight: '10px',
        boxShadow: '0 0 5px 0 lightgray',
        border: '1px solid #F7F7F7',
        textAlign: 'center',
        cursor: 'pointer',
        padding: '5px 10px'
      }}
      onClick={() => setSize(item)}>
      {item}
    </div>
  ))

  const VariantBlocks = Variants.map((item) => (
    <div
      key={item}
      style={{
        backgroundColor: `${VariantsColors[item]}`,
        borderRadius: '5px',
        marginRight: '10px',
        marginBottom: '4px',
        boxShadow: '0 0 5px 0 lightgray',
        textAlign: 'center',
        cursor: 'pointer',
        width: '40px',
        height: '40px'
      }}
      onClick={() => setVariant(item)}>
      {variant === item && (
        <StarsIcon
          style={{
            color: 'white',
            fontSize: '30px',
            marginTop: '5px',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            borderRadius: '50%'
          }}
        />
      )}
    </div>
  ))

  const openSizes = () => {
    setOpenSizesBox(!openSizesBox)
  }

  const openVariants = () => {
    setOpenVariantsBox(!openVariantsBox)
  }

  return (
    <div className="productId">
      {product && (
        <div className="productId__item">
          <ProductItem product={product} />
          <div className="productId__item__info">
            <h3 className="productId__item__info__name">{product.name}</h3>
            <p className="productId__item__info__description">{product.description}</p>
            <div className="productId__item__info__small-details">
              <div className="productId__item__info__small-details--size">
                {product.sizes && (
                  <>
                    <span
                      style={{
                        backgroundColor: 'lightgray',
                        width: '40px',
                        borderRadius: '5px',
                        display: 'inline-block',
                        marginRight: '10px',
                        boxShadow: '0 0 5px 0 lightgray',
                        border: '1px solid #F7F7F7',
                        padding: '3px 5px',
                        textAlign: 'center'
                      }}>
                      {size ? size : product.sizes}
                    </span>
                    {openSizesBox ? (
                      <ArrowDropUpIcon onClick={openSizes} />
                    ) : (
                      <ArrowDropDownIcon onClick={openSizes} />
                    )}
                  </>
                )}
                {openSizesBox && (
                  <div className="productId__item__info__small-details--blocks">{SizeBlocks}</div>
                )}
              </div>
              <p className="productId__item__info__small-details--categories">
                {product.categories}
              </p>
              <div className="productId__item__info__small-details--variant">
                {variant && (
                  <span
                    style={{
                      backgroundColor: variant ? `${VariantsColors[variant]}` : product.variant,
                      width: '40px',
                      height: '30px',
                      borderRadius: '5px',
                      display: 'inline-block',
                      boxShadow: `0 0 5px 0 ${VariantsColors[variant]}`,
                      border: '1px solid #F7F7F7'
                    }}
                    className="productId__item__info__small-details--variant--color">
                    {/* {variant} */}
                  </span>
                )}
                {product.variant && (
                  <>
                    {openVariantsBox ? (
                      <ArrowDropUpIcon onClick={openVariants} />
                    ) : (
                      <ArrowDropDownIcon onClick={openVariants} />
                    )}

                    {openVariantsBox && (
                      <div className="productId__item__info__small-details--variant--blocks">
                        {VariantBlocks}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="productId__recommended">
        <h3>Recommended</h3>
        <div className="productId__recommended__items">
          {recommended.map((product) => (
            <RecommendedProducts key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductById

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import StarsIcon from '@mui/icons-material/Stars';

import { AppDispatch, RootState } from '../../redux/store';
import {
  NewProduct,
  Product,
  Sizes,
  Variants,
  VariantsColors,
} from '../../interfaces/products/ProductType';
import ProductItem from './ProductItem';
import RecommendedProducts from './RecommendedProducts';
import { addToCart } from '../../redux/actions/CartActions';
import './ProductById.scss';

const ProductById = () => {
  const params = useParams();
  const { id } = params;
  const { products } = useSelector((state: RootState) => state);

  const product = products.products.find((product: Product) => {
    return product.id.toString() === id;
  });
  const recommendedProducts = products.products.filter(
    (p: Product) => p.variant === product?.variant && p.id !== product?.id
  );

  const [size, setSize] = React.useState<string>(product?.sizes);
  const [variant, setVariant] = React.useState<string>(product?.variant);
  const [openSizesBox, setOpenSizesBox] = React.useState<boolean>(false);
  const [openVariantsBox, setOpenVariantsBox] = React.useState<boolean>(false);
  const [newProduct, setNewProduct] = React.useState<NewProduct>();

  const dispatch = useDispatch<AppDispatch>();

  const SizeBlocks = Sizes.map((item) => (
    <div
      key={item}
      style={{
        backgroundColor: item === size ? '#5D8A68' : '#F7F7F7',
        color: item === size ? '#f0f0f0' : 'black',
        borderRadius: '5px',
        margin: '10px',
        boxShadow: '0 0 5px 0 lightgray',
        border: item === size ? '1px solid #f0f0f0' : '',
        textAlign: 'center',
        cursor: 'pointer',
        minWidth: '50px',
        height: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={() => setSize(item)}
    >
      {item}
    </div>
  ));

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
        height: '40px',
      }}
      onClick={() => setVariant(item)}
    >
      {variant === item && (
        <StarsIcon
          style={{
            color: 'white',
            fontSize: '30px',
            marginTop: '5px',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            borderRadius: '50%',
          }}
        />
      )}
    </div>
  ));

  const openSizes = () => {
    setOpenSizesBox(!openSizesBox);
  };

  const openVariants = () => {
    setOpenVariantsBox(!openVariantsBox);
  };

  const setNewProductHandler = () => {
    setNewProduct({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      sizes: size,
      variant: variant,
      categories: product.categories,
      image: product.image,
    });
    if (openSizesBox) {
      setOpenSizesBox(false);
    }
    if (openVariantsBox) {
      setOpenVariantsBox(false);
    }
  };
  const newProductHandler = () => {
    if (newProduct) {
      dispatch(addToCart(newProduct));
      newProductCancelHandler();
    }
  };
  const newProductCancelHandler = () => {
    setNewProduct(undefined);
    setSize(product.sizes);
    setVariant(product.variant);
  };

  return (
    <div className="productId">
      {size !== product?.sizes || variant !== product?.variant ? (
        <div
          className="productId__set-product"
          onClick={setNewProductHandler}
          style={{
            backgroundColor: '#5D8A68',
          }}
        >
          <h3>Check what you have choosen</h3>
        </div>
      ) : (
        <p className="productId__change-product-notice">
          Choose size
          <br /> or <br /> pick a colour
        </p>
      )}
      {newProduct && (
        <div className="productId__new-product">
          <div className="productId__new-product__info">
            <div className="productId__new-product__info__image">
              <img
                src={newProduct.image}
                alt=""
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                }}
              />
            </div>
            <div className="productId__new-product__info__content">
              <p>{newProduct.name}</p>
              <p>{newProduct.description}</p>
              <p>{newProduct.price}</p>
              <p>{newProduct.sizes}</p>
              <p>{newProduct.variant}</p>
              <p>{newProduct.categories}</p>
            </div>
          </div>
          <div className="productId__new-product__buttons">
            <div
              className="productId__new-product__buttons--send"
              style={{
                backgroundColor: 'green',
                padding: '10px',
                borderRadius: '5px',
                width: '100px',
              }}
              onClick={newProductHandler}
            >
              Send
            </div>
            <div
              className="productId__new-product__buttons--cancel"
              style={{
                backgroundColor: 'red',
                padding: '10px',
                borderRadius: '5px',
                width: '100px',
              }}
              onClick={newProductCancelHandler}
            >
              Cancel
            </div>
          </div>
        </div>
      )}
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
                        textAlign: 'center',
                      }}
                    >
                      {size}
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
                      border: '1px solid #F7F7F7',
                    }}
                    className="productId__item__info__small-details--variant--color"
                  ></span>
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
        <h3 className="productId__recommended--text">You might also like...</h3>
        <div className="productId__recommended__items">
          {recommendedProducts.map((product: Product) => (
            <RecommendedProducts key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductById;

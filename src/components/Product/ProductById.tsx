import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import StarsIcon from '@mui/icons-material/Stars';

import { AppDispatch, RootState } from '../../redux/store';
import { Product, Sizes, Variants, VariantsColors } from '../../interfaces/products/ProductType';
import ProductItem from './ProductItem';
import RecommendedProducts from './RecommendedProducts';
import { addToCart } from '../../redux/actions/CartActions';
import './ProductById.scss';
import { CartProduct } from '../../interfaces/cart/CartType';

const initialProduct: CartProduct = {
  id: 0,
  name: '',
  price: 0,
  description: '',
  image: '',
  categories: '',
  sizes: '',
  variant: '',
};

const ProductById = () => {
  const params = useParams();
  const { id } = params;
  const { products } = useSelector((state: RootState) => state.products);

  const product = products.find((product: Product) => {
    return product.id.toString() === id;
  });

  React.useEffect(() => {
    if (product) {
      setVariant(product.variant);
    }
  }, [id, product]);

  const recommendedProducts = products.filter(
    (p: Product) => p.variant === product?.variant && p.id !== product?.id
  );

  const [size, setSize] = React.useState<string>();
  const [variant, setVariant] = React.useState<string>();
  const [openSizesBox, setOpenSizesBox] = React.useState<boolean>(false);
  const [openVariantsBox, setOpenVariantsBox] = React.useState<boolean>(false);
  const [newProduct, setNewProduct] = React.useState<CartProduct>(initialProduct);
  const [openSelection, setOpenSelection] = React.useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  const productSizes = product?.sizes;

  const SizeBlocks = Sizes.map((item: string) => (
    <button
      key={item}
      style={{
        backgroundColor: productSizes?.includes(item) ? '#5D8A68' : '#c2c2c28f',
        color: productSizes?.includes(item) ? '#f0f0f0' : 'black',
        borderRadius: '5px',
        margin: '10px',
        boxShadow: '0 0 5px 0 lightgray',
        border: productSizes?.includes(item) ? '1px solid #f0f0f0' : '',
        textAlign: 'center',
        cursor: 'pointer',
        minWidth: '50px',
        height: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        outline: 'none',
      }}
      onClick={() => setSize(item)}
      disabled={!productSizes?.includes(item)}
    >
      {item}
    </button>
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
    const productToCart = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      sizes: size,
      variant: variant,
      categories: product.categories,
      image: product.image,
    };
    if (openSizesBox) {
      setOpenSizesBox(false);
    }
    if (openVariantsBox) {
      setOpenVariantsBox(false);
    }
    if (size) {
      setNewProduct(productToCart);
    }
    setOpenSelection(true);
  };
  const newProductHandler = () => {
    dispatch(addToCart(newProduct));
    newProductCancelHandler();
  };
  const newProductCancelHandler = () => {
    setNewProduct(initialProduct);
    setSize('');
    setOpenSelection(false);
  };

  return (
    <div className="productId">
      {size ? (
        <div
          className="productId__set-product"
          onClick={setNewProductHandler}
          style={{
            backgroundColor: '#5D8A68',
          }}
        >
          <h3>Add to cart</h3>
        </div>
      ) : (
        <p className="productId__change-product-notice">
          Choose size
          <br /> or <br /> pick a colour
        </p>
      )}
      {openSelection && (
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
                        width: size ? '30px' : 'auto',
                        borderRadius: '5px',
                        display: 'inline-block',
                        marginRight: size ? '10px' : '0',
                        boxShadow: !size ? '0 0 5px 0 lightgray' : 'none',
                        padding: size ? '3px 5px' : '0',
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

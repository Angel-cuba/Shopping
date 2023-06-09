import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import StarsIcon from '@mui/icons-material/Stars';

import { AppDispatch, RootState } from '../../redux/store';
import { Product, Sizes, VariantsColors } from '../../interfaces/products/ProductType';
import ProductItem from './ProductItem';
import RecommendedProducts from './RecommendedProducts';
import { addToCart } from '../../redux/actions/CartActions';
import { CartProduct } from '../../interfaces/cart/CartType';
import { GlobalTheme } from '../../context/ThemeProvider';
import { darkTheme, lightTheme } from '../../styles/styles';
import { apiWithoutAuth } from '../../utils/api';
import LoadingProductById from '../Loading/LoadingProductById';
import './ProductById.scss';

const initialProduct: CartProduct = {
  id: '',
  name: '',
  price: 0,
  description: '',
  image: '',
  categories: '',
  sizes: '',
  variant: '',
  quantity: 1,
  stock: 1,
};
const ProductById = () => {
  const params = useParams();
  const { id } = params;
  const { products } = useSelector((state: RootState) => state.products);
  const { theme } = GlobalTheme();
  const token = localStorage.getItem('token');
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const productById = async () => {
      const response = await apiWithoutAuth.get(`/products/${id}`);
      if (response.status === 200) {
        setProduct(response.data);
      }
    };
    productById();
    setLoading(false);
  }, [id, token]);

  const recommendedProducts = products.filter((p: Product) => {
    return (
      product?.variants.map((variant: string) => variant).includes(p.variants[0]) &&
      p.id !== product.id
    );
  });

  const [size, setSize] = React.useState<string>();
  const [variant, setVariant] = React.useState<string>();
  const [openSizesBox, setOpenSizesBox] = React.useState<boolean>(false);
  const [openVariantsBox, setOpenVariantsBox] = React.useState<boolean>(false);
  const [newProduct, setNewProduct] = React.useState<CartProduct>(initialProduct);
  const [openSelection, setOpenSelection] = React.useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  const productSizes = product?.sizes;
  const productVariants = product?.variants;

  const SizeBlocks = Sizes.map((item) => (
    <button
      key={item}
      style={{
        backgroundColor: productSizes?.find((size) => size === item) ? '#5D8A68' : '#c2c2c28f',
        color: productSizes?.find((size) => size === item) ? 'white' : '#343434',
        borderRadius: '5px',
        margin: '10px',
        boxShadow: '0 0 5px 0 lightgray',
        border: productSizes?.find((size) => size === item) ? '1px solid #949494' : '#343434',
        textAlign: 'center',
        cursor: 'pointer',
        minWidth: '50px',
        height: '40px',
        fontWeight: productSizes?.find((size) => size === item) ? '900' : '600',
        fontSize: productSizes?.find((size) => size === item) ? '18px' : '16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        outline: 'none',
      }}
      onClick={() => chosenSize(item)}
      disabled={!productSizes?.find((size) => size === item)}
    >
      {item}
    </button>
  ));
  const chosenSize = (item: string) => {
    setSize(item);
    setOpenSizesBox(!openSizesBox);
  };

  const VariantBlocks = productVariants?.map((item: string) => (
    <div
      key={item}
      style={{
        backgroundColor: VariantsColors[item],
        borderRadius: '5px',
        marginRight: '10px',
        marginBottom: '4px',
        textAlign: 'center',
        cursor: 'pointer',
        width: '40px',
        height: '40px',
        boxShadow: `0 0 2px 0 ${VariantsColors[item]}`,
      }}
      onClick={() => setVariant(item)}
    >
      {variant === item && <StarsIcon style={{ color: 'white' }} />}
    </div>
  ));

  const openSizes = () => {
    setOpenSizesBox(!openSizesBox);
  };

  const openVariants = () => {
    setOpenVariantsBox(!openVariantsBox);
  };

  const setNewProductHandler = () => {
    if (openSizesBox) {
      setOpenSizesBox(false);
    }
    if (openVariantsBox) {
      setOpenVariantsBox(false);
    }
    if (product && size) {
      const productToCart = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        sizes: size,
        variant: variant,
        categories: product.categories,
        image: product.image,
        quantity: 1,
        stock: product.inStock,
      };
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
    setVariant('');
    setOpenSelection(false);
  };

  if (loading) {
    return <LoadingProductById />;
  }

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
                  width: '300px',
                  height: '300px',
                  objectFit: 'cover',
                }}
              />
            </div>
            <div className="productId__new-product__info__content">
              <p>{newProduct.name}</p>
              <p
                style={{
                  fontSize: '14px',
                  color: 'gray',
                  width: '500px',
                }}
              >
                {newProduct.description}
              </p>
              <p>{newProduct.price}</p>
              <p>{newProduct.sizes}</p>
              <p>{newProduct.variant}</p>
              <p>{newProduct.categories}</p>
            </div>
          </div>
          <div className="productId__new-product__buttons">
            <div className="productId__new-product__buttons--send" onClick={newProductHandler}>
              Send
            </div>
            <div
              className="productId__new-product__buttons--cancel"
              onClick={newProductCancelHandler}
            >
              Cancel
            </div>
          </div>
        </div>
      )}
      {!product ? (
        <LoadingProductById />
      ) : (
        <div
          className="productId__item"
          style={{
            color: theme === 'light' ? darkTheme.bg : lightTheme.bg,
          }}
        >
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
                        fontSize: '18px',
                        fontWeight: '800',
                        color: size ? darkTheme.bg : '',
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
                  <div
                    className="productId__item__info__small-details--blocks"
                    style={{
                      backgroundColor: theme === 'dark' ? lightTheme.primary : darkTheme.secondary,
                    }}
                  >
                    {SizeBlocks}
                  </div>
                )}
              </div>
              <p className="productId__item__info__small-details--categories">
                {product.categories}
              </p>
              <div className="productId__item__info__small-details--variant">
                {variant && (
                  <span
                    style={{
                      backgroundColor: variant ? `${VariantsColors[variant]}` : product.variants[0],
                      width: '40px',
                      height: '30px',
                      borderRadius: '5px',
                      display: 'inline-block',
                      boxShadow: `0 0 5px 0 ${VariantsColors[variant]}`,
                    }}
                    className="productId__item__info__small-details--variant--color"
                  />
                )}
                {product.variants && (
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

      {recommendedProducts.length && (
        <div
          className="productId__recommended"
          style={{
            color: theme === 'light' ? darkTheme.bg : lightTheme.bg,
          }}
        >
          <h3 className="productId__recommended--text">You might also like...</h3>
          <div
            className="productId__recommended__items"
            style={{
              border: `1px solid ${theme === 'dark' ? darkTheme.shadow : lightTheme.shadow}`,
              boxShadow: `0 0 5px 0 ${theme === 'dark' ? darkTheme.shadow : lightTheme.shadow}`,
            }}
          >
            {recommendedProducts.map((product: Product) => (
              <RecommendedProducts key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductById;

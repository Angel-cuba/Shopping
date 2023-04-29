import React from 'react';
import { useLottie } from 'lottie-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import RecommendedProducts from '../../components/Product/RecommendedProducts';
import { Product } from '../../interfaces/products/ProductType';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import LottieItem from '../../assets/9844-loading-40-paperplane.json'

const ProductNotFound = ({ valueNotFound }: { valueNotFound: string }) => {
  const [startIndex, setStartIndex] = React.useState(0);
  const options = {
    animationData: LottieItem,
    loop: true,
    autoplay: true,
  };
  const { View } = useLottie(options);
  const { products } = useSelector((state: RootState) => state.products);
  const randomProducts = products?.slice(startIndex, startIndex + 5);

  const handleBackButtonClick = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };
  const handleNextButtonClick = () => {
    if (startIndex + 5 < products?.length) {
      setStartIndex(startIndex + 1);
    }
  };

  return (
    <>
      <div className="products__content__not-found">
        <div className="products__content__not-found--lottie">{View}</div>
        <div className="products__content__not-found__container">
          <div className="products__content__not-found__container--text">
            <div className="products__content__not-found__container--text__title">
              You searched for{' '}
              <span className="products__content__not-found__container--text__title--value">
                {valueNotFound.slice(0, 10)}
              </span>
              . <br />
              Try again by changing the search criteria, <br />
              we hope <br /> you find what you are looking for.
            </div>
          </div>
          <div className="products__content__not-found__container--recommendations">
            <h3 className="products__content__not-found__container--recommendations__title">
              We recommend you:
            </h3>
            <ul className="products__content__not-found__container--recommendations__ul">
              <li className="products__content__not-found__container--recommendations__ul--li">
                Check the spelling of the word.
              </li>
              <li className="products__content__not-found__container--recommendations__ul--li">
                Try a different search term.
              </li>
              <li className="products__content__not-found__container--recommendations__ul--li">
                Try a more general search term.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="products__content__not-found-recommended">
        <h3 className="products__content__not-found-recommended__title">
          {startIndex === 0 && 'We recommend you'}
          {startIndex > 0 && startIndex < 6 && 'Try to find what you are looking for'}
          {startIndex >= 6 && startIndex < 12 && `Still not found? What about of these products?`}
          {startIndex >= 12 && startIndex < 20 && 'Keep looking, we are sure you will find it'}
          {startIndex >= 20 &&
            startIndex < products?.length - 5 &&
            'Many products to show, keep looking'}
          {startIndex === products?.length - 5 && 'No more products to show'}
        </h3>
        <button
          className={
            startIndex === 0
              ? 'products__content__not-found-recommended__slider-button-back--disabled'
              : 'products__content__not-found-recommended__slider-button-back'
          }
          onClick={handleBackButtonClick}
          disabled={startIndex === 0}
        >
          <ArrowBack />
        </button>
        <button
          className={
            startIndex + 5 >= products?.length
              ? 'products__content__not-found-recommended__slider-button-next--disabled'
              : 'products__content__not-found-recommended__slider-button-next'
          }
          onClick={handleNextButtonClick}
          disabled={startIndex + 5 >= products?.length}
        >
          <ArrowForward />
        </button>
        <div className="products__content__not-found-recommended__content">
          {randomProducts.map((product: Product) => (
            <RecommendedProducts key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductNotFound;

import React from 'react';
import { useLottie } from 'lottie-react';

const ProductNotFound = ({ valueNotFound }: { valueNotFound: string }) => {
  const options = {
    animationData: require('../../assets/9844-loading-40-paperplane.json'),
    loop: true,
    autoplay: true,
  };
  const { View } = useLottie(options);
  return (
    <div className="products__content__not-found">
      <div className="products__content__not-found--lottie">{View}</div>
      <div className="products__content__not-found__container">
        <div className="products__content__not-found__container--text">
          <div className="products__content__not-found__container--text__title">
            You searched for <span  className="products__content__not-found__container--text__title--value">{valueNotFound.slice(0, 10)}</span>. <br />
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
  );
};

export default ProductNotFound;

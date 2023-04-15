import React from 'react';
import LottieItem from '../../../assets/91068-message-sent-successfully-plane.json';
import { useLottie } from 'lottie-react';

const LikeItem = () => {
  const options = {
    animationData: LottieItem,
    loop: true,
    autoplay: true,
  };
  const { View } = useLottie(options);
  return <div className="products__content__item--animation-add">{View}</div>;
};

export default LikeItem;

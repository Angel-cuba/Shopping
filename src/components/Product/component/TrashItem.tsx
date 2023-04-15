import React from 'react';
import { useLottie } from 'lottie-react';
import LottieItemTrash from '../../../assets/108969-delete.json';

const TrashItem = () => {
  const options = {
    animationData: LottieItemTrash,
    loop: true,
    autoplay: true,
  };
  const { View } = useLottie(options);
  return <div className="products__content__item--animation-remove">{View}</div>;
};
export default TrashItem;

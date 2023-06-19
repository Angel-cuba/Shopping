import React from 'react'
import './styles/LoadingProductById.scss'

const LoadingProductById = () => {
  return (
    <div className='loadingById'>
      <div className="loadingById__top-view">
        <div className='loadingById__top-view__image'>
        <div className='loadingById__top-view__image__img'></div>
        </div>

      <div className='loadingById__top-view__info'>
      <div className='loadingById__top-view__info__content'>

        <div className='loadingById__top-view__info__content__item'></div>
        <div className='loadingById__top-view__info__content__item'></div>
        <div className='loadingById__top-view__info__content__item'></div>
        <div className='loadingById__top-view__info__content__item'></div>
        </div>
      </div>

      </div>
        <div className="loadingById__bottom-view">
        <div className="loadingById__bottom-view__content">
          <div className="loadingById__bottom-view__content__item"></div>
          <div className="loadingById__bottom-view__content__item"></div>
          <div className="loadingById__bottom-view__content__item"></div>
          <div className="loadingById__bottom-view__content__item"></div>
        </div>
        </div>
    </div>
  )
}

export default LoadingProductById
import React from 'react'
import './styles/LoadingLogin.scss'

const LoadingLogin = () => {
  return (
    <div className='loading-login'>
      <div className='loading-login__container'>
        <div className='loading-login__container__text'>
          <h3>Redirecting....</h3>
          </div>
        <div className='loading-login__container__spinner'>
          </div>
          </div>
    </div>
  )
}

export default LoadingLogin
import React from 'react';
import './styles/LoadingResponse.scss';

const LoadingResponse = () => {
  return (
    <div className="loading-response">
      <div className="loading-response__loading">
        <div className="loading-response__loading--top-left"></div>
        <div className="loading-response__loading--top-right"></div>
        <div className="loading-response__loading--bottom-left"></div>
        <div className="loading-response__loading--bottom-right"></div>
      </div>
    </div>
  );
};

export default LoadingResponse;

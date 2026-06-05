import React from 'react';
import { Product } from '../../interfaces/products/ProductType';
import ProductCard from '../Product/ProductCard/ProductCard';

interface TrendingSectionProps {
  products: Product[];
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ products }) => {
  const trending = products.slice(0, 8);

  if (trending.length === 0) return null;

  return (
    <section className="stride-section" aria-labelledby="trending-heading">
      <div className="stride-container">
        <div className="stride-section-head">
          <div>
            <span className="stride-eyebrow">Trending now</span>
            <h2>Most wanted</h2>
          </div>
        </div>
        <div className="stride-scroller" role="list" aria-label="Trending products">
          {trending.map((p) => (
            <div key={p.id} role="listitem">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;

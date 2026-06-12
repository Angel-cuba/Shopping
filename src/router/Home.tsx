import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/actions/ProductActions';
import { AppDispatch, RootState } from '../redux/store';

import HeroSection from '../components/home/HeroSection';
import SeasonCards from '../components/home/SeasonCards';
import TrendingSection from '../components/home/TrendingSection';
import Footer from '../components/layout/Footer';
import Products from '../pages/Products/Products';
import SkeletonGrid from '../components/Product/ProductCard/SkeletonGrid';

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector((state: RootState) => state.products);

  // Category set by clicking a season card — forwarded to the catalog as a filter override
  const [heroCategory, setHeroCategory] = useState('');

  const catalogRef = useRef<HTMLElement>(null);

  // Fetch products once on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSeasonClick = (season: string) => {
    setHeroCategory(season);
    scrollToCatalog();
  };

  return (
    <>
      {/* Hero */}
      <div className="stride-container" style={{ paddingTop: 'var(--space-8)' }}>
        <HeroSection onShopNow={scrollToCatalog} />
      </div>

      {/* Shop by season */}
      <section className="stride-section">
        <div className="stride-container">
          <div className="stride-section-head">
            <div>
              <span className="stride-eyebrow">Shop by season</span>
              <h2>Find your weather</h2>
            </div>
          </div>
          <SeasonCards onSeasonClick={handleSeasonClick} />
        </div>
      </section>

      {/* Catalog */}
      <section
        className="stride-section"
        style={{ paddingTop: 0 }}
        ref={catalogRef}
        aria-label="Product catalog"
      >
        <div className="stride-container">
          <div className="stride-section-head">
            <div>
              <span className="stride-eyebrow">The catalog</span>
              <h2>All products</h2>
            </div>
          </div>
          {loading
            ? <SkeletonGrid n={8} />
            : <Products products={products} externalCategory={heroCategory} />
          }
        </div>
      </section>

      {/* Trending */}
      <TrendingSection products={products} />

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Home;

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const { products, loading } = useSelector((state: RootState) => state.products);

  // Category set by clicking a collection card — forwarded to the catalog as a filter override.
  const [heroCategory, setHeroCategory] = useState('');

  const catalogRef = useRef<HTMLElement>(null);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Fetch products once on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const category = searchParams.get('category') ?? '';
    setHeroCategory(category);
    if (category) {
      window.requestAnimationFrame(scrollToCatalog);
    }
  }, [searchParams]);

  const handleCollectionClick = (collection: string) => {
    setHeroCategory(collection);
    scrollToCatalog();
  };

  return (
    <>
      <div className="stride-home-shell">
        <div className="stride-home-shell__wordmark" aria-hidden="true">ZYRA LUXE</div>
      </div>

      {/* Hero */}
      <div className="stride-container stride-home-hero-wrap">
        <HeroSection onShopNow={scrollToCatalog} />
      </div>

      {/* Shop by collection */}
      <section className="stride-section stride-section--tight">
        <div className="stride-container">
          <div className="stride-section-head">
            <div>
              <span className="stride-eyebrow">Shop by category</span>
              <h2>Pick a lane</h2>
            </div>
          </div>
          <SeasonCards onSeasonClick={handleCollectionClick} />
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
              <h2>Fresh drops</h2>
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

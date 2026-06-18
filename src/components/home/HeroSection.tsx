import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  onShopNow?: () => void;
}

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=80&auto=format&fit=crop';

const HeroSection: React.FC<HeroSectionProps> = ({ onShopNow }) => {
  const navigate = useNavigate();

  return (
    <section className="stride-hero">
      {/* Background image */}
      <img
        className="stride-hero__bg"
        src={HERO_IMAGE}
        alt="ZYRA LUXE editorial fashion campaign"
        loading="eager"
      />

      {/* Gradient scrim */}
      <div className="stride-hero__scrim" />

      {/* Content */}
      <div className="stride-hero__content">
        <span className="stride-eyebrow">New arrivals · curated daily</span>
        <h1>
          ZYRA
          <br />
          LUXE
        </h1>
        <p>
          Bold everyday pieces, polished silhouettes, and quick picks for women, men, and kids.
        </p>
        <div className="stride-hero__cta">
          <button
            className="stride-btn stride-btn--xl stride-hero__btn-light"
            onClick={onShopNow}
            aria-label="Shop now — scroll to catalog"
          >
            Shop collection
          </button>
          <button
            className="stride-btn stride-btn--xl stride-hero__btn-outline"
            onClick={() => navigate('/home')}
            aria-label="View new arrivals"
          >
            New arrivals
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

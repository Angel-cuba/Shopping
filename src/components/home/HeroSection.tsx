import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  onShopNow?: () => void;
}

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80&auto=format&fit=crop';

const HeroSection: React.FC<HeroSectionProps> = ({ onShopNow }) => {
  const navigate = useNavigate();

  return (
    <section className="stride-hero">
      {/* Background image */}
      <img
        className="stride-hero__bg"
        src={HERO_IMAGE}
        alt="STRIDE hero — running shoe editorial"
        loading="eager"
      />

      {/* Gradient scrim */}
      <div className="stride-hero__scrim" />

      {/* Content */}
      <div className="stride-hero__content">
        <span className="stride-eyebrow">New collection · Summer 2026</span>
        <h1>
          Move
          <br />
          Differently.
        </h1>
        <p>
          Lightweight builds, responsive cushioning, and a silhouette made for the everyday stride.
        </p>
        <div className="stride-hero__cta">
          <button
            className="stride-btn stride-btn--xl stride-hero__btn-light"
            onClick={onShopNow}
            aria-label="Shop now — scroll to catalog"
          >
            Shop now
          </button>
          <button
            className="stride-btn stride-btn--xl stride-hero__btn-outline"
            onClick={() => navigate('/home')}
            aria-label="View lookbook"
          >
            View lookbook
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

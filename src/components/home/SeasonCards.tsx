import React from 'react';

interface SeasonCardsProps {
  onSeasonClick?: (season: string) => void;
}

const SEASONS = [
  {
    name: 'Summer',
    sub: 'Breathable & light',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80&auto=format&fit=crop',
  },
  {
    name: 'Autumn',
    sub: 'Everyday warmth',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop',
  },
  {
    name: 'Winter',
    sub: 'Sealed & insulated',
    image: 'https://images.unsplash.com/photo-1520170350707-b2da59970118?w=600&q=80&auto=format&fit=crop',
  },
  {
    name: 'Spring',
    sub: 'Run-ready',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80&auto=format&fit=crop',
  },
];

const SeasonCards: React.FC<SeasonCardsProps> = ({ onSeasonClick }) => (
  <div className="stride-cat-grid">
    {SEASONS.map((s) => (
      <a
        key={s.name}
        className="stride-cat-card"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onSeasonClick?.(s.name);
        }}
        aria-label={`Shop ${s.name} collection`}
      >
        <img
          className="stride-cat-card__bg"
          src={s.image}
          alt={`${s.name} footwear collection`}
          loading="lazy"
        />
        <div className="stride-cat-card__scrim" />
        <div className="stride-cat-card__content">
          <h3>{s.name}</h3>
          <span>
            {s.sub}&nbsp;
            <i className="fa fa-arrow-right" aria-hidden="true" />
          </span>
        </div>
      </a>
    ))}
  </div>
);

export default SeasonCards;

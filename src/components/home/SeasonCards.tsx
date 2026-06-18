import React from 'react';

interface SeasonCardsProps {
  onSeasonClick?: (collection: string) => void;
}

const SEASONS = [
  {
    name: 'Women',
    filter: 'Women',
    sub: 'Soft color, sharp shape',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=80&auto=format&fit=crop',
  },
  {
    name: 'Men',
    filter: 'Men',
    sub: 'Layered essentials',
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=900&q=80&auto=format&fit=crop',
  },
  {
    name: 'Kids',
    filter: 'Kids',
    sub: 'Bright daily fits',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=900&q=80&auto=format&fit=crop',
  },
  {
    name: 'Accessories',
    filter: 'Accessories',
    sub: 'Finish the look',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80&auto=format&fit=crop',
  },
];

const SeasonCards: React.FC<SeasonCardsProps> = ({ onSeasonClick }) => (
  <div className="stride-cat-grid">
    {SEASONS.map((s) => (
      <button
        key={s.name}
        className="stride-cat-card"
        onClick={(e) => {
          e.preventDefault();
          onSeasonClick?.(s.filter);
        }}
        aria-label={`Shop ${s.name} collection`}
      >
        <img
          className="stride-cat-card__bg"
          src={s.image}
          alt={`${s.name} fashion collection`}
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
      </button>
    ))}
  </div>
);

export default SeasonCards;

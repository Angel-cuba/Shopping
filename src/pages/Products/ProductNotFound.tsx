import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Product, resolveImageUrl, onImgError } from '../../interfaces/products/ProductType';

const TIPS = [
  'Check the spelling of your search term',
  'Try more general keywords',
  'Use the season or size filters instead',
];

const ProductNotFound = ({ valueNotFound }: { valueNotFound: string }) => {
  const [page, setPage] = React.useState(0);
  const { products } = useSelector((state: RootState) => state.products);

  const PER_PAGE = 4;
  const totalPages = Math.ceil((products?.length ?? 0) / PER_PAGE);
  const visible = products?.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE) ?? [];

  return (
    <div className="pnf">
      {/* ── Empty state ─────────────────────────────────────── */}
      <div className="pnf__hero">
        <div className="pnf__hero-icon">
          <i className="fa fa-search" />
        </div>
        <div className="pnf__hero-body">
          <h3 className="pnf__title">
            No results for{' '}
            <span className="pnf__query">"{valueNotFound.slice(0, 24)}"</span>
          </h3>
          <ul className="pnf__tips">
            {TIPS.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Recommendations ──────────────────────────────────── */}
      {visible.length > 0 && (
        <div className="pnf__recs">
          <div className="pnf__recs-head">
            <span className="stride-eyebrow">You might like</span>
            {totalPages > 1 && (
              <div className="pnf__recs-nav">
                <button
                  className="stride-navbar__iconbtn"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 0}
                  aria-label="Previous page"
                >
                  <i className="fa fa-chevron-left" />
                </button>
                <span className="pnf__recs-pager">
                  {page + 1} / {totalPages}
                </span>
                <button
                  className="stride-navbar__iconbtn"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages - 1}
                  aria-label="Next page"
                >
                  <i className="fa fa-chevron-right" />
                </button>
              </div>
            )}
          </div>
          <div className="pnf__recs-grid">
            {visible.map((p: Product) => (
              <Link key={p.id} to={`/product/${p.id}`} className="pnf__rec-card">
                <div className="pnf__rec-img">
                  <img
                    src={resolveImageUrl(p.image, p.name, p.categories)}
                    alt={p.name}
                    onError={onImgError(p.name, p.categories)}
                  />
                </div>
                <span className="pnf__rec-name">{p.name}</span>
                <span className="pnf__rec-price">£{p.price.toFixed(2)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductNotFound;

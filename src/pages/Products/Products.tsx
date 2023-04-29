import React from 'react';
import { Input } from '../../components/Input/Input';
import ProductItem from '../../components/Product/ProductItem';
import { Product, Sizes } from '../../interfaces/products/ProductType';
import ProductNotFound from './ProductNotFound';
import { useLocation, useParams } from 'react-router-dom';
import CreateAndEdit from '../../components/Admin/CreateAndEdit/CreateAndEdit';
import { AddBoxSharp, ClosedCaptionDisabledOutlined } from '@mui/icons-material';
import { useTheme } from '../../context/ThemeProvider';
import { darkTheme, lightTheme } from '../../styles/styles';
import './Products.scss';

const Products = ({ products }: { products: Product[] }) => {
  const [size, setSize] = React.useState('');
  const [variant, setVariant] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [singleFilter, setSingleFilter] = React.useState('');
  const [openFilters, setOpenFilters] = React.useState(false);
  const [openCreateAndEdit, setOpenCreateAndEdit] = React.useState(false);
  const { id } = useParams();

  const location = useLocation();
  const { theme } = useTheme();

  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSize(event.target.value);
  };

  const handleVariantChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVariant(event.target.value);
  };
  const handleChangeSingleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSingleFilter(event.target.value);
  };
  const filterByVariant = () => {
    const filtered = products.filter((product: Product) => {
      return product.variant.toLocaleLowerCase().includes(variant.toLowerCase());
    });
    return filtered;
  };
  const filterByCategory = () => {
    const filtered = products.filter((product: Product) => {
      return product.categories.toLocaleLowerCase().includes(category.toLowerCase());
    });
    return filtered;
  };
  const filterBySizes = () => {
    const filtered = products.filter((product: Product) => {
      return product.sizes.map((size: string) => size).includes(size);
    });
    return filtered;
  };
  const filterByName = () => {
    const filtered = products.filter((product: Product) => {
      return product.name.toLocaleLowerCase().includes(singleFilter.toLowerCase());
    });
    if (filtered.length === 0) {
      return <ProductNotFound valueNotFound={singleFilter} />;
    }
    return filtered.map((product: Product) => {
      return <ProductItem key={product.id} product={product} />;
    });
  };

  const handleOpenFilters = () => {
    setOpenFilters(!openFilters);
  };

  const filterByAll = () => {
    const filtered = products.filter((product: Product) => {
      return (
        product.sizes.map((size: string) => size).includes(size) ||
        product.categories.toLocaleLowerCase().includes(category.toLowerCase()) ||
        product.variant.toLocaleLowerCase().includes(variant.toLowerCase())
      );
    });
    return filtered;
  };

  const showAllFitered = () => {
    if (size && category && variant) {
      return filterByAll().map((product: Product) => {
        return <ProductItem key={product.id} product={product} />;
      });
    } else if (size && category) {
      return filterBySizes().map((product: Product) => {
        return <ProductItem key={product.id} product={product} />;
      });
    } else if (size && variant) {
      return filterBySizes().map((product: Product) => {
        return <ProductItem key={product.id} product={product} />;
      });
    } else if (category && variant) {
      return filterByCategory().map((product: Product) => {
        return <ProductItem key={product.id} product={product} />;
      });
    } else if (size) {
      return filterBySizes().map((product: Product) => {
        return <ProductItem key={product.id} product={product} />;
      });
    } else if (category) {
      return filterByCategory().map((product: Product) => {
        return <ProductItem key={product.id} product={product} />;
      });
    } else if (variant) {
      return filterByVariant().map((product: Product) => {
        return <ProductItem key={product.id} product={product} />;
      });
    }
  };
  const filtersToDefaultValue = () => {
    setSize('');
    setCategory('');
    setVariant('');
    setSingleFilter('');
  };
  const singleFilterToDefaultValue = () => {
    setSingleFilter('');
  };
  const setCategoryValue = (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
    const value = event.currentTarget.textContent ?? '';
    setCategory(value);
  };

  const handleOpenCreate = () => {
    setOpenCreateAndEdit(!openCreateAndEdit);
  };
  const seasson: string[] = ['Summer', 'Winter', 'Autumn', 'Spring'];
  return (
    <div className="products">
      {location.pathname.includes('admin') ? (
        <div className="products__create">
          <div
            className={!openCreateAndEdit ? 'products__button-open' : 'products__button-close'}
            onClick={handleOpenCreate}
          >
            {!openCreateAndEdit ? (
              <AddBoxSharp fontSize="large" />
            ) : (
              <ClosedCaptionDisabledOutlined fontSize="large" style={{ color: '#ff0000' }} />
            )}

            <p className="products__button-text">{openCreateAndEdit ? 'Close' : 'Add'}</p>
          </div>
          {openCreateAndEdit && (
            <CreateAndEdit productId={id} setOpenCreateAndEdit={setOpenCreateAndEdit} />
          )}
        </div>
      ) : null}
      <div className="products__controlPanel" onClick={handleOpenFilters}>
        {openFilters ? (
          <p className="products__controlPanel--button" onClick={filtersToDefaultValue}>
            Hide filters
          </p>
        ) : (
          <p className="products__controlPanel--button" onClick={singleFilterToDefaultValue}>
            Open filters
          </p>
        )}
      </div>
      <div className="products__panel">
        <div className={openFilters ? 'products__panel--visible' : 'products__panel--hidden'}>
          <div className="products__panel--visible__size">
            <select
              value={size}
              onChange={handleSizeChange}
              className="products__panel--visible__size__item"
            >
              <option value="" disabled>
                Select size
              </option>
              {Sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="products__panel--visible__seasson">
            {seasson.map((seasson: string) => {
              return (
                <p
                  key={seasson}
                  className="products__panel--visible__seasson__item"
                  onClick={setCategoryValue}
                  style={{
                    backgroundColor: category === seasson ? '#0f0e0e' : '',
                    color: category === seasson ? '#ffffff' : '',
                    border:
                      theme === 'light'
                        ? `1px solid ${darkTheme.bg}`
                        : `1px solid ${lightTheme.shadow}`,
                  }}
                >
                  {seasson}
                </p>
              );
            })}
          </div>
          <Input
            name="Variant"
            value={variant}
            placeholder=""
            type="text"
            onChange={handleVariantChange}
          />
        </div>
        <div className={!openFilters ? 'products__panel--single' : 'products__panel--hidden'}>
          <Input
            name="Search by name"
            value={singleFilter}
            placeholder=""
            type="text"
            onChange={handleChangeSingleFilter}
            style={styles}
          />
        </div>
      </div>
      <div className="products__content">
        {!singleFilter && !size && !category && !variant
          ? products.map((product: Product) => {
              return <ProductItem key={product.id} product={product} />;
            })
          : null}
        {singleFilter.length ? filterByName() : null}
        {showAllFitered()}
      </div>
    </div>
  );
};

export default Products;

const styles = {
  width: '170px',
  height: '40px',
  fontSize: '18px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  padding: '5px',
};

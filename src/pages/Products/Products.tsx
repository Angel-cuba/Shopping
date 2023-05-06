import React from 'react';
import { Input } from '../../components/Input/Input';
import ProductItem from '../../components/Product/ProductItem';
import { Product, Sizes, Variants } from '../../interfaces/products/ProductType';
import ProductNotFound from './ProductNotFound';
import { useLocation, useParams } from 'react-router-dom';
import CreateAndEdit from '../../components/Admin/CreateAndEdit/CreateAndEdit';
import { AddBoxSharp, ClosedCaptionDisabledOutlined } from '@mui/icons-material';
import { GlobalTheme } from '../../context/ThemeProvider';
import { darkTheme, lightTheme } from '../../styles/styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import LoadingProducts from '../../components/Loading/LoadingProducts';
import './Products.scss';

const Products = ({ products }: { products: Product[] }) => {
  const [size, setSize] = React.useState('');
  const [variant, setVariant] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [singleFilter, setSingleFilter] = React.useState('');
  const [openFilters, setOpenFilters] = React.useState(false);
  const [openCreateAndEdit, setOpenCreateAndEdit] = React.useState(false);
  const [openSizes, setOpenSizes] = React.useState(false);
  const { id } = useParams();

  const location = useLocation();
  const { theme } = GlobalTheme();

  const { loading } = useSelector((state: RootState) => state.products)  

  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSize(event.target.value);
  };

  const handleChangeSingleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSingleFilter(event.target.value);
  };
  const filterByVariant = () => {
    const filtered = products.filter((product: Product) => {
      return product.variants.map((variant: string) => variant).includes(variant);
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
        product.variants.map((variant: string) => variant).includes(variant)
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
  const setVariantValue = (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
    const value = event.currentTarget.textContent ?? '';
    setVariant(value);
  };

  const handleOpenCreate = () => {
    setOpenCreateAndEdit(!openCreateAndEdit);
  };
  const seasson: string[] = ['Summer', 'Winter', 'Autumn', 'Spring'];

  if(loading) return <LoadingProducts />

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
              style={{
                border: `1px solid ${theme === 'light' ? darkTheme.textLink : lightTheme.shadow}`,
                minWidth: '140px',
              }}
              onMouseLeave={() => {
                setOpenSizes(false);
              }}
              onMouseEnter={() => {
                setOpenSizes(true);
              }}
            >
              <option
                value=""
                disabled
                style={{
                  textAlign: 'center',
                }}
              >
                {!openSizes ? 'Select size' : 'Selecting'}
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
                    backgroundColor: category === seasson ? '#111010' : '',
                    color: category === seasson ? '#ffffff' : '',
                    border: `1.4px solid ${theme === 'light' ? darkTheme.bg : lightTheme.shadow}`,
                  }}
                >
                  {seasson}
                </p>
              );
            })}
          </div>
          <div className="products__panel--visible__variant">
            {Variants.map((variantValue: string) => {
              return (
                <p
                  key={variantValue}
                  className="products__panel--visible__variant__item"
                  onClick={setVariantValue}
                  style={{
                    backgroundColor: variantValue === variant ? '#111010' : '',
                    color: variantValue === variant ? '#ffffff' : '',
                    border: `1.4px solid ${theme === 'light' ? darkTheme.bg : lightTheme.shadow}`,
                  }}
                >
                  {variantValue}
                </p>
              );
            })}
          </div>
        </div>
        <div className={!openFilters ? 'products__panel--single' : 'products__panel--hidden'}>
          <Input
            name=""
            value={singleFilter}
            placeholder="Search by name"
            type="text"
            onChange={handleChangeSingleFilter}
            style={{
              border: `1px solid ${theme === 'light' ? darkTheme.shadow : lightTheme.shadow}`,
              color: theme === 'light' ? darkTheme.textLink : lightTheme.shadowMedium,
              width: '170px',
              height: '40px',
              fontSize: '18px',
              borderRadius: '5px',
              padding: '5px',
              boxShadow: `0 0 3px 0 ${
                theme === 'light' ? darkTheme.textLink : lightTheme.textLink
              }`,
              fontWeight: 'bold',
            }}
          />
        </div>
      </div>
      <div className="products__content">
        {!singleFilter && !size && !category && !variant
          ? !products ? 'Fetching' : products?.map((product: Product) => {
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

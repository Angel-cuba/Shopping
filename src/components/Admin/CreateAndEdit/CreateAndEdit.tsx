import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '../../../redux/store';
import { addProductToStock, updateProductInStock } from '../../../redux/actions/ProductActions';
import { Input } from '../../Input/Input';
import {
  NewProductToStock,
  Product,
  Sizes,
  Variants,
} from '../../../interfaces/products/ProductType';

type Props = {
  productId?: string;
  setOpenCreateAndEdit: (openCreateAndEdit: boolean) => void;
};

const initialProduct: NewProductToStock = {
  id: '',
  name: '',
  price: 0,
  description: '',
  image: '',
  inStock: 0,
  sizes: [],
  variants: [],
  categories: '',
};

const CreateAndEdit = ({ productId, setOpenCreateAndEdit }: Props) => {
  const { products } = useSelector((state: RootState) => state.products);

  const product = products?.find((product: Product) => {
    return product.id === productId;
  });

  const productToEdit = product ? product : initialProduct;
  const [newProduct, setNewProduct] = React.useState<NewProductToStock>(productToEdit);
  const [showAddSizesButton, setShowAddSizesButton] = React.useState(true);
  const [showAddVariantsButton, setShowAddVariantsButton] = React.useState(true);

  const dispatch = useDispatch<AppDispatch>();

  const handlerInput = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    const { name, value } = e.currentTarget;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddAllSizes = () => {
    const emptySizesInProduct = newProduct.sizes.length;
    if (!emptySizesInProduct) {
      handleClearSizes();
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        sizes: [...prevProduct.sizes, ...Sizes],
      }));
      setShowAddSizesButton(false);
    } else {
      handleClearSizes();
      setShowAddSizesButton(true);
    }
  };

  const handleAddingSize = (value: string) => () => {
    setShowAddSizesButton(false);
    const existSize = newProduct.sizes.find((size: string) => size === value);
    if (!value || value === '') return;
    if (existSize) {
      handleRemoveSize(value);
    } else {
      const sizes = [...newProduct.sizes];
      sizes.push(value);
      setNewProduct({ ...newProduct, sizes });
    }
  };

  const handleRemoveSize = (size: string) => {
    const sizes = [...newProduct.sizes];
    const index = sizes.findIndex((sizeInArray: string) => sizeInArray === size);
    sizes.splice(index, 1);
    setNewProduct({ ...newProduct, sizes });
  };

  const handleClearSizes = () => {
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      sizes: [],
    }));
    setShowAddSizesButton(true);
  };

  const handleAllVariants = () => {
    const emptyVariantsInProduct = newProduct.variants.length;
    if (!emptyVariantsInProduct) {
      handleClearVariants();
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        variants: [...prevProduct.variants, ...Variants],
      }));
      setShowAddVariantsButton(false);
    } else {
      handleClearVariants();
      setShowAddVariantsButton(true);
    }
  };

  const handleAddingVariant = (value: string) => () => {
    setShowAddSizesButton(false);
    const existVariant = newProduct.variants.find((variant: string) => variant === value);
    if (!value || value === '') return;
    if (existVariant) {
      handleRemoveVariant(value);
    } else {
      const variants = [...newProduct.variants];
      variants.push(value);
      setNewProduct({ ...newProduct, variants });
    }
  };
  const handleRemoveVariant = (variant: string) => {
    const variants = [...newProduct.variants];
    const index = variants.findIndex((variantInArray: string) => variantInArray === variant);
    variants.splice(index, 1);
    setNewProduct({ ...newProduct, variants });
  };

  const handleClearVariants = () => {
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      variants: [],
    }));
    setShowAddVariantsButton(true);
  };

  const handlePrice = (value: number) => {
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      price: value,
    }));
  };

  const handleInStock = (value: number) => {
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      inStock: value,
    }));
  };

  const handlerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      newProduct.name === '' ||
      newProduct.price === 0 ||
      newProduct.description === '' ||
      newProduct.image === '' ||
      newProduct.inStock === 0 ||
      newProduct.sizes.length === 0 ||
      newProduct.variants.length === 0 ||
      newProduct.categories === ''
    ) {
      alert('Please fill all the fields');
      return;
    }
    if (!productId) {
      const productToStorage = {
        name: newProduct.name,
        price: newProduct.price,
        description: newProduct.description,
        image: newProduct.image,
        sizes: newProduct.sizes,
        inStock: newProduct.inStock,
        variants: newProduct.variants,
        categories: newProduct.categories,
      };
      dispatch(addProductToStock(productToStorage));
    } else {
      setNewProduct((prev) => ({
        ...prev,
        id: productId,
      }));
      dispatch(updateProductInStock(newProduct));
    }
    setOpenCreateAndEdit(false);
  };

  return (
    <div className="admin-createandcheck__views__create-and-edit">
      <h1 className="admin-createandcheck__views__create-and-edit--label">
        {!productId ? 'Creating' : 'Editing'}
      </h1>
      <form onSubmit={handlerSubmit} className="admin-createandcheck__views__create-and-edit__form">
        <Input
          name="name"
          placeholder="Give a product name"
          value={newProduct.name}
          onChange={handlerInput}
          type="text"
          admin
        />
        <div className="admin-createandcheck__views__create-and-edit__form__description">
          <label
            htmlFor="description"
            className="admin-createandcheck__views__create-and-edit__form__description--label"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            cols={30}
            rows={10}
            placeholder="Give a product description"
            value={newProduct.description}
            onChange={handlerInput}
            className="admin-createandcheck__views__create-and-edit__form__description--content"
          />
        </div>
        <Input
          name="categories"
          placeholder="Give a product categories"
          value={newProduct.categories}
          onChange={handlerInput}
          type="text"
          admin
        />
        <Input
          name="image"
          placeholder="Give a product image"
          value={newProduct.image}
          onChange={handlerInput}
          type="text"
          admin
        />
        {/* TODO: Add styles */}
        <div className="">
          <label htmlFor="">In stock</label>
          <input
            type="number"
            name="inStock"
            value={newProduct.inStock}
            onChange={(e) => handleInStock(Number(e.target.value))}
          />
        </div>

        <div className="admin-createandcheck__views__create-and-edit__form__variants-block">
          {Variants?.map((variant) => (
            <p
              key={variant}
              style={{
                backgroundColor: newProduct.variants.includes(variant) ? '#374c355b' : '#eeeeee',
              }}
              className="admin-createandcheck__views__create-and-edit__form__variants-block__variant"
              onClick={handleAddingVariant(variant)}
            >
              {variant}
            </p>
          ))}
        </div>
        <div className="">
          <div
            onClick={handleAllVariants}
            className="admin-createandcheck__views__create-and-edit__form__add-clear-buttons__handler-sizes admin-createandcheck__views__create-and-edit__form__add-clear-buttons__handler-sizes--all"
          >
            {showAddVariantsButton || newProduct.variants.length === 0
              ? 'Add all variants'
              : 'Clear all variants'}
          </div>
        </div>
        <div className="admin-createandcheck__views__create-and-edit__form__sizes-block">
          {Sizes?.map((size) => (
            <p
              key={size}
              style={{
                backgroundColor: newProduct.sizes.includes(size) ? '#374c355b' : '#eeeeee',
              }}
              className="admin-createandcheck__views__create-and-edit__form__sizes-block__size"
              onClick={handleAddingSize(size)}
            >
              {size}
            </p>
          ))}
        </div>
        <div className="admin-createandcheck__views__create-and-edit__form__add-clear-buttons">
          {newProduct.sizes.length ? (
            <div
              onClick={handleClearSizes}
              className="admin-createandcheck__views__create-and-edit__form__add-clear-buttons__handler-sizes admin-createandcheck__views__create-and-edit__form__add-clear-buttons__handler-sizes--clear"
            >
              Delete {newProduct.sizes.length} sizes
            </div>
          ) : null}
          {newProduct.sizes.length && newProduct.sizes.length !== Sizes.length ? (
            <div
              onClick={handleAddAllSizes}
              className="admin-createandcheck__views__create-and-edit__form__add-clear-buttons__handler-sizes"
            >
              <span className="admin-createandcheck__views__create-and-edit__form__add-clear-buttons__handler-sizes--text">
                Still missing {Sizes.length - newProduct.sizes.length} sizes
                <br />
                you could add all sizes here if you want!
              </span>
            </div>
          ) : null}
          {showAddSizesButton || newProduct.sizes.length === 0 ? (
            <button
              type="button"
              onClick={handleAddAllSizes}
              className="admin-createandcheck__views__create-and-edit__form__add-clear-buttons__handler-sizes"
            >
              Add all sizes
            </button>
          ) : null}
        </div>
        {/* TODO: Add styles here*/}
        <div className="">
          <label
            htmlFor="price"
            className="admin-createandcheck__views__create-and-edit__form__price--label"
          >
            Price
          </label>
          <input
            type="number"
            placeholder="Price"
            name="price"
            value={newProduct.price}
            onChange={(e) => handlePrice(Number(e.target.value))}
          />
        </div>
        <button
          type="submit"
          className="admin-createandcheck__views__create-and-edit__form__submit"
        >
          {!productId ? 'Add' : 'Edit'}
        </button>
      </form>
    </div>
  );
};

export default CreateAndEdit;

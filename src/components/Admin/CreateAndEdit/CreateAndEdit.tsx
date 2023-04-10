import React, { FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '../../../redux/store';
import { addProductToStock, updateProductInStock } from '../../../redux/actions/ProductActions';
import { Input } from '../../Input/Input';
import { NewProductToStock, Product } from '../../../interfaces/products/ProductType';

const CreateAndEdit = ({ productId }: { productId: string | undefined }) => {
  const { products } = useSelector((state: RootState) => state);

  const product = products.products?.find((product: Product) => {
    return product.id.toString() === productId;
  });
  const time = new Date().getTime();
  const [id, setId] = React.useState<number>(product?.id ?? time);

  const [name, setName] = React.useState<string>(product?.name ?? '');
  const [description, setDescription] = React.useState<string>(product?.description ?? '');
  const [categories, setCategories] = React.useState<string>(product?.categories ?? '');
  const [image, setImage] = React.useState<string>(product?.image ?? '');
  const [variant, setVariant] = React.useState<string>(product?.variant ?? '');
  const [sizes, setSizes] = React.useState<string>(product?.sizes ?? '');
  const [price, setPrice] = React.useState<number>(product?.price ?? 0);
  const dispatch = useDispatch<AppDispatch>();

  const handlerInput = (e: FormEvent) => {
    e.preventDefault();
    const { name, value } = e.target as HTMLInputElement;
    switch (name) {
      case 'id':
        setId(Number(value));
        break;
      case 'name':
        setName(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'categories':
        setCategories(value);
        break;
      case 'image':
        setImage(value);
        break;
      case 'variant':
        setVariant(value);
        break;
      case 'sizes':
        setSizes(value);
        break;
      case 'price':
        setPrice(Number(value));
        break;
      default:
        break;
    }
  };

  const handlerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newProduct: NewProductToStock = {
      id,
      name,
      description,
      categories,
      image,
      variant,
      sizes,
      price,
    };
    if (!productId) {
      dispatch(addProductToStock(newProduct));
    } else {
      dispatch(updateProductInStock(newProduct));
    }
  };

  return (
    <div className="admin-createandcheck__views__create-and-edit">
      <h1 className="admin-createandcheck__views__create-and-edit--label">
        {!productId ? 'Create product' : 'Edit product'}
      </h1>
      <form onSubmit={handlerSubmit} className="admin-createandcheck__views__create-and-edit__form">
        <Input
          name="id"
          placeholder="Give a product id"
          value={id}
          onChange={handlerInput}
          type="number"
          admin
        />
        <Input
          name="name"
          placeholder="Give a product name"
          value={name}
          onChange={handlerInput}
          type="text"
          admin
        />
        <Input
          name="description"
          placeholder="Give a product description"
          value={description}
          onChange={handlerInput}
          type="text"
          admin
        />
        <Input
          name="categories"
          placeholder="Give a product categories"
          value={categories}
          onChange={handlerInput}
          type="text"
          admin
        />
        <Input
          name="image"
          placeholder="Give a product image"
          value={image}
          onChange={handlerInput}
          type="text"
          admin
        />
        <Input
          name="variant"
          placeholder="Give a product variant"
          value={variant}
          onChange={handlerInput}
          type="text"
          admin
        />
        <Input
          name="sizes"
          placeholder="Give a product sizes"
          value={sizes}
          onChange={handlerInput}
          type="text"
          admin
        />
        <Input
          name="price"
          placeholder="Give a product price"
          value={price}
          onChange={handlerInput}
          type="text"
          admin
        />
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

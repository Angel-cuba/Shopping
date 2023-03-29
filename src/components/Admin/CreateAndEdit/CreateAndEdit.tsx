import React, { FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { NewProductToStock } from '../../../interfaces/products/ProductType'
import { addProductToStock } from '../../../redux/actions/ProductActions'
import { AppDispatch, RootState } from '../../../redux/store'
import { Input } from '../../Input/Input'

const CreateAndEdit = () => {
  const params = useParams()
  const { products } = useSelector((state: RootState) => state)
  console.log('🚀 ~ file: CreateAndEdit.tsx:12 ~ CreateAndEdit ~ products:', products)

  // const product = products.products?.find((product: Product) => {
  //   return product.id.toString() === params.id
  // })
  const time = new Date().getTime()
  // const [id, setId] = React.useState<number>(params.id ? product?.id : 0)
  const [id, setId] = React.useState<number>(time)

  const [name, setName] = React.useState<string>('')
  const [description, setDescription] = React.useState<string>('')
  const [categories, setCategories] = React.useState<string>('')
  const [image, setImage] = React.useState<string>('')
  const [variant, setVariant] = React.useState<string>('')
  const [sizes, setSizes] = React.useState<string>('')
  const [price, setPrice] = React.useState<number>(0)
  const [newProduct, setNewProduct] = React.useState<any>()
  console.log('🚀 ~ file: CreateAndEdit.tsx:26 ~ CreateAndEdit ~ newProduct:', newProduct)
  const dispatch = useDispatch<AppDispatch>()

  const handlerInput = (e: FormEvent) => {
    e.preventDefault()
    const { name, value } = e.target as HTMLInputElement
    switch (name) {
      case 'id':
        setId(Number(value))
        break
      case 'name':
        setName(value)
        break
      case 'description':
        setDescription(value)
        break
      case 'categories':
        setCategories(value)
        break
      case 'image':
        setImage(value)
        break
      case 'variant':
        setVariant(value)
        break
      case 'sizes':
        setSizes(value)
        break
      case 'price':
        setPrice(Number(value))
        break
      default:
        break
    }
  }
  const handlerNewProduct = () => {
    const newProduct: NewProductToStock = {
      id,
      name,
      description,
      categories,
      image,
      variant,
      sizes,
      price
    }
    setNewProduct(newProduct)
  }

  const handlerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handlerNewProduct()
    // if (params.id) {
    //   console.log('🚀 ~ file: CreateAndEdit.tsx:9 ~ CreateAndEdit ~ editing:', params.id)
    // } else {
    console.log('🚀 ~ file: CreateAndEdit.tsx:9 ~ CreateAndEdit ~ creating:', newProduct)
    if (newProduct) {
      dispatch(addProductToStock(newProduct))
    }
    // }
  }

  return (
    <div className="admin-createandcheck__views__create-and-edit">
      <h1 className="admin-createandcheck__views__create-and-edit--label">
        {!params.id ? 'Create product' : 'Edit product'}
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
          type="number"
          admin
        />
        <button
          type="submit"
          className="admin-createandcheck__views__create-and-edit__form__submit">
          {!params.id ? 'Add' : 'Edit'}
        </button>
      </form>
    </div>
  )
}

export default CreateAndEdit

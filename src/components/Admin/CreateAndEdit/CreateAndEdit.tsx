import React, { FormEvent } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { NewProductToStock, Product } from '../../../interfaces/products/ProductType'
import { RootState } from '../../../redux/store'
import { Input } from '../../Input/Input'
import './CreateAndEdit.scss'

const CreateAndEdit = () => {
  const { id } = useParams()
  const { products } = useSelector((state: RootState) => state)

  const product = products.products.find((product: Product) => {
    return product.id.toString() === id
  })
  console.log('🚀 ~ file: CreateAndEdit.tsx:9 ~ CreateAndEdit ~ id:', id)

  const [name, setName] = React.useState<string>(id ? product?.name : '')
  const [description, setDescription] = React.useState<string>(id ? product?.description : '')
  const [categories, setCategories] = React.useState<string>(id ? product?.categories : '')
  const [image, setImage] = React.useState<string>(id ? product?.image : '')
  const [variant, setVariant] = React.useState<string>(id ? product?.variant : '')
  const [sizes, setSizes] = React.useState<string>(id ? product?.sizes : '')
  const [price, setPrice] = React.useState<number>(id ? product?.price : 0)
  const [newProduct, setNewProduct] = React.useState<NewProductToStock>()

  const handlerInput = (e: FormEvent) => {
    e.preventDefault()
    const { name, value } = e.target as HTMLInputElement
    switch (name) {
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
    if (id) {
      console.log('🚀 ~ file: CreateAndEdit.tsx:9 ~ CreateAndEdit ~ editing:', id)
    } else {
      console.log('🚀 ~ file: CreateAndEdit.tsx:9 ~ CreateAndEdit ~ creating:', newProduct)
    }
  }

  return (
    <div className="admin-createandcheck__views__create-and-edit">
      <form onSubmit={handlerSubmit}>
        <Input
          name="name"
          placeholder="Give a product name"
          value={name}
          onChange={handlerInput}
          type="text"
        />
        <Input
          name="description"
          placeholder="Give a product description"
          value={description}
          onChange={handlerInput}
          type="text"
        />
        <Input
          name="categories"
          placeholder="Give a product categories"
          value={categories}
          onChange={handlerInput}
          type="text"
        />
        <Input
          name="image"
          placeholder="Give a product image"
          value={image}
          onChange={handlerInput}
          type="text"
        />
        <Input
          name="variant"
          placeholder="Give a product variant"
          value={variant}
          onChange={handlerInput}
          type="text"
        />
        <Input
          name="sizes"
          placeholder="Give a product sizes"
          value={sizes}
          onChange={handlerInput}
          type="text"
        />
        <Input
          name="price"
          placeholder="Give a product price"
          value={price}
          onChange={handlerInput}
          type="number"
        />
        <button type="submit">{id ? 'Edit' : 'Add'}</button>
      </form>
    </div>
  )
}

export default CreateAndEdit

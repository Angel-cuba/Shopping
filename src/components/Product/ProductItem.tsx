import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Product } from '../../interfaces/products/ProductType'
import { CartIcon } from '../Cart/Cart'
import { DeleteForever, ModeEdit } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { deleteProductFromStock, updateProductInStock } from '../../redux/actions/ProductActions'
import CreateAndEdit from '../Admin/CreateAndEdit/CreateAndEdit'

const ProductItem = ({ product }: { product: Product }) => {
  const [openCreateAndEdit, setOpenCreateAndEdit] = React.useState(false)
  const location = useLocation()
  const { pathname } = location
  const dispatch = useDispatch<AppDispatch>()

  const { user } = useSelector((state: RootState) => state.userLogged)

  const handleEdit = (product: Product) => {
    setOpenCreateAndEdit(!openCreateAndEdit)
    dispatch(updateProductInStock(product))
  }

  const handleDelete = (id: number) => {
    dispatch(deleteProductFromStock(id))
  }

  return (
    <>
      <div key={product.id} className="products__content__item">
        {user?.role === 'ADMIN' && pathname.includes('/admin/dashboard') && (
          <div className="products__content__item--admin-icons">
            <div
              onClick={() => handleEdit(product)}
              style={{
                backgroundColor: openCreateAndEdit ? 'rgba(23, 108, 0, 0.295)' : 'transparent'
              }}>
              <ModeEdit
                className="products__content__item--admin-icons--icon"
                fontSize="large"
                color="success"
              />
            </div>
            <div onClick={() => handleDelete(product.id)}>
              <DeleteForever
                className="products__content__item--admin-icons--icon products__content__item--admin-icons--icon--delete "
                fontSize="large"
                color="error"
              />
            </div>
          </div>
        )}
        {pathname !== `/product/${product.id}` &&
          pathname !== `/checkout/product/${product.id}` && (
            <div className="products__content__item--details">
              <Link
                to={`/product/${product.id}`}
                style={{
                  textDecoration: 'none',
                  color: '#4c4c4c',
                  display: 'flex'
                }}>
                <MoreVertIcon />
                Details
              </Link>
            </div>
          )}
        <div className="products__content__item--add">
          <div className="products__content__item--name--icon">
            <CartIcon product={product} />
          </div>
        </div>
        <div className="products__content__item--image">
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '5px',
              objectFit: 'cover',
              transform: 'rotate(-20deg)'
            }}
          />
        </div>
        <div className="products__content__item--info">
          <h3 className="products__content__item--info--name">{product.name.slice(0, 12)}</h3>
          <p className="products__content__item--info--description">
            {product.description.slice(0, 20)}...
          </p>
          <p className="products__content__item--info--price">£{product.price}</p>
        </div>
        {openCreateAndEdit && (
          <div className="products__content__item--editing-view">
            <CreateAndEdit
              productId={`${product.id}`}
              setOpenCreateAndEdit={setOpenCreateAndEdit}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default ProductItem

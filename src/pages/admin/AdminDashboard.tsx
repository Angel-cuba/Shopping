import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import StoreMallDirectoryRounded from '@mui/icons-material/StoreMallDirectoryRounded'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import Products from '../Products/Products'
import Customers from '../../components/Admin/Customers/Customers'
import { AddBoxSharp, StorageRounded } from '@mui/icons-material'
import './styles/AdminDashboard.scss'
import { fetchProducts } from '../../redux/actions/ProductActions'
import CreateAndEdit from '../../components/Admin/CreateAndEdit/CreateAndEdit'

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [openCustomers, setOpenCustomers] = React.useState(false)
  const [openProducts, setOpenProducts] = React.useState(false)
  const [openCreate, setOpenCreate] = React.useState(false)
  const { products } = useSelector((state: RootState) => state)
  const { id } = useParams()

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handleOpenCustomers = () => {
    setOpenProducts(false)
    setOpenCustomers(!openCustomers)
  }

  const handleOpenProducts = () => {
    setOpenCustomers(false)
    setOpenProducts(!openProducts)
  }

  const handleOpenCreate = () => {
    setOpenCreate(!openCreate)
  }
  return (
    <>
      <div className="admin-dashboard">
        <div className="admin-dashboard__buttons" onClick={handleOpenCustomers}>
          <PeopleAltIcon />
          <p className="admin-dashboard__buttons--text">Customers</p>
        </div>
        <div className="admin-dashboard__buttons" onClick={handleOpenProducts}>
          <StoreMallDirectoryRounded />
          <p className="admin-dashboard__buttons--text">Products</p>
        </div>
        <Link to="/admin/createandcheck" className="admin-dashboard__buttons">
          <StorageRounded />
          <p className="admin-dashboard__buttons--text">In stock</p>
        </Link>
        <div className="admin-dashboard__buttons" onClick={handleOpenCreate}>
          <AddBoxSharp />
          <p className="admin-dashboard__buttons--text">Add product</p>
        </div>
      </div>
      {openCustomers && <Customers />}
      {openProducts && <Products {...products} />}
      {openCreate && (
        <div className="admin-dashboard-create-product">
          <CreateAndEdit productId={id} />
        </div>
      )}
    </>
  )
}

export default AdminDashboard

import React from 'react'
import { Link } from 'react-router-dom'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import StoreMallDirectoryRounded from '@mui/icons-material/StoreMallDirectoryRounded'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import Products from '../Products/Products'
import Customers from '../../components/Admin/Customers/Customers'
import { StorageRounded } from '@mui/icons-material'
import './AdminDashboard.scss'

const AdminDashboard = () => {
  const [openCustomers, setOpenCustomers] = React.useState(false)
  const [openProducts, setOpenProducts] = React.useState(false)
  const { products } = useSelector((state: RootState) => state)

  const handleOpenCustomers = () => {
    setOpenProducts(false)
    setOpenCustomers(!openCustomers)
  }

  const handleOpenProducts = () => {
    setOpenCustomers(false)
    setOpenProducts(!openProducts)
  }
  return (
    <>
      <div className="admin-dashboard">
        <div className="admin-dashboard__buttons" onClick={handleOpenCustomers}>
          <PeopleAltIcon />
          <p>Customers</p>
        </div>
        <div className="admin-dashboard__buttons" onClick={handleOpenProducts}>
          <StoreMallDirectoryRounded />
          <p>Products</p>
        </div>
        <div className="admin-dashboard__buttons">
          <StorageRounded />
          <Link to="/admin/createandcheck">In stock</Link>
        </div>
      </div>
      {openCustomers && <Customers />}
      {openProducts && <Products {...products} />}
    </>
  )
}

export default AdminDashboard

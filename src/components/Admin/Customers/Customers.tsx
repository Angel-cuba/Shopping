import React, { useEffect } from 'react'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { ICustomer } from '../../../interfaces/customer/Customer'
import { users } from '../../../data/users'
import Customer from './Customer/Customer'
import { Controls } from '../Controls/Controls'
import './Customers.scss'

const Customers = (): JSX.Element => {
  const [filteredUsers, setFilteredUsers] = React.useState(users)
  const [search, setSearch] = React.useState('')
  console.log('🚀 ~ file: Customers.tsx:12 ~ Customers ~ search:', search)

  const handleSearch = () => {
    const filtered = users.filter((user) => {
      return user.name.toLowerCase().includes(search.toLowerCase())
    })
    setFilteredUsers(filtered)
  }
  useEffect(() => {
    handleSearch()
  }, [search])
  return (
    <>
      <Controls search={search} setSearch={setSearch} />
      <table className="customers">
        <thead className="customers__header">
          <tr className="customers__header--item">
            <th
              className="customers__header--item"
              style={{
                paddingLeft: '10px'
              }}>
              Customer
            </th>
            <th
              className="customers__header--item"
              style={{
                display: 'flex',
                alignItems: 'center'
              }}>
              Last seen <ArrowDownwardIcon />
            </th>
            <th className="customers__header--item">Orders</th>
            <th className="customers__header--item">Total spent</th>
            <th className="customers__header--item">Latest purchase</th>
            <th className="customers__header--item">News</th>
            <th className="customers__header--item">Segments</th>
          </tr>
        </thead>
        <tbody>
          {!filteredUsers.length ? (
            <tr>
              <td colSpan={7}>No customers found</td>
            </tr>
          ) : (
            filteredUsers.map((customer: ICustomer) => (
              <Customer key={customer.id} customer={customer} />
            ))
          )}
        </tbody>
      </table>
    </>
  )
}

export default Customers

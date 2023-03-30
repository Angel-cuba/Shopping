import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import { CustomerType } from '../../../../interfaces/customer/Customer'

export default function Customer({ customer }: { customer: CustomerType }): JSX.Element {
  return (
    <tr className="customers__body">
      <td className="customers__body--item customers__body--item--img ">
        <img
          src={customer.picture}
          alt=""
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginRight: '10px'
          }}
        />
        <p
          style={{
            color: '#3F29C8',
            fontWeight: 'bold',
            fontSize: '20px'
          }}>
          {customer.name}
        </p>
      </td>
      <td className="customers__body--item">{customer.lastSeen}</td>
      <td className="customers__body--item">{customer.orders}</td>
      <td
        className="customers__body--item"
        style={{
          color: Number(customer.total_spents) > 500 ? '#E72300' : '#5c5c5c'
        }}>
        US${customer.total_spents}
      </td>
      <td
        className="customers__body--item"
        style={{
          color: '#595959'
        }}>
        {customer.last_purchase.date && customer.last_purchase.date
          ? customer.last_purchase.date + ', ' + customer.last_purchase.time
          : null}
      </td>
      <td className="customers__body--item">{customer.news ? <CheckIcon /> : <CloseIcon />}</td>
      <td className="customers__body--item">
        <p className={customer.segments ? 'customers__body--item--regular' : ''}>
          {customer.segments}
        </p>
      </td>
    </tr>
  )
}

import React from 'react'
import CheckStock from '../../components/Admin/CheckStock/CheckStock'
import CreateAndEdit from '../../components/Admin/CreateAndEdit/CreateAndEdit'
import './styles/CreateAndCheck.scss'

const CreateAndCheck = () => {
  return (
    <div className="admin-createandcheck">
      <div className="admin-createandcheck__views">
        <CreateAndEdit />
        <CheckStock />
      </div>
    </div>
  )
}

export default CreateAndCheck

import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.userLogged)
  console.log('🚀 ~ file: Profile.tsx:7 ~ Profile ~ user:', user)
  return (
    <div className="profile">
      <div className="profile__container">
        <div className="profile__container__header">
          <h1>Welcome {user?.role === 'ADMIN' ? 'administrator' : ''}</h1>

          <div className="profile__container__header__user">
            <div className="profile__container__header__user__avatar">
              <img
                src={user?.picture}
                alt={user?.name}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <div className="profile__container__header__user__info">
              <h2>{user?.name}</h2>
              <p>{user?.email}</p>
            </div>
          </div>
        </div>
        <div className="profile__container__history">
          <h2>History</h2>
        </div>
      </div>
    </div>
  )
}

export default Profile

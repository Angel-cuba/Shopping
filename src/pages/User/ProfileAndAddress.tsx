import React, { FormEvent } from 'react';
import { UserAddress, UserFromDB } from '../../interfaces/user/UserType';
import { Input } from '../../components/Input/Input';
import { api } from '../../utils/api';

type Props = {
  userId: string | undefined;
  address: UserAddress | undefined;
  userEdited: UserFromDB;
  setUserEdited: (userEdited: UserFromDB) => void;
  setEdit: (edit: boolean) => void;
  setAddresses: (addresses: UserAddress) => void;
  setLoading: (loading: boolean) => void;
  userAddresses: UserAddress[] | undefined;
};

const initialUserAddress: UserAddress = {
  address: '',
  city: '',
  country: '',
  postalCode: '',
};

const ProfileAndAddress = ({
  userId,
  userEdited,
  setUserEdited,
  setEdit,
  setAddresses,
  address,
  setLoading,
  userAddresses,
}: Props) => {
  const [openData, setOpenData] = React.useState(!address?.id ? true : false);
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [userAddress, setUserAddress] = React.useState(!address?.id ? initialUserAddress : address);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (userEdited.password !== confirmPassword) {
      //TODO: Change this alert for a toast
      return alert('Passwords do not match');
    }
    setUserEdited(userEdited);
    setEdit(false);
  };
  const cancelForm = () => {
    setEdit(false);
    setUserEdited({
      ...userEdited,
      username: '',
      password: '',
      phone: '',
    });
  };
  const cancelAddress = () => {
    setEdit(false);
    setUserAddress(initialUserAddress);
  };
  const handleToggle = () => {
    setOpenData(!openData);
  };

  const sendUserAddress = async () => {
    setLoading(true);
    if (!address?.id) {
      const addressData = {
        address: userAddress?.address,
        city: userAddress?.city,
        country: userAddress?.country,
        postalCode: userAddress?.postalCode,
        user: {
          id: userId,
        },
      };
      try {
        const response = await api.post('/addresses', addressData);
        setAddresses(response.data);
        if (response.status === 200) {
          //TODO: Change this alert for a toast
          setEdit(false);
        } else {
          console.log('Error');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      const addressToUpdate = {
        id: address?.id,
        address: userAddress.address,
        city: userAddress.city,
        postalCode: userAddress.postalCode,
        country: userAddress.country,
        user: {
          id: userId,
        },
      };
      try {
        const request = async () => {
          const response = await api.put(`/addresses`, addressToUpdate);
          setAddresses(response.data);
          if (response.status === 200) {
            //TODO: Change this alert for a toast
            setEdit(false);
          } else {
            console.log('Error');
          }
        };
        request();
      } catch (error) {
        console.log(error);
      }
    }
    setLoading(false);
  };
  const handlerSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (userAddress) {
      setUserAddress(userAddress);
    }
    sendUserAddress();
  };
  const userAddressInfoStreet = userAddresses?.map((address: UserAddress) => {
    return (
      <p key={address.id} className="profile__edit-form__container__user-address__addresses--item">
        {address.address}
      </p>
    );
  });

  const updateUserInformation = async () => {
    console.log(userEdited);
  };

  return (
    <div className="profile__edit-form__container">
      <div className="profile__edit-form__container__toggle">
        <div
          className={
            openData
              ? 'profile__edit-form__container__toggle--button'
              : 'profile__edit-form__container__toggle--button--disable'
          }
          onClick={handleToggle}
        >
          Edit your data
        </div>
        <div
          className={
            openData
              ? 'profile__edit-form__container__toggle--button--disable'
              : 'profile__edit-form__container__toggle--button'
          }
          onClick={handleToggle}
        >
          Add address
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {openData ? (
          <>
            <div className="profile__edit-form__container__user-data">
              <Input
                type="text"
                name="name"
                value={userEdited?.username}
                onChange={(e) => setUserEdited({ ...userEdited, username: e.target.value })}
                className="profile__edit-form__container__input"
                placeholder={userEdited?.username}
                style={styles}
                admin
                profile
              />
              <Input
                name="email"
                value={userEdited?.email}
                className="profile__edit-form__container__input"
                placeholder={userEdited.email}
                style={styles}
                admin
                profile
                readonly
              />
              <Input
                type="text"
                name="password"
                value={userEdited.password ? userEdited.password : ''}
                onChange={(e) => setUserEdited({ ...userEdited, password: e.target.value })}
                className="profile__edit-form__container__input"
                placeholder={userEdited.password ? userEdited.password : '***********'}
                style={styles}
                admin
                profile
              />
              <Input
                type="text"
                name="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="profile__edit-form__container__input"
                placeholder={!confirmPassword ? 'Confirm password' : confirmPassword}
                style={styles}
                admin
                profile
              />
              <Input
                type="text"
                name="phone"
                value={userEdited.phone ? userEdited.phone : ''}
                onChange={(e) => setUserEdited({ ...userEdited, phone: e.target.value })}
                className="profile__edit-form__container__input"
                placeholder={userEdited.phone ? userEdited.phone : '+123 45 67 89000'}
                style={styles}
                admin
                profile
              />
              <div className="profile__edit-form__container__user-data__buttons">
                <div
                  className="profile__edit-form__container__user-data__buttons--confirm"
                  onClick={updateUserInformation}
                >
                  Confirm
                </div>
                <div
                  className="profile__edit-form__container__user-data__buttons--cancel"
                  onClick={cancelForm}
                >
                  Cancel
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="profile__edit-form__container__user-address">
              <div className="profile__edit-form__container__user-address__addresses">
                {userAddressInfoStreet}
              </div>
              <Input
                type="text"
                name="address"
                value={userAddress.address ? userAddress.address : ''}
                onChange={(e) => setUserAddress({ ...userAddress, address: e.target.value })}
                className="profile__edit-form__container__input"
                placeholder={userAddress.address ? userAddress.address : 'Street 1'}
                style={styles}
                admin
                profile
              />
              <Input
                type="text"
                name="city"
                value={userAddress.city ? userAddress.city : ''}
                onChange={(e) => setUserAddress({ ...userAddress, city: e.target.value })}
                className="profile__edit-form__container__input"
                placeholder={userAddress.city ? userAddress.city : 'City'}
                style={styles}
                admin
                profile
              />
              <Input
                type="text"
                name="country"
                value={userAddress.country ? userAddress.country : ''}
                onChange={(e) => setUserAddress({ ...userAddress, country: e.target.value })}
                className="profile__edit-form__container__input"
                placeholder={userAddress.country ? userAddress.country : 'Country'}
                style={styles}
                profile
                admin
              />
              <Input
                type="text"
                name="postalCode"
                value={userAddress.postalCode ? userAddress.postalCode : ''}
                onChange={(e) => setUserAddress({ ...userAddress, postalCode: e.target.value })}
                className="profile__edit-form__container__input"
                placeholder={userAddress.postalCode ? userAddress.postalCode : 'Postal Code'}
                style={styles}
                admin
                profile
              />
              <div className="profile__edit-form__container__user-address__buttons">
                <div
                  className="profile__edit-form__container__user-address__buttons--confirm"
                  onClick={handlerSubmit}
                >
                  Confirm
                </div>
                <div
                  className="profile__edit-form__container__user-address__buttons--cancel"
                  onClick={cancelAddress}
                >
                  Cancel
                </div>
              </div>
            </div>
          </>
        )}

        {/* <button type="submit" className="profile__edit-form__container__button">
          Confirm
        </button> */}
      </form>
      {/* <div className="profile__edit-form__container--cancel" onClick={cancellForm}>
        Cancel
      </div> */}
    </div>
  );
};

export default ProfileAndAddress;

const styles = {
  width: '280px',
  height: '40px',
  fontSize: '18px',
  border: 'none',
  borderRadius: '5px',
  paddingLeft: '15px',
};

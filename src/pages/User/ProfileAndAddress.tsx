import React, { FormEvent } from 'react';
import { UserAddress, UserFromDB } from '../../interfaces/user/UserType';
import { api } from '../../utils/api';
import { toastError, toastSuccess } from '../../utils/toasts';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { addingAddress, updatingAddress } from '../../redux/actions/AddressAction';

type Props = {
  userId: string | undefined;
  address: UserAddress | undefined;
  userEdited: UserFromDB;
  setUserEdited: (userEdited: UserFromDB) => void;
  setEdit: (edit: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSelectedAddress: (address: UserAddress | undefined) => void;
  defaultTab?: 'user' | 'address';
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
  address,
  setLoading,
  setSelectedAddress,
  defaultTab,
}: Props) => {
  const initialOpenData = defaultTab === 'address' ? false : true;
  const [openData, setOpenData] = React.useState(initialOpenData);
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [userAddress, setUserAddress] = React.useState(!address?.id ? initialUserAddress : address);

  const dispatch = useDispatch<AppDispatch>();

  const cancelForm = () => {
    setEdit(false);
    setUserEdited({ ...userEdited, username: '', password: '', phone: '' });
  };

  const cancelAddress = () => {
    setEdit(false);
    setUserAddress(initialUserAddress);
  };

  const sendUserAddress = async () => {
    setLoading(true);
    if (!address?.id) {
      if (!userAddress.address || !userAddress.city || !userAddress.postalCode || !userAddress.country) {
        setLoading(false);
        return toastError("Fields can't be empty");
      }
      const addressData = {
        address: userAddress.address,
        city: userAddress.city,
        country: userAddress.country,
        postalCode: userAddress.postalCode,
        state: userAddress.state,
        user: { id: userId },
      };
      dispatch(addingAddress(addressData));
      toastSuccess('Address added');
      setEdit(false);
    } else {
      const addressToUpdate = {
        id: address.id,
        address: userAddress.address,
        city: userAddress.city,
        postalCode: userAddress.postalCode,
        country: userAddress.country,
        state: userAddress.state,
        user: { id: userId },
      };
      dispatch(updatingAddress(addressToUpdate));
      toastSuccess('Address updated');
      setEdit(false);
      setSelectedAddress(undefined);
    }
    setLoading(false);
  };

  const handlerSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendUserAddress();
  };

  const updateUserInformation = async () => {
    if (userEdited.password !== confirmPassword) {
      return toastError('Password does not match');
    }
    setLoading(true);
    const userToUpdate = {
      id: userId,
      username: userEdited.username,
      firstname: userEdited.firstname,
      email: userEdited.email,
      lastname: userEdited.lastname,
      password: userEdited.password,
      phone: userEdited.phone,
    };
    try {
      const response = await api.put(`/users`, userToUpdate);
      if (response.status === 200) {
        toastSuccess('User updated');
        setEdit(false);
      }
    } catch {
      toastError('Error updating user, try again later');
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Tab toggle */}
      <div className="stride-tabs" style={{ marginBottom: 'var(--space-5)' }}>
        <button
          className={`stride-tab${openData ? ' is-active' : ''}`}
          onClick={() => setOpenData(true)}
          type="button"
        >
          Edit profile
        </button>
        <button
          className={`stride-tab${!openData ? ' is-active' : ''}`}
          onClick={() => setOpenData(false)}
          type="button"
        >
          {address?.id ? 'Edit address' : 'Add address'}
        </button>
      </div>

      {/* ── Edit user data ── */}
      {openData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="stride-field">
              <label>Name</label>
              <input
                className="stride-input"
                type="text"
                value={userEdited?.username ?? ''}
                onChange={(e) => setUserEdited({ ...userEdited, username: e.target.value })}
                placeholder="Username"
              />
            </div>
            <div className="stride-field">
              <label>Email</label>
              <input
                className="stride-input"
                type="email"
                value={userEdited?.email ?? ''}
                readOnly
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="stride-field">
              <label>New password</label>
              <input
                className="stride-input"
                type="password"
                value={userEdited.password ?? ''}
                onChange={(e) => setUserEdited({ ...userEdited, password: e.target.value })}
                placeholder="Leave blank to keep current"
              />
            </div>
            <div className="stride-field">
              <label>Confirm password</label>
              <input
                className="stride-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
              />
            </div>
          </div>
          <div className="stride-field" style={{ maxWidth: 280 }}>
            <label>Phone</label>
            <input
              className="stride-input"
              type="tel"
              value={userEdited.phone ?? ''}
              onChange={(e) => setUserEdited({ ...userEdited, phone: e.target.value })}
              placeholder="+1 555 000 0000"
            />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <button
              className="stride-btn stride-btn--primary"
              type="button"
              onClick={updateUserInformation}
            >
              Save changes
            </button>
            <button
              className="stride-btn stride-btn--ghost"
              type="button"
              onClick={cancelForm}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Add / edit address ── */}
      {!openData && (
        <form onSubmit={handlerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="stride-field">
            <label>Street address</label>
            <input
              className="stride-input"
              type="text"
              value={userAddress.address}
              onChange={(e) => setUserAddress({ ...userAddress, address: e.target.value })}
              placeholder="123 Main St"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="stride-field">
              <label>City</label>
              <input
                className="stride-input"
                type="text"
                value={userAddress.city}
                onChange={(e) => setUserAddress({ ...userAddress, city: e.target.value })}
                placeholder="City"
              />
            </div>
            <div className="stride-field">
              <label>Postal code</label>
              <input
                className="stride-input"
                type="text"
                value={userAddress.postalCode}
                onChange={(e) => setUserAddress({ ...userAddress, postalCode: e.target.value })}
                placeholder="00000"
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="stride-field">
              <label>Country</label>
              <input
                className="stride-input"
                type="text"
                value={userAddress.country}
                onChange={(e) => setUserAddress({ ...userAddress, country: e.target.value })}
                placeholder="Country"
              />
            </div>
            <div className="stride-field">
              <label>State / Province <span style={{ color: 'var(--color-fg-muted)', fontWeight: 400 }}>(optional)</span></label>
              <input
                className="stride-input"
                type="text"
                value={userAddress.state ?? ''}
                onChange={(e) => setUserAddress({ ...userAddress, state: e.target.value })}
                placeholder="State"
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <button
              className="stride-btn stride-btn--primary"
              type="submit"
            >
              {address?.id ? 'Update address' : 'Add address'}
            </button>
            <button
              className="stride-btn stride-btn--ghost"
              type="button"
              onClick={cancelAddress}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileAndAddress;

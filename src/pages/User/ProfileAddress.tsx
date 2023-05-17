import React, { FormEvent } from 'react';
import { UserFromDB } from '../../interfaces/user/UserType';
import { Input } from '../../components/Input/Input';

type Props = {
  userEdited: UserFromDB;
  setUserEdited: (userEdited: UserFromDB) => void;
  setEdit: (edit: boolean) => void;
};

const ProfileForm = ({ userEdited, setUserEdited, setEdit }: Props) => {
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (userEdited.password !== confirmPassword) {
      return alert('Passwords do not match');
    }
    setUserEdited(userEdited);
    setEdit(false);
  };
  const cancellForm = () => {
    setEdit(false);
    setUserEdited({
      ...userEdited,
      username: '',
      password: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
    });
  };
  return (
    <div className="profile__edit-form__container">
      <form onSubmit={handleSubmit}>
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
          type="text"
          name="email"
          value={userEdited?.email}
          className="profile__edit-form__container__input"
          placeholder={userEdited.email}
          style={styles}
          admin
          profile
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
        <Input
          type="text"
          name="address"
          value={userEdited.address ? userEdited.address : ''}
          onChange={(e) => setUserEdited({ ...userEdited, address: e.target.value })}
          className="profile__edit-form__container__input"
          placeholder={userEdited.address ? userEdited.address : 'Street 1'}
          style={styles}
          admin
          profile
        />
        <Input
          type="text"
          name="city"
          value={userEdited.city ? userEdited.city : ''}
          onChange={(e) => setUserEdited({ ...userEdited, city: e.target.value })}
          className="profile__edit-form__container__input"
          placeholder={userEdited.city ? userEdited.city : 'City'}
          style={styles}
          admin
          profile
        />
        <Input
          type="text"
          name="country"
          value={userEdited.country ? userEdited.country : ''}
          onChange={(e) => setUserEdited({ ...userEdited, country: e.target.value })}
          className="profile__edit-form__container__input"
          placeholder={userEdited.country ? userEdited.country : 'Country'}
          style={styles}
          admin
          profile
        />
        <Input
          type="text"
          name="postalCode"
          value={userEdited.postalCode ? userEdited.postalCode : ''}
          onChange={(e) => setUserEdited({ ...userEdited, postalCode: e.target.value })}
          className="profile__edit-form__container__input"
          placeholder={userEdited.postalCode ? userEdited.postalCode : 'Postal Code'}
          style={styles}
          admin
          profile
        />
        <button type="submit" className="profile__edit-form__container__button">
          Confirm
        </button>
      </form>
      <div className="profile__edit-form__container--cancel" onClick={cancellForm}>
        Cancel
      </div>
    </div>
  );
};

export default ProfileForm;

const styles = {
  width: '280px',
  height: '40px',
  fontSize: '18px',
  border: 'none',
  borderRadius: '5px',
  paddingLeft: '15px',
};

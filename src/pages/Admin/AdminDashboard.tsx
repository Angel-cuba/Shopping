import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartRounded, StorageRounded } from '@mui/icons-material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import StoreMallDirectoryRounded from '@mui/icons-material/StoreMallDirectoryRounded';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '../../redux/store';
import { fetchProducts } from '../../redux/actions/ProductActions';
import './styles/AdminDashboard.scss';

type ButtonProps = {
  name: string;
  icon: JSX.Element;
  link: string;
};

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const buttonsLink: ButtonProps[] = [
    {
      name: 'Customers',
      icon: <PeopleAltIcon fontSize="large" />,
      link: '/admin/customers',
    },
    {
      name: 'Products',
      icon: <StoreMallDirectoryRounded fontSize="large" />,
      link: '/admin/products',
    },
    {
      name: 'In stock',
      icon: <StorageRounded fontSize="large" />,
      link: '/admin/createandcheck',
    },
    {
    name: 'Orders',
    icon: <ShoppingCartRounded fontSize="large" />,
    link: '/admin/orders'
    }
  ];
  const Buttons = (link: ButtonProps) => {
    return (
      <Link
        to={link.link}
        className="admin-dashboard__buttons"
        style={{
          textDecoration: 'none',
        }}
      >
        {link.icon}
        <p className="admin-dashboard__buttons--text">{link.name}</p>
      </Link>
    );
  };
  return (
      <div className="admin-dashboard">
        {buttonsLink.map((link) => (
          <Buttons key={link.name} {...link} />
        ))}
      </div>
  );
};

export default AdminDashboard;

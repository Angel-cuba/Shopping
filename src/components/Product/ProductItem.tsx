import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Product } from '../../interfaces/products/ProductType';
import { CartIcon } from '../Cart/Icons';
import { DeleteForever, ModeEdit } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { deleteProductFromStock } from '../../redux/actions/ProductActions';
import CreateAndEdit from '../Admin/CreateAndEdit/CreateAndEdit';

import LikeItem from './component/LikeItem';
import TrashItem from './component/TrashItem';
import { GlobalTheme } from '../../context/ThemeProvider';
import { darkTheme, lightTheme } from '../../styles/styles';

const ProductItem = ({ product }: { product: Product }) => {
  const [openCreateAndEdit, setOpenCreateAndEdit] = React.useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = React.useState(false);
  const [showTrashAnimation, setShowTrashAnimation] = React.useState(false);

  const location = useLocation();
  const { pathname } = location;
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  
  const userRole = JSON.parse(localStorage.getItem('user') || '{}').role;
  const decodedUserRole = JSON.parse(localStorage.getItem('decodedUser') || '{}').role;

  const { theme } = GlobalTheme();

  const handleEdit = () => {
    setOpenCreateAndEdit(!openCreateAndEdit);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteProductFromStock(id));
  };
  const handleLike = () => {
    setShowTrashAnimation(false);
    setShowLikeAnimation(true);
    setTimeout(() => {
      setShowLikeAnimation(false);
    }, 2000);
  };
  const handleTrash = () => {
    setShowLikeAnimation(false);
    setShowTrashAnimation(true);
    setTimeout(() => {
      setShowTrashAnimation(false);
    }, 2000);
  };
  const Animation = () => {
    return (
      <>
        {showLikeAnimation && <LikeItem />}
        {showTrashAnimation && <TrashItem />}
      </>
    );
  };

  return (
    <>
      <div
        key={product.id}
        className="products__content__item"
        style={{
          backgroundColor: theme === 'dark' ? lightTheme.primary : darkTheme.secondary,
          boxShadow: `-1px 0px 2px 2px ${
            theme === 'dark' ? darkTheme.shadow : lightTheme.shadow
          }, inset 0 0 ${theme === 'dark' ? '4px' : '1px'} 0 ${
            theme === 'dark' ? darkTheme.shadowMedium : lightTheme.shadowMedium
          }`,
        }}
      >
        {(userRole || decodedUserRole) === 'ADMIN' && pathname.includes('admin') && (
          <div
            className="products__content__item--admin-icons"
            style={{
              backgroundColor: theme === 'dark' ? darkTheme.bg : lightTheme.bg,
            }}
          >
            <div
              onClick={() => handleEdit()}
              style={{
                backgroundColor: openCreateAndEdit ? 'rgba(23, 108, 0, 0.295)' : 'transparent',
              }}
            >
              <ModeEdit
                className="products__content__item--admin-icons--icon"
                fontSize="large"
                color="success"
              />
            </div>
            <div onClick={() => handleDelete(product.id)}>
              <DeleteForever
                className="products__content__item--admin-icons--icon products__content__item--admin-icons--icon--delete "
                fontSize="large"
                color="error"
              />
            </div>
          </div>
        )}
        {!id && (
          <div className="products__content__item--details">
            <Link
              to={`/product/${product.id}`}
              style={{
                textDecoration: 'none',
                color: darkTheme.textLink,
                display: 'flex',
              }}
            >
              <MoreVertIcon />
              Details
            </Link>
          </div>
        )}
        {Animation()}
        <div
          className="products__content__item--add"
          style={{
            backgroundColor: theme === 'dark' ? darkTheme.bg : lightTheme.bg,
          }}
        >
          <div className="products__content__item--add--icon">
            <CartIcon product={product} handleLike={handleLike} handleTrash={handleTrash} />
          </div>
        </div>
        <div className="products__content__item--image">
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '5px',
              objectFit: 'cover',
              transform: 'rotate(-20deg)',
            }}
          />
        </div>
        {/* TODO: Add inStock */}
        {/* <p>{product.inStock}</p> */}
        <div
          className="products__content__item--info"
          style={{
            color: theme === 'dark' ? lightTheme.textItem : darkTheme.textItem,
          }}
        >
          <h3 className="products__content__item--info--name">{product.name}</h3>
          <p className="products__content__item--info--description">
            {product.description.slice(0, 26)}...
          </p>
          <p className="products__content__item--info--price">£{product.price}</p>
        </div>
        {openCreateAndEdit && (
          <div className="products__content__item--editing-view">
            <CreateAndEdit
              productId={`${product.id}`}
              setOpenCreateAndEdit={setOpenCreateAndEdit}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductItem;

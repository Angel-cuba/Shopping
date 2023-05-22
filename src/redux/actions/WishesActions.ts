import { Dispatch } from 'redux';
import { Wishes } from '../../interfaces/wishes/WishesType';
import {
  ADD_TO_WISHLIST,
  CLEAR_WISHLIST,
  ERROR_WISHES,
  GET_WISHLIST,
  LOADING_WISHES,
  REMOVE_FROM_WISHLIST,
  STOP_LOADING_WISHES,
} from '../../interfaces/wishes/constants';
import { api } from '../../utils/api';

export const getWishes = (wishesList: Wishes) => {
  return {
    type: GET_WISHLIST,
    payload: wishesList,
  } as const;
};

export const addToWishList = (productId: string) => {
  return {
    type: ADD_TO_WISHLIST,
    payload: productId,
  } as const;
};

export const removeFromWishList = (productId: string) => {
  return {
    type: REMOVE_FROM_WISHLIST,
    payload: productId,
  } as const;
};

export const clearWishList = (emptyList: string) => {
  return {
    type: CLEAR_WISHLIST,
  } as const;
};

export const getWishList = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await api.get(`/wishes/user/${id}`);
      dispatch(getWishes(response.data[0]?.userWishes));
    } catch (error) {
      dispatch({ type: ERROR_WISHES, payload: error });
    }
  };
};

export const createWishList = (id: string, userId: string) => {
  return async (dispatch: Dispatch) => {
    const data = {
      userWishes: [id],
      totalOfItems: 1,
      user: {
        id: userId,
      },
    };
    dispatch({ type: LOADING_WISHES });
    try {
      const response = await api.post('/wishes', data);
      dispatch(addToWishList(response.data));
    } catch (error) {
      dispatch({ type: ERROR_WISHES, payload: error });
    }
    dispatch({ type: STOP_LOADING_WISHES });
  };
};

export const addingToWishList = (id: string, userId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: LOADING_WISHES });
    try {
      const checkIfExist = await api.get(`/wishes/user/${userId}`);
      const wishesList = [...checkIfExist.data[0].userWishes, id];
      const dataToUpdate = {
        id: checkIfExist.data[0].id,
        userWishes: wishesList,
        totalOfItems: checkIfExist.data[0].totalOfItems + 1,
        user: {
          id: userId,
        },
      };
      const response = await api.put('/wishes', dataToUpdate);
      dispatch(addToWishList(response.data));
    } catch (error) {
      dispatch({ type: ERROR_WISHES, payload: error });
    }
    dispatch({ type: STOP_LOADING_WISHES });
  };
};

export const removingFromWishList = (id: string, userId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: LOADING_WISHES });
    try {
      const checkIfExist = await api.get(`/wishes/user/${userId}`);
      const wishesList = checkIfExist.data[0].userWishes.filter((wish: string) => wish !== id);
      const dataToUpdate = {
        id: checkIfExist.data[0].id,
        userWishes: wishesList,
        totalOfItems: checkIfExist.data[0].totalOfItems - 1,
        user: {
          id: userId,
        },
      };
      const response = await api.put('/wishes', dataToUpdate);
      dispatch(removeFromWishList(response.data));
    } catch (error) {
      dispatch({ type: ERROR_WISHES, payload: error });
    }
    dispatch({ type: STOP_LOADING_WISHES });
  };
};

export const deleteWishList = (userId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: LOADING_WISHES });
    try {
      const checkIfExist = await api.get(`/wishes/user/${userId}`);
      if (checkIfExist.status === 200) {
        const response = await api.delete(`/wishes/${checkIfExist.data[0].id}`);
        dispatch(clearWishList(response.data));
      }
    } catch (error) {
      dispatch({ type: ERROR_WISHES, payload: error });
    }
    dispatch({ type: STOP_LOADING_WISHES });
  };
};

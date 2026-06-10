import { Dispatch } from 'redux';
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

export const getWishes = (wishesList: string[]) => {
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
      dispatch(getWishes(response.data[0]?.userWishes ?? []));
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
      user: { id: userId },
    };
    dispatch({ type: LOADING_WISHES });
    try {
      const response = await api.post('/wishes', data);
      dispatch({ type: ADD_TO_WISHLIST, payload: response.data });
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
      const existing = checkIfExist.data?.[0];

      if (!existing) {
        // No wishlist record yet — create one
        const data = { userWishes: [id], totalOfItems: 1, user: { id: userId } };
        const response = await api.post('/wishes', data);
        dispatch({ type: ADD_TO_WISHLIST, payload: response.data });
      } else {
        const wishesList = [...existing.userWishes, id];
        const dataToUpdate = {
          id: existing.id,
          userWishes: wishesList,
          totalOfItems: existing.totalOfItems + 1,
          user: { id: userId },
        };
        const response = await api.put('/wishes', dataToUpdate);
        dispatch({ type: ADD_TO_WISHLIST, payload: response.data });
      }
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
      const existing = checkIfExist.data?.[0];
      if (!existing) {
        dispatch({ type: STOP_LOADING_WISHES });
        return;
      }
      const wishesList = (existing.userWishes ?? []).filter((wish: string) => wish !== id);
      const dataToUpdate = {
        id: existing.id,
        userWishes: wishesList,
        totalOfItems: Math.max(0, (existing.totalOfItems ?? 1) - 1),
        user: { id: userId },
      };
      const response = await api.put('/wishes', dataToUpdate);
      dispatch({ type: REMOVE_FROM_WISHLIST, payload: response.data });
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
      const existing = checkIfExist.data?.[0];
      if (existing?.id) {
        await api.delete(`/wishes/${existing.id}`);
        dispatch(clearWishList(''));
      }
    } catch (error) {
      dispatch({ type: ERROR_WISHES, payload: error });
    }
    dispatch({ type: STOP_LOADING_WISHES });
  };
};

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

const toErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message?: unknown }).message ?? 'Wishlist request failed');
  }
  return 'Wishlist request failed';
};

const getWishes = (wishesList: string[]) => ({
  type: GET_WISHLIST,
  payload: wishesList,
} as const);

export const clearWishList = () => ({ type: CLEAR_WISHLIST } as const);

export const getWishList = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await api.get(`/wishes/user/${id}`);
      dispatch(getWishes(response.data[0]?.userWishes ?? []));
    } catch (error) {
      dispatch({ type: ERROR_WISHES, payload: toErrorMessage(error) });
    }
  };
};

export const addingToWishList = (id: string, userId: string) => {
  return async (dispatch: Dispatch) => {
    // Optimistic update — UI responds immediately regardless of API response shape
    dispatch({ type: ADD_TO_WISHLIST, payload: id });
    dispatch({ type: LOADING_WISHES });
    try {
      const checkIfExist = await api.get(`/wishes/user/${userId}`);
      const existing = checkIfExist.data?.[0];

      if (!existing) {
        const data = { userWishes: [id], totalOfItems: 1, user: { id: userId } };
        await api.post('/wishes', data);
      } else {
        const currentWishes: string[] = existing.userWishes ?? [];
        const wishesList = currentWishes.includes(id) ? currentWishes : [...currentWishes, id];
        const dataToUpdate = {
          id: existing.id,
          userWishes: wishesList,
          totalOfItems: wishesList.length,
          user: { id: userId },
        };
        await api.put('/wishes', dataToUpdate);
      }
    } catch (error) {
      // Revert optimistic update on failure
      dispatch({ type: REMOVE_FROM_WISHLIST, payload: id });
      dispatch({ type: ERROR_WISHES, payload: toErrorMessage(error) });
    } finally {
      dispatch({ type: STOP_LOADING_WISHES });
    }
  };
};

export const removingFromWishList = (id: string, userId: string) => {
  return async (dispatch: Dispatch) => {
    // Optimistic update — UI responds immediately
    dispatch({ type: REMOVE_FROM_WISHLIST, payload: id });
    dispatch({ type: LOADING_WISHES });
    try {
      const checkIfExist = await api.get(`/wishes/user/${userId}`);
      const existing = checkIfExist.data?.[0];
      if (!existing) return;
      const wishesList = (existing.userWishes ?? []).filter((wish: string) => wish !== id);
      const dataToUpdate = {
        id: existing.id,
        userWishes: wishesList,
        totalOfItems: wishesList.length,
        user: { id: userId },
      };
      await api.put('/wishes', dataToUpdate);
    } catch (error) {
      // Revert optimistic update on failure
      dispatch({ type: ADD_TO_WISHLIST, payload: id });
      dispatch({ type: ERROR_WISHES, payload: toErrorMessage(error) });
    } finally {
      dispatch({ type: STOP_LOADING_WISHES });
    }
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
        dispatch(clearWishList());
      }
    } catch (error) {
      dispatch({ type: ERROR_WISHES, payload: toErrorMessage(error) });
    }
    dispatch({ type: STOP_LOADING_WISHES });
  };
};

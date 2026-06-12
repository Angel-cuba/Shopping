import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { AppDispatch } from '../store';
import { DecodedUser } from '../src/interfaces/user/constants';
import { logged } from '../src/redux/actions/UserAction';
import { getWishList } from '../src/redux/actions/WishesActions';
import { fetchingAddresses } from '../src/redux/actions/AddressAction';
import { fetchingPayments } from '../src/redux/actions/PaymentAction';

export const useBootstrap = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    (async () => {
      const raw = await SecureStore.getItemAsync('decodedUser');
      if (!raw) return;
      const parsed: DecodedUser = JSON.parse(raw);
      dispatch(logged(parsed));
      dispatch(getWishList(parsed.user_id));
      dispatch(fetchingAddresses(parsed.user_id));
      dispatch(fetchingPayments(parsed.user_id));
    })();
  }, [dispatch]);
};

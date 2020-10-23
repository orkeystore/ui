import { Store } from '@reduxjs/toolkit';
import { IStore } from 'src/reducer';
import { AppDispatch } from 'src/store';
import { actions as sessionActions } from './reducer';

export const ssrSessionUserData = async (
  store: Store<IStore>,
  token: string | undefined,
) => {
  const dispatch = store.dispatch as AppDispatch;
  return dispatch(sessionActions.fetchMe(token));
};

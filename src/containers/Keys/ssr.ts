import { IStore } from 'src/reducer';
import { keysPagerSelector, keysSearchSelector } from './selectors';
import { actions as keysActions } from './reducer';
import { Store } from '@reduxjs/toolkit';
import { AppDispatch } from 'src/store';

export const ssrKeysFetchList = async (
  store: Store<IStore>,
  isArchived: boolean,
) => {
  const state = store.getState();
  const dispatch = store.dispatch as AppDispatch;

  const pager = keysPagerSelector(state);
  const search = keysSearchSelector(state);

  return dispatch(
    keysActions.fetchKeysList({
      page: pager.page,
      perPage: pager.perPage,
      search,
      isArchived,
    }),
  );
};

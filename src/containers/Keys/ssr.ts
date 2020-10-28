import { ParsedUrlQuery } from 'querystring';
import { Store } from '@reduxjs/toolkit';
import { IStore } from 'src/reducer';
import { AppDispatch } from 'src/store';
import { keysPagerSelector, keysSearchSelector } from './selectors';
import { actions as keysActions } from './reducer';

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

export const ssrRouteParserKeys = (store: Store<IStore>, query: ParsedUrlQuery) => {
  const dispatch = store.dispatch as AppDispatch;

  const params = query;

  ['page', 'perPage'].forEach((prop) => {
    const val = params[prop];
    if (val !== undefined) {
      const result = parseInt(val.toString());
      if (!isNaN(result)) {
        dispatch(keysActions.changePager(params));
      }
    }
  });
  if (params.search && typeof params.search === 'string') {
    dispatch(keysActions.changeSearch({ search: params.search }));
  }
  if (params.newEntry) {
    dispatch(keysActions.toggleEditModal({ isOpened: true }));
  }
};

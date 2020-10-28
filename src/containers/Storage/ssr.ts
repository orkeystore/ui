import { Store } from '@reduxjs/toolkit';
import { IApiParamsKeysStorage } from 'libs/api/keys/storage';
import { ParsedUrlQuery } from 'querystring';
import { IStore } from 'src/reducer';
import { AppDispatch } from 'src/store';
import { actions as storageActions } from './reducer';
import * as storageSelectors from './selectors';

export const ssrStorageFetchItems = async (store: Store<IStore>) => {
  const dispatch = store.dispatch as AppDispatch;
  const state = store.getState();
  const storagePager = storageSelectors.storagePager(state);
  const storageFilter = storageSelectors.storageFilter(state);

  const params: IApiParamsKeysStorage = {
    page: storagePager.page,
    perPage: storagePager.perPage,
    search: storageFilter.entryName,
  };

  return dispatch(storageActions.fetchStorageItems(params));
};


export const ssrRouteParserStorage = (store: Store<IStore>, query: ParsedUrlQuery) => {
  const dispatch = store.dispatch as AppDispatch;

  const params = query;

  ['page', 'perPage'].forEach((prop) => {
    const val = params[prop];
    if (val !== undefined) {
      const result = parseInt(val.toString());
      if (!isNaN(result)) {
        dispatch(storageActions.changePager(params));
      }
    }
  });

  if (params.search && typeof params.search === 'string') {
    dispatch(storageActions.changeFilter({ entryName: params.search }));
  }
};

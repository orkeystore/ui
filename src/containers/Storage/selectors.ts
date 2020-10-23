import { createSelector } from 'reselect';
import { IStore } from 'src/reducer';
import { IStoreStorage } from './types';

export const containerState = (state: IStore): IStoreStorage => state.storage;
export const storageItems = createSelector(containerState, (state) => state.items);
export const storagePager = createSelector(containerState, (state) => state.pager);
export const storageFilter = createSelector(containerState, (state) => state.filter);
export const loadingSelector = createSelector(containerState, (state) => state.loading);
export const storagePagerOptions = createSelector(containerState, (state) => state.pagerOptions);
export const initialSelector = createSelector(containerState, (state) => state.initial);

export const isEmptySelector = createSelector(
  storageFilter,
  storageItems,
  loadingSelector,
  (filter, items, loading) => {
    const { entryName } = filter;
    return (!entryName || entryName.length === 0) && !loading && items.length === 0;
  },
);

export const storageRequestSelector = createSelector(containerState, (state) => {
  return {
    initiated: state.initial,
    loading: state.loading,
    error: state.error,
    data: {
      items: state.items,
      pager: state.pager,
    },
  };
});

import { createSelector } from 'reselect';
import { IStore } from 'src/reducer';
import { IStoreKeys } from './types';

export const containerState = (state: IStore): IStoreKeys => state.keys;
export const keysItemsSelector = createSelector(containerState, (state) => state.list.items);
export const keysListSelector = createSelector(containerState, (state) => state.list);
export const keysPagerSelector = createSelector(containerState, (state) => state.list.pager);
export const keysSearchSelector = createSelector(containerState, (state) => state.list.query);
export const initialSelector = createSelector(containerState, (state) => state.initial);
export const isRouteParsedSelector = createSelector(containerState, (state) => state.isRouteParsed);

export const isEditModalOpened = createSelector(
  containerState,
  (state) => state.edit.isModalOpened,
);

export const keysPagerOptionsSelector = createSelector(
  containerState,
  (state) => state.list.pagerOptions,
);

export const isKeyListEmpty = createSelector(
  keysSearchSelector,
  keysListSelector,
  (search, list) => {
    return (!search || search.length === 0) && !list.loading.keys && list.items.length === 0;
  },
);

export const keysRequestSelector = createSelector(keysListSelector, (list) => {
  return {
    loading: list.loading.keys,
    error: list.errors.keys,
    data: {
      items: list.items,
    },
    pager: list.pager,
  };
});

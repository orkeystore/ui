import { createSelector } from 'reselect';
import { IStore } from 'src/reducer';
import { IStoreRepos } from './types';

export const containerState = (state: IStore): IStoreRepos => state.repos;
export const createFetchSelector = createSelector(containerState, (state) => state.create);
export const reposListSelector = createSelector(containerState, (state) => state.list);
export const pagerSelector = createSelector(reposListSelector, (list) => list.pager);
export const searchSelector = createSelector(reposListSelector, (list) => list.search);
export const pagerOptionsSelector = createSelector(reposListSelector, (list) => list.pagerOptions);
export const initialSelector = createSelector(reposListSelector, (list) => list.initial);

export const isEditModalOpened = createSelector(containerState, (state) =>
  Boolean(state.isEditModalOpened),
);

export const isEmptySelector = createSelector(reposListSelector, (list) => {
  const { search, loading, items } = list;
  return (!search || search.length === 0) && !loading && items.length === 0;
});

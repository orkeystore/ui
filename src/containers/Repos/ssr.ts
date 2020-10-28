import { Store } from '@reduxjs/toolkit';
import { IApiParamsReposList } from 'libs/api/repos/list';
import { ParsedUrlQuery } from 'querystring';
import { IStore } from 'src/reducer';
import { AppDispatch } from 'src/store';
import { actions as reposActions } from './reducer';
import * as reposSelectors from './selectors';

export const ssrReposFetchList = async (store: Store<IStore>) => {
  const state = store.getState();
  const dispatch = store.dispatch as AppDispatch;
  const pager = reposSelectors.pagerSelector(state);
  const search = reposSelectors.searchSelector(state);

  const params: IApiParamsReposList = {
    page: pager.page,
    perPage: pager.perPage,
    search,
  };

  return dispatch(reposActions.fetchListRepo(params));
};

export const ssrRouteParserRepos = (store: Store<IStore>, query: ParsedUrlQuery) => {
  const dispatch = store.dispatch as AppDispatch;

  const params = query;

  ['page', 'perPage'].forEach((prop) => {
    const val = params[prop];
    if (val !== undefined) {
      const result = parseInt(val.toString());
      if (!isNaN(result)) {
        dispatch(reposActions.changePager(params));
      }
    }
  });
  if (params.search && typeof params.search === 'string') {
    dispatch(reposActions.changeSearch({ search: params.search }));
  }
  if (params.editRepoModal) {
    dispatch(reposActions.toggleEditModal({ isOpened: true }));
  }
};

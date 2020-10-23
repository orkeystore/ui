import { Store } from '@reduxjs/toolkit';
import { IApiParamsReposList } from 'libs/api/repos/list';
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

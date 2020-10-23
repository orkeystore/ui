/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fork, put, select, takeEvery } from 'redux-saga/effects';
import { IApiPager } from 'libs/api/types';
import { actions as reposActions } from './reducer';
import * as reposSelectors from './selectors';

export function* sagaRepos() {
  yield fork(reloadReposListAfterCreationOrDeletion);
}

function* reloadReposListAfterCreationOrDeletion() {
  yield takeEvery(
    [reposActions.fetchCreateRepo.fulfilled, reposActions.fetchRemoveRepos.fulfilled],
    function* (action) {
      const pager: IApiPager = yield select(reposSelectors.pagerSelector);
      const search: string = yield select(reposSelectors.searchSelector);
      const isCreation = action.type === reposActions.fetchCreateRepo.fulfilled.toString();
      const fetchParams = { page: pager.page, perPage: pager.perPage, search };

      if (isCreation && pager.totalItems) {
        const newPage = Math.ceil(pager.totalItems + 1 / pager.perPage);
        yield put(reposActions.changePager({ page: newPage }))
      } else {
        yield put<any>(reposActions.fetchListRepo(fetchParams));
      }
    },
  );
}

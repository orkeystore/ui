/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fork, put, select, takeEvery } from 'redux-saga/effects';
import { IApiParamsKeysList } from 'libs/api/keys/list';
import { IApiPager } from 'libs/api/types';
import { actions as keysActions } from './reducer';
import { keysPagerSelector } from './selectors';

export function* sagaKeys() {
  yield fork(reloadKeysList);
}

function* reloadKeysList() {
  yield takeEvery(
    [
      keysActions.fetchCreateKey.fulfilled,
      keysActions.fetchRemoveKeyItem.fulfilled,
      keysActions.fetchArchiveKeyItem.fulfilled,
      keysActions.fetchRestoreKeyItem.fulfilled,
    ],
    function* (action) {
      const pager: IApiPager = yield select(keysPagerSelector);
      const isArchived = [
        keysActions.fetchRestoreKeyItem.fulfilled.toString(),
        keysActions.fetchRemoveKeyItem.fulfilled.toString(),
      ].includes(action.type);

      const fetchParams: IApiParamsKeysList = {
        page: pager.page,
        perPage: pager.perPage,
        isArchived,
      };

      if (pager.totalItems) {
        const targetPage = Math.max(Math.ceil(pager.totalItems / pager.perPage), 1);

        if (targetPage < pager.page) {
          yield put(keysActions.changePager({ page: targetPage }));
        } else {
          yield put<any>(keysActions.fetchKeysList(fetchParams));
        }
      } else {
        yield put<any>(keysActions.fetchKeysList(fetchParams));
      }
    },
  );
}

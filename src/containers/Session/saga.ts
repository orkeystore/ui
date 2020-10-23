import { fork, takeEvery, put, ForkEffect } from 'redux-saga/effects';
import { actions } from './reducer';

export function* sagaSession(): IterableIterator<ForkEffect<void>> {
  yield fork(menuUpdate);
}

function* menuUpdate() {
  yield takeEvery([
    actions.fetchLoginUser.fulfilled,
    actions.fetchMe.fulfilled,
  ], function* () {
    yield put(actions.defineMenuLinks());
  });
}

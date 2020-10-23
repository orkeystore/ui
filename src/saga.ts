import { fork, ForkEffect } from 'redux-saga/effects';

import { sagaSession } from 'src/containers/Session/saga';
import { sagaKeys } from 'src/containers/Keys/saga';
import { sagaRepos } from 'src/containers/Repos/saga';

export default function* mainSaga(): IterableIterator<ForkEffect<void>> {
  yield fork(sagaSession);
  yield fork(sagaKeys);
  yield fork(sagaRepos);
}

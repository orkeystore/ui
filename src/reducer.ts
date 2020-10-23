import { combineReducers } from 'redux';
import { reducer as sessionReducer } from 'src/containers/Session/reducer';
import { reducer as accountsReducer } from 'src/containers/Accounts/reducer';
import { reducer as reposReducer } from 'src/containers/Repos/reducer';
import { reducer as storageReducer } from 'src/containers/Storage/reducer';
import { reducer as keysReducer } from 'src/containers/Keys/reducer';
import { reducer as keyPreviewReducer } from 'src/containers/KeyPreview/reducer';

const reducers = {
  session: sessionReducer,
  keys: keysReducer,
  accounts: accountsReducer,
  repos: reposReducer,
  storage: storageReducer,
  keyPreview: keyPreviewReducer,
}

const rootReducer = combineReducers(reducers);

export type IStore = ReturnType<typeof rootReducer>;

export default rootReducer;

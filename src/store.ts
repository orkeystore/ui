import { createStore, applyMiddleware, Middleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import rootReducer, { IStore } from './reducer';
import rootSaga from './saga';
import { useDispatch } from 'react-redux';
import {
  ThunkDispatch,
  AnyAction,
  PayloadAction,
  SerializedError,
  Store,
} from '@reduxjs/toolkit';
import { IS_DEV } from './constants/settings';
import fetcher from 'libs/utils/fetch';
import { useMemo } from 'react';

export let store: Store<IStore> | undefined;

export interface IStoreInitOptions {
  useLogger?: boolean;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function initStore(initialState?: IStore, opts: IStoreInitOptions = {}) {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const sagaMiddleware = createSagaMiddleware();
  const middleware: Middleware[] = [thunk, sagaMiddleware];

  if (IS_DEV && opts.useLogger) {
    middleware.push(createLogger({ collapsed: true }));
  }

  // ======================================================
  // Enhancer Configuration
  // ======================================================
  const enhancer = applyMiddleware(...middleware);

  // ======================================================
  // Store Instantiation
  // ======================================================
  const result = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(enhancer),
  );

  sagaMiddleware.run(rootSaga);

  return result;
}

export function useStore(initialState?: IStore) {
  const store = useMemo(() => {
    const store = initializeStore(initialState);
    const token = store.getState().session.token;

    if (token) {
      fetcher.setHeader(`Authorization`, `Bearer ${token}`);
    } else {
      fetcher.removeHeader(`Authorization`);
    }

    return store;
  }, [initialState]);
  return store;
}

export const initializeStore = (preloadedState?: IStore) => {
  let _store = store ?? initStore(preloadedState);

  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}

export type AppDispatch = ThunkDispatch<IStore, void, AnyAction>;
export const useAppDispatch = (): AppDispatch => useDispatch();

export type IDispatchReturn<R, P> =
  | { error: SerializedError }
  | PayloadAction<
      R,
      string,
      {
        arg: P;
        requestId: string;
      },
      never
    >;

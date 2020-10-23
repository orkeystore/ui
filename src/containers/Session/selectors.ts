import { createSelector } from 'reselect';
import { IStore } from 'src/reducer';
import { IStoreSession } from './types';

export const containerState = (state: IStore): IStoreSession => state.session;
export const isUserAuthorized = createSelector(containerState, (state) => state.isUserAuthorized);
export const isAlreadyFetched = createSelector(containerState, (state) => state.isAlreadyFetched);
export const isSessionExpired = createSelector(containerState, (state) => state.isSessionExpired);
export const account = createSelector(containerState, (state) => state.account);
export const host = createSelector(containerState, (state) => state.host);
export const mainMenuLinks = createSelector(containerState, (state) => state.mainMenuLinks);
export const errors = createSelector(containerState, (state) => state.errors);
export const jwt = createSelector(containerState, (state) => state.token || null);
export const tokenSelector = createSelector(containerState, (state) => state.token || null);
export const privateHostSelector = createSelector(containerState, (state) => state.privateHost);
export const publicHostSelector = createSelector(containerState, (state) =>
  state.publicHost ? state.publicHost : state.privateHost,
);

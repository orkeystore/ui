import { createSelector } from 'reselect';
import { IStore } from 'src/reducer';
import { IStoreAccounts } from './types';

export const containerState = (state: IStore): IStoreAccounts => state.accounts;
export const createFetchSelector = createSelector(containerState, (state) => state.create);
export const accountsListSelector = createSelector(containerState, (state) => state.list);

import { createSelector } from 'reselect';
import { IStore } from 'src/reducer';
import { IStoreKeyPreview } from './types';

export const containerState = (state: IStore): IStoreKeyPreview => state.keyPreview;
export const modal = createSelector(containerState, (state) => state.modal);
export const details = createSelector(containerState, (state) => state.details);
export const params = createSelector(containerState, (state) => state.params);
export const availFormats = createSelector(containerState, (state) => state.availFormats);
export const availPrivacy = createSelector(containerState, (state) => state.availPrivacy);

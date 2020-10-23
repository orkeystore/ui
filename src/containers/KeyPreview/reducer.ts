import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from 'libs/api';
import { IApiParamsKeysPreview, IApiResultKeysPreview } from 'libs/api/keys/preview';
import { AVAIL_PREVIEW_FORMATS, AVAIL_PRIVACY } from './constants';
import { IStoreKeyPreview } from './types';

type S = IStoreKeyPreview;
type PA<T> = PayloadAction<T>;
const prefix = 'KEY_PREVIEW';

/** Sync logic */
const reducers = {
  toggleModal: (state: S, action: PA<{ isOpen?: boolean }>): S => {
    const { isOpen } = action.payload;

    return {
      ...state,
      modal: {
        ...state.modal,
        isOpen: isOpen === undefined ? !state.modal.isOpen : isOpen,
      },
    };
  },
  setParams: (state: S, action: PA<Partial<S['params']>>): S => {
    return {
      ...state,
      params: {
        ...state.params,
        ...action.payload,
      }
    };
  },
};

/** Async logic */
const fetchKeyPreview = createAsyncThunk(
  `${prefix}/FETCH_KEY`,
  async (params: IApiParamsKeysPreview, _thunkApi): Promise<IApiResultKeysPreview> => {
    const result = await api.keys.preview(params);
    return result;
  },
);

/** Combine slice reducer and actions set */
const set = createSlice<S, typeof reducers, string>({
  initialState: {
    availFormats: AVAIL_PREVIEW_FORMATS,
    availPrivacy: AVAIL_PRIVACY,
    params: {},
    modal: {},
    details: {
      error: null,
      loading: false,
    },
  },
  name: prefix,
  reducers,
  extraReducers: (builder) => {
    builder.addCase(fetchKeyPreview.fulfilled, (state, action) => {
      return {
        ...state,
        details: {
          ...state.details,
          error: null,
          loading: false,
          data: action.payload,
        },
      };
    });
  },
});

export const actions = {
  ...set.actions,
  fetchKeyPreview,
};

export const { reducer } = set;

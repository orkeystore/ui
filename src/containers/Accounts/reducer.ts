import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'libs/api';
import { IStoreAccounts } from './types';
import {
  IApiParamsAuthAccount,
  IApiResultAuthAccount,
  IApiResultAuthAccounts,
  IApiResultAuthRemove,
  IApiParamsAuthRemove,
} from 'libs/api/auth/types';

type S = IStoreAccounts;
type PA<T> = PayloadAction<T>;
const prefix = 'ACCOUNTS';

/** Sync logic */
const reducers = {
  test: (state: S, _action: PA<number>): S => {
    return state;
  },
};

/** Async logic */
const fetchCreateAccount = createAsyncThunk(
  `${prefix}/SUBMIT_ACCOUNT`,
  async (params: IApiParamsAuthAccount, thunkApi): Promise<IApiResultAuthAccount | null> => {
    const result = await api.auth.account(params);
    await thunkApi.dispatch(fetchAccountsList());
    return result;
  },
);

const fetchRemoveAccounts = createAsyncThunk(
  `${prefix}/REMOVE_ACCOUNTS`,
  async (params: IApiParamsAuthRemove, thunkApi): Promise<IApiResultAuthRemove | null> => {
    const result = await api.auth.remove(params);
    await thunkApi.dispatch(fetchAccountsList());
    return result;
  },
);

const fetchAccountsList = createAsyncThunk(
  `${prefix}/FETCH_LIST`,
  async (): Promise<IApiResultAuthAccounts> => {
    const result = await api.auth.accounts();
    return result;
  },
);

/** Combine slice reducer asnd actions set */
const set = createSlice<S, typeof reducers, string>({
  initialState: {
    create: {
      error: null,
      loading: false,
    },
    list: {
      error: null,
      loading: false,
      accounts: [],
    },
  },
  name: prefix,
  reducers,
  extraReducers: (builder) => {
    builder.addCase(fetchCreateAccount.fulfilled, (state, action) => {
      if (action.payload === null) {
        return { ...state, create: { ...state.create, error: true, loading: false } };
      }
      return { ...state, error: null, loading: false };
    });
    builder.addCase(fetchAccountsList.fulfilled, (state, action) => {
      if (action.payload === null) {
        return { ...state, list: { ...state.list, error: true, loading: false, accounts: [] } };
      }

      const { accounts } = action.payload;

      return { ...state, list: { ...state.list, error: null, loading: false, accounts } };
    });
  },
});

export const actions = {
  ...set.actions,
  fetchCreateAccount,
  fetchAccountsList,
  fetchRemoveAccounts,
};

export const { reducer } = set;

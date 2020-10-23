import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { IStoreStorage } from './types';
import api from 'libs/api';
import { IApiParamsKeysStorage, IApiResultKeysStorage } from 'libs/api/keys/storage';
import { IApiPager } from 'libs/api/types';

type S = IStoreStorage;
type PA<T> = PayloadAction<T>;

const prefix = 'STORAGE';

const pureState: S = {
  loading: true,
  initial: true,
  error: null,
  items: [],
  pager: {
    page: 1,
    perPage: 10,
  },
  pagerOptions: [10, 25, 50],
  filter: {},
};

/** Sync logic */
const reducers = {
  resetState: () => pureState,
  changePager: (state: S, action: PA<Partial<IApiPager>>): S => {
    return {
      ...state,
      pager: {
        ...state.pager,
        ...action.payload,
      },
    };
  },
  changeFilter: (state: S, action: PA<Partial<Partial<S['filter']>>>): S => {
    return {
      ...state,
      loading: action.payload.entryName !== state.filter.entryName,
      pager: {
        ...state.pager,
        page: 1,
      },
      filter: {
        ...state.filter,
        ...action.payload,
      },
    };
  },
};

/** Async logic */
const fetchStorageItems = createAsyncThunk(
  `${prefix}/FETCH_STORAGE`,
  async (params: IApiParamsKeysStorage): Promise<IApiResultKeysStorage> => {
    return await api.keys.storage(params);
  },
);

/** Combine slice reducer asnd actions set */
const set = createSlice<S, typeof reducers, string>({
  initialState: pureState,
  name: prefix,
  reducers,
  extraReducers: (builder) => {
    builder.addCase(fetchStorageItems.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });

    builder.addCase(fetchStorageItems.fulfilled, (state, action) => {
      const { items, pager } = action.payload;

      return {
        ...state,
        initial: false,
        loading: false,
        items,
        pager,
      };
    });
  },
});

export const actions = {
  ...set.actions,
  fetchStorageItems,
};

export const { reducer } = set;

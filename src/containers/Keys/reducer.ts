import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'libs/api';
import { IStoreKeys } from './types';
import {
  IApiResultKeysRemove,
  IApiParamsKeysRemove,
  IApiParamsKeysCreate,
  IApiResultKeysCreate,
} from 'libs/api/keys/types';
import { IApiParamsKeysArchive, IApiResultKeysArchive } from 'libs/api/keys/archive';
import { IApiParamsKeysRestore, IApiResultKeysRestore } from 'libs/api/keys/restore';
import { IApiParamsKeysList, IApiResultKeysList } from 'libs/api/keys/list';
import { IApiPager } from 'libs/api/types';
import { DEFAULT_PAGE_OPTIONS } from 'src/constants/pager';

type S = IStoreKeys;
type PA<T> = PayloadAction<T>;
const prefix = 'KEYS';

export const pureState: S = {
  initial: {
    keys: true,
    archive: true,
  },
  list: {
    loading: {
      keys: true,
      archive: true,
    },
    errors: {
      keys: null,
    },
    items: [],
    pager: {
      page: 1,
      perPage: 4,
    },
    pagerOptions: DEFAULT_PAGE_OPTIONS,
  },
  edit: {
    isModalOpened: false,
    loading: false,
    error: null,
  },
};

/** Sync logic */
const reducers = {
  changePager: (state: S, action: PA<Partial<IApiPager>>): S => {
    return {
      ...state,
      list: {
        ...state.list,
        pager: {
          ...state.list.pager,
          ...action.payload,
        },
      },
    };
  },
  toggleEditModal: (state: S, action: PA<{ isOpened: boolean }>): S => {
    return {
      ...state,
      edit: {
        ...state.edit,
        isModalOpened: action.payload.isOpened,
      },
    };
  },
  changeSearch: (state: S, action: PA<Partial<{ search?: string }>>): S => {
    return {
      ...state,
      list: {
        ...state.list,
        loading: {
          ...state.list.loading,
          keys: action.payload.search !== state.list.query,
        },
        query: action.payload.search,
        pager: {
          ...state.list.pager,
          page: 1,
        },
      },
    };
  },
  setInitialRouteParsing: (state: S, action: PA<{ isParsed: boolean }>): S => {
    return {
      ...state,
      isRouteParsed: action.payload.isParsed,
    };
  },
  reset: () => pureState,
};

/** Async logic */
const fetchCreateKey = createAsyncThunk(
  `${prefix}/SUBMIT_KEY`,
  async (params: IApiParamsKeysCreate): Promise<IApiResultKeysCreate> => {
    const result = await api.keys.create(params);
    // await thunkApi.dispatch(listActions.fetchKeysList());
    return result;
  },
);

const fetchKeysList = createAsyncThunk(
  `${prefix}/FETCH_KEYS`,
  async (params: IApiParamsKeysList): Promise<IApiResultKeysList> => {
    return await api.keys.list(params);
  },
);

const fetchRemoveKeyItem = createAsyncThunk(
  `${prefix}/REMOVE_KEY`,
  async (params: IApiParamsKeysRemove): Promise<IApiResultKeysRemove> => {
    const result = await api.keys.remove(params);
    return result ? result : { deleted: [] };
  },
);

const fetchArchiveKeyItem = createAsyncThunk(
  `${prefix}/ARCHIVE_KEY`,
  async (params: IApiParamsKeysArchive): Promise<IApiResultKeysArchive> => {
    return await api.keys.archive(params);
  },
);

const fetchRestoreKeyItem = createAsyncThunk(
  `${prefix}/RESTORE_KEY`,
  async (params: IApiParamsKeysRestore): Promise<IApiResultKeysRestore> => {
    return await api.keys.restore(params);
  },
);

/** Combine slice reducer asnd actions set */
const set = createSlice<S, typeof reducers, string>({
  initialState: pureState,
  name: prefix,
  reducers,
  extraReducers: (builder) => {
    builder.addCase(
      fetchKeysList.pending,
      (state): S => {
        return {
          ...state,
          list: { ...state.list, loading: { ...state.list.loading, keys: true } },
        };
      },
    );
    builder.addCase(
      fetchKeysList.fulfilled,
      (state, action): S => {
        const { items, pager } = action.payload;
        const { arg } = action.meta;
        const targetInitial = arg.isArchived ? 'archive' : 'keys';

        return {
          ...state,
          initial: {
            ...state.initial,
            [targetInitial]: false,
          },
          list: { ...state.list, items, pager, loading: { ...state.list.loading, keys: false } },
        };
      },
    );

    builder.addCase(
      fetchRemoveKeyItem.fulfilled,
      (state, action): S => {
        const { id } = action.meta.arg;
        const { totalItems } = state.list.pager;

        return {
          ...state,
          list: {
            ...state.list,
            items: state.list.items.filter((item) => id !== item.id),
            pager: { ...state.list.pager, totalItems: totalItems ? totalItems - 1 : undefined },
          },
        };
      },
    );

    builder.addCase(
      fetchArchiveKeyItem.fulfilled,
      (state): S => {
        const { totalItems } = state.list.pager;

        return {
          ...state,
          list: {
            ...state.list,
            pager: { ...state.list.pager, totalItems: totalItems ? totalItems - 1 : undefined },
          },
        };
      },
    );

    builder.addCase(
      fetchRestoreKeyItem.fulfilled,
      (state): S => {
        const { totalItems } = state.list.pager;

        return {
          ...state,
          list: {
            ...state.list,
            pager: { ...state.list.pager, totalItems: totalItems ? totalItems - 1 : undefined },
          },
        };
      },
    );

    builder.addCase(
      fetchCreateKey.fulfilled,
      (state, action): S => {
        const { totalItems } = state.list.pager;
        return {
          ...state,
          list: {
            ...state.list,
            pager: {
              ...state.list.pager,
              totalItems: totalItems ? totalItems + 1 : undefined,
            },
          },
          edit: { ...state.edit, error: null, loading: false, item: action.payload.key },
        };
      },
    );
  },
});

export const actions = {
  ...set.actions,
  fetchKeysList,
  fetchRemoveKeyItem,
  fetchArchiveKeyItem,
  fetchRestoreKeyItem,
  fetchCreateKey,
};

export const { reducer } = set;

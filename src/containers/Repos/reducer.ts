import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'libs/api';
import { IStoreRepos } from './types';
import {
  IApiParamsReposCreate,
  IApiResultReposCreate,
  IApiResultReposList,
  IApiParamsReposRemove,
  IApiResultReposRemove,
  IApiParamsReposList,
} from 'libs/api/repos/types';
import { DEFAULT_PAGE_OPTIONS } from 'src/constants/pager';
import { IApiPager } from 'libs/api/types';

type S = IStoreRepos;
type PA<T> = PayloadAction<T>;
const prefix = 'REPOS';

export const pureState: S = {
  create: {
    error: null,
    loading: false,
  },
  list: {
    initial: true,
    error: null,
    loading: false,
    items: [],
    pager: {
      page: 1,
      perPage: DEFAULT_PAGE_OPTIONS[0],
    },
    pagerOptions: DEFAULT_PAGE_OPTIONS,
  },
};

/** Sync logic */
const reducers = {
  resetState: (): S => {
    return pureState;
  },
  toggleEditModal: (state: S, action: PA<{ isOpened: boolean }>): S => {
    const { isOpened } = action.payload;
    return {
      ...state,
      isEditModalOpened: isOpened,
    };
  },
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
  changeSearch: (state: S, action: PA<Partial<{ search?: string }>>): S => {
    return {
      ...state,
      list: {
        ...state.list,
        loading: action.payload.search !== state.list.search,
        search: action.payload.search,
      },
    };
  },
};

/** Async logic */
const fetchListRepo = createAsyncThunk(
  `${prefix}/FETCH_LIST`,
  async (params?: IApiParamsReposList): Promise<IApiResultReposList> => {
    return await api.repos.list(params);
  },
);

const fetchCreateRepo = createAsyncThunk(
  `${prefix}/SUBMIT_REPO`,
  async (params: IApiParamsReposCreate): Promise<IApiResultReposCreate | null> => {
    const result = await api.repos.create(params);
    return result;
  },
);

const fetchRemoveRepos = createAsyncThunk(
  `${prefix}/REMOVE_REPOS`,
  async (params: IApiParamsReposRemove): Promise<IApiResultReposRemove> => {
    const result = await api.repos.remove(params);
    return result;
  },
);

/** Combine slice reducer asnd actions set */
const set = createSlice<S, typeof reducers, string>({
  initialState: pureState,
  name: prefix,
  reducers,
  extraReducers: (builder) => {
    builder.addCase(fetchCreateRepo.fulfilled, (state, action) => {
      if (action.payload === null) {
        return { ...state, create: { ...state.create, error: true, loading: false } };
      }
      return { ...state, error: null, loading: false };
    });

    builder.addCase(fetchListRepo.pending, (state) => {
      return {
        ...state,
        list: {
          ...state.list,
          error: null,
          loading: true,
        },
      };
    });

    builder.addCase(fetchListRepo.fulfilled, (state, action) => {
      return {
        ...state,
        list: {
          ...state.list,
          initial: false,
          error: null,
          loading: false,
          items: action.payload.items,
          pager: action.payload.pager,
        },
      };
    });
  },
});

export const actions = {
  ...set.actions,
  fetchCreateRepo,
  fetchListRepo,
  fetchRemoveRepos,
};

export const { reducer } = set;

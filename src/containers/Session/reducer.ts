import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'libs/api';
import { IStoreSession } from './types';
import {
  IApiResultAuthLogin,
  IApiParamsAuthLogin,
  IApiResultAuthLogout,
} from 'libs/api/auth/types';
import { MAIN_MENU_LINKS } from 'src/constants/mainMenu';

type S = IStoreSession;
type PA<T> = PayloadAction<T>;
const prefix = 'SESSION';

const pureState: IStoreSession = {
  isUserAuthorized: false,
  isAlreadyFetched: false,
  isSessionExpired: false,
  mainMenuLinks: [],
  errors: {
    loginForm: null,
  },
};

/** Sync logic */
const reducers = {
  setUserData: (state: S, action: PA<IApiResultAuthLogin>): S => {
    const { token, account } = action.payload;

    return {
      ...state,
      token,
      account,
      isUserAuthorized: Boolean(token),
    };
  },
  defineMenuLinks: (state: S): S => {
    const isAdmin = Boolean(state.account?.isAdmin);
    const mainMenuLinks = MAIN_MENU_LINKS.filter((item) => {
      return isAdmin || !item.isAdminOnly;
    });

    return {
      ...state,
      mainMenuLinks,
    };
  },
  setSessionExpired: (state: S, action: PA<{ isExpired: boolean }>): S => {
    if (state.isUserAuthorized) {
      return {
        ...state,
        isSessionExpired: action.payload.isExpired,
      };
    } else {
      return {
        ...state,
        token: undefined,
        isUserAuthorized: false,
      };
    }
  },
};

/** Async logic */
const fetchLoginUser = createAsyncThunk(
  `${prefix}/REQ_LOGIN`,
  async (params: IApiParamsAuthLogin): Promise<IApiResultAuthLogin> => {
    return await api.auth.login(params);
  },
);

const fetchMe = createAsyncThunk(
  `${prefix}/REQ_ME`,
  async (token?: string): Promise<IApiResultAuthLogin> => {
    return await api.auth.me(token);
  },
);

const fetchLogout = createAsyncThunk(
  `${prefix}/REQ_LOGOUT`,
  async (): Promise<IApiResultAuthLogout> => {
    return await api.auth.logout();
  },
);

/** Combine slice reducer asnd actions set */
const set = createSlice<S, typeof reducers, string>({
  initialState: pureState,
  name: prefix,
  reducers,
  extraReducers: (builder) => {
    [fetchLoginUser, fetchMe].forEach((trigger) => {
      builder.addCase(trigger.pending, (state) => {
        return {
          ...state,
          errors: {
            ...state.errors,
            loginForm: null,
          },
        };
      });

      builder.addCase(trigger.fulfilled, (state, action) => {
        const { token, account, hosts } = action.payload;
        const newState = {
          ...state,
          token,
          account,
          isUserAuthorized: Boolean(token),
          isSessionExpired: false,
          isAlreadyFetched: true,
        };

        if (hosts.private) {
          newState.privateHost = hosts.private;
        }

        if (hosts.public) {
          newState.publicHost = hosts.public;
        }

        return newState;
      });

      builder.addCase(trigger.rejected, (state, action) => {
        const { error } = action;
        if (error === undefined) {
          return state;
        }

        const parsedError = error.message?.includes('No jwt presents')
          ? {}
          : {
              loginForm:
                error.code === '500'
                  ? 'Server error. Please, try again.'
                  : 'Wrong login/password pair.',
            };

        return {
          ...pureState,
          isAlreadyFetched: true,
          errors: {
            ...state.errors,
            ...parsedError,
          },
        };
      });
    });

    builder.addCase(fetchLogout.fulfilled, (state) => {
      return {
        ...state,
        account: undefined,
        token: undefined,
        isUserAuthorized: false,
      };
    });
  },
});

export const actions = {
  ...set.actions,
  fetchLoginUser,
  fetchLogout,
  fetchMe,
};

export const { reducer } = set;

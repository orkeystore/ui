import { IApiServerError, IApiAccountData } from 'libs/api/types';

/**
 * Params interface for method api.auth.login();
 * Target endpoint - POST '{api}/auth/token';
 */
export interface IApiParamsAuthLogin {
  username: string;
  password: string;
}

/**
 * Response interface for method api.auth.login();
 * Target endpoint - POST '{api}/auth/token';
 */
export type IApiResultAuthLogin = {
  token: string;
  account: IApiAccountData;
  hosts: {
    private?: string;
    public?: string;
  };
};

/**
 * Server error interface for method api.auth.login();
 * Target endpoint - POST '{api}/auth/token';
 */
export type IApiErrorAuthLogin = IApiServerError;

/**
 * Params interface for method api.auth.logout();
 * Target endpoint - POST '{api}/auth/logout';
 */
export interface IApiParamsAuthLogout {}

/**
 * Response interface for method api.auth.logout();
 * Target endpoint - POST '{api}/auth/logout';
 */
export type IApiResultAuthLogout = Record<string, unknown>;

/**
 * Server error interface for method api.auth.logout();
 * Target endpoint - POST '{api}/auth/logout';
 */
export type IApiErrorAuthLogout = IApiServerError;

/**
 * Params interface for method api.auth.me();
 * Endpoint requires Authorization header;
 * Target endpoint - GET '{api}/auth/me';
 */
export interface IApiParamsAuthMe {}

/**
 * Response interface for method api.auth.me();
 * Target endpoint - GET '{api}/auth/me';
 */
export type IApiResultAuthMe = {
  account: IApiAccountData;
};

/**
 * Server error interface for method api.auth.me();
 * Target endpoint - GET '{api}/auth/me';
 */
export type IApiErrorAuthMe = IApiServerError;

/**
 * Params interface for method api.auth.account();
 * Endpoint requires Authorization header;
 * Target endpoint - GET '{api}/auth/account';
 */
export interface IApiParamsAuthAccount {
  login: string;
  password: string;
  isAdmin: boolean;
}

/**
 * Response interface for method api.auth.account();
 * Target endpoint - GET '{api}/auth/account';
 */
export type IApiResultAuthAccount = {
  account: IApiAccountData;
};

/**
 * Server error interface for method api.auth.account();
 * Target endpoint - GET '{api}/auth/account';
 */
export type IApiErrorAuthAccount = IApiServerError;

/**
 * Params interface for method api.auth.account();
 * Endpoint requires Authorization header;
 * Target endpoint - GET '{api}/auth/account';
 */
export interface IApiParamsAuthAccounts {}

/**
 * Response interface for method api.auth.account();
 * Target endpoint - GET '{api}/auth/account';
 */
export type IApiResultAuthAccounts = {
  accounts: IApiAccountData[];
};

/**
 * Server error interface for method api.auth.account();
 * Target endpoint - GET '{api}/auth/account';
 */
export type IApiErrorAuthAccounts = IApiServerError;

/**
 * Params interface for method api.auth.account();
 * Endpoint requires Authorization header;
 * Target endpoint - GET '{api}/auth/account';
 */
export interface IApiParamsAuthRemove {
  ids: number[];
}

/**
 * Response interface for method api.auth.account();
 * Target endpoint - GET '{api}/auth/account';
 */
export type IApiResultAuthRemove = {
  deleted: number[];
};

/**
 * Server error interface for method api.auth.account();
 * Target endpoint - GET '{api}/auth/account';
 */
export type IApiErrorAuthRemove = IApiServerError;

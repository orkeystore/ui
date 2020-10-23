import { IApiPager, IApiRepoData, IApiServerError } from "../types";

/**
 * Params interface for method api.repos.create();
 * Endpoint requires Authorization header;
 * Target endpoint - POST '{api}/repos/create';
 */
export interface IApiParamsReposCreate {
  name: string;
  description: string;
  code: string;
  accessToken: string;
  keys: string[];
}

/**
 * Response interface for method api.repos.create();
 * Target endpoint - POST '{api}/repos/create';
 */
export type IApiResultReposCreate = {
  created: IApiRepoData;
};

/**
 * Server error interface for method api.repos.create();
 * Target endpoint - POST '{api}/repos/create';
 */
export type IApiErrorReposCreate = IApiServerError;

/**
 * Params interface for method api.repos.list();
 * Endpoint requires Authorization header;
 * Target endpoint - GET '{api}/repos/list';
 */
export interface IApiParamsReposList {
}

/**
 * Response interface for method api.repos.list();
 * Target endpoint - GET '{api}/repos/list';
 */
export type IApiResultReposList = {
  items: IApiRepoData[];
  pager: IApiPager;
};

/**
 * Server error interface for method api.repos.list();
 * Target endpoint - GET '{api}/repos/list';
 */
export type IApiErrorReposList = IApiServerError;

/**
 * Params interface for method api.repos.remove();
 * Endpoint requires Authorization header;
 * Target endpoint - DELETE '{api}/repos/remove';
 */
export interface IApiParamsReposRemove {
}

/**
 * Response interface for method api.repos.remove();
 * Target endpoint - DELETE '{api}/repos/remove';
 */
export type IApiResultReposRemove = {
  deleted: number[];
};

/**
 * Server error interface for method api.repos.remove();
 * Target endpoint - DELETE '{api}/repos/remove';
 */
export type IApiErrorReposRemove = IApiServerError;

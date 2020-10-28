import { IApiPager, IApiRepoData } from 'libs/api/types';

export interface IStoreRepos {
  create: {
    error: string | null | boolean;
    loading: boolean;
  };
  isEditModalOpened?: boolean;
  list: {
    initial: boolean;
    error: string | null | boolean;
    loading: boolean;
    items: IApiRepoData[];
    pager: IApiPager;
    pagerOptions: number[];
    search?: string;
  };
}

export interface IRouteQueryRepos {
  page?: number;
  perPage?: number;
  search?: string;
  editRepoModal?: '1';
}

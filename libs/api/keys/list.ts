import qs from 'qs';
import fetcher from 'libs/utils/fetch';
import { IApiKeyEntry, IApiPager } from '../types';

export interface IApiParamsKeysList {
  page?: number;
  perPage?: number;
  search?: string;
  isArchived?: boolean;
}

export interface IApiResultKeysList {
  items: IApiKeyEntry[];
  pager: IApiPager;
}

const fetchApiKeysList = async (params: IApiParamsKeysList = {}): Promise<IApiResultKeysList> => {
  const { page, perPage, search, isArchived } = params;
  const query = qs.stringify({ page, perPage, search, archived: isArchived ? 1 : 0 }, { addQueryPrefix: true });

  const result = await fetcher.fetchJson<IApiResultKeysList>(
    `{api}/entry/list${query}`,
    {
      method: 'GET',
    }
  );

  return result;
};

export default fetchApiKeysList;

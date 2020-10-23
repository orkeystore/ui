import qs from 'qs';
import fetcher from 'libs/utils/fetch';
import { IApiPager, IApiStorageItem } from 'libs/api/types';

export interface IApiParamsKeysStorage {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface IApiResultKeysStorage {
  items: IApiStorageItem[];
  pager: IApiPager;
}

const fetchApiKeysStorage = async (params: IApiParamsKeysStorage): Promise<IApiResultKeysStorage> => {
  const query = qs.stringify(params, { addQueryPrefix: true });
  return await fetcher.fetchJson<IApiResultKeysStorage>(`{api}/key/storage${query}`, {
    method: 'GET',
  });
};

export default fetchApiKeysStorage;

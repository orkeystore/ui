import qs from 'qs';
import fetcher from 'libs/utils/fetch';
import { IApiKeyEntry } from '../types';

export interface IApiParamsKeysByIds {
  ids: number[];
}

export interface IApiResultKeysByIds {
  items: IApiKeyEntry[];
}

const fetchApiKeysByIds = async (params: IApiParamsKeysByIds): Promise<IApiResultKeysByIds> => {
  const { ids } = params;
  const query = qs.stringify({ ids }, { addQueryPrefix: true });

  const result = await fetcher.fetchJson<IApiResultKeysByIds>(`{api}/entry/byIds${query}`, {
    method: 'GET',
  });

  return result;
};

export default fetchApiKeysByIds;

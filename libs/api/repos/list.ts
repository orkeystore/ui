import qs from 'qs';
import fetcher from 'libs/utils/fetch';
import { IApiResultReposList } from './types';

export interface IApiParamsReposList {
  page?: number;
  perPage?: number;
  search?: string;
}
export const list = async (params: IApiParamsReposList = {}): Promise<IApiResultReposList> => {
  const query = qs.stringify(params, { addQueryPrefix: true });
  const result = await fetcher.fetchJson<IApiResultReposList>(`{api}/repo/list${query}`);
  return result;
};

import fetcher from 'libs/utils/fetch';
import { IApiParamsReposCreate, IApiResultReposCreate } from './types';

export const create = async (
  params: IApiParamsReposCreate,
): Promise<IApiResultReposCreate | null> => {
  const result = await fetcher.fetchJson<IApiResultReposCreate['created']>('{api}/repo/create', {
    method: 'POST',
    body: JSON.stringify(params),
  });

  return result ? { created: result } : null;
};

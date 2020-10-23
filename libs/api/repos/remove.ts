import fetcher from 'libs/utils/fetch';
import { IApiParamsReposRemove, IApiResultReposRemove } from './types';

export const remove = async (params: IApiParamsReposRemove): Promise<IApiResultReposRemove> => {
  const result = await fetcher.fetchJson<IApiResultReposRemove['deleted']>('{api}/repo/remove', {
    method: 'DELETE',
    body: JSON.stringify(params),
  });

  return { deleted: result ? result : [] };
};

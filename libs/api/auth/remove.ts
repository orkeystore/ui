import fetcher from 'libs/utils/fetch';
import { IApiResultAuthRemove, IApiParamsAuthRemove } from './types';

const fetchApiAuthRemove = async (params: IApiParamsAuthRemove): Promise<IApiResultAuthRemove | null> => {
  const result = await fetcher.fetchJson<IApiResultAuthRemove['deleted']>(
    '{api}/auth/accounts',
    {
      method: 'DELETE',
      body: JSON.stringify(params),
    }
  );

  return result ? { deleted: result } : null;
};

export default fetchApiAuthRemove;

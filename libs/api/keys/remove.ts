import fetcher from 'libs/utils/fetch';
import { IApiParamsKeysRemove, IApiResultKeysRemove } from './types';

const fetchApiKeysRemove = async (params: IApiParamsKeysRemove): Promise<IApiResultKeysRemove> => {
  const result = await fetcher.fetchJson<IApiResultKeysRemove['deleted']>(
    `{api}/entry/${params.id.toString()}`,
    {
      method: 'DELETE',
    }
  );

  return { deleted: result };
};

export default fetchApiKeysRemove;

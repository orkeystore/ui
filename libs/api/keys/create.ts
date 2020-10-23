import fetcher from 'libs/utils/fetch';
import { IApiResultKeysCreate, IApiParamsKeysCreate } from './types';

const fetchApiKeysCreate = async (params: IApiParamsKeysCreate): Promise<IApiResultKeysCreate> => {
  const result = await fetcher.fetchJson<IApiResultKeysCreate['key']>(
    '{api}/entry/create',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }
  );

  return { key: result };
};

export default fetchApiKeysCreate;
